import { createContext, useContext, useEffect, useRef, useState } from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Prevent outdated verification requests from changing auth state
  const adminCheckId = useRef(0);
  const authEventVersion = useRef(0);

  // Verify Admin Permission
  const checkAdmin = async (userId) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      return Boolean(data);
    } catch (error) {
      console.error("Admin verification error:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial Authentication
    const initializeAuth = async () => {
      const initialVersion = authEventVersion.current;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        // Ignore outdated initialization results
        if (!mounted || authEventVersion.current !== initialVersion) {
          return;
        }

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          const checkId = ++adminCheckId.current;

          const authorized = await checkAdmin(currentUser.id);

          if (
            mounted &&
            checkId === adminCheckId.current &&
            authEventVersion.current === initialVersion
          ) {
            setIsAdmin(authorized);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted && authEventVersion.current === initialVersion) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted && authEventVersion.current === initialVersion) {
          setLoading(false);
        }
      }
    };

    // Listen To Authentication Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      // Initial session is handled by initializeAuth
      if (event === "INITIAL_SESSION") return;

      const currentUser = session?.user ?? null;

      // Token refresh does not require admin re-verification
      // and must not interrupt the dashboard.
      if (event === "TOKEN_REFRESHED") {
        setUser(currentUser);
        return;
      }

      // A real authentication change occurred
      authEventVersion.current += 1;

      setUser(currentUser);

      if (!currentUser) {
        adminCheckId.current += 1;

        setIsAdmin(false);
        setLoading(false);

        return;
      }

      const checkId = ++adminCheckId.current;

      // Run the Supabase query after the auth callback finishes
      setTimeout(async () => {
        if (!mounted || checkId !== adminCheckId.current) return;

        const authorized = await checkAdmin(currentUser.id);

        if (!mounted || checkId !== adminCheckId.current) return;

        setIsAdmin(authorized);
        setLoading(false);
      }, 0);
    });

    initializeAuth();

    return () => {
      mounted = false;
      adminCheckId.current += 1;
      subscription.unsubscribe();
    };
  }, []);

  // Login
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
    setLoading(false);

    return data.user;
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    adminCheckId.current += 1;

    setUser(null);
    setIsAdmin(false);
    setLoading(false);
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
