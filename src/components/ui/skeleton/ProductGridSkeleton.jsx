import Skeleton from "./Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGridSkeleton({ count = 8, showHeader = false }) {
  return (
    <section aria-label="جاري تحميل المنتجات" aria-busy="true">
      {showHeader && (
        <div className="mb-6 space-y-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      )}

      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
