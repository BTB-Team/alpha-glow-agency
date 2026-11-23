import { useState, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpLeft, ArrowUpRight, Calendar, User } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import PortfolioModal, { getPortfolioImageUrl } from '../portfolio/PortfolioModal';

gsap.registerPlugin(ScrollTrigger);

export default function ServicePortfolioStack({ activeCategory = 'all' }) {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  const [selectedProject, setSelectedProject] = useState(null);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const scrimRefs = useRef([]);
  const counterRef = useRef(null);

  const allProjects = db?.portfolio || [];
  const filteredProjects =
    !activeCategory || activeCategory === 'all'
      ? allProjects
      : allProjects.filter((item) => item.category === activeCategory);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  useLayoutEffect(() => {
    const cards = cardRefs.current.slice(0, filteredProjects.length).filter(Boolean);
    const scrims = scrimRefs.current.slice(0, filteredProjects.length).filter(Boolean);

    if (counterRef.current) counterRef.current.textContent = '01';

    if (!stageRef.current || cards.length <= 1) {
      cards.forEach((card) => gsap.set(card, { clearProps: 'all' }));
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          y: i === 0 ? 0 : window.innerHeight,
          scale: 1,
          transformOrigin: 'top center',
        });
      });

      scrims.forEach((scrim) => gsap.set(scrim, { opacity: 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top 80px',
          end: () => `+=${(cards.length - 1) * window.innerHeight * 0.85}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!counterRef.current) return;
            const currentIdx = Math.min(
              cards.length,
              Math.floor(self.progress * (cards.length - 1) + 0.5) + 1
            );
            counterRef.current.textContent = String(currentIdx).padStart(2, '0');
          },
        },
      });

      for (let step = 1; step < cards.length; step++) {
        tl.to(cards[step], { y: 0, duration: 1, ease: 'none' }, step - 1);

        for (let prev = 0; prev < step; prev++) {
          const depth = step - prev;
          tl.to(
            cards[prev],
            {
              scale: Math.max(0.84, 1 - depth * 0.045),
              y: -Math.min(depth, 4) * 18,
              duration: 1,
              ease: 'none',
            },
            step - 1
          );

          if (scrims[prev]) {
            tl.to(
              scrims[prev],
              { opacity: Math.min(0.45, depth * 0.16), duration: 1, ease: 'none' },
              step - 1
            );
          }
        }
      }
    }, stageRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [filteredProjects.length, activeCategory, currentLang]);

  if (filteredProjects.length === 0) return null;

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  // لینک هوشمند به صفحه پورتفولیو همراه با فیلتر انتخاب‌شده در صفحه خدمات
  const portfolioTargetUrl =
    activeCategory && activeCategory !== 'all'
      ? `/${currentLang}/portfolio?category=${activeCategory}`
      : `/${currentLang}/portfolio`;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="w-full py-12">
      {/* استیج انباشته GSAP */}
      <section
        ref={stageRef}
        className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
      >
        {filteredProjects.length > 1 && (
          <div className="w-full max-w-6xl flex items-center justify-end mb-4 px-2">
            <div className="inline-flex items-baseline gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span
                ref={counterRef}
                className="font-heading font-black text-sm sm:text-base text-blue-950 dark:text-sky-400"
              >
                01
              </span>
              <span className="font-body text-xs text-slate-400">/</span>
              <span className="font-heading font-bold text-xs text-slate-500 dark:text-slate-400">
                {String(filteredProjects.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        <div className="relative w-full max-w-6xl h-[520px] sm:h-[550px] lg:h-[470px]">
          {filteredProjects.map((project, index) => {
            const title = getLocalized(project.title);
            const shortDesc = getLocalized(project.shortDescription);
            const client = getLocalized(project.client);
            const categoryLabel = tp.categories[project.category] || project.category;

            return (
              <article
                key={project.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full will-change-transform bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[34px] border border-slate-200 dark:border-slate-800 shadow-[0_-14px_38px_-14px_rgba(15,23,42,0.16),0_25px_50px_-20px_rgba(15,23,42,0.16)] dark:shadow-[0_-14px_38px_-14px_rgba(0,0,0,0.85),0_25px_50px_-20px_rgba(0,0,0,0.75)] overflow-hidden"
              >
                <div
                  ref={(el) => (scrimRefs.current[index] = el)}
                  className="absolute inset-0 bg-slate-950 pointer-events-none z-30"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                  <div className="lg:col-span-7 relative bg-slate-100 dark:bg-slate-950 overflow-hidden group h-[220px] sm:h-[260px] lg:h-full">
                    <img
                      src={getPortfolioImageUrl(project.mainImage)}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 sm:top-5 inset-x-4 sm:inset-x-5 flex items-center justify-between pointer-events-none">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-body font-bold bg-white text-blue-950 dark:bg-slate-950 dark:text-sky-300 border border-slate-200 dark:border-slate-800 shadow-sm">
                        {categoryLabel}
                      </span>
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-heading font-black bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950 shadow-md">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 sm:p-7 lg:p-10 flex flex-col justify-between h-[300px] sm:h-[290px] lg:h-full">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-body text-slate-500 dark:text-slate-400 mb-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-blue-700 dark:text-sky-400" />
                          <span className="opacity-75">{tp.card.client}:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {client}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-blue-700 dark:text-sky-400" />
                          <span className="opacity-75">{tp.card.date}:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {project.createdAt}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-heading text-slate-900 dark:text-white leading-snug mb-3 line-clamp-2">
                        {title}
                      </h3>

                      <p className="font-body text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {shortDesc}
                      </p>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer group/btn"
                      >
                        <span>{tp.card.viewDetails}</span>
                        <ActionArrow
                          size={17}
                          className="transition-transform duration-300 group-hover/btn:-translate-y-0.5"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* دکمه انتقال هوشمند به صفحه پورتفولیو با حفظ فیلتر سرویس فعلی */}
      <div className="container-custom flex justify-center mt-10">
        <Link
          to={portfolioTargetUrl}
          className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-blue-950 text-blue-950 hover:text-white dark:bg-slate-900 dark:hover:bg-sky-400 dark:text-white dark:hover:text-slate-950 border border-slate-200 dark:border-slate-800 shadow-md font-body font-bold text-sm transition-all duration-300"
        >
          <span>
            {tp.viewCategoryPortfolio ||
              (isRTL ? 'مشاهده همه نمونه‌کارهای این خدمت' : 'View All Projects in This Service')}
          </span>
          <ActionArrow size={18} />
        </Link>
      </div>

      <PortfolioModal
        project={selectedProject}
        currentLang={currentLang}
        tp={tp}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}