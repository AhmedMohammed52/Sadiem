import { Heart, ShoppingBag } from "lucide-react";

import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isFavorite = isInWishlist(product.id);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-md bg-muted">
        <Link aria-label={product.name} to={`/products/${product.slug}`}>
          <img
            alt={product.name}
            loading="lazy"
            width={768}
            height={960}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 md:group-hover:scale-105"
            src={product.image}
          />
        </Link>

        {product.discount > 0 && (
          <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold text-ink">
            خصم {product.discount}%
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product);

            showToast(
              isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
              product.name,
              isFavorite ? "remove" : "favorite",
            );
          }}
          aria-label={
            isFavorite
              ? `حذف ${product.name} من المفضلة`
              : `إضافة ${product.name} للمفضلة`
          }
          aria-pressed={isFavorite}
          className="absolute top-2 left-2 grid size-10 place-items-center rounded-full bg-background/90 transition hover:bg-background cursor-pointer"
        >
          <Heart
            className={`size-4.5 transition-colors ${
              isFavorite ? "fill-pink-500 text-pink-500" : "text-foreground"
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-2">
        <Link
          aria-label={product.name}
          to={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug md:text-base"
        >
          {product.name}
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="whitespace-nowrap font-bold text-ink text-sm md:text-base">
            {product.price.toLocaleString("en-US")} ج.م
          </span>

          {product.oldPrice > 0 && (
            <span className="whitespace-nowrap text-muted-foreground line-through text-xs">
              {product.oldPrice.toLocaleString("en-US")} ج.م
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            addToCart(product);
            showToast("تمت الإضافة للشنطة", product.name, "cart");
          }}
          className="mt-auto flex h-11 items-center justify-center gap-2 rounded-full border border-ink bg-background px-2 text-xs font-semibold transition hover:bg-ink hover:text-ink-foreground md:text-sm cursor-pointer"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          أضيفي للسلة
        </button>
      </div>
    </article>
  );
}
