import { useParams } from 'react-router-dom';
import { Target, Eye } from 'lucide-react';
import fa from '../../locales/fa.json';
import en from '../../locales/en.json';
import AboutStats from '../home/AboutStats';

export default function AboutMissionVision() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const t = currentLang === 'en' ? en : fa;

  const data = t.aboutMissionVision;
  if (!data) return null;

  const cards = [
    {
      id: 'mission',
      icon: Target,
      title: data.mission.title,
      tag: data.mission.tag,
      description: data.mission.description,
    },
    {
      id: 'vision',
      icon: Eye,
      title: data.vision.title,
      tag: data.vision.tag,
      description: data.vision.description,
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      {/* هاله‌های نوری ملایم در پس‌زمینه */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto">
        
        {/* هدر سکشن */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.28em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {data.badge}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{data.titlePart1} </span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {data.titleHighlight}
            </span>
          </h2>
        </div>

        {/* شبکه دو ستونه کارت‌ها با کلاس alpha-glass-bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="alpha-glass-bar group relative rounded-[28px] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* هدر کارت: آیکون بزرگ و بولد بدون پس‌زمینه + عنوان */}
                  <div className="flex items-center gap-4 mb-6">
                    <IconComponent
                      size={64}
                      strokeWidth={2.5}
                      className="text-blue-700 dark:text-sky-400 shrink-0 transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="flex flex-col items-start text-start">
                      <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-sky-400 font-body mb-0.5">
                        {card.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* متن مینیمال کارت */}
                  <p className="font-body text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-[15px] leading-7 sm:leading-8 text-justify">
                    {card.description}
                  </p>
                </div>

                {/* خط دکوراتیو پایین کارت */}
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 mt-8 opacity-40 group-hover:w-20 group-hover:opacity-100 transition-all duration-500" />
              </div>
            );
          })}
        </div>
          <AboutStats/>
      </div>
    </section>
  );
}