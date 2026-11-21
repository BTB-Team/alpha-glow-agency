import { useState, useLayoutEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import PortfolioModal, {
  getPortfolioImageUrl,
  handlePortfolioImageError,
} from './PortfolioModal';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_KEYS = ['all', 'website-design', 'branding', 'graphic-design', 'print'];

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

// چیدمان کاملاً آزاد (بدون سطر و ستون) با کارت‌های بزرگ‌تر و حاشیه تنفس در لبه‌های چپ و راست
const FREEFORM_WIDE_LAYOUT = [
  { x: 12, y: 34, rot: -6, width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/5]', z: 12 },
  { x: 23, y: 72, rot: 4,  width: 'lg:w-[25vw] lg:max-w-[385px]', aspect: 'aspect-[5/4]', z: 22 },
  { x: 34, y: 24, rot: -3, width: 'lg:w-[22vw] lg:max-w-[335px]', aspect: 'aspect-[1/1]', z: 16 },
  { x: 46, y: 58, rot: 5,  width: 'lg:w-[24vw] lg:max-w-[365px]', aspect: 'aspect-[4/5]', z: 28 },
  { x: 58, y: 74, rot: -5, width: 'lg:w-[26vw] lg:max-w-[400px]', aspect: 'aspect-[5/4]', z: 20 },
  { x: 65, y: 27, rot: 4,  width: 'lg:w-[23vw] lg:max-w-[350px]', aspect: 'aspect-[4/5]', z: 15 },
  { x: 78, y: 63, rot: -4, width: 'lg:w-[23vw] lg:max-w-[345px]', aspect: 'aspect-[1/1]', z: 24 },
  { x: 88, y: 31, rot: 6,  width: 'lg:w-[25vw] lg:max-w-[380px]', aspect: 'aspect-[5/4]', z: 18 },
];

// چیدمان آزاد و بزرگ‌تر برای حالت‌هایی که فیلتر فعال است (۱ تا ۳ پروژه)
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
  if (index < FREEFORM_WIDE_LAYOUT.length) {
    return FREEFORM_WIDE_LAYOUT[index];
  }
  const base = FREEFORM_WIDE_LAYOUT[index % FREEFORM_WIDE_LAYOUT.length];
  return {
    ...base,
    x: Math.min(86, Math.max(14, base.x + ((index % 3) - 1) * 4)),
    y: Math.min(73, Math.max(26, base.y + (index % 2 === 0 ? 5 : -5))),
    z: 10 + index,
  };
};

