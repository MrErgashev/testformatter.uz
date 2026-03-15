import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'glass-strong',
        'px-6 py-3',
        'backdrop-blur-xl',
        'border-b border-white/20'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex cursor-pointer items-center gap-2.5" onClick={() => window.location.reload()}>
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
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
