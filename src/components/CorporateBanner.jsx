import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// شناسایی تمام تصاویر داخل src/assets/images برای کارکرد صحیح بعد از npm run build در گیت‌هاب پیجز
const assetImages = import.meta.glob(
  '/src/assets/images/**/*.{png,jpg,jpeg,webp,svg,avif}',
  { eager: true, import: 'default' }
);

export default function CorporateBanner() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    // استفاده از BASE_URL برای پشتیبانی از زیرپوشه گیت‌هاب پیجز
    fetch(`${import.meta.env.BASE_URL}db.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load db.json');
        return res.json();
      })
      .then((data) => {
        if (data?.promotionalBanner) {
          setBannerData(data.promotionalBanner);
        }
      })
      .catch((err) => console.error('Error fetching banner data:', err));
  }, []);

  if (!bannerData) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const cleanPath = path.replace(/^\/+/, '');
    const assetKey = `/src/assets/images/${cleanPath}`;

    // اگر تصویر در src/assets/images باشد، لینک بیلدشده Vite را برمی‌گرداند
    if (assetImages[assetKey]) {
      return assetImages[assetKey];
    }

    // اگر تصویر در پوشه public باشد
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  };

  const mainImageSrc = getImageUrl(bannerData.image || bannerData.mainImage);
  const floatImageSrc = getImageUrl(bannerData.floatImage);

  const title = bannerData.title?.[currentLang] || bannerData.title?.en;
  const subtitle = bannerData.subtitle?.[currentLang] || bannerData.subtitle?.en;
  const buttonText = bannerData.buttonText?.[currentLang] || bannerData.buttonText?.en;

  return (
    <section className="relative w-full max-w-[1440px] mx-auto my-20 px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xl min-h-[380px] md:min-h-[420px] flex items-center">
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -bottom-24 -left-20 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 rounded-full opacity-90 transform rotate-12 blur-[1px]" />
          <div className="absolute -bottom-32 -left-10 w-[550px] h-[280px] bg-sky-400/40 rounded-full transform rotate-6" />
        </div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-8 md:px-16 py-12">
          
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-600 dark:text-sky-400 font-body mb-3">
              {isRTL ? 'بنر شرکتی آلفا گلو' : 'CORPORATE BANNER'}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
              {title}
            </h2>

            <p className="font-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mb-8">
              {subtitle}
            </p>

            <Link
              to={`/${currentLang}${bannerData.buttonLink}`}
              className="alpha-glass-control inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600/15 dark:bg-white/10 backdrop-blur-md border border-blue-500/30 dark:border-white/20 text-blue-950 dark:text-white font-body font-semibold text-xs sm:text-sm shadow-md hover:bg-blue-600/25 dark:hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <span>{buttonText}</span>
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/80 dark:border-sky-400/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-2xl overflow-hidden flex items-center justify-center p-3">
                {mainImageSrc && (
                  <img
                    src={mainImageSrc}
                    alt={title}
                    className="w-full h-full object-cover rounded-full transition-all duration-700 hover:scale-105"
                  />
                )}
              </div>

              <div className="absolute -top-4 right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-sky-400 bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center overflow-hidden p-1.5 animate-bounce duration-1000">
                {floatImageSrc ? (
                  <img
                    src={floatImageSrc}
                    alt="Alpha Glow Badge"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-900 flex items-center justify-center text-white font-heading font-bold text-xs">
                    Alpha Glow
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}