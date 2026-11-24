import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import db from '../../db.json';
import fa from '../locales/fa.json';
import en from '../locales/en.json';
import { searchSiteContent, resolveSearchImage } from '../utils/searchEngine';
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
  ArrowUpLeft,
  ArrowUpRight,
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResultIdx, setActiveResultIdx] = useState(-1);

  const menuContainerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);
  const searchMobileBtnRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useStore();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';
  const t = currentLang === 'en' ? en : fa;

  const ts = {
    placeholder:
      t.search?.placeholder ||
      t.common?.search ||
      (isRTL ? 'جست‌وجو در خدمات و نمونه‌کارها...' : 'Search services & portfolio...'),
    servicesTitle: t.search?.servicesTitle || (isRTL ? 'خدمات مرتبط' : 'Services'),
    portfolioTitle: t.search?.portfolioTitle || (isRTL ? 'نمونه‌کارها' : 'Portfolio'),
    quickSuggestions:
      t.search?.quickSuggestions || (isRTL ? 'پیشنهادهای سریع' : 'Quick Suggestions'),
    noResults:
      t.search?.noResults ||
      (isRTL ? 'موردی با این عبارت پیدا نشد.' : 'No matching services or projects found.'),
    viewAllResults:
      t.search?.viewAllResults ||
      (isRTL ? 'مشاهده همه نتایج برای' : 'View all results for'),
  };

  const getLocalized = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[currentLang] || field.en || '' : field;
  };

  const searchResults = useMemo(() => searchSiteContent(searchQuery), [searchQuery]);

  const flatResults = useMemo(
    () => [
      ...searchResults.services.map((item) => ({ type: 'service', item })),
      ...searchResults.portfolio.slice(0, 6).map((item) => ({ type: 'portfolio', item })),
    ],
    [searchResults]
  );

  const hasQuery = searchQuery.trim().length > 0;
  const totalMatches = searchResults.services.length + searchResults.portfolio.length;
  const ActionArrow = isRTL ? ArrowUpLeft : ArrowUpRight;

  // بستن منو و پاک کردن متن سرچ هنگام کلیک بیرون از سرچ‌بار
  useEffect(() => {
    function handlePointerDown(event) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      const insideDesktopSearch =
        searchDesktopRef.current && searchDesktopRef.current.contains(event.target);
      const insideMobileSearch =
        searchMobileRef.current && searchMobileRef.current.contains(event.target);
      const insideMobileSearchBtn =
        searchMobileBtnRef.current && searchMobileBtnRef.current.contains(event.target);

      if (!insideDesktopSearch && !insideMobileSearch && !insideMobileSearchBtn) {
        setIsSearchOpen(false);
        setActiveResultIdx(-1);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  // بستن با کلید Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (isMenuOpen) {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setActiveResultIdx(-1);
          setSearchQuery('');
          desktopInputRef.current?.blur();
          mobileInputRef.current?.blur();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isSearchOpen]);

  // بستن منوها هنگام تغییر مسیر
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setActiveResultIdx(-1);
  }, [location.pathname, location.search]);

  useEffect(() => {
    setActiveResultIdx(-1);
  }, [searchQuery]);

  const switchLanguage = (newLang) => {
    const currentScrollY = window.scrollY;
    sessionStorage.setItem('preserve_scroll_y', currentScrollY.toString());

    const pathWithoutLang = location.pathname.replace(/^\/(fa|en)/, '');
    navigate(`/${newLang}${pathWithoutLang || ''}${location.search}`);
    setIsMenuOpen(false);
  };

  const handleSelectResult = (entry) => {
    setIsSearchOpen(false);
    setActiveResultIdx(-1);
    setSearchQuery('');

    if (entry.type === 'service') {
      navigate(`/${currentLang}/services?category=${encodeURIComponent(entry.item.slug)}`);
      return;
    }

    if (entry.type === 'portfolio') {
      navigate(`/${currentLang}/portfolio?project=${encodeURIComponent(entry.item.slug)}`);
    }
  };

  const handleSubmitSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearchOpen(false);
    setActiveResultIdx(-1);
    setSearchQuery('');

    if (searchResults.portfolio.length === 0 && searchResults.services.length > 0) {
      navigate(
        `/${currentLang}/services?category=${encodeURIComponent(searchResults.services[0].slug)}`
      );
      return;
    }

    navigate(`/${currentLang}/portfolio?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setActiveResultIdx((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setActiveResultIdx((prev) => (prev <= 0 ? flatResults.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeResultIdx >= 0 && flatResults[activeResultIdx]) {
        handleSelectResult(flatResults[activeResultIdx]);
      } else {
        handleSubmitSearch();
      }
    }
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
      return location.pathname === item.to || location.pathname === `${item.to}/`;
    }
    return location.pathname.startsWith(item.to);
  };

  // بدنه مشترک لیست نتایج با سایز کنترل‌شده و رنگ‌بندی کامل لایت/دارک
  const renderSearchResultsBody = () => {
    if (!hasQuery) {
      const quickServices = db?.services || [];
      return (
        <div className="p-3.5">
          <p className="font-body !text-[12px] !leading-tight font-bold uppercase tracking-wider text-sky-300 mb-2.5 px-1">
            {ts.quickSuggestions}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickServices.map((srv) => {
              const label = getLocalized(srv.title);
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSearchQuery(label)}
                  className="px-3 py-1.5 rounded-full !text-[13px] !leading-snug font-medium bg-slate-100 hover:bg-blue-950 text-slate-800 hover:text-white border border-slate-200 dark:bg-white/10 dark:hover:bg-sky-400/25 dark:text-slate-100 dark:border-white/15 dark:hover:border-sky-300/50 transition-colors cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (totalMatches === 0) {
      return (
        <div className="py-7 px-4 text-center">
          <p className="!text-[14px] !leading-relaxed text-slate-600 dark:text-slate-300">
            {ts.noResults}
          </p>
        </div>
      );
    }

    let runningIndex = 0;

    return (
      <div className="max-h-[65vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-2.5 space-y-3">
        {/* گروه ۱: خدمات مرتبط */}
        {searchResults.services.length > 0 && (
          <div>
            <p className="px-2.5 pb-1.5 font-body !text-[12px] !leading-tight font-bold uppercase tracking-wider text-blue-900 dark:text-sky-300">
              {ts.servicesTitle}
            </p>
            <ul className="space-y-1">
              {searchResults.services.map((service) => {
                const itemIdx = runningIndex++;
                const isHighlighted = activeResultIdx === itemIdx;
                const title = getLocalized(service.title);
                const desc = getLocalized(service.shortDescription);
                const imgSrc = resolveSearchImage(service.mainImage, 'services');

                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveResultIdx(itemIdx)}
                      onClick={() => handleSelectResult({ type: 'service', item: service })}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-start transition-all duration-150 cursor-pointer border ${
                        isHighlighted
                          ? 'bg-blue-50 border-blue-200 dark:bg-sky-500/20 dark:border-cyan-300/50'
                          : 'bg-transparent hover:bg-slate-100/80 dark:hover:bg-white/10 border-transparent'
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
                        <Briefcase size={16} className="text-blue-900 dark:text-sky-300" />
                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={title}
                            onError={(e) => {
                              if (!e.currentTarget.dataset.fallbackTried) {
                                e.currentTarget.dataset.fallbackTried = 'true';
                                e.currentTarget.src = `/images/${service.mainImage}`;
                              } else {
                                e.currentTarget.style.display = 'none';
                              }
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-body font-bold !text-[16px] !leading-snug text-slate-900 dark:text-white truncate">
                          {title}
                        </p>
                        <p className="!text-[13px] !leading-snug text-slate-600 dark:text-slate-300 truncate mt-0.5">
                          {desc}
                        </p>
                      </div>

                      <ActionArrow
                        size={15}
                        className="text-blue-900 dark:text-sky-300 shrink-0 opacity-80"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* گروه ۲: نمونه‌کارهای مرتبط */}
        {searchResults.portfolio.length > 0 && (
          <div>
            <p className="px-2.5 pb-1.5 font-body !text-[12px] !leading-tight font-bold uppercase tracking-wider text-blue-900 dark:text-sky-300">
              {ts.portfolioTitle}
            </p>
            <ul className="space-y-1">
              {searchResults.portfolio.slice(0, 6).map((project) => {
                const itemIdx = runningIndex++;
                const isHighlighted = activeResultIdx === itemIdx;
                const title = getLocalized(project.title);
                const client = getLocalized(project.client);
                const catLabel =
                  t.portfolioPage?.categories?.[project.category] || project.category;
                const imgSrc = resolveSearchImage(project.mainImage, 'portfolio');

                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveResultIdx(itemIdx)}
                      onClick={() => handleSelectResult({ type: 'portfolio', item: project })}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-start transition-all duration-150 cursor-pointer border ${
                        isHighlighted
                          ? 'bg-blue-50 border-blue-200 dark:bg-sky-500/20 dark:border-cyan-300/50'
                          : 'bg-transparent hover:bg-slate-100/80 dark:hover:bg-white/10 border-transparent'
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
                        <Layers size={16} className="text-blue-900 dark:text-sky-300" />
                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={title}
                            onError={(e) => {
                              if (!e.currentTarget.dataset.fallbackTried) {
                                e.currentTarget.dataset.fallbackTried = 'true';
                                e.currentTarget.src = `/images/${project.mainImage}`;
                              } else {
                                e.currentTarget.style.display = 'none';
                              }
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-body font-bold !text-[16px] !leading-snug text-slate-900 dark:text-white truncate">
                          {title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 !text-[13px] !leading-snug text-slate-600 dark:text-slate-300 truncate">
                          <span className="text-sky-300 font-semibold shrink-0">
                            {catLabel}
                          </span>
                          <span>•</span>
                          <span className="truncate">{client}</span>
                        </div>
                      </div>

                      <ActionArrow
                        size={15}
                        className="text-blue-900 dark:text-sky-300 shrink-0 opacity-80"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* دکمه مشاهده همه نتایج روی صفحه پورتفولیو */}
        {searchResults.portfolio.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-white/15">
            <button
              type="button"
              onClick={handleSubmitSearch}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl !text-[14px] !leading-snug font-semibold text-blue-900 hover:bg-slate-100 dark:text-sky-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="truncate">
                {ts.viewAllResults} «{searchQuery.trim()}»
              </span>
              <ActionArrow size={15} className="shrink-0" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="alpha-glass-bar flex items-center justify-between px-5 py-3"
        >
          {/* لوگو */}
          <Link
            to={`/${currentLang}`}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo-white.svg`}
              alt="Alpha Glow Agency"
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-200 contrast-200"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.BASE_URL}logo.svg`;
              }}
            />
          </Link>

          {/* ابزارها و کنترل‌ها */}
              <div className="flex items-center gap-2.5">
            {/* سرچ‌بار دسکتاپ و تبلت */}
            <div
              ref={searchDesktopRef}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="relative hidden sm:flex items-center"
            >
              <input
                ref={desktopInputRef}
                type="text"
                spellCheck={false}
                value={searchQuery}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={t.common?.search || (isRTL ? 'جست‌وجو...' : 'Search...')}
                className={`alpha-glass-control py-2 !text-[14px] !leading-normal font-medium rounded-full text-white placeholder:text-white/75 caret-white focus:outline-none focus:border-white/60 transition-all duration-300 ${
                  isSearchOpen || hasQuery ? 'w-56 lg:w-64' : 'w-36 lg:w-44'
                } ${isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'}`}
              />
              <Search
                size={15}
                className="text-white absolute pointer-events-none drop-shadow-[0_0_5px_rgba(255,255,255,0.65)]"
                style={isRTL ? { right: '14px' } : { left: '14px' }}
              />

              {hasQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    desktopInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute text-white/80 hover:text-white transition-colors cursor-pointer"
                  style={isRTL ? { left: '11px' } : { right: '11px' }}
                >
                  <X size={14} />
                </button>
              )}

              {/* پنل نتایج زنده دسکتاپ (همیشه خوانا با متن سفید در هر دو تم) */}
              <div
                dir={isRTL ? 'rtl' : 'ltr'}
                aria-hidden={!isSearchOpen}
                className={`alpha-glass-dropdown absolute top-full mt-3 w-[350px] lg:w-[400px] rounded-2xl z-50 transition-all duration-200 ease-out !bg-[#091229]/95 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_22px_55px_rgba(2,6,23,0.85)] text-white ${
                  isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                } ${
                  isSearchOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                }`}
              >
                {renderSearchResultsBody()}
              </div>
            </div>

            {/* دکمه سرچ مخصوص موبایل (< sm) */}
            <button
              ref={searchMobileBtnRef}
              type="button"
              onClick={() => {
                const nextState = !isSearchOpen;
                setIsSearchOpen(nextState);
                setIsMenuOpen(false);
                if (!nextState) {
                  setSearchQuery('');
                  setActiveResultIdx(-1);
                } else {
                  setTimeout(() => mobileInputRef.current?.focus(), 60);
                }
              }}
              aria-label="Search"
              className={`sm:hidden alpha-glass-control w-10 h-10 flex items-center justify-center rounded-full text-white active:scale-95 ${
                isSearchOpen ? 'border-white/60 bg-white/20' : ''
              }`}
            >
              {isSearchOpen ? (
                <X size={18} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              ) : (
                <Search
                  size={17}
                  className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                />
              )}
            </button>

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
              <Languages
                size={15}
                className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              />
              <span className="uppercase tracking-wider font-bold text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                {isRTL ? 'EN' : 'فا'}
              </span>
            </button>

            {/* دکمه منو */}
            <div className="relative" ref={menuContainerRef}>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-controls="alpha-floating-nav"
                className={`alpha-glass-control w-10 h-10 flex items-center justify-center rounded-full text-white active:scale-95 ${
                  isMenuOpen ? 'border-white/60 bg-white/20' : ''
                }`}
              >
                {isMenuOpen ? (
                  <X
                    size={19}
                    className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  />
                ) : (
                  <Menu
                    size={19}
                    className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>

              <nav
                id="alpha-floating-nav"
                dir={isRTL ? 'rtl' : 'ltr'}
                aria-label={isRTL ? 'منوی اصلی' : 'Main Navigation'}
                aria-hidden={!isMenuOpen}
                className={`alpha-glass-dropdown absolute top-full mt-3 w-[235px] max-w-[calc(100vw-2rem)] p-2 rounded-2xl z-50 transition-all duration-200 ease-out bg-[#091229]/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[0_20px_50px_rgba(2,6,23,0.75)] ${
                  isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
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
                              ? 'bg-sky-500/25 text-white font-bold border border-cyan-300/70 shadow-[0_0_18px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                              : 'text-white/90 font-semibold hover:text-white hover:bg-white/15 border border-transparent'
                          }`}
                        >
                          {active && (
                            <span
                              aria-hidden="true"
                              className={`w-1 h-5 rounded-full bg-gradient-to-b from-white via-sky-300 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)] ${
                                isRTL ? '-mr-1.5' : '-ml-1.5'
                              }`}
                            />
                          )}
                          <IconComponent
                            size={17}
                            className={
                              active
                                ? 'text-white drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                                : 'text-white/85'
                            }
                          />
                          <span className="tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* پنل جستجوی تمام‌عرض مخصوص موبایل (< sm) */}
        <div
          ref={searchMobileRef}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-hidden={!isSearchOpen}
          className={`sm:hidden alpha-glass-dropdown absolute top-full inset-x-0 mt-3 rounded-2xl z-50 transition-all duration-200 ease-out bg-white/95 dark:bg-[#091229]/95 backdrop-blur-2xl backdrop-saturate-150 border border-slate-200/90 dark:border-white/20 shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_22px_55px_rgba(2,6,23,0.85)] overflow-hidden ${
            isSearchOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <div className="p-3 border-b border-slate-200 dark:border-white/15">
            <div className="relative flex items-center">
              <input
                ref={mobileInputRef}
                type="text"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={ts.placeholder}
                className={`w-full py-2.5 !text-[14px] !leading-normal bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/60 rounded-xl focus:outline-none focus:border-blue-900/50 dark:focus:border-sky-300/70 ${
                  isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
                }`}
              />
              <Search
                size={15}
                className="text-slate-500 dark:text-white/80 absolute pointer-events-none"
                style={isRTL ? { right: '12px' } : { left: '12px' }}
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    mobileInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute text-slate-500 hover:text-slate-900 dark:text-white/75 dark:hover:text-white cursor-pointer"
                  style={isRTL ? { left: '10px' } : { right: '10px' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {renderSearchResultsBody()}
        </div>
      </div>
    </header>
  );
}