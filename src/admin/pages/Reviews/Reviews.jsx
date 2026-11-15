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
import StatsSkeleton from "../../components/common/StatsSkeleton";
import ReviewsSkeleton from "../../components/common/ReviewsSkeleton";

import ConfirmationDialog from "../../components/ui/ConfirmationDialog";

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

  const [deletingReview, setDeletingReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const handleDeleteReview = (reviewOrId) => {
    const review =
      typeof reviewOrId === "object"
        ? reviewOrId
        : reviews.find((item) => item.id === reviewOrId);

    if (!review) return;

    setDeletingReview(review);
  };

  // تنفيذ الحذف بعد التأكيد
  const handleConfirmDelete = async () => {
    if (!deletingReview || isDeleting) return;

    try {
      setIsDeleting(true);
      setError("");

      await removeReview(deletingReview.id);

      setReviews((prev) =>
        prev.filter((review) => review.id !== deletingReview.id),
      );

      // إغلاق الدراور لو التقييم المحذوف هو المعروض
      if (selectedReview?.id === deletingReview.id) {
        setDrawerOpen(false);
        setSelectedReview(null);
      }

      setDeletingReview(null);
    } catch (err) {
      console.error("Delete review error:", err);
      setError(err.message || "حدث خطأ أثناء حذف التقييم.");
    } finally {
      setIsDeleting(false);
    }
  };

  // إغلاق نافذة التأكيد
  const handleCancelDelete = () => {
    if (isDeleting) return;

    setDeletingReview(null);
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

      {loading ? <StatsSkeleton columns={4} /> : <ReviewsStats stats={stats} />}

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
        <ReviewsSkeleton count={4} />
      ) : (
        <ReviewsList
          reviews={filteredReviews}
          onView={(review) => openDrawer(review, "view")}
          onApprove={(id) => updateReviewStatus(id, "approved")}
          onReject={(id) => updateReviewStatus(id, "rejected")}
          onDelete={handleDeleteReview}
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
        onDelete={handleDeleteReview}
        saving={saving}
      />

      <ConfirmationDialog
        isOpen={!!deletingReview}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="حذف التقييم"
        description={
          deletingReview
            ? `هل أنت متأكد من حذف تقييم "${deletingReview.customerName}"؟ لا يمكن التراجع عن هذا الإجراء بعد الحذف.`
            : ""
        }
        confirmText="نعم، احذف التقييم"
        cancelText="إلغاء"
        isLoading={isDeleting}
      />
    </div>
  );
}
