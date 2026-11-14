import { useEffect, useState } from "react";
import { Folder, Upload, Trash2, Save, LoaderCircle } from "lucide-react";

import BaseDrawer from "../../common/Drawer";

const ARABIC_MAP = {
  ا: "a",
  أ: "a",
  إ: "e",
  آ: "aa",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "th",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ى: "a",
  ة: "h",
  ء: "",
};

const createSlug = (value) => {
  return [...value]
    .map((char) => ARABIC_MAP[char] ?? char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default function CategoryDrawer({
  isOpen,
  category,
  categories = [],
  onClose,
  onSave,
  isSaving = false,
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setName(category?.name || "");
    setSlug(category?.slug || "");
    setDescription(category?.description || "");

    setImagePreview(category?.image || "");
    setImageFile(null);
    setRemoveImage(false);

    setIsActive(category?.isActive ?? true);
    setSlugTouched(Boolean(category));
    setErrors({});
  }, [isOpen, category]);

  const handleNameChange = (value) => {
    setName(value);

    if (!slugTouched) {
      setSlug(createSlug(value));
    }

    setErrors((current) => ({
      ...current,
      name: "",
    }));
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setSlug(createSlug(value));

    setErrors((current) => ({
      ...current,
      slug: "",
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "يسمح فقط بصور PNG وJPG وWEBP.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.",
      }));

      return;
    }

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
    setImageFile(file);
    setRemoveImage(false);

    setErrors((current) => ({
      ...current,
      image: "",
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
    setRemoveImage(Boolean(category?.imagePath || category?.image));

    setErrors((current) => ({
      ...current,
      image: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "اسم التصنيف مطلوب.";
    }

    if (!slug.trim()) {
      newErrors.slug = "رابط التصنيف مطلوب.";
    }

    const duplicateName = categories.some(
      (item) =>
        item.id !== category?.id &&
        item.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    const duplicateSlug = categories.some(
      (item) =>
        item.id !== category?.id &&
        item.slug.toLowerCase() === slug.toLowerCase(),
    );

    if (duplicateName) {
      newErrors.name = "هذا التصنيف موجود بالفعل.";
    }

    if (duplicateSlug) {
      newErrors.slug = "هذا الرابط مستخدم بالفعل.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving || !validate()) return;

    await onSave({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      imageFile,
      removeImage,
      isActive,
    });
  };

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      icon={Folder}
      width="max-w-xl"
      title={category ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
      description="أدخل بيانات التصنيف الخاص بمتجر سديم."
      footer={
        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="category-form"
            disabled={isSaving}
            tabIndex={isOpen ? 0 : -1}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4059E8] text-xs font-semibold text-white transition-colors hover:bg-[#3048D5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={15} />
                {category ? "حفظ التعديلات" : "إضافة التصنيف"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            tabIndex={isOpen ? 0 : -1}
            className="h-10 rounded-lg border border-[#E9EBF0] px-5 text-xs font-semibold text-[#555B68] transition-colors hover:bg-[#F5F6FA] disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      }
    >
      <form
        id="category-form"
        onSubmit={handleSubmit}
        className="space-y-5 p-5 sm:p-6"
      >
        <section>
          <label className="mb-2 block text-xs font-semibold text-[#555B68]">
            صورة التصنيف
          </label>

          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-[#D9DCE3] p-4 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F8FA]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="معاينة التصنيف"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Folder size={28} className="text-[#A0A5B1]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#555B68]">
                أضف صورة للتصنيف
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#9298A4]">
                PNG أو JPG أو WEBP، بحد أقصى 5 ميجابايت.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#4059E8] px-3 text-[10px] font-semibold text-white transition-colors hover:bg-[#3048D5]">
                  <Upload size={13} />
                  اختيار صورة
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={isSaving}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSaving}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-100 px-2 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    إزالة
                  </button>
                )}
              </div>
            </div>
          </div>

          {errors.image && (
            <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>
          )}
        </section>

        <section>
          <label className="mb-2 block text-xs font-semibold text-[#555B68]">
            اسم التصنيف <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={name}
            disabled={isSaving}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="مثال: العناية بالبشرة"
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4059E8]/10 ${
              errors.name
                ? "border-red-400 focus:border-red-400"
                : "border-[#E9EBF0] focus:border-[#4059E8]"
            }`}
          />

          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
        </section>

        <section>
          <label className="mb-2 block text-xs font-semibold text-[#555B68]">
            رابط التصنيف (Slug) <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            dir="ltr"
            value={slug}
            disabled={isSaving}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="skin-care"
            className={`h-11 w-full rounded-lg border px-3 text-left text-sm outline-none transition focus:ring-2 focus:ring-[#4059E8]/10 ${
              errors.slug
                ? "border-red-400 focus:border-red-400"
                : "border-[#E9EBF0] focus:border-[#4059E8]"
            }`}
          />

          <p className="mt-1.5 text-[10px] text-[#9298A4]">
            يتم توليده تلقائياً من اسم التصنيف ويمكنك تعديله.
          </p>

          {errors.slug && (
            <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>
          )}
        </section>

        <section>
          <label className="mb-2 block text-xs font-semibold text-[#555B68]">
            وصف التصنيف
            <span className="mr-1 font-normal text-[#9298A4]">(اختياري)</span>
          </label>

          <textarea
            rows={4}
            value={description}
            disabled={isSaving}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اكتب وصفاً مختصراً يساعد العملاء على معرفة محتوى التصنيف..."
            className="w-full resize-none rounded-lg border border-[#E9EBF0] p-3 text-sm leading-6 outline-none transition placeholder:text-[#A0A5B1] focus:border-[#4059E8] focus:ring-2 focus:ring-[#4059E8]/10"
          />
        </section>

        <section className="flex items-center justify-between gap-3 rounded-xl border border-[#E9EBF0] p-4">
          <div>
            <p className="text-xs font-semibold text-[#555B68]">حالة التصنيف</p>

            <p className="mt-1 text-[10px] text-[#9298A4]">
              {isActive
                ? "التصنيف ظاهر ومتاح في المتجر."
                : "التصنيف غير ظاهر في المتجر."}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            disabled={isSaving}
            onClick={() => setIsActive((current) => !current)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${
              isActive ? "bg-[#4059E8]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all duration-200 ${
                isActive ? "right-1" : "right-6"
              }`}
            />
          </button>
        </section>
      </form>
    </BaseDrawer>
  );
}
