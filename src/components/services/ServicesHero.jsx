import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Header from '../Header';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

/* خواندن خودکار تصاویر از مسیر src/assets/images/services */
const rawImages = import.meta.glob(
  '../../assets/images/services/*.{webp,png,jpg,jpeg}',
  { eager: true, import: 'default' }
);

// کپی گرفتن از لیست تصاویر تا موارد انتخاب‌شده را حذف کنیم و تکراری نشوند
let availableImages = Object.entries(rawImages);

/* انتخاب قطعی و غیرتکراری تصویر برای هر سرویس */
function getSlideImage(keywords) {
  // ۱. جستجو بر اساس کلمات کلیدی
  let matchedIndex = availableImages.findIndex(([path]) => {
    const fileName = path.split('/').pop().toLowerCase();
    return keywords.some((kw) => fileName.includes(kw));
  });

  // ۲. اگر کلمه کلیدی پیدا نشد، اولین تصویر باقی‌مانده و استفاده‌نشده را بردار
  if (matchedIndex === -1 && availableImages.length > 0) {
    matchedIndex = 0;
  }

  // ۳. استخراج آدرس عکس و حذف آن از لیست تا در اسلاید بعدی تکرار نشود
  if (matchedIndex !== -1) {
    const selectedUrl = availableImages[matchedIndex][1];
    availableImages.splice(matchedIndex, 1);
    return selectedUrl;
  }

  return '';
}

const HERO_SLIDES = [
{
    id: 1,
    key: 'branding',
    slug: 'branding',
    image: getSlideImage(['brand', 'branding', 'logo', 'identity']),
  },
    {
    id: 2,
    key: 'graphic',
    slug: 'graphic-design',
    image: getSlideImage(['graphic', 'poster', 'art', 'illustration']),
  },
    {
    id: 3,
    key: 'print',
    slug: 'print',
    image: getSlideImage(['print', 'printing', 'pack', 'packaging', 'ads']),
  },
  {
    id: 4,
    key: 'web',
    slug: 'website-design',
    image: getSlideImage(['web', 'website', 'site', 'ui', 'ux', 'dev']),
  },
];


export default function ServicesHero() {
  const { lang } = useParams();
  const { hash } = useLocation();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const t = currentLang === 'en' ? en : fa;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroRef = useRef(null);
  const imageRefs = useRef([]);
  const sloganRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  /* هماهنگی با لینک کارت‌های صفحه اصلی (#slug) */
  useEffect(() => {
    if (hash) {
      const targetSlug = hash.replace('#', '');
      const foundIndex = HERO_SLIDES.findIndex((s) => s.slug === targetSlug);
      if (foundIndex !== -1) {
        setActiveIndex(foundIndex);
      }
    }
  }, [hash]);

  /* تایمر قطعی برای جابه‌جایی خودکار هر 3 ثانیه */
  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  /* اجرای انیمیشن نرم هنگام تغییر activeIndex بدون بازنشانی مخرب */
  useEffect(() => {
    imageRefs.current.forEach((imgEl, idx) => {
      if (!imgEl) return;
      gsap.killTweensOf(imgEl);

      if (idx === activeIndex) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
          }
        );
      } else {
        gsap.to(imgEl, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });

    const textElements = [sloganRef.current, titleRef.current, descRef.current].filter(Boolean);
    gsap.killTweensOf(textElements);
    gsap.fromTo(
      textElements,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, [activeIndex, currentLang]);

  const activeSlide = HERO_SLIDES[activeIndex];
  const slideContent = t.servicesHero?.slides?.[activeSlide.key] || {};

  return (
    <section
      ref={heroRef}
      className="relative w-screen max-w-full h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none bg-slate-50 dark:bg-[#020617] transition-colors duration-500"
    >
      {/* فراخوانی هدر در بالای صفحه */}
      <div className="absolute top-0 inset-x-0 z-50 w-full">
        <Header />
      </div>

      {/* ۱. تصاویر پس‌زمینه اسلایدر */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        {HERO_SLIDES.map((slide, index) => {
          const itemText = t.servicesHero?.slides?.[slide.key] || {};
          return (
            <div
              key={slide.id}
              ref={(el) => (imageRefs.current[index] = el)}
              style={{ opacity: index === 0 ? 1 : 0 }}
              className={`absolute inset-0 w-full h-full [will-change:transform,opacity] [backface-visibility:hidden] ${
                index === activeIndex ? 'z-10' : 'z-0'
              }`}
            >
              {slide.image && (
                <img
                  src={slide.image}
                  alt={itemText.title || slide.slug}
                  className="w-full h-full object-cover object-center brightness-105 contrast-[1.02]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ۲. سایه بسیار ملایم در لبه بالایی برای هدر */}
      <div className="absolute inset-x-0 top-0 h-28 z-10 pointer-events-none bg-gradient-to-b from-slate-900/20 dark:from-[#020617]/50 to-transparent" />

      {/* ۳. گرادیان نوری از پایین به بالا */}
      <div className="absolute inset-x-0 bottom-0 h-[62%] z-20 pointer-events-none bg-gradient-to-t from-slate-50 via-slate-50/85 to-transparent dark:from-[#020617] dark:via-[#030b21]/80 dark:to-transparent transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 h-[48%] z-20 pointer-events-none bg-[radial-gradient(65%_60%_at_50%_100%,rgba(56,189,248,0.22)_0%,rgba(37,99,235,0.1)_50%,transparent_100%)] dark:bg-[radial-gradient(65%_60%_at_50%_100%,rgba(56,189,248,0.28)_0%,rgba(37,99,235,0.15)_50%,transparent_100%)]" />

      {/* ۴. محتوای متنی */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 mt-auto pb-24 md:pb-28 flex flex-col items-center justify-end text-center">
        <div
          ref={sloganRef}
          className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-4 [will-change:transform,opacity]"
        >
          <span className="w-8 sm:w-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-sky-500 to-blue-600 dark:via-sky-400 dark:to-sky-200" />
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase text-sky-700 dark:text-sky-300 font-body drop-shadow-[0_1px_8px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_10px_rgba(2,6,23,0.9)]">
            {slideContent.badge}
          </span>
          <span className="w-8 sm:w-12 h-[2px] rounded-full bg-gradient-to-l from-transparent via-sky-500 to-blue-600 dark:via-sky-400 dark:to-sky-200" />
        </div>

        <h1
          ref={titleRef}
          className="max-w-4xl text-4xl sm:text-5xl md:text-7xl font-black font-heading tracking-tight leading-[1.15] mb-4 [will-change:transform,opacity]"
        >
          <span className="bg-gradient-to-b from-slate-950 via-slate-800 to-blue-900 dark:from-white dark:via-white dark:to-sky-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_6px_24px_rgba(2,6,23,0.95)]">
            {slideContent.title}
          </span>
        </h1>

        <p
          ref={descRef}
          className="max-w-2xl text-sm sm:text-base md:text-lg font-medium text-slate-700 dark:text-slate-200 font-body leading-relaxed drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_4px_14px_rgba(2,6,23,0.95)] [will-change:transform,opacity]"
        >
          {slideContent.description}
        </p>
      </div>

      {/* ۵. نشانگرهای نقطه‌ای */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute bottom-8 md:bottom-10 inset-x-0 z-30 flex items-center justify-center gap-3 w-fit mx-auto px-4 py-2"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          const itemText = t.servicesHero?.slides?.[slide.key] || {};
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={itemText.title || `Slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                isActive
                  ? 'w-11 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-400 dark:from-sky-200 dark:via-sky-400 dark:to-blue-500 shadow-[0_0_14px_rgba(37,99,235,0.6)] dark:shadow-[0_0_18px_rgba(56,189,248,0.95)]'
                  : 'w-2.5 bg-slate-400/60 dark:bg-slate-400/35 border border-slate-500/30 dark:border-white/30 hover:bg-sky-500/70 dark:hover:bg-sky-300/60'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
