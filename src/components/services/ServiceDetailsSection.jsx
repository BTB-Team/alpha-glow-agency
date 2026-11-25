import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, Sparkles, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import { useStore } from '../../store/useStore';
import { resolveServiceImage } from './ServicesHero';

export default function ServiceDetailsSection({ activeService, onSelectService }) {
  const { lang } = useParams();
  const openProjectModal = useStore((state) => state.openProjectModal);

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const ts = t.servicesPage || {};

  const services = db?.services || [];
  const service = services.find((s) => s.slug === activeService) || services[0];

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  if (!service) return null;

  const title = getLocalized(service.title);
  const fullDesc = getLocalized(service.fullDescription);
  const timeline = getLocalized(service.estimatedTimeline);
  const idealForList = service.idealFor?.[currentLang] || service.idealFor?.en || [];
  const deliverables = service.deliverables || [];
  const subImages = service.subImages || [];

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <div
      id="service-details-section"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full bg-slate-100 dark:bg-[#030712] transition-colors duration-500 pt-12 md:pt-16 pb-16 md:pb-24 scroll-mt-6"
    >
      {/* نوار جابه‌جایی سریع بین ۴ خدمت (هماهنگ با alpha-glass-bar صفحه پورتفولیو) */}
      <div className="container-custom px-4 sm:px-6 mb-12 md:mb-16">
        <div className="flex justify-center">
          <div className="alpha-glass-bar inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-full max-w-full">
            {services.map((srv) => {
              const isActive = srv.slug === service.slug;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => onSelectService(srv.slug)}
                  className={`px-4 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs sm:text-[13px] font-body font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950 shadow-sm'
                      : 'bg-transparent text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
                  }`}
                >
                  {getLocalized(srv.title)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* سکشن ۱: معرفی عمیق خدمت + چیدمان مدرن ۳ تصویر subImages */}
      <section className="container-custom max-w-6xl mx-auto px-4 sm:px-6 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ستون متن و اطلاعات کلیدی */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
              <span className="font-body text-xs font-bold tracking-[0.22em] uppercase text-blue-900 dark:text-sky-300">
                {ts.overview?.badge || (isRTL ? 'معرفی تخصصی خدمت' : 'SERVICE OVERVIEW')}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
              {title}
            </h2>

            <p className="font-body !text-[16px] !leading-relaxed text-slate-600 dark:text-slate-300">
              {fullDesc}
            </p>

            {/* بازه زمانی تحویل */}
            {timeline && (
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Clock size={18} className="text-blue-800 dark:text-sky-400 shrink-0" />
                <div className="flex items-center gap-2 font-body !text-[14px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    {ts.overview?.timelineLabel || (isRTL ? 'بازه زمانی تقریبی' : 'Estimated Timeline')}:
                  </span>
                  <strong className="font-bold text-slate-900 dark:text-white">{timeline}</strong>
                </div>
              </div>
            )}

            {/* تگ‌های مناسب برای */}
            {idealForList.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 font-body !text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  <Sparkles size={15} className="text-blue-800 dark:text-sky-400" />
                  <span>{ts.overview?.idealForLabel || (isRTL ? 'مناسب برای' : 'Ideal For')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idealForList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full font-body !text-[13px] font-medium bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* دکمه ثبت سفارش مستقیم همین خدمت */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => openProjectModal({ service: service.slug })}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-bold !text-[15px] shadow-[0_12px_28px_-8px_rgba(23,37,84,0.35)] dark:shadow-[0_12px_28px_-8px_rgba(56,189,248,0.35)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>
                  {ts.overview?.orderButton || (isRTL ? 'ثبت سفارش این خدمت' : 'Request This Service')}
                </span>
                <ActionArrow
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>

          {/* ستون بصری: کلاژ نامتقارن ۳ تصویر subImages */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4">
              {subImages[0] && (
                <div className="col-span-12 rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 aspect-[16/10] shadow-lg">
                  <img
                    src={resolveServiceImage(subImages[0])}
                    alt={`${title} 1`}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = `/images/${subImages[0]}`;
                      }
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              {subImages[1] && (
                <div className="col-span-6 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 aspect-[4/3] shadow-md">
                  <img
                    src={resolveServiceImage(subImages[1])}
                    alt={`${title} 2`}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = `/images/${subImages[1]}`;
                      }
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              {subImages[2] && (
                <div className="col-span-6 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 aspect-[4/3] shadow-md">
                  <img
                    src={resolveServiceImage(subImages[2])}
                    alt={`${title} 3`}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = `/images/${subImages[2]}`;
                      }
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* سکشن ۲: موارد تحویلی (Deliverables) */}
      {deliverables.length > 0 && (
        <section className="container-custom max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12">
            <div className="flex items-center gap-4 mb-3">
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
              <span className="font-body text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-blue-900 dark:text-sky-300">
                {ts.deliverables?.badge || (isRTL ? 'موارد تحویلی' : 'DELIVERABLES')}
              </span>
              <span className="w-10 md:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-3">
              <span>{ts.deliverables?.titlePart1 || (isRTL ? 'دقیقاً چه چیزهایی' : 'What You')} </span>
              <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
                {ts.deliverables?.titleHighlight || (isRTL ? 'تحویل می‌گیرید؟' : 'Will Receive')}
              </span>
            </h2>

            <p className="font-body !text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {ts.deliverables?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-blue-900/30 dark:hover:border-sky-400/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-950/5 dark:bg-sky-400/10 border border-blue-950/10 dark:border-sky-400/20 flex items-center justify-center text-blue-900 dark:text-sky-400 mb-5 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={20} />
                </div>

                <h3 className="font-body font-bold !text-[17px] !leading-snug text-slate-900 dark:text-white mb-2.5">
                  {getLocalized(item.title)}
                </h3>

                <p className="font-body !text-[14px] !leading-relaxed text-slate-600 dark:text-slate-400">
                  {getLocalized(item.description)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}