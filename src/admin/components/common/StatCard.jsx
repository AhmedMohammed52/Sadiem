export default function StatCard({ title, value, icon: Icon, color, suffix }) {
  return (
    <div
      dir="rtl"
      className="
        flex min-w-0 items-center gap-3
        rounded-xl border border-[#E9EBF0] bg-white
        p-3 sm:gap-4 sm:p-4
        transition-shadow duration-200
        hover:shadow-sm
      "
    >
      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl sm:h-11 sm:w-11
          ${color}
        `}
      >
        <Icon size={20} strokeWidth={1.9} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] font-medium leading-5 text-[#777D8A] sm:text-[13px]">
          {title}
        </p>

        <h3 className="text-xl font-bold leading-tight text-[#22252D] sm:text-2xl">
          {value}
          {suffix && (
            <span className="mr-1 text-sm font-medium text-[#9CA3AF]">
              {suffix}
            </span>
          )}
        </h3>
      </div>
    </div>
  );
}
