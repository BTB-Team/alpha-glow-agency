import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Header from '../Header';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { Sparkles, CheckCircle2 } from 'lucide-react';

// ایمپورت ۸ تصویر اختصاصی هیرو با فرمت webp
import heroDarkEn from '../../assets/images/home/hero-dark-en.webp';
import heroLightEn from '../../assets/images/home/hero-light-en.webp';
import heroDarkFa from '../../assets/images/home/hero-dark-fa.webp';
import heroLightFa from '../../assets/images/home/hero-light-fa.webp';

import heroMobileDarkEn from '../../assets/images/home/hero-mobile-dark-en.webp';
import heroMobileLightEn from '../../assets/images/home/hero-mobile-light-en.webp';
import heroMobileDarkFa from '../../assets/images/home/hero-mobile-dark-fa.webp';
import heroMobileLightFa from '../../assets/images/home/hero-mobile-light-fa.webp';

export default function Hero() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  // انتخاب تصویر دسکتاپ بر اساس زبان و تم
  const getDesktopImage = () => {
    if (isRTL) {
      return theme === 'dark' ? heroDarkFa : heroLightFa;
    } else {
      return theme === 'dark' ? heroDarkEn : heroLightEn;
    }
  };

  // انتخاب تصویر موبایل بر اساس زبان و تم
  const getMobileImage = () => {
    if (isRTL) {
      return theme === 'dark' ? heroMobileDarkFa : heroMobileLightFa;
    } else {
      return theme === 'dark' ? heroMobileDarkEn : heroMobileLightEn;
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
      
      {/* پس‌زمینه سینمایی هیرو با ۸ تصویر اختصاصی */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={getDesktopImage()}
          alt="Alpha Glow Agency Workspace Desktop"
          className="hidden md:block w-full h-full object-cover object-center transition-transform duration-700"
        />

        <img
          src={getMobileImage()}
          alt="Alpha Glow Agency Workspace Mobile"
          className="md:hidden w-full h-full object-cover object-center transition-transform duration-700"
        />
        
        {/* گرادیان هوشمند با وایب سرمه‌ای */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
            isRTL 
              ? 'bg-gradient-to-t from-slate-950/95 via-blue-950/60 to-transparent md:bg-gradient-to-l md:from-slate-950/90 md:via-blue-950/50 md:to-transparent' 
              : 'bg-gradient-to-t from-slate-950/95 via-blue-950/60 to-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-blue-950/50 md:to-transparent'
          }`} 
        />
      </div>

      {/* هدر شناور در بالای صفحه */}
      <Header />

      {/* محتوای اصلی هیرو (تنظیم پدینگ بیشتر در موبایل برای پایین‌تر آمدن محتوا) */}
      <div className="container-custom relative z-10 flex flex-col justify-center h-full pt-44 sm:pt-40 md:pt-32 pb-6 sm:pb-10">
        <div className="max-w-[300px] sm:max-w-md lg:max-w-2xl flex flex-col items-start text-start">
          
          {/* برچسب بالا */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full alpha-glass-control mb-3 md:mb-6 text-[11px] sm:text-sm font-semibold font-body text-white bg-blue-950/30 backdrop-blur-md border border-blue-400/30 shadow-sm">
            <Sparkles size={14} className="text-blue-300" />
            <span>{t.hero?.badge || (isRTL ? 'آژانس خلاق و دیجیتال مارکتینگ' : 'Creative & Digital Agency')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black font-heading text-white leading-[1.15] tracking-tight mb-2.5 md:mb-6 drop-shadow-md">
            {t.hero?.title || (isRTL ? 'محل درخشش برند ها' : 'Where Brands Start to Glow.')}
          </h1>

          {/* متن توضیحات با شکست خط کنترل‌شده در تبلت/موبایل از کلمه designs به بعد */}
          <p className="text-xs sm:text-sm lg:text-xl text-slate-100 font-body leading-relaxed mb-4 md:mb-8 drop-shadow">
            {isRTL ? (
              'ما ایده‌ها را به برندهای قدرتمند، طراحی‌های خیره‌کننده و تجربه‌های دیجیتالی تأثیرگذار تبدیل می‌کنیم.'
            ) : (
              <>
                We turn ideas into powerful brands, stunning <span className="inline md:inline">designs,</span>
                <br className="hidden sm:inline md:hidden" /> and digital experiences that make an impact.
              </>
            )}
          </p>

          {/* دکمه اقدام */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/${currentLang}/services`}
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full alpha-glass-control text-white dark:text-white font-bold font-body text-xs sm:text-base bg-blue-900/30 dark:bg-blue-950/40 backdrop-blur-md border border-blue-400/30 hover:bg-blue-800/40 dark:hover:bg-blue-900/50 hover:border-blue-300 transition-all duration-300 shadow-sm"
            >
              {t.hero?.ctaSecondary || (isRTL ? 'مشاهده خدمات' : 'Explore Services')}
            </Link>
          </div>

          {/* بخش ویژگی‌ها با فاصله متناسب تا کف موبایل */}
          <div className="flex items-center gap-3 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 text-[11px] sm:text-sm font-semibold font-body text-slate-200 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
              <span>{isRTL ? 'وبسایت • گرافیک • برندینگ • چاپ' : 'Website • Graphic • Branding • Print'}</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}