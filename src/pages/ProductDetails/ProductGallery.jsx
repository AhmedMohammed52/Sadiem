import { useEffect, useState } from "react";

export default function ProductGallery({ product }) {
  const images =
    product.images?.length > 0
      ? product.images
          .map((image) => (typeof image === "string" ? image : image?.url))
          .filter(Boolean)
      : product.image
        ? [product.image]
        : [];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  const activeImage = images[activeIndex];

  return (
    <div
      className="grid grid-cols-1 items-start gap-3 md:grid-cols-[76px_minmax(0,1fr)] md:gap-4"
      dir="rtl"
    >
      {images.length > 1 ? (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:flex-col md:gap-3 md:overflow-visible md:pb-0">
          {images.map((image, index) => (
            <button
              key={`${product.id}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`عرض الصورة ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative size-19 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-ink opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${product.name} - ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="hidden md:block md:order-1" />
      )}

      <div className="relative order-1 aspect-square w-full overflow-hidden rounded-2xl bg-muted md:order-2">
        {activeImage ? (
          <img
            key={`${product.id}-${activeIndex}`}
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
            لا توجد صورة متاحة
          </div>
        )}
      </div>
    </div>
  );
}
