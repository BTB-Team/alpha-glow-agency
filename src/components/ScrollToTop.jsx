import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      /* اعمال استایل شیشه‌ای پیشرفته گلس‌مورفیسم متناسب با لایت‌مد و دارک‌مد وب‌سایت */
      className={`fixed bottom-8 z-[9999] w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl active:scale-95 pointer-events-auto p-0 m-0
        end-8 md:end-12 
        bg-white/40 dark:bg-[#213668]/30 
        backdrop-blur-xl -webkit-backdrop-filter:blur(24px)
        border border-white/40 dark:border-white/10 
        hover:bg-white/50 dark:hover:bg-[#213668]/50
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
        ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
    >
      <ArrowUp size={22} className="text-[#213668] dark:text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
    </button>
  );
}
