import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from "../../components/common/FilterBar";

export default function CategoryFilters({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}) {
  const hasFilters =
    search.trim() !== "" || status !== "all" || sort !== "default";

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("default");
  };

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
      <FilterSearch
        value={search}
        onChange={setSearch}
        placeholder="ابحث باسم التصنيف أو الرابط..."
      />

      <FilterSelect
        value={status}
        onChange={setStatus}
        className="sm:w-40"
        options={[
          { value: "all", label: "كل الحالات" },
          { value: "active", label: "نشط" },
          { value: "inactive", label: "غير نشط" },
        ]}
      />

      <FilterSelect
        value={sort}
        onChange={setSort}
        className="sm:w-48"
        options={[
          { value: "default", label: "الترتيب الافتراضي" },
          { value: "name", label: "حسب الاسم" },
          { value: "products", label: "الأكثر منتجات" },
          { value: "products-asc", label: "الأقل منتجات" },
          { value: "newest", label: "الأحدث إضافة" },
        ]}
      />
    </FilterBar>
  );
}
