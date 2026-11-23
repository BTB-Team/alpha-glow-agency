import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    id: 'Graphic Design',
    label: {
      fa: 'طراحی گرافیک (Graphic Design)',
      en: 'Graphic Design',
    },
  },
  {
    id: 'Branding & Visual Identity',
    label: {
      fa: 'برندینگ و هویت بصری (Branding & Visual Identity)',
      en: 'Branding & Visual Identity',
    },
  },
  {
    id: 'Website Design',
    label: {
      fa: 'طراحی وب‌سایت (Website Design)',
      en: 'Website Design',
    },
  },
  {
    id: 'Printing & Advertising',
    label: {
      fa: 'چاپ و تبلیغات (Printing & Advertising)',
      en: 'Printing & Advertising',
    },
  },
];

const BUDGET_RANGES = [
  { id: '$200 - $500', label: { fa: '۲۰۰ تا ۵۰۰ دالر ($200 – $500)', en: '$200 – $500' } },
  { id: '$500 - $1,500', label: { fa: '۵۰۰ تا ۱,۵۰۰ دالر ($500 – $1,500)', en: '$500 – $1,500' } },
  { id: '$1,500 - $3,000', label: { fa: '۱,۵۰۰ تا ۳,۰۰۰ دالر ($1,500 – $3,000)', en: '$1,500 – $3,000' } },
  { id: '$3,000+', label: { fa: 'بیشتر از ۳,۰۰۰ دالر ($3,000+)', en: '$3,000+' } },
  { id: 'custom', label: { fa: 'وارد کردن مبلغ پیشنهادی دلخواه', en: 'Enter Custom Proposed Amount' } },
];

const TIMELINES = [
  { id: 'Urgent (< 1 Week)', label: { fa: 'فوری (کمتر از ۱ هفته)', en: 'Urgent (< 1 Week)' } },
  { id: '1 - 2 Weeks', label: { fa: '۱ تا ۲ هفته', en: '1 – 2 Weeks' } },
  { id: '2 - 4 Weeks', label: { fa: '۲ تا ۴ هفته', en: '2 – 4 Weeks' } },
  { id: '1 - 2 Months', label: { fa: '۱ تا ۲ ماه', en: '1 – 2 Months' } },
  { id: 'Flexible', label: { fa: 'منعطف / توافقی', en: 'Flexible / Negotiable' } },
];

const sanitize = (val) =>
  String(val || '')
    .replace(/[<>]/g, '')
    .trim();

