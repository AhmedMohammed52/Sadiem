import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getReviews,
  createReview,
  updateReview,
  updateReviewStatus as saveReviewStatus,
  deleteReview as removeReview,
} from "../../../services/reviewsService";

import { useAdminToast } from "../../../context/AdminToastContext";
import { getAdminErrorMessage } from "../../utils/errorHandler";

import ReviewsStats from "./ReviewsStats";
import ReviewsFilters from "./ReviewsFilters";
import ReviewsList from "./ReviewsList";
import ReviewDetailsDrawer from "../../components/ui/drawer/ReviewDetailsDrawer";
import PageHeader from "../../components/common/PageHeader";
import StatsSkeleton from "../../components/common/Skelton/StatsSkeleton";
import ReviewsSkeleton from "./ReviewsSkeleton";

import ConfirmationDialog from "../../components/ui/ConfirmationDialog";

export default function Reviews() {
  const { showToast } = useAdminToast();

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

  const [updatingReviews, setUpdatingReviews] = useState({});
  const updatingReviewsRef = useRef(new Set());

  // جلب التقييمات من Supabase
  const fetchReviews = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);

      setError("");

      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      const message = getAdminErrorMessage(
        err,
        "حدث خطأ أثناء تحميل التقييمات.",
      );

      setError(message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      let savedReview;

      if (drawerMode === "edit" && selectedReview) {
        savedReview = await updateReview(selectedReview.id, reviewData);

        setReviews((prev) =>
          prev.map((review) =>
            review.id === selectedReview.id ? savedReview : review,
          ),
        );

        setSelectedReview(savedReview);

        showToast({
          type: "success",
          title: "تم تعديل التقييم",
          message: "تم حفظ التعديلات بنجاح.",
        });
      } else {
        savedReview = await createReview({
          ...reviewData,
          status: "pending",
        });

        setReviews((prev) => [savedReview, ...prev]);

        showToast({
          type: "success",
          title: "تمت إضافة التقييم",
          message: "تمت إضافة التقييم بنجاح وهو الآن بانتظار المراجعة.",
        });
      }

      setDrawerOpen(false);
      setSelectedReview(null);
    } catch (err) {
      showToast({
        type: "error",
        title: "تعذر حفظ التقييم",
        message: getAdminErrorMessage(
          err,
          "حدث خطأ أثناء حفظ التقييم. حاول مرة أخرى.",
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  // نشر أو رفض تقييم
  const updateReviewStatus = async (id, newStatus) => {
    const reviewId = String(id);

    if (updatingReviewsRef.current.has(reviewId)) return;

    const currentReview = reviews.find(
      (review) => String(review.id) === reviewId,
    );

    if (!currentReview || currentReview.status === newStatus) return;

    const previousStatus = currentReview.status;

    updatingReviewsRef.current.add(reviewId);

    setUpdatingReviews((prev) => ({
      ...prev,
      [reviewId]: newStatus,
    }));

    setError("");

    // تحديث الحالة مباشرة في الواجهة
    setReviews((prev) =>
      prev.map((review) =>
        String(review.id) === reviewId
          ? { ...review, status: newStatus }
          : review,
      ),
    );

    setSelectedReview((prev) =>
      prev && String(prev.id) === reviewId
        ? { ...prev, status: newStatus }
        : prev,
    );

    try {
      await saveReviewStatus(id, newStatus);

      showToast({
        type: "success",
        title:
          newStatus === "approved"
            ? "تم نشر التقييم"
            : newStatus === "rejected"
              ? "تم رفض التقييم"
              : "تم تحديث التقييم",
        message:
          newStatus === "approved"
            ? "التقييم أصبح منشورًا في المتجر."
            : newStatus === "rejected"
              ? "تم رفض التقييم بنجاح."
              : "تم تحديث حالة التقييم بنجاح.",
      });
    } catch (err) {
      // إرجاع الحالة القديمة في حالة فشل التحديث
      setReviews((prev) =>
        prev.map((review) =>
          String(review.id) === reviewId
            ? { ...review, status: previousStatus }
            : review,
        ),
      );

      setSelectedReview((prev) =>
        prev && String(prev.id) === reviewId
          ? { ...prev, status: previousStatus }
          : prev,
      );

      showToast({
        type: "error",
        title: "تعذر تحديث حالة التقييم",
        message: getAdminErrorMessage(
          err,
          "حدث خطأ أثناء تحديث حالة التقييم. حاول مرة أخرى.",
        ),
      });
    } finally {
      updatingReviewsRef.current.delete(reviewId);

      setUpdatingReviews((prev) => {
        const updated = { ...prev };
        delete updated[reviewId];
        return updated;
      });
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

      showToast({
        type: "success",
        title: "تم حذف التقييم",
        message: "تم حذف التقييم بنجاح.",
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "تعذر حذف التقييم",
        message: getAdminErrorMessage(
          err,
          "حدث خطأ أثناء حذف التقييم. حاول مرة أخرى.",
        ),
      });
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
            onClick={() => fetchReviews()}
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
          updatingReviews={updatingReviews}
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
