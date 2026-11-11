import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function FinalCTA() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  const [ctaData, setCtaData] = useState(null);

  useEffect(() => {
    // استفاده از BASE_URL برای پشتیبانی از زیرپوشه گیت‌هاب پیجز
    fetch(`${import.meta.env.BASE_URL}db.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load db.json');
        return res.json();
      })
      .then((data) => {
        if (data?.finalCta) {
          setCtaData(data.finalCta);
        }
      })
      .catch((err) => console.error('Error fetching final CTA data:', err));
  }, []);

  if (!ctaData) return null;

  const badge = ctaData.badge?.[currentLang] || ctaData.badge?.en;
  const titlePart1 = ctaData.titlePart1?.[currentLang] || ctaData.titlePart1?.en;
  const titleHighlight = ctaData.titleHighlight?.[currentLang] || ctaData.titleHighlight?.en;
  const subtitle = ctaData.subtitle?.[currentLang] || ctaData.subtitle?.en;
  const primaryBtnText = ctaData.primaryBtnText?.[currentLang] || ctaData.primaryBtnText?.en;
  const secondaryBtnText = ctaData.secondaryBtnText?.[currentLang] || ctaData.secondaryBtnText?.en;

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[750px] h-[250px] md:h-[350px] bg-blue-600/10 dark:bg-sky-500/10 rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        
        <div className="flex items-center gap-4 mb-3">
          <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
          <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
            {badge}
          </span>
          <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-4">
          <span>{titlePart1} </span>
          <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
            {titleHighlight}
          </span>
        </h2>

        <p className="font-body text-slate-600 dark:text-slate-400 max-w-xl text-sm md:text-base leading-relaxed mb-9">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to={`/${currentLang}${ctaData.primaryBtnLink}`}
            className="alpha-glass-control inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600/15 dark:bg-sky-500/15 backdrop-blur-md border border-blue-500/40 dark:border-sky-400/30 text-blue-950 dark:text-white font-body font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/10 hover:bg-blue-600/25 dark:hover:bg-sky-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <span>{primaryBtnText}</span>
            {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>

          {secondaryBtnText && (
            <Link
              to={`/${currentLang}${ctaData.secondaryBtnLink}`}
              className="alpha-glass-control inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-slate-300/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-body font-medium text-xs sm:text-sm hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <span>{secondaryBtnText}</span>
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}