/* ============================================================================
   کارت مستقل پولاروید: در حالت عادی فقط عکس / در هاور بزرگ‌نمایی چشم‌گیر + پخش ویدیو
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
      gsap.killTweensOf(frameRef.current);
      gsap.to(frameRef.current, {
        scale: window.innerWidth >= 1024 ? 1.24 : 1.04,
        rotation: 0,
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
    /* مختصات left/top فقط در lg به بالا فعال می‌شود تا در موبایل و تبلت کاملاً ریسپانسیو بماند */
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
        className={`cursor-pointer bg-white dark:bg-slate-900 p-3 sm:p-3.5 pb-5 sm:pb-6 rounded-sm border border-slate-200/90 dark:border-slate-800 transition-shadow duration-300 will-change-transform ${
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
      </article>
    </div>
  );
}

/* ============================================================================
   کامپوننت مستقل بخش فیلتر + میز کلاژ تعاملی + مدال جزئیات
   ============================================================================ */
export default function PortfolioCollageStage() {
  const { lang } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.portfolioPage;

  // بدون پارامتر => همه پروژه‌ها؛ با ?category=... از صفحه خدمات => فیلتر همان خدمت
  const categoryParam = searchParams.get('category');
  const activeCategory = CATEGORY_KEYS.includes(categoryParam) ? categoryParam : 'all';

  const [selectedProject, setSelectedProject] = useState(null);

  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const quickPanXRef = useRef(null);
  const canPanRef = useRef(false);

  const allProjects = db?.portfolio || [];
  const filteredProjects =
    activeCategory === 'all'
      ? allProjects
      : allProjects.filter((project) => project.category === activeCategory);

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  const handleCategoryChange = (catKey) => {
    if (catKey === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: catKey }, { replace: true });
    }
  };

  useLayoutEffect(() => {
    if (!stageRef.current || !boardRef.current || filteredProjects.length === 0) return;

    canPanRef.current = false;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // دسکتاپ: خوشه باز و پهن در شروع -> پخش آزاد روی میز -> مکث + پن موس -> خروج ناگهانی
      mm.add('(min-width: 1024px)', () => {
        gsap.set(boardRef.current, { x: 0 });
        quickPanXRef.current = gsap.quickTo(boardRef.current, 'x', {
          duration: 0.9,
          ease: 'power3.out',
        });

        const slots = gsap.utils.toArray('.table-card-slot');
        if (slots.length === 0) return;

        const sweepDir = isRTL ? 1 : -1;

        // کشیدن ملایم‌تر به سمت مرکز (۵۰٪ به جای ۱۰۰٪) تا در شروع هم خوشه‌ای بزرگ، پهن و آزاد داشته باشیم
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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top 72px',
            end: () => `+=${window.innerHeight * 2.5}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const isSpreadOpen = self.progress >= 0.22 && self.progress <= 0.74;
              canPanRef.current = isSpreadOpen;
              if (!isSpreadOpen && quickPanXRef.current) {
                quickPanXRef.current(0);
              }
            },
          },
        });

        // فاز ۱ (0 تا 0.88): باز شدن کارت‌ها از خوشه میانی روی کل عرض میز
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
            i * 0.016
          );
        });

        // فاز ۲ (0.88 تا 2.20): بازه مکث برای کاوش، حرکت موس به طرفین و هاور ویدیو
        tl.to({}, { duration: 1.32 }, 0.88);

        // فاز ۳ (2.20 تا 3.00): خروج یک‌دفعه‌ای کل کارت‌ها به یک سمت صحنه
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
            2.2 + i * 0.012
          );
        });
      });

      // موبایل و تبلت: انیمیشن ورود تمیز روی گرید واکنش‌گرا بدون قفل اسکرول
      mm.add('(max-width: 1023px)', () => {
        quickPanXRef.current = null;
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
      canPanRef.current = false;
      ctx.revert();
    };
  }, [filteredProjects.length, activeCategory, currentLang, isRTL]);

  // حرکت افقی کل بوم با موس همراه با حاشیه تنفس کافی در کناره‌های صفحه
  const handleStageMouseMove = (e) => {
    if (
      window.innerWidth < 1024 ||
      !canPanRef.current ||
      !quickPanXRef.current ||
      !stageRef.current ||
      !boardRef.current
    ) {
      return;
    }

    const stageWidth = stageRef.current.clientWidth;
    const boardWidth = boardRef.current.clientWidth;
    const overflowHalf = (boardWidth - stageWidth) / 2;

    if (overflowHalf <= 0) return;

    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    // حاشیه تنفس اضافه (80px) تا لبه‌های کارت‌های کناری کاملاً آزاد و با فضای خالی دیده شوند
    const maxPan = overflowHalf + 80;

    quickPanXRef.current(-normalizedX * maxPan);
  };

  const handleStageMouseLeave = () => {
    if (quickPanXRef.current) {
      quickPanXRef.current(0);
    }
  };

  const isWideBoard = filteredProjects.length >= 4;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="w-full">
      {/* نوار فیلتر دسته‌بندی‌ها */}
      <section className="container-custom mb-6 md:mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {CATEGORY_KEYS.map((catKey) => {
            const isActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryChange(catKey)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-body font-semibold transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-blue-950 text-white border-blue-950 dark:bg-sky-400 dark:text-slate-950 dark:border-sky-400 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-900/40 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:border-sky-400/50'
                }`}
              >
                {tp.categories[catKey]}
              </button>
            );
          })}
        </div>
      </section>

      {/* میز تعاملی کارت‌ها (ریسپانسیو در موبایل/تبلت + آزاد و تعاملی در دسکتاپ) */}
      {filteredProjects.length === 0 ? (
        <section className="container-custom max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-20 px-6 text-center">
            <Layers className="w-10 h-10 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {tp.emptyState}
            </p>
          </div>
        </section>
      ) : (
        <section
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative w-full lg:h-[calc(100vh-72px)] lg:min-h-[720px] flex items-center justify-center overflow-x-clip overflow-y-visible py-8 sm:py-12 lg:py-8"
        >
          {/* موبایل: تک‌ستونه با کارت‌های بزرگ | تبلت: دو ستونه مرتب | دسکتاپ: بوم آزاد 144vw */}
          <div
            ref={boardRef}
            className={`will-change-transform relative grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-9 px-5 sm:px-8 max-w-3xl mx-auto lg:block lg:p-0 lg:mx-0 lg:h-[88%] lg:min-h-[640px] shrink-0 ${
              isWideBoard
                ? 'w-full lg:w-[144vw] lg:max-w-none'
                : 'w-full lg:w-full lg:max-w-6xl'
            }`}
          >
            {filteredProjects.map((project, index) => (
              <PolaroidVideoCard
                key={`${project.id}-${activeCategory}`}
                project={project}
                layout={getCardLayout(index, filteredProjects.length)}
                title={getLocalized(project.title)}
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
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}