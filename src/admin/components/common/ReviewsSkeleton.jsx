import Skeleton from "./Skeleton";

function ReviewSkeletonCard() {
  return (
    <div
      dir="rtl"
      className="rounded-xl border border-[#E9EBF0] bg-white p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28 max-w-full" />
            <Skeleton className="h-3 w-20 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>

      <div className="mt-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-4 rounded-sm" />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4 max-w-full" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#F0F1F5] pt-4">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <ReviewSkeletonCard key={index} />
      ))}
    </div>
  );
}
