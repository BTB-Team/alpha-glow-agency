import { useParams } from 'react-router-dom';
import aboutStoryImg from '../../assets/images/about/about-story.webp';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';

export default function AboutStory() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const t = currentLang === 'en' ? en : fa;

  const story = t.aboutStory;
  if (!story) return null;

  // تابع هوشمند برای تغییر رنگ اعداد و ارقام بسته به تم صفحه
  const highlightNumbers = (text) => {
    if (!text) return null;
    const splitRegex = /([0-9۰-۹٠-٩]+|\b(?:دو|سه|two|three)\b)/gi;
    const matchRegex = /^([0-9۰-۹٠-٩]+|دو|سه|two|three)$/i;
    const parts = text.split(splitRegex);

    return parts.map((part, index) =>
      matchRegex.test(part) ? (
        <span
          key={index}
          className="font-bold text-blue-600 dark:text-sky-400 px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-white dark:bg-[#030712] transition-colors duration-500">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        
        {/* هدر سکشن */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {story.badge}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{story.titlePart1} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {story.titleHighlight}
            </span>
          </h2>
        </div>

        {/* تصویر اصلی در بالای متن (بزرگ و در مرکز توجه) */}
        <div className="w-full flex justify-center mb-12 md:mb-16">
          <img
            src={aboutStoryImg}
            alt={story.titleHighlight}
            className="w-full max-w-2xl md:max-w-3xl h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* بخش متون داستان (تک‌ستونه، صاف و با فاصله‌گذاری استاندارد) */}
        <div className="max-w-[1220px] mx-auto flex flex-col items-start text-start">
          
          {/* جمله آغازین */}
          <p className="w-full text-base sm:text-lg md:text-xl font-bold font-heading text-slate-900 dark:text-white border-s-4 border-blue-600 dark:border-sky-400 ps-4 mb-8 leading-relaxed">
            {story.lead}
          </p>

          {/* پاراگراف‌ها با تراز صاف و فاصله عمودی راحت برای اسکرین‌های کوچک و بزرگ */}
          <div className="w-full space-y-5 sm:space-y-6">
            {story.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-body text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-8 sm:leading-9 text-justify"
              >
                {highlightNumbers(paragraph)}
              </p>
            ))}
          </div>

          {/* شعار پایانی جداشده با استایل هدینگ و رنگ گرادیان پروژه */}
          <div className="w-full mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black font-heading leading-snug bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent">
              {story.closing}
            </h3>
          </div>

        </div>

      </div>
    </section>
  );
}