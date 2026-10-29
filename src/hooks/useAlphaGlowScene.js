import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PrismExperience } from '../three/PrismExperience';

gsap.registerPlugin(ScrollTrigger);

export function useAlphaGlowScene(canvasRef, containerRef) {
  const experienceRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ۱. راه‌اندازی موتور سه‌بعدی
    const experience = new PrismExperience(canvas);
    experienceRef.current = experience;

    const { scrollGroup, prismMaterial, innerLight } = experience;

    // ۲. ایجاد کانتکست GSAP محدود به دامنه کامپوننت React و مدیریت ریسپانسیو
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // وضعیت اولیه شعار Hero
      gsap.set('.hero-tagline', {
        opacity: 0.15,
        y: 24,
        filter: 'blur(6px)'
      });

      // انیمیشن آشکارسازی متن "Where Brands Start to Glow"
      gsap.to('.hero-tagline', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom 65%',
          scrub: 1
        }
      });

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)'
        },
        (context) => {
          const { isDesktop } = context.conditions;
          const servicesOffsetX = isDesktop ? 2.1 : 0.55;

          // --- تایم‌لاین اول: سکشن Services (چرخش ۳۶۰ درجه + تغییر ضریب شکست IOR) ---
          const servicesTl = gsap.timeline({
            scrollTrigger: {
              trigger: '#services-section',
              start: 'top bottom',
              end: 'center center',
              scrub: 1,
              immediateRender: false
            }
          });

          servicesTl
            .to(
              scrollGroup.rotation,
              {
                y: Math.PI * 2, // چرخش ۳۶۰ درجه حول محور Y
                x: 0.35,
                ease: 'none',
                immediateRender: false
              },
              0
            )
            .to(
              scrollGroup.position,
              {
                x: servicesOffsetX, // انتقال به سمت راست صفحه
                z: 0.4,
                ease: 'power1.inOut',
                immediateRender: false
              },
              0
            )
            .to(
              prismMaterial,
              {
                ior: 2.35, // تغییر ضریب شکست برای نمایش Creative Transparency
                thickness: 4.2,
                roughness: 0.02,
                ease: 'none',
                immediateRender: false
              },
              0
            );

          // --- تایم‌لاین دوم: سکشن Portfolio/About (حرکت به عمق Z + افکت Depth of Field) ---
          const portfolioTl = gsap.timeline({
            scrollTrigger: {
              trigger: '#portfolio-section',
              start: 'top bottom',
              end: 'center center',
              scrub: 1,
              immediateRender: false
            }
          });

          portfolioTl
            .to(
              scrollGroup.position,
              {
                x: 0,
                z: -3.2, // رفتن به عمق پس‌زمینه (Z-axis)
                ease: 'power2.inOut',
                immediateRender: false
              },
              0
            )
            .to(
              scrollGroup.scale,
              {
                x: 1.45,
                y: 1.45,
                z: 1.45,
                ease: 'power2.inOut',
                immediateRender: false
              },
              0
            )
            .to(
              scrollGroup.rotation,
              {
                y: Math.PI * 3.2,
                z: -0.4,
                ease: 'none',
                immediateRender: false
              },
              0
            )
            .to(
              prismMaterial,
              {
                roughness: 0.25,
                ior: 1.6,
                ease: 'none',
                immediateRender: false
              },
              0
            )
            .to(
              innerLight,
              {
                distance: 14,
                ease: 'none',
                immediateRender: false
              },
              0
            )
            .to(
              canvas,
              {
                filter: 'blur(6px)', // شبیه‌سازی بهینه Depth-of-Field دوربین
                ease: 'power1.inOut',
                immediateRender: false
              },
              0
            );
        }
      );
    }, container);

    // ۳. پاکسازی کامل در زمان Unmount یا ری‌مانتِ React StrictMode
    return () => {
      ctx.revert(); // حذف تمام ScrollTriggerها و بازگردانی استایل‌های GSAP
      experience.dispose(); // آزادسازی حافظه GPU و WebGL
      experienceRef.current = null;
    };
  }, [canvasRef, containerRef]);

  return experienceRef;
}