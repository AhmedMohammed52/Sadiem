import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

export default function ShopFilters({
  searchQuery,
  onSearchChange,
  categories = [],
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);

    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }

    setSearchParams(newParams);
  };

  const filters = [
    { id: "all", name: "الكل" },
    ...categories.map((category) => ({
      id: category.slug,
      name: category.name,
    })),
  ];

  return (
    <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Categories */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:px-0">
        {filters.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "border-blush bg-blush text-foreground font-bold"
                  : "bg-background text-foreground/80 hover:border-ink/30"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <label className="flex w-full items-center gap-2 rounded-full border bg-background px-4 py-2.5 transition focus-within:border-ink md:w-72">
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          type="text"
          placeholder="ابحثي عن منتج..."
          aria-label="ابحثي عن منتج"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </label>
    </div>
  );
}
