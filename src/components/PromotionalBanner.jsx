import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import db from '../../db.json';
import fa from '../locales/fa.json';
import en from '../locales/en.json';

export default function PromotionalBanner() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const bannerData = db?.promotionalBanner;
  if (!bannerData) return null;

  const title = bannerData.title?.[currentLang] || bannerData.title?.en;
  const subtitle = bannerData.subtitle?.[currentLang] || bannerData.subtitle?.en;
  const buttonText = bannerData.buttonText?.[currentLang] || bannerData.buttonText?.en;
  const secondaryButtonText = bannerData.secondaryButtonText?.[currentLang] || bannerData.secondaryButtonText?.en;

  return (
    <section className="relative w-full max-w-[1440px] mx-auto my-16 px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[420px] md:min-h-[480px] flex items-center justify-center isolate">
        
        {/* تصویر پس‌زمینه با افکت زوم ملایم در هاور */}
        <div className="absolute inset-0 z-[-2] overflow-hidden">
          <img
            src={bannerData.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop"}
            alt="Promotional Banner"
            className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
          />
        </div>

        {/* لایه گرادیان و تاریک‌کننده برای خوانایی عالی متن‌ها روی عکس */}
        <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-950/90 via-slate-950/80 to-slate-900/90 dark:from-black/95 dark:via-[#030712]/90 dark:to-slate-950/95 backdrop-blur-[2px]" />

        {/* محتوای بنر */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center">
          
          {/* بج یا برچسب بالایی */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-sky-500/10 border border-white/20 dark:border-sky-400/30 text-white dark:text-sky-300 text-xs md:text-sm font-body mb-6 backdrop-blur-md shadow-inner">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>{t.homeBanner?.badge || (isRTL ? 'فرصت محدود کمپین' : 'Limited Time Campaign')}</span>
          </div>

          {/* عنوان اصلی */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading tracking-tight text-white mb-6 leading-tight">
            {title}
          </h2>

          {/* توضیحات تکمیلی */}
          <p className="font-body text-slate-200 dark:text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed mb-10">
            {subtitle}
          </p>

          {/* دکمه‌های اقدام (CTA Buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to={`/${currentLang}${bannerData.buttonLink}`}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-heading font-bold text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>{buttonText}</span>
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>

            <Link
              to={`/${currentLang}${bannerData.secondaryButtonLink}`}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-sm md:text-base border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>{secondaryButtonText}</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}