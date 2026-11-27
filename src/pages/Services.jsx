import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import db from '../../db.json';
import Header from '../components/Header';
import ServicesHero from '../components/services/ServicesHero';
import ServiceOverviewEditorial from '../components/services/ServiceOverviewEditorial';
import ServiceDeliverablesSpotlight from '../components/services/ServiceDeliverablesSpotlight';
import ServicePortfolioSlider from '../components/services/ServicePortfolioSlider';
import FAQSection from '../components/FAQSection';


export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();

  // خواندن مستقیم و پویا از منبع واحد (آماده برای ترتیب دستی db.json و فیلد order در ادمین پنل)
  const validServiceSlugs = useMemo(() => {
    const services = Array.isArray(db?.services) ? [...db.services] : [];
    services.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    return services.map((s) => s.slug).filter(Boolean);
  }, []);

  const defaultServiceSlug = validServiceSlugs[0] || '';
  const categoryParam = searchParams.get('category');

  const activeServiceSlug = validServiceSlugs.includes(categoryParam)
    ? categoryParam
    : defaultServiceSlug;

  const handleServiceChange = (slug) => {
    if (!validServiceSlugs.includes(slug)) return;
    setSearchParams({ category: slug }, { replace: true });
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip bg-slate-100 dark:bg-[#030712]">
      <Header />

      <ServicesHero
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      />

      <ServiceOverviewEditorial
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      />

      <ServiceDeliverablesSpotlight
        activeService={activeServiceSlug}
        onSelectService={handleServiceChange}
      />

      <ServicePortfolioSlider activeService={activeServiceSlug} />

      <FAQSection activeService={activeServiceSlug} />
    </div>
  );
}

