import { createContext, useContext, useEffect, useState } from "react";

import { Check, Heart, ShoppingBag, Trash2 } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = "success") => {
    setToast({
      title,
      message,
      type,
      id: Date.now() + Math.random(),
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  const icons = {
    favorite: Heart,
    cart: ShoppingBag,
    remove: Trash2,
    success: Check,
  };

  const Icon = toast ? icons[toast.type] || Check : Check;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-8 z-100 mx-auto w-[calc(100%-32px)] max-w-85 animate-toast-in"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#f3dce5] bg-[#fff7fa] px-4 py-3.5 shadow-[0_8px_30px_rgba(190,90,130,0.13)]">
            <div className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-pink-200/30 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-pink-100 bg-white text-[#c56b91] shadow-sm">
                <Icon
                  className={`size-4.5 ${
                    toast.type === "favorite"
                      ? "fill-pink-400 text-pink-500"
                      : ""
                  }`}
                />
              </div>

              {/* الرسالة */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#3d3036]">
                  {toast.title}
                </p>

                <p className="mt-1 truncate text-xs text-[#927d87]">
                  {toast.message}
                </p>
              </div>

              <Check className="size-4.5 shrink-0 text-[#78a88a]" />
            </div>

            {/* شريط مدة الظهور */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl bg-[#f6e4eb]">
              <div className="h-full w-full origin-right rounded-full bg-[#d98aaa] animate-toast-progress" />
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
