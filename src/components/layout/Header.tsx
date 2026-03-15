import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/app-store';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  const { t } = useTranslation();
  const { currentView, setCurrentView, reset } = useAppStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'glass-strong',
        'px-3 sm:px-6 py-3',
        'backdrop-blur-xl',
        'border-b border-white/20'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex cursor-pointer items-center gap-2.5" onClick={() => { reset(); setCurrentView('app'); }}>
          <div
            className="relative flex items-center justify-center rounded-xl p-2.5"
            style={{
              background: 'linear-gradient(145deg, #3b82f6, #06b6d4)',
              boxShadow: '3px 3px 8px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.15), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.15)',
            }}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="bolt-fill" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
                </linearGradient>
                <filter id="bolt-shadow">
                  <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodColor="rgba(0,0,0,0.3)" />
                </filter>
              </defs>
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="url(#bolt-fill)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.5"
                filter="url(#bolt-shadow)"
              />
            </svg>
          </div>
          <span
            className={cn(
              'text-xl font-bold tracking-tight',
              'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent',
            )}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            TestFormatter
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Guide button */}
          <motion.button
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer',
              'transition-colors duration-150',
              currentView === 'guide'
                ? 'bg-blue-500/15 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-white/60 hover:bg-white/50 dark:hover:bg-white/5'
            )}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView(currentView === 'guide' ? 'app' : 'guide')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">{t('guide.nav')}</span>
          </motion.button>

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
