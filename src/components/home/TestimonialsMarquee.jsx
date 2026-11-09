import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

export default function TestimonialsMarquee() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const sliderRef = useRef(null);

  // استخراج کاملاً داینامیک از فایل db.json بر اساس تگ isFeaturedOnHome
  const projects = db?.portfolioProjects || [];
  const featuredTestimonials = projects.flatMap((project) => 
    (project.testimonials || []).filter((item) => item.isFeaturedOnHome === true)
  );

  // اگر هیچ نظری توسط ادمین برای صفحه اصلی انتخاب نشده باشد، بخش رندر نمی‌شود
  if (featuredTestimonials.length === 0) return null;

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 380;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden select-none transition-colors duration-500 bg-slate-50 dark:bg-[#030712]">
      <div className="container-custom relative z-10 mb-16 ">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {t.homeTestimonials?.badge || (isRTL ? 'نظرات مشتریان' : 'TESTIMONIALS')}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-3">
            <span>{t.homeTestimonials?.titlePart1 || (isRTL ? 'صدای' : 'What')} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {t.homeTestimonials?.titleHighlight || (isRTL ? 'مشتریان ما' : 'Clients Say')}
            </span>
          </h2>
          <p className="font-body text-slate-600 dark:text-slate-400 max-w-lg text-sm md:text-base">
            {t.homeTestimonials?.subtitle || (isRTL ? 'تجربه همکاری با آلفا گلو از زبان برندها' : 'Real feedback from our valued partners.')}
          </p>
        </div>
      </div>

      {/* اسکرول دکمه‌ای دستی */}
      <div className="relative w-full overflow-hidden py-8 flex justify-center">
        <div
          ref={sliderRef}
          className="flex gap-8 px-6 md:px-12 overflow-x-auto scroll-smooth no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredTestimonials.map((item) => {
            const clientName = typeof item.name === 'object' ? (item.name[currentLang] || item.name.en) : item.name;
            const clientRole = typeof item.role === 'object' ? (item.role[currentLang] || item.role.en) : item.role;
            const clientComment = typeof item.comment === 'object' ? (item.comment[currentLang] || item.comment.en) : item.comment;

            return (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-[300px] sm:w-[350px] md:w-[380px] pt-12 pb-6 px-4 group"
              >
                {/* لایه‌های پشتی سه بعدی هماهنگ با تم */}
                <div className="absolute inset-x-6 -bottom-2 h-full bg-blue-950 dark:bg-sky-500/20 rounded-[32px] opacity-90 transform rotate-2 scale-[0.96] pointer-events-none shadow-xl transition-transform duration-300 group-hover:rotate-3" />
                <div className="absolute -left-1 inset-y-8 w-full bg-indigo-900/60 dark:bg-blue-600/10 rounded-[32px] opacity-80 transform -rotate-3 scale-[0.93] pointer-events-none transition-transform duration-300 group-hover:-rotate-4" />

                {/* آواتار: اگر عکس داشت عکس را نشان می‌دهد، وگرنه حرف اول نام را */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 size-20 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-lg border-2 border-slate-200 dark:border-sky-400/40 flex items-center justify-center">
                  {item.avatar ? (
                    <img src={item.avatar} alt={clientName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold font-heading text-lg flex items-center justify-center shadow-inner">
                      {clientName ? clientName.charAt(0) : 'A'}
                    </div>
                  )}
                </div>

                {/* کارت اصلی */}
                <div className="relative z-20 bg-white dark:bg-[#030712] rounded-[28px] pt-10 pb-7 px-7 shadow-2xl border border-slate-200/90 dark:border-white/10 flex flex-col items-center text-center h-full min-h-[250px]">
                  <h4 className="font-bold font-heading text-slate-900 dark:text-white text-base sm:text-lg mb-1 tracking-tight">
                    {clientName}
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-sky-400 font-body mb-5 font-semibold">
                    {clientRole}
                  </p>
                  <p className="text-xs sm:text-sm font-body text-slate-600 dark:text-slate-300 leading-relaxed mt-auto">
                    {clientComment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* دکمه‌های کنترل اسکرول */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => handleScroll(isRTL ? 'right' : 'left')}
          aria-label="Previous Testimonial"
          className="alpha-glass-control w-12 h-12 rounded-full flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
        >
          {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <button
          onClick={() => handleScroll(isRTL ? 'left' : 'right')}
          aria-label="Next Testimonial"
          className="alpha-glass-control w-12 h-12 rounded-full flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
        >
          {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </section>
  );
}