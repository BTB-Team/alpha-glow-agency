import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { useStore } from '../../store/useStore';

const CTA_BG_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80';

export default function ServiceProcessAndFAQ({ activeService }) {
  const { lang } = useParams();
  const openProjectModal = useStore((state) => state.openProjectModal);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const ts = t.servicesPage || {};

  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const services = db?.services || [];
  const currentService = services.find((s) => s.slug === activeService) || services[0];
  const serviceTitle =
    typeof currentService?.title === 'object'
      ? currentService.title[currentLang] || currentService.title.en
      : '';

  const steps = ts.process?.steps || [];
  const faqItems = ts.faq?.items || [];
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full bg-slate-100 dark:bg-[#030712] transition-colors duration-500 pt-16 md:pt-24"
    >
      {/* بخش ۱: روند همکاری (۴ مرحله عمومی و شفاف) */}
      {steps.length > 0 && (
        <section className="container-custom max-w-6xl mx-auto px-4 sm:px-6 mb-20 md:mb-28">
          <div className="flex flex-col items-center text-center mb-12 md:mb-14">
            <div className="flex items-center gap-4 mb-3">
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
              <span className="font-body text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-blue-900 dark:text-sky-300">
                {ts.process?.badge}
              </span>
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-3">
              <span>{ts.process?.titlePart1} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {ts.process?.titleHighlight}
              </span>
            </h2>

            <p className="font-body !text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {ts.process?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col"
              >
                <span className="font-heading text-4xl font-black bg-gradient-to-br from-blue-950 to-sky-500 dark:from-sky-300 dark:to-blue-500 bg-clip-text text-transparent opacity-90 mb-4 block">
                  {step.number}
                </span>

                <h3 className="font-body font-bold !text-[17px] !leading-snug text-slate-900 dark:text-white mb-2.5">
                  {step.title}
                </h3>

                <p className="font-body !text-[14px] !leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* بخش ۲: سوالات متداول عمومی (آکاردئون تمیز) */}
      {faqItems.length > 0 && (
        <section className="container-custom max-w-4xl mx-auto px-4 sm:px-6 mb-20 md:mb-28">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12">
            <div className="flex items-center gap-4 mb-3">
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
              <span className="font-body text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-blue-900 dark:text-sky-300">
                {ts.faq?.badge}
              </span>
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              <span>{ts.faq?.titlePart1} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {ts.faq?.titleHighlight}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-slate-900 border-blue-900/25 dark:border-sky-400/40 shadow-md'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 text-start cursor-pointer"
                  >
                    <span className="font-body font-bold !text-[16px] !leading-snug text-slate-900 dark:text-white">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-blue-900 dark:text-sky-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 font-body !text-[15px] !leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* بخش ۳: بنر تمام‌عرض دعوت به اقدام پایانی متصل به ProjectRequestModal */}
      <section className="relative w-full overflow-hidden py-24 sm:py-28 md:py-32 border-t border-slate-200 dark:border-slate-800">
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
              {ts.cta?.badge}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-400 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-5 max-w-3xl leading-tight">
            {ts.cta?.titlePrefix}{' '}
            <span className="text-sky-300 font-heading">{serviceTitle}</span>{' '}
            {ts.cta?.titleSuffix}
          </h2>

          <p className="font-body text-slate-200/90 dark:text-slate-300 !text-[15px] sm:!text-[17px] max-w-2xl mb-10 leading-relaxed">
            {ts.cta?.subtitle}
          </p>

          <button
            type="button"
            onClick={() => openProjectModal({ service: activeService })}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-blue-950 hover:bg-sky-100 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300 font-body font-bold !text-[15px] shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
          >
            <span>{ts.cta?.button}</span>
            <ActionArrow
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </section>
    </div>
  );
}