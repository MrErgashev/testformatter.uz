import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from './store/app-store';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DropZone } from './components/upload/DropZone';
import { QuestionList } from './components/preview/QuestionList';
import { FormatSelector } from './components/convert/FormatSelector';
import { HistoryPanel } from './components/history/HistoryPanel';
import { StepIndicator } from './components/ui/StepIndicator';

function App() {
  const { t } = useTranslation();
  const { theme, parseResult, showSuccess } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const hasQuestions = parseResult && parseResult.questions.length > 0;

  // Step logic
  const currentStep = !parseResult
    ? 'upload' as const
    : showSuccess
      ? 'download' as const
      : 'preview' as const;

  return (
    <div
      className={`min-h-screen font-['DM_Sans',sans-serif] transition-colors duration-500 ${
        theme === 'dark' ? 'bg-dark-base text-white/90' : 'bg-light-base text-slate-900'
      }`}
    >
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Hero — fayl yuklaganda yo'qoladi */}
        <AnimatePresence>
          {!parseResult && (
            <motion.section
              key="hero"
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="text-3d-hero font-['Outfit',sans-serif] text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4"
                data-text={t('app.title')}
              >
                <span>{t('app.title')}</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-white/50 max-w-2xl mx-auto mb-4">
                {t('app.subtitle')}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-500 dark:text-white/50 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                {t('app.privacy')}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <StepIndicator currentStep={currentStep} />
        </motion.section>

        {/* Upload */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <DropZone />
        </motion.section>

        {/* Preview & Convert */}
        {hasQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
              <div className="lg:col-span-3">
                <QuestionList />
              </div>
              <div className="lg:col-span-2">
                <FormatSelector />
              </div>
            </div>
          </motion.div>
        )}

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <HistoryPanel />
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
