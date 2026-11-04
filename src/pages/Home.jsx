import Header from '../components/Header';
import Hero from '../components/home/Hero';
import HomePortfolio from '../components/home/HomePortfolio';
import HomeServices from '../components/home/HomeServices';

export default function Home() {
  return (
    <main className="w-full">
      {/* هدر مستقیماً بالای صفحه قرار می‌گیرد */}
      <Header />
      
      {/* هیرو شامل پس‌زمینه سینمایی و محتواست */}
      <Hero />
      <HomeServices/>
      <HomePortfolio/>
      
      {/* سایر بخش‌های صفحه اصلی */}
    </main>
  );
}