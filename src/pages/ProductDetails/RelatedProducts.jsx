import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import ProductCard from "../../components/ui/product/ProductCard";
import { getRelatedProducts } from "../../services/productsService";

export default function RelatedProducts({ currentProduct }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const itemsPerView = 4;
  const totalProducts = relatedProducts.length;
  const maxIndex = Math.max(0, totalProducts - itemsPerView);

  useEffect(() => {
    let isMounted = true;

    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getRelatedProducts(
          currentProduct.categoryId,
          currentProduct.id,
          8,
        );

        if (isMounted) {
          setRelatedProducts(data);
          setCurrentIndex(0);
          setIsPaused(false);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);

        if (isMounted) {
          setRelatedProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, [currentProduct.id, currentProduct.categoryId]);

  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (!isLoading && totalProducts === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-16 md:mt-20"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="related-heading"
            className="font-display text-xl font-bold md:text-2xl"
          >
            منتجات ممكن تعجبك
          </h2>

          <p className="mt-1 text-xs text-muted-foreground md:text-sm">
            منتجات أخرى من قسم {currentProduct.categoryName}
          </p>
        </div>

        {maxIndex > 0 && (
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="المنتجات السابقة"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-input bg-background transition hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowRight className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="المنتجات التالية"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-input bg-background transition hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="size-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square rounded-xl bg-muted" />
              <div className="mt-3 h-4 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:hidden">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="w-2/3 shrink-0 snap-start sm:w-2/5"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div
            className="relative mt-6 hidden overflow-hidden md:block"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(${
                  currentIndex * (100 / itemsPerView)
                }% + ${currentIndex * 20}px))`,
              }}
            >
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 shrink-0 basis-[calc(25%-15px)] select-none"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
