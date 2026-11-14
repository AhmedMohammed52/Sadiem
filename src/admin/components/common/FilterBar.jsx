import { Search, RotateCcw, X } from "lucide-react";

export function FilterBar({ children, onReset, hasFilters = false }) {
  return (
    <div className="rounded-xl border border-[#E9EBF0] bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {children}
        </div>

        {onReset && hasFilters && (
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onReset}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E9EBF0] px-3 text-sm font-medium text-[#777D8A] transition hover:border-[#4059E8] hover:bg-[#4059E8]/5 hover:text-[#4059E8]"
            >
              <RotateCcw size={15} />
              مسح الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterSearch({ value, onChange, placeholder = "ابحث..." }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A5B1]"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#E9EBF0] bg-white pr-10 pl-10 text-sm text-[#22252D] outline-none transition placeholder:text-[#A0A5B1] focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A5B1] transition hover:text-[#555B68]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function FilterSelect({ value, onChange, options, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 min-w-0 rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm text-[#555B68] outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
