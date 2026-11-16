import { MessageSquareOff } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function ReviewsList({
  reviews,
  updatingReviews = {},
  onView,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <div className="space-y-3">
      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 flex flex-col items-center text-center">
          <MessageSquareOff size={35} className="text-gray-300 mb-3" />

          <h3 className="font-semibold text-gray-700">لا توجد تقييمات</h3>

          <p className="text-sm text-gray-400 mt-1">
            لم يتم العثور على تقييمات مطابقة لبحثك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {reviews.map((review) => {
            const updateAction = updatingReviews[String(review.id)] || null;

            return (
              <ReviewCard
                key={review.id}
                review={review}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                isStatusUpdating={Boolean(updateAction)}
                statusUpdatingAction={updateAction}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
