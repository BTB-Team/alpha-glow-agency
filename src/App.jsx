import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useParams, useNavigate, BrowserRouter, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// کامپوننت‌های مشترک از روت پوشه components
import Footer from './components/Footer';

// صفحات اصلی از پوشه pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import AutoScrollTop from './components/AutoScrollTop';
import Portfolio from './pages/Portfolio';
import Preloader from './components/Preloader';

function PublicLayout() {
  const { lang } = useParams();
  const { setLanguage, theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang !== 'en' && lang !== 'fa') {
      navigate('/en', { replace: true });
      return;
    }

    setLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang, setLanguage, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem("preserve_scroll_y");
    if (savedScrollY !== null) {
      window.scrollTo({ top: parseInt(savedScrollY, 10), behavior: "instant" });
      sessionStorage.removeItem("preserve_scroll_y");
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden">
      <main className="flex-grow w-full relative">
        <Outlet />
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* پرلودر در بالاترین سطح ریشه قرار می‌گیرد تا روی هدر و تمام صفحات بیفتد */}
      {/* <Preloader /> */}
      
      <AutoScrollTop/>
      
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />

        <Route path="/:lang" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          {/* مسیرهای ادمین */}
        </Route>

        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  ); 
}