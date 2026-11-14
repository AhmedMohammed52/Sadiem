import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from "../../components/common/FilterBar";

export default function ReviewsFilters({
  search,
  setSearch,
  status,
  setStatus,
  rating,
  setRating,
}) {
  const hasFilters =
    search.trim() !== "" || status !== "all" || rating !== "all";

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setRating("all");
  };

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
      <FilterSearch
        value={search}
        onChange={setSearch}
        placeholder="ابحث باسم العميل أو المنتج..."
      />

      <FilterSelect
        value={status}
        onChange={setStatus}
        className="sm:w-44"
        options={[
          { value: "all", label: "كل الحالات" },
          { value: "pending", label: "بانتظار المراجعة" },
          { value: "approved", label: "منشور" },
          { value: "rejected", label: "مرفوض" },
        ]}
      />

      <FilterSelect
        value={rating}
        onChange={setRating}
        className="sm:w-40"
        options={[
          { value: "all", label: "كل التقييمات" },
          ...[5, 4, 3, 2, 1].map((number) => ({
            value: String(number),
            label: `${number} نجوم`,
          })),
        ]}
      />
    </FilterBar>
  );
}
