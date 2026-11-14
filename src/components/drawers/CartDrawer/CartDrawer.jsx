import { X } from "lucide-react";
import CartItem from "./CartItem";
import CartEmpty from "./CartEmpty";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const { showToast } = useToast();

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto bg-black/40 backdrop-blur-xs opacity-100"
          : "pointer-events-none bg-black/0 opacity-0"
      }`}
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="شنطة التسوق"
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-y-0 right-0 flex w-full max-w-105 flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-display text-xl">شنطة التسوق</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {cartCount} قطع
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid size-10 place-items-center rounded-full hover:bg-muted cursor-pointer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* Cart Products */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <CartEmpty />
          ) : (
            <ul className="divide-y">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                  onDelete={() => {
                    removeFromCart(item.id);

                    showToast("تمت الإزالة من الشنطة", item.name, "remove");
                  }}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <footer className="border-t p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-base font-semibold">
                <span>المجموع</span>
                <span>{cartTotal.toLocaleString("en-US")} ج.م</span>
              </div>

              <p className="text-xs text-muted-foreground">
                يتم تأكيد التوصيل وتكلفته عبر واتساب.
              </p>

              <a
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors hover:bg-primary/90 px-4 py-2 h-12 w-full rounded-full bg-ink font-semibold text-ink-foreground"
              >
                إتمام الطلب
              </a>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
