import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { getHistory, clearHistory } from '../../lib/history';
import { useAppStore } from '../../store/app-store';
import type { ConversionRecord } from '../../types';

function timeAgo(timestamp: number, lang: string): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return lang === 'uz' ? 'hozirgina' : lang === 'ru' ? 'только что' : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${lang === 'uz' ? 'daqiqa oldin' : lang === 'ru' ? 'мин. назад' : 'min ago'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${lang === 'uz' ? 'soat oldin' : lang === 'ru' ? 'ч. назад' : 'h ago'}`;
  const days = Math.floor(hours / 24);
  return `${days} ${lang === 'uz' ? 'kun oldin' : lang === 'ru' ? 'дн. назад' : 'd ago'}`;
}

export function HistoryPanel() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const showSuccess = useAppStore((s) => s.showSuccess);
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState<ConversionRecord[]>([]);

  useEffect(() => {
    setRecords(getHistory());
  }, [showSuccess]);

  const handleClear = () => {
    clearHistory();
    setRecords([]);
  };

  return (
    <div className="rounded-xl overflow-hidden glass neo-raised">
      {/* Header / toggle */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/30 dark:hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-white/80">
            {t('history.title')}
          </h3>
          {records.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-400 text-[11px] font-semibold">
              {records.length}
            </span>
          )}
        </div>

        <svg
          className={cn(
            'w-4 h-4 text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Collapsible body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-slate-100/50 dark:border-white/5">
              {records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <svg
                    className="w-8 h-8 text-slate-300 dark:text-white/20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <p className="text-xs text-slate-400 dark:text-white/40">
                    {t('history.empty')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end pt-3 pb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      className="text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {t('history.clear')}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 border-l-2 border-blue-500/20 dark:border-blue-500/15 pl-4 ml-2">
                    <AnimatePresence mode="popLayout">
                      {records.map((record) => (
                        <motion.div
                          key={record.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-white/80 truncate">
                              {record.fileName}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-white/40">
                              {record.questionCount} {t('history.questions')} &middot;{' '}
                              {timeAgo(record.timestamp, language)}
                            </p>
                          </div>

                          <span
                            className={cn(
                              'shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide',
                              record.outputFormat === 'hemis'
                                ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400'
                                : 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400'
                            )}
                          >
                            {record.outputFormat}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
