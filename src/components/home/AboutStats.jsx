import { useParams } from 'react-router-dom';
import { Briefcase, Layers, Users, Calendar } from 'lucide-react';
import db from '../../../db.json';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

const iconMap = {
  Briefcase,
  Layers,
  Users,
  Calendar,
};

export default function AboutStats() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const t = currentLang === 'en' ? en : fa;

  const stats = db?.about?.stats || [];

  return (
    /* grid-cols-2 برای حفظ چیدمان دو ستونه در موبایل و lg:grid-cols-4 برای دسکتاپ */
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full mt-12 md:mt-16">
      {stats.map((stat) => {
        const StatIcon = iconMap[stat.icon] || Briefcase;
        const label = t.homeAbout?.stats?.[stat.id];

        return (
          <div
            key={stat.id}
            className="alpha-glass-control alpha-bottom-lamp group rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between gap-2.5 sm:gap-4 cursor-pointer"
          >
            {/* عدد و عنوان */}
            <div className="relative z-10 flex flex-col items-start text-start min-w-0">
              <span
                dir="ltr"
                className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent leading-none mb-1 sm:mb-1.5"
              >
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-bold font-body text-slate-700 dark:text-slate-200 group-hover:text-blue-950 dark:group-hover:text-white transition-colors duration-300 leading-snug">
                {label}
              </span>
            </div>

            {/* آیکن هماهنگ با استایل شیشه‌ای */}
            <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl alpha-glass-control flex items-center justify-center text-blue-800 dark:text-sky-300 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <StatIcon className="w-4 h-4 sm:w-[19px] sm:h-[19px]" strokeWidth={1.8} />
            </div>
          </div>
        );
      })}
    </div>
  );
}