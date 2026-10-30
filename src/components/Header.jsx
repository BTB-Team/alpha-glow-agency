import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import { Sun, Moon, Search, Menu, X, ChevronDown, Home, Briefcase, Info, Mail, ArrowLeft, ArrowRight, Languages } from 'lucide-react';
import logoWhite from '../assets/images/logo-white.svg';
import logoBlue from '../assets/images/logo-blue.svg';
// import logoDefault from '../assets/logo.svg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useStore();
  const currentLang = lang === 'en' ? 'en' : 'fa';
  const t = currentLang === 'en' ? en : fa;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLang) => {
    // حفظ موقعیت فعلی اسکرول پیش از جابه‌جایی مسیر
    const currentScrollY = window.scrollY;
    sessionStorage.setItem('preserve_scroll_y', currentScrollY.toString());

    const pathWithoutLang = location.pathname.replace(/^\/(fa|en)/, '');
    navigate(`/${newLang}${pathWithoutLang || ''}`);
    setIsMenuOpen(false);
  };
  

  const serviceSubItems = [
    { to: `/${currentLang}/services/branding`, label: currentLang === 'fa' ? 'طراحی هویت برند' : 'Brand Identity' },
    { to: `/${currentLang}/services/web-development`, label: currentLang === 'fa' ? 'طراحی و توسعه وب' : 'Web Development' },
    { to: `/${currentLang}/services/3d-design`, label: currentLang === 'fa' ? 'طراحی سه‌بعدی و موشن' : '3D & Motion Design' },
    { to: `/${currentLang}/services/marketing`, label: currentLang === 'fa' ? 'دیجیتال مارکتینگ' : 'Digital Marketing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full py-4">
      <div className="container-custom">
        <div dir="ltr" className="flex items-center justify-between px-5 py-3 rounded-2xl glass-panel border border-blue-500/20 dark:border-white/10 transition-colors duration-300">
          <img
            src={theme === 'dark' ? logoWhite : logoBlue}
            alt="Alpha Glow Agency"
            className="h-11 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            // onError={(e) => { e.currentTarget.src = logoDefault; }}
          />

          {/* ابزارها و دکمه‌ها */}
          <div className="flex items-center gap-2.5">
            {/* جست‌وجو */}
            <div dir={currentLang === 'fa' ? 'rtl' : 'ltr'} className="relative hidden sm:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common?.search || (currentLang === 'fa' ? 'جست‌وجو...' : 'Search...')}
                className={`w-36 lg:w-48 py-2 text-xs rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-blue-500/20 dark:border-white/10 text-alpha-blue dark:text-white placeholder-slate-400 focus:outline-none focus:w-56 focus:border-alpha-blue dark:focus:border-blue-400 transition-all duration-300 ${currentLang === 'fa' ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'}`}
              />
              <Search size={16} className={`text-blue-900/60 dark:text-slate-300 absolute pointer-events-none ${currentLang === 'fa' ? 'right-3' : 'left-3'}`} />
            </div>

            {/* ۱. تغییر تم با پس‌زمینه آبی اختصاصی در لایت‌مد */}
            <button onClick={toggleTheme} aria-label="Toggle Theme" className="w-10 h-10 flex items-center justify-center rounded-xl bg-alpha-blue dark:bg-white/10 text-white dark:text-amber-300 border border-blue-400/30 dark:border-white/10 transition-all duration-200 active:scale-95 shadow-md shadow-alpha-blue/15">
              {theme === 'dark' ? <Sun size={18} className="transition-transform rotate-0 hover:rotate-45" /> : <Moon size={18} className="transition-transform -rotate-12 hover:rotate-0" />}
            </button>

            {/* ۲. تغییر زبان با پس‌زمینه آبی اختصاصی در لایت‌مد */}
            <button onClick={() => switchLanguage(currentLang === 'fa' ? 'en' : 'fa')} aria-label="Toggle Language" className="h-10 px-3 flex items-center gap-2 rounded-xl bg-alpha-blue dark:bg-white/10 text-white border border-blue-400/30 dark:border-white/10 transition-all duration-200 active:scale-95 shadow-md shadow-alpha-blue/15 text-xs font-medium">
              <Languages size={16} className="text-white" />
              <span className="uppercase text-white tracking-wider font-bold">{currentLang === 'fa' ? 'EN' : 'فا'}</span>
            </button>

            {/* ۳. منوی همبرگری موبایل با پس‌زمینه آبی اختصاصی در لایت‌مد */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu" className="w-10 h-10 flex items-center justify-center rounded-xl bg-alpha-blue dark:bg-white/10 text-white border border-blue-400/30 dark:border-white/10 transition-all duration-200 active:scale-95 shadow-md shadow-alpha-blue/15">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {isMenuOpen && (
                <div dir={currentLang === 'fa' ? 'rtl' : 'ltr'} className="absolute right-0 top-full mt-3 w-64 p-2 rounded-2xl menu-solid-panel animate-menu-enter z-50 bg-white dark:bg-[#1a2642] shadow-xl border border-slate-200 dark:border-white/5">
                  <div className="flex flex-col gap-1">
                    <Link to={`/${currentLang}`} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === `/${currentLang}` ? 'bg-alpha-blue text-white dark:bg-white dark:text-alpha-blue shadow-sm' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                      <Home size={18} />
                      <span>{t.nav?.home || (currentLang === 'fa' ? 'صفحه اصلی' : 'Home')}</span>
                    </Link>

                    <div>
                      <button onClick={() => setIsServicesOpen(!isServicesOpen)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname.includes('/services') ? 'bg-blue-50 dark:bg-white/10 text-blue-900 dark:text-blue-300' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                        <div className="flex items-center gap-3">
                          <Briefcase size={18} />
                          <span>{t.nav?.services || (currentLang === 'fa' ? 'خدمات' : 'Services')}</span>
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isServicesOpen && (
                        <div className="mt-1 mr-4 ml-4 flex flex-col gap-1 border-r-2 border-slate-300 dark:border-white/20 pr-2">
                          <Link to={`/${currentLang}/services`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-300 hover:underline">
                            <span>{currentLang === 'fa' ? 'مشاهده همه خدمات' : 'View All Services'}</span>
                            {currentLang === 'fa' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                          </Link>
                          {serviceSubItems.map((subItem) => (
                            <Link key={subItem.to} to={subItem.to} onClick={() => setIsMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium">
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link to={`/${currentLang}/about`} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === `/${currentLang}/about` ? 'bg-alpha-blue text-white dark:bg-white dark:text-alpha-blue shadow-sm' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                      <Info size={18} />
                      <span>{t.nav?.about || (currentLang === 'fa' ? 'درباره ما' : 'About Us')}</span>
                    </Link>

                    <Link to={`/${currentLang}/contact`} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === `/${currentLang}/contact` ? 'bg-alpha-blue text-white dark:bg-white dark:text-alpha-blue shadow-sm' : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                      <Mail size={18} />
                      <span>{t.nav?.contact || (currentLang === 'fa' ? 'تماس با ما' : 'Contact Us')}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}


