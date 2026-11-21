import { useParams, Link } from 'react-router-dom';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import fa from '../locales/fa.json';
import en from '../locales/en.json';  
import Header from '../components/Header';
import PortfolioCollageStage from '../components/portfolio/PortfolioCollageStage';

// کامپوننت هدر اختصاصی پروژه را از مسیر خودش ایمپورت کن:
// import PageHeader from '../components/PageHeader';

export default function PortfolioPage() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <main
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full min-h-screen overflow-x-clip bg-slate-100 dark:bg-[#030712] transition-colors duration-500 pt-28 pb-24"
    >
      {/* ۱. محل قرارگیری کامپوننت هدر اختصاصی تو */}
        <Header/>
      {/* ۲. کامپوننت مستقل فیلتر + میز کارت‌های نامتقارن + مدال */}
      <PortfolioCollageStage />

      {/* ۳. بنر دعوت به اقدام پایانی */}
      <section className="container-custom max-w-6xl mx-auto mt-16 md:mt-24 px-4 sm:px-6">
        <div className="bg-blue-950 dark:bg-slate-900 border border-blue-900 dark:border-slate-800 rounded-[32px] p-8 sm:p-12 md:p-16 text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white mb-4 max-w-2xl">
            {tp.cta.title}
          </h2>
          <p className="font-body text-slate-300 dark:text-slate-400 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
            {tp.cta.subtitle}
          </p>
          <Link
            to={`/${currentLang}/contact`}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-blue-950 hover:bg-sky-100 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300 font-body font-bold text-sm transition-colors duration-300"
          >
            <span>{tp.cta.button}</span>
            <ActionArrow size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}