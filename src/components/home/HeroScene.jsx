import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchHomepageData } from '../../api/homepageApi';
import { HeroCageSceneManager } from '../../three/HeroCageCanvas';
import { ArrowLeft, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const { lang } = useParams();
  const currentLang = lang === 'en' ? 'en' : 'fa';

  const [data, setData] = useState(null);
  const [webglError, setWebglError] = useState(false);

  const sectionRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const textWrapperRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const scrollHintRef = useRef(null);
  const sceneManagerRef = useRef(null);

  // ۱. دریافت داده‌های داینامیک هیرو
  useEffect(() => {
    let isMounted = true;
    async function load() {
      const res = await fetchHomepageData();
      if (isMounted && res) {
        setData(res);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // ۲. راه‌اندازی صحنه سه‌بعدی و تایم‌لاین اسکرول
  useEffect(() => {
    if (!data || !canvasWrapperRef.current || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    let manager = null;
    try {
      manager = new HeroCageSceneManager(canvasWrapperRef.current, {
        lang: currentLang,
        isMobile,
        isTablet,
        reducedMotion: prefersReducedMotion,
      });
      sceneManagerRef.current = manager;
    } catch (err) {
      console.error('WebGL Initialization Error:', err);
      setWebglError(true);
      return;
    }

    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, subheadlineRef.current, ctaGroupRef.current], {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
      });
      if (scrollHintRef.current) {
        gsap.set(scrollHintRef.current, { autoAlpha: 0 });
      }
      return () => {
        manager.dispose();
      };
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 768px) and (max-width: 1023px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isMobile: mobileMatch, isTablet: tabletMatch } = context.conditions;

        manager.updateLayoutTargets(currentLang, mobileMatch, tabletMatch);

        // تضمین وضعیت اولیه: تیتر، توضیحات و دکمه‌ها کاملاً پنهان
        gsap.set([headlineRef.current, subheadlineRef.current, ctaGroupRef.current], {
          autoAlpha: 0,
          y: 28,
          filter: 'blur(10px)',
        });

        gsap.set(scrollHintRef.current, { autoAlpha: 0.75, y: 0 });

        // ریست کامل وضعیت اسکرول صحنه سه‌بعدی
        manager.scrollState.anticipation = 0;
        manager.scrollState.breach = 0;
        manager.scrollState.cageExit = 0;
        manager.scrollState.journey = 0;
        manager.scrollState.transform = 0;

        // فاصله اسکرول کنترل‌شده و متعادل تا صفحه حس گیر کردن نداشته باشد
        const scrollDistance = mobileMatch ? '+=145%' : '+=185%';

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: scrollDistance,
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // محو شدن راهنمای اسکرول با شروع اسکرول کاربر
        tl.to(
          scrollHintRef.current,
          {
            autoAlpha: 0,
            y: -12,
            duration: 0.1,
            ease: 'power1.out',
          },
          0
        );

        // Phase A (0.00 -> 0.20): Begin Scrolling - حرکت هدفمند ذره اصلی به سمت مرز قفس
        tl.to(
          manager.scrollState,
          {
            anticipation: 1,
            duration: 0.2,
            ease: 'power1.inOut',
          },
          0
        );

        // Phase B (0.18 -> 0.36): Particle Escapes - شکسته شدن مرز قفس و خروج ذره
        tl.to(
          manager.scrollState,
          {
            breach: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.18
        );

        // Phase C (0.26 -> 0.72): Cage Moves Upward Out of Viewport + Particle Travels
        tl.to(
          manager.scrollState,
          {
            cageExit: 1,
            duration: 0.46,
            ease: 'power2.inOut',
          },
          0.26
        ).to(
          manager.scrollState,
          {
            journey: 1,
            duration: 0.48,
            ease: 'power2.inOut',
          },
          0.26
        );

        // Phase D (0.62 -> 0.96): Diamond & Headline Appear (پس از خارج شدن قفس از مرکز صحنه)
        tl.to(
          manager.scrollState,
          {
            transform: 1,
            duration: 0.34,
            ease: 'power2.out',
          },
          0.62
        )
          .to(
            headlineRef.current,
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.28,
              ease: 'power3.out',
            },
            0.66
          )
          .to(
            subheadlineRef.current,
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.25,
              ease: 'power3.out',
            },
            0.73
          )
          .to(
            ctaGroupRef.current,
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.22,
              ease: 'power3.out',
            },
            0.8
          );
      }
    );

    return () => {
      mm.revert();
      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
      }
    };
  }, [data, currentLang]);

  const heroContent = data?.scene1_hero || {
    headline: {
      fa: 'جایی که برندها شروع به درخشیدن می‌کنند',
      en: 'Where Brands Start to Glow',
    },
    subheadline: {
      fa: 'ما با تلفیق هنر، خلاقیت و تکنولوژی مدرن وب، هویتی متمایز و پیشرو برای کسب‌وکار شما خلق می‌کنیم.',
      en: 'Merging artistry, creative vision, and modern web tech to build distinctive, progressive brand identities.',
    },
    primaryCta: {
      label: { fa: 'مشاهده پروژه‌ها', en: 'Explore Portfolio' },
      link: '/services',
    },
    secondaryCta: {
      label: { fa: 'شروع پروژه', en: 'Start a Project' },
      link: '/contact',
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none"
      aria-label={heroContent.headline[currentLang]}
    >
      {/* بوم رندرینگ Three.js تمام‌صفحه */}
      {!webglError ? (
        <div
          ref={canvasWrapperRef}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-72 h-72 rounded-full border border-[#213668]/30 dark:border-white/25 animate-pulse" />
        </div>
      )}

      {/* لایه تایپوگرافی و شعار (بدون هیچ باکس یا کارت پس‌زمینه) */}
      <div className="container-custom relative z-10 w-full h-full flex flex-col justify-end md:justify-center pb-14 md:pb-0 pointer-events-none">
        <div
          ref={textWrapperRef}
          className="w-full md:w-7/12 lg:w-6/12 flex flex-col items-center text-center md:items-start md:text-start md:ms-0 md:me-auto"
        >
          <h1
            ref={headlineRef}
            className="font-display text-[#213668] dark:text-white tracking-tight leading-[1.15] mb-5 opacity-0"
          >
            {heroContent.headline[currentLang]}
          </h1>

          <p
            ref={subheadlineRef}
            className="font-body text-slate-600 dark:text-slate-300 max-w-xl mb-8 opacity-0"
          >
            {heroContent.subheadline[currentLang]}
          </p>

          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 opacity-0 pointer-events-auto"
          >
            <Link
              to={`/${currentLang}${heroContent.primaryCta.link}`}
              className="px-7 py-3.5 rounded-full bg-[#213668] text-white dark:bg-white dark:text-[#213668] font-bold text-xs md:text-sm shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{heroContent.primaryCta.label[currentLang]}</span>
              {currentLang === 'fa' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>

            <Link
              to={`/${currentLang}${heroContent.secondaryCta.link}`}
              className="px-7 py-3.5 rounded-full border border-[#213668]/30 dark:border-white/30 text-[#213668] dark:text-white font-bold text-xs md:text-sm hover:bg-[#213668]/5 dark:hover:bg-white/10 active:scale-95 transition-all"
            >
              {heroContent.secondaryCta.label[currentLang]}
            </Link>
          </div>
        </div>
      </div>

      {/* راهنمای اسکرول اولیه */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-6 inset-x-0 z-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase text-[#213668]/70 dark:text-white/60">
          {currentLang === 'fa' ? 'برای رهایی نور اسکرول کنید' : 'Scroll to release the light'}
        </span>
        <div className="w-[1px] h-7 bg-gradient-to-b from-[#213668] dark:from-white to-transparent animate-pulse" />
      </div>
    </section>
  );
}