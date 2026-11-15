import StatsGrid from "../StatsGrid";
import Skeleton from "./Skeleton";

export default function StatsSkeleton({ columns = 4 }) {
  return (
    <StatsGrid columns={columns}>
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          dir="rtl"
          className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E9EBF0] bg-white p-3 sm:gap-4 sm:p-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl sm:h-11 sm:w-11" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-24 max-w-full" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </StatsGrid>
  );
}
