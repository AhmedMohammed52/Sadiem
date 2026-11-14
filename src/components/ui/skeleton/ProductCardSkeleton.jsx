import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <article aria-hidden="true" className="flex h-full flex-col">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-md">
        <Skeleton className="aspect-4/5 w-full rounded-md" />

        {/* Discount Badge */}
        <Skeleton className="absolute top-2 right-2 h-6 w-16 rounded-full" />

        {/* Wishlist Button */}
        <Skeleton className="absolute top-2 left-2 size-10 rounded-full" />
      </div>

      {/* Product Information */}
      <div className="mt-2 flex flex-1 flex-col gap-2">
        {/* Product Name */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[55%]" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Add To Cart */}
        <Skeleton className="mt-auto h-11 w-full rounded-full" />
      </div>
    </article>
  );
}
