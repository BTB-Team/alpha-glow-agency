import { useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import db from '../../../db.json';
// import founderImg from '../../assets/images/about/founder.webp';
import founderImg from '../../assets/images/about/founder-2.webp';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

const imageMap = {
  founder: founderImg,
};

export default function AboutFounder() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const founder = db?.founder;
  if (!founder) return null;

  const sectionHeader = t.aboutFounderSection;
  const name = founder.name?.[currentLang] || founder.name?.en || '';
  const role = founder.role?.[currentLang] || founder.role?.en || '';
  const bioParagraphs = founder.bio?.[currentLang] || founder.bio?.en || [];
  const visionQuote = founder.visionQuote?.[currentLang] || founder.visionQuote?.en || '';

  // استفاده از عکس ایمپورت‌شده (و پشتیبانی از عکس آپلودشده در پنل ادمین)
  const resolvedImage =
    imageMap[founder.image] ||
    (founder.image?.startsWith('data:') || founder.image?.startsWith('http')
      ? founder.image
      : founderImg);

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-white dark:bg-[#030712] transition-colors duration-500">
      {/* هاله‌های نوری ملایم پس‌زمینه */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto">
        
        {/* هدر سکشن */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {sectionHeader?.badge || (isRTL ? 'رهبری و خلاقیت' : 'FOUNDER')}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{sectionHeader?.titlePart1 || (isRTL ? 'معرفی' : 'Meet the')} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {sectionHeader?.titleHighlight || (isRTL ? 'بنیان گذار' : 'Founder')}
            </span>
          </h2>
        </div>

        {/* چیدمان دو ستونه: تصویر بنیان‌گذار و محتوای متنی */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ستون تصویر */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md group">
              <div className="alpha-glass-bar relative rounded-[32px] p-3 sm:p-4 overflow-hidden shadow-xl">
                <div className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={resolvedImage}
                    alt={name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030712]/70 via-[#030712]/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ستون متن معرفی */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
                {name}
              </h3>
              <span className="text-2xl sm:text-3xl font-light text-slate-300 dark:text-slate-700">
                |
              </span>
              <span className="text-base sm:text-lg md:text-xl font-bold font-heading bg-gradient-to-r from-blue-700 to-sky-500 dark:from-sky-300 dark:to-sky-500 bg-clip-text text-transparent">
                {role}
              </span>
            </div>

            <div className="space-y-4 mb-8 w-full">
              {bioParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-body text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-[15px] leading-7 sm:leading-8 text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {visionQuote && (
              <div className="alpha-glass-bar w-full rounded-[24px] p-6 sm:p-8 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <Sparkles
                    size={34}
                    strokeWidth={2.5}
                    className="text-blue-700 dark:text-sky-400 shrink-0 mt-1"
                  />
                  <p className="font-body font-medium text-slate-800 dark:text-slate-100 text-xs sm:text-sm md:text-[15px] leading-7 sm:leading-8 text-justify">
                    {visionQuote}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}