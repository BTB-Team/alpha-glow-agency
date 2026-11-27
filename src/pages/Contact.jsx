import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ContactSocial3D from '../components/contact/ContactSocial3D';
import ContactSocialCards from '../components/contact/ContactSocialCards';
import ContactSimpleForm from '../components/contact/ContactSimpleForm';

export default function Contact() {
  const { lang } = useParams();
  const { hash, key } = useLocation();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);

      return () => clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [currentLang, hash, key]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-x-hidden"
    >
      <main className="w-full block">
        <div className="w-full relative z-10 isolate">
          <ContactSocial3D />
        </div>

        <div className="w-full relative z-20 isolate">
          <ContactSocialCards />
        </div>

        <div
          id="contact-form"
          className="w-full relative z-20 isolate scroll-mt-24"
        >
          <ContactSimpleForm />
        </div>
      </main>
    </div>
  );
}