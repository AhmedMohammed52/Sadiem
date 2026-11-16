import Skeleton from "../../components/common/Skelton/Skeleton";

// هيكل الحقول
function FieldSkeleton() {
  return (
    <div className="min-w-0 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

// هيكل كارت الإعدادات
function CardSkeleton({ fields, titleWidth = "w-40" }) {
  return (
    <div className="rounded-xl border border-[#E9EBF0] bg-white p-4 sm:p-5">
      <div className="mb-5 space-y-2">
        <Skeleton className={`h-4 ${titleWidth}`} />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, index) => (
          <FieldSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function SettingsContentSkeleton() {
  return (
    <div
      className="min-w-0 space-y-4"
      aria-busy="true"
      aria-label="جارٍ تحميل الإعدادات"
    >
      {/* المعلومات الأساسية */}
      <CardSkeleton fields={6} titleWidth="w-36" />

      {/* معاينة هوية المتجر */}
      <div className="rounded-xl border border-[#E9EBF0] bg-white p-4 sm:p-5">
        <div className="mb-5 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E9EBF0] bg-[#FAFAFC] p-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-40 max-w-full" />
          </div>

          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
