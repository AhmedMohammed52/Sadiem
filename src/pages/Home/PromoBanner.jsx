import { ArrowLeft } from "lucide-react";
import Image from "../../assets/3.jfif";

const BANNER_DATA = {
  brand: "SADIM",
  title: "جمالك يستحق لمسة من التميّز",
  description:
    "اكتشفي اختياراتنا من العطور ومنتجات العناية، واختاري اللي يناسبك.",
  buttonText: "اكتشفي المجموعة",
  buttonLink: "/shop",
  imageSrc: Image,
  imageAlt: "مجموعة عطور سديم",
};

export default function PromoBanner() {
  const {
    brand,
    title,
    description,
    buttonText,
    buttonLink,
    imageSrc,
    imageAlt,
  } = BANNER_DATA;

  return (
    <section
      aria-label="عرض ترويجي"
      className="w-full overflow-hidden bg-blush-soft/60 ambient-section ambient-section-reverse"
      dir="rtl"
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-blush-soft/70 to-background"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-24 lg:py-28">
          <div className="max-w-xl text-center lg:text-right">
            <p className="font-latin text-xs tracking-[0.5em] text-blush-deep">
              {brand}
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold leading-snug md:text-4xl lg:text-5xl lg:leading-[1.35]">
              {title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-ink-foreground transition hover:opacity-90 md:px-9 md:py-4 md:text-lg"
              >
                {buttonText} <ArrowLeft className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-3xl border border-blush-deep/25 md:translate-x-6 md:translate-y-6"
              aria-hidden="true"
            />
            <div
              className="absolute -top-6 -left-6 size-32 rounded-full bg-blush/50 blur-2xl md:-top-8 md:-left-8 md:size-40"
              aria-hidden="true"
            />
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              width={768}
              height={960}
              className="relative aspect-4/5 w-full rounded-t-full rounded-b-3xl object-cover object-center shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