export default function ContactProjectForm() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  const mountedAt = useRef(Date.now());
  const dropdownRef = useRef(null);

  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    services: [],
    budgetRange: '$500 - $1,500',
    customBudget: '',
    timeline: '2 - 4 Weeks',
    description: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // بستن منوی بازشوی خدمات هنگام کلیک در بیرون از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = () => {
    const errs = {};

    if (sanitize(formData.fullName).length < 3) {
      errs.fullName = isRTL
        ? 'لطفاً نام و نام خانوادگی کامل را وارد کنید.'
        : 'Please enter your full name (min 3 characters).';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitize(formData.email))) {
      errs.email = isRTL
        ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.'
        : 'Please enter a valid email address.';
    }

    const phonePattern = /^[+\d\s()-]{7,20}$/;
    if (!phonePattern.test(sanitize(formData.phone))) {
      errs.phone = isRTL
        ? 'لطفاً شماره تماس یا واتساپ معتبر وارد کنید.'
        : 'Please enter a valid phone or WhatsApp number.';
    }

    if (sanitize(formData.country).length < 2) {
      errs.country = isRTL
        ? 'لطفاً کشور محل فعالیت خود را بنویسید.'
        : 'Please enter your country of operation.';
    }

    if (!formData.services.length) {
      errs.services = isRTL
        ? 'لطفاً حداقل یکی از خدمات موردنیاز را انتخاب کنید.'
        : 'Please select at least one required service.';
    }

    if (formData.budgetRange === 'custom' && sanitize(formData.customBudget).length < 1) {
      errs.budget = isRTL
        ? 'لطفاً مبلغ پیشنهادی خود را وارد کنید.'
        : 'Please enter your proposed budget amount.';
    }

    if (!formData.timeline) {
      errs.timeline = isRTL
        ? 'لطفاً زمان موردنظر برای تکمیل پروژه را مشخص کنید.'
        : 'Please select your preferred timeline.';
    }

    if (sanitize(formData.description).length < 15) {
      errs.description = isRTL
        ? 'لطفاً توضیحات و جزئیات پروژه را بنویسید (حداقل ۱۵ کاراکتر).'
        : 'Please provide project details and requirements (min 15 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || (field === 'customBudget' && errors.budget)) {
      setErrors((prev) => ({ ...prev, [field]: undefined, budget: undefined }));
    }
  };

  const toggleService = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter((item) => item !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.honeypot) return;
    if (Date.now() - mountedAt.current < 1800) return;

    const lastSent = localStorage.getItem('ag_last_order_time');
    if (lastSent && Date.now() - Number(lastSent) < 40000) {
      setErrors({
        global: isRTL
          ? 'درخواست قبلی شما ثبت شده است. لطفاً چند لحظه صبر کنید.'
          : 'Your previous request was just sent. Please wait a moment.',
      });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    const resolvedBudget =
      formData.budgetRange === 'custom'
        ? sanitize(formData.customBudget)
        : formData.budgetRange;

    const requestCode = `AG-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderRecord = {
      id: requestCode,
      fullName: sanitize(formData.fullName),
      email: sanitize(formData.email),
      phone: sanitize(formData.phone),
      country: sanitize(formData.country),
      service: formData.services.join(', '),
      services: formData.services,
      budget: resolvedBudget,
      timeline: formData.timeline,
      description: sanitize(formData.description),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('alpha_glow_project_requests') || '[]'
      );
      localStorage.setItem(
        'alpha_glow_project_requests',
        JSON.stringify([orderRecord, ...savedOrders])
      );
      localStorage.setItem('ag_last_order_time', String(Date.now()));

      try {
        await fetch('http://localhost:3001/projectRequests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderRecord),
        });
      } catch {
        // در صورت عدم اجرای json-server، دیتا در سیستم محلی ذخیره شده است
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedData(orderRecord);
      }, 500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      services: [],
      budgetRange: '$500 - $1,500',
      customBudget: '',
      timeline: '2 - 4 Weeks',
      description: '',
      honeypot: '',
    });
    setErrors({});
    setIsServiceOpen(false);
    mountedAt.current = Date.now();
  };

  // استایل فیلدها متناسب با لایت‌مد و دارک‌مد
  const fieldStyle = (hasErr) =>
    `w-full rounded-[12px] px-4 py-3 text-sm sm:text-[15px] transition-all duration-300 outline-none border ${
      hasErr
        ? 'bg-rose-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-white border-rose-500 dark:border-rose-400/85 focus:border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
        : 'bg-white/85 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/45 border-blue-900/15 dark:border-sky-200/20 focus:border-blue-600 dark:focus:border-sky-400/80 focus:bg-white dark:focus:bg-slate-950/75 focus:shadow-[0_0_16px_rgba(37,99,235,0.15)] dark:focus:shadow-[0_0_16px_rgba(56,189,248,0.22)]'
    }`;

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      {/* هاله‌های نوری ملایم پس‌زمینه */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sky-400/15 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* تیتر سکشن */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {isRTL ? 'ثبت سفارش و شروع همکاری' : 'START YOUR PROJECT'}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{isRTL ? 'فرم درخواست ' : 'Submit '}</span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {isRTL ? 'پروژه جدید' : 'Project Request'}
            </span>
          </h2>
        </div>

        {/* کارت شیشه‌ای فرم با پشتیبانی کامل از لایت‌مد و دارک‌مد و باردر نوری ظریف */}
        <div className="relative w-full rounded-[24px] p-6 sm:p-8 md:p-10 overflow-hidden transition-all duration-500 backdrop-blur-xl bg-gradient-to-br from-white/90 via-sky-50/75 to-blue-100/65 dark:from-[#213668]/80 dark:via-[#152347]/85 dark:to-[#0f172a]/92 text-[#213668] dark:text-white border border-sky-400/45 dark:border-sky-200/35 shadow-[0_20px_50px_-12px_rgba(33,54,104,0.16),0_0_24px_-4px_rgba(56,189,248,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5),0_0_22px_-4px_rgba(56,189,248,0.28),inset_0_1px_1.5px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(56,189,248,0.3)]">
          
          {/* خط نوری ظریف روی لبه بالایی و پایینی */}
          <div
            className="absolute inset-x-6 top-0 h-[1.5px] rounded-full opacity-90 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent, #38bdf8, #2563eb, #38bdf8, transparent)',
              boxShadow: '0 0 10px #38bdf8',
            }}
          />
          <div
            className="absolute inset-x-12 bottom-0 h-[1px] rounded-full opacity-60 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent, #38bdf8, transparent)',
            }}
          />

          {/* هاله نوری گوشه بالا چپ */}
          <div
            className="absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl opacity-25 dark:opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #38bdf8, transparent 70%)',
            }}
          />

          {submittedData ? (
            /* صفحه پیام تأیید پس از ثبت موفق سفارش */
            <div className="py-6 sm:py-8 text-center flex flex-col items-center justify-center space-y-5 relative z-10">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border border-emerald-500/40 dark:border-emerald-300/50 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-blue-600/10 dark:bg-sky-400/15 text-blue-800 dark:text-sky-300 border border-blue-500/25 dark:border-sky-300/30">
                {isRTL
                  ? `شماره پیگیری: ${submittedData.id}`
                  : `Request ID: ${submittedData.id}`}
              </span>

              <h3 className="text-lg sm:text-2xl font-extrabold text-[#213668] dark:text-white">
                {isRTL
                  ? 'درخواست پروژه شما با موفقیت ثبت شد!'
                  : 'Your Project Request Has Been Received!'}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-white/85 max-w-lg leading-relaxed">
                {isRTL
                  ? `${submittedData.fullName} عزیز، جزئیات سفارش شما در سیستم مدیریت آژانس آلفا گلو ثبت گردید. کارشناسان ما در اسرع وقت از طریق ایمیل یا واتساپ با شما ارتباط می‌گیرند.`
                  : `Thank you, ${submittedData.fullName}. Your request has been securely stored in Alpha Glow's system. Our team will reach out via Email or WhatsApp shortly.`}
              </p>

              {/* کارت خلاصه اطلاعات ثبت‌شده */}
              <div className="w-full max-w-md rounded-[14px] p-4 bg-white/80 dark:bg-slate-950/55 border border-blue-900/15 dark:border-white/15 text-xs sm:text-sm space-y-2.5 text-start shadow-sm">
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-slate-500 dark:text-white/60 shrink-0">
                    {isRTL ? 'خدمات انتخابی:' : 'Services:'}
                  </span>
                  <span className="font-bold text-blue-700 dark:text-sky-300 text-end">
                    {submittedData.service}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-slate-500 dark:text-white/60 shrink-0">
                    {isRTL ? 'بودجه و زمان:' : 'Budget & Timeline:'}
                  </span>
                  <span dir="ltr" className="font-bold text-slate-900 dark:text-white">
                    {submittedData.budget} • {submittedData.timeline}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-white/60 shrink-0">
                    {isRTL ? 'کشور / تماس:' : 'Location / Contact:'}
                  </span>
                  <span dir="ltr" className="font-semibold text-slate-800 dark:text-white/90">
                    {submittedData.country} ({submittedData.phone})
                  </span>
                </div>
              </div>

              {/* دکمه‌های اطلاع‌رسانی آنی و ثبت سفارش مجدد */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://wa.me/message/5YJKPWGRTLRHD1"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-5 rounded-[10px] text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 transition-all duration-300 hover:brightness-110 shadow-sm"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(14, 165, 233, 0.85))',
                    border: '1px solid rgba(255, 255, 255, 0.32)',
                  }}
                >
                  <span>
                    {isRTL ? 'اطلاع‌رسانی مستقیم در واتساپ' : 'Notify Team on WhatsApp'}
                  </span>
                  <ArrowUpRight size={15} />
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-5 rounded-[10px] text-xs sm:text-sm font-semibold text-[#213668] dark:text-white/90 bg-slate-200/75 hover:bg-slate-300/75 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  {isRTL ? 'ثبت درخواست جدید' : 'Submit Another Request'}
                </button>
              </div>
            </div>
          ) : (
            /* فرم ثبت سفارش */
            <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
              {/* فیلد مخفی ضد اسپم */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => handleFieldChange('honeypot', e.target.value)}
                />
              </div>

              {errors.global && (
                <div className="p-3 rounded-[10px] bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs sm:text-sm text-center font-medium">
                  {errors.global}
                </div>
              )}

              {/* ۱. نام و نام خانوادگی | ۲. آدرس ایمیل */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL ? '۱. نام و نام خانوادگی مشتری *' : '1. Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'مثال: علی احمدی' : 'e.g. Alex Morgan'}
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className={fieldStyle(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL ? '۲. آدرس ایمیل *' : '2. Email Address *'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="client@company.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={fieldStyle(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* ۳. شماره تماس یا واتساپ | ۴. کشور محل فعالیت */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL ? '۳. شماره تماس یا واتساپ *' : '3. Phone or WhatsApp Number *'}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    placeholder="+93 79 430 0565"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={fieldStyle(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL ? '۴. کشور محل فعالیت مشتری *' : '4. Country of Operation *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      isRTL ? 'مثال: افغانستان، امارات، کانادا...' : 'e.g. Afghanistan, UAE, UK...'
                    }
                    value={formData.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    className={fieldStyle(errors.country)}
                  />
                  {errors.country && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* ۵. نوع خدمت موردنیاز (Dropdown واحد همراه با Checkbox) */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                  {isRTL ? '۵. نوع خدمت موردنیاز *' : '5. Required Service *'}
                </label>

                <button
                  type="button"
                  onClick={() => setIsServiceOpen((prev) => !prev)}
                  className={`${fieldStyle(errors.services)} flex items-center justify-between text-start cursor-pointer`}
                >
                  <span
                    className={`truncate ${
                      formData.services.length
                        ? 'text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-400 dark:text-white/45'
                    }`}
                  >
                    {formData.services.length
                      ? formData.services.join(' ، ')
                      : isRTL
                      ? 'انتخاب خدمات موردنیاز (امکان انتخاب یک یا چند مورد)...'
                      : 'Select required services (one or multiple)...'}
                  </span>

                  <svg
                    className={`w-4 h-4 text-blue-700 dark:text-sky-300 shrink-0 transition-transform duration-300 ${
                      isServiceOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* منوی بازشوی حاوی چک‌باکس‌ها (سازگار با لایت‌مد و دارک‌مد) */}
                {isServiceOpen && (
                  <div className="absolute inset-x-0 mt-2 rounded-[14px] p-2 z-30 border border-blue-200 dark:border-sky-300/35 shadow-2xl space-y-1 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95">
                    {SERVICES.map((srv) => {
                      const isChecked = formData.services.includes(srv.id);
                      return (
                        <label
                          key={srv.id}
                          onClick={() => toggleService(srv.id)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200 select-none ${
                            isChecked
                              ? 'bg-blue-600/10 dark:bg-sky-500/25 text-[#213668] dark:text-white font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/85'
                          }`}
                        >
                          {/* چک‌باکس سفارشی */}
                          <span
                            className={`w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isChecked
                                ? 'bg-blue-600 dark:bg-sky-400 border-blue-600 dark:border-sky-300 text-white dark:text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                                : 'border-slate-300 dark:border-white/35 bg-white dark:bg-slate-950/60'
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            )}
                          </span>

                          <span className="text-sm sm:text-[15px]">
                            {srv.label[currentLang]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {errors.services && (
                  <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                    {errors.services}
                  </p>
                )}
              </div>

              {/* ۶. بودجه موردنظر | ۷. زمان موردنظر برای تکمیل پروژه */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL
                      ? '۶. بودجه موردنظر (محدوده یا مبلغ پیشنهادی) *'
                      : '6. Project Budget (Range or Custom) *'}
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => handleFieldChange('budgetRange', e.target.value)}
                    className={`${fieldStyle(errors.budget)} cursor-pointer`}
                  >
                    {BUDGET_RANGES.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                      >
                        {item.label[currentLang]}
                      </option>
                    ))}
                  </select>

                  {formData.budgetRange === 'custom' && (
                    <input
                      type="text"
                      placeholder={
                        isRTL
                          ? 'مبلغ پیشنهادی خود را وارد کنید (مثلاً 950 دالر)'
                          : 'Enter your proposed budget (e.g. $950)'
                      }
                      value={formData.customBudget}
                      onChange={(e) => handleFieldChange('customBudget', e.target.value)}
                      className={`${fieldStyle(errors.budget)} mt-2.5`}
                    />
                  )}
                  {errors.budget && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.budget}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-2">
                    {isRTL
                      ? '۷. زمان موردنظر برای تکمیل پروژه *'
                      : '7. Preferred Completion Timeline *'}
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleFieldChange('timeline', e.target.value)}
                    className={`${fieldStyle(errors.timeline)} cursor-pointer`}
                  >
                    {TIMELINES.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                      >
                        {item.label[currentLang]}
                      </option>
                    ))}
                  </select>
                  {errors.timeline && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                      {errors.timeline}
                    </p>
                  )}
                </div>
              </div>

              {/* ۸. توضیحات پروژه */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300">
                    {isRTL
                      ? '۸. توضیحات پروژه (شرح نیازها، ایده‌ها و جزئیات) *'
                      : '8. Project Description (Needs, Ideas & Details) *'}
                  </label>
                  <span className="text-xs text-slate-500 dark:text-white/55">
                    {formData.description.length}/1000
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={1000}
                  required
                  placeholder={
                    isRTL
                      ? 'لطفاً ایده‌ها، اهداف، ویژگی‌های مدنظر و هرگونه جزئیات مهم پروژه خود را بنویسید...'
                      : 'Describe your project goals, target audience, required features, and any reference ideas...'
                  }
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={`${fieldStyle(errors.description)} resize-none leading-relaxed`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-600 dark:text-rose-300 mt-1.5 font-medium">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* ۹. دکمه ارسال درخواست (ترجمه‌شده به فارسی و انگلیسی) */}
              <div className="pt-4 border-t border-blue-900/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-white/70">
                  {isRTL
                    ? '🔒 اطلاعات شما با امنیت کامل در سیستم مدیریت درخواست‌های آژانس ثبت می‌شود.'
                    : '🔒 Your information is securely validated and stored in our project system.'}
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[240px] py-3 px-6 rounded-[12px] text-sm sm:text-[15px] font-bold text-white transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer "
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(14, 165, 233, 0.85))',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 20px -4px rgba(14, 165, 233, 0.45)',
                  }}
                >
                  <span>
                    {isSubmitting
                      ? isRTL
                        ? 'در حال ارسال درخواست...'
                        : 'Submitting...'
                      : isRTL
                      ? 'ثبت و ارسال درخواست پروژه'
                      : 'Submit Project Request'}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className={`shrink-0 transition-transform ${isRTL ? '-scale-x-100' : ''}`}
                  />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}