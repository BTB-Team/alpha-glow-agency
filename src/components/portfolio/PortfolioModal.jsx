import { useEffect } from 'react';
import { X, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

const assetImageModules = import.meta.glob(
  '../../assets/**/*.{webp,png,jpg,jpeg,avif,svg}',
  { eager: true, import: 'default' }
);

const PUBLIC_PORTFOLIO_IMG_BASE = '/images/portfolio/';

export const getPortfolioImageUrl = (imgName) => {
  if (!imgName) return '';
  if (imgName.startsWith('http') || imgName.startsWith('/')) return imgName;

  const matchedKey = Object.keys(assetImageModules).find((path) =>
    path.endsWith(`/${imgName}`)
  );
  if (matchedKey) return assetImageModules[matchedKey];

  return `${PUBLIC_PORTFOLIO_IMG_BASE}${imgName}`;
};

export const handlePortfolioImageError = (e, imgName) => {
  if (!imgName || e.currentTarget.dataset.fallbackTried) return;
  e.currentTarget.dataset.fallbackTried = 'true';
  e.currentTarget.src = `/images/${imgName}`;
};

export default function PortfolioModal({ project, currentLang, tp, onClose }) {
  const openProjectModal = useStore((state) => state.openProjectModal);
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

  const handleOrderSimilar = () => {
    const context = {
      service: project.category || null,
      referenceProject: getLocalized(project.title) || null,
    };

    onClose();
    requestAnimationFrame(() => {
      openProjectModal(context);
    });
  };

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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-[24px] sm:rounded-[28px] shadow-2xl"
      >
        {/* هدر ثابت مودال */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-white dark:bg-[#0b1120] border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <span className="block !text-[16px] !leading-snug font-semibold text-blue-700 dark:text-sky-400 mb-0.5">
              {tp.categories[project.category] || project.category}
            </span>
            <h3 className="font-body font-bold text-slate-900 dark:text-white truncate">
              {getLocalized(project.title)}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tp.modal.close}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه مودال */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[16/9]">
            <img
              src={getPortfolioImageUrl(project.mainImage)}
              alt={getLocalized(project.title)}
              onError={(e) => handlePortfolioImageError(e, project.mainImage)}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <h4 className="font-body font-bold text-slate-900 dark:text-white mb-2">
              {tp.modal.overview}
            </h4>
            <p className="!text-[16px] !leading-relaxed text-slate-600 dark:text-slate-300">
              {getLocalized(project.fullDescription)}
            </p>
          </div>

          {Array.isArray(project.subImages) && project.subImages.length > 0 && (
            <div>
              <h4 className="font-body font-bold text-slate-900 dark:text-white mb-3">
                {tp.modal.gallery}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {project.subImages.map((imgName, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[4/3]"
                  >
                    <img
                      src={getPortfolioImageUrl(imgName)}
                      alt={`${getLocalized(project.title)} ${idx + 1}`}
                      loading="lazy"
                      onError={(e) => handlePortfolioImageError(e, imgName)}
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
              <div className="p-5 rounded-2xl bg-blue-950/5 dark:bg-slate-900 border border-blue-950/10 dark:border-slate-800">
                <h4 className="font-body font-bold text-blue-800 dark:text-sky-400 mb-2">
                  {tp.modal.clientFeedback}
                </h4>
                <p className="!text-[16px] !leading-relaxed text-slate-700 dark:text-slate-200 mb-4">
                  {clientComment}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                    {feedback.avatar && feedback.avatar.trim() !== '' ? (
                      <img
                        src={feedback.avatar}
                        alt={clientName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold !text-[16px] flex items-center justify-center">
                        {clientName ? clientName.charAt(0) : 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold !text-[16px] !leading-snug text-slate-900 dark:text-white">
                      {clientName}
                    </p>
                    <p className="!text-[16px] !leading-snug text-slate-500 dark:text-slate-400">
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
              className="px-5 py-2.5 rounded-xl font-semibold !text-[16px] !leading-snug text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {tp.modal.close}
            </button>
            <button
              type="button"
              onClick={handleOrderSimilar}
              className="alpha-glass-bar inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-body font-bold !text-[16px] !leading-snug text-blue-950 dark:text-white hover:border-sky-400/60 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer group"
            >
              <span>{tp.modal.orderSimilar}</span>
              <ActionArrow
                size={17}
                className="text-blue-800 dark:text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}