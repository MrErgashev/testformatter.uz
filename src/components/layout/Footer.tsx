import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/50 dark:border-white/5 py-8 text-center">
      <p
        className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-white/40 mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <svg
          className="h-4 w-4 text-slate-300 dark:text-white/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        {t('footer.privacy')}
      </p>

      <div className="w-12 h-px bg-slate-200 dark:bg-white/10 mx-auto mb-4" />

      <div className="space-y-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p className="text-sm font-medium text-slate-600 dark:text-white/70">
          Muallif: Ergashev Muhammadsodiq
        </p>
        <p className="text-sm text-slate-400 dark:text-white/40">
          Tel:{' '}
          <a
            href="tel:+998997520565"
            className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            +998(99) 752-05-65
          </a>
        </p>
      </div>
    </footer>
  );
}
