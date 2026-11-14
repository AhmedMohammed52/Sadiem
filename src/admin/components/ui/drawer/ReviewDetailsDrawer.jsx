import { useEffect, useState } from "react";
import {
  Star,
  Check,
  Ban,
  Trash2,
  Save,
  User,
  Package,
  CalendarDays,
  Phone,
  MessageSquare,
} from "lucide-react";

import BaseDrawer from "../../common/Drawer";

const EMPTY_REVIEW = {
  customerName: "",
  customerPhone: "",
  productName: "",
  productId: "",
  orderId: "",
  rating: 5,
  comment: "",
  title: "",
  source: "whatsapp",
  date: new Date().toISOString().slice(0, 10),
  status: "pending",
  screenshotUrl: "",
};

export default function ReviewDetailsDrawer({
  open,
  review,
  mode,
  onClose,
  onSave,
  onApprove,
  onReject,
  onDelete,
  saving = false,
}) {
  const [formData, setFormData] = useState(EMPTY_REVIEW);

  const isForm = mode === "add" || mode === "edit";

  useEffect(() => {
    if (!open) return;

    setFormData(review ? { ...EMPTY_REVIEW, ...review } : { ...EMPTY_REVIEW });
  }, [open, review]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.customerName.trim() ||
      !formData.productName.trim() ||
      !formData.comment.trim()
    ) {
      return;
    }

    onSave(formData);
  };

  const statusLabels = {
    approved: "منشور",
    pending: "بانتظار المراجعة",
    rejected: "مرفوض",
  };

  const sourceLabels = {
    whatsapp: "واتساب",
    website: "الموقع",
    manual: "إضافة يدوية",
  };

  const title =
    mode === "add"
      ? "إضافة تقييم جديد"
      : mode === "edit"
        ? "تعديل التقييم"
        : "تفاصيل التقييم";

  const description = isForm
    ? "أدخل بيانات تقييم العميل"
    : "مراجعة وإدارة تقييم العميل";

  return (
    <BaseDrawer
      isOpen={open}
      onClose={onClose}
      icon={MessageSquare}
      width="max-w-xl"
      title={title}
      description={description}
      footer={
        isForm ? (
          <div className="flex gap-3">
            <button
              type="submit"
              form="review-form"
              disabled={saving}
              tabIndex={open ? 0 : -1}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4059E8] text-xs font-semibold text-white transition-colors hover:bg-[#3048D5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "جاري الحفظ..." : "حفظ التقييم"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              tabIndex={open ? 0 : -1}
              className="h-10 rounded-lg border border-[#E9EBF0] px-5 text-xs font-semibold text-[#555B68] transition-colors hover:bg-[#F5F6FA] disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        ) : review ? (
          <div className="flex flex-wrap gap-2">
            {review.status !== "approved" && (
              <button
                type="button"
                disabled={saving}
                onClick={() => onApprove(review.id)}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60"
              >
                <Check size={15} />
                نشر التقييم
              </button>
            )}

            {review.status !== "rejected" && (
              <button
                type="button"
                disabled={saving}
                onClick={() => onReject(review.id)}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100 disabled:opacity-60"
              >
                <Ban size={15} />
                رفض
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => onDelete(review.id)}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-60"
              title="حذف"
              aria-label="حذف التقييم"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ) : null
      }
    >
      {isForm ? (
        <form
          id="review-form"
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          {/* Customer Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              اسم العميل
            </label>

            <input
              required
              value={formData.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              placeholder="مثال: سارة محمد"
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              رقم الهاتف
            </label>

            <input
              dir="ltr"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => updateField("customerPhone", e.target.value)}
              placeholder="01xxxxxxxxx"
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-left text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />
          </div>

          {/* Product */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              اسم المنتج
            </label>

            <input
              required
              value={formData.productName}
              onChange={(e) => updateField("productName", e.target.value)}
              placeholder="اسم المنتج"
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="mb-3 block text-xs font-semibold text-[#555B68]">
              التقييم
            </label>

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => updateField("rating", index + 1)}
                  aria-label={`${index + 1} نجوم`}
                  aria-pressed={index < formData.rating}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={26}
                    className={
                      index < formData.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }
                  />
                </button>
              ))}

              <span className="mr-1 text-xs text-[#777D8A]">
                {formData.rating} من 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              تعليق العميل
            </label>

            <textarea
              required
              rows={5}
              value={formData.comment}
              onChange={(e) => updateField("comment", e.target.value)}
              placeholder="اكتب تعليق العميل..."
              className="w-full resize-none rounded-lg border border-[#E9EBF0] p-3 text-sm leading-7 outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              تاريخ التقييم
            </label>

            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />
          </div>
        </form>
      ) : review ? (
        <div className="space-y-6 p-5 sm:p-6">
          {/* Customer */}
          <section className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FFF0F4] text-[#D64E78]">
              <User size={23} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#22252D]">
                {review.customerName}
              </h3>

              <p className="mt-1 text-xs text-[#9298A4]">
                {statusLabels[review.status] || "غير محدد"}
              </p>
            </div>
          </section>

          {/* Customer Info */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E9EBF0] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-[#9298A4]">
                <Phone size={14} />
                رقم الهاتف
              </div>

              <p
                dir="ltr"
                className="text-right text-sm font-medium text-[#444A55]"
              >
                {review.customerPhone || "غير متوفر"}
              </p>
            </div>

            <div className="rounded-xl border border-[#E9EBF0] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-[#9298A4]">
                <CalendarDays size={14} />
                التاريخ
              </div>

              <p className="text-sm font-medium text-[#444A55]">
                {review.date || "غير متوفر"}
              </p>
            </div>
          </section>

          {/* Source */}
          <section className="rounded-xl border border-[#E9EBF0] p-3">
            <p className="mb-2 text-xs text-[#9298A4]">مصدر التقييم</p>

            <p className="text-sm font-medium text-[#444A55]">
              {sourceLabels[review.source] || "غير محدد"}
            </p>
          </section>

          <div className="border-t border-[#F0F1F5]" />

          {/* Product */}
          <section className="rounded-xl border border-[#E9EBF0] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#777D8A]">
              <Package size={16} />
              المنتج
            </div>

            <p className="text-sm font-semibold text-[#333844]">
              {review.productName}
            </p>
          </section>

          {/* Review */}
          <section>
            <p className="mb-3 text-sm font-bold text-[#22252D]">
              تقييم العميل
            </p>

            <div className="mb-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={22}
                  className={
                    index < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }
                />
              ))}

              <span className="mr-2 text-sm font-bold text-[#555B68]">
                {review.rating}/5
              </span>
            </div>

            <div className="rounded-xl border border-[#E9EBF0] bg-[#F8F9FC] p-4 text-sm leading-8 text-[#555B68]">
              {review.comment}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center p-6 text-sm text-[#9298A4]">
          لا توجد بيانات للتقييم.
        </div>
      )}
    </BaseDrawer>
  );
}
