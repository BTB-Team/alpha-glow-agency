import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import {
  Search,
  Menu,
  X,
  Home,
  Info,
  Briefcase,
  Layers,
  Mail,
  Languages,
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuContainerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useStore();
  const currentLang = lang === 'en' ? 'en' : 'fa';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const switchLanguage = (newLang) => {
    const currentScrollY = window.scrollY;
    sessionStorage.setItem('preserve_scroll_y', currentScrollY.toString());

    const pathWithoutLang = location.pathname.replace(/^\/(fa|en)/, '');
    navigate(`/${newLang}${pathWithoutLang || ''}`);
    setIsMenuOpen(false);
  };

  const navItems = [
    {
      id: 'home',
      to: `/${currentLang}`,
      label: t.nav?.home || (isRTL ? 'صفحه اصلی' : 'Home'),
      icon: Home,
      exact: true,
    },
    {
      id: 'about',
      to: `/${currentLang}/about`,
      label: t.nav?.about || (isRTL ? 'درباره ما' : 'About'),
      icon: Info,
    },
    {
      id: 'services',
      to: `/${currentLang}/services`,
      label: t.nav?.services || (isRTL ? 'خدمات' : 'Services'),
      icon: Briefcase,
    },
    {
      id: 'portfolio',
      to: `/${currentLang}/portfolio`,
      label: t.nav?.portfolio || (isRTL ? 'نمونه‌کارها' : 'Portfolio'),
      icon: Layers,
    },
    {
      id: 'contact',
      to: `/${currentLang}/contact`,
      label: t.nav?.contact || (isRTL ? 'تماس با ما' : 'Contact'),
      icon: Mail,
    },
  ];

  const isItemActive = (item) => {
    if (item.exact) {
      return (
        location.pathname === item.to ||
        location.pathname === `${item.to}/`
      );
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="alpha-glass-bar flex items-center justify-between px-5 py-3 rounded-full"
        >
          {/* لوگو با فیلتر درخشان سفید */}
          <Link
            to={`/${currentLang}`}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src={`${import.meta.env.BASE_URL}${theme === 'dark' ? 'logo-white.svg' : 'logo-white.svg'}`}
              alt="Alpha Glow Agency"
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-200 contrast-200"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.BASE_URL}logo.svg`;
              }}
            />
          </Link>

          {/* ابزارها و کنترل‌ها (تمامی متن‌ها و آیکون‌ها سفید خالص) */}
          <div className="flex items-center gap-2.5">
            <div
              dir={isRTL ? 'rtl' : 'ltr'}
              className="relative hidden sm:flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  t.common?.search || (isRTL ? 'جست‌وجو...' : 'Search...')
                }
                className={`alpha-glass-control w-36 lg:w-44 py-2 text-xs font-medium rounded-full text-white placeholder-white/75 focus:outline-none focus:w-52 focus:border-white/60 ${
                  isRTL ? 'pr-9 pl-3.5 text-right' : 'pl-9 pr-3.5 text-left'
                }`}
              />
              <Search
                size={15}
                className="text-white absolute pointer-events-none drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                style={isRTL ? { right: '14px' } : { left: '14px' }}
              />
            </div>

            {/* دکمه تم */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="alpha-glass-control group w-10 h-10 flex items-center justify-center rounded-full text-white active:scale-95"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-[19px] h-[19px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="4.6" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2.25a.9.9 0 01.9.9v1.8a.9.9 0 01-1.8 0v-1.8a.9.9 0 01.9-.9zm0 15.9a.9.9 0 01.9.9v1.8a.9.9 0 01-1.8 0v-1.8a.9.9 0 01.9-.9zM4.95 4.95a.9.9 0 011.273 0l1.273 1.273a.9.9 0 01-1.273 1.273L4.95 6.223a.9.9 0 010-1.273zm11.554 11.554a.9.9 0 011.273 0l1.273 1.273a.9.9 0 01-1.273 1.273l-1.273-1.273a.9.9 0 010-1.273zM2.25 12a.9.9 0 01.9-.9h1.8a.9.9 0 010 1.8h-1.8a.9.9 0 01-.9-.9zm15.9 0a.9.9 0 01.9-.9h1.8a.9.9 0 010 1.8h-1.8a.9.9 0 01-.9-.9zM6.223 16.504a.9.9 0 011.273 1.273L6.223 19.05a.9.9 0 01-1.273-1.273l1.273-1.273zm11.554-11.554a.9.9 0 011.273 1.273l-1.273 1.273a.9.9 0 01-1.273-1.273L17.777 4.95z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[17px] h-[17px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform duration-300 -rotate-12 group-hover:rotate-0 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.05 14.85a1 1 0 00-1.15-.23 7.5 7.5 0 01-9.28-9.28 1 1 0 00-1.18-1.29A9.5 9.5 0 1021.28 16a1 1 0 00-.23-1.15z" />
                </svg>
              )}
            </button>

            {/* دکمه زبان */}
            <button
              type="button"
              onClick={() => switchLanguage(isRTL ? 'en' : 'fa')}
              aria-label="Toggle Language"
              className="alpha-glass-control h-10 px-3.5 flex items-center gap-1.5 rounded-full text-xs font-bold text-white active:scale-95"
            >
              <Languages size={15} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              <span className="uppercase tracking-wider font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                {isRTL ? 'EN' : 'فا'}
              </span>
            </button>

            {/* دکمه منو */}
            <div className="relative" ref={menuContainerRef}>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-controls="alpha-floating-nav"
                className={`alpha-glass-control w-10 h-10 flex items-center justify-center rounded-full text-white active:scale-95 ${
                  isMenuOpen
                    ? 'border-white/60 bg-white/20'
                    : ''
                }`}
              >
                {isMenuOpen ? <X size={19} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" /> : <Menu size={19} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />}
              </button>

              {/* پنل منوی عمودی */}
              <nav
                id="alpha-floating-nav"
                dir={isRTL ? 'rtl' : 'ltr'}
                aria-label={isRTL ? 'منوی اصلی' : 'Main Navigation'}
                aria-hidden={!isMenuOpen}
                className={`alpha-glass-dropdown absolute top-full mt-3 w-[235px] max-w-[calc(100vw-2rem)] p-2 rounded-2xl z-50 transition-all duration-200 ease-out ${
                  isRTL
                    ? 'left-0 origin-top-left'
                    : 'right-0 origin-top-right'
                } ${
                  isMenuOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                }`}
              >
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isItemActive(item);

                    return (
                      <li key={item.id}>
                        <Link
                          to={item.to}
                          tabIndex={isMenuOpen ? 0 : -1}
                          onClick={() => setIsMenuOpen(false)}
                          className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                            active
                              ? 'bg-white/20 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                              : 'text-white/85 font-semibold hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {active && (
                            <span
                              aria-hidden="true"
                              className={`w-1 h-5 rounded-full bg-gradient-to-b from-white to-indigo-300 shadow-[0_0_8px_rgba(255,255,255,0.9)] ${
                                isRTL ? '-mr-1.5' : '-ml-1.5'
                              }`}
                            />
                          )}
                          <IconComponent
                            size={17}
                            className={
                              active
                                ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                                : 'text-white/80'
                            }
                          />
                          <span className="tracking-wide text-white">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}