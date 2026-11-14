import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />

          <p className="text-sm text-slate-500">
            جاري التحقق من صلاحية الدخول...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
