import { useEffect, useState } from "react";

import {
  Phone,
  MapPin,
  CalendarDays,
  Package,
  MessageCircle,
  CreditCard,
  Truck,
  ClipboardList,
  Save,
  X,
  Loader2,
} from "lucide-react";

import BaseDrawer from "../../common/Drawer";

import OrderStatus from "../../../pages/Orders/OrderStatus";
import { ORDER_STATUSES, VALID_ORDER_STATUSES } from "../../../data/order";

const PAYMENT_METHODS = {
  cod: "الدفع عند الاستلام",
  vodafone: "فودافون كاش",
  instapay: "إنستا باي",
};

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("ar-EG")} ج.م`;

const formatDate = (date) =>
  new Date(date).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const getProductImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${image}`;
};

export default function OrderDetailsDrawer({
  isOpen,
  order,
  onClose,
  onStatusChange,
  isSaving = false,
}) {
  const [draftStatus, setDraftStatus] = useState("");

  // مزامنة الحالة عند فتح طلب جديد أو تحديث بيانات الطلب
  useEffect(() => {
    setDraftStatus(order?.status || "");
  }, [order?.id, order?.status]);

  // هل يوجد تعديل لم يتم حفظه؟
  const hasChanges = Boolean(order && draftStatus !== order.status);

  // تغيير الحالة مؤقتًا
  const handleStatusChange = (event) => {
    setDraftStatus(event.target.value);
  };

  // إلغاء التعديلات
  const handleCancelChanges = () => {
    setDraftStatus(order.status);
  };

  // تأكيد وحفظ التعديلات
  const handleSaveChanges = async () => {
    if (!order || !hasChanges || isSaving) return;

    if (!VALID_ORDER_STATUSES.includes(draftStatus)) {
      return;
    }

    await onStatusChange(order.id, draftStatus);
  };

  const itemsCount =
    order?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      icon={ClipboardList}
      width="max-w-xl"
      title={order?.orderNumber ? `#${order.orderNumber}` : "تفاصيل الطلب"}
      description="تفاصيل الطلب وبيانات العميل والفاتورة"
      footer={
        <div className="w-full">
          {hasChanges ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4059E8] text-sm font-semibold text-white transition hover:bg-[#3048D5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    حفظ التعديلات
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancelChanges}
                disabled={isSaving}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E9EBF0] bg-white text-sm font-semibold text-[#555B68] transition hover:bg-[#F5F6FA] disabled:opacity-50"
              >
                <X size={17} />
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 w-full rounded-lg bg-[#4059E8] text-sm font-semibold text-white transition hover:bg-[#3048D5] disabled:opacity-50"
            >
              إغلاق التفاصيل
            </button>
          )}
        </div>
      }
    >
      {order ? (
        <div className="space-y-6 p-5 sm:p-6">
          {/* Status */}
          <section className="rounded-xl border border-[#E9EBF0] bg-[#F8F9FC] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#444A55]">
                حالة الطلب
              </span>

              <OrderStatus status={draftStatus} />
            </div>

            <select
              value={draftStatus}
              onChange={handleStatusChange}
              disabled={isSaving}
              className="h-11 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10 disabled:opacity-60"
            >
              {ORDER_STATUSES.filter((status) => status.value !== "all").map(
                (status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ),
              )}
            </select>

            {hasChanges && (
              <p className="mt-3 text-xs text-amber-600">
                لديك تغييرات غير محفوظة على حالة الطلب.
              </p>
            )}
          </section>

          {/* Customer */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#22252D]">
              <Phone size={17} className="text-[#4059E8]" />
              بيانات العميل
            </h3>

            <div className="space-y-4 rounded-xl border border-[#E9EBF0] p-4">
              <div>
                <p className="text-xs text-[#9298A4]">اسم العميل</p>
                <p className="mt-1 text-sm font-semibold text-[#333844]">
                  {order.customer?.name || "غير متوفر"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9298A4]">رقم الهاتف</p>
                <p
                  dir="ltr"
                  className="mt-1 text-right text-sm font-medium text-[#555B68]"
                >
                  {order.customer?.phone || "غير متوفر"}
                </p>
              </div>

              {order.customer?.phone && (
                <div className="flex gap-2 border-t border-[#F0F1F5] pt-3">
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#F5F6FA] text-xs font-semibold text-[#555B68] transition-colors hover:bg-[#ECEEF4]"
                  >
                    <Phone size={15} />
                    اتصال
                  </a>

                  <a
                    href={`https://wa.me/2${order.customer.phone.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-50 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle size={15} />
                    واتساب
                  </a>
                </div>
              )}
            </div>
          </section>

          <div className="border-t border-[#F0F1F5]" />

          {/* Address */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#22252D]">
              <MapPin size={17} className="text-[#4059E8]" />
              عنوان التوصيل
            </h3>

            <div className="rounded-xl border border-[#E9EBF0] p-4">
              <p className="text-sm font-semibold text-[#333844]">
                {order.address?.governorate || ""}
                {order.address?.city ? ` - ${order.address.city}` : ""}
              </p>

              <p className="mt-2 text-sm leading-7 text-[#777D8A]">
                {order.address?.street || ""}
                {order.address?.details ? `، ${order.address.details}` : ""}
              </p>
            </div>
          </section>

          {/* Date */}
          <section className="flex items-center gap-3 rounded-xl border border-[#E9EBF0] p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#4059E8]">
              <CalendarDays size={19} />
            </div>

            <div>
              <p className="text-xs text-[#9298A4]">تاريخ الطلب</p>
              <p className="mt-1 text-sm font-semibold text-[#555B68]">
                {formatDate(order.date)}
              </p>
            </div>
          </section>

          <div className="border-t border-[#F0F1F5]" />

          {/* Products */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#22252D]">
                <Package size={17} className="text-[#4059E8]" />
                المنتجات
              </h3>

              <span className="text-xs text-[#9298A4]">{itemsCount} قطعة</span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="flex items-center gap-3 rounded-xl border border-[#E9EBF0] p-3"
                >
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F8FA]">
                    {getProductImageUrl(item.image) ? (
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Package size={24} className="text-[#C5C9D2]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-[#333844]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[#9298A4]">
                      الكمية: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[#22252D]">
                    {formatPrice(
                      Number(item.price || 0) * Number(item.quantity || 0),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-[#F0F1F5]" />

          {/* Invoice */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#22252D]">
              <CreditCard size={17} className="text-[#4059E8]" />
              ملخص الفاتورة
            </h3>

            <div className="space-y-3 rounded-xl border border-[#E9EBF0] p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#777D8A]">إجمالي المنتجات</span>
                <span className="font-medium text-[#444A55]">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#777D8A]">الخصم</span>
                <span className="font-medium text-emerald-600">
                  - {formatPrice(order.discount)}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="flex items-center gap-1 text-[#777D8A]">
                  <Truck size={15} />
                  الشحن
                </span>
                <span className="font-medium text-[#444A55]">
                  {formatPrice(order.shipping)}
                </span>
              </div>

              <div className="border-t border-dashed border-[#E9EBF0] pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#22252D]">
                    الإجمالي النهائي
                  </span>
                  <span className="text-lg font-bold text-[#D64E78]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F8FA] p-3">
                <span className="text-xs text-[#777D8A]">طريقة الدفع</span>
                <span className="text-sm font-semibold text-[#444A55]">
                  {PAYMENT_METHODS[order.paymentMethod] || "غير محدد"}
                </span>
              </div>
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section>
              <h3 className="mb-3 text-sm font-bold text-[#22252D]">
                ملاحظات الطلب
              </h3>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                {order.notes}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center p-6 text-sm text-[#9298A4]">
          لا توجد بيانات للطلب.
        </div>
      )}
    </BaseDrawer>
  );
}
