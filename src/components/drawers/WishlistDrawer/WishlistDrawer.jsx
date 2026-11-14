import { X } from "lucide-react";
import WishlistItem from "./WishlistItem";
import WishlistEmpty from "./WishlistEmpty";

import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";

export default function WishlistDrawer({ isOpen, onClose }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
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
        aria-label="المفضلة"
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-y-0 right-0 flex w-full max-w-105 flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-display text-xl">المفضلة</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {wishlist.length} منتجات
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

        {/* Products */}
        <div className="flex-1 overflow-y-auto">
          {wishlist.length === 0 ? (
            <WishlistEmpty />
          ) : (
            <ul className="divide-y">
              {wishlist.map((item) => (
                <WishlistItem
                  key={item.id}
                  {...item}
                  onAddToCart={() => {
                    addToCart(item);

                    showToast("تمت الإضافة للشنطة", item.name, "cart");
                  }}
                  onDelete={() => {
                    removeFromWishlist(item.id);

                    showToast("تمت الإزالة من المفضلة", item.name, "remove");
                  }}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Clear Wishlist */}
        {wishlist.length > 0 && (
          <div className="border-t p-4">
            <button
              type="button"
              onClick={clearWishlist}
              className="w-full rounded-full border border-ink py-3 text-sm font-semibold transition hover:bg-ink hover:text-white cursor-pointer"
            >
              مسح المفضلة بالكامل
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
