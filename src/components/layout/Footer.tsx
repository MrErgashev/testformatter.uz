export function Footer() {
  return (
    <footer className="border-t border-slate-200/50 dark:border-white/5 py-8 text-center">
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
