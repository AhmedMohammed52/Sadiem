import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return false;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Admin verification error:", error);
      setIsAdmin(false);
      return false;
    }

    const authorized = Boolean(data);

    setIsAdmin(authorized);

    return authorized;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          await checkAdmin(currentUser.id);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "INITIAL_SESSION") return;

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Delay the Supabase query until the auth callback completes.
      setTimeout(async () => {
        if (!mounted) return;

        await checkAdmin(currentUser.id);

        if (mounted) {
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const authorized = await checkAdmin(data.user.id);

    if (!authorized) {
      await supabase.auth.signOut();

      throw new Error("هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم.");
    }

    setUser(data.user);
    setIsAdmin(true);

    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
