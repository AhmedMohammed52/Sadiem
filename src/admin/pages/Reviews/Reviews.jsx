import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getReviews,
  createReview,
  updateReview,
  updateReviewStatus as saveReviewStatus,
  deleteReview as removeReview,
} from "../../../services/reviewsService";

import ReviewsStats from "./ReviewsStats";
import ReviewsFilters from "./ReviewsFilters";
import ReviewsList from "./ReviewsList";
import ReviewDetailsDrawer from "../../components/ui/drawer/ReviewDetailsDrawer";
import PageHeader from "../../components/common/PageHeader";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [rating, setRating] = useState("all");

  const [selectedReview, setSelectedReview] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("view");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // جلب التقييمات من Supabase
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err.message || "حدث خطأ أثناء تحميل التقييمات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // إحصائيات التقييمات
  const stats = useMemo(() => {
    const approved = reviews.filter((review) => review.status === "approved");

    const pending = reviews.filter((review) => review.status === "pending");

    const average =
      approved.length > 0
        ? approved.reduce((sum, review) => sum + Number(review.rating), 0) /
          approved.length
        : 0;

    return {
      total: reviews.length,
      approved: approved.length,
      pending: pending.length,
      average: average.toFixed(1),
    };
  }, [reviews]);

  // البحث والفلاتر
  const filteredReviews = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return reviews.filter((review) => {
      const matchesSearch =
        (review.customerName || "").toLowerCase().includes(searchValue) ||
        (review.productName || "").toLowerCase().includes(searchValue);

      const matchesStatus = status === "all" || review.status === status;

      const matchesRating =
        rating === "all" || Number(review.rating) === Number(rating);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, status, rating]);

  const openDrawer = (review = null, mode = "view") => {
    setSelectedReview(review);
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (saving) return;

    setDrawerOpen(false);
    setSelectedReview(null);
  };

  // إضافة أو تعديل تقييم
  const saveReview = async (reviewData) => {
    try {
      setSaving(true);
      setError("");

      if (drawerMode === "edit" && selectedReview) {
        await updateReview(selectedReview.id, reviewData);
      } else {
        await createReview({
          ...reviewData,
          status: "pending",
        });
      }

      await fetchReviews();

      setDrawerOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error("Save review error:", err);
      setError(err.message || "حدث خطأ أثناء حفظ التقييم.");
      alert(err.message || "حدث خطأ أثناء حفظ التقييم.");
    } finally {
      setSaving(false);
    }
  };

  // نشر أو رفض تقييم
  const updateReviewStatus = async (id, newStatus) => {
    try {
      setSaving(true);
      setError("");

      await saveReviewStatus(id, newStatus);

      await fetchReviews();

      setDrawerOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error("Update review status error:", err);
      setError(err.message || "حدث خطأ أثناء تحديث حالة التقييم.");
      alert(err.message || "حدث خطأ أثناء تحديث حالة التقييم.");
    } finally {
      setSaving(false);
    }
  };

  // حذف تقييم
  const deleteReview = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا التقييم؟");

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      await removeReview(id);

      setReviews((prev) => prev.filter((review) => review.id !== id));

      setDrawerOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error("Delete review error:", err);
      setError(err.message || "حدث خطأ أثناء حذف التقييم.");
      alert(err.message || "حدث خطأ أثناء حذف التقييم.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="تقييمات العملاء"
        description="إدارة ومراجعة آراء العملاء حول منتجات سديم."
        action={
          <button
            type="button"
            onClick={() => openDrawer(null, "add")}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--admin-primary) px-4 text-xs font-semibold text-white transition-colors hover:bg-(--admin-primary-hover) sm:w-auto"
          >
            <Plus size={17} />
            إضافة تقييم
          </button>
        }
      />

      <ReviewsStats stats={stats} />

      <ReviewsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        rating={rating}
        setRating={setRating}
      />

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchReviews}
            className="shrink-0 font-semibold underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#E9EBF0] bg-white py-16 text-center text-sm text-[#9298A4]">
          جاري تحميل التقييمات...
        </div>
      ) : (
        <ReviewsList
          reviews={filteredReviews}
          onView={(review) => openDrawer(review, "view")}
          onApprove={(id) => updateReviewStatus(id, "approved")}
          onReject={(id) => updateReviewStatus(id, "rejected")}
          onDelete={deleteReview}
        />
      )}

      <ReviewDetailsDrawer
        open={drawerOpen}
        review={selectedReview}
        mode={drawerMode}
        onClose={closeDrawer}
        onSave={saveReview}
        onApprove={(id) => updateReviewStatus(id, "approved")}
        onReject={(id) => updateReviewStatus(id, "rejected")}
        onDelete={deleteReview}
        saving={saving}
      />
    </div>
  );
}
