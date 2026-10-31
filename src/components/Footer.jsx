import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import fa from '../locales/fa.json';
import en from '../locales/en.json';

// آیکون‌های سیستم و ارتباطی
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { lang } = useParams();
  const { theme } = useStore();
  // تنظیم زبان پیش‌فرض روی انگلیسی (en)
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const quickLinks = [
    { to: `/${currentLang}`, label: t.nav?.home || (isRTL ? 'صفحه اصلی' : 'Home') },
    { to: `/${currentLang}/services`, label: t.nav?.services || (isRTL ? 'خدمات ما' : 'Services') },
    { to: `/${currentLang}/about`, label: t.nav?.about || (isRTL ? 'درباره ما' : 'About Us') },
    { to: `/${currentLang}/contact`, label: t.nav?.contact || (isRTL ? 'تماس با ما' : 'Contact Us') },
  ];

  const services = [
    { to: `/${currentLang}/services/branding`, label: isRTL ? 'طراحی هویت برند' : 'Brand Identity' },
    { to: `/${currentLang}/services/web-development`, label: isRTL ? 'طراحی و توسعه وب' : 'Web Development' },
    { to: `/${currentLang}/services/3d-design`, label: isRTL ? 'طراحی سه‌بعدی و موشن' : '3D & Motion' },
    { to: `/${currentLang}/services/marketing`, label: isRTL ? 'دیجیتال مارکتینگ' : 'Digital Marketing' },
  ];

  // لینک‌های واقعی شبکه‌های اجتماعی آژانس
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/alpha.glow_agency?cplk=bXlucTI5YTNuZmcy&utm_source=qr',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/1FKwe3hVxv/?mibextid=wwXIfr',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/alpha-glow-agency/',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: 'https://t.me/alphaglow_agency',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.195 1.006.131.832.941z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/message/5YJKPWGRTLRHD1',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full mt-28 pb-12">
      <div className="container-custom">
        {/* بدنه فوتر با استایل شیشه‌ای کریستالی هماهنگ با هدر */}
        <div className="alpha-glass-bar p-8 md:p-12 rounded-[2.5rem] transition-colors duration-300">
          
          {/* ستون‌های فوتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b border-[#213668]/15 dark:border-white/10">
            
            {/* معرفی برند و لوگو */}
            <div className="flex flex-col gap-4">
              <Link to={`/${currentLang}`} className="inline-block">
                <img
                  src={`${import.meta.env.BASE_URL}${theme === 'dark' ? 'logo-white.svg' : 'logo-blue.svg'}`}
                  alt="Alpha Glow Agency"
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = `${import.meta.env.BASE_URL}logo.svg`;
                  }}
                />
              </Link>
              <p className="font-body text-xs md:text-sm text-[#213668]/85 dark:text-slate-300 leading-relaxed">
                {t.footer?.slogan}
              </p>
              
              {/* شبکه‌های اجتماعی با دکمه‌های شیشه‌ای */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="alpha-glass-control w-9 h-9 rounded-xl flex items-center justify-center text-[#213668] dark:text-white hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>

            {/* لینک‌های سریع */}
            <div>
              <h3 className="text-[18px] font-black font-bold text-[#213668] dark:text-white mb-4 tracking-normal">
                {t.footer?.quickLinks || (isRTL ? 'لینک‌های سریع' : 'Quick Links')}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#213668]/80 dark:text-slate-300 hover:text-[#213668] dark:hover:text-white transition-colors"
                    >
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-90" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* خدمات */}
            <div>
              <h3 className="text-[18px] font-black font-bold text-[#213668] dark:text-white mb-4">
                {t.footer?.servicesTitle || (isRTL ? 'خدمات ما' : 'Services')}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {services.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#213668]/80 dark:text-slate-300 hover:text-[#213668] dark:hover:text-white transition-colors"
                    >
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-90" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* اطلاعات تماس */}
            <div>
              <h3 className="text-[18px] font-black font-bold text-[#213668] dark:text-white mb-4">
                {t.footer?.contactTitle || (isRTL ? 'ارتباط با ما' : 'Contact Us')}
              </h3>
              <div className="flex flex-col gap-3 text-xs md:text-sm text-[#213668]/85 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-[#213668] dark:text-blue-400 shrink-0" />
                  <span>{t.footer?.address || (isRTL ? 'کابل، افغانستان' : 'Kabul, Afghanistan')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[#213668] dark:text-blue-400 shrink-0" />
                  <a href="mailto:alphaglowagency@gmail.com" className="hover:underline text-[#213668] dark:text-slate-200">
                    alphaglowagency@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-[#213668] dark:text-blue-400 shrink-0" />
                  <a href="tel:0794300565" className="hover:underline text-[#213668] dark:text-slate-200 dir-ltr">
                    0794300565
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* کپی‌رایت پایین فوتر */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-[#213668]/75 dark:text-slate-400">
            <p className="text-center sm:text-start">
              © {new Date().getFullYear()} Alpha Glow Agency. {t.footer?.rights || (isRTL ? 'تمامی حقوق محفوظ است.' : 'All rights reserved.')}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}