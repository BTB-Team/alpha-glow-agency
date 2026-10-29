import { create } from 'zustand';

export const useStore = create((set) => ({
  // زبان فعال با بازیابی از حافظه محلی
  language: localStorage.getItem('ag_lang') || 'fa',
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
}));