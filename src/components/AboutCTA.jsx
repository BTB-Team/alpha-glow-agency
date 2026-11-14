import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import fa from '../locales/fa.json';
import en from '../locales/en.json';

export default function AboutCTA() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const data = t.aboutCta;
  if (!data) return null;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="w-full py-12 md:py-16 bg-transparent">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* خط جداکننده ظریف بالا و پایین بدون پس‌زمینه */}
        <div className="w-full py-8 md:py-10 border-y border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          
          {/* بخش متن کوتاه و مینیمال */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              <span>{data.titlePart1} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {data.titleHighlight}
              </span>
            </h2>
            <p className="font-body text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {data.subtitle}
            </p>
          </div>

          {/* دکمه فراخوان عمل */}
          <Link
            to={`/${currentLang}/contact`}
            className="alpha-glass-bar group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-body font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:border-blue-500/50 dark:hover:border-sky-400/50 transition-all duration-300 shrink-0"
          >
            <span>{data.buttonText}</span>
            <ArrowIcon
              size={18}
              strokeWidth={2.5}
              className="text-blue-700 dark:text-sky-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </Link>

        </div>

      </div>
    </section>
  );
}