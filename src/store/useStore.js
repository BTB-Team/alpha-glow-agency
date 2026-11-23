import { create } from 'zustand';

export const useStore = create((set) => ({
  // زبان فعال با بازیابی از حافظه محلی (پیش‌فرض انگلیسی)
  language: localStorage.getItem('ag_lang') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('ag_lang', lang);
    set({ language: lang });
  },

  // تم با بازیابی از حافظه محلی
  theme: localStorage.getItem('ag_theme') || 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ag_theme', newTheme);
      return { theme: newTheme };
    }),

  // کنترل گلوبال مودال فرم درخواست پروژه از هر صفحه‌ای
  isProjectModalOpen: false,
  projectModalContext: {
    service: null,
    referenceProject: null,
  },
  openProjectModal: (context = {}) =>
    set({
      isProjectModalOpen: true,
      projectModalContext: {
        service: typeof context === 'string' ? context : context?.service || null,
        referenceProject:
          typeof context === 'object' ? context?.referenceProject || null : null,
      },
    }),
  closeProjectModal: () =>
    set({
      isProjectModalOpen: false,
      projectModalContext: {
        service: null,
        referenceProject: null,
      },
    }),
}));