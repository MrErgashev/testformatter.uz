import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app-store';
import { cn } from '../../utils/cn';

const languages = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Ру' },
  { code: 'en', label: 'En' },
] as const;

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const handleChange = (code: (typeof languages)[number]['code']) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center',
        'rounded-xl p-1',
        'glass',
      )}
    >
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={cn(
              'relative z-10 px-3 py-1.5 text-xs font-semibold rounded-lg',
              'font-["DM_Sans",sans-serif]',
              'transition-all duration-200 cursor-pointer select-none',
              isActive
                ? 'text-white'
                : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80',
            )}
            aria-label={`Switch language to ${lang.label}`}
          >
            {isActive && (
              <motion.span
                layoutId="lang-indicator"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            <span className="relative z-10">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
