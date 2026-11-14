import { useEffect, useState } from "react";

import ProductGrid from "../../components/ui/product/ProductGrid";
import { getFeaturedProducts } from "../../services/productsService";

export default function FeaturedSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Fetch featured products error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section
      id="featured"
      className="scroll-mt-24 border-y border-blush/50 bg-blush-soft/50"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              اختيارات سديم
            </h2>

            <p className="mt-2 text-muted-foreground">
              اكتشفي منتجات مميزة للعناية بجمالك
            </p>
          </div>

          <a
            className="shrink-0 text-sm font-semibold underline underline-offset-4"
            href="/shop"
          >
            عرض الكل
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl bg-white"
              >
                <div className="aspect-square bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
