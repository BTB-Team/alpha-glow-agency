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

  const fieldStyle = (hasErr) =>
    `alpha-form-field ${hasErr ? 'alpha-form-field-error' : ''}`;

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500"
    >
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

        {/* کارت شیشه‌ای فرم تماس ساده با کلاس‌های مشترک */}
        <div className="relative w-full overflow-hidden alpha-glass-bar alpha-form-surface md:p-10">
          {/* بنر کوچک راهنما برای باز کردن مودال ثبت پروژه */}
          <div className="alpha-form-banner">
            <span className="alpha-form-banner-text">
              {isRTL
                ? 'قصد ثبت سفارش پروژه طراحی وب، گرافیک یا برندینگ را دارید؟'
                : 'Looking to start a Web, Branding, or Graphic Design project?'}
            </span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-project-modal'))}
              className="alpha-form-btn-secondary shrink-0 !py-1.5 !px-3.5 !text-xs font-bold"
            >
              {isRTL ? 'باز کردن فرم ثبت پروژه' : 'Open Project Form'}
            </button>
          </div>

          {isSent ? (
            <div className="py-8 text-center flex flex-col items-center space-y-4">
              <div className="alpha-form-success-icon">
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
              <p className="text-sm text-slate-600 dark:text-white/85 max-w-md leading-relaxed">
                {isRTL
                  ? 'سپاس از تماس شما. تیم پشتیبانی آلفا گلو در کوتاه‌ترین زمان پاسخگوی شما خواهد بود.'
                  : 'Thank you for reaching out. Our support team will get back to you shortly.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="alpha-form-btn-secondary"
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
                  <label className="alpha-form-label">
                    {isRTL ? 'نام و نام خانوادگی *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'نام شما' : 'Your name'}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={fieldStyle(errors.name)}
                  />
                  {errors.name && <p className="alpha-form-error">{errors.name}</p>}
                </div>

                <div>
                  <label className="alpha-form-label">
                    {isRTL ? 'آدرس ایمیل *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={fieldStyle(errors.email)}
                  />
                  {errors.email && <p className="alpha-form-error">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="alpha-form-label">
                  {isRTL ? 'موضوع پیام (اختیاری)' : 'Subject (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    isRTL ? 'مثال: همکاری تجاری، سوال عمومی...' : 'e.g. Partnership, General Inquiry...'
                  }
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={fieldStyle(false)}
                />
              </div>

              <div>
                <label className="alpha-form-label">
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
                  className={`${fieldStyle(errors.message)} resize-none leading-relaxed`}
                />
                {errors.message && <p className="alpha-form-error">{errors.message}</p>}
              </div>

              <div className="alpha-form-footer sm:justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="group alpha-form-submit-btn"
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
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 ${
                      isRTL ? '-scale-x-100' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}