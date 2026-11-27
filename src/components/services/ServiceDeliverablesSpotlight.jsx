import { useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  ArrowLeft,
  ArrowRight,
  Compass,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

// قیدهای استاندارد برای هماهنگی بین فرانت‌اند و فرم ادمین پنل
export const DELIVERABLES_LIMITS = {
  maxItems: 6,
  maxTitleChars: 42,
  maxDescChars: 130,
};

const DELIVERABLE_ICONS = [Layers, Sparkles, ShieldCheck, PackageCheck];

const truncateText = (text, maxChars) => {
  const clean = String(text || '').trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars - 1).trimEnd()}…`;
};

function SpotlightDeliverableCard({ item, index, getLocalized }) {
  const IconComp = DELIVERABLE_ICONS[index % DELIVERABLE_ICONS.length];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const title = truncateText(
    getLocalized(item.title),
    DELIVERABLES_LIMITS.maxTitleChars
  );
  const description = truncateText(
    getLocalized(item.description),
    DELIVERABLES_LIMITS.maxDescChars
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="deliv-grid-card alpha-glass-bar group rounded-[28px] p-7 sm:p-8 lg:p-9 overflow-hidden hover:-translate-y-1.5 flex flex-col justify-between text-start"
    >
      {/* ردیف بالای کارت: آیکون + شماره معماری */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-7">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-950/6 dark:bg-sky-400/12 border border-blue-950/10 dark:border-sky-400/25 flex items-center justify-center text-blue-950 dark:text-sky-400 group-hover:scale-105 group-hover:bg-blue-950 group-hover:text-white dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950 transition-all duration-300">
          <IconComp size={23} />
        </div>

        <span className="font-heading text-3xl sm:text-4xl font-black text-slate-300/70 dark:text-white/10 group-hover:text-blue-900/25 dark:group-hover:text-sky-400/35 transition-colors select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* محتوای متنی کارت */}
      <div className="relative z-10">
        <h3 className="font-body font-bold text-slate-950 dark:text-white mb-2.5 group-hover:text-blue-950 dark:group-hover:text-sky-200 transition-colors">
          {title}
        </h3>
        <p className="font-body text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* خط تاکیدی پایین کارت */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-6 pt-4 border-t border-slate-200/70 dark:border-white/10 flex items-center gap-2"
      >
        <span className="w-6 h-[2px] rounded-full bg-blue-900/35 dark:bg-sky-400/45 group-hover:w-14 group-hover:bg-blue-900 dark:group-hover:bg-sky-400 transition-all duration-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
      </div>
    </div>
  );
}

export default function ServiceDeliverablesSpotlight({
  activeService,
  onSelectService,
}) {
  const { lang } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const td = t.servicesPage?.deliverables || {};

  const services = db?.services || [];
  const service = services.find((s) => s.slug === activeService) || services[0];
  const deliverables = Array.isArray(service?.deliverables)
    ? service.deliverables.slice(0, DELIVERABLES_LIMITS.maxItems)
    : [];
  const otherServices = services.filter((s) => s.slug !== service?.slug);

  const sectionRef = useRef(null);
  const pendingTopRef = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  useEffect(() => {
    if (!sectionRef.current || !deliverables.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.deliv-grid-card',
        { opacity: 0, y: 24, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [service?.slug, deliverables.length]);

  // حفظ دقیق موقعیت اسکرول کاربر هنگام سوییچ خدمت از CTA همین سکشن
  useLayoutEffect(() => {
    if (pendingTopRef.current === null || !sectionRef.current) return;

    const savedTop = pendingTopRef.current;
    pendingTopRef.current = null;

    const currentTop = sectionRef.current.getBoundingClientRect().top;
    const delta = currentTop - savedTop;
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior: 'instant' });
    }
  }, [service?.slug]);

  const handleSwitchService = (slug) => {
    if (sectionRef.current) {
      pendingTopRef.current = sectionRef.current.getBoundingClientRect().top;
    }

    if (onSelectService) {
      onSelectService(slug);
    } else {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('category', slug);
      setSearchParams(nextParams, { replace: true });
    }
  };

  if (!service || !deliverables.length) return null;

  const SwitchArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-20 md:py-28 overflow-hidden bg-slate-100 dark:bg-[#030712] border-t border-slate-200/80 dark:border-white/10 transition-colors duration-500"
    >
      {/* هاله نوری مرکزی بسیار نرم */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[420px] rounded-full bg-blue-500/8 dark:bg-sky-500/10 blur-[140px] pointer-events-none"
      />

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* هدر وسط‌چین سکشن */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-blue-900 dark:text-sky-300">
              {td.badge || (isRTL ? 'موارد تحویلی' : 'DELIVERABLES')}
            </span>
            <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="font-heading font-black tracking-tight text-slate-950 dark:text-white mb-4">
            <span>
              {td.titlePart1 || (isRTL ? 'دقیقاً چه چیزهایی' : 'What You')}{' '}
            </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {td.titleHighlight || (isRTL ? 'تحویل می‌گیرید؟' : 'Will Receive')}
            </span>
          </h2>

          <p className="font-body text-slate-600 dark:text-slate-400 max-w-2xl">
            {td.subtitle ||
              (isRTL
                ? 'تمامی خروجی‌ها با استانداردهای حرفه‌ای، نظم کامل و آمادگی برای استفاده فوری در کسب‌وکار شما ارائه می‌شوند.'
                : 'Every deliverable is crafted to professional standards, organized cleanly, and ready for immediate business use.')}
          </p>
        </div>

        {/* شبکه ۲×۲ کارت‌های اسپات‌لایت */}
        <div
          key={service.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        >
          {deliverables.map((item, idx) => (
            <SpotlightDeliverableCard
              key={`${service.slug}-spot-${idx}`}
              item={item}
              index={idx}
              getLocalized={getLocalized}
            />
          ))}
        </div>

        {/* CTA کوچک یادآوری و جابه‌جایی سریع به سایر خدمات */}
        {otherServices.length > 0 && (
          <div className="mt-10 md:mt-12 rounded-3xl p-5 sm:p-6 bg-white/85 dark:bg-[#091229]/75 border border-slate-200/90 dark:border-white/12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3.5 text-center lg:text-start">
              <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-blue-950/6 dark:bg-sky-400/12 border border-blue-950/10 dark:border-sky-400/25 items-center justify-center text-blue-950 dark:text-sky-400 shrink-0">
                <Compass size={19} />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                  {isRTL
                    ? 'موارد تحویلی سایر خدمات ما را هم ببینید'
                    : 'Explore deliverables for our other services'}
                </p>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {isRTL
                    ? 'با انتخاب هر خدمت، تمام محتوای صفحه به آن سرویس تغییر می‌کند.'
                    : 'Select any service below to switch the entire page.'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5">
              {otherServices.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => handleSwitchService(srv.slug)}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-blue-950 text-slate-800 hover:text-white dark:bg-white/6 dark:hover:bg-sky-400 dark:text-slate-200 dark:hover:text-slate-950 border border-slate-300/80 hover:border-blue-950 dark:border-white/15 dark:hover:border-sky-400 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer"
                >
                  <span>{getLocalized(srv.title)}</span>
                  <SwitchArrow
                    size={15}
                    className={`transition-transform duration-300 ${
                      isRTL
                        ? 'group-hover:-translate-x-0.5'
                        : 'group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}