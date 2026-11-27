import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

gsap.registerPlugin(ScrollTrigger);

// قیدهای استاندارد برای هماهنگی با ادمین پنل (حداقل ۵ و حداکثر ۷ کارت برای حفظ تقارن فرد)
export const PORTFOLIO_SLIDER_LIMITS = {
  minVisualSlots: 5,
  maxItems: 7,
};

const portfolioAssetImages = import.meta.glob(
  '../../assets/**/*.{webp,png,jpg,jpeg,avif,svg}',
  { eager: true, import: 'default' }
);

const resolvePortfolioImage = (imgName) => {
  if (!imgName) return '';
  if (imgName.startsWith('http') || imgName.startsWith('/')) return imgName;

  const matchedKey = Object.keys(portfolioAssetImages).find((path) =>
    path.endsWith(`/${imgName}`)
  );
  if (matchedKey) return portfolioAssetImages[matchedKey];

  return `/images/portfolio/${imgName}`;
};

const CATEGORY_FALLBACKS = {
  'website-design': [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
  ],
  'graphic-design': [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80',
  ],
  branding: [
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1000&q=80',
  ],
  print: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80',
  ],
};

function PortfolioThumbImage({ fileName, category, variantIdx = 0, alt, className = '' }) {
  const pool = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['website-design'];
  const fallbackUrl = pool[variantIdx % pool.length];
  const [src, setSrc] = useState(() => resolvePortfolioImage(fileName) || fallbackUrl);

  useEffect(() => {
    setSrc(resolvePortfolioImage(fileName) || fallbackUrl);
  }, [fileName, fallbackUrl]);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={(e) => {
        if (!e.currentTarget.dataset.tryPublic && fileName) {
          e.currentTarget.dataset.tryPublic = 'true';
          setSrc(`/images/${fileName}`);
        } else if (!e.currentTarget.dataset.tryFallback) {
          e.currentTarget.dataset.tryFallback = 'true';
          setSrc(fallbackUrl);
        }
      }}
      className={className}
    />
  );
}

/* کارت یکپارچه روی ریل پیوسته:
   - لایه بیرونی فقط موقعیت‌دهی absolute و انیمیشن ریل را مدیریت می‌کند
   - لایه داخلی کلاس alpha-glass-bar و نور دنبال‌کننده موس را دارد */
function ContinuousDeckCard({
  slot,
  slotIndex,
  isCentered,
  currentLang,
  isRTL,
  serviceTitle,
  getLocalized,
  onSelectCard,
  setCardRef,
}) {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const isEmpty = slot.isEmpty;
  const item = slot.item;
  const isWebsiteProject = !isEmpty && item?.category === 'website-design';
  const projectHref = isWebsiteProject ? `/${currentLang}/portfolio/${item.slug}` : '';

  const pool =
    CATEGORY_FALLBACKS[item?.category] || CATEGORY_FALLBACKS['website-design'];
  const posterUrl = item ? resolvePortfolioImage(item.mainImage) || pool[0] : '';
  const hasVideo = Boolean(!isEmpty && item?.previewVideo && !videoFailed);

  useEffect(() => {
    setVideoFailed(false);
  }, [slot.uid]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !hasVideo) return;
    if (isCentered) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isCentered, hasVideo]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleCardClick = (e) => {
    if (!isCentered) {
      e.preventDefault();
      onSelectCard(slotIndex);
    }
  };

  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  // کارت خالی فعال (جزئی از ریل متحرک و قفل اسکرول)
  if (isEmpty) {
    return (
      <div
        ref={(el) => setCardRef(slotIndex, el)}
        className="absolute left-1/2 top-1/2 w-[248px] sm:w-[290px] lg:w-[318px] h-[410px] sm:h-[450px] lg:h-[478px] will-change-transform"
      >
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          role="button"
          tabIndex={0}
          onClick={() => onSelectCard(slotIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectCard(slotIndex);
            }
          }}
          onMouseMove={handleMouseMove}
          className={`alpha-glass-bar w-full h-full rounded-[30px] p-6 bg-white/65 dark:bg-[#091229]/60 border border-dashed border-slate-300/90 dark:border-white/20 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer ${
            isCentered
              ? 'shadow-[0_30px_80px_-20px_rgba(15,23,42,0.22)] dark:shadow-[0_34px_90px_-18px_rgba(2,6,23,0.85)]'
              : 'shadow-lg'
          }`}
        >
          <div className="relative z-10 w-full flex items-center justify-between px-1">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
              {String(slotIndex + 1).padStart(2, '0')}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-200/70 dark:bg-white/8 text-slate-500 dark:text-slate-400">
              {serviceTitle}
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-[220px]">
            <div className="w-14 h-14 rounded-2xl border border-dashed border-blue-900/25 dark:border-sky-400/30 bg-blue-950/5 dark:bg-sky-400/10 flex items-center justify-center text-blue-900/60 dark:text-sky-400/75 mb-4">
              <Sparkles size={22} />
            </div>
            <span className="font-body font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              {isRTL ? 'جایگاه خالی نمونه‌کار' : 'Open Portfolio Slot'}
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {isRTL
                ? 'پروژه‌های جدید این خدمت به‌محض انتشار در اینجا قرار می‌گیرند.'
                : 'Upcoming projects for this service will appear here automatically.'}
            </p>
          </div>

          <div className="relative z-10 w-12 h-[2px] rounded-full bg-slate-300/80 dark:bg-white/15" />
        </div>
      </div>
    );
  }

  const title = getLocalized(item.title);
  const client = getLocalized(item.client);
  const shortDesc = getLocalized(item.shortDescription);

  const mediaInner = (
    <>
      <PortfolioThumbImage
        fileName={item.mainImage}
        category={item.category}
        variantIdx={slotIndex}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {hasVideo && (
        <video
          ref={videoRef}
          key={item.previewVideo}
          src={item.previewVideo}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isCentered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/15 pointer-events-none"
      />
    </>
  );

  return (
    <div
      ref={(el) => setCardRef(slotIndex, el)}
      className="absolute left-1/2 top-1/2 w-[248px] sm:w-[290px] lg:w-[318px] h-[410px] sm:h-[450px] lg:h-[478px] will-change-transform"
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        className={`alpha-glass-bar group w-full h-full rounded-[30px] p-3.5 sm:p-4 bg-white/90 dark:bg-[#091229]/85 flex flex-col justify-between overflow-hidden ${
          isCentered
            ? 'shadow-[0_30px_80px_-20px_rgba(15,23,42,0.3)] dark:shadow-[0_34px_90px_-18px_rgba(2,6,23,0.92)]'
            : 'cursor-pointer shadow-xl'
        }`}
      >
        {/* هدر مینیمال بالای کارت */}
        <div className="relative z-10 flex items-center justify-between gap-2 px-1.5 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white dark:bg-sky-400 dark:text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Layers size={15} />
            </div>
            <div className="min-w-0 text-start">
              <span className="block text-xs font-bold text-slate-950 dark:text-white truncate">
                {client || 'Alpha Glow'}
              </span>
              <span className="block text-[11px] font-semibold text-blue-900/80 dark:text-sky-300/90 truncate">
                {serviceTitle}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-950/8 text-blue-950 dark:bg-white/10 dark:text-sky-300 border border-blue-950/10 dark:border-white/15 shrink-0">
            {item.createdAt?.slice(0, 4) || '2026'}
          </span>
        </div>

        {/* پنجره مدیا: لینک فقط برای سرویس وب‌سایت و زمانی که در مرکز است */}
        {isWebsiteProject && isCentered ? (
          <Link
            to={projectHref}
            className="relative z-10 flex-1 w-full rounded-[22px] overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10 block"
          >
            {mediaInner}
          </Link>
        ) : (
          <div className="relative z-10 flex-1 w-full rounded-[22px] overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10">
            {mediaInner}
          </div>
        )}

        {/* فوتر کارت */}
        <div className="relative z-10 pt-3 px-1.5 flex items-end justify-between gap-3">
          <div className="min-w-0 text-start">
            {isWebsiteProject && isCentered ? (
              <Link
                to={projectHref}
                className="block font-body font-bold text-slate-950 dark:text-white group-hover:text-blue-900 dark:group-hover:text-sky-300 transition-colors truncate"
              >
                {title}
              </Link>
            ) : (
              <span className="block font-body font-bold text-slate-950 dark:text-white truncate">
                {title}
              </span>
            )}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
              {shortDesc}
            </p>
          </div>

          {/* دکمه لینک فقط برای پروژه‌های وب‌سایت */}
          {isWebsiteProject && (
            <Link
              to={projectHref}
              onClick={handleCardClick}
              aria-label={isRTL ? `مشاهده ${title}` : `View ${title}`}
              className={`w-10 h-10 rounded-full shrink-0 bg-blue-950 hover:bg-blue-900 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 flex items-center justify-center shadow-md transition-all duration-300 ${
                isCentered ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-60 scale-90'
              }`}
            >
              <ActionArrow size={17} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicePortfolioSlider({ activeService }) {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;
  const tp = t.servicesPage?.portfolio || {};

  const services = db?.services || [];
  const activeServiceObj =
    services.find((s) => s.slug === activeService) || services[0];

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  // جدیدترین پروژه در اول لیست (مرکز) + سقف ۷ پروژه + پر کردن جایگاه‌های خالی تا حداقل ۵ کارت
  const { deck, totalInCategory } = useMemo(() => {
    const all = Array.isArray(db?.portfolio) ? db.portfolio : [];
    const matching = all
      .map((item, origIdx) => ({ item, origIdx }))
      .filter(({ item }) => item.category === activeService)
      .sort((a, b) => {
        const dateCmp = String(b.item.createdAt || '').localeCompare(
          String(a.item.createdAt || '')
        );
        if (dateCmp !== 0) return dateCmp;
        return b.origIdx - a.origIdx;
      })
      .map(({ item }) => item);

    const capped = matching.slice(0, PORTFOLIO_SLIDER_LIMITS.maxItems);
    const list = capped.map((item, i) => ({
      uid: `${activeService}-${item.id}-${i}`,
      isEmpty: false,
      item,
    }));

    const missing = Math.max(0, PORTFOLIO_SLIDER_LIMITS.minVisualSlots - list.length);
    for (let i = 0; i < missing; i += 1) {
      list.push({
        uid: `${activeService}-empty-${i}`,
        isEmpty: true,
        item: null,
      });
    }

    return {
      deck: list,
      totalInCategory: matching.length,
    };
  }, [activeService]);

  const deckLen = deck.length;

  const [centeredIdx, setCenteredIdx] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const pinWrapRef = useRef(null);
  const progressBarRef = useRef(null);
  const cardRefs = useRef([]);
  const scrollPosRef = useRef({ value: 0 });
  const manualPosRef = useRef({ value: 0 });
  const manualTweenRef = useRef(null);
  const lastCenteredRef = useRef(0);
  const toastTimerRef = useRef(null);
  const touchStartX = useRef(null);

  const setCardRef = useCallback((idx, el) => {
    cardRefs.current[idx] = el;
  }, []);

  const triggerServiceToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3600);
  }, []);

  // رندر ۶۰ فریم مستقیم روی GPU بدون ری‌رندر اضافی در حین اسکرول
  const renderTrack = useCallback(() => {
    const N = deckLen;
    if (N === 0) return;

    const currentPos = scrollPosRef.current.value + manualPosRef.current.value;
    const firstCard = cardRefs.current[0];
    const cardW =
      firstCard?.offsetWidth ||
      (window.innerWidth >= 1024 ? 318 : window.innerWidth >= 640 ? 290 : 248);
    const dirSign = isRTL ? -1 : 1;
    const halfN = N / 2;
    const fadeStart = Math.max(2.05, halfN - 0.35);
    const fadeEnd = halfN - 0.02;

    let closestIdx = 0;
    let closestDist = Infinity;

    for (let i = 0; i < N; i += 1) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let offset = (((i - currentPos) % N) + N) % N;
      if (offset > halfN) offset -= N;

      const absT = Math.abs(offset);
      const sign = offset >= 0 ? 1 : -1;

      if (absT < closestDist) {
        closestDist = absT;
        closestIdx = i;
      }

      const x = sign * dirSign * cardW * (1.03 * absT - 0.082 * absT * absT);
      const scale = 0.34 + 0.66 / (1 + 0.72 * Math.pow(absT, 1.3));
      const y = Math.min(absT, 2.4) * 7;

      let opacity = Math.max(0.48, 1 - absT * 0.15);
      if (absT > fadeStart) {
        const tFade = Math.min(
          1,
          (absT - fadeStart) / Math.max(0.05, fadeEnd - fadeStart)
        );
        opacity *= 1 - tFade;
      }

      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(Math.round(50 - absT * 10));
      el.style.pointerEvents = opacity < 0.08 ? 'none' : 'auto';
    }

    if (closestIdx !== lastCenteredRef.current) {
      lastCenteredRef.current = closestIdx;
      setCenteredIdx(closestIdx);
    }
  }, [deckLen, isRTL]);

  const renderTrackRef = useRef(renderTrack);
  renderTrackRef.current = renderTrack;

  const toastRef = useRef(triggerServiceToast);
  toastRef.current = triggerServiceToast;

  // ریست نرم ریل و نمایش یادآور هنگام تغییر خدمت (بدون تخریب pin-spacer زمانی که تعداد کارت ثابت است)
  useEffect(() => {
    if (manualTweenRef.current) manualTweenRef.current.kill();
    manualPosRef.current.value = 0;
    lastCenteredRef.current = 0;
    setCenteredIdx(0);
    cardRefs.current = cardRefs.current.slice(0, deckLen);
    triggerServiceToast();

    requestAnimationFrame(() => renderTrack());

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [activeService, deckLen, triggerServiceToast, renderTrack]);

  // قفل کردن کامل صفحه در مرکز دید کاربر تا زمانی که تمام کارت‌ها (از اول تا آخر) به‌نرمی عبور کنند
  useLayoutEffect(() => {
    if (!pinWrapRef.current || deckLen === 0) return;

    scrollPosRef.current.value = 0;
    const totalSteps = Math.max(1, deckLen - 1);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const setupPinnedTrain = (pxPerStep) => {
        const totalScrollDistance = Math.round(totalSteps * pxPerStep);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapRef.current,
            start: 'center center',
            end: () => `+=${totalScrollDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => toastRef.current(),
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
              }
            },
            onRefresh: () => renderTrackRef.current(),
          },
        });

        // مکث بسیار کوتاه در شروع تا جدیدترین پروژه ابتدا واضح در مرکز دیده شود
        tl.to({}, { duration: 0.08 });

        // حرکت پیوسته و یکنواخت ریل از کارت اول (0) تا آخرین کارت (deckLen - 1)
        tl.to(scrollPosRef.current, {
          value: totalSteps,
          duration: 1,
          ease: 'none',
          onUpdate: () => renderTrackRef.current(),
        });

        // مکث کوتاه در پایان برای دیدن کامل آخرین کارت پیش از آزاد شدن قفل صفحه
        tl.to({}, { duration: 0.12 });
      };

      // دسکتاپ: مسیر اسکرول جادارتر برای کنترل نرم روی تمام کارت‌ها
      mm.add('(min-width: 1024px)', () => {
        setupPinnedTrain(520);
      });

      // موبایل و تبلت: مسیر اسکرول متناسب با لمس
      mm.add('(max-width: 1023px)', () => {
        setupPinnedTrain(360);
      });
    }, pinWrapRef);

    const handleResize = () => renderTrackRef.current();
    window.addEventListener('resize', handleResize);
    renderTrackRef.current();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 180);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [deckLen, isRTL]);

  const glideManualBy = useCallback(
    (delta) => {
      if (Math.abs(delta) < 0.005) return;
      if (manualTweenRef.current) manualTweenRef.current.kill();

      const targetManual = manualPosRef.current.value + delta;
      manualTweenRef.current = gsap.to(manualPosRef.current, {
        value: targetManual,
        duration: 0.78,
        ease: 'power3.out',
        onUpdate: renderTrack,
      });
    },
    [renderTrack]
  );

  const handleSelectCard = useCallback(
    (targetIdx) => {
      const N = deckLen;
      const currentPos = scrollPosRef.current.value + manualPosRef.current.value;
      let offset = (((targetIdx - currentPos) % N) + N) % N;
      if (offset > N / 2) offset -= N;
      glideManualBy(offset);
    },
    [deckLen, glideManualBy]
  );

  const handleStep = useCallback(
    (direction) => {
      const currentPos = scrollPosRef.current.value + manualPosRef.current.value;
      const targetPos =
        direction > 0
          ? Math.floor(currentPos + 0.08) + 1
          : Math.ceil(currentPos - 0.08) - 1;
      glideManualBy(targetPos - currentPos);
    },
    [glideManualBy]
  );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 42) return;

    if (dx < 0) handleStep(isRTL ? -1 : 1);
    else handleStep(isRTL ? 1 : -1);
  };

  const handlePillMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const serviceTitle = getLocalized(activeServiceObj?.title);
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-slate-100 dark:bg-[#030712] border-t border-slate-200/80 dark:border-white/10 transition-colors duration-500 select-none"
    >
      {/* ظرف جداگانه هاله نوری تا با pin تداخل ایجاد نشود */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[420px] rounded-full bg-blue-500/10 dark:bg-sky-500/12 blur-[140px]" />
      </div>

      {/* پاپ‌آپ یادآور شیشه‌ای */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >      
      
      </div>

      {/* قاب قفل‌شونده (Pin Wrapper): ارتفاع متعادل تا کل هدر، کارت‌ها و دکمه پایانی هم‌زمان در کادر بمانند */}
      <div
        ref={pinWrapRef}
        className="relative z-10 w-full py-12 md:py-16 flex flex-col justify-center"
      >
        {/* هدر ادیتوریال + نشانگر ثابت خدمت فعال + کنترل‌های دستی */}
        <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-start">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/85 dark:bg-white/6 border border-slate-300/80 dark:border-white/15 mb-3 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-800 dark:bg-sky-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-sky-200">
                  {isRTL
                    ? `در حال نمایش: ${serviceTitle} (${totalInCategory} نمونه‌کار)`
                    : `Showing: ${serviceTitle} (${totalInCategory} ${
                        totalInCategory === 1 ? 'work' : 'works'
                      })`}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-1.5">
                <span className="w-10 h-[1.5px] bg-gradient-to-r from-blue-600 to-sky-400" />
                <span className="text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-blue-900 dark:text-sky-300">
                  {tp.badge || (isRTL ? 'نمونه‌کارهای این خدمت' : 'SERVICE PORTFOLIO')}
                </span>
              </div>

              <h2 className="font-heading font-black tracking-tight text-slate-950 dark:text-white">
                {isRTL
                  ? `نمونه‌کارهای ${serviceTitle}`
                  : `${serviceTitle} Showcase`}
              </h2>
            </div>

            {/* شمارنده اسلات فعال + کنترل‌های دستی + نوار پیشرفت اسکرول */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400">
                  <strong className="text-blue-950 dark:text-sky-300">
                    {String(centeredIdx + 1).padStart(2, '0')}
                  </strong>{' '}
                  / {String(deckLen).padStart(2, '0')}
                </span>

                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    aria-label={isRTL ? 'اسلاید قبلی' : 'Previous slide'}
                    className="w-10 h-10 rounded-full bg-white hover:bg-blue-950 text-slate-900 hover:text-white border border-slate-300 hover:border-blue-950 dark:bg-slate-900 dark:hover:bg-sky-400 dark:text-white dark:hover:text-slate-950 dark:border-slate-700 dark:hover:border-sky-400 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <PrevIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    aria-label={isRTL ? 'اسلاید بعدی' : 'Next slide'}
                    className="w-10 h-10 rounded-full bg-white hover:bg-blue-950 text-slate-900 hover:text-white border border-slate-300 hover:border-blue-950 dark:bg-slate-900 dark:hover:bg-sky-400 dark:text-white dark:hover:text-slate-950 dark:border-slate-700 dark:hover:border-sky-400 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <NextIcon size={18} />
                  </button>
                </div>
              </div>

              {/* نوار پیشرفت ظریف مسیر قفل‌شده اسلایدر */}
              <div className="w-36 h-[3px] rounded-full bg-slate-300/70 dark:bg-white/10 overflow-hidden">
                <div
                  ref={progressBarRef}
                  style={{
                    transform: 'scaleX(0)',
                    transformOrigin: isRTL ? 'right center' : 'left center',
                  }}
                  className="w-full h-full rounded-full bg-gradient-to-r from-blue-900 via-blue-600 to-sky-400 dark:from-sky-400 dark:to-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* صحنه اصلی ریل پیوسته */}
        <div className="relative w-full max-w-[1480px] mx-auto overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 lg:w-32 bg-gradient-to-r from-slate-100 dark:from-[#030712] to-transparent z-[60]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 lg:w-32 bg-gradient-to-l from-slate-100 dark:from-[#030712] to-transparent z-[60]"
          />

          <div className="relative w-full h-[435px] sm:h-[478px] lg:h-[510px]">
            {deck.map((slot, idx) => (
              <ContinuousDeckCard
                key={slot.uid}
                slot={slot}
                slotIndex={idx}
                isCentered={centeredIdx === idx}
                currentLang={currentLang}
                isRTL={isRTL}
                serviceTitle={serviceTitle}
                getLocalized={getLocalized}
                onSelectCard={handleSelectCard}
                setCardRef={setCardRef}
              />
            ))}
          </div>
        </div>

        {/* دکمه کپسولی لینک به صفحه نمونه‌کارها با فیلتر همین خدمت */}
        <div className="relative z-10 mt-6 md:mt-8 flex flex-col items-center gap-3 px-4">
          <Link
            to={`/${currentLang}/portfolio?category=${activeService}`}
            onMouseMove={handlePillMouseMove}
            className="alpha-glass-bar group inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-slate-950 dark:text-white font-body font-bold text-sm lg:text-base hover:-translate-y-0.5 overflow-hidden"
          >
            <span className="relative z-10">
              {isRTL
                ? `مشاهده همه نمونه‌کارهای ${serviceTitle}`
                : `Explore All ${serviceTitle} Works`}
            </span>
            <ActionArrow
              size={17}
              className="relative z-10 text-blue-950 dark:text-sky-300 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}