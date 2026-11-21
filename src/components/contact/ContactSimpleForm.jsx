import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const sanitize = (val) =>
  String(val || '')
    .replace(/[<>]/g, '')
    .trim();

export default function ContactSimpleForm() {
  const { lang } = useParams();
  const currentLang = lang === 'fa' ? 'fa' : 'en';
  const isRTL = currentLang === 'fa';

  const mountedAt = useRef(Date.now());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (sanitize(formData.name).length < 2) {
      errs.name = isRTL ? 'لطفاً نام خود را وارد کنید.' : 'Please enter your name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitize(formData.email))) {
      errs.email = isRTL ? 'لطفاً یک ایمیل معتبر وارد کنید.' : 'Please enter a valid email.';
    }
    if (sanitize(formData.message).length < 10) {
      errs.message = isRTL
        ? 'لطفاً پیام خود را بنویسید (حداقل ۱۰ کاراکتر).'
        : 'Please enter your message (min 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;
    if (Date.now() - mountedAt.current < 1500) return;

    if (!validate()) return;

    setIsSending(true);

    const contactPayload = {
      id: `MSG-${Math.floor(100000 + Math.random() * 900000)}`,
      name: sanitize(formData.name),
      email: sanitize(formData.email),
      subject: sanitize(formData.subject) || (isRTL ? 'پیام عمومی' : 'General Inquiry'),
      message: sanitize(formData.message),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('alpha_glow_messages') || '[]');
      localStorage.setItem('alpha_glow_messages', JSON.stringify([contactPayload, ...existing]));

      try {
        await fetch('http://localhost:3001/contactMessages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload),
        });
      } catch {
        // ذخیره در localStorage انجام شده است
      }

      setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
      }, 450);
    } catch {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    setErrors({});
    mountedAt.current = Date.now();
  };

  const inputStyle = (hasErr) =>
    `w-full rounded-[12px] px-4 py-3 text-sm sm:text-[15px] transition-all duration-300 outline-none border ${
      hasErr
        ? 'bg-rose-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-white border-rose-500 dark:border-rose-400/85'
        : 'bg-white/85 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/45 border-blue-900/15 dark:border-sky-200/20 focus:border-blue-600 dark:focus:border-sky-400/80 focus:bg-white dark:focus:bg-slate-950/75'
    }`;

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      {/* هاله‌های نوری ملایم پس‌زمینه */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sky-400/15 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* تیتر سکشن */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-sky-400" />
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-blue-900 dark:text-sky-300 font-body">
              {isRTL ? 'ارسال پیام مستقیم' : 'DIRECT MESSAGE'}
            </span>
            <span className="w-12 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-sky-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            <span>{isRTL ? 'ارسال ' : 'Send Us a '}</span>
            <span className="bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 dark:from-white dark:via-sky-200 dark:to-sky-400 bg-clip-text text-transparent font-heading">
              {isRTL ? 'پیام سریع' : 'Quick Message'}
            </span>
          </h2>
        </div>

        {/* کارت شیشه‌ای فرم تماس ساده */}
        <div className="relative w-full rounded-[24px] p-6 sm:p-8 md:p-10 overflow-hidden transition-all duration-500 backdrop-blur-xl bg-gradient-to-br from-white/90 via-sky-50/75 to-blue-100/65 dark:from-[#213668]/80 dark:via-[#152347]/85 dark:to-[#0f172a]/92 text-[#213668] dark:text-white border border-sky-400/45 dark:border-sky-200/35 shadow-[0_20px_50px_-12px_rgba(33,54,104,0.16),0_0_24px_-4px_rgba(56,189,248,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5),0_0_22px_-4px_rgba(56,189,248,0.28),inset_0_1px_1.5px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(56,189,248,0.3)]">
          
          {/* خط نوری ظریف لبه بالا و پایین */}
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

          {/* بنر کوچک راهنما برای باز کردن مودال ثبت پروژه */}
          <div className="mb-6 p-3.5 rounded-[14px] bg-blue-600/10 dark:bg-sky-400/10 border border-blue-500/20 dark:border-sky-300/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-medium text-[#213668] dark:text-sky-200 text-center sm:text-start">
              {isRTL
                ? 'قصد ثبت سفارش پروژه طراحی وب، گرافیک یا برندینگ را دارید؟'
                : 'Looking to start a Web, Branding, or Graphic Design project?'}
            </span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-project-modal'))}
              className="shrink-0 px-3.5 py-1.5 rounded-[9px] text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-sky-500/30 dark:hover:bg-sky-500/45 border border-blue-500/30 dark:border-sky-300/35 transition-all duration-200 cursor-pointer"
            >
              {isRTL ? 'باز کردن فرم ثبت پروژه' : 'Open Project Form'}
            </button>
          </div>

          {isSent ? (
            <div className="py-8 text-center flex flex-col items-center space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-emerald-500/40 dark:border-emerald-300/50 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                <svg
                  className="w-7 h-7"
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
              <h3 className="text-lg sm:text-xl font-extrabold text-[#213668] dark:text-white">
                {isRTL ? 'پیام شما با موفقیت ارسال شد!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-white/80 max-w-md">
                {isRTL
                  ? 'سپاس از تماس شما. تیم پشتیبانی آلفا گلو در کوتاه‌ترین زمان پاسخگوی شما خواهد بود.'
                  : 'Thank you for reaching out. Our support team will get back to you shortly.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="py-2 px-5 rounded-[10px] text-xs sm:text-sm font-semibold text-[#213668] dark:text-white bg-slate-200/80 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 transition-all cursor-pointer"
              >
                {isRTL ? 'ارسال پیام دیگر' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => handleChange('honeypot', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-1.5">
                    {isRTL ? 'نام و نام خانوادگی *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'نام شما' : 'Your name'}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={inputStyle(errors.name)}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-1.5">
                    {isRTL ? 'آدرس ایمیل *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputStyle(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-1.5">
                  {isRTL ? 'موضوع پیام (اختیاری)' : 'Subject (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    isRTL ? 'مثال: همکاری تجاری، سوال عمومی...' : 'e.g. Partnership, General Inquiry...'
                  }
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={inputStyle(false)}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#213668] dark:text-sky-300 mb-1.5">
                  {isRTL ? 'متن پیام شما *' : 'Your Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    isRTL ? 'پیام یا سوال خود را اینجا بنویسید...' : 'Write your message or question here...'
                  }
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`${inputStyle(errors.message)} resize-none leading-relaxed`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.message}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto min-w-[200px] py-3 px-6 rounded-[12px] text-sm sm:text-[15px] font-bold text-white transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(14, 165, 233, 0.85))',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 20px -4px rgba(14, 165, 233, 0.45)',
                  }}
                >
                  <span>
                    {isSending
                      ? isRTL
                        ? 'در حال ارسال...'
                        : 'Sending...'
                      : isRTL
                      ? 'ارسال پیام'
                      : 'Send Message'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}