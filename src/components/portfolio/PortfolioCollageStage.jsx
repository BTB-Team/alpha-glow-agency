import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  LayoutGrid,
  Globe,
  Sparkles,
  PenTool,
  Printer,
  Play,
  ArrowUpLeft,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import PortfolioModal, {
  getPortfolioImageUrl,
  handlePortfolioImageError,
} from './PortfolioModal';
import { filterPortfolioByQuery } from '../../utils/searchEngine';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_OPTIONS = [
  { key: 'all', icon: LayoutGrid },
  { key: 'website-design', icon: Globe },
  { key: 'branding', icon: Sparkles },
  { key: 'graphic-design', icon: PenTool },
  { key: 'print', icon: Printer },
];

const CATEGORY_KEYS = CATEGORY_OPTIONS.map((c) => c.key);
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

// چیدمان اختصاصی و آزاد دسکتاپ برای حداکثر ۸ کارت در هر صفحه
const FREEFORM_WIDE_LAYOUT = [
  { x: 12, y: 34, rot: -6, width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 12 },
  { x: 23, y: 71, rot: 4,  width: 'lg:w-[25vw] lg:max-w-[385px]', aspect: 'aspect-[4/3] lg:aspect-[5/4]', z: 22 },
  { x: 34, y: 26, rot: -3, width: 'lg:w-[22vw] lg:max-w-[335px]', aspect: 'aspect-[4/3] lg:aspect-[1/1]', z: 16 },
  { x: 46, y: 58, rot: 5,  width: 'lg:w-[24vw] lg:max-w-[365px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 28 },
  { x: 58, y: 73, rot: -5, width: 'lg:w-[26vw] lg:max-w-[400px]', aspect: 'aspect-[4/3] lg:aspect-[5/4]', z: 20 },
  { x: 65, y: 28, rot: 4,  width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 15 },
  { x: 78, y: 63, rot: -4, width: 'lg:w-[23vw] lg:max-w-[345px]', aspect: 'aspect-[4/3] lg:aspect-[1/1]', z: 24 },
  { x: 88, y: 32, rot: 6,  width: 'lg:w-[25vw] lg:max-w-[380px]', aspect: 'aspect-[4/3] lg:aspect-[5/4]', z: 18 },
];

const COMPACT_LAYOUTS = {
  1: [
    { x: 50, y: 50, rot: -3, width: 'lg:w-[28vw] lg:max-w-[410px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 20 },
  ],
  2: [
    { x: 34, y: 44, rot: -5, width: 'lg:w-[26vw] lg:max-w-[390px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 18 },
    { x: 66, y: 57, rot: 4,  width: 'lg:w-[27vw] lg:max-w-[405px]', aspect: 'aspect-[4/3] lg:aspect-[5/4]', z: 22 },
  ],
  3: [
    { x: 23, y: 42, rot: -5, width: 'lg:w-[24vw] lg:max-w-[360px]', aspect: 'aspect-[4/3] lg:aspect-[4/5]', z: 16 },
    { x: 51, y: 61, rot: 4,  width: 'lg:w-[25vw] lg:max-w-[380px]', aspect: 'aspect-[4/3] lg:aspect-[5/4]', z: 24 },
    { x: 78, y: 36, rot: -4, width: 'lg:w-[23vw] lg:max-w-[345px]', aspect: 'aspect-[4/3] lg:aspect-[1/1]', z: 18 },
  ],
};

const getCardLayout = (index, total) => {
  if (total <= 3 && COMPACT_LAYOUTS[total]) {
    return COMPACT_LAYOUTS[total][index];
  }
  return FREEFORM_WIDE_LAYOUT[index % FREEFORM_WIDE_LAYOUT.length];
};

/* ============================================================================
   کارت پولاروید: هاور ویدیو در دسکتاپ + پخش ویدیو روی کلیک و انباشتگی ۵۰٪ در موبایل
   ============================================================================ */
function PolaroidVideoCard({
  project,
  index,
  layout,
  title,
  isRTL,
  isMobileActive,
  onMobileActivate,
  onSelect,
}) {
  const slotRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const videoSrc = getVideoUrl(project.previewVideo);
  const mobileBaseZ = 10 + index;
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  const isPlaying = isHovered || isMobileActive;

  useLayoutEffect(() => {
    if (!frameRef.current || !slotRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      slotRef.current.style.zIndex = String(layout.z);
      gsap.set(frameRef.current, {
        rotation: layout.rot,
        scale: 1,
        y: 0,
        transformOrigin: 'center center',
      });
    });

    mm.add('(max-width: 1023px)', () => {
      slotRef.current.style.zIndex = String(mobileBaseZ);
      gsap.set(frameRef.current, {
        rotation: 0,
        scale: 1,
        y: 0,
        transformOrigin: 'center center',
      });
    });

    return () => mm.revert();
  }, [layout.rot, layout.z, mobileBaseZ]);

  // پخش/توقف ویدیو و بالا آوردن کارت هنگام کلیک در موبایل
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;

    if (isMobileActive) {
      if (slotRef.current) slotRef.current.style.zIndex = '30';
      if (frameRef.current) {
        gsap.killTweensOf(frameRef.current);
        gsap.to(frameRef.current, {
          scale: 1.02,
          y: -4,
          duration: 0.3,
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
    } else {
      if (frameRef.current) {
        gsap.killTweensOf(frameRef.current);
        gsap.to(frameRef.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
          onComplete: () => {
            if (slotRef.current && window.innerWidth < 1024) {
              slotRef.current.style.zIndex = String(mobileBaseZ);
            }
          },
        });
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isMobileActive, videoSrc, mobileBaseZ]);

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return;
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
        scale: 1.24,
        rotation: -parentRot,
        y: -10,
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
    if (window.innerWidth < 1024) return;
    setIsHovered(false);

    if (frameRef.current) {
      gsap.killTweensOf(frameRef.current);
      gsap.to(frameRef.current, {
        scale: 1,
        rotation: layout.rot,
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => {
          if (slotRef.current && window.innerWidth >= 1024) {
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

  const handleCardClick = () => {
    if (window.innerWidth >= 1024) {
      onSelect(project);
      return;
    }

    if (videoSrc && !isMobileActive) {
      onMobileActivate(project.id);
      return;
    }

    onSelect(project);
  };

  return (
    <div
      ref={slotRef}
      data-x={layout.x}
      data-y={layout.y}
      style={{
        '--card-x': `${layout.x}%`,
        '--card-y': `${layout.y}%`,
      }}
      className={`table-card-slot relative w-full lg:absolute lg:left-[var(--card-x)] lg:top-[var(--card-y)] ${layout.width} will-change-transform`}
    >
      {/* لایه اختصاصی انیمیشن انباشتگی ۵۰ درصدی موبایل (در دسکتاپ بی‌اثر است) */}
      <div className="mobile-stack-inner w-full will-change-transform">
        <article
          ref={frameRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className={`relative cursor-pointer bg-white dark:bg-slate-900 pt-3 px-3 sm:pt-3.5 sm:px-3.5 pb-0 rounded-sm border transition-shadow duration-300 will-change-transform ${
            isPlaying
              ? 'border-sky-400/60 dark:border-sky-400/50 shadow-[0_32px_70px_-12px_rgba(15,23,42,0.45)] dark:shadow-[0_32px_75px_-10px_rgba(0,0,0,0.95)]'
              : 'border-slate-200/90 dark:border-slate-800 shadow-[0_18px_38px_-14px_rgba(15,23,42,0.24)] dark:shadow-[0_22px_44px_-12px_rgba(0,0,0,0.86)]'
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
                  isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* نشانگر ظریف وجود ویدیو پیش‌نمایش در موبایل پیش از کلیک */}
            {videoSrc && !isMobileActive && (
              <span
                aria-hidden="true"
                className={`lg:hidden absolute bottom-2.5 ${
                  isRTL ? 'left-2.5' : 'right-2.5'
                } w-8 h-8 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg`}
              >
                <Play size={13} className="fill-white ms-0.5" />
              </span>
            )}
          </div>

          {/* حاشیه پایینی پولاروید */}
          <div className="h-12 sm:h-14 flex items-center justify-between lg:justify-center gap-2 px-1.5 sm:px-2 overflow-hidden">
            <h3
              className={`font-body font-bold text-[12px] sm:text-[13px] lg:text-[11px] tracking-wide text-slate-800 dark:text-slate-100 truncate transition-all duration-300 ease-out ${
                isHovered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-100 lg:opacity-0 lg:translate-y-2'
              }`}
            >
              {title}
            </h3>

            {isMobileActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(project);
                }}
                className="alpha-glass-bar lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-[11px] text-blue-950 dark:text-white hover:border-sky-400/60 active:scale-95 transition-all duration-300 shrink-0 cursor-pointer group"
              >
                <span>{isRTL ? 'جزئیات' : 'Details'}</span>
                <ActionArrow
                  size={12}
                  className="text-blue-800 dark:text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>
            )}
          </div>

          {/* لایه سایه ملایم برای عمق کارت پشتی هنگام روی‌هم‌نشینی در موبایل */}
          <div
            aria-hidden="true"
            className={`mobile-stack-dim lg:hidden pointer-events-none absolute inset-0 rounded-sm bg-slate-950 ${
              isMobileActive ? '!opacity-0' : 'opacity-0'
            }`}
          />
        </article>
      </div>
    </div>
  );
}

/* ============================================================================
   نوار صفحه‌بندی فشرده هماهنگ با alpha-glass-bar (فقط یک‌بار کنار دراپ‌داون)
   ============================================================================ */
function CollagePagination({ currentPage, totalPages, isRTL, onPageChange }) {
  if (totalPages <= 1) return null;

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label={isRTL ? 'صفحه‌بندی نمونه‌کارها' : 'Portfolio Pagination'}
      className="shrink-0"
    >
      <div className="alpha-glass-bar h-10 sm:h-11 inline-flex items-center gap-0.5 sm:gap-1 px-1 rounded-full">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={isRTL ? 'صفحه قبلی' : 'Previous page'}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <PrevIcon size={14} />
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
              className={`min-w-7 h-7 sm:min-w-8 sm:h-8 px-1.5 inline-flex items-center justify-center rounded-full text-xs leading-none font-bold tabular-nums transition-all duration-300 cursor-pointer ${
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
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-950 hover:bg-blue-950/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <NextIcon size={14} />
        </button>
      </div>
    </nav>
  );
}

/* ============================================================================
   کامپوننت مستقل دراپ‌داون شیشه‌ای فیلتر + صفحه‌بندی کنار آن + میز کلاژ + مودال
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeMobileCardId, setActiveMobileCardId] = useState(null);
  
    const topAnchorRef = useRef(null);
    const filterDropdownRef = useRef(null);
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

  const activeCategoryOption =
    CATEGORY_OPTIONS.find((opt) => opt.key === activeCategory) || CATEGORY_OPTIONS[0];
  const ActiveCategoryIcon = activeCategoryOption.icon;

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFilterOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setActiveMobileCardId(null);
  }, [activeCategory, currentPage, searchQueryParam, selectedProject]);

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
    setIsFilterOpen(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    if (catKey === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catKey);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === currentPage) return;

    const nextParams = new URLSearchParams(searchParams);
    if (clamped === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(clamped));
    }
    setSearchParams(nextParams, { replace: true });
  };

  useLayoutEffect(() => {
    if (!stageRef.current || !boardRef.current || paginatedProjects.length === 0) return;

    canPanRef.current = false;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // دسکتاپ: پخش آزاد روی میز + پن موس فقط در فاز کاوش + خروج ناگهانی
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

        tl.to({}, { duration: 0.28 }, 0);

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

        tl.to({}, { duration: 1.6 }, 1.15);

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

      // موبایل و تبلت: انباشتگی پیش‌رونده ۵۰ درصدی شبیه استک خدمات، همراه با اسکرول روان به پایین
      mm.add('(max-width: 1023px)', () => {
        quickPanXRef.current = null;
        quickPanYRef.current = null;
        canPanRef.current = false;
        gsap.set(boardRef.current, { clearProps: 'transform' });

        const slots = gsap.utils.toArray('.table-card-slot');

        slots.forEach((slot, i) => {
          const inner = slot.querySelector('.mobile-stack-inner');
          const dim = slot.querySelector('.mobile-stack-dim');
          if (!inner) return;

          gsap.set(inner, {
            y: 0,
            scale: 1,
            transformOrigin: 'top center',
          });
          if (dim) gsap.set(dim, { opacity: 0 });

          // کارت آخر روی قبلی می‌نشیند ولی خودش دیگر پوشانده نمی‌شود
          if (i === slots.length - 1) return;

          // مسافت مکث طوری حساب می‌شود که کارت بعدی دقیقاً نصف پایینی این کارت را بپوشاند
          const getHoldDistance = () => {
            const cardHeight = slot.offsetHeight || 340;
            return Math.round(cardHeight * 0.54) + 24;
          };

          const stackTl = gsap.timeline({
            scrollTrigger: {
              trigger: slot,
              start: 'top 96px',
              end: () => `+=${getHoldDistance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // مکث بصری در بالای کادر + کوچک‌شدن ملایم هم‌زمان با بالا آمدن کارت بعدی
          stackTl.to(
            inner,
            {
              y: () => getHoldDistance(),
              scale: 0.93,
              ease: 'none',
            },
            0
          );

          // سایه ملایم روی کارت پشتی برای ایجاد حس عمق لایه‌ها
          if (dim) {
            stackTl.to(
              dim,
              {
                opacity: 0.22,
                ease: 'none',
              },
              0
            );
          }
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
      {/* نوار ابزار واحد: دراپ‌داون شیشه‌ای فیلتر + کپسول صفحه‌بندی کنار آن */}
      <section className="relative z-40 container-custom mb-8 md:mb-10 px-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* دراپ‌داون شیشه‌ای دسته‌بندی‌ها */}
          <div ref={filterDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isFilterOpen}
              className="alpha-glass-bar h-10 sm:h-11 px-4 sm:px-5 rounded-full inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-body font-bold text-slate-800 dark:text-white transition-all duration-300 cursor-pointer hover:border-sky-400/60"
            >
              <ActiveCategoryIcon
                size={15}
                className="text-gray-400 shrink-0"
              />
              <span className="whitespace-nowrap">{tp.categories[activeCategory]}</span>
              <ChevronDown
                size={15}
                className={`text-gry-300/90 shrink-0 transition-transform duration-300 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* پنل گزینه‌های دراپ‌داون */}
            <div
              role="listbox"
              aria-hidden={!isFilterOpen}
              className={`alpha-glass-dropdown absolute top-full mt-2.5 w-56 sm:w-60 p-1.5 rounded-2xl z-50 transition-all duration-200 ease-out bg-white/95 dark:bg-[#091229]/95 backdrop-blur-2xl backdrop-saturate-150 border border-slate-200/90 dark:border-white/20 shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_22px_55px_rgba(2,6,23,0.85)] ${
                isRTL ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
              } ${
                isFilterOpen
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <ul className="flex flex-col gap-1">
                {CATEGORY_OPTIONS.map(({ key, icon: Icon }) => {
                  const isActive = activeCategory === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        tabIndex={isFilterOpen ? 0 : -1}
                        onClick={() => handleCategoryChange(key)}
                        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-body transition-all duration-150 cursor-pointer border ${
                          isActive
                            ? 'bg-blue-900 text-white border-blue-950 dark:bg-sky-500/25 dark:text-white dark:border-cyan-300/60 font-bold'
                            : 'bg-transparent text-white hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={15}
                            className={`shrink-0 ${
                              isActive
                                ? 'text-sky-300 dark:text-sky-300'
                                : 'text-sky-300 dark:text-sky-400/85'
                            }`}
                          />
                          <span className="truncate">{tp.categories[key]}</span>
                        </span>
                        {isActive && (
                          <Check size={14} className="text-sky-300 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* کپسول صفحه‌بندی تکی دقیقاً کنار دراپ‌داون */}
          <CollagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            isRTL={isRTL}
            onPageChange={handlePageChange}
          />
        </div>

        {/* تگ نمایش عبارت جست‌وجو شده (فقط وقتی کاربر از سرچ هدر Enter زده باشد) */}
        {searchQueryParam && (
          <div className="flex justify-center mt-3.5">
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
      </section>

      {/* میز تعاملی کارت‌ها (دسکتاپ: کلاژ آزاد | موبایل: استک پیش‌رونده ۵۰ درصدی) */}
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
          className="relative w-full lg:h-screen lg:min-h-[780px] flex items-center justify-center overflow-x-clip lg:overflow-hidden pt-2 pb-16 sm:py-12 lg:py-0"
        >
          <div
            ref={boardRef}
            className={`will-change-transform relative flex flex-col items-center gap-6 max-w-[430px] sm:max-w-[500px] px-4 sm:px-6 mx-auto lg:block lg:p-0 lg:mx-0 lg:h-[78vh] lg:min-h-[600px] lg:max-h-[760px] shrink-0 ${
              isWideBoard
                ? 'w-full lg:w-[144vw] lg:max-w-none'
                : 'w-full lg:w-full lg:max-w-6xl'
            }`}
          >
            {paginatedProjects.map((project, index) => (
              <PolaroidVideoCard
                key={`${project.id}-${activeCategory}-${searchQueryParam}-p${currentPage}`}
                project={project}
                index={index}
                layout={getCardLayout(index, paginatedProjects.length)}
                title={getLocalized(project.title)}
                isRTL={isRTL}
                isMobileActive={activeMobileCardId === project.id}
                onMobileActivate={setActiveMobileCardId}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
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