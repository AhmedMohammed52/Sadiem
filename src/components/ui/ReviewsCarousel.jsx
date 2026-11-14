import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function ReviewsCarousel({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // لدعم السحب باللمس أو الماوس (Swipe & Drag)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const totalReviews = reviews.length;
  const itemsPerView = 3; // عدد الكروت الظاهرة في الشاشة الكبيرة
  const maxIndex = Math.max(0, totalReviews - itemsPerView);

  // الحركة التلقائية المستمرة (Auto-play)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500); // يتحرك كل 3.5 ثانية

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // دوال السحب (Swipe / Drag Handlers)
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* حاوية الكروت */}
      <div className="overflow-hidden py-2">
        <div
          className="flex transition-transform duration-500 ease-out gap-5"
          style={{
            // تحريك دقيق يعتمد على نسبة الكارت الواحد + المسافة بين الكروت
            transform: `translateX(calc(${currentIndex * (100 / itemsPerView)}% + ${currentIndex * 20}px))`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-0 shrink-0 basis-full md:basis-[calc(33.333%-14px)] select-none"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل (السابق والتالي) */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="الآراء السابقة"
          className="grid size-10 place-items-center rounded-full border border-input bg-background shadow-sm transition hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="الآراء التالية"
          className="grid size-10 place-items-center rounded-full border border-input bg-background shadow-sm transition hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}
