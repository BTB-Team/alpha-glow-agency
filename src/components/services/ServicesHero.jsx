import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { useStore } from '../../store/useStore';

const serviceAssetImages = import.meta.glob(
  '../../assets/**/*.{webp,png,jpg,jpeg,avif,svg}',
  { eager: true, import: 'default' }
);


// مختصات، چرخش و پالت نوری اختصاصی هر خدمت در خانواده رنگی 
export const resolveServiceImage = (imgName) => {
  if (!imgName) return '';
  if (imgName.startsWith('http') || imgName.startsWith('/')) return imgName;

  const matchedKey = Object.keys(serviceAssetImages).find((path) =>
    path.endsWith(`/${imgName}`)
  );
  if (matchedKey) return serviceAssetImages[matchedKey];

  return `/images/services/${imgName}`;
};

// پالت عمیق و هماهنگ با هویت رنگی برند آلفا گلو (سورمه‌ای، کبالت، اقیانوسی و نیلی)
const SERVICE_SCENES = {
  'website-design': {
    sphereMain:
      'radial-gradient(circle at 28% 24%, #38bdf8 0%, #1d4ed8 32%, #172554 68%, #030712 100%)',
    sphereSecond:
      'radial-gradient(circle at 26% 24%, #60a5fa 0%, #1e40af 35%, #0f172a 74%, #020617 100%)',
    sphereAccent:
      'radial-gradient(circle at 30% 26%, #7dd3fc 0%, #2563eb 42%, #0f1f4b 100%)',
    ringStops: ['#38bdf8', '#1d4ed8', '#172554', '#050a19'],
    ambientGlow: 'rgba(29, 78, 216, 0.24)',
    positions: {
      main: { x: 0, y: 0, scale: 1 },
      second: { x: 0, y: 0, scale: 1 },
      ringTop: { x: 0, y: 0, rotation: -18, scale: 1 },
      ringBottom: { x: 0, y: 0, rotation: 24, scale: 1 },
      smallLeft: { x: 0, y: 0, scale: 1 },
      smallRight: { x: 0, y: 0, scale: 1 },
    },
  },
  'graphic-design': {
    sphereMain:
      'radial-gradient(circle at 28% 24%, #22d3ee 0%, #0284c7 30%, #0c4a6e 68%, #041322 100%)',
    sphereSecond:
      'radial-gradient(circle at 26% 24%, #38bdf8 0%, #0369a1 34%, #082f49 74%, #020b14 100%)',
    sphereAccent:
      'radial-gradient(circle at 30% 26%, #67e8f9 0%, #0284c7 44%, #082f49 100%)',
    ringStops: ['#22d3ee', '#0284c7', '#0c4a6e', '#041221'],
    ambientGlow: 'rgba(2, 132, 199, 0.24)',
    positions: {
      main: { x: -75, y: 40, scale: 0.94 },
      second: { x: 65, y: -35, scale: 1.08 },
      ringTop: { x: 90, y: 30, rotation: 22, scale: 1.06 },
      ringBottom: { x: -70, y: -40, rotation: -18, scale: 0.92 },
      smallLeft: { x: 35, y: -55, scale: 1.15 },
      smallRight: { x: -45, y: 40, scale: 0.88 },
    },
  },
  branding: {
    sphereMain:
      'radial-gradient(circle at 28% 24%, #818cf8 0%, #3730a3 32%, #1e1b4b 68%, #050714 100%)',
    sphereSecond:
      'radial-gradient(circle at 26% 24%, #6366f1 0%, #312e81 36%, #13163a 75%, #030510 100%)',
    sphereAccent:
      'radial-gradient(circle at 30% 26%, #a5b4fc 0%, #4338ca 44%, #17153b 100%)',
    ringStops: ['#818cf8', '#3730a3', '#1e1b4b', '#07091c'],
    ambientGlow: 'rgba(67, 56, 202, 0.26)',
    positions: {
      main: { x: -35, y: 85, scale: 1.04 },
      second: { x: 40, y: -75, scale: 0.92 },
      ringTop: { x: -55, y: 55, rotation: 48, scale: 0.94 },
      ringBottom: { x: 60, y: -25, rotation: -35, scale: 1.08 },
      smallLeft: { x: 70, y: 35, scale: 0.9 },
      smallRight: { x: -30, y: -65, scale: 1.18 },
    },
  },
  print: {
    sphereMain:
      'radial-gradient(circle at 28% 24%, #60a5fa 0%, #1e40af 32%, #172554 68%, #040917 100%)',
    sphereSecond:
      'radial-gradient(circle at 26% 24%, #3b82f6 0%, #1e3a8a 36%, #0c1733 75%, #020612 100%)',
    sphereAccent:
      'radial-gradient(circle at 30% 26%, #93c5fd 0%, #1d4ed8 44%, #0f172a 100%)',
    ringStops: ['#60a5fa', '#1e40af', '#172554', '#040814'],
    ambientGlow: 'rgba(37, 99, 235, 0.24)',
    positions: {
      main: { x: -95, y: 15, scale: 0.98 },
      second: { x: 95, y: -15, scale: 1.02 },
      ringTop: { x: 45, y: -20, rotation: -42, scale: 1.04 },
      ringBottom: { x: -45, y: 20, rotation: 55, scale: 0.96 },
      smallLeft: { x: -20, y: 60, scale: 1.1 },
      smallRight: { x: 20, y: -45, scale: 0.95 },
    },
  },
};

/* حلقه سه‌بعدی (Torus) با عمق و نورپردازی متناسب با تم آلفا گلو */
function TorusRing3D({ id, stops, className = '' }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={`overflow-visible drop-shadow-[0_26px_38px_rgba(15,23,42,0.4)] dark:drop-shadow-[0_28px_42px_rgba(2,6,23,0.82)] ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-main`} x1="20%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="32%" stopColor={stops[1]} />
          <stop offset="72%" stopColor={stops[2]} />
          <stop offset="100%" stopColor={stops[3]} />
        </linearGradient>
        <linearGradient id={`${id}-spec`} x1="15%" y1="10%" x2="70%" y2="75%">
          <stop offset="0%" stopColor="rgba(224,242,254,0.58)" />
          <stop offset="45%" stopColor="rgba(186,230,253,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <circle
        cx="120"
        cy="120"
        r="82"
        stroke={`url(#${id}-main)`}
        strokeWidth="34"
      />
      <circle
        cx="120"
        cy="120"
        r="85"
        stroke={`url(#${id}-spec)`}
        strokeWidth="9"
        style={{ filter: 'blur(2.5px)' }}
      />
      <circle
        cx="120"
        cy="120"
        r="65"
        stroke="rgba(2,6,23,0.34)"
        strokeWidth="6"
        style={{ filter: 'blur(3px)' }}
      />
    </svg>
  );
}

export default function ServicesHero({ activeService, onSelectService }) {
  const { lang } = useParams();
  const openProjectModal = useStore((state) => state.openProjectModal);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const th = t.servicesPage?.hero || {};

  const services = db?.services || [];

  // پشتیبانی هم‌زمان از حالت کنترل‌شده با URL و حالت مستقل
  const [internalSlug, setInternalSlug] = useState(services[0]?.slug || 'website-design');
  const currentSlug = activeService || internalSlug;
  const handleSelect = (slug) => {
    if (onSelectService) onSelectService(slug);
    else setInternalSlug(slug);
  };

  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.slug === currentSlug)
  );
  const current = services[activeIndex] || services[0];
  const scene = SERVICE_SCENES[current?.slug] || SERVICE_SCENES['website-design'];

  const heroRef = useRef(null);
  const shapeRefs = useRef({});
  const parallaxRefs = useRef([]);
  const quickParallaxRef = useRef([]);
  const touchStartX = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  // انیمیشن شناوری مداوم و لطیف احجام + آماده‌سازی پارالاکس موس
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.hero-float-slow', {
        y: -14,
        duration: 4.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.45,
      });

      gsap.to('.hero-float-alt', {
        y: 12,
        x: 6,
        duration: 5.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.6,
      });
    }, heroRef);

    // تنظیم quickTo برای حرکت بسیار نرم پارالاکس موس در دسکتاپ
    quickParallaxRef.current = parallaxRefs.current.map((el, i) => {
      if (!el) return null;
      const depth = [26, 22, 18, 16, 34, 30][i] || 20;
      return {
        depth,
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
      };
    });

    return () => {
      quickParallaxRef.current = [];
      ctx.revert();
    };
  }, []);

  // جابه‌جایی نرم احجام و انیمیشن متن هنگام تغییر خدمت فعال
  useEffect(() => {
    if (!heroRef.current || !scene) return;

    const pos = scene.positions;
    const keys = ['main', 'second', 'ringTop', 'ringBottom', 'smallLeft', 'smallRight'];

    keys.forEach((key) => {
      const el = shapeRefs.current[key];
      if (!el || !pos[key]) return;
      gsap.to(el, {
        x: pos[key].x,
        y: pos[key].y,
        scale: pos[key].scale,
        rotation: pos[key].rotation ?? 0,
        duration: 1.15,
        ease: 'power3.inOut',
      });
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.glass-hero-copy',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [current?.slug, scene]);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024 || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    quickParallaxRef.current.forEach((item, idx) => {
      if (!item) return;
      const dir = idx % 2 === 0 ? -1 : 1;
      item.x(nx * item.depth * dir);
      item.y(ny * item.depth * dir);
    });
  };

  const handleMouseLeave = () => {
    quickParallaxRef.current.forEach((item) => {
      if (!item) return;
      item.x(0);
      item.y(0);
    });
  };

  const handleStep = (direction) => {
    if (!services.length) return;
    const nextIdx = (activeIndex + direction + services.length) % services.length;
    handleSelect(services[nextIdx].slug);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 45) return;

    if (deltaX < 0) handleStep(isRTL ? -1 : 1);
    else handleStep(isRTL ? 1 : -1);
  };

  const handleScrollDown = () => {
    const target = document.getElementById('service-details-section');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!current) return null;

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const title = getLocalized(current.title);
  const shortDesc = getLocalized(current.shortDescription);
  const timeline = getLocalized(current.estimatedTimeline);

  return (
    <section
      ref={heroRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={isRTL ? 'معرفی خدمات آلفا گلو' : 'Alpha Glow Services Hero'}
      className="relative w-full min-h-[100svh] lg:h-[100svh] lg:min-h-[740px] lg:max-h-[980px] overflow-hidden flex items-center justify-center pt-28 pb-10 sm:pt-32 sm:pb-12 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-[#c9dcf0] via-[#dbe8f6] to-[#bdd2ea] dark:from-[#030714] dark:via-[#081229] dark:to-[#040a1a] transition-colors duration-700 select-none"
    >
      {/* نوار عمق بسیار لطیف در بالای صفحه برای جلوه بهتر هدر شیشه‌ای سفید در حالت روشن */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0b1b3d]/45 via-[#173063]/15 to-transparent dark:from-[#020617]/75 dark:via-transparent pointer-events-none z-0"
      />

      {/* هاله نوری مرکزی پس‌زمینه */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[520px] rounded-full blur-[120px] pointer-events-none transition-all duration-700"
        style={{ background: scene.ambientGlow }}
      />

      {/* ====================================================================
          لایه احجام سه‌بعدی (کره‌ها و حلقه‌ها) — بخشی بیرون از شیشه (واضح) و بخشی پشت شیشه (مات)
         ==================================================================== */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* ۱. کره بزرگ اصلی (بالا-راست در LTR / بالا-چپ در RTL — از پشت هدر و لبه قاب شیشه‌ای عبور می‌کند) */}
        <div
          ref={(el) => (shapeRefs.current.main = el)}
          className={`absolute -top-12 sm:-top-16 ${
            isRTL ? '-left-12 sm:left-[6%]' : '-right-12 sm:right-[6%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[0] = el)}>
            <div
              className="hero-float-slow w-[270px] h-[270px] sm:w-[390px] sm:h-[390px] lg:w-[460px] lg:h-[460px] rounded-full transition-[background] duration-700 shadow-[0_38px_80px_-16px_rgba(15,23,42,0.45)] dark:shadow-[0_38px_90px_-14px_rgba(2,6,23,0.9)]"
              style={{
                background: scene.sphereMain,
                boxShadow:
                  'inset 16px 18px 42px rgba(255,255,255,0.42), inset -22px -28px 50px rgba(2,6,23,0.48)',
              }}
            />
          </div>
        </div>

        {/* ۲. کره دوم (پایین-چپ در LTR / پایین-راست در RTL — نصفش بیرون از گوشه پایین قاب شیشه‌ای) */}
        <div
          ref={(el) => (shapeRefs.current.second = el)}
          className={`absolute -bottom-16 sm:-bottom-20 ${
            isRTL ? '-right-12 sm:right-[4%]' : '-left-12 sm:left-[4%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[1] = el)}>
            <div
              className="hero-float-alt w-[210px] h-[210px] sm:w-[290px] sm:h-[290px] lg:w-[340px] lg:h-[340px] rounded-full transition-[background] duration-700"
              style={{
                background: scene.sphereSecond,
                boxShadow:
                  'inset 14px 16px 34px rgba(255,255,255,0.38), inset -18px -22px 44px rgba(2,6,23,0.52), 0 32px 68px -14px rgba(15,23,42,0.42)',
              }}
            />
          </div>
        </div>

        {/* ۳. حلقه سه‌بعدی بالا (پشت لبه بالایی قاب شیشه‌ای) */}
        <div
          ref={(el) => (shapeRefs.current.ringTop = el)}
          className={`hidden sm:block absolute top-[10%] ${
            isRTL ? 'right-[20%] lg:right-[26%]' : 'left-[20%] lg:left-[26%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[2] = el)}>
            <div className="hero-float-alt">
              <TorusRing3D
                id="hero-ring-top"
                stops={scene.ringStops}
                className="w-[155px] h-[155px] lg:w-[215px] lg:h-[215px]"
              />
            </div>
          </div>
        </div>

        {/* ۴. حلقه سه‌بعدی پایین (از لبه پایینی قاب شیشه‌ای بیرون زده) */}
        <div
          ref={(el) => (shapeRefs.current.ringBottom = el)}
          className={`absolute bottom-[2%] sm:bottom-[4%] ${
            isRTL ? 'left-[22%] lg:left-[30%]' : 'right-[22%] lg:right-[30%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[3] = el)}>
            <div className="hero-float-slow">
              <TorusRing3D
                id="hero-ring-bottom"
                stops={scene.ringStops}
                className="w-[130px] h-[130px] sm:w-[165px] sm:h-[165px] lg:w-[195px] lg:h-[195px]"
              />
            </div>
          </div>
        </div>

        {/* ۵. گوی کوچک شناور کناری (چپ) */}
        <div
          ref={(el) => (shapeRefs.current.smallLeft = el)}
          className={`absolute top-[46%] ${
            isRTL ? 'right-[4%] sm:right-[7%]' : 'left-[4%] sm:left-[7%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[4] = el)}>
            <div
              className="hero-float-slow w-14 h-14 sm:w-20 sm:h-20 rounded-full transition-[background] duration-700"
              style={{
                background: scene.sphereAccent,
                boxShadow:
                  'inset 6px 6px 14px rgba(255,255,255,0.5), inset -8px -10px 16px rgba(2,6,23,0.4), 0 18px 34px rgba(15,23,42,0.32)',
              }}
            />
          </div>
        </div>

        {/* ۶. گوی کوچک شناور کناری (راست) */}
        <div
          ref={(el) => (shapeRefs.current.smallRight = el)}
          className={`hidden md:block absolute top-[58%] ${
            isRTL ? 'left-[5%] lg:left-[8%]' : 'right-[5%] lg:right-[8%]'
          } will-change-transform`}
        >
          <div ref={(el) => (parallaxRefs.current[5] = el)}>
            <div
              className="hero-float-alt w-14 h-14 lg:w-[72px] lg:h-[72px] rounded-full transition-[background] duration-700"
              style={{
                background: scene.sphereAccent,
                boxShadow:
                  'inset 5px 5px 12px rgba(255,255,255,0.5), inset -7px -8px 14px rgba(2,6,23,0.4), 0 16px 30px rgba(15,23,42,0.3)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          قاب اصلی شیشه مات (Frosted Glass Canvas) — خلوت، لوکس و کاملاً خوانا
         ==================================================================== */}
      <div className="relative z-10 w-full max-w-[1120px] min-h-[500px] sm:min-h-[540px] lg:h-[68vh] lg:min-h-[520px] lg:max-h-[640px] rounded-[24px] sm:rounded-[30px] p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-white/30 dark:bg-[#081229]/45 backdrop-blur-[28px] backdrop-saturate-150 border border-white/65 dark:border-white/20 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.85)] dark:shadow-[0_35px_95px_-20px_rgba(0,0,0,0.75),inset_0_1px_1.5px_rgba(255,255,255,0.22)] overflow-hidden transition-colors duration-500">
        {/* درخشش بسیار ملایم روی لبه بالایی شیشه */}
        <div
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-sky-300/60 to-transparent pointer-events-none"
        />

        {/* ردیف بالای قاب: نشانگر برند + انتخابگر مینیمال ۴ خدمت (مشابه نوار خلوت طرح مرجع) */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-black/15 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-800 dark:bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            <span className="font-body !text-[12px] sm:!text-[13px] font-bold tracking-[0.26em] uppercase text-black dark:text-white/85">
              {isRTL ? 'خدمات آلفا گلو' : 'ALPHA GLOW SERVICES'}
            </span>
          </div>

          {/* انتخابگر خطی و بسیار مینیمال ۴ خدمت (در دسکتاپ با خط جداکننده، در موبایل قابل لمس و مرتب) */}
          <nav
            aria-label={isRTL ? 'انتخاب خدمت' : 'Select Service'}
            className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-2"
          >
            {services.map((srv, idx) => {
              const isActive = srv.slug === current.slug;
              return (
                <div key={srv.id} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => handleSelect(srv.slug)}
                    className={`relative px-2.5 sm:px-3 py-1.5 rounded-full font-body !text-[12px] sm:!text-[13px] transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'font-bold text-white bg-blue-950 dark:bg-sky-400 dark:text-slate-950 shadow-sm'
                        : 'font-semibold text-black/80 hover:text-black hover:bg-white/40 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/10'
                    }`}
                  >
                    {getLocalized(srv.title)}
                  </button>

                  {idx < services.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:inline-block mx-1 w-[1px] h-3.5 bg-black/25 dark:bg-white/20"
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* فضای میانی و پایینی قاب: محتوای متنی در چپ (انگلیسی) و راست (فارسی) + کنترل‌ها در سمت مقابل */}
        <div className="relative z-10 mt-auto pt-10 sm:pt-14 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* محتوای متنی خدمت (در انگلیسی سمت چپ، در فارسی سمت راست) */}
          <div
            key={current.id}
            className={`max-w-lg flex flex-col items-start ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <span className="glass-hero-copy font-body !text-[12px] sm:!text-[13px] font-bold tracking-[0.2em] uppercase text-black/85 dark:text-sky-300 mb-2">
              {timeline
                ? `${String(activeIndex + 1).padStart(2, '0')} • ${timeline}`
                : `${String(activeIndex + 1).padStart(2, '0')} • ${
                    isRTL ? 'خدمت تخصصی' : 'SPECIALIZED SERVICE'
                  }`}
            </span>

            <h1 className="glass-hero-copy font-heading font-black !text-[32px] sm:!text-[44px] lg:!text-[52px] !leading-[1.1] tracking-tight text-black dark:text-white mb-3.5">
              {title}
            </h1>

            <p className="glass-hero-copy font-body !text-[15px] sm:!text-[16px] !leading-relaxed text-black/85 dark:text-slate-200/85 mb-7 max-w-md">
              {shortDesc}
            </p>

            <div className="glass-hero-copy flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openProjectModal({ service: current.slug })}
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-blue-950 hover:bg-blue-900 text-white dark:bg-white dark:hover:bg-sky-200 dark:text-blue-950 font-body font-bold !text-[14px] shadow-[0_14px_30px_-8px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{th.orderNow || (isRTL ? 'شروع این پروژه' : 'Start Project')}</span>
                <ActionArrow
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>

              <button
                type="button"
                onClick={handleScrollDown}
                aria-label={th.exploreDetails || (isRTL ? 'مشاهده جزئیات' : 'Explore Details')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-black/35 hover:border-black/70 bg-white/40 hover:bg-white/65 text-black dark:border-white/25 dark:hover:border-white/55 dark:bg-white/5 dark:hover:bg-white/15 dark:text-white font-body font-semibold !text-[13px] transition-all cursor-pointer"
              >
                <span>{th.exploreDetails || (isRTL ? 'جزئیات' : 'Details')}</span>
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* شمارنده و کنترل‌های مینیمال قبلی/بعدی در سمت مقابل */}
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label={isRTL ? 'خدمت قبلی' : 'Previous service'}
                className="w-10 h-10 rounded-full border border-black/30 hover:border-black/65 bg-white/40 hover:bg-white/70 text-black dark:border-white/20 dark:hover:border-white/45 dark:bg-white/5 dark:hover:bg-white/15 dark:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <PrevIcon size={17} />
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label={isRTL ? 'خدمت بعدی' : 'Next service'}
                className="w-10 h-10 rounded-full border border-black/30 hover:border-black/65 bg-white/40 hover:bg-white/70 text-black dark:border-white/20 dark:hover:border-white/45 dark:bg-white/5 dark:hover:bg-white/15 dark:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <NextIcon size={17} />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-body !text-[13px] font-bold tracking-[0.2em] text-black dark:text-sky-300">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="w-8 h-[1px] bg-black/35 dark:bg-white/25" />
              <span className="font-body !text-[12px] font-medium tracking-[0.18em] text-black/70 dark:text-white/45">
                {String(services.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}