import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

/* آیکن‌های سه‌بعدی و برجسته با اندازه مناسب و فاصله استاندارد */
function Service3DIcon({ type }) {
  return (
    <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mx-auto mt-2 mb-4 transition-transform duration-300 [transform:translateZ(38px)] group-hover:[transform:translateZ(50px)_scale(1.05)] [filter:drop-shadow(-4px_6px_0px_rgba(15,23,42,0.95))_drop-shadow(-7px_12px_14px_rgba(2,6,23,0.85))_drop-shadow(0_0_18px_rgba(56,189,248,0.45))]">
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="alpha3dFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#93c5fd" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="alpha3dDepth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="alpha3dRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {type === 'code-window' && (
          <g>
            <rect x="14" y="24" width="88" height="72" rx="12" fill="url(#alpha3dDepth)" />
            <rect x="18" y="20" width="88" height="72" rx="12" fill="none" stroke="url(#alpha3dFront)" strokeWidth="7" />
            <path d="M18 38 H106" stroke="url(#alpha3dFront)" strokeWidth="6" />
            <circle cx="31" cy="29" r="3.2" fill="#e0f2fe" />
            <circle cx="42" cy="29" r="3.2" fill="#93c5fd" />
            <circle cx="53" cy="29" r="3.2" fill="#38bdf8" />
            <g transform="translate(-3, 3)" stroke="url(#alpha3dDepth)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M46 54 L34 64 L46 74" />
              <path d="M78 54 L90 64 L78 74" />
              <path d="M66 50 L58 78" />
            </g>
            <g stroke="url(#alpha3dFront)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M46 54 L34 64 L46 74" />
              <path d="M78 54 L90 64 L78 74" />
              <path d="M66 50 L58 78" />
            </g>
          </g>
        )}

        {type === 'pen-bezier' && (
          <g>
            <g transform="translate(-4, 4)" opacity="0.85">
              <path d="M24 58 C24 30, 96 30, 96 58" fill="none" stroke="url(#alpha3dDepth)" strokeWidth="5" />
              <path d="M60 44 L42 74 L51 92 L69 92 L78 74 Z" fill="url(#alpha3dDepth)" />
            </g>
            <line x1="28" y1="30" x2="92" y2="30" stroke="url(#alpha3dFront)" strokeWidth="4" />
            <path d="M24 60 C24 32, 96 32, 96 60" fill="none" stroke="url(#alpha3dFront)" strokeWidth="5.5" />
            <rect x="20" y="23" width="13" height="13" rx="2.5" fill="#0f172a" stroke="url(#alpha3dFront)" strokeWidth="4" />
            <rect x="87" y="23" width="13" height="13" rx="2.5" fill="#0f172a" stroke="url(#alpha3dFront)" strokeWidth="4" />
            <rect x="53.5" y="23" width="13" height="13" rx="2.5" fill="url(#alpha3dFront)" />
            <rect x="17.5" y="56" width="13" height="13" rx="2.5" fill="#0f172a" stroke="url(#alpha3dFront)" strokeWidth="4" />
            <rect x="89.5" y="56" width="13" height="13" rx="2.5" fill="#0f172a" stroke="url(#alpha3dFront)" strokeWidth="4" />
            <path d="M60 42 L41 73 L50 89 L70 89 L79 73 Z" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="1.5" />
            <line x1="60" y1="43" x2="60" y2="67" stroke="#0f172a" strokeWidth="3.5" />
            <circle cx="60" cy="69" r="4.5" fill="#0f172a" />
            <rect x="47" y="92" width="26" height="7" rx="3" fill="url(#alpha3dFront)" />
          </g>
        )}

        {type === 'alpha-logo' && (
          <g>
            <g transform="translate(-5, 5)">
              <path d="M60 18 L22 92 H39 L60 49 L73 75 H55 L49 87 H96 L79 54 H66 L74 39 L60 18 Z" fill="url(#alpha3dDepth)" />
            </g>
            <path d="M60 18 L22 92 H39 L60 49 L68 65 H50 L44 77 H74 L82 92 H98 L77 52 H62 L69 38 L60 18 Z" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M54 66 H85 L96 88 H62 L57 78 H77 L73 71 H51 Z" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        )}

        {type === 'printer' && (
          <g>
            <g transform="translate(-4, 4)">
              <rect x="36" y="18" width="48" height="24" rx="4" fill="url(#alpha3dDepth)" />
              <rect x="18" y="40" width="84" height="38" rx="10" fill="url(#alpha3dDepth)" />
              <rect x="34" y="68" width="52" height="28" rx="4" fill="url(#alpha3dDepth)" />
            </g>
            <rect x="36" y="18" width="48" height="24" rx="4" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="1.5" />
            <line x1="44" y1="26" x2="76" y2="26" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="44" y1="33" x2="68" y2="33" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="18" y="40" width="84" height="38" rx="10" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="2" />
            <circle cx="86" cy="53" r="4.5" fill="#0f172a" />
            <rect x="30" y="64" width="60" height="10" rx="3" fill="#0f172a" />
            <rect x="35" y="68" width="50" height="28" rx="4" fill="url(#alpha3dFront)" stroke="url(#alpha3dRim)" strokeWidth="1.5" />
            <line x1="44" y1="78" x2="76" y2="78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="44" y1="86" x2="66" y2="86" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function HomeServices() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const sectionRef = useRef(null);
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);

  const services = db?.services?.slice(0, 4) || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(wave1Ref.current, {
        x: 35,
        y: -14,
        rotation: 1.5,
        scaleY: 1.06,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(wave2Ref.current, {
        x: -40,
        y: 16,
        rotation: -1.8,
        scaleY: 0.94,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(wave3Ref.current, {
        x: 25,
        y: 10,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden select-none transition-colors duration-500 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-50 dark:from-[#030712] dark:via-[#071026] dark:to-[#020617]"
    >
      {/* هاله‌های نوری پس‌زمینه */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/3 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-sky-400/15 dark:bg-sky-500/15 blur-[140px]" />
      </div>

      {/* واترمارک بزرگ لوگو در پس‌زمینه */}
      <div
        className={`absolute top-6 md:top-10 ${
          isRTL ? 'left-4 md:left-12' : 'right-4 md:right-12'
        } w-[280px] md:w-[460px] h-[280px] md:h-[460px] pointer-events-none opacity-[0.055] dark:opacity-[0.045] z-0`}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full fill-current text-blue-900 dark:text-blue-400">
          <path d="M100 15 L20 175 H55 L100 85 L128 140 H85 L72 165 H178 L138 85 H108 L122 58 L100 15 Z" />
        </svg>
      </div>

      {/* امواج سه‌بعدی متحرک پشت کارت‌ها */}
      <div className="absolute inset-x-0 top-[34%] md:top-[30%] h-[360px] md:h-[440px] pointer-events-none z-0 overflow-visible [will-change:transform]">
        <svg viewBox="0 0 1600 500" preserveAspectRatio="none" className="w-[115%] -left-[7.5%] h-full relative overflow-visible">
          <defs>
            <linearGradient id="alphaRibbonMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#bae6fd" stopOpacity="1" />
              <stop offset="75%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="alphaRibbonSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.7" />
              <stop offset="35%" stopColor="#1d4ed8" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.7" />
            </linearGradient>
            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g ref={wave1Ref} className="[will-change:transform]">
            <path d="M-100,140 C260,20 520,380 920,240 C1240,120 1420,290 1720,170 L1720,255 C1400,375 1210,205 900,315 C510,455 240,105 -100,225 Z" fill="url(#alphaRibbonSecondary)" opacity="0.8" />
          </g>
          <g ref={wave2Ref} filter="url(#ribbonGlow)" className="[will-change:transform]">
            <path d="M-120,210 C220,340 580,80 960,250 C1260,380 1450,150 1720,240 L1720,305 C1440,215 1250,445 940,315 C560,155 210,405 -120,275 Z" fill="url(#alphaRibbonMain)" />
            <path d="M-120,210 C220,340 580,80 960,250 C1260,380 1450,150 1720,240" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
          </g>
          <g ref={wave3Ref} className="[will-change:transform]">
            <path d="M-80,290 C320,160 660,370 1040,190 C1320,60 1500,280 1700,210" fill="none" stroke="#7dd3fc" strokeWidth="4" opacity="0.65" />
          </g>
        </svg>
      </div>

      {/* کانتینر اصلی محتوا */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* هدر سیکشن */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {t.homeServices?.badge || (isRTL ? 'خدمات ما' : 'OUR SERVICES')}
            </span>
            <span className="w-12 md:w-20 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-[#0a1532] dark:text-white mb-3 md:mb-4 drop-shadow-sm">
            <span>{t.homeServices?.titlePart1 || (isRTL ? 'آنچه ما' : 'What We')} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent">
              {t.homeServices?.titleHighlight || (isRTL ? 'ارائه می‌دهیم' : 'Offer')}
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-300 font-body max-w-2xl">
            {t.homeServices?.subtitle ||
              (isRTL
                ? 'راهکارهای خلاقانه برای متمایز شدن و درخشش برند شما'
                : 'Creative solutions to make your brand stand out')}
          </p>
        </div>

        {/* گرید ۴ کارت شیشه‌ای با قابلیت دیدن پشت کارت و خوانایی کامل متن‌ها در تم روشن و تاریک */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-7 items-center pb-8 [perspective:1400px]">
          {services.map((service, index) => {
            const desc = service.shortDescription?.[currentLang] || service.shortDescription?.en || '';
            const truncatedDesc = desc.length > 55 ? desc.substring(0, 53) + '...' : desc;

            return (
              <div
                key={service.id}
                className="relative group flex flex-col items-center [backface-visibility:hidden]"
              >
                {/* کارت شیشه‌ای شفاف با قابلیت مشاهده پشت و دونه‌های نورانی */}
                <Link
                  to={`/${currentLang}/services#${service.slug}`}
                  className="relative w-full max-w-[280px] sm:max-w-none h-[405px] px-5 pt-6 pb-6 rounded-[2rem] flex flex-col items-center justify-between text-center overflow-hidden border border-blue-950/20 dark:border-blue-400/40 backdrop-blur-md bg-blue-950/10 dark:bg-blue-950/20 [transform-style:preserve-3d] [transform:rotateZ(-2.5deg)_rotateX(6deg)_rotateY(-10deg)] hover:[transform:rotateZ(0deg)_rotateX(0deg)_rotateY(0deg)_translateY(-8px)] transition-all duration-300 ease-out shadow-[-4px_6px_0_-1px_rgba(30,58,138,0.25),-8px_11px_0_-2px_rgba(15,23,42,0.35),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_10px_rgba(56,189,248,0.3),-15px_24px_35px_-8px_rgba(2,6,23,0.6)] hover:shadow-[-2px_3px_0_-1px_rgba(37,99,235,0.4),-5px_7px_0_-2px_rgba(30,58,138,0.5),inset_0_3px_6px_rgba(255,255,255,0.8),inset_0_-6px_16px_rgba(56,189,248,0.5),-20px_30px_45px_-6px_rgba(2,6,23,0.75)] [will-change:transform]"
                >
                  {/* دونه‌های نورانی روی کارت */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(30,58,138,0.2)_1.5px,transparent_0)] dark:bg-[radial-gradient(rgba(255,255,255,0.3)_1.5px,transparent_0)] [background-size:16px_16px]" />

                  {/* درخشش ملایم بالای کارت */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-28 bg-blue-400/20 dark:bg-sky-400/30 rounded-full blur-xl pointer-events-none" />

                  {/* آیکن سه‌بعدی */}
                  <Service3DIcon type={service.icon} />

                  {/* عنوان و توضیحات با رنگ کاملاً خوانا در تم روشن (سرمه‌ای تیره) و تم تاریک (سفید) */}
                  <div className="relative z-10 flex flex-col items-center my-auto px-1">
                    <h3 className="text-lg md:text-xl font-extrabold font-heading text-slate-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                      {service.title?.[currentLang] || service.title?.en}
                    </h3>
                    <p className="text-[11px] md:text-xs text-slate-800 dark:text-slate-100 font-semibold md:font-normal font-body leading-relaxed max-w-[210px]">
                      {truncatedDesc}
                    </p>
                  </div>

                  {/* دکمه فلش داخل بدنه */}
                  <div className="relative z-20 mt-2">
                    <div className="w-9 h-9 rounded-full border border-blue-900/30 dark:border-sky-300/80 bg-white/60 dark:bg-blue-900/40 backdrop-blur-md flex items-center justify-center text-blue-950 dark:text-sky-300 shadow-sm group-hover:bg-blue-950 group-hover:text-white dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950 transition-all duration-300">
                      {isRTL ? <ArrowLeft size={16} strokeWidth={2.5} /> : <ArrowRight size={16} strokeWidth={2.5} />}
                    </div>
                  </div>

                  {/* نوارهای موج‌دار پایین کارت */}
                  <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10 overflow-hidden rounded-b-[2rem]">
                    <svg viewBox="0 0 300 90" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id={`cardWaveA-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                          <stop offset="50%" stopColor="#2563eb" stopOpacity="0.65" />
                          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id={`cardWaveB-${index}`} x1="100%" y1="0%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                          <stop offset="55%" stopColor="#1d4ed8" stopOpacity="0.65" />
                          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.15" />
                        </linearGradient>
                      </defs>
                      <path d="M-10,25 C65,65 140,82 310,88 L310,95 L-10,95 Z" fill={`url(#cardWaveA-${index})`} />
                      <path d="M-10,25 C65,65 140,82 310,88" fill="none" stroke="#93c5fd" strokeWidth="1.2" />
                      <path d="M310,32 C230,72 150,85 -10,88 L-10,95 L310,95 Z" fill={`url(#cardWaveB-${index})`} />
                      <path d="M310,32 C230,72 150,85 -10,88" fill="none" stroke="#7dd3fc" strokeWidth="1.2" />
                    </svg>
                  </div>

                  {/* نقطه نورانی لبه پایین */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-2 bg-blue-600/60 dark:bg-sky-300/80 blur-sm rounded-full z-20" />
                </Link>

                {/* انعکاس نور زیر کارت روی استیج */}
                <div className="w-32 h-4 -mt-2 rounded-full bg-blue-500/30 dark:bg-sky-400/50 blur-xl pointer-events-none transition-all duration-300 group-hover:w-40 group-hover:bg-blue-600/50" />
              </div>
            );
          })}
        </div>

        {/* استیج کف و دکمه Explore All Services */}
        <div className="relative mt-6 md:mt-10 pt-6 flex flex-col items-center">
          <div className="absolute inset-x-0 -top-10 h-32 pointer-events-none -z-10 overflow-visible">
            <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="w-full h-full">
              <ellipse cx="600" cy="75" rx="580" ry="52" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400/35 dark:text-sky-400/40" />
              <ellipse cx="600" cy="82" rx="520" ry="42" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-blue-300/25 dark:text-blue-500/30" />
            </svg>
          </div>

          <Link
            to={`/${currentLang}/services`}
            className="alpha-glass-control group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm md:text-base font-bold font-body text-slate-900 dark:text-white bg-white/80 dark:bg-blue-950/40 backdrop-blur-md border border-blue-900/20 dark:border-blue-400/30 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <span>{t.homeServices?.ctaAll || (isRTL ? 'مشاهده همه خدمات' : 'Explore All Services')}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-blue-800 dark:text-sky-300">
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}