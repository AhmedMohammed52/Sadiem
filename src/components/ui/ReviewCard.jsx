import { Star } from "lucide-react";

export default function ReviewCard({ review, isMobile = false }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md ${
        isMobile ? "w-[85%] shrink-0 snap-start" : ""
      }`}
    >
      {/* هيدر البطاقة (النجوم والشارة) */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-1"
          role="img"
          aria-label="تقييم 5 من 5"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-current text-star"
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="shrink-0 rounded-full bg-blush-soft px-2.5 py-1 text-xs font-semibold text-blush-deep">
          {review.badge}
        </span>
      </div>

      {/* نص التقييم */}
      <blockquote className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
        {review.comment}
      </blockquote>

      {/* صاحب الرأي */}
      <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
        <span
          aria-hidden="true"
          className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-blush text-lg font-bold text-ink"
        >
          {review.initial}
        </span>
        <span className="font-semibold">{review.name}</span>
      </figcaption>
    </figure>
  );
}
