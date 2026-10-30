import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';

// کامپوننت‌های مشترک از روت پوشه components
import Header from './components/Header';
import Footer from './components/Footer';

// صفحات اصلی از پوشه pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// ۱. لایه صفحات عمومی (شامل هدر، فوتر و مدیریت زبان URL)
function PublicLayout() {
  const { lang } = useParams();
  const { setLanguage, theme } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang !== 'fa' && lang !== 'en') {
      navigate('/fa', { replace: true });
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ۲. لایه پنل مدیریت (مختص فاز آینده - فارسی و بدون هدر و فوتر عمومی)
function AdminLayout() {
  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* هدایت مسیر ریشه به زبان پیش‌فرض فارسی */}
        <Route path="/" element={<Navigate to="/fa" replace />} />

        {/* مسیرهای عمومی دوزبانه (/fa و /en) */}
        <Route path="/:lang" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          
          {/* مسیر خدمات با قابلیت داشتن زیرمسیرهای تو در تو برای ۴ خدمت اصلی */}
          <Route path="services" element={<Services />}>
            {/* <Route path=":serviceSlug" element={<ServiceDetail />} /> */}
          </Route>

          <Route path="contact" element={<Contact />} />
        </Route>

        {/* مسیر پنل مدیریت آینده (جدا از Layout عمومی) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* مسیرهای ادمین در فاز بعدی اینجا قرار می‌گیرند */}
        </Route>

        {/* هدایت مسیرهای نامعتبر */}
        <Route path="*" element={<Navigate to="/fa" replace />} />
      </Routes>
    </HashRouter>
  ); 
}