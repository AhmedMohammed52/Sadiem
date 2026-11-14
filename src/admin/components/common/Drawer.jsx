import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function BaseDrawer({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  width = "max-w-xl",
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let openFrame;
    let closeTimer;

    if (isOpen) {
      setMounted(true);

      openFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);

      closeTimer = setTimeout(() => {
        setMounted(false);
      }, 350);
    }

    return () => {
      cancelAnimationFrame(openFrame);
      clearTimeout(closeTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div dir="rtl" className="fixed inset-0 z-9999">
      {/* Overlay */}
      <button
        type="button"
        aria-label="إغلاق النافذة"
        tabIndex={visible ? 0 : -1}
        onClick={onClose}
        className={`
          absolute inset-0 w-full h-full
          bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          absolute right-0 top-0
          flex h-full w-full ${width}
          flex-col overflow-hidden
          bg-white shadow-2xl
          transition-transform duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          will-change-transform
          ${visible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E9EBF0] bg-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4059E8]/10 text-[#4059E8]">
                <Icon size={20} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#171923]">{title}</h2>

              {description && (
                <p className="mt-1 text-xs text-[#858B98]">{description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#858B98] transition-colors duration-200 hover:bg-[#F3F4F6] hover:text-[#171923]"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-[#E9EBF0] bg-white px-5 py-4">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
