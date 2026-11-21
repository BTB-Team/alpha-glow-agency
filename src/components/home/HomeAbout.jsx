import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import AboutStats from './AboutStats';

// بارگذاری خودکار تصاویر از پوشه src/assets/images برای کارکرد صحیح در دیپلوی
const allImages = import.meta.glob('../../assets/images/**/*', { eager: true });

const getLogoUrl = (imagePath) => {
  if (!imagePath) return '';
  const fileName = imagePath.split('/').pop();
  const matched = Object.keys(allImages).find((k) =>
    k.toLowerCase().endsWith(fileName.toLowerCase())
  );
  return matched ? allImages[matched].default : '';
};

export default function HomeAbout() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const logoSrc = getLogoUrl(db?.about?.logoImage);
  const content = t.homeAbout || {};

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden select-none transition-colors duration-500 bg-slate-50 dark:bg-[#030712]">
      <div className="container-custom relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ستون متن و دکمه (۷ ستون) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start z-20">
            
            <div className="flex items-center gap-4 mb-3">
              <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
              <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
                {content.badge}
              </span>
            </div>

            <p className="text-xs md:text-sm font-bold tracking-wider uppercase text-blue-600/80 dark:text-sky-400/80 mb-2 font-body">
              {content.subHeader}
            </p>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm leading-tight">
              <span>{content.titlePart1} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>

            <div className="space-y-4 font-body text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              <p>{content.para1}</p>
              <p>{content.para2}</p>
            </div>

            <div className="flex flex-wrap items-center">
              <Link
                to={`/${currentLang}/about`}
                className="alpha-glass-control group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm md:text-base font-bold font-body text-slate-900 dark:text-white transition-all duration-300 hover:scale-105 shadow-md"
              >
                <span>{content.ctaStory}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-blue-800 dark:text-sky-300">
                  {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </span>
              </Link>
            </div>

          </div>

          {/* ستون تصویر دایره‌ای و روبان‌های گرافیکی (۵ ستون) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] flex items-center justify-center">
              
              {/* لایه ۱ (عقب - z-0): روبان‌های پشتی و اشکال هندسی دور */}
              <svg
                viewBox="0 0 560 560"
                fill="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              >
                <defs>
                  <linearGradient id="backRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient id="backRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0369a1" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                <circle
                  cx="280"
                  cy="280"
                  r="245"
                  stroke="#38bdf8"
                  strokeOpacity="0.14"
                  strokeWidth="1.5"
                  strokeDasharray="8 14"
                />

                <path
                  d="M 35 390 C 10 210, 190 35, 395 65 C 520 85, 545 220, 470 330"
                  stroke="url(#backRibbon1)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                <path
                  d="M 110 85 C 240 -15, 480 70, 515 260 C 540 395, 380 535, 200 495"
                  stroke="url(#backRibbon2)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                <path
                  d="M 15 220 C 90 60, 410 -10, 540 180"
                  stroke="#38bdf8"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />

                <circle cx="85" cy="95" r="6" fill="#0284c7" fillOpacity="0.4" />
                <circle cx="485" cy="435" r="7" fill="#38bdf8" fillOpacity="0.35" />
                <polygon points="475,85 490,110 460,110" fill="#0284c7" fillOpacity="0.35" />
                <rect
                  x="60"
                  y="420"
                  width="12"
                  height="12"
                  rx="2"
                  transform="rotate(30 66 426)"
                  stroke="#38bdf8"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                />
              </svg>

              {/* لایه ۲ (میانی - z-10): قاب دایره‌ای بزرگ تصویر */}
              <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] rounded-full overflow-hidden border-2 border-sky-400/50 dark:border-sky-400/40 bg-[#030712] shadow-[0_20px_50px_rgba(2,132,199,0.28)] flex items-center justify-center">
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={content.titleHighlight || 'Alpha Glow'}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full scale-[1.02]"
                  />
                )}
              </div>

              {/* لایه ۳ (رویی - z-20): روبان‌های سه‌بعدی جلویی و اشکال هندسی نزدیک */}
              <svg
                viewBox="0 0 560 560"
                fill="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              >
                <defs>
                  <linearGradient id="frontRibbonMain" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
                    <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
                  </linearGradient>

                  <linearGradient id="frontRibbonAccent" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>

                <path
                  d="M 35 390 C 95 535, 390 520, 470 330"
                  stroke="url(#frontRibbonMain)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                <path
                  d="M 55 405 C 120 545, 385 530, 455 350"
                  stroke="#e0f2fe"
                  strokeOpacity="0.6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="16 10"
                />

                <path
                  d="M 50 185 C 150 320, 390 240, 520 375"
                  stroke="url(#frontRibbonAccent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                <polygon points="495,125 525,170 470,162" fill="url(#prismGrad)" />
                <polygon points="495,125 525,170 505,148" fill="#bae6fd" fillOpacity="0.6" />

                <circle
                  cx="65"
                  cy="315"
                  r="16"
                  stroke="url(#prismGrad)"
                  strokeWidth="4"
                  fill="none"
                />

                <rect
                  x="42"
                  y="140"
                  width="20"
                  height="20"
                  rx="4"
                  transform="rotate(45 52 150)"
                  fill="url(#prismGrad)"
                />

                <polygon
                  points="440,465 468,505 415,498"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  fill="none"
                />

                <circle cx="155" cy="495" r="8" fill="#38bdf8" />
                <circle cx="385" cy="45" r="9" fill="#0ea5e9" />
                <circle cx="535" cy="265" r="5" fill="#7dd3fc" />
              </svg>

            </div>
          </div>

        </div>

        {/* ردیف کارت‌های شیشه‌ای آمار */}
        <AboutStats />

      </div>
    </section>
  );
}