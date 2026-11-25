import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ServicesHero from '../components/services/ServicesHero';
import ServiceDetailsSection from '../components/services/ServiceDetailsSection';
import ServicePortfolioStack from '../components/services/ServicePortfolioStack';
import ServiceProcessAndFAQ from '../components/services/ServiceProcessAndFAQ';

const VALID_SERVICES = ['website-design', 'graphic-design', 'branding', 'print'];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const activeServiceSlug = VALID_SERVICES.includes(categoryParam)
    ? categoryParam
    : 'website-design';

  const handleServiceChange = (slug) => {
    setSearchParams({ category: slug }, { replace: true });
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip bg-slate-100 dark:bg-[#030712]">
      {/* هدر شیشه‌ای که به‌صورت شفاف روی اسلایدر تمام‌عرض قرار می‌گیرد */}
      <Header />

      {/* ۱. اسلایدر هیروی تمام‌عرض (۴ پنل در دسکتاپ + اسلایدر سوایپی در موبایل) */}
      <ServicesHero
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      />

      {/* ۲. نوار سوییچ سریع + معرفی عمیق خدمت + ۳ تصویر مکمل + موارد تحویلی */}
      {/* <ServiceDetailsSection
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      /> */}

      {/* ۳. کارت‌های انباشته نمونه‌کارهای مرتبط با همین خدمت */}
      {/* <ServicePortfolioStack
        key={activeServiceSlug}
        activeCategory={activeServiceSlug}
      /> */}

      {/* ۴. روند ۴ مرحله‌ای همکاری + سوالات متداول عمومی + CTA پایانی */}
      {/* <ServiceProcessAndFAQ activeService={activeServiceSlug} /> */}
    </div>
  );
}