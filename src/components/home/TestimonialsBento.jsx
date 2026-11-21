import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function TestimonialsBento() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden select-none transition-colors duration-500 bg-slate-50 dark:bg-[#030712]">
      
      {/* نورهای پس‌زمینه محو و ملایم */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* هدر سیکشن */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              TESTIMONIALS
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4 drop-shadow-sm">
            <span>نظرات و </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent">
              تجربیات مشتریان
            </span>
          </h2>
          <p className="font-body text-slate-600 dark:text-slate-300 max-w-xl text-sm md:text-base">
            روایت همکاری با آلفا گلو از زبان برندها و کارفرمایان عزیز.
          </p>
        </div>

        {/* بنتو گرید نظرات (Bento Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* کارت اول: بزرگ و برجسته (Span 2 ستون) */}
          <div className="md:col-span-2 relative group rounded-3xl p-8 alpha-glass-control border border-slate-300/70 dark:border-blue-500/30 backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-sky-400 shadow-xl">
            <div className="absolute top-6 right-8 text-blue-600/10 dark:text-sky-400/10 pointer-events-none">
              <Quote size={80} />
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-base sm:text-lg md:text-xl font-body text-slate-800 dark:text-slate-100 leading-relaxed">
                «همکاری با آلفا گلو و خانم محمدی یکی از بهترین تجربه‌های کاری ما بود. دقت نظر در جزئیات برندینگ و سرعت بالا در اجرای هویت بصری و وب‌سایت، فراتر از انتظارات ما ظاهر شد. به جرئت می‌توانم بگویم کیفیت کار آن‌ها در سطح استانداردهای جهانی است.»
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-slate-200/80 dark:border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  س ک
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">سینا کریم‌پور</h4>
                  <p className="text-xs text-blue-700 dark:text-sky-300 font-body">مدیرعامل استارتاپ تک‌نو</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                <CheckCircle2 size={14} /> پروژه برندینگ و وب
              </span>
            </div>
          </div>

          {/* کارت دوم: مینیمال (۱ ستون) */}
          <div className="relative group rounded-3xl p-6 alpha-glass-control border border-slate-300/70 dark:border-blue-500/30 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:border-sky-400 shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm md:text-base font-body text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                «طراحی گرافیک و چاپ متریال‌های تبلیغاتی ما با بالاترین کیفیت و در کوتاه‌ترین زمان انجام شد. بسیار حرفه‌ای و خوش‌قول.»
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-200/80 dark:border-white/10 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                م ر
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">مریم رضایی</h4>
                <p className="text-[11px] text-blue-700 dark:text-sky-300 font-body">مدیر مارکتینگ مجموعه راد</p>
              </div>
            </div>
          </div>

          {/* کارت سوم: مینیمال (۱ ستون) */}
          <div className="relative group rounded-3xl p-6 alpha-glass-control border border-slate-300/70 dark:border-blue-500/30 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:border-sky-400 shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm md:text-base font-body text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                «ترکیب هنر و استراتژی در آلفا گلو دقیقاً همان چیزی بود که برند ما برای رشد نیاز داشت. پیشنهاد می‌کنم حتماً با آن‌ها کار کنید.»
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-200/80 dark:border-white/10 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                د پ
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">دکتر پارسا</h4>
                <p className="text-[11px] text-blue-700 dark:text-sky-300 font-body">بنیان‌گذار کلینیک تخصصی</p>
              </div>
            </div>
          </div>

          {/* کارت چهارم: عریض (Span 2 ستون) */}
          <div className="md:col-span-2 relative group rounded-3xl p-8 alpha-glass-control border border-slate-300/70 dark:border-blue-500/30 backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-sky-400 shadow-xl">
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-base sm:text-lg font-body text-slate-800 dark:text-slate-100 leading-relaxed">
                «پروژه طراحی وب‌سایت ما بسیار پیچیده بود، اما تیم آلفا گلو با تسلط کامل و حوصله زیاد، تمام درخواست‌های ما را پیاده‌سازی کردند. پشتیبانی بعد از تحویل کار نیز بی‌نظیر است.»
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-slate-200/80 dark:border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  ع ن
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">عرفان نیازی</h4>
                  <p className="text-xs text-blue-700 dark:text-sky-300 font-body">مدیر ارشد فنی آژانس دیجی‌رسانه</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                <CheckCircle2 size={14} /> طراحی وب‌سایت
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}