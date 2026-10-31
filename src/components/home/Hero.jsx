import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Header from '../Header';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

import heroDarkImg from '../../assets/images/home/home-hero-dark.webp';
import heroLightImg from '../../assets/images/home/home-hero-light.webp';
import heroDarkMobileImg from '../../assets/images/home/home-hero-dark-mobile.webp';
import heroLightMobileImg from '../../assets/images/home/home-hero-light-mobile.webp';

export default function Hero() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'en' ? 'en' : 'fa';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const currentDesktopImage = theme === 'dark' ? heroDarkImg : heroLightImg;
  const currentMobileImage = theme === 'dark' ? heroDarkMobileImg : heroLightMobileImg;

  return (
    <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
      
      {/* پس‌زمینه سینمایی هیرو */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={currentDesktopImage}
          alt="Alpha Glow Agency Workspace Desktop"
          className={`hidden md:block w-full h-full object-cover object-center transition-transform duration-700 ${
            isRTL ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        />

        <img
          src={currentMobileImage}
          alt="Alpha Glow Agency Workspace Mobile"
          className={`md:hidden w-full h-full object-cover object-center transition-transform duration-700 ${
            isRTL ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        />
        
        {/* گرادیان هوشمند: در موبایل از پایین به بالا محو می‌شود تا متن‌ها روی میز خلوت قرار گیرند */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
            isRTL 
              ? 'bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent md:bg-gradient-to-l md:from-slate-950/90 md:via-slate-950/50 md:to-transparent' 
              : 'bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-950/50 md:to-transparent'
          }`} 
        />
      </div>

      {/* هدر شناور در بالای صفحه */}
      <Header />

      {/* محتوای اصلی هیرو: انتقال به پایین صفحه در موبایل و وسط‌چین در دسکتاپ */}
      <div className="container-custom relative z-10 flex flex-col justify-end md:justify-center h-full pt-28 pb-10 sm:pb-16">
        <div className="max-w-2xl flex flex-col items-start text-start">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full alpha-glass-control mb-4 md:mb-6 text-xs font-semibold text-white bg-white/20 backdrop-blur-md border border-white/40 shadow-sm">
            <Sparkles size={14} className="text-blue-300" />
            <span>{t.hero?.badge || (isRTL ? 'آژانس خلاق و دیجیتال مارکتینگ' : 'Creative & Digital Agency')}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black font-heading text-white leading-[1.15] tracking-tight mb-3 md:mb-6 drop-shadow-md">
            {t.hero?.title || (isRTL ? 'محل درخشش برند ها' : 'Where Brands Start to Glow.')}
          </h1>

          <p className="text-xs sm:text-base text-slate-100 font-body leading-relaxed mb-6 md:mb-8 max-w-lg drop-shadow">
            {t.hero?.description || (isRTL 
              ? 'ما ایده‌ها را به برندهای قدرتمند، طراحی‌های خیره‌کننده و تجربه‌های دیجیتالی تأثیرگذار تبدیل می‌کنیم.' 
              : 'We turn ideas into powerful brands, stunning designs, and digital experiences that make an impact.')}
          </p>

                      <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/${currentLang}/about`}
             className="w-auto px-7 py-3.5 rounded-full alpha-glass-control text-white dark:text-white font-bold text-sm bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 shadow-sm"            >
              <span>{t.hero?.ctaPrimary || (isRTL ? 'در باره ما' : 'About Us')}</span>
              {/* {isRTL ? <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> : <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />} */}
            </Link>

            <Link
              to={`/${currentLang}/services`}
              className="px-7 py-3.5 rounded-full alpha-glass-control text-white dark:text-white font-bold text-sm bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 shadow-sm"
            >
              {t.hero?.ctaSecondary || (isRTL ? 'مشاهده خدمات' : 'Explore Services')}
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-6 mt-8 md:mt-12 pt-6 border-t border-white/20 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span>{isRTL ? 'کیفیت سینمایی' : 'Cinematic Quality'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span>{isRTL ? 'طراحی اختصاصی' : 'Custom Branding'}</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}