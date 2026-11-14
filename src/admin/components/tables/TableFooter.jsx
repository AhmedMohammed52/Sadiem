import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TableFooter({
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-[#F0F1F5] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#777D8A]">
        عرض{" "}
        <span className="font-semibold text-[#22252D]">
          {startItem}–{endItem}
        </span>{" "}
        من أصل{" "}
        <span className="font-semibold text-[#22252D]">{totalItems}</span>
      </p>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="الصفحة السابقة"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EBF0] text-[#777D8A] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E9EBF0] disabled:hover:bg-transparent disabled:hover:text-[#777D8A]"
          >
            <ChevronRight size={16} />
          </button>

          <span className="min-w-20 text-center text-xs text-[#777D8A]">
            صفحة <span className="font-bold text-pink-600">{currentPage}</span>{" "}
            من {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="الصفحة التالية"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EBF0] text-[#777D8A] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E9EBF0] disabled:hover:bg-transparent disabled:hover:text-[#777D8A]"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
