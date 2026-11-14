import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

import catPerfumes from "../../assets/3.jfif";
import catSkincare from "../../assets/4.jfif";
import catBody from "../../assets/1.jfif";
import catHair from "../../assets/2.jfif";

const SLIDES_DATA = [
  {
    id: "perfumes",
    subtitle: "عطور سديم",
    title: "عطرك.. توقيعك الخاص",
    description: "اكتشفي عطورًا تعبّر عن شخصيتك وتبقى في الذاكرة.",
    buttonText: "تسوقي الآن",
    link: "/shop?category=perfumes",
    image: catPerfumes,
    alt: "مجموعة عطور سديم",
    objectPosition: "lg:object-[20%_center]",
  },
  {
    id: "skincare",
    subtitle: "العناية بالبشرة",
    title: "بشرة مشرقة تفيض بالنضارة",
    description: "منتجات مخصصة لترطيب وتغذية بشرتك بأعلى جودة.",
    buttonText: "اكتشفي المجموعة",
    link: "/shop?category=skincare",
    image: catSkincare,
    alt: "مجموعة العناية بالبشرة",
    objectPosition: "lg:object-[18%_center]",
  },
  {
    id: "body",
    subtitle: "العناية بالجسم",
    title: "نعومة ودلال يستحقه جسمك",
    description: "روتين متكامل لعناية فائقة وترطيب يدوم طوال اليوم.",
    buttonText: "تسوقي المجموعة",
    link: "/shop?category=body",
    image: catBody,
    alt: "مجموعة العناية بالجسم",
    objectPosition: "lg:object-[22%_center]",
  },
  {
    id: "hair",
    subtitle: "العناية بالشعر",
    title: "شعر قوي، حيوي، ولامع",
    description: "زيوت ومستحضرات طبيعية تمنح شعرك الكثافة واللمعان.",
    buttonText: "تسوقي الآن",
    link: "/shop?category=hair",
    image: catHair,
    alt: "مجموعة العناية بالشعر",
    objectPosition: "lg:object-[16%_center]",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Preload the next slide image
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % SLIDES_DATA.length;
    const nextImage = new Image();

    nextImage.src = SLIDES_DATA[nextIndex].image;
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length,
    );
  };

  const activeSlide = SLIDES_DATA[currentSlide];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="عروض سديم"
      className="relative isolate overflow-hidden"
    >
      <div className="relative h-110 sm:h-140 lg:h-160">
        {/* Slides */}
        <div id="hero-slides" aria-live="off" className="absolute inset-0">
          {SLIDES_DATA.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} من ${SLIDES_DATA.length}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`hero-slide absolute inset-0 lg:bg-blush-soft transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Decorative blurred background */}
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-50 blur-3xl lg:block"
                />

                {/* Main image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={768}
                  height={960}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className={`hero-main-image relative h-full w-full object-cover object-center lg:object-contain ${slide.objectPosition}`}
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-linear-to-l from-background/95 via-background/60 to-background/15" />

                <div className="absolute inset-0 bg-blush/10" />
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-4 pb-16 md:px-8">
          <div
            key={activeSlide.id}
            className="animate-rise motion-reduce:animate-none max-w-lg"
          >
            <p className="mb-3 text-sm font-semibold tracking-wide text-blush-deep">
              {activeSlide.subtitle}
            </p>

            <h1 className="font-display text-4xl leading-tight font-bold md:text-6xl">
              {activeSlide.title}
            </h1>

            <p className="mt-4 max-w-md text-base leading-8 text-muted-foreground md:text-lg">
              {activeSlide.description}
            </p>

            <div className="mt-7">
              <a
                href={activeSlide.link}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-ink-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2"
              >
                {activeSlide.buttonText}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="الشريحة السابقة"
          aria-controls="hero-slides"
          className="absolute top-1/2 right-3 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-background/80 backdrop-blur transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep md:grid cursor-pointer"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="الشريحة التالية"
          aria-controls="hero-slides"
          className="absolute top-1/2 left-3 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-background/80 backdrop-blur transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep md:grid cursor-pointer"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        {/* Slide indicators */}
        <div
          className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-2"
          aria-label="اختيار الشريحة"
        >
          {SLIDES_DATA.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                aria-controls="hero-slides"
                className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2 ${
                  isActive ? "w-7 bg-ink" : "w-2 bg-ink/30 hover:bg-ink/50"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
