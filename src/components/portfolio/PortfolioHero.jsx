import { useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

// استخراج خودکار عدد، پیشوند و پسوند (مثلاً "+100" یا "500+") برای شمارش دقیق از صفر
const parseStatValue = (rawValue) => {
  const str = String(rawValue ?? '0').trim();
  const match = str.match(/^([^\d]*)([\d,]+)(.*)$/);

  if (!match) {
    return { prefix: '', target: 0, suffix: '', hasComma: false, raw: str };
  }

  const numPart = match[2];
  return {
    prefix: match[1] || '',
    target: parseInt(numPart.replace(/,/g, ''), 10) || 0,
    suffix: match[3] || '',
    hasComma: numPart.includes(','),
    raw: str,
  };
};

export default function PortfolioHero() {
  const { lang } = useParams();
  const heroRef = useRef(null);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  // خواندن دقیق همان دو آمار صفحه اصلی از db.about.stats
  const allStats = db?.about?.stats || [];
  const heroStats = [
    allStats.find((s) => s.icon === 'Briefcase') || allStats[0],
    allStats.find((s) => s.icon === 'Layers') || allStats[1],
  ].filter(Boolean);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // انیمیشن ورود مرحله‌ای المان‌های هیرو
      gsap.fromTo(
        '.hero-reveal',
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );

      // شمارش نرم اعداد از صفر تا مقدار ثبت‌شده در db.json
      const counterEls = gsap.utils.toArray('.hero-stat-counter');
      counterEls.forEach((el, idx) => {
        const stat = heroStats[idx];
        if (!stat) return;

        const { prefix, target, suffix, hasComma } = parseStatValue(stat.value);
        const tracker = { val: 0 };

        el.textContent = `${prefix}0${suffix}`;

        gsap.to(tracker, {
          val: target,
          duration: 1.6,
          delay: 0.25 + idx * 0.14,
          ease: 'power3.out',
          onUpdate: () => {
            const rounded = Math.round(tracker.val);
            const formatted = hasComma
              ? rounded.toLocaleString('en-US')
              : String(rounded);
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [currentLang]);

  return (
    <section
      ref={heroRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden pt-36 sm:pt-40 md:pt-44 pb-10 sm:pb-14 md:pb-16"
    >
        {/* پس‌زمینه نقطه‌ای برای لایت‌مود */}
      <div
        aria-hidden="true"
        className="dark:hidden pointer-events-none absolute inset-0 opacity-85"
        style={{
          backgroundImage:
            'radial-gradient(rgba(30, 58, 138, 0.28) 1.35px, transparent 1.35px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 75% at 50% 48%, #000 45%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 75% at 50% 48%, #000 45%, transparent 100%)',
        }}
      />

      {/* گرادیان سرمه‌ای تیره برند زیر هدر (فقط لایت‌مود) برای خوانایی کامل لوگو و آیکون‌های سفید */}
      <div
        aria-hidden="true"
        className="dark:hidden pointer-events-none absolute inset-x-0 top-0 h-36 sm:h-40 md:h-44 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(15, 29, 64, 0.94) 0%, rgba(23, 37, 84, 0.84) 46%, rgba(33, 54, 104, 0.42) 70%, rgba(33, 54, 104, 0.1) 86%, rgba(33, 54, 104, 0) 100%)',
        }}
      />

      {/* پس‌زمینه نقطه‌ای برای دارک‌مود (بدون تغییر) */}
      <div
        aria-hidden="true"
        className="hidden dark:block pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.24) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 75% 70% at 50% 35%, #000 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 50% 35%, #000 35%, transparent 100%)',
        }}
      />

      {/* هاله‌های نوری پس‌زمینه (فقط در دارک‌مود) */}
      <div
        aria-hidden="true"
        className="hidden dark:block pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] sm:w-[760px] h-[300px] sm:h-[380px] rounded-full blur-[110px] bg-sky-500/18"
      />
      <div
        aria-hidden="true"
        className="hidden dark:block pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[460px] h-[180px] rounded-full blur-[95px] bg-blue-700/20"
      />


      {/* محتوای دو‌ستونه هیرو */}
      <div className="container-custom relative z-10 px-5 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10">
          {/* ستون اول: برچسب، تیتر اصلی و زیرتیتر هماهنگ با سایر صفحات */}
          <div className="flex-1 min-w-0 flex flex-col items-start text-start">
            <div className="hero-reveal flex items-center gap-4 mb-3">
              <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
              <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
                {tp.badge}
              </span>
              <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
            </div>

            <h1 className="hero-reveal text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4">
              <span>{tp.titlePart1} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {tp.titleHighlight}
              </span>
            </h1>

            <p className="hero-reveal font-body text-slate-600 dark:text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
              {tp.subtitle}
            </p>
          </div>

          {/* ستون دوم: کپسول عریض آمارها در یک ردیف افقی */}
          {heroStats.length > 0 && (
            <div className="lg:shrink-0 flex justify-start lg:justify-end">
              <div className="hero-reveal inline-flex items-center justify-center gap-4 sm:gap-7 px-4 py-3 sm:px-7 sm:py-4 rounded-2xl sm:rounded-full bg-white/75 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm max-w-full">
                {heroStats.map((stat, idx) => {
                  const label = t.homeAbout?.stats?.[stat.id] || '';
                  return (
                    <div key={stat.id} className="inline-flex items-center gap-4 sm:gap-7 min-w-0">
                      {idx > 0 && (
                        <span
                          aria-hidden="true"
                          className="w-[1px] h-6 sm:h-7 bg-slate-300 dark:bg-white/15 shrink-0"
                        />
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span
                          dir="ltr"
                          className="hero-stat-counter tabular-nums text-xl sm:text-3xl font-black tracking-tight bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent leading-none shrink-0"
                        >
                          {stat.value}
                        </span>
                        <span className="font-body !text-[12px] sm:!text-[16px] !leading-snug font-bold text-slate-700 dark:text-slate-200 sm:whitespace-nowrap">
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* خط جداکننده نوری ظریف در مرز پایینی هیرو */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300/70 dark:via-sky-400/20 to-transparent"
      />
    </section>
  );
}