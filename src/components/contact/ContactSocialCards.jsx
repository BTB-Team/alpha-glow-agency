import { useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import db from '../../../db.json';
const socialMeta = {
  instagram: {
    href: 'https://www.instagram.com/alpha.glow_agency?cplk=bXlucTI5YTNuZmcy&utm_source=qr',
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  facebook: {
    href: 'https://www.facebook.com/share/1FKwe3hVxv/?mibextid=wwXIfr',
    avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1877f2 60%, #1d4ed8 100%)',
    path: 'M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z',
  },
  linkedin: {
    href: 'https://www.linkedin.com/company/alpha-glow-agency/',
    avatarBg: 'linear-gradient(135deg, #38bdf8 0%, #0a66c2 55%, #004182 100%)',
    path: 'M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z',
  },
  telegram: {
    href: 'https://t.me/alphaglow_agency',
    avatarBg: 'linear-gradient(135deg, #38bdf8 0%, #26a5e4 55%, #0284c7 100%)',
    path: 'M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z',
  },
  whatsapp: {
    href: 'https://wa.me/message/5YJKPWGRTLRHD1',
    avatarBg: 'linear-gradient(135deg, #4ade80 0%, #25d366 55%, #15803d 100%)',
    path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
  },
};

export default function ContactSocialCards() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  const profiles = db?.socialProfiles || [];
  if (!profiles.length) return null;

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      {/* هاله‌های نوری ملایم پس‌زمینه */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-400/15 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* تیتر سکشن */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {isRTL ? 'شبکه‌های اجتماعی آلفا گلو' : 'OFFICIAL SOCIAL PROFILES'}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{isRTL ? 'ارتباط مستقیم با ' : 'Connect With '}</span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {isRTL ? 'آلفا گلو' : 'Alpha Glow'}
            </span>
          </h2>
        </div>

        {/* چیدمان Flex وسط‌چین با پشتیبانی کامل از لایت‌مد و دارک‌مد */}
        <div className="flex flex-wrap justify-center items-stretch gap-5 xl:gap-6 w-full">
          {profiles.map((item) => {
            const meta = socialMeta[item.id] || socialMeta.instagram;
            const targetUrl = meta.href || item.url;
            const title = item.title?.[currentLang] || item.title?.en || '';
            const subtitle = item.subtitle?.[currentLang] || item.subtitle?.en || '';
            const shortBio = (item.bio?.[currentLang] || item.bio?.en || [])[0] || '';
            const primaryBtn = item.primaryBtn?.[currentLang] || item.primaryBtn?.en || 'Follow';
            const secondaryBtn = item.secondaryBtn?.[currentLang] || item.secondaryBtn?.en || 'Message';

            return (
              <div
                key={item.id}
                dir="ltr"
                className="group relative w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[390px] min-w-0 rounded-[20px] p-4 sm:p-5 text-left transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/90 via-sky-50/80 to-blue-100/70 dark:from-[#213668]/80 dark:via-[#152347]/85 dark:to-[#0f172a]/92 text-[#213668] dark:text-white border border-sky-400/45 dark:border-sky-200/35 shadow-[0_14px_34px_-8px_rgba(33,54,104,0.14),0_0_20px_-4px_rgba(56,189,248,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.45),0_0_20px_-4px_rgba(56,189,248,0.28),inset_0_1px_1.5px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(56,189,248,0.3)]"
              >
                {/* خط نوری ظریف روی لبه بالایی و پایینی کارت */}
                <div
                  className="absolute inset-x-6 top-0 h-[1.5px] rounded-full opacity-85 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${item.accentFrom}, ${item.accentVia}, transparent)`,
                    boxShadow: `0 0 10px ${item.accentFrom}`,
                  }}
                />
                <div
                  className="absolute inset-x-10 bottom-0 h-[1px] rounded-full opacity-55 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${item.accentVia}, transparent)`,
                  }}
                />

                {/* هاله نوری ظریف گوشه بالا چپ متناسب با رنگ برند پلتفرم */}
                <div
                  className="absolute -top-10 -left-10 w-28 h-28 rounded-full blur-2xl opacity-20 dark:opacity-30 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${item.accentFrom}, transparent 70%)`,
                  }}
                />

                <div className="w-full min-w-0 relative z-10">
                  {/* ردیف بالا: لوگوی اختصاصی هر اپ در دایره پروفایل + نام و آمار */}
                  <div className="flex items-center gap-3.5 w-full min-w-0">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.platform}
                      className="relative shrink-0 p-[2px] rounded-full transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${item.accentFrom}, ${item.accentVia}, ${item.accentTo})`,
                        boxShadow: `0 0 14px -3px ${item.accentVia}`,
                      }}
                    >
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-white dark:border-slate-950/80 text-white shadow-inner"
                        style={{ backgroundImage: meta.avatarBg }}
                      >
                        <svg
                          className="w-6 h-6 sm:w-7 sm:h-7 fill-current drop-shadow-sm"
                          viewBox="0 0 24 24"
                        >
                          <path d={meta.path} />
                        </svg>
                      </div>
                    </a>

                    <div className="flex-1 min-w-0">
                      {/* نام کاربری و پلتفرم */}
                      <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
                        <span className="text-[11px] sm:text-xs font-extrabold tracking-wide uppercase text-[#213668] dark:text-white truncate">
                          {title}
                        </span>
                        <span className="text-blue-700 dark:text-sky-300 font-bold text-[10px] shrink-0 px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-white/10 border border-blue-500/15 dark:border-white/10">
                          {item.platform}
                        </span>
                      </div>

                      {/* آمار اکانت */}
                      <div className="flex items-center justify-between gap-2 mt-2 w-full">
                        {item.stats.map((stat, idx) => (
                          <div key={idx} className="flex flex-col items-start shrink-0">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">
                              {stat.value}
                            </span>
                            <span className="text-[9.5px] text-slate-500 dark:text-white/70 font-normal mt-0.5">
                              {stat.label?.[currentLang] || stat.label?.en}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* بخش میانی خلاصه شده: زیرعنوان + ۱ خط بایو */}
                  <div
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`mt-3 space-y-0.5 w-full ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <p className="text-[10.5px] font-bold text-blue-700 dark:text-sky-300 truncate">
                      {subtitle}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-white/85 leading-snug truncate">
                      {shortBio}
                    </p>
                  </div>
                </div>

                {/* دکمه‌های پایین کارت */}
                <div className="mt-3.5 pt-2.5 border-t border-blue-900/10 dark:border-white/10 flex items-center gap-2 w-full relative z-10">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-[9px] text-[11px] font-semibold text-white text-center transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-1 min-w-0 shadow-sm"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(14, 165, 233, 0.8))',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                    }}
                  >
                    <span className="truncate">{primaryBtn}</span>
                    <ArrowUpRight size={12} className="shrink-0" />
                  </a>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-[9px] text-[11px] font-semibold text-[#213668] dark:text-white/95 bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 border border-blue-900/15 dark:border-white/20 text-center transition-all duration-300 truncate min-w-0"
                  >
                    {secondaryBtn}
                  </a>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.platform}
                    className="w-7 h-7 rounded-[9px] bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 border border-blue-900/15 dark:border-white/20 flex items-center justify-center text-[#213668] dark:text-white shrink-0 transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d={meta.path} />
                    </svg>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}