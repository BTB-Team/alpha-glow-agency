import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import logoWhite from '../assets/logo-white.svg';
import logoBlue from '../assets/logo-blue.svg';

// فقط آیکون‌های قطعی و سیستمی lucide-react
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { lang } = useParams();
  const { theme } = useStore();
  const currentLang = lang === 'en' ? 'en' : 'fa';
  const t = currentLang === 'en' ? en : fa;

  const quickLinks = [
    { to: `/${currentLang}`, label: t.nav?.home || (currentLang === 'fa' ? 'صفحه اصلی' : 'Home') },
    { to: `/${currentLang}/services`, label: t.nav?.services || (currentLang === 'fa' ? 'خدمات ما' : 'Services') },
    { to: `/${currentLang}/about`, label: t.nav?.about || (currentLang === 'fa' ? 'درباره ما' : 'About Us') },
    { to: `/${currentLang}/contact`, label: t.nav?.contact || (currentLang === 'fa' ? 'تماس با ما' : 'Contact Us') },
  ];

  const services = [
    { to: `/${currentLang}/services/branding`, label: currentLang === 'fa' ? 'طراحی هویت برند' : 'Brand Identity' },
    { to: `/${currentLang}/services/web-development`, label: currentLang === 'fa' ? 'طراحی و توسعه وب' : 'Web Development' },
    { to: `/${currentLang}/services/3d-design`, label: currentLang === 'fa' ? 'طراحی سه‌بعدی و موشن' : '3D & Motion' },
    { to: `/${currentLang}/services/marketing`, label: currentLang === 'fa' ? 'دیجیتال مارکتینگ' : 'Digital Marketing' },
  ];

  // آیکون‌های شبکه‌های اجتماعی به صورت SVG مستقیم و بدون باگ
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com',
      svg: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full mt-24 pb-8">
      <div className="container-custom">
        <div className="p-8 md:p-12 rounded-3xl glass-panel border border-blue-500/20 dark:border-white/10 transition-colors duration-300">
          
          {/* ستون‌های فوتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b border-slate-200/80 dark:border-white/10">
            
            {/* معرفی برند */}
            <div className="flex flex-col gap-4">
              <Link to={`/${currentLang}`} className="inline-block">
                <img
                  src={theme === 'dark' ? logoWhite : logoBlue}
                  alt="Alpha Glow Agency"
                  className="h-10 md:h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = logoWhite;
                  }}
                />
              </Link>
              <p className="font-body text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.footer?.slogan}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#213668] dark:text-white hover:bg-[#213668] hover:text-white dark:hover:bg-white dark:hover:text-[#213668] transition-all duration-200 shadow-sm"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>

            {/* لینک‌های سریع */}
            <div>
              {/* به جای font-heading قبلی */}
              <h3 className="text-[20px] font-black font-bold text-[#213668] dark:text-white mb-3 leading-[100%] tracking-normal">
                {t.footer?.quickLinks}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
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
              {/* به جای font-heading قبلی */}
              <h3 className="text-[20px] font-black font-bold text-[#213668] dark:text-white mb-3 text-[20px] font-black font-bold">
                {t.footer?.servicesTitle}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {services.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group flex items-center gap-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
                    >
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-90" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* تماس */}
            <div>
              {/* به جای font-heading قبلی */}
              <h3 className="text-[20px] font-black font-bold text-[#213668] dark:text-white mb-3 text-[20px] font-black font-bold">
                {t.footer?.contactTitle}
              </h3>
              <div className="flex flex-col gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{t.footer?.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <a href={`mailto:${t.footer?.email}`} className="hover:underline text-slate-700 dark:text-slate-200">
                    {t.footer?.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <a href={`tel:${t.footer?.phone}`} className="hover:underline text-slate-700 dark:text-slate-200 dir-ltr">
                    {t.footer?.phone}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* کپی‌رایت */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="text-center sm:text-start">
              © {new Date().getFullYear()} Alpha Glow Agency. {t.footer?.rights}
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                {currentLang === 'fa' ? 'حریم خصوصی' : 'Privacy Policy'}
              </span>
              <span>•</span>
              <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                {currentLang === 'fa' ? 'شرایط استفاده' : 'Terms of Service'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}