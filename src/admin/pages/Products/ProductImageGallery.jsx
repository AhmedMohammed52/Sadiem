import { useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Images,
} from "lucide-react";

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("تعذر قراءة الصورة"));

    reader.readAsDataURL(file);
  });

export default function ProductImageGallery({ images = [], onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setError("");

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(`يمكنك إضافة ${MAX_IMAGES} صور كحد أقصى`);
      return;
    }

    if (files.length > remainingSlots) {
      setError(`يمكنك إضافة ${remainingSlots} صور إضافية فقط`);
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const validFiles = [];

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("يسمح فقط بصور PNG وJPG وWEBP");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) return;

    setIsReading(true);

    try {
      const newImages = await Promise.all(
        validFiles.map(async (file) => ({
          id: crypto.randomUUID(),
          file,
          preview: await readFileAsDataURL(file),
          isNew: true,
        })),
      );

      onChange([...images, ...newImages]);
    } catch {
      setError("حدث خطأ أثناء قراءة إحدى الصور");
    } finally {
      setIsReading(false);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
    setError("");
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updatedImages = [...images];

    [updatedImages[index], updatedImages[targetIndex]] = [
      updatedImages[targetIndex],
      updatedImages[index],
    ];

    onChange(updatedImages);
  };

  const makePrimary = (index) => {
    if (index === 0) return;

    const updatedImages = [...images];
    const [selectedImage] = updatedImages.splice(index, 1);

    updatedImages.unshift(selectedImage);
    onChange(updatedImages);
  };

  const getImageSource = (image) => {
    if (typeof image === "string") return image;

    return image.preview || image.url || "";
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#22252D]">معرض صور المنتج</h3>

          <p className="mt-1 text-xs text-[#999EAA]">
            أضف صور المنتج واختر الصورة التي ستظهر في المتجر
          </p>
        </div>

        <span className="rounded-full bg-[#F3F4F8] px-2.5 py-1 text-[10px] text-[#777D8A]">
          {images.length}/{MAX_IMAGES}
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isReading || images.length >= MAX_IMAGES}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#BFC7E8] bg-[#F8F9FF] px-4 py-7 text-center transition hover:border-[#4059E8] hover:bg-[#F1F3FF] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#4059E8]">
          <ImagePlus size={22} />
        </div>

        <p className="mt-3 text-xs font-bold text-[#4059E8]">
          {isReading ? "جاري تجهيز الصور..." : "اضغط لاختيار الصور"}
        </p>

        <p className="mt-1 text-[10px] text-[#999EAA]">
          PNG أو JPG أو WEBP — حتى 5 ميجابايت للصورة
        </p>

        <p className="mt-1 text-[10px] text-[#999EAA]">
          يمكنك اختيار عدة صور مرة واحدة
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {images.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#777D8A]">
            <Images size={15} />
            <span>الصور المضافة</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.id || image.path || image.preview || index}
                className={`group relative overflow-hidden rounded-xl border bg-white ${
                  index === 0
                    ? "border-[#4059E8] ring-1 ring-[#4059E8]/20"
                    : "border-[#E9EBF0]"
                }`}
              >
                <div className="aspect-square bg-[#F5F6FA]">
                  <img
                    src={getImageSource(image)}
                    alt={`صورة المنتج ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>

                {index === 0 && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-[#4059E8] px-2 py-1 text-[9px] font-semibold text-white shadow">
                    <Star size={10} fill="currentColor" />
                    رئيسية
                  </span>
                )}

                <div className="space-y-2 p-2">
                  <p className="text-[10px] font-semibold text-[#555B68]">
                    الصورة {index + 1}
                    {image.isNew && (
                      <span className="mr-1 text-[#4059E8]">(جديدة)</span>
                    )}
                  </p>

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makePrimary(index)}
                      className="w-full rounded-md bg-[#F1F3FF] px-2 py-2 text-[10px] font-semibold text-[#4059E8] transition hover:bg-[#E6E9FF]"
                    >
                      تعيين كصورة رئيسية
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        aria-label="تحريك الصورة للأعلى"
                        className="flex size-7 items-center justify-center rounded-md border border-[#E9EBF0] text-[#777D8A] transition hover:bg-[#F5F6FA] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        aria-label="تحريك الصورة للأسفل"
                        className="flex size-7 items-center justify-center rounded-md border border-[#E9EBF0] text-[#777D8A] transition hover:bg-[#F5F6FA] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="حذف الصورة"
                      className="flex size-7 items-center justify-center rounded-md text-[#A0A5B1] transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] leading-5 text-[#999EAA]">
            الصورة الأولى هي الصورة الرئيسية التي ستظهر في بطاقة المنتج. يمكنك
            تغيير ترتيب الصور باستخدام الأسهم.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#E9EBF0] bg-[#FAFAFC] px-4 py-5 text-center">
          <Images size={23} className="mx-auto text-[#B0B5C0]" />
          <p className="mt-2 text-xs text-[#777D8A]">لم تتم إضافة أي صور بعد</p>
        </div>
      )}
    </section>
  );
}
