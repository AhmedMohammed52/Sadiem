import { useEffect, useState } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.",
  confirmText = "حذف",
  cancelText = "إلغاء",
  isLoading = false,
  showCancel = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timeout;

    if (isOpen) {
      setIsMounted(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);

      timeout = setTimeout(() => {
        setIsMounted(false);
      }, 250);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMounted, isLoading, onClose]);

  if (!isMounted) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose?.();
        }
      }}
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px] transition-opacity duration-250 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        dir="rtl"
        className={`w-full max-w-100 rounded-2xl bg-white p-7 shadow-2xl transition-all duration-250 ease-out ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.97] opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2
            id="confirmation-title"
            className="text-base font-bold text-[#22252D]"
          >
            {title}
          </h2>

          <p
            id="confirmation-description"
            className="mx-auto mt-2 max-w-77.5 text-sm leading-6 text-[#8A8F9C]"
          >
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <LoaderCircle size={16} className="animate-spin" />}
            {isLoading ? "جاري الحذف..." : confirmText}
          </button>

          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="h-11 flex-1 rounded-xl border border-[#E9EBF0] bg-white text-sm font-medium text-[#555B68] transition hover:bg-gray-50 disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
