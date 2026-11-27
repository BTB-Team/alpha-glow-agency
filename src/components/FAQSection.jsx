import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { HelpCircle, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import db from '../../db.json';
import fa from '../locales/fa.json';
import en from '../locales/en.json';

// قیدهای استاندارد برای هماهنگی با ادمین پنل
export const FAQ_LIMITS = {
  maxVisibleOnService: 6,
  maxVisibleOnHome: 8,
};

/* آیکون اختصاصی پلک و مژه:
   - حالت بسته (پاسخ پنهان): پلک بسته همراه با مژه‌ها
   - حالت باز (پاسخ نمایان): چشم باز */
function EyelidToggleIcon({ isOpen }) {
  return (
    <span className="relative w-5 h-5 flex items-center justify-center">
      {/* حالت چشم بسته با مژه‌ها */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-0 scale-75 -translate-y-0.5'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <path d="M2 10c2.6 3.6 6 5.5 10 5.5s7.4-1.9 10-5.5" />
        <path d="M5 13l-1.5 2.8" />
        <path d="M9.5 15.2l-.7 3.1" />
        <path d="M14.5 15.2l.7 3.1" />
        <path d="M19 13l1.5 2.8" />
      </svg>

      {/* حالت چشم باز */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-75 translate-y-0.5'
        }`}
      >
        <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    </span>
  );
}

function AccordionItem({ item, index, isOpen, onToggle, getLocalized }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const question = getLocalized(item.question);
  const answer = getLocalized(item.answer);
  const panelId = `faq-panel-${item.id}`;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`faq-item-card alpha-glass-bar rounded-[24px] overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'bg-white/95 dark:bg-[#091229]/90 shadow-[0_20px_50px_-16px_rgba(23,37,84,0.18)] dark:shadow-[0_24px_60px_-16px_rgba(14,165,233,0.22)]'
          : 'bg-white/80 dark:bg-[#091229]/70'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative z-10 w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-start cursor-pointer"
      >
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
          <span
            className={`shrink-0 text-xs sm:text-sm font-black tracking-[0.18em] pt-1 sm:pt-0 transition-colors ${
              isOpen
                ? 'text-blue-900 dark:text-sky-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-body font-bold text-slate-950 dark:text-white leading-snug">
            {question}
          </h3>
        </div>

        <span
          aria-hidden="true"
          className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? 'bg-blue-950 text-white border-blue-950 dark:bg-sky-400 dark:text-slate-950 dark:border-sky-400 shadow-sm'
              : 'bg-slate-100/90 text-slate-700 border-slate-300/80 dark:bg-white/8 dark:text-slate-200 dark:border-white/15'
          }`}
        >
          <EyelidToggleIcon isOpen={isOpen} />
        </span>
      </button>

      {/* باز و بسته شدن نرم با CSS Grid */}
      <div
        id={panelId}
        className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pt-0 sm:ps-[62px]">
            <div className="pt-3.5 border-t border-slate-200/80 dark:border-white/10">
              <p className="font-body text-slate-600 dark:text-slate-300 leading-relaxed">
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection({ activeService = null, id }) {
  const { lang } = useParams();

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tf = t.faq || {};

  const isServiceMode = Boolean(activeService);
  const resolvedId = id ?? (isServiceMode ? 'service-faq' : 'faq');

  const services = db?.services || [];
  const allFaqs = Array.isArray(db?.faqs) ? db.faqs : [];
  const hasGeneralFaqs = allFaqs.some((f) => f.category === 'general');

  // پیش‌فرض روی فیلتر عمومی (general) برای جلوگیری از شلوغی اولیه
  const [selectedFilter, setSelectedFilter] = useState(
    hasGeneralFaqs ? 'general' : 'all'
  );
  const [openId, setOpenId] = useState(null);
  const listRef = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  // ترتیب تب‌ها در صفحه اصلی: ابتدا عمومی (پیش‌فرض)، سپس خدمات و در انتها همه سوالات
  const homeFilters = useMemo(() => {
    if (isServiceMode) return [];
    const availableCats = new Set(allFaqs.map((f) => f.category));
    const list = [];

    if (availableCats.has('general')) {
      list.push({ key: 'general', label: tf.filters?.general || '' });
    }

    services.forEach((srv) => {
      if (availableCats.has(srv.slug)) {
        list.push({ key: srv.slug, label: getLocalized(srv.title) });
      }
    });

    list.push({ key: 'all', label: tf.filters?.all || '' });

    return list;
  }, [isServiceMode, allFaqs, services, tf, currentLang]);

  // استخراج سوالات بر اساس صفحه فعال
  const visibleFaqs = useMemo(() => {
    if (!allFaqs.length) return [];

    if (isServiceMode) {
      const serviceSpecific = allFaqs.filter((f) => f.category === activeService);
      const general = allFaqs.filter((f) => f.category === 'general');
      return [...serviceSpecific, ...general].slice(
        0,
        FAQ_LIMITS.maxVisibleOnService
      );
    }

    if (selectedFilter === 'all') {
      const featured = allFaqs.filter((f) => f.showOnHome !== false);
      const base = featured.length ? featured : allFaqs;
      return base.slice(0, FAQ_LIMITS.maxVisibleOnHome);
    }

    return allFaqs
      .filter((f) => f.category === selectedFilter)
      .slice(0, FAQ_LIMITS.maxVisibleOnHome);
  }, [allFaqs, isServiceMode, activeService, selectedFilter]);

  useEffect(() => {
    setOpenId(visibleFaqs[0]?.id || null);

    if (!listRef.current || !visibleFaqs.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item-card',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [activeService, selectedFilter]);

  if (!allFaqs.length) return null;

  const activeServiceObj = isServiceMode
    ? services.find((s) => s.slug === activeService)
    : null;
  const serviceTitle = getLocalized(activeServiceObj?.title);
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  const handleSupportMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id={resolvedId}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-20 md:py-28 overflow-hidden bg-slate-100 dark:bg-[#030712] border-t border-slate-200/80 dark:border-white/10 transition-colors duration-500 scroll-mt-24"
    >
      {/* هاله نوری مرکزی پس‌زمینه */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full bg-blue-500/8 dark:bg-sky-500/10 blur-[140px] pointer-events-none"
      />

      <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* هدر وسط‌چین تک‌ستونه */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-blue-900 dark:text-sky-300">
              {tf.badge}
            </span>
            <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="font-heading font-black tracking-tight text-slate-950 dark:text-white mb-4">
            {isServiceMode && serviceTitle ? (
              <>
                <span>{tf.serviceTitlePrefix}</span>
                <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                  {serviceTitle}
                </span>
                {tf.serviceTitleSuffix && <span>{tf.serviceTitleSuffix}</span>}
              </>
            ) : (
              <>
                <span>{tf.titlePart1}</span>
                <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                  {tf.titleHighlight}
                </span>
              </>
            )}
          </h2>

          <p className="font-body text-slate-600 dark:text-slate-400 max-w-2xl">
            {tf.subtitle}
          </p>
        </div>

        {/* تب‌های فیلتر وسط‌چین (فقط در صفحه اصلی) */}
        {!isServiceMode && homeFilters.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 md:mb-10">
            {homeFilters.map((tab) => {
              const isActive = selectedFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-white border-blue-950 dark:bg-sky-400 dark:text-slate-950 dark:border-sky-400 shadow-sm'
                      : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300/80 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* لیست تک‌ستونه آکاردئون‌ها */}
        <div ref={listRef} className="flex flex-col gap-3.5">
          {visibleFaqs.map((item, idx) => (
            <AccordionItem
              key={item.id}
              item={item}
              index={idx}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
              getLocalized={getLocalized}
            />
          ))}
        </div>

        {/* کادر دعوت به تماس با لینک مستقیم به فرم صفحه تماس */}
        <div
          onMouseMove={handleSupportMouseMove}
          className="alpha-glass-bar mt-10 md:mt-12 rounded-[26px] p-5 sm:p-6 bg-white/85 dark:bg-[#091229]/80 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="relative z-10 flex items-center gap-3.5 text-center sm:text-start">
            <div className="hidden sm:flex w-11 h-11 rounded-2xl bg-blue-950/6 dark:bg-sky-400/12 border border-blue-950/10 dark:border-sky-400/25 items-center justify-center text-blue-950 dark:text-sky-400 shrink-0">
              <HelpCircle size={21} />
            </div>
            <div>
              <span className="block font-body font-bold text-slate-950 dark:text-white">
                {tf.support?.title}
              </span>
              <span className="block text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {tf.support?.description}
              </span>
            </div>
          </div>

          <Link
            to={`/${currentLang}/contact#contact-form`}
            className="relative z-10 group shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>{tf.support?.button}</span>
            <ActionArrow
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}