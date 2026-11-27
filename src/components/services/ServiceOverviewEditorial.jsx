import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Clock,
  Sparkles,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { useStore } from '../../store/useStore';
import { resolveServiceImage } from './ServicesHero';

gsap.registerPlugin(ScrollTrigger);

// قیدهای استاندارد برای هماهنگی کامل بین فرانت‌اند و فرم ادمین پنل
export const ROADMAP_LIMITS = {
  maxSteps: 5,
  maxTitleChars: 28,
  maxShortChars: 55,
};

const DESKTOP_GRID_COLS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

const truncateWithLimit = (text, maxChars) => {
  const clean = String(text || '').trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars - 1).trimEnd()}…`;
};

const FALLBACK_SUB_IMAGES = {
  'website-design': [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=80',
  ],
  'graphic-design': [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80',
  ],
  branding: [
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=80',
  ],
  print: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
  ],
};

function EditorialImage({ fileName, fallbackUrl, alt, className = '' }) {
  const src = resolveServiceImage(fileName) || fallbackUrl;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        if (!e.currentTarget.dataset.tryPublic && fileName) {
          e.currentTarget.dataset.tryPublic = 'true';
          e.currentTarget.src = `/images/${fileName}`;
        } else if (!e.currentTarget.dataset.tryFallback) {
          e.currentTarget.dataset.tryFallback = 'true';
          e.currentTarget.src = fallbackUrl;
        }
      }}
      className={className}
    />
  );
}

export default function ServiceOverviewEditorial({ activeService, onSelectService }) {
  const { lang } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const openProjectModal = useStore((state) => state.openProjectModal);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const to = t.servicesPage?.overview || {};

  const services = db?.services || [];
  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.slug === activeService)
  );
  const service = services[activeIndex] || services[0];
  const nextService =
    services.length > 1 ? services[(activeIndex + 1) % services.length] : null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const sectionRef = useRef(null);
  const mainPhotoRef = useRef(null);
  const timelineWrapRef = useRef(null);
  const horizontalFillRef = useRef(null);
  const verticalFillRef = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  // حداکثر ۵ مرحله از دیتای db.json
  const roadmap = Array.isArray(service?.roadmap)
    ? service.roadmap.slice(0, ROADMAP_LIMITS.maxSteps)
    : [];
  const stepCount = roadmap.length;

  // ریست عکس و انیمیشن متن هنگام تغییر خدمت
  useEffect(() => {
    setActivePhotoIdx(0);
    if (!sectionRef.current || !service) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.editorial-copy-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [service?.slug]);

  // انیمیشن نرم تغییر عکس بزرگ گالری
  useEffect(() => {
    if (!mainPhotoRef.current) return;
    gsap.fromTo(
      mainPhotoRef.current,
      { opacity: 0.35, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, [activePhotoIdx, service?.slug]);

  // تایم‌لاین زنده: پنهان‌بودن کامل تا وسط صفحه، سپس حرکت آرام خط و نمایان شدن نقطه به نقطه
  useLayoutEffect(() => {
    if (!timelineWrapRef.current || stepCount === 0) return;

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray('.roadmap-dot', timelineWrapRef.current);
      const texts = gsap.utils.toArray('.roadmap-text', timelineWrapRef.current);
      const hint = timelineWrapRef.current.querySelector('.roadmap-scroll-hint');

      const buildStepTimeline = (fillEl, axisProp, origin, scrollDistance) => {
        if (fillEl) {
          gsap.set(fillEl, { [axisProp]: 0, transformOrigin: origin });
        }
        gsap.set(dots, { opacity: 0, scale: 0.45 });
        gsap.set(texts, { opacity: 0, y: 18 });
        if (hint) gsap.set(hint, { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: timelineWrapRef.current,
            start: 'center center',
            end: () => `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: 1.3,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 0.14 });

        if (hint) {
          tl.to(hint, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.06);
        }

        const segments = Math.max(1, stepCount - 1);

        for (let i = 0; i < stepCount; i += 1) {
          if (i > 0 && fillEl) {
            tl.to(fillEl, {
              [axisProp]: i / segments,
              duration: 0.95,
              ease: 'none',
            });
          }

          if (dots[i]) {
            tl.to(dots[i], {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: 'back.out(1.6)',
            });
          }

          if (texts[i]) {
            tl.to(
              texts[i],
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
              },
              '<0.08'
            );
          }
        }

        tl.to({}, { duration: 0.5 });
      };

      const mm = gsap.matchMedia();

      // دسکتاپ: تایم‌لاین افقی
      mm.add('(min-width: 1024px)', () => {
        buildStepTimeline(
          horizontalFillRef.current,
          'scaleX',
          isRTL ? 'right center' : 'left center',
          Math.max(1500, stepCount * 420)
        );
      });

      // موبایل و تبلت: تایم‌لاین عمودی
      mm.add('(max-width: 1023px)', () => {
        buildStepTimeline(
          verticalFillRef.current,
          'scaleY',
          'top center',
          Math.max(1150, stepCount * 280)
        );
      });
    }, timelineWrapRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [stepCount, isRTL]);

  if (!service) return null;

  const title = getLocalized(service.title);
  const fullDesc = getLocalized(service.fullDescription);
  const timeline = getLocalized(service.estimatedTimeline);
  const idealForList = service.idealFor?.[currentLang] || service.idealFor?.en || [];
  const subImages = service.subImages || [];
  const fallbacks =
    FALLBACK_SUB_IMAGES[service.slug] || FALLBACK_SUB_IMAGES['website-design'];
  const galleryCount = Math.max(subImages.length, 3);

  const handleStepPhoto = (dir) => {
    setActivePhotoIdx((prev) => (prev + dir + galleryCount) % galleryCount);
  };

  const handleGoNextService = () => {
    if (!nextService) return;
    if (onSelectService) {
      onSelectService(nextService.slug);
    } else {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('category', nextService.slug);
      setSearchParams(nextParams, { replace: true });
    }
  };

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;
  const NextServiceArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const gridColsClass = DESKTOP_GRID_COLS[stepCount] || 'lg:grid-cols-5';

  // شروع خط دقیقاً از مرکز دایره اول تا مرکز دایره آخر
  const desktopLineInset =
    stepCount > 1
      ? `calc((100% - ${(stepCount - 1) * 20}px) / ${stepCount * 2})`
      : '50%';

  return (
    <section
      id="service-details-section"
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-20 md:py-28 bg-slate-100 dark:bg-[#030712] transition-colors duration-500 scroll-mt-6"
    >
      {/* ظرف جداگانه برای هاله نوری تا هیچ تداخلی با pin تایم‌لاین ایجاد نشود */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-blue-500/8 dark:bg-sky-500/10 blur-[130px]" />
      </div>

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-14 md:space-y-20">
        {/* ====================================================================
            ۱. معرفی کامل خدمت + متادیتا + دکمه‌های CTA
           ==================================================================== */}
        <div
          key={service.id}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end"
        >
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            <div className="editorial-copy-item flex items-center gap-3 mb-4">
              <span className="font-body text-xs md:text-sm font-extrabold tracking-[0.22em] text-blue-900 dark:text-sky-400">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="w-10 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
              <span className="font-body text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-slate-600 dark:text-slate-400">
                {to.badge || (isRTL ? 'معرفی تخصصی خدمت' : 'SERVICE OVERVIEW')}
              </span>
            </div>

            <h2 className="editorial-copy-item font-heading font-black tracking-tight text-slate-950 dark:text-white mb-5">
              {title}
            </h2>

            <p className="editorial-copy-item font-body leading-relaxed text-slate-700 dark:text-slate-300 mb-8 max-w-2xl">
              {fullDesc}
            </p>

            {/* دکمه درخواست پروژه + دکمه رفتن به خدمت بعدی */}
            <div className="editorial-copy-item flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => openProjectModal({ service: service.slug })}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-bold text-sm lg:text-base shadow-[0_14px_30px_-8px_rgba(23,37,84,0.35)] dark:shadow-[0_14px_30px_-8px_rgba(56,189,248,0.4)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>
                  {to.orderButton || (isRTL ? 'ثبت سفارش این خدمت' : 'Request This Service')}
                </span>
                <ActionArrow
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>

              {nextService && (
                <button
                  type="button"
                  onClick={handleGoNextService}
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-blue-50 text-slate-900 border border-slate-300 hover:border-blue-950/60 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:border-sky-400/70 font-body text-sm lg:text-base font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400">
                    {isRTL ? 'خدمت بعدی:' : 'Next:'}
                  </span>
                  <span className="font-bold text-blue-950 dark:text-sky-300">
                    {getLocalized(nextService.title)}
                  </span>
                  <NextServiceArrow
                    size={17}
                    className={`text-blue-950 dark:text-sky-400 transition-transform duration-300 ${
                      isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="editorial-copy-item lg:col-span-5 w-full border-y border-slate-300/80 dark:border-white/12 divide-y divide-slate-300/70 dark:divide-white/10">
            {timeline && (
              <div className="py-4 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 font-body text-sm lg:text-base font-semibold text-slate-600 dark:text-slate-400">
                  <Clock size={17} className="text-blue-900 dark:text-sky-400 shrink-0" />
                  <span>
                    {to.timelineLabel || (isRTL ? 'بازه زمانی تقریبی' : 'Estimated Timeline')}
                  </span>
                </span>
                <strong className="font-body text-sm lg:text-base font-extrabold text-slate-950 dark:text-white">
                  {timeline}
                </strong>
              </div>
            )}

            {idealForList.length > 0 && (
              <div className="py-4 space-y-3">
                <span className="inline-flex items-center gap-2 font-body text-sm lg:text-base font-semibold text-slate-600 dark:text-slate-400">
                  <Sparkles size={16} className="text-blue-900 dark:text-sky-400 shrink-0" />
                  <span>{to.idealForLabel || (isRTL ? 'مناسب برای' : 'Ideal For')}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {idealForList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full font-body text-xs lg:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-300/80 dark:border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            ۲. ویترین تعاملی تصاویر خدمت
           ==================================================================== */}
        <div className="w-full space-y-4">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] rounded-[28px] overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/90 dark:border-white/15 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.22)] dark:shadow-[0_28px_72px_-16px_rgba(0,0,0,0.8)]">
            <div ref={mainPhotoRef} className="w-full h-full">
              <EditorialImage
                key={`${service.slug}-${activePhotoIdx}`}
                fileName={subImages[activePhotoIdx]}
                fallbackUrl={fallbacks[activePhotoIdx]}
                alt={`${title} — ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover block"
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none"
            />

            <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 flex items-center justify-between gap-3 z-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 font-body text-xs lg:text-sm font-bold tracking-[0.2em] text-white">
                {String(activePhotoIdx + 1).padStart(2, '0')} / {String(galleryCount).padStart(2, '0')}
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20">
                <button
                  type="button"
                  onClick={() => handleStepPhoto(-1)}
                  aria-label={isRTL ? 'تصویر قبلی' : 'Previous image'}
                  className="w-9 h-9 rounded-full text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <PrevIcon size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => handleStepPhoto(1)}
                  aria-label={isRTL ? 'تصویر بعدی' : 'Next image'}
                  className="w-9 h-9 rounded-full text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <NextIcon size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
            {[0, 1, 2].map((idx) => {
              const isSelected = activePhotoIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  aria-label={`${title} ${idx + 1}`}
                  aria-pressed={isSelected}
                  className={`group relative w-full aspect-[16/9] sm:aspect-[16/8] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-blue-950 dark:border-sky-400 shadow-lg opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <EditorialImage
                    fileName={subImages[idx]}
                    fallbackUrl={fallbacks[idx]}
                    alt={`${title} thumb ${idx + 1}`}
                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute bottom-2.5 start-2.5 px-2.5 py-0.5 rounded-full text-xs font-body font-bold tracking-widest backdrop-blur-md transition-colors ${
                      isSelected
                        ? 'bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950'
                        : 'bg-slate-950/70 text-white/90'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            ۳. تایم‌لاین زنده اختصاصی خدمت (پنهان تا وسط صفحه -> نمایان شدن نقطه به نقطه با اسکرول)
           ==================================================================== */}
        {stepCount > 0 && (
          <div
            ref={timelineWrapRef}
            className="py-12 md:py-16 border-t border-slate-300/80 dark:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-10 md:mb-14">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
                <span className="font-body text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-blue-900 dark:text-sky-300">
                  {isRTL ? `مسیر اجرای ${title}` : `${title} Roadmap`}
                </span>
              </div>

              <span className="roadmap-scroll-hint font-body text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                {isRTL
                  ? 'برای مشاهده مراحل اسکرول کنید'
                  : 'Scroll to reveal milestones'}
              </span>
            </div>

            <div className="relative">
              {/* خط مسیر افقی دسکتاپ */}
              {stepCount > 1 && (
                <div
                  aria-hidden="true"
                  style={{ insetInline: desktopLineInset }}
                  className="hidden lg:block absolute top-[23px] h-[2px] rounded-full bg-slate-300/60 dark:bg-slate-800/80 overflow-hidden z-0 pointer-events-none"
                >
                  <div
                    ref={horizontalFillRef}
                    className={`w-full h-full rounded-full ${
                      isRTL
                        ? 'bg-gradient-to-l from-blue-950 via-blue-600 to-sky-400 dark:from-sky-500 dark:via-sky-300 dark:to-blue-400'
                        : 'bg-gradient-to-r from-blue-950 via-blue-600 to-sky-400 dark:from-sky-500 dark:via-sky-300 dark:to-blue-400'
                    }`}
                  />
                </div>
              )}

              {/* خط مسیر عمودی موبایل و تبلت */}
              {stepCount > 1 && (
                <div
                  aria-hidden="true"
                  className="lg:hidden absolute top-[22px] bottom-[36px] start-[21px] w-[2px] rounded-full bg-slate-300/60 dark:bg-slate-800/80 overflow-hidden z-0 pointer-events-none"
                >
                  <div
                    ref={verticalFillRef}
                    className="w-full h-full rounded-full bg-gradient-to-b from-blue-950 via-blue-600 to-sky-400 dark:from-sky-500 dark:via-sky-300 dark:to-blue-400"
                  />
                </div>
              )}

              {/* نقاط و توضیحات (بدون هاردکد سایز روی h3 و p برای پیروی از تایپوگرافی پروژه) */}
              <div className={`grid grid-cols-1 ${gridColsClass} gap-6 lg:gap-5 relative z-20`}>
                {roadmap.map((node, idx) => {
                  const stepLabel = node.step || String(idx + 1).padStart(2, '0');
                  const nodeTitle = truncateWithLimit(
                    getLocalized(node.title),
                    ROADMAP_LIMITS.maxTitleChars
                  );
                  const nodeShort = truncateWithLimit(
                    getLocalized(node.short),
                    ROADMAP_LIMITS.maxShortChars
                  );

                  return (
                    <div
                      key={`roadmap-node-${idx}`}
                      className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:text-center lg:gap-4"
                    >
                      <div className="roadmap-dot opacity-0 relative shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-body text-xs lg:text-sm leading-none font-black tracking-wider border-2 bg-blue-950 text-white border-blue-900 shadow-[0_8px_22px_-4px_rgba(23,37,84,0.45)] dark:bg-sky-400 dark:text-slate-950 dark:border-sky-300 dark:shadow-[0_8px_24px_-4px_rgba(56,189,248,0.55)] will-change-transform">
                        {stepLabel}
                      </div>

                      <div className="roadmap-text opacity-0 pt-0.5 lg:pt-0 will-change-transform">
                        <h3 className="font-body font-bold text-slate-950 dark:text-white mb-1.5">
                          {nodeTitle}
                        </h3>
                        <p className="font-body text-slate-600 dark:text-slate-400">
                          {nodeShort}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}