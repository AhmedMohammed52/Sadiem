import { useEffect, useState } from "react";

import { getProductCategories } from "../../../services/productsService";

import {
  FilterBar,
  FilterSearch,
  FilterSelect,
} from "../../components/common/FilterBar";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
}) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Load Categories From Supabase
  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getProductCategories();

        if (active) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Product filters categories error:", error);
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const categoryOptions = [
    { value: "all", label: "كل التصنيفات" },
    ...categories.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];

  const hasFilters =
    search.trim() !== "" || category !== "all" || status !== "all";

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  return (
    <FilterBar hasFilters={hasFilters} onReset={resetFilters}>
      <FilterSearch
        value={search}
        onChange={setSearch}
        placeholder="ابحث باسم المنتج أو كود المنتج..."
      />

      <FilterSelect
        value={category}
        onChange={setCategory}
        options={categoryOptions}
        className="sm:w-40"
        disabled={categoriesLoading}
      />

      <FilterSelect
        value={status}
        onChange={setStatus}
        className="sm:w-40"
        options={[
          { value: "all", label: "كل الحالات" },
          { value: "published", label: "منشور" },
          { value: "draft", label: "مسودة" },
          { value: "available", label: "متوفر" },
          { value: "unavailable", label: "غير متوفر" },
          { value: "low", label: "مخزون منخفض" },
        ]}
      />
    </FilterBar>
  );
}
