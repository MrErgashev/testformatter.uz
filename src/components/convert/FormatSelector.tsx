import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/app-store';
import { generateHemis } from '../../lib/hemis-generator';
import { generateKahoot } from '../../lib/kahoot-generator';
import { downloadText, downloadBlob } from '../../utils/download';
import { addToHistory } from '../../lib/history';
import type { OutputFormat } from '../../types';

const formats: { id: OutputFormat; titleKey: string; descKey: string; color: 'blue' | 'emerald' }[] = [
  { id: 'hemis', titleKey: 'convert.hemis', descKey: 'convert.hemisDesc', color: 'blue' },
  { id: 'kahoot', titleKey: 'convert.kahoot', descKey: 'convert.kahootDesc', color: 'emerald' },
];

function HemisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function KahootIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

export function FormatSelector() {
  const { t } = useTranslation();
  const store = useAppStore();
  const { selectedFormat, setSelectedFormat, parseResult, file, setError } = store;
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDownload = async () => {
    if (!parseResult || !file) return;

    setIsDownloading(true);

    try {
      const fileName = file.name;
      const questionCount = parseResult.questions.length;

      if (selectedFormat === 'hemis') {
        const result = generateHemis(parseResult.questions);
        downloadText(result, fileName.replace(/\.\w+$/, '_HEMIS.txt'));
      } else {
        const blob = await generateKahoot(parseResult.questions);
        downloadBlob(blob, fileName.replace(/\.\w+$/, '_Kahoot.xlsx'));
      }

      addToHistory(fileName, questionCount, selectedFormat);
      store.setShowSuccess(true);
      setShowConfetti(true);

      // Fire confetti
      const end = Date.now() + 1500;
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 }, colors });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors });
      }, 300);

      const burstInterval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(burstInterval);
          return;
        }
        confetti({ particleCount: 20, spread: 100, origin: { x: Math.random(), y: Math.random() * 0.4 + 0.4 }, colors });
      }, 400);

      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.downloadFailed');
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Format cards */}
      <div className="grid grid-cols-2 gap-4">
        {formats.map((fmt) => {
          const isSelected = selectedFormat === fmt.id;
          const Icon = fmt.id === 'hemis' ? HemisIcon : KahootIcon;
          const isBlue = fmt.color === 'blue';

          return (
            <motion.button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex flex-col items-center gap-3 px-6 py-6 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                isSelected
                  ? isBlue
                    ? 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-400/40 dark:border-blue-500/30 ring-2 ring-blue-500 shadow-lg shadow-blue-500/15 backdrop-blur-sm'
                    : 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-400/40 dark:border-emerald-500/30 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/15 backdrop-blur-sm'
                  : 'glass hover:brightness-105 dark:hover:brightness-125'
              )}
            >
              <Icon
                className={cn(
                  'w-10 h-10',
                  isSelected
                    ? isBlue ? 'text-blue-500 dark:text-blue-400' : 'text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-white/40'
                )}
              />

              <div>
                <h3
                  className={cn(
                    'text-sm font-semibold mb-1',
                    isSelected
                      ? isBlue ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-white/80'
                  )}
                >
                  {t(fmt.titleKey)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed">
                  {t(fmt.descKey)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Download button */}
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading || !parseResult || parseResult.questions.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'relative w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all',
          'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
          'hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg'
        )}
      >
        {isDownloading ? (
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {t('convert.download')}
      </motion.button>

      {/* Success overlay */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl glass-strong neo-raised">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <svg className="w-16 h-16 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white/90">
              {t('convert.success')}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
