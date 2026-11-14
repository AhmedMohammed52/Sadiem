import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  Check,
} from "lucide-react";

const CATEGORY_NAMES = {
  perfumes: "العطور",
  body: "العناية بالجسم",
  skincare: "العناية بالبشرة",
  hair: "العناية بالشعر",
};

function ProductAccordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between py-4 text-right font-semibold text-ink transition hover:text-ink/70"
      >
        <span>{title}</span>

        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-sm leading-8 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductInfo({
  product,
  onAddToCart,
  onToggleWishlist,
  isFavorite = false,
}) {
  const [quantity, setQuantity] = useState(1);

  const categoryName =
    CATEGORY_NAMES[product.category] ||
    product.categoryName ||
    product.category;

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-US");

  const hasDiscount =
    product.discount > 0 &&
    product.oldPrice &&
    product.oldPrice > product.price;

  const stock = Number(product.stock || 0);
  const isOutOfStock = stock <= 0;

  useEffect(() => {
    setQuantity(1);
  }, [product.id]);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="flex min-w-0 flex-col gap-5" dir="rtl">
      <div>
        <p className="text-sm text-muted-foreground">{categoryName}</p>

        <h1 className="font-display mt-2 text-2xl font-semibold leading-relaxed text-ink md:text-3xl">
          {product.name}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl font-bold text-ink md:text-[28px]">
          {formatPrice(product.price)} ج.م
        </span>

        {product.oldPrice > product.price && (
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.oldPrice)} ج.م
          </span>
        )}

        {hasDiscount && (
          <span className="rounded-full bg-blush px-3 py-1 text-xs font-bold text-ink">
            خصم {product.discount}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full ${
            isOutOfStock ? "bg-muted-foreground" : "bg-green-600"
          }`}
        />

        <span
          className={`text-sm font-semibold ${
            isOutOfStock ? "text-muted-foreground" : "text-green-700"
          }`}
        >
          {isOutOfStock ? "غير متوفر حاليًا" : "متوفر"}
        </span>
      </div>

      {product.description && (
        <p className="text-sm leading-8 text-muted-foreground md:text-base">
          {product.description}
        </p>
      )}

      {product.features?.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">مميزات المنتج</h2>

          <ul className="grid gap-2 sm:grid-cols-2">
            {product.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blush">
                  <Check className="size-3 text-ink" />
                </span>

                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <div className="inline-flex h-12 items-center rounded-full border border-border">
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={isOutOfStock || quantity >= stock}
            aria-label="زيادة الكمية"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>

          <span className="w-5 text-center text-sm font-bold tabular-nums">
            {quantity}
          </span>

          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="تقليل الكمية"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product, quantity)}
          className="flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-2 text-sm font-semibold text-ink-foreground transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 md:text-base"
        >
          <ShoppingBag className="size-4 shrink-0" />
          <span className="truncate">
            {isOutOfStock ? "غير متوفر" : "أضيفي للسلة"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onToggleWishlist?.(product)}
          aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          aria-pressed={isFavorite}
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-border transition hover:border-ink hover:bg-accent"
        >
          <Heart
            className={`size-5 transition-colors ${
              isFavorite ? "fill-pink-500 text-pink-500" : "text-ink"
            }`}
          />
        </button>
      </div>

      {(product.details?.length > 0 || product.ingredients?.length > 0) && (
        <section className="mt-1">
          {product.details?.length > 0 && (
            <ProductAccordion title="تفاصيل المنتج" defaultOpen={true}>
              <dl className="divide-y divide-border">
                {product.details.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <dt>{item.label}</dt>
                    <dd className="font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </ProductAccordion>
          )}

          {product.ingredients?.length > 0 && (
            <ProductAccordion title="المكونات">
              <ul className="list-inside list-disc space-y-1">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </ProductAccordion>
          )}
        </section>
      )}
    </div>
  );
}
