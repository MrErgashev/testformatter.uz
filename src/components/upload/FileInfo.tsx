import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/app-store';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function getExtension(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return `.${ext}`;
}

export function FileInfo() {
  const file = useAppStore((s) => s.file);
  const reset = useAppStore((s) => s.reset);

  if (!file) return null;

  const ext = getExtension(file.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'flex items-center gap-3 rounded-xl px-5 py-4',
        'glass',
        'neo-raised',
      )}
    >
      {/* Document icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
        <svg
          className="h-5 w-5 text-blue-500 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      {/* File details */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-semibold text-slate-800 dark:text-white/90"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {file.name}
        </p>
        <p
          className="text-xs text-slate-500 dark:text-white/50"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Extension badge */}
      <span
        className={cn(
          'shrink-0 rounded-md px-2.5 py-1 text-xs font-medium',
          'bg-blue-500/10 text-blue-600 border border-blue-200/50',
          'dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20'
        )}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {ext}
      </span>

      {/* Remove button */}
      <button
        type="button"
        onClick={reset}
        className={cn(
          'shrink-0 rounded-lg p-1.5 transition-colors',
          'text-slate-400 hover:text-red-500 hover:bg-red-50',
          'dark:text-white/40 dark:hover:text-red-400 dark:hover:bg-red-500/10'
        )}
        aria-label="Remove file"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}
