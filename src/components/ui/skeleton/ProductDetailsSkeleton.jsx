import Skeleton from "./Skeleton";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductDetailsSkeleton() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10"
      dir="rtl"
      aria-label="جاري تحميل تفاصيل المنتج"
      aria-busy="true"
    >
      {/* Breadcrumbs */}
      <div aria-hidden="true" className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3.5 w-28" />
      </div>

      {/* Product Overview */}
      <section className="mt-6 grid items-start gap-8 md:mt-10 md:grid-cols-2 md:gap-12">
        {/* Product Gallery */}
        <div
          aria-hidden="true"
          className="grid grid-cols-1 items-start gap-3 md:grid-cols-[76px_minmax(0,1fr)] md:gap-4"
          dir="rtl"
        >
          {/* Thumbnails */}
          <div className="order-2 flex gap-2 overflow-hidden pb-1 md:order-1 md:flex-col md:gap-3 md:overflow-visible md:pb-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="size-19 shrink-0 rounded-xl" />
            ))}
          </div>

          {/* Main Image */}
          <Skeleton className="order-1 aspect-square w-full rounded-2xl" />
        </div>

        {/* Product Information */}
        <div
          aria-hidden="true"
          className="flex min-w-0 flex-col gap-5"
          dir="rtl"
        >
          {/* Category + Name */}
          <div>
            <Skeleton className="h-4 w-24" />

            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-[85%]" />
              <Skeleton className="h-8 w-[55%]" />
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          {/* Features */}
          <section>
            <Skeleton className="mb-4 h-5 w-32" />

            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-5 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </section>

          {/* Quantity + Cart + Wishlist */}
          <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <Skeleton className="h-12 w-28 rounded-full" />
            <Skeleton className="h-12 min-w-0 rounded-full" />
            <Skeleton className="size-12 rounded-full" />
          </div>

          {/* Accordions */}
          <div className="mt-1 space-y-0 border-t border-border">
            <div className="flex items-center justify-between border-b border-border py-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="size-5 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-border py-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="size-5 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-16">
        <div aria-hidden="true" className="mb-6 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>

        <ProductGridSkeleton count={4} />
      </section>
    </main>
  );
}
