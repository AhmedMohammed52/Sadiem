import Skeleton from "../../components/common/Skelton/Skeleton";

export default function LowStockSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 border-b border-[#F0F1F5] pb-4 last:border-0 last:pb-0"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-32 max-w-full" />
            <Skeleton className="h-2.5 w-20" />
          </div>

          <Skeleton className="h-7 w-16 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
