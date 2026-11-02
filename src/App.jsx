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

// ۱. لایه صفحات عمومی (شامل هدر، فوتر و مدیریت زبان URL)
function PublicLayout() {
  const { lang } = useParams();
  const { setLanguage, theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // تغییر زبان پیش‌فرض به en (اگر زبان fa یا en نبود، ریدایرکت به en)
    if (lang !== 'en' && lang !== 'fa') {
      navigate('/en', { replace: true });
      return;
    }

    setLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang, setLanguage, navigate]);

  // اعمال کلاس dark روی تگ html برای پشتیبانی Tailwind
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

// ۲. لایه پنل مدیریت (مختص فاز آینده)
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
      <Routes>
        {/* هدایت مسیر ریشه به زبان پیش‌فرض انگلیسی */}
        <Route path="/" element={<Navigate to="/en" replace />} />

        {/* مسیرهای عمومی دوزبانه (/en و /fa) */}
        <Route path="/:lang" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          
          <Route path="services" element={<Services />}>
            {/* <Route path=":serviceSlug" element={<ServiceDetail />} /> */}
          </Route>

          <Route path="contact" element={<Contact />} />
        </Route>

        {/* مسیر پنل مدیریت آینده */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* مسیرهای ادمین */}
        </Route>

        {/* هدایت مسیرهای نامعتبر به انگلیسی */}
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  ); 
}