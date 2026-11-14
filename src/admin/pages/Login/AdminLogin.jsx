import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { getSettings } from "../../../services/settingsService";

export default function AdminLogin() {
  const navigate = useNavigate();

  const { login, user, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [storeName, setStoreName] = useState("");
  const [favicon, setFavicon] = useState("");
  const [storeLoading, setStoreLoading] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // جلب اسم المتجر وأيقونة الموقع من Supabase
  useEffect(() => {
    let isMounted = true;

    const fetchStoreSettings = async () => {
      try {
        const settings = await getSettings();

        if (isMounted) {
          setStoreName(settings.store.name);
          setFavicon(settings.store.favicon);
        }
      } catch (err) {
        console.error("Fetch store settings error:", err);
      } finally {
        if (isMounted) {
          setStoreLoading(false);
        }
      }
    };

    fetchStoreSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffafb]">
        <div className="w-9 h-9 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : err.message || "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#fffafb] flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {favicon && (
            <img
              src={favicon}
              alt="Store Logo"
              className="w-19 h-19 object-contain shrink-0"
            />
          )}

          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {storeLoading ? "..." : storeName || "تعذر تحميل الاسم"}
            </h1>

            <p className="text-sm text-slate-500 mt-1">لوحة التحكم والإدارة</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              تسجيل دخول المدير
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              أدخل بيانات حسابك للوصول إلى لوحة التحكم.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  autoComplete="username"
                  required
                  disabled={submitting}
                  className="w-full h-12 pr-10 pl-4 rounded-xl border border-slate-200 bg-white text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                  className="w-full h-12 pr-10 pl-12 rounded-xl border border-slate-200 bg-white text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowLeft size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              هذه الصفحة مخصصة لمديري المتجر فقط.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Sadeem. All rights reserved.
        </p>
      </div>
    </div>
  );
}
