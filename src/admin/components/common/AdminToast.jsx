import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    background: "bg-emerald-50",
    border: "border-emerald-100",
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
    background: "bg-red-50",
    border: "border-red-100",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    background: "bg-amber-50",
    border: "border-amber-100",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    background: "bg-blue-50",
    border: "border-blue-100",
  },
};

function AdminToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`
        pointer-events-auto
        flex items-start gap-3
        w-full sm:w-90
        p-4
        bg-white
        border border-slate-100
        rounded-xl
        shadow-lg
        animate-[toastSlideIn_0.25s_ease-out]
      `}
    >
      <div
        className={`
          shrink-0 w-10 h-10
          flex items-center justify-center
          rounded-lg
          ${config.background}
        `}
      >
        <Icon size={21} className={config.color} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-semibold text-slate-800">{toast.title}</h4>

        {toast.message && (
          <p className="text-xs text-slate-500 mt-1 leading-6">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="إغلاق الإشعار"
        className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default function AdminToast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="
        fixed top-4 left-4 z-9999
        flex flex-col gap-3
        w-[calc(100%-2rem)] sm:w-auto
        pointer-events-none
      "
    >
      {toasts.map((toast) => (
        <AdminToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
