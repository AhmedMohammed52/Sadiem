import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

import { SLIDES_DATA } from "../../data/heroSlides";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlide = SLIDES_DATA[currentSlide];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextIndex = (currentSlide + 1) % SLIDES_DATA.length;
    const nextSlide = SLIDES_DATA[nextIndex];

    const mobileImage = new Image();
    mobileImage.src = nextSlide.image;

    const desktopImage = new Image();
    desktopImage.src = nextSlide.desktopImage;
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length,
    );
  };

  return (
    <section
      dir="rtl"
      aria-roledescription="carousel"
      aria-label="عروض سديم"
      className="sadeem-hero relative isolate h-[clamp(650px,88svh,760px)] overflow-hidden lg:h-[min(620px,calc(100svh-80px))]"
    >
      {/* عرض الموبايل */}
      <div className="relative h-full lg:hidden">
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
                className={`absolute inset-0 flex flex-col items-center overflow-hidden px-5 pb-16 pt-8 transition-opacity duration-700 ease-in-out sm:px-8 sm:pt-10 ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                {/* خلفية الهوية */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(243,192,212,0.17)_0%,rgba(243,192,212,0.07)_42%,transparent_75%)]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-28 top-10 size-64 rounded-full bg-[radial-gradient(circle,#F4D0DF_0%,rgba(244,208,223,0.3)_42%,transparent_72%)] blur-[45px]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-[radial-gradient(circle,#EFAFC9_0%,rgba(239,175,201,0.2)_45%,transparent_75%)] blur-[50px]"
                />

                {/* محتوى الشريحة */}
                <div
                  key={`content-${slide.id}`}
                  className="hero-content-enter relative z-20 w-full shrink-0 text-center"
                >
                  {/* اسم القسم */}
                  <div className="mb-3 flex items-center justify-center gap-2.5">
                    <span className="h-px w-7 bg-blush-deep/50" />

                    <p className="text-xs font-bold tracking-[0.12em] text-blush-deep sm:text-sm">
                      {slide.subtitle}
                    </p>

                    <span className="h-px w-7 bg-blush-deep/50" />
                  </div>

                  {/* العنوان الرئيسي */}
                  <h1 className="mx-auto max-w-85 font-display text-[32px] leading-[1.45] font-bold text-ink sm:max-w-md sm:text-[38px]">
                    {slide.title}
                  </h1>

                  {/* الوصف */}
                  <p className="mx-auto mt-2.5 max-w-77.5 text-[13px] leading-7 text-muted-foreground sm:max-w-sm sm:text-sm">
                    {slide.description}
                  </p>
                </div>

                {/* عرض المنتج */}
                <div className="relative z-10 my-2 flex min-h-0 w-full flex-1 items-center justify-center">
                  {/* التوهج الرئيسي */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 size-77.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#F3C0D4_0%,#EFAFC9_28%,#F4D0DF_52%,rgba(244,208,223,0.12)_68%,transparent_78%)] blur-[35px] sm:size-92.5"
                  />

                  {/* توهج وردي يمين */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[2%] top-[22%] h-44 w-40 rounded-full bg-[radial-gradient(ellipse,#EBA8C0_0%,rgba(235,168,192,0.5)_42%,transparent_75%)] blur-[45px]"
                  />

                  {/* توهج وردي يسار */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[12%] left-[2%] h-48 w-44 rounded-full bg-[radial-gradient(ellipse,#F2C1D5_0%,rgba(242,193,213,0.45)_45%,transparent_75%)] blur-[45px]"
                  />

                  {/* إضاءة مركزية */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,239,245,0.9)_0%,rgba(255,239,245,0.35)_48%,transparent_75%)] blur-[35px] sm:size-60"
                  />

                  {/* نقاط زخرفية */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[17%] top-[24%] size-2 rounded-full bg-[#E9AFCB]/80 blur-[1px]"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[15%] top-[32%] size-3 rounded-full bg-[#EBA8C0]/80 blur-[2px]"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[22%] right-[24%] size-2 rounded-full bg-[#F2C1D5] blur-[1px]"
                  />

                  {/* ظل المنتج */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[8%] left-1/2 h-6 w-44 -translate-x-1/2 rounded-[50%] bg-[#D98BA9]/25 blur-2xl sm:w-56"
                  />

                  {/* صورة المنتج */}
                  <div
                    key={`product-${slide.id}`}
                    className="hero-product-enter relative z-10 flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={slide.desktopImage}
                      alt={slide.alt}
                      width="700"
                      height="700"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      className="hero-product-image h-full w-full object-contain drop-shadow-[0_22px_22px_rgba(70,35,50,0.13)]"
                    />
                  </div>
                </div>

                {/* زر الاكتشاف */}
                <div className="relative z-20 mt-1 shrink-0">
                  <a
                    href={slide.link}
                    className="group inline-flex min-w-47.5 items-center justify-center gap-3 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(23,23,23,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-blush-deep hover:shadow-[0_10px_28px_rgba(217,139,169,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2"
                  >
                    {slide.buttonText}

                    <ArrowLeft
                      className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* عرض سطح المكتب */}
      <div className="relative mx-auto hidden h-full max-w-[1600px] items-center px-8 lg:flex xl:px-16">
        {/* محتوى الشريحة */}
        <div className="relative z-20 flex w-[55%] items-center justify-start">
          <div
            key={activeSlide.id}
            className="hero-content-enter w-full max-w-162.5 pr-4 xl:pr-8 lg:-translate-y-4"
          >
            {/* اسم القسم */}
            <p className="mb-5 flex items-center gap-3 text-base font-bold tracking-wide text-blush-deep">
              <span className="h-px w-10 bg-blush-deep" />
              {activeSlide.subtitle}
            </p>

            {/* العنوان الرئيسي */}
            <h1 className="font-display text-5xl leading-[1.4] font-bold text-ink xl:text-6xl">
              {activeSlide.title}
            </h1>

            {/* الوصف */}
            <p className="mt-5 max-w-135 text-lg leading-9 text-muted-foreground">
              {activeSlide.description}
            </p>

            {/* زر الاكتشاف */}
            <div className="mt-8">
              <a
                href={activeSlide.link}
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-9 py-4 font-semibold text-white shadow-lg shadow-ink/10 transition duration-300 hover:-translate-y-1 hover:bg-blush-deep hover:shadow-blush/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2"
              >
                {activeSlide.buttonText}

                <ArrowLeft
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        {/* عرض المنتج */}
        <div className="relative flex h-full w-[45%] items-center justify-center">
          {/* التوهج الوردي الرئيسي */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-122.5 w-122.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#F3C0D4_0%,#EFAFC9_30%,#F4D0DF_55%,transparent_78%)] blur-[45px]"
          />

          {/* توهج وردي يمين */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[5%] top-[22%] z-0 h-65 w-75 rounded-full bg-[radial-gradient(ellipse,#EBA8C0_0%,rgba(235,168,192,0.65)_45%,transparent_78%)] blur-[55px]"
          />

          {/* توهج وردي يسار */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[4%] top-[15%] z-0 h-67.5 w-70 rounded-full bg-[radial-gradient(ellipse,#F2C1D5_0%,rgba(242,193,213,0.65)_45%,transparent_78%)] blur-[55px]"
          />

          {/* إضاءة مركزية */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-1 h-70 w-70 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,239,245,0.85)_0%,rgba(255,239,245,0.35)_48%,transparent_75%)] blur-[45px]"
          />

          {/* نقاط زخرفية */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[15%] top-[20%] z-2 size-3 rounded-full bg-[#E9AFCB] blur-[2px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[14%] top-[32%] z-2 size-4 rounded-full bg-[#EBA8C0] blur-[2px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[22%] left-[30%] z-2 size-3 rounded-full bg-[#F2C1D5] blur-[2px]"
          />

          {/* صورة المنتج */}
          <div
            key={currentSlide}
            className="hero-product-enter relative z-10 flex h-125 w-full items-center justify-center xl:h-140"
          >
            <img
              src={activeSlide.desktopImage}
              alt={activeSlide.alt}
              width="700"
              height="700"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="hero-product-image h-full w-full object-contain"
            />
          </div>

          {/* ظل المنتج */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[13%] left-1/2 z-0 h-8 w-62.5 -translate-x-1/2 rounded-[50%] bg-[#D98BA9]/30 blur-2xl"
          />
        </div>
      </div>

      {/* التنقل بين الشرائح */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="الشريحة السابقة"
        aria-controls="hero-slides"
        className="absolute right-5 top-1/2 z-60 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D98BA9]/25 bg-white/95 text-ink shadow-[0_4px_20px_rgba(70,35,50,0.10)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blush-deep hover:bg-white hover:text-blush-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2 md:flex lg:right-7"
      >
        <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="الشريحة التالية"
        aria-controls="hero-slides"
        className="absolute left-5 top-1/2 z-60 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D98BA9]/25 bg-white/95 text-ink shadow-[0_4px_20px_rgba(70,35,50,0.10)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blush-deep hover:bg-white hover:text-blush-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2 md:flex lg:left-7"
      >
        <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
      </button>

      {/* مؤشرات الشرائح */}
      <div
        className="absolute inset-x-0 bottom-4 z-60 flex items-center justify-center gap-2 lg:bottom-5"
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
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2 ${
                isActive ? "w-8 bg-blush-deep" : "w-2 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
