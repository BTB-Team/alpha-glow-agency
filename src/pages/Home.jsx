import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CorporateBanner from '../components/CorporateBanner';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';
import Header from '../components/Header';
import Hero from '../components/home/Hero';
import HomeAbout from '../components/home/HomeAbout';
import HomePortfolio from '../components/home/HomePortfolio';
import HomeServices from '../components/home/HomeServices';
import TestimonialsMarquee from '../components/home/TestimonialsMarquee';

export default function Home() {
  const { hash, key } = useLocation();

  // اسکرول نرم به بخش موردنظر (مثل #faq) هنگام هدایت از لینک هدر سایر صفحات
  useEffect(() => {
    if (!hash) return;
    const targetId = hash.replace('#', '');
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [hash, key]);

  return (
    <main className="w-full">
      {/* هدر مستقیماً بالای صفحه قرار می‌گیرد */}
      <Header />

      {/* هیرو شامل پس‌زمینه سینمایی و محتواست */}
      <Hero />
      <HomeServices />
      <HomePortfolio />
      <HomeAbout />
      <TestimonialsMarquee />
      <CorporateBanner />
      <FAQSection id="faq" />
      <FinalCTA />
    </main>
  );
}