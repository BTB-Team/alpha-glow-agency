import { useSearchParams } from 'react-router-dom';
import ServicesHero from '../components/services/ServicesHero';
import ServicePortfolioStack from '../components/services/ServicePortfolioStack';

const VALID_SERVICES = ['website-design', 'graphic-design', 'branding', 'print'];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const activeServiceSlug = VALID_SERVICES.includes(categoryParam)
    ? categoryParam
    : 'website-design';

  // هر زمان کاربر در صفحه خدمات تب یا سرویس فعال را عوض کرد، این تابع را صدا بزن
  const handleServiceChange = (slug) => {
    setSearchParams({ category: slug }, { replace: true });
  };

  return (
    <>
      <ServicesHero
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      />

      {/* کارت‌های انباشته نمونه‌کارهای مرتبط با همین خدمت */}
      <ServicePortfolioStack
        key={activeServiceSlug}
        activeCategory={activeServiceSlug}
      />
    </>
  );
}