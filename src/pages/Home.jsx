import HeroScene from '../components/home/HeroScene';

export default function Home() {
  return (
    <div className="w-full">
      {/* صحنه اول و لایه‌بندی میز کار هیرو */}
      <HeroScene />
      
      {/* فضای خالی موقت برای امکان اسکرول و تست پینینگ */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-slate-400">صحنه ۲ در اسکرول بعدی لود خواهد شد...</p>
      </div>
    </div>
  );
}