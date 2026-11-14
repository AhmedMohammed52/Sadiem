import { useEffect, useState } from "react";

import ReviewCard from "../../components/ui/ReviewCard";
import ReviewsCarousel from "../../components/ui/ReviewsCarousel";

import { getStorefrontReviews } from "../../services/reviewsService";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        const data = await getStorefrontReviews();

        if (isMounted) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Fetch storefront reviews error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="border-t py-16 md:py-24 overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            آراء عملائنا
          </h2>

          <p className="mt-2 text-muted-foreground">
            تجارب حقيقية من عملائنا مع منتجات سديم
          </p>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 min-w-[85%] animate-pulse rounded-xl bg-muted sm:min-w-80 md:min-w-0 md:flex-1"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Reviews */}
            <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-2 scroll-smooth md:hidden">
              {reviews.map((review) => (
                <div
                  key={`m-${review.id}`}
                  className="w-[85%] shrink-0 snap-center sm:w-87.5"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Desktop Reviews */}
            <div className="hidden md:block">
              <ReviewsCarousel reviews={reviews} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
