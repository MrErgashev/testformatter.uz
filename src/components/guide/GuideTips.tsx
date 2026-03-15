import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function TipItem({ questionKey, answerKey, index }: { questionKey: string; answerKey: string; index: number }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="glass neo-raised rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors hover:bg-white/30 dark:hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 pr-4">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </span>
          <span className="font-['DM_Sans',sans-serif] font-medium text-slate-700 dark:text-white/80 text-sm sm:text-base">
            {t(questionKey)}
          </span>
        </div>
        <motion.span
          className="shrink-0 text-slate-400 dark:text-white/30"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pl-15">
              <div className="pl-10 border-l-2 border-blue-500/20 dark:border-blue-400/10">
                <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed py-1">
                  {t(answerKey)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function GuideTips() {
  const { t } = useTranslation();

  const tips = [
    { q: 'guide.tips.q1', a: 'guide.tips.a1' },
    { q: 'guide.tips.q2', a: 'guide.tips.a2' },
    { q: 'guide.tips.q3', a: 'guide.tips.a3' },
    { q: 'guide.tips.q4', a: 'guide.tips.a4' },
    { q: 'guide.tips.q5', a: 'guide.tips.a5' },
  ];

  return (
    <section className="mb-16">
      <motion.h2
        className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10 text-slate-800 dark:text-white/90"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('guide.tips.title')}
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-3">
        {tips.map((tip, i) => (
          <TipItem key={i} questionKey={tip.q} answerKey={tip.a} index={i} />
        ))}
      </div>
    </section>
  );
}
