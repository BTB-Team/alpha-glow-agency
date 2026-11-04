import { useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

// { eager: true } یعنی همه عکس‌ها در زمان بیلد بارگذاری شوند
// علامت ** یعنی تمام زیرپوشه‌ها داخل پوشه images را هم اسکن کن
const allImages = import.meta.glob('../../assets/images/**/*', { eager: true });

// تابع هوشمند برای پیدا کردن عکس بر اساس اسم فایل یا مسیر نسبی آن
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // استخراج نام فایل (مثلا web-1.webp) از مسیری که در db.json ذخیره شده
  const fileName = imagePath.split('/').pop();
  
  // جستجو در بین تمام فایل‌های پیدا شده در پوشه images و زیرپوشه‌های آن
  const matchedKey = Object.keys(allImages).find((key) => key.endsWith(fileName));
  
  return matchedKey ? allImages[matchedKey].default : imagePath;
};

export default function HomePortfolio() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const items = db?.portfolio?.slice(0, 8) || [];

  const handleMouseMove = (e, cardEl) => {
    if (window.innerWidth < 1024) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardEl.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (cardEl) => {
    cardEl.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden select-none transition-colors duration-500 bg-slate-50 dark:bg-[#030712]">
      <div className="container-custom relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {t.homePortfolio?.badge || (isRTL ? 'نمونه‌کارهای ما' : 'OUR PORTFOLIO')}
            </span>
            <span className="w-12 md:w-20 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-3 md:mb-4 drop-shadow-sm">
            <span>{t.homePortfolio?.titlePart1 || (isRTL ? 'گزیده' : 'Selected')} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent">
              {t.homePortfolio?.titleHighlight || (isRTL ? 'آثار خلاقانه' : 'Creative Works')}
            </span>
          </h2>

          <p className="font-body text-slate-600 dark:text-slate-300 max-w-2xl">
            {t.homePortfolio?.subtitle || (isRTL ? 'نگاهی کوتاه به ایده‌هایی که به واقعیت تبدیل شده‌اند.' : 'A glimpse of ideas brought to life.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center pb-12">
          {items.map((item) => {
            const categoryName = t.homePortfolio?.categories?.[item.category] || item.category;
            
            // تبدیل مسیر متنی db.json به آدرس معتبر و هک شده توسط Vite (حتی در زیرپوشه‌ها)
            const resolvedImage = getImageUrl(item.mainImage);

            return (
              <div
                key={item.id}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                className="relative group w-full h-[320px] md:h-[340px] rounded-2xl overflow-hidden cursor-pointer border border-slate-300/60 dark:border-blue-500/30 shadow-xl bg-slate-900/10 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 ease-out will-change-transform hover:z-30"
              >
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-sky-400 group-hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] pointer-events-none transition-all duration-300 z-30" />

                <img
                  src={resolvedImage}
                  alt={item.title?.[currentLang] || item.title?.en}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent backdrop-blur-md border-t border-white/10 z-20 flex flex-col text-start">
                  <h3 className="text-xs md:text-sm font-semibold text-white drop-shadow truncate">
                    {item.title?.[currentLang] || item.title?.en}
                  </h3>
                  <span className="text-[10px] md:text-[11px] text-sky-300 font-body mt-0.5">
                    {categoryName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center mt-6">
          <a
            href={`/${currentLang}/portfolio`}
            className="alpha-glass-control group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm md:text-base font-bold font-body text-slate-900 dark:text-white backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md relative z-20"
          >
            <span>{t.homePortfolio?.ctaAll || (isRTL ? 'مشاهده همه پروژه‌ها' : 'Explore All Projects')}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-blue-800 dark:text-sky-300">
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}