import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, X, ChevronLeft, ChevronRight, RotateCcw, Mouse } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import PortfolioModal, {
  getPortfolioImageUrl,
  handlePortfolioImageError,
} from './PortfolioModal';
import { filterPortfolioByQuery } from '../../utils/searchEngine';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_KEYS = ['all', 'website-design', 'branding', 'graphic-design', 'print'];
const ITEMS_PER_PAGE = 8;

const assetVideoModules = import.meta.glob(
  '../../assets/**/*.{mp4,webm}',
  { eager: true, import: 'default' }
);
const PUBLIC_PORTFOLIO_VIDEO_BASE = '/videos/portfolio/';

const getVideoUrl = (videoName) => {
  if (!videoName) return '';
  if (videoName.startsWith('http') || videoName.startsWith('/')) return videoName;

  const matchedKey = Object.keys(assetVideoModules).find((path) =>
    path.endsWith(`/${videoName}`)
  );
  if (matchedKey) return assetVideoModules[matchedKey];

  return `${PUBLIC_PORTFOLIO_VIDEO_BASE}${videoName}`;
};

// چیدمان اختصاصی و آزاد برای حداکثر ۸ کارت در هر صفحه بدون هیچ هم‌پوشانی آزاردهنده‌ای
const FREEFORM_WIDE_LAYOUT = [
  { x: 12, y: 34, rot: -6, width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/5]', z: 12 },
  { x: 23, y: 71, rot: 4,  width: 'lg:w-[25vw] lg:max-w-[385px]', aspect: 'aspect-[5/4]', z: 22 },
  { x: 34, y: 26, rot: -3, width: 'lg:w-[22vw] lg:max-w-[335px]', aspect: 'aspect-[1/1]', z: 16 },
  { x: 46, y: 58, rot: 5,  width: 'lg:w-[24vw] lg:max-w-[365px]', aspect: 'aspect-[4/5]', z: 28 },
  { x: 58, y: 73, rot: -5, width: 'lg:w-[26vw] lg:max-w-[400px]', aspect: 'aspect-[5/4]', z: 20 },
  { x: 65, y: 28, rot: 4,  width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/5]', z: 15 },
  { x: 78, y: 63, rot: -4, width: 'lg:w-[23vw] lg:max-w-[345px]', aspect: 'aspect-[1/1]', z: 24 },
  { x: 88, y: 32, rot: 6,  width: 'lg:w-[25vw] lg:max-w-[380px]', aspect: 'aspect-[5/4]', z: 18 },
];

const COMPACT_LAYOUTS = {
  1: [
    { x: 50, y: 50, rot: -3, width: 'lg:w-[28vw] lg:max-w-[410px]', aspect: 'aspect-[4/5]', z: 20 },
  ],
  2: [
    { x: 34, y: 44, rot: -5, width: 'lg:w-[26vw] lg:max-w-[390px]', aspect: 'aspect-[4/5]', z: 18 },
    { x: 66, y: 57, rot: 4,  width: 'lg:w-[27vw] lg:max-w-[405px]', aspect: 'aspect-[5/4]', z: 22 },
  ],
  3: [
    { x: 23, y: 42, rot: -5, width: 'lg:w-[24vw] lg:max-w-[360px]', aspect: 'aspect-[4/5]', z: 16 },
    { x: 51, y: 61, rot: 4,  width: 'lg:w-[25vw] lg:max-w-[380px]', aspect: 'aspect-[5/4]', z: 24 },
    { x: 78, y: 36, rot: -4, width: 'lg:w-[23vw] lg:max-w-[345px]', aspect: 'aspect-[1/1]', z: 18 },
  ],
};

const getCardLayout = (index, total) => {
  if (total <= 3 && COMPACT_LAYOUTS[total]) {
    return COMPACT_LAYOUTS[total][index];
  }
  return FREEFORM_WIDE_LAYOUT[index % FREEFORM_WIDE_LAYOUT.length];
};

/* ============================================================================
   کارت پولاروید: حاشیه پایینی بلندتر + نمایش عنوان روی هاور + صاف‌شدن زاویه + ویدیو
   ============================================================================ */
function PolaroidVideoCard({ project, layout, title, onSelect }) {
  const slotRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const videoSrc = getVideoUrl(project.previewVideo);

  const getResponsiveRotation = () => {
    if (typeof window === 'undefined') return 0;
    if (window.innerWidth >= 1024) return layout.rot;
    if (window.innerWidth >= 640) return layout.rot * 0.45;
    return 0;
  };

  useLayoutEffect(() => {
    if (!frameRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      gsap.set(frameRef.current, {
        rotation: layout.rot,
        scale: 1,
        y: 0,
        transformOrigin: 'center center',
      });
    });

    mm.add('(min-width: 640px) and (max-width: 1023px)', () => {
      gsap.set(frameRef.current, {
        rotation: layout.rot * 0.45,
        scale: 1,
        y: 0,
        transformOrigin: 'center center',
      });
    });

    mm.add('(max-width: 639px)', () => {
      gsap.set(frameRef.current, {
        rotation: 0,
        scale: 1,
        y: 0,
        transformOrigin: 'center center',
      });
    });

    return () => mm.revert();
  }, [layout.rot]);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (slotRef.current) {
      slotRef.current.style.zIndex = '90';
    }

    if (frameRef.current) {
      const parentRot = slotRef.current
        ? Number(gsap.getProperty(slotRef.current, 'rotation')) || 0
        : 0;

      gsap.killTweensOf(frameRef.current);
      gsap.to(frameRef.current, {
        scale: window.innerWidth >= 1024 ? 1.24 : 1.04,
        rotation: -parentRot,
        y: window.innerWidth >= 1024 ? -10 : -4,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (videoRef.current && videoSrc) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (frameRef.current) {
      gsap.killTweensOf(frameRef.current);
      gsap.to(frameRef.current, {
        scale: 1,
        rotation: getResponsiveRotation(),
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => {
          if (slotRef.current) {
            slotRef.current.style.zIndex = String(layout.z);
          }
        },
      });
    } else if (slotRef.current) {
      slotRef.current.style.zIndex = String(layout.z);
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      ref={slotRef}
      data-x={layout.x}
      data-y={layout.y}
      style={{
        '--card-x': `${layout.x}%`,
        '--card-y': `${layout.y}%`,
        zIndex: layout.z,
      }}
      className={`table-card-slot relative w-full lg:absolute lg:left-[var(--card-x)] lg:top-[var(--card-y)] ${layout.width} will-change-transform`}
    >
      <article
        ref={frameRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(project)}
        className={`cursor-pointer bg-white dark:bg-slate-900 pt-3 px-3 sm:pt-3.5 sm:px-3.5 pb-0 rounded-sm border border-slate-200/90 dark:border-slate-800 transition-shadow duration-300 will-change-transform ${
          isHovered
            ? 'shadow-[0_36px_78px_-12px_rgba(15,23,42,0.48)] dark:shadow-[0_36px_82px_-10px_rgba(0,0,0,0.96)]'
            : 'shadow-[0_18px_38px_-14px_rgba(15,23,42,0.22)] dark:shadow-[0_20px_42px_-12px_rgba(0,0,0,0.82)]'
        }`}
      >
        <div
          className={`relative w-full ${layout.aspect} bg-slate-200 dark:bg-slate-950 overflow-hidden`}
        >
          <img
            src={getPortfolioImageUrl(project.mainImage)}
            alt={title}
            loading="lazy"
            onError={(e) => handlePortfolioImageError(e, project.mainImage)}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered && !videoSrc ? 'scale-105' : 'scale-100'
            }`}
          />

          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* حاشیه پایینی بلندتر پولاروید: در دسکتاپ فقط هنگام هاور عنوان نمایش داده می‌شود */}
        <div className="h-12 sm:h-16 flex items-center justify-center px-2 overflow-hidden">
          <h3
            className={`font-body font-semibold text-[10px] sm:text-[11px] tracking-wide text-slate-800 dark:text-slate-100 truncate text-center transition-all duration-300 ease-out ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-100 lg:opacity-0 lg:translate-y-2'
            }`}
          >
            {title}
          </h3>
        </div>
      </article>
    </div>
  );
}

/* ============================================================================
   نوار صفحه‌بندی هماهنگ با استایل alpha-glass-bar (فقط وقتی بیش از ۸ کارت باشد)
   ============================================================================ */
function CollagePagination({ currentPage, totalPages, isRTL, onPageChange }) {
  if (totalPages <= 1) return null;

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label={isRTL ? 'صفحه‌بندی نمونه‌کارها' : 'Portfolio Pagination'}
      className="flex justify-center"
    >
      <div className="alpha-glass-bar inline-flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={isRTL ? 'صفحه قبلی' : 'Previous page'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <PrevIcon size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-w-8 h-8 sm:min-w-9 sm:h-9 px-2.5 rounded-full text-xs font-body font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950 shadow-sm'
                  : 'bg-transparent text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              {String(pageNum).padStart(2, '0')}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={isRTL ? 'صفحه بعدی' : 'Next page'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <NextIcon size={16} />
        </button>
      </div>
    </nav>
  );
}

/* ============================================================================
   کامپوننت مستقل بخش فیلتر + صفحه‌بندی ۸تایی + میز کلاژ تعاملی + مودال جزئیات
   ============================================================================ */
export default function PortfolioCollageStage() {
  const { lang } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  const categoryParam = searchParams.get('category');
  const activeCategory = CATEGORY_KEYS.includes(categoryParam) ? categoryParam : 'all';
  const searchQueryParam = (searchParams.get('q') || '').trim();
  const projectSlugParam = searchParams.get('project');

  const [selectedProject, setSelectedProject] = useState(null);

  const topAnchorRef = useRef(null);
  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const quickPanXRef = useRef(null);
  const quickPanYRef = useRef(null);
  const canPanRef = useRef(false);
  const isPointerInsideStageRef = useRef(false);

  const allProjects = db?.portfolio || [];
  const categoryProjects =
    activeCategory === 'all'
      ? allProjects
      : allProjects.filter((project) => project.category === activeCategory);

  const filteredProjects = searchQueryParam
    ? filterPortfolioByQuery(categoryProjects, searchQueryParam)
    : categoryProjects;

  // محاسبه صفحه‌بندی با سقف ثابت ۸ کارت در هر صفحه
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const parsedPage = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = Math.min(
    Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage),
    totalPages
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  // باز کردن خودکار مودال اگر کاربر از سرچ هدر روی یک نمونه‌کار خاص کلیک کرده باشد
  useEffect(() => {
    if (!projectSlugParam) return;
    const matched = allProjects.find(
      (p) => p.slug === projectSlugParam || p.id === projectSlugParam
    );
    if (matched) setSelectedProject(matched);
  }, [projectSlugParam, allProjects]);

  const handleCloseModal = () => {
    setSelectedProject(null);
    if (searchParams.get('project')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('project');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleClearSearchQuery = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  };

  const handleResetAllFilters = () => {
   const nextParams = new URLSearchParams(searchParams);
   nextParams.delete('category');
   nextParams.delete('q');
   nextParams.delete('page');
   setSearchParams(nextParams, { replace: true });
  };

  const handleCategoryChange = (catKey) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    if (catKey === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catKey);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handlePageChange = (nextPage, scrollToTop = false) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === currentPage) return;

    const nextParams = new URLSearchParams(searchParams);
    if (clamped === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(clamped));
    }
    setSearchParams(nextParams, { replace: true });

    if (scrollToTop && topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useLayoutEffect(() => {
    if (!stageRef.current || !boardRef.current || paginatedProjects.length === 0) return;

    // حساسیت موس در شروع خاموش است تا روی ناحیه فیلترها کارت‌ها بی‌موقع تکان نخورند
    canPanRef.current = false;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // دسکتاپ: مکث اولیه -> پخش آزاد -> بازه مکث و کاوش (فعال‌شدن پن موس) -> خروج ناگهانی
      mm.add('(min-width: 1024px)', () => {
        gsap.set(boardRef.current, { x: 0, y: 0 });
        quickPanXRef.current = gsap.quickTo(boardRef.current, 'x', {
          duration: 0.9,
          ease: 'power3.out',
        });
        quickPanYRef.current = gsap.quickTo(boardRef.current, 'y', {
          duration: 0.9,
          ease: 'power3.out',
        });

        const slots = gsap.utils.toArray('.table-card-slot');
        if (slots.length === 0) return;

        const sweepDir = isRTL ? 1 : -1;

        const getLooseClusterOffset = (slot, idx) => {
          const bWidth = boardRef.current?.clientWidth || window.innerWidth;
          const bHeight = boardRef.current?.clientHeight || 660;
          const px = parseFloat(slot.dataset.x || '50');
          const py = parseFloat(slot.dataset.y || '50');

          return {
            x: ((50 - px) / 100) * bWidth * 0.52,
            y: ((50 - py) / 100) * bHeight * 0.44,
            rot: (idx % 2 === 0 ? -1 : 1) * (3 + (idx % 3) * 2),
          };
        };

        slots.forEach((slot, i) => {
          const initial = getLooseClusterOffset(slot, i);
          gsap.set(slot, {
            xPercent: -50,
            yPercent: -50,
            x: initial.x,
            y: initial.y,
            rotation: initial.rot,
            scale: 0.95,
            opacity: 1,
          });
        });

        const resetBoardToCenter = () => {
          canPanRef.current = false;
          if (quickPanXRef.current) quickPanXRef.current(0);
          if (quickPanYRef.current) quickPanYRef.current(0);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3.1}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeave: resetBoardToCenter,
            onLeaveBack: resetBoardToCenter,
            onUpdate: (self) => {
              // پن موس فقط زمانی فعال است که استیج کامل در دید قفل شده و کارت‌ها پراکنده شده‌اند
              const allowPan =
                self.isActive && self.progress >= 0.25 && self.progress <= 0.76;
              canPanRef.current = allowPan;
              if (!allowPan) {
                if (quickPanXRef.current) quickPanXRef.current(0);
                if (quickPanYRef.current) quickPanYRef.current(0);
              }
            },
          },
        });

        // فاز ۰: کمی اسکرول اولیه پیش از شروع حرکت کارت‌ها
        tl.to({}, { duration: 0.28 }, 0);

        // فاز ۱: پخش شدن کارت‌ها از خوشه میانی روی کل میز
        slots.forEach((slot, i) => {
          tl.to(
            slot,
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.82,
              ease: 'power3.out',
            },
            0.28 + i * 0.016
          );
        });

        // فاز ۲: بازه مکث طولانی برای کاوش، حرکت موس و هاور ویدیو
        tl.to({}, { duration: 1.6 }, 1.15);

        // فاز ۳: خروج یک‌دفعه‌ای کل کارت‌ها به یک سمت صحنه
        slots.forEach((slot, i) => {
          tl.to(
            slot,
            {
              x: () => sweepDir * window.innerWidth * 1.75,
              y: (i % 2 === 0 ? -1 : 1) * 45,
              rotation: sweepDir * (14 + (i % 4) * 4),
              opacity: 0,
              duration: 0.72,
              ease: 'power3.in',
            },
            2.75 + i * 0.012
          );
        });
      });

      // موبایل و تبلت: گرید واکنش‌گرا بدون قفل اسکرول
      mm.add('(max-width: 1023px)', () => {
        quickPanXRef.current = null;
        quickPanYRef.current = null;
        canPanRef.current = false;
        gsap.set(boardRef.current, { clearProps: 'transform' });

        const slots = gsap.utils.toArray('.table-card-slot');
        slots.forEach((slot) => {
          gsap.fromTo(
            slot,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: slot,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });
      });
    }, stageRef);

    ScrollTrigger.refresh();
    return () => {
      quickPanXRef.current = null;
      quickPanYRef.current = null;
      canPanRef.current = false;
      ctx.revert();
    };
  }, [paginatedProjects.length, currentPage, activeCategory, searchQueryParam, currentLang, isRTL]);

  // حرکت دو‌محوره کل بوم فقط وقتی کاربر واقعاً داخل استیج قفل‌شده و در فاز کاوش است
  const handleStageMouseEnter = () => {
    isPointerInsideStageRef.current = true;
  };

  const handleStageMouseMove = (e) => {
    if (
      window.innerWidth < 1024 ||
      !isPointerInsideStageRef.current ||
      !canPanRef.current ||
      !stageRef.current ||
      !boardRef.current
    ) {
      return;
    }

    const stageRect = stageRef.current.getBoundingClientRect();

    // اطمینان اضافه از قرار گرفتن کرسر داخل کادر استیج و دیده‌شدن کامل استیج
    if (
      e.clientY < stageRect.top ||
      e.clientY > stageRect.bottom ||
      stageRect.top > 40
    ) {
      return;
    }

    const boardWidth = boardRef.current.clientWidth;
    const boardHeight = boardRef.current.clientHeight;

    const normalizedX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    const normalizedY = Math.max(
      -1,
      Math.min(1, ((e.clientY - stageRect.top) / stageRect.height) * 2 - 1)
    );

    const overflowHalfX = Math.max(0, (boardWidth - stageRect.width) / 2);
    const maxPanX = overflowHalfX > 0 ? overflowHalfX + 110 : 60;

    const overflowHalfY = Math.max(0, (boardHeight - stageRect.height) / 2);
    const maxPanY = overflowHalfY + Math.max(190, stageRect.height * 0.24);

    if (quickPanXRef.current) quickPanXRef.current(-normalizedX * maxPanX);
    if (quickPanYRef.current) quickPanYRef.current(-normalizedY * maxPanY);
  };

  const handleStageMouseLeave = () => {
    isPointerInsideStageRef.current = false;
    if (quickPanXRef.current) quickPanXRef.current(0);
    if (quickPanYRef.current) quickPanYRef.current(0);
  };

  const isWideBoard = paginatedProjects.length >= 4;

    return (
    <div ref={topAnchorRef} dir={isRTL ? 'rtl' : 'ltr'} className="w-full scroll-mt-24">
      {/* نوار فیلتر دسته‌بندی‌ها با استایل یکپارچه alpha-glass-bar */}
      <section className="container-custom mb-6 md:mb-8 px-4">
        <div className="flex flex-col items-center gap-3.5">
          <div className="alpha-glass-bar inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-full max-w-full">
            {CATEGORY_KEYS.map((catKey) => {
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleCategoryChange(catKey)}
                  className={`px-4 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs sm:text-[13px] font-body font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950 shadow-sm'
                      : 'bg-transparent text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
                  }`}
                >
                  {tp.categories[catKey]}
                </button>
              );
            })}
          </div>

          {/* کنترل صفحه‌بندی بالای میز (فقط زمانی که تعداد نمونه‌کارها بیش از ۸ عدد باشد) */}
          <CollagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            isRTL={isRTL}
            onPageChange={(p) => handlePageChange(p, false)}
          />
        </div>

        {/* تگ نمایش عبارت جست‌وجو شده (وقتی کاربر از سرچ هدر Enter زده باشد) */}
        {searchQueryParam && (
          <div className="flex justify-center mt-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-body text-slate-700 dark:text-slate-200">
              <span>
                {t.search?.resultsFor || (isRTL ? 'نتایج جست‌وجو برای' : 'Results for')}:{' '}
                <strong className="font-body text-blue-950 dark:text-sky-400">
                  {searchQueryParam}
                </strong>
              </span>
              <button
                type="button"
                onClick={handleClearSearchQuery}
                aria-label={t.search?.clearSearch || 'Clear search'}
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* راهنمای ظریف تعامل (فقط روی دسکتاپ و زمانی که پروژه‌ای برای نمایش وجود دارد) */}
        {paginatedProjects.length > 0 && (
          <div className="hidden lg:flex items-center justify-center gap-2 mt-4 text-[12px] font-medium text-slate-500 dark:text-slate-400">
            <Mouse size={14} className="text-blue-800 dark:text-sky-400 shrink-0" />
            <span>
              {tp.interactionHint ||
                (isRTL
                  ? 'برای باز شدن پروژه‌ها اسکرول کنید • برای پیش‌نمایش ویدیو روی کارت‌ها بروید'
                  : 'Scroll to unfold projects • Hover cards to preview')}
            </span>
          </div>
        )}
      </section>

      {/* میز تعاملی کارت‌ها (حداکثر ۸ کارت در هر صفحه) */}
      {paginatedProjects.length === 0 ? (
        <section className="container-custom max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-20 px-6 text-center flex flex-col items-center">
            <Layers className="w-10 h-10 mb-4 text-slate-400 dark:text-slate-600" />
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6">
              {tp.emptyState}
            </p>
            {(activeCategory !== 'all' || searchQueryParam) && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 font-body font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>
                  {tp.resetFilters ||
                    (isRTL ? 'نمایش همه نمونه‌کارها' : 'Show All Projects')}
                </span>
              </button>
            )}
          </div>
        </section>
      ) : (
        <section
          ref={stageRef}
          onMouseEnter={handleStageMouseEnter}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative w-full lg:h-screen lg:min-h-[780px] flex items-center justify-center overflow-x-clip lg:overflow-hidden py-8 sm:py-12 lg:py-0"
        >
          <div
            ref={boardRef}
            className={`will-change-transform relative grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-9 px-5 sm:px-8 max-w-3xl mx-auto lg:block lg:p-0 lg:mx-0 lg:h-[78vh] lg:min-h-[600px] lg:max-h-[760px] shrink-0 ${
              isWideBoard
                ? 'w-full lg:w-[144vw] lg:max-w-none'
                : 'w-full lg:w-full lg:max-w-6xl'
            }`}
          >
            {paginatedProjects.map((project, index) => (
              <PolaroidVideoCard
                key={`${project.id}-${activeCategory}-${searchQueryParam}-p${currentPage}`}
                project={project}
                layout={getCardLayout(index, paginatedProjects.length)}
                title={getLocalized(project.title)}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* تکرار کنترل صفحه‌بندی در پایین گرید برای راحتی کاربر در موبایل و تبلت */}
      {totalPages > 1 && (
        <section className="lg:hidden container-custom mt-4 mb-6 px-4">
          <CollagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            isRTL={isRTL}
            onPageChange={(p) => handlePageChange(p, true)}
          />
        </section>
      )}

      {/* مدال جزئیات کامل پروژه */}
      <PortfolioModal
        project={selectedProject}
        currentLang={currentLang}
        tp={tp}
        onClose={handleCloseModal}
      />
    </div>
  );
}