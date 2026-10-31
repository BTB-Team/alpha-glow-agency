import Header from '../components/Header';
import Hero from '../components/home/Hero';

export default function Home() {
  return (
    <main className="w-full">
      {/* هدر مستقیماً بالای صفحه قرار می‌گیرد */}
      <Header />
      
      {/* هیرو شامل پس‌زمینه سینمایی و محتواست */}
      <Hero />
      
      {/* سایر بخش‌های صفحه اصلی */}
    </main>
  );
}