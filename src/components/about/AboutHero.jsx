import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import aboutHeroImg from '../../assets/images/about/about-hero.webp';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

export default function AboutHero() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  return (
    <section className="relative w-full min-h-[55vh] md:min-h-[65vh] flex flex-col justify-between overflow-hidden select-none bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      <Header />

      {/* تصویر پس‌زمینه (قرینه‌سازی هوشمند در حالت فارسی) */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ${
          isRTL ? '-scale-x-100' : ''
        }`}
        style={{ backgroundImage: `url(${aboutHeroImg})` }}
      />

      {/* لایه گرادیان محو کناری هماهنگ با تم لایت و دارک */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none ${
          isRTL
            ? 'bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,#142144_0%,rgba(20,33,68,0.45)_50%,transparent_100%),linear-gradient(295deg,#f8fafc_0%,rgba(248,250,252,0.85)_45%,rgba(248,250,252,0.25)_70%,transparent_90%)] dark:bg-gradient-to-l dark:from-[#142144] dark:via-[#030712]/20 dark:to-transparent'
            : 'bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,#142144_0%,rgba(20,33,68,0.45)_50%,transparent_100%),linear-gradient(65deg,#f8fafc_0%,rgba(248,250,252,0.9)_45%,rgba(248,250,252,0.3)_70%,transparent_90%)] dark:bg-gradient-to-r dark:from-[#142144] dark:via-[#030712]/20 dark:to-transparent'
        }`}
      />

      {/* لایه گرادیان نرم در لبه پایینی */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 dark:from-[#030712] to-transparent pointer-events-none" />

      {/* محتوای متنی هیرو */}
      <div className="container-custom relative z-10 flex-grow flex items-center pt-28 pb-16 md:py-24">
        <div className="max-w-xl flex flex-col items-start text-start">
          
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 md:w-12 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {t.aboutHero?.badge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
            <span>{t.aboutHero?.titlePart1} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {t.aboutHero?.titleHighlight}
            </span>
          </h1>
          <p className="font-body text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed w-[300px] sm:w-auto max-w-md">
            {t.aboutHero?.subtitle}
          </p>

        </div>
      </div>
    </section>
  );
}