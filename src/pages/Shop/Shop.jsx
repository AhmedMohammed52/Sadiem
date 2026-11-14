import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import ShopHeader from "./ShopHeader";
import ShopFilters from "./ShopFilters";
import ProductGrid from "../../components/ui/product/ProductGrid";

import {
  getStorefrontProducts,
  getProductCategories,
} from "../../services/productsService";

const PRODUCTS_PER_PAGE = 12;

export default function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeCategory = searchParams.get("category") || "all";

  // تحميل المنتجات والتصنيفات
  useEffect(() => {
    let isMounted = true;

    const fetchShopData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [productsData, categoriesData] = await Promise.all([
          getStorefrontProducts(),
          getProductCategories(),
        ]);

        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Shop loading error:", err);

        if (isMounted) {
          setError(err.message || "تعذر تحميل منتجات المتجر");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchShopData();

    return () => {
      isMounted = false;
    };
  }, []);

  // فلترة المنتجات
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // الرجوع للصفحة الأولى عند تغيير البحث أو التصنيف
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // التأكد أن الصفحة الحالية موجودة
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // المنتجات الظاهرة في الصفحة الحالية
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <ShopHeader />

      <ShopFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
      />

      {isLoading ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3">
          <LoaderCircle size={30} className="animate-spin text-blush" />
          <p className="text-sm text-muted-foreground">
            جاري تحميل المنتجات...
          </p>
        </div>
      ) : error ? (
        <div
          className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600"
          dir="rtl"
        >
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {filteredProducts.length.toLocaleString("en-US")} منتج
          </p>

          <div className="mt-4">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={currentProducts} />
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                <p className="text-lg font-semibold">
                  مفيش منتجات متاحة حاليًا
                </p>
                <p className="text-sm text-muted-foreground">
                  جربي البحث بكلمة تانية أو اختاري تصنيف مختلف.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="التنقل بين صفحات المنتجات"
              className="mt-10 flex items-center justify-center gap-2"
              dir="rtl"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                aria-label="الصفحة السابقة"
                className="flex size-10 items-center justify-center rounded-full border transition-colors hover:border-blush hover:bg-blush disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>

              {pages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`الصفحة ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "border-blush bg-blush font-bold text-foreground"
                      : "bg-background text-foreground/80 hover:border-blush"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                aria-label="الصفحة التالية"
                className="flex size-10 items-center justify-center rounded-full border transition-colors hover:border-blush hover:bg-blush disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
