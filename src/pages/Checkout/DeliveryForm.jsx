import { AlertCircle, ChevronDown } from "lucide-react";

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

export default function DeliveryForm({ formData, onChange, errors = {} }) {
  const getFieldClass = (field, extra = "") => {
    const hasError = Boolean(errors[field]);

    return `
      w-full min-w-0 h-12 rounded-md border px-3
      bg-background text-base shadow-none
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2
      ${
        hasError
          ? "border-red-500 bg-red-50/50 focus-visible:border-red-500 focus-visible:ring-red-500/20"
          : "border-input focus-visible:border-blush-deep focus-visible:ring-blush-deep/20"
      }
      ${extra}
    `;
  };

  const renderError = (field) => {
    if (!errors[field]) return null;

    return (
      <p
        className="flex items-center gap-1.5 text-xs font-medium text-red-600"
        role="alert"
      >
        <AlertCircle className="size-3.5 shrink-0" />
        {errors[field]}
      </p>
    );
  };

  const errorLabelClass = (field) =>
    `block text-sm font-semibold ${errors[field] ? "text-red-600" : ""}`;

  return (
    <section aria-labelledby="customer-heading" className="min-w-0">
      <h2 id="customer-heading" className="mb-5 font-display text-xl font-bold">
        بيانات التوصيل
      </h2>

      <div className="space-y-5">
        {/* الاسم بالكامل */}
        <div className="min-w-0 space-y-2">
          <label htmlFor="checkout-name" className={errorLabelClass("name")}>
            الاسم بالكامل *
          </label>

          <input
            id="checkout-name"
            name="name"
            type="text"
            required
            maxLength={100}
            dir="rtl"
            autoComplete="name"
            value={formData.name}
            onChange={onChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "checkout-name-error" : undefined}
            className={getFieldClass("name")}
          />

          {errors.name && (
            <span id="checkout-name-error">{renderError("name")}</span>
          )}
        </div>

        {/* رقم الموبايل */}
        <div className="min-w-0 space-y-2">
          <label htmlFor="checkout-phone" className={errorLabelClass("phone")}>
            رقم الموبايل *
          </label>

          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            required
            maxLength={20}
            placeholder="01xxxxxxxxx"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={onChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone ? "checkout-phone-error" : "checkout-phone-hint"
            }
            className={getFieldClass("phone", "text-right")}
          />

          {errors.phone ? (
            <span id="checkout-phone-error">{renderError("phone")}</span>
          ) : (
            <p
              id="checkout-phone-hint"
              className="text-xs text-muted-foreground"
            >
              أدخلي رقم موبايل مصري صحيح للتواصل وتأكيد الطلب.
            </p>
          )}
        </div>

        {/* المحافظة */}
        <div className="min-w-0 space-y-2">
          <label
            htmlFor="checkout-governorate"
            className={errorLabelClass("governorate")}
          >
            المحافظة *
          </label>

          <div className="relative">
            <select
              id="checkout-governorate"
              name="governorate"
              required
              value={formData.governorate}
              onChange={onChange}
              aria-invalid={Boolean(errors.governorate)}
              aria-describedby={
                errors.governorate ? "checkout-governorate-error" : undefined
              }
              className={`${getFieldClass(
                "governorate",
                "appearance-none cursor-pointer pr-3 pl-10",
              )} ${
                formData.governorate
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <option value="" disabled>
                اختاري المحافظة
              </option>

              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  محافظة {gov}
                </option>
              ))}
            </select>

            <ChevronDown
              className={`pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 ${
                errors.governorate ? "text-red-500" : "text-muted-foreground"
              }`}
            />
          </div>

          {errors.governorate && (
            <span id="checkout-governorate-error">
              {renderError("governorate")}
            </span>
          )}
        </div>

        {/* المدينة / المنطقة */}
        <div className="min-w-0 space-y-2">
          <label htmlFor="checkout-city" className={errorLabelClass("city")}>
            المدينة / المنطقة *
          </label>

          <input
            id="checkout-city"
            name="city"
            type="text"
            required
            maxLength={150}
            dir="rtl"
            autoComplete="address-level2"
            value={formData.city}
            onChange={onChange}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "checkout-city-error" : undefined}
            className={getFieldClass("city")}
          />

          {errors.city && (
            <span id="checkout-city-error">{renderError("city")}</span>
          )}
        </div>

        {/* العنوان بالتفصيل */}
        <div className="min-w-0 space-y-2">
          <label
            htmlFor="checkout-address"
            className={errorLabelClass("address")}
          >
            العنوان بالتفصيل *
          </label>

          <textarea
            id="checkout-address"
            name="address"
            required
            rows={3}
            maxLength={600}
            placeholder="اسم الشارع، رقم العمارة، الدور، وأقرب علامة مميزة"
            value={formData.address}
            onChange={onChange}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={
              errors.address ? "checkout-address-error" : undefined
            }
            className={`
              min-h-20 w-full rounded-md border bg-transparent
              px-3 py-2 text-base shadow-none
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              ${
                errors.address
                  ? "border-red-500 bg-red-50/50 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : "border-input focus-visible:border-blush-deep focus-visible:ring-blush-deep/20"
              }
            `}
          />

          {errors.address && (
            <span id="checkout-address-error">{renderError("address")}</span>
          )}
        </div>

        {/* ملاحظات إضافية */}
        <div className="min-w-0 space-y-2">
          <label
            htmlFor="checkout-notes"
            className="block text-sm font-semibold"
          >
            ملاحظات إضافية
            <span className="font-normal text-muted-foreground">
              {" "}
              (اختياري)
            </span>
          </label>

          <textarea
            id="checkout-notes"
            name="notes"
            rows={2}
            maxLength={1000}
            value={formData.notes}
            onChange={onChange}
            className="min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-none transition-all duration-200 focus-visible:border-blush-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep/20"
          />
        </div>
      </div>
    </section>
  );
}
