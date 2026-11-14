import { Star, Eye, Check, X, Trash2, CalendarDays } from "lucide-react";

const statusConfig = {
  approved: {
    label: "منشور",
    className: "bg-green-50 text-green-700",
  },
  pending: {
    label: "بانتظار المراجعة",
    className: "bg-orange-50 text-orange-700",
  },
  rejected: {
    label: "مرفوض",
    className: "bg-red-50 text-red-600",
  },
};

export default function ReviewCard({
  review,
  onView,
  onApprove,
  onReject,
  onDelete,
}) {
  const status = statusConfig[review.status];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-pink-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold shrink-0">
            {review.customerName.charAt(0)}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-800">
              {review.customerName}
            </h3>

            <p className="text-xs text-gray-400 mt-1" dir="ltr">
              {review.customerPhone}
            </p>
          </div>
        </div>

        <span
          className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={15}
            className={
              index < review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200"
            }
          />
        ))}

        <span className="text-xs font-semibold text-gray-600 mr-1">
          {review.rating}.0
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-7 mt-3 line-clamp-2 min-h-14">
        {review.comment}
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 mt-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 truncate">{review.productName}</p>

          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <CalendarDays size={12} />
            {review.date}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onView(review)}
            title="عرض التفاصيل"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            <Eye size={17} />
          </button>

          {review.status !== "approved" && (
            <button
              onClick={() => onApprove(review.id)}
              title="نشر التقييم"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition"
            >
              <Check size={17} />
            </button>
          )}

          {review.status !== "rejected" && (
            <button
              onClick={() => onReject(review.id)}
              title="رفض التقييم"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-50 transition"
            >
              <X size={17} />
            </button>
          )}

          <button
            onClick={() => onDelete(review.id)}
            title="حذف التقييم"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
