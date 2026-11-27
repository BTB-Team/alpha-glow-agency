import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { Clock, Sparkles, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { useStore } from '../../store/useStore';
import { resolveServiceImage } from './ServicesHero';

// تصاویر فال‌بک موقت در صورت نبودن فایل‌های محلی subImages
const FALLBACK_SUB_IMAGES = {
  'website-design': [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
  ],
  'graphic-design': [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80',
  ],
  branding: [
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1000&q=80',
  ],
  print: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80',
  ],
};

function BentoImage({ fileName, fallbackUrl, alt }) {
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
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  );
}

export default function ServiceOverviewBento({ activeService }) {
  const { lang } = useParams();
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

  const sectionRef = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  useEffect(() => {
    if (!sectionRef.current || !service) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-card',
        { opacity: 0, y: 24, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [service?.slug]);

  if (!service) return null;

  const title = getLocalized(service.title);
  const fullDesc = getLocalized(service.fullDescription);
  const timeline = getLocalized(service.estimatedTimeline);
  const idealForList = service.idealFor?.[currentLang] || service.idealFor?.en || [];
  const subImages = service.subImages || [];
  const fallbacks =
    FALLBACK_SUB_IMAGES[service.slug] || FALLBACK_SUB_IMAGES['website-design'];

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      id="service-details-section"
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-16 md:py-24 overflow-hidden bg-slate-100 dark:bg-[#030712] transition-colors duration-500 scroll-mt-6"
    >
      {/* هاله‌های نوری بسیار ملایم پس‌زمینه برای تقویت حس شیشه‌ای کارت‌ها */}
      <div
        aria-hidden="true"
        className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[130px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-1/4 w-80 h-80 rounded-full bg-sky-400/10 dark:bg-indigo-600/15 blur-[120px] pointer-events-none"
      />

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* شبکه بِنتو ۱۲ ستونه */}
        <div
          key={service.id}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5"
        >
          {/* ۱. کارت اصلی توضیحات و CTA (۷ ستون) */}
          <div className="bento-card lg:col-span-7 relative rounded-[28px] p-7 sm:p-9 lg:p-10 flex flex-col justify-between bg-white/80 dark:bg-[#091229]/75 backdrop-blur-2xl border border-slate-200/90 dark:border-white/12 shadow-[0_20px_50px_-18px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.14)]">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-body font-extrabold tracking-[0.2em] bg-blue-950/8 text-blue-950 dark:bg-sky-400/15 dark:text-sky-300 border border-blue-950/10 dark:border-sky-300/25">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-xs font-bold tracking-[0.22em] uppercase text-blue-900 dark:text-sky-300">
                  {to.badge || (isRTL ? 'معرفی تخصصی خدمت' : 'SERVICE OVERVIEW')}
                </span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-[42px] tracking-tight text-slate-950 dark:text-white leading-[1.15] mb-5">
                {title}
              </h2>

              <p className="font-body text-[15px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
                {fullDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => openProjectModal({ service: service.slug })}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-bold text-sm shadow-[0_12px_28px_-8px_rgba(23,37,84,0.35)] dark:shadow-[0_12px_28px_-8px_rgba(56,189,248,0.4)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>
                  {to.orderButton || (isRTL ? 'ثبت سفارش این خدمت' : 'Request This Service')}
                </span>
                <ActionArrow
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>

              <span className="font-body text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isRTL ? 'پاسخ‌گویی تیم در کمتر از ۲۴ ساعت' : 'Response within 24 hours'}
              </span>
            </div>
          </div>

          {/* ۲. کارت تصویر اصلی اول (۵ ستون) */}
          <div className="bento-card group lg:col-span-5 relative rounded-[28px] overflow-hidden min-h-[280px] sm:min-h-[340px] lg:min-h-full bg-slate-200 dark:bg-slate-900 border border-slate-200/90 dark:border-white/12 shadow-lg">
            <BentoImage
              fileName={subImages[0]}
              fallbackUrl={fallbacks[0]}
              alt={`${title} — 01`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"
            />
            <span className="absolute bottom-4 start-4 px-3.5 py-1.5 rounded-full bg-slate-950/55 backdrop-blur-md border border-white/20 text-[11px] font-body font-bold tracking-[0.2em] text-white/90">
              01 / 03
            </span>
          </div>

          {/* ۳. کارت تصویر دوم (۴ ستون) */}
          <div className="bento-card group lg:col-span-4 relative rounded-[26px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[260px] bg-slate-200 dark:bg-slate-900 border border-slate-200/90 dark:border-white/12 shadow-md">
            <BentoImage
              fileName={subImages[1]}
              fallbackUrl={fallbacks[1]}
              alt={`${title} — 02`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none"
            />
            <span className="absolute bottom-3.5 start-3.5 px-3 py-1 rounded-full bg-slate-950/55 backdrop-blur-md border border-white/20 text-[11px] font-body font-bold tracking-[0.2em] text-white/90">
              02 / 03
            </span>
          </div>

          {/* ۴. ستون میانی متادیتا: دو کارت شیشه‌ای روی هم (۴ ستون) */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5">
            {/* کارت بازه زمانی */}
            <div className="bento-card rounded-[24px] p-6 bg-white/80 dark:bg-[#091229]/75 backdrop-blur-2xl border border-slate-200/90 dark:border-white/12 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/8 dark:bg-sky-400/15 border border-blue-950/10 dark:border-sky-300/25 flex items-center justify-center text-blue-900 dark:text-sky-400 shrink-0">
                <Clock size={21} />
              </div>
              <div className="min-w-0">
                <span className="block font-body text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                  {to.timelineLabel || (isRTL ? 'بازه زمانی تقریبی' : 'Estimated Timeline')}
                </span>
                <strong className="block font-heading text-lg sm:text-xl font-black text-slate-950 dark:text-white truncate">
                  {timeline || (isRTL ? 'توافقی' : 'Flexible')}
                </strong>
              </div>
            </div>

            {/* کارت مناسب برای */}
            <div className="bento-card flex-1 rounded-[24px] p-6 bg-white/80 dark:bg-[#091229]/75 backdrop-blur-2xl border border-slate-200/90 dark:border-white/12 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.16em] text-blue-900 dark:text-sky-300 mb-3.5">
                <Sparkles size={14} />
                <span>{to.idealForLabel || (isRTL ? 'مناسب برای' : 'Ideal For')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {idealForList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full font-body text-xs font-semibold bg-slate-100 dark:bg-white/8 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/12"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ۵. کارت تصویر سوم (۴ ستون) */}
          <div className="bento-card group lg:col-span-4 relative rounded-[26px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[260px] bg-slate-200 dark:bg-slate-900 border border-slate-200/90 dark:border-white/12 shadow-md">
            <BentoImage
              fileName={subImages[2]}
              fallbackUrl={fallbacks[2]}
              alt={`${title} — 03`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none"
            />
            <span className="absolute bottom-3.5 start-3.5 px-3 py-1 rounded-full bg-slate-950/55 backdrop-blur-md border border-white/20 text-[11px] font-body font-bold tracking-[0.2em] text-white/90">
              03 / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
س}