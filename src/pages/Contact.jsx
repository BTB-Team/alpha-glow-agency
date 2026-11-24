import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ContactSocial3D from '../components/contact/ContactSocial3D';
import ContactSocialCards from '../components/contact/ContactSocialCards';
import ContactSimpleForm from '../components/contact/ContactSimpleForm';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import ContactSocial3D from '../components/ContactSocial3D';
// import ContactSocialCards from '../components/ContactSocialCards';
// import ContactSimpleForm from '../components/ContactSimpleForm';

export default function Contact() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentLang]);

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

        <div className="w-full relative z-20 isolate">
          <ContactSimpleForm />
        </div>
      </main>
    </div>
  );
}