import { useEffect, useState } from "react";
import { PackagePlus, Save, LoaderCircle } from "lucide-react";

import BaseDrawer from "../../common/Drawer";

import {
  createEmptyProduct,
  createProductPayload,
} from "../../../utils/productHelpers";

import { getProductCategories } from "../../../../services/productsService";

import ProductContentFields from "../../../pages/Products/ProductContentFields";
import ProductImageGallery from "../../../pages/Products/ProductImageGallery";

export default function ProductDrawer({
  isOpen,
  product,
  isDuplicating = false,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [form, setForm] = useState(createEmptyProduct());
  const [errors, setErrors] = useState({});

  // Dynamic Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  // Load Product Data
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      const existingImages = product.images?.length
        ? product.images.map((image) =>
            typeof image === "string"
              ? {
                  id: image,
                  path: image,
                  url: image.startsWith("http") ? image : "",
                  isExisting: true,
                }
              : { ...image, isNew: false },
          )
        : product.image
          ? [
              {
                id: product.image,
                path: product.image,
                url: product.image,
                isExisting: true,
              },
            ]
          : [];

      setForm({
        ...createEmptyProduct(),
        ...product,
        images: existingImages,
        price: String(product.price ?? ""),
        oldPrice: String(product.oldPrice ?? ""),
        stock: String(product.stock ?? 0),
        features: [...(product.features || [])],
        details: [...(product.details || [])],
        ingredients: [...(product.ingredients || [])],
      });
    } else {
      setForm(createEmptyProduct());
    }

    setErrors({});
  }, [isOpen, product]);

  // Load Categories From Supabase
  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getProductCategories();

        if (active) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Categories loading error:", error);

        if (active) {
          setCategoriesError("تعذر تحميل التصنيفات. حاول مرة أخرى.");
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [isOpen]);

  // Update Form Fields
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Validate Form
  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "اسم المنتج مطلوب";
    }

    if (!form.category) {
      nextErrors.category = "اختر تصنيف المنتج";
    }

    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = "أدخل سعرًا صحيحًا";
    }

    if (form.oldPrice && Number(form.oldPrice) <= Number(form.price)) {
      nextErrors.oldPrice = "السعر القديم يجب أن يكون أكبر من الحالي";
    }

    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      nextErrors.stock = "أدخل كمية صحيحة";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Submit Product
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving || categoriesLoading || !validateForm()) return;

    const productData = createProductPayload({
      ...form,
    });

    await onSave(productData);
  };

  // Price & Discount
  const price = Number(form.price) || 0;
  const oldPrice = Number(form.oldPrice) || 0;

  const discount =
    oldPrice > price && price > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // Drawer Text
  const drawerTitle = isDuplicating
    ? "نسخ المنتج"
    : product
      ? "تعديل المنتج"
      : "إضافة منتج جديد";

  const drawerDescription = isDuplicating
    ? "أنشئ منتجًا جديدًا باستخدام بيانات المنتج الأصلي"
    : "أدخل بيانات المنتج وتفاصيله وصوره";

  const submitButtonText = isDuplicating
    ? "إنشاء النسخة"
    : product
      ? "حفظ التعديلات"
      : "إضافة المنتج";

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      icon={PackagePlus}
      width="max-w-2xl"
      title={drawerTitle}
      description={drawerDescription}
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            tabIndex={isOpen ? 0 : -1}
            className="h-10 rounded-lg border border-[#E9EBF0] px-5 text-xs font-semibold text-[#555B68] transition-colors hover:bg-[#F5F6FA] disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            type="submit"
            form="product-form"
            disabled={isSaving || categoriesLoading || !!categoriesError}
            tabIndex={isOpen ? 0 : -1}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#4059E8] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#3048D5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                جاري الحفظ...
              </>
            ) : categoriesLoading ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                جاري تحميل البيانات...
              </>
            ) : (
              <>
                <Save size={15} />
                {submitButtonText}
              </>
            )}
          </button>
        </div>
      }
    >
      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="space-y-6 p-5 sm:p-6"
      >
        {/* Basic Information */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#22252D]">
              المعلومات الأساسية
            </h3>

            <p className="mt-1 text-xs text-[#999EAA]">
              اسم المنتج والتصنيف والبيانات الأساسية
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              اسم المنتج *
            </label>

            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="مثال: عطر روز"
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              التصنيف *
            </label>

            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              disabled={categoriesLoading || !!categoriesError}
              className="h-11 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10 disabled:cursor-wait disabled:bg-gray-50"
            >
              <option value="">
                {categoriesLoading
                  ? "جاري تحميل التصنيفات..."
                  : categoriesError
                    ? "تعذر تحميل التصنيفات"
                    : "اختر التصنيف"}
              </option>

              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            {categoriesError && (
              <p className="mt-1 text-xs text-red-500">{categoriesError}</p>
            )}

            {!categoriesLoading &&
              !categoriesError &&
              categories.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  لا توجد تصنيفات نشطة. أضف تصنيفًا أولًا.
                </p>
              )}

            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>
        </section>

        <div className="border-t border-[#F0F1F5]" />

        {/* Pricing */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#22252D]">
              التسعير والخصومات
            </h3>

            <p className="mt-1 text-xs text-[#999EAA]">
              أدخل السعر الحالي والسعر قبل الخصم
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Current Price */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#555B68]">
                السعر الحالي *
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0"
                  className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 pl-12 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
                />

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#999EAA]">
                  ج.م
                </span>
              </div>

              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Old Price */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#555B68]">
                السعر قبل الخصم
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={form.oldPrice}
                  onChange={(e) => updateField("oldPrice", e.target.value)}
                  placeholder="اختياري"
                  className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 pl-12 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
                />

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#999EAA]">
                  ج.م
                </span>
              </div>

              {errors.oldPrice && (
                <p className="mt-1 text-xs text-red-500">{errors.oldPrice}</p>
              )}
            </div>
          </div>

          {/* Discount Preview */}
          {discount > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-[#FFF4F6] p-4">
              <div>
                <p className="text-xs font-semibold text-[#555B68]">
                  نسبة الخصم المحسوبة
                </p>

                <p className="mt-1 text-xs text-[#999EAA]">
                  توفير {(oldPrice - price).toLocaleString("en-US")} ج.م
                </p>
              </div>

              <span className="rounded-lg bg-[#FCE1E8] px-3 py-2 text-sm font-bold text-[#D64E78]">
                {discount}% خصم
              </span>
            </div>
          )}
        </section>

        <div className="border-t border-[#F0F1F5]" />

        {/* Product Content */}
        <ProductContentFields form={form} updateField={updateField} />

        <div className="border-t border-[#F0F1F5]" />

        {/* Stock */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#22252D]">المخزون</h3>

            <p className="mt-1 text-xs text-[#999EAA]">
              حدد الكمية المتاحة للبيع
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#555B68]">
              الكمية المتاحة
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              className="h-11 w-full rounded-lg border border-[#E9EBF0] px-3 text-sm outline-none transition focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
            />

            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
            )}
          </div>
        </section>

        <div className="border-t border-[#F0F1F5]" />

        {/* Product Images */}
        <ProductImageGallery
          images={form.images}
          onChange={(images) => updateField("images", images)}
        />
      </form>
    </BaseDrawer>
  );
}
