import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowUpLeft, ArrowUpRight } from 'lucide-react';

// جستجوی خودکار در تمام زیرپوشه‌های src/assets برای فایل‌های تصویری (مخصوص Vite)
const assetImageModules = import.meta.glob(
  '../../assets/**/*.{webp,png,jpg,jpeg,avif,svg}',
  { eager: true, import: 'default' }
);

    // اگر عکس‌ها در پوشه public هستند، مسیر دقیق پوشه را اینجا تنظیم کن (مثلاً '/images/' یا '/images/portfolio/')
    const PUBLIC_PORTFOLIO_IMG_BASE = '/images/portfolio/';

    export const getPortfolioImageUrl = (imgName) => {
      if (!imgName) return '';
      if (imgName.startsWith('http') || imgName.startsWith('/')) return imgName;

      // ۱. بررسی وجود فایل در src/assets
      const matchedKey = Object.keys(assetImageModules).find((path) =>
        path.endsWith(`/${imgName}`)
      );
      if (matchedKey) return assetImageModules[matchedKey];

      // ۲. در غیر این صورت خواندن از پوشه public
      return `${PUBLIC_PORTFOLIO_IMG_BASE}${imgName}`;
    };

    // فال‌بک خودکار اگر مسیر /images/portfolio/ خطا داد، مسیر /images/ را هم تست کند
    export const handlePortfolioImageError = (e, imgName) => {
      if (!imgName || e.currentTarget.dataset.fallbackTried) return;
      e.currentTarget.dataset.fallbackTried = 'true';
      e.currentTarget.src = `/images/${imgName}`;
    };

    export default function PortfolioModal({ project, currentLang, tp, onClose }) {
      const isRTL = currentLang === 'fa';
      const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

      const getLocalized = (field) => {
        if (!field) return '';
        return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
    };

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl"
      >
        {/* هدر ثابت مدال */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-8 py-5 bg-white dark:bg-[#0b1120] border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-body font-bold uppercase tracking-wider text-blue-700 dark:text-sky-400">
              {tp.categories[project.category] || project.category}
            </span>
            <h3 className="text-lg sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
              {getLocalized(project.title)}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tp.modal.close}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* بدنه مدال */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[16/9]">
            <img
              src={getPortfolioImageUrl(project.mainImage)}
              alt={getLocalized(project.title)}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-2.5">
              {tp.modal.overview}
            </h4>
            <p className="font-body text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {getLocalized(project.fullDescription)}
            </p>
          </div>

          {Array.isArray(project.subImages) && project.subImages.length > 0 && (
            <div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-4">
                {tp.modal.gallery}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.subImages.map((imgName, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[4/3]"
                  >
                    <img
                      src={getPortfolioImageUrl(imgName)}
                      alt={`${getLocalized(project.title)} ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.testimonials?.[0] && (() => {
            const feedback = project.testimonials[0];
            const clientName = getLocalized(feedback.name);
            const clientRole = getLocalized(feedback.role);
            const clientComment = getLocalized(feedback.comment);

            return (
              <div className="p-6 rounded-2xl bg-blue-950/5 dark:bg-slate-900 border border-blue-950/10 dark:border-slate-800">
                <span className="block text-xs font-body font-bold text-blue-800 dark:text-sky-400 mb-3">
                  {tp.modal.clientFeedback}
                </span>
                <p className="font-body text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-5">
                  {clientComment}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                    {feedback.avatar && feedback.avatar.trim() !== '' ? (
                      <img
                        src={feedback.avatar}
                        alt={clientName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-heading font-bold text-sm flex items-center justify-center">
                        {clientName ? clientName.charAt(0) : 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                      {clientName}
                    </p>
                    <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                      {clientRole}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-body font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {tp.modal.close}
            </button>
            <Link
              to={`/${currentLang}/contact`}
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-bold text-xs sm:text-sm transition-colors"
            >
              <span>{tp.modal.orderSimilar}</span>
              <ActionArrow size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}