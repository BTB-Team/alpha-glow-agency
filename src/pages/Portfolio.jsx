import { useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import Header from '../components/Header';
import PortfolioHero from '../components/portfolio/PortfolioHero';
import PortfolioCollageStage from '../components/portfolio/PortfolioCollageStage';

const CTA_BG_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80';

export default function PortfolioPage() {
  const { lang } = useParams();
  const [searchParams] = useSearchParams();
  const openProjectModal = useStore((state) => state.openProjectModal);
  const worksSectionRef = useRef(null);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  const activeCategory = searchParams.get('category');
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  const handleOpenProjectModal = () => {
    openProjectModal(
      activeCategory && activeCategory !== 'all'
        ? { service: activeCategory }
        : {}
    );
  };

  const handleScrollToWorks = () => {
    worksSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full min-h-screen overflow-x-clip bg-slate-100 dark:bg-[#030712] transition-colors duration-500 pb-0"
    >
      {/* هدر شناور (اگر Header در لایوت اصلی رندر می‌شود، این خط را حذف کن) */}
      <Header />

      {/* ۱. هیروی مینیمال و مدرن صفحه پورتفولیو */}
      <PortfolioHero onScrollToWorks={handleScrollToWorks} />

      {/* ۲. دراپ‌داون فیلتر + صفحه‌بندی + میز کلاژ تعاملی */}
      <div ref={worksSectionRef} className="pt-8 md:pt-10 scroll-mt-24">
        <PortfolioCollageStage />
      </div>

      {/* ۳. سیکشن تمام‌عرض دعوت به اقدام (CTA) */}
      <section className="relative w-full overflow-hidden mt-12 md:mt-20 py-24 sm:py-28 md:py-36 border-t border-slate-200 dark:border-slate-800">
        <img
          src={CTA_BG_IMAGE}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-950/82 to-slate-950/95 dark:from-[#030712]/92 dark:via-slate-950/85 dark:to-[#030712]/96"
        />

        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
        />

        <div className="container-custom relative z-10 px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-sky-300 font-body">
              {tp.cta.badge || tp.badge}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-400 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-5 max-w-3xl leading-tight">
            {tp.cta.title}
          </h2>

          <p className="font-body text-slate-200/90 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
            {tp.cta.subtitle}
          </p>

          <button
            type="button"
            onClick={handleOpenProjectModal}
            className="inline-flex items-center gap-2.5 px-8 py-4 text-white font-body font-bold text-sm sm:text-base shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group alpha-glass-bar"
          >
            <span>{tp.cta.button}</span>
            <ActionArrow
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </section>
    </main>
  );
}

