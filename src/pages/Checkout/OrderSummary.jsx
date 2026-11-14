import { Banknote, MessageCircle, Trash2, AlertCircle } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

export default function OrderSummary({
  cartItems,
  subtotal,
  onUpdateQuantity,
  onRemove,
  hasUnavailableItems,
  isSubmitting = false,
}) {
  return (
    <section
      aria-labelledby="summary-heading"
      className="min-w-0 border-t border-border pt-6 lg:border-t-0 lg:pt-0"
    >
      <h2 id="summary-heading" className="font-display text-xl font-bold">
        ملخص الطلب
      </h2>

      {/* قائمة المنتجات */}
      <ul className="mt-3 divide-y divide-border">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 py-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="aspect-4/5 w-16 rounded-md bg-muted object-cover"
            />

            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <a
                  href={`/product/${item.slug}`}
                  className="block text-sm font-semibold leading-6 hover:underline"
                >
                  {item.name}
                </a>

                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`حذف ${item.name} من الشنطة`}
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                سعر القطعة: {item.price.toLocaleString("ar-EG")} ج.م
              </p>

              {item.isOutOfStock && (
                <p className="mt-1 text-xs font-medium text-destructive">
                  المنتج غير متوفر حاليًا
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => onUpdateQuantity(item.id, 1)}
                  onDecrease={() => onUpdateQuantity(item.id, -1)}
                />

                <span className="text-sm font-bold text-ink">
                  {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* الإجمالي والشحن */}
      <div className="mt-3 border-y border-border py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 font-semibold">
          <span className="min-w-0 text-sm">إجمالي المنتجات قبل الشحن</span>

          <span className="whitespace-nowrap">
            {subtotal.toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          تكلفة الشحن: يتم تحديدها عبر واتساب
        </p>
      </div>

      {/* طريقة الدفع */}
      <div className="flex items-center gap-3 py-5">
        <Banknote className="size-6 shrink-0 text-blush-deep" />

        <div>
          <h3 className="text-sm font-semibold">طريقة الدفع</h3>

          <p className="mt-1 text-sm">الدفع عند الاستلام</p>
        </div>
      </div>

      {/* حالة المنتجات */}
      {hasUnavailableItems && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

          <p className="text-sm leading-6 text-destructive">
            يوجد منتج غير متوفر في الشنطة. احذفيه أولًا للمتابعة.
          </p>
        </div>
      )}

      {/* زر التأكيد */}
      <button
        type="submit"
        disabled={hasUnavailableItems || isSubmitting}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 py-2 h-12 w-full rounded-full bg-ink px-2 text-sm font-semibold text-ink-foreground sm:text-base"
      >
        <MessageCircle className="size-5" />
        {isSubmitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب عبر واتساب"}
      </button>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        يكتمل تأكيد الطلب مع المتجر عبر واتساب، ويتم الاتفاق على تكلفة الشحن
        هناك.
      </p>
    </section>
  );
}
