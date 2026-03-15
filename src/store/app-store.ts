import { create } from 'zustand';
import type { ParseResult, OutputFormat, Theme, Language, CurrentView } from '../types';

interface AppState {
  file: File | null;
  parseResult: ParseResult | null;
  isLoading: boolean;
  error: string | null;
  selectedFormat: OutputFormat;
  theme: Theme;
  language: Language;
  showSuccess: boolean;
  splitCount: number;
  currentView: CurrentView;

  setFile: (file: File | null) => void;
  setParseResult: (result: ParseResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedFormat: (format: OutputFormat) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setShowSuccess: (show: boolean) => void;
  setSplitCount: (count: number) => void;
  setCurrentView: (view: CurrentView) => void;
  reset: () => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('testformatter_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useAppStore = create<AppState>((set) => ({
  file: null,
  parseResult: null,
  isLoading: false,
  error: null,
  selectedFormat: 'hemis',
  theme: getInitialTheme(),
  language: (localStorage.getItem('testformatter_lang') as Language) || 'uz',
  showSuccess: false,
  splitCount: 0,
  currentView: 'app',

  setFile: (file) => set({ file, error: null, showSuccess: false }),
  setParseResult: (parseResult) => set({ parseResult }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
  setTheme: (theme) => {
    localStorage.setItem('testformatter_theme', theme);
    set({ theme });
  },
  setLanguage: (language) => {
    localStorage.setItem('testformatter_lang', language);
    set({ language });
  },
  setShowSuccess: (showSuccess) => set({ showSuccess }),
  setSplitCount: (splitCount) => set({ splitCount }),
  setCurrentView: (currentView) => set({ currentView }),
  reset: () => set({ file: null, parseResult: null, error: null, showSuccess: false, splitCount: 0 }),
}));
