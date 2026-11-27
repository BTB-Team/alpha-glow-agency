import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  Layers,
  ShieldCheck,
  Sparkles,
  PackageCheck,
  CheckCircle2,
  FolderCheck,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

const DELIVERABLE_ICONS = [Layers, Sparkles, ShieldCheck, PackageCheck];

export default function ServiceDeliverablesEditorial({ activeService }) {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const td = t.servicesPage?.deliverables || {};

  const services = db?.services || [];
  const service = services.find((s) => s.slug === activeService) || services[0];
  const deliverables = service?.deliverables || [];

  const sectionRef = useRef(null);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  useEffect(() => {
    if (!sectionRef.current || !deliverables.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.deliv-row-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [service?.slug, deliverables.length]);

  if (!service || !deliverables.length) return null;

  const serviceTitle = getLocalized(service.title);

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-20 md:py-28 bg-slate-100 dark:bg-[#030712] border-t border-slate-200/80 dark:border-white/10 transition-colors duration-500"
    >
      {/* هاله نوری پس‌زمینه داخل ظرف جداگانه تا sticky دچار اختلال نشود */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 start-1/4 w-[460px] h-[460px] rounded-full bg-blue-500/8 dark:bg-sky-500/10 blur-[130px]" />
      </div>

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ستون معرفی ثابت (Sticky در دسکتاپ) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col items-start text-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
              <span className="font-body text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-blue-900 dark:text-sky-300">
                {td.badge || (isRTL ? 'موارد تحویلی' : 'DELIVERABLES')}
              </span>
            </div>

            <h2 className="font-heading font-black tracking-tight text-slate-950 dark:text-white mb-4">
              <span>
                {td.titlePart1 || (isRTL ? 'دقیقاً چه چیزهایی' : 'What You')}{' '}
              </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {td.titleHighlight || (isRTL ? 'تحویل می‌گیرید؟' : 'Will Receive')}
              </span>
            </h2>

            <p className="font-body leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
              {td.subtitle ||
                (isRTL
                  ? 'تمامی خروجی‌ها با استانداردهای حرفه‌ای، نظم کامل و آمادگی برای استفاده فوری در کسب‌وکار شما ارائه می‌شوند.'
                  : 'Every deliverable is crafted to professional standards, organized cleanly, and ready for immediate business use.')}
            </p>

            {/* کادر اعتمادساز جمع‌وجور درباره استاندارد تحویل */}
            <div className="w-full p-5 sm:p-6 rounded-3xl bg-white/85 dark:bg-[#091229]/75 backdrop-blur-xl border border-slate-200/90 dark:border-white/12 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-950/8 dark:bg-sky-400/15 border border-blue-950/10 dark:border-sky-400/25 flex items-center justify-center text-blue-900 dark:text-sky-400 shrink-0">
                  <FolderCheck size={19} />
                </div>
                <span className="font-body font-bold text-sm lg:text-base text-slate-950 dark:text-white">
                  {isRTL
                    ? `استاندارد تحویل ${serviceTitle}`
                    : `${serviceTitle} Handover Standard`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 font-body text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={15} className="text-blue-800 dark:text-sky-400 shrink-0" />
                  <span>
                    {isRTL
                      ? 'فایل‌های نهایی، استاندارد و آماده استفاده فوری'
                      : 'Production-ready master files neatly organized'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 font-body text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={15} className="text-blue-800 dark:text-sky-400 shrink-0" />
                  <span>
                    {isRTL
                      ? 'شامل مراحل بازبینی هدفمند پیش از تایید نهایی'
                      : 'Structured review rounds before final sign-off'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ستون ردیف‌های عریض موارد تحویلی */}
          <div key={service.id} className="lg:col-span-7 flex flex-col gap-4">
            {deliverables.map((item, idx) => {
              const IconComp = DELIVERABLE_ICONS[idx % DELIVERABLE_ICONS.length];
              return (
                <div
                  key={`${service.slug}-deliv-row-${idx}`}
                  className="deliv-row-item group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#091229]/70 backdrop-blur-xl border border-slate-200/90 dark:border-white/12 hover:border-blue-900/35 dark:hover:border-sky-400/45 shadow-sm hover:shadow-[0_18px_45px_-16px_rgba(23,37,84,0.18)] dark:hover:shadow-[0_20px_50px_-16px_rgba(56,189,248,0.2)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* نوار رنگی ظریف لبه کنار هنگام هاور */}
                  <span
                    aria-hidden="true"
                    className="absolute top-6 bottom-6 start-0 w-[3px] rounded-full bg-gradient-to-b from-blue-900 via-blue-600 to-sky-400 dark:from-sky-400 dark:to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* شماره + آیکون */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-blue-950/6 dark:bg-sky-400/12 border border-blue-950/10 dark:border-sky-400/25 flex items-center justify-center text-blue-950 dark:text-sky-400 group-hover:bg-blue-950 group-hover:text-white dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950 transition-all duration-300">
                        <IconComp size={21} />
                      </div>
                      <span className="font-body text-xs font-extrabold tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-blue-900 dark:group-hover:text-sky-300 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* متن مورد تحویلی */}
                    <div className="flex-1 text-start pt-0.5">
                      <h3 className="font-body font-bold text-slate-950 dark:text-white mb-2">
                        {getLocalized(item.title)}
                      </h3>
                      <p className="font-body leading-relaxed text-slate-600 dark:text-slate-400">
                        {getLocalized(item.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}