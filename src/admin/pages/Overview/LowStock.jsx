import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getLowStockProducts } from "../../../services/overviewServices";
import LowStockSkeleton from "./LowStockSkeleton";

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getLowStockProducts(5);

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Low stock error:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  return (
    <section className="rounded-xl border border-[#E9EBF0] bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[#22252D] sm:text-base">
          تنبيهات المخزون
        </h2>

        <Link
          to="/admin/products"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#4059E8] transition hover:text-[#3048D5]"
        >
          إدارة المنتجات
          <ArrowLeft size={15} />
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LowStockSkeleton />
        ) : error ? (
          <div className="py-5 text-center">
            <p className="text-xs text-red-500">تعذر تحميل بيانات المخزون.</p>

            <button
              type="button"
              onClick={() => setRetryKey((prev) => prev + 1)}
              className="mt-2 text-xs font-semibold text-[#4059E8] hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="py-6 text-center text-xs text-[#A0A5B1]">
            لا توجد منتجات منخفضة المخزون حاليًا.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 border-b border-[#F0F1F5] pb-4 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <h3 className="truncate text-xs font-semibold text-[#22252D]">
                  {product.name}
                </h3>

                <p className="mt-1 text-[10px] text-[#A0A5B1]">
                  {product.category}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  product.stock <= 2
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {product.stock} قطع
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
