import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

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

// نگاشت خودکار دسته‌بندی‌های db.json به شناسه‌های چک‌باکس فرم
const CATEGORY_TO_SERVICE_ID = {
  'graphic-design': 'Graphic Design',
  branding: 'Branding & Visual Identity',
  'website-design': 'Website Design',
  print: 'Printing & Advertising',
};

const resolveServiceId = (rawService) => {
  if (!rawService) return null;
  if (CATEGORY_TO_SERVICE_ID[rawService]) return CATEGORY_TO_SERVICE_ID[rawService];
  const directMatch = SERVICES.find((s) => s.id === rawService);
  return directMatch ? directMatch.id : null;
};

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

export default function ProjectRequestModal({ isOpen: controlledOpen, onClose, defaultService = '' }) {
  const { lang } = useParams();
  const detectedLang =
    lang === 'fa' || document.documentElement.dir === 'rtl' ? 'fa' : 'en';
  const isRTL = detectedLang === 'fa';

  const isStoreModalOpen = useStore((state) => state.isProjectModalOpen);
  const projectModalContext = useStore((state) => state.projectModalContext);
  const closeStoreModal = useStore((state) => state.closeProjectModal);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen =
    controlledOpen !== undefined
      ? controlledOpen
      : internalOpen || isStoreModalOpen;

  const mountedAt = useRef(Date.now());
  const dropdownRef = useRef(null);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const initialServiceId = resolveServiceId(defaultService);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    services: initialServiceId ? [initialServiceId] : [],
    budgetRange: '$500 - $1,500',
    customBudget: '',
    timeline: '2 - 4 Weeks',
    description: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleClose = useCallback(() => {
    setIsServiceOpen(false);
    setInternalOpen(false);
    closeStoreModal();
    if (onClose) onClose();
  }, [closeStoreModal, onClose]);

  // پر کردن خودکار خدمت و پروژه مرجع هنگام باز شدن از استور (مثلاً از دکمه PortfolioModal)
  useEffect(() => {
    if (!isStoreModalOpen) return;

    mountedAt.current = Date.now();
    setSubmittedData(null);
    setErrors({});

    const mappedService = resolveServiceId(projectModalContext?.service);
    const refProject = projectModalContext?.referenceProject;

    if (mappedService || refProject) {
      setFormData((prev) => {
        const nextServices = mappedService ? [mappedService] : prev.services;
        const refNote = refProject
          ? isRTL
            ? `درخواست پروژه مشابه با: ${refProject}\n`
            : `Similar project request to: ${refProject}\n`
          : '';

        return {
          ...prev,
          services: nextServices,
          description:
            refNote && !prev.description.includes(refProject)
              ? `${refNote}${prev.description}`
              : prev.description,
        };
      });
    }
  }, [isStoreModalOpen, projectModalContext, isRTL]);

  // حفظ سازگاری با دکمه‌هایی که از رویداد سراسری open-project-modal استفاده می‌کنند
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      const preselected = resolveServiceId(e?.detail?.service);
      if (preselected) {
        setFormData((prev) => ({
          ...prev,
          services: prev.services.includes(preselected)
            ? prev.services
            : [preselected],
        }));
      }
      mountedAt.current = Date.now();
      setSubmittedData(null);
      setInternalOpen(true);
    };

    const handleGlobalClose = () => handleClose();

    window.addEventListener('open-project-modal', handleGlobalOpen);
    window.addEventListener('close-project-modal', handleGlobalClose);
    return () => {
      window.removeEventListener('open-project-modal', handleGlobalOpen);
      window.removeEventListener('close-project-modal', handleGlobalClose);
    };
  }, [handleClose]);

  // قفل کردن اسکرول صفحه پشت مودال و بستن با کلید Escape
  useEffect(() => {
    if (!isOpen) return;
    mountedAt.current = Date.now();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // بستن منوی بازشوی خدمات هنگام کلیک بیرون آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

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
    if (Date.now() - mountedAt.current < 1500) return;

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
        // در حالت استاتیک، دیتا در localStorage ذخیره شده است
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedData(orderRecord);
      }, 450);
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

  const fieldStyle = (hasErr) =>
  `alpha-form-field ${hasErr ? 'alpha-form-field-error' : ''}`; 

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto alpha-no-scrollbar"
    >
      {/* پس‌زمینه تار شیشه‌ای */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/65 dark:bg-[#020617]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* بدنه اصلی مودال شیشه‌ای */}
      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain alpha-no-scrollbar alpha-glass-bar alpha-form-surface alpha-form-on-dark">

        {/* هدر مودال + دکمه بستن */}
        <div className="alpha-form-header">
          <div>
            <span className="alpha-form-eyebrow">
              {isRTL ? 'شروع همکاری با آلفا گلو' : 'START YOUR PROJECT'}
            </span>
            <h3 className="alpha-form-title">
              {isRTL ? 'ثبت درخواست پروژه جدید' : 'Submit Project Request'}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="alpha-form-close-btn"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {submittedData ? (
          /* پیام تأیید پس از ثبت موفق سفارش */
          <div className="py-5 text-center flex flex-col items-center justify-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border border-white/35 dark:border-emerald-300/50 bg-emerald-500/20 text-white dark:text-emerald-300"
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

            <span className="alpha-form-success-badge">
              {isRTL
                ? `شماره پیگیری: ${submittedData.id}`
                : `Request ID: ${submittedData.id}`}
            </span>

            <h4 className="text-lg sm:text-2xl font-extrabold text-white">
              {isRTL
                ? 'درخواست پروژه شما با موفقیت ثبت شد!'
                : 'Your Project Request Has Been Received!'}
            </h4>

            <p className="text-sm sm:text-base text-white/90 dark:text-white/85 max-w-lg leading-relaxed">
              {isRTL
                ? `${submittedData.fullName} عزیز، جزئیات سفارش شما در سیستم مدیریت آژانس آلفا گلو ثبت گردید. کارشناسان ما در اسرع وقت از طریق ایمیل یا واتساپ با شما تماس می‌گیرند.`
                : `Thank you, ${submittedData.fullName}. Your request has been securely logged in Alpha Glow's system. Our team will reach out via Email or WhatsApp shortly.`}
            </p>

            {/* خلاصه سفارش */}
            <div className="alpha-form-summary-card">
              <div className="alpha-form-summary-row">
                <span className="text-white/75 dark:text-white/60 shrink-0">
                  {isRTL ? 'خدمات انتخابی:' : 'Services:'}
                </span>
                <span className="font-bold text-white dark:text-sky-300 text-end">
                  {submittedData.service}
                </span>
              </div>
              <div className="alpha-form-summary-row">
                <span className="text-white/75 dark:text-white/60 shrink-0">
                  {isRTL ? 'بودجه و زمان:' : 'Budget & Timeline:'}
                </span>
                <span dir="ltr" className="font-bold text-white">
                  {submittedData.budget} • {submittedData.timeline}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/75 dark:text-white/60 shrink-0">
                  {isRTL ? 'کشور / تماس:' : 'Location / Contact:'}
                </span>
                <span dir="ltr" className="font-semibold text-white/95 dark:text-white/90">
                  {submittedData.country} ({submittedData.phone})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://wa.me/message/5YJKPWGRTLRHD1"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-[10px] text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 transition-all duration-300 hover:brightness-110 shadow-sm"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(14, 165, 233, 0.85))',
                  border: '1px solid rgba(255, 255, 255, 0.32)',
                }}
              >
                <span>
                  {isRTL ? 'اطلاع‌رسانی مستقیم در واتساپ' : 'Notify Team on WhatsApp'}
                </span>
              </a>

              <button type="button" onClick={handleReset} className="alpha-form-btn-secondary">
                {isRTL ? 'ثبت درخواست جدید' : 'Submit Another'}
              </button>

              <button type="button" onClick={handleClose} className="alpha-form-btn-ghost">
                {isRTL ? 'بستن پنجره' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* فرم ۹ فیلدی داخل مودال */
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              <div className="alpha-form-alert-error">{errors.global}</div>
            )}

            {/* ۱. نام و نام خانوادگی | ۲. آدرس ایمیل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="alpha-form-label">
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
                {errors.fullName && <p className="alpha-form-error">{errors.fullName}</p>}
              </div>

              <div>
                <label className="alpha-form-label">
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
                {errors.email && <p className="alpha-form-error">{errors.email}</p>}
              </div>
            </div>

            {/* ۳. شماره تماس یا واتساپ | ۴. کشور محل فعالیت */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="alpha-form-label">
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
                {errors.phone && <p className="alpha-form-error">{errors.phone}</p>}
              </div>

              <div>
                <label className="alpha-form-label">
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
                {errors.country && <p className="alpha-form-error">{errors.country}</p>}
              </div>
            </div>

            {/* ۵. نوع خدمت موردنیاز */}
            <div ref={dropdownRef} className="relative">
              <label className="alpha-form-label">
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

              {isServiceOpen && (
                <div className="alpha-form-dropdown-menu">
                  {SERVICES.map((srv) => {
                    const isChecked = formData.services.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`alpha-form-dropdown-item ${
                          isChecked ? 'alpha-form-dropdown-item-active' : ''
                        }`}
                      >
                        <span
                          className={`alpha-form-checkbox ${
                            isChecked ? 'alpha-form-checkbox-checked' : ''
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
                          {srv.label[detectedLang]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {errors.services && <p className="alpha-form-error">{errors.services}</p>}
            </div>

            {/* ۶. بودجه موردنظر | ۷. زمان موردنظر برای تکمیل پروژه */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="alpha-form-label">
                  {isRTL
                    ? '۶. بودجه موردنظر (محدوده یا دلخواه) *'
                    : '6. Project Budget (Range or Custom) *'}
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => handleFieldChange('budgetRange', e.target.value)}
                  className={`${fieldStyle(errors.budget)} cursor-pointer`}
                >
                  {BUDGET_RANGES.map((item) => (
                    <option key={item.id} value={item.id} className="alpha-form-option">
                      {item.label[detectedLang]}
                    </option>
                  ))}
                </select>

                {formData.budgetRange === 'custom' && (
                  <input
                    type="text"
                    placeholder={
                      isRTL
                        ? 'مبلغ پیشنهادی خود را بنویسید (مثلاً 950 دالر)'
                        : 'Enter proposed budget (e.g. $950)'
                    }
                    value={formData.customBudget}
                    onChange={(e) => handleFieldChange('customBudget', e.target.value)}
                    className={`${fieldStyle(errors.budget)} mt-2`}
                  />
                )}
                {errors.budget && <p className="alpha-form-error">{errors.budget}</p>}
              </div>

              <div>
                <label className="alpha-form-label">
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
                    <option key={item.id} value={item.id} className="alpha-form-option">
                      {item.label[detectedLang]}
                    </option>
                  ))}
                </select>
                {errors.timeline && <p className="alpha-form-error">{errors.timeline}</p>}
              </div>
            </div>

            {/* ۸. توضیحات پروژه */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="alpha-form-label mb-0">
                  {isRTL
                    ? '۸. توضیحات پروژه (نیازها، ایده‌ها و جزئیات) *'
                    : '8. Project Description (Needs, Ideas & Details) *'}
                </label>
                <span className="alpha-form-counter">
                  {formData.description.length}/1000
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                required
                placeholder={
                  isRTL
                    ? 'لطفاً ایده‌ها، اهداف، ویژگی‌های مدنظر و جزئیات مهم پروژه خود را بنویسید...'
                    : 'Describe your project goals, target audience, required features, and ideas...'
                }
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={`${fieldStyle(errors.description)} resize-none leading-relaxed`}
              />
              {errors.description && (
                <p className="alpha-form-error">{errors.description}</p>
              )}
            </div>

            {/* ۹. فوتر و دکمه ارسال درخواست */}
            <div className="alpha-form-footer">
              <span className="alpha-form-security">
                <svg
                  className="alpha-form-security-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>
                  {isRTL
                    ? 'اطلاعات شما با امنیت کامل در سیستم ثبت می‌شود.'
                    : 'Your details are securely validated and stored.'}
                </span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group alpha-form-submit-btn"
              >
                <span>
                  {isSubmitting
                    ? isRTL
                      ? 'در حال ارسال...'
                      : 'Submitting...'
                    : isRTL
                    ? 'ثبت و ارسال درخواست پروژه'
                    : 'Submit Project Request'}
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
  );

} 