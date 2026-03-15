import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app-store';
import { Button } from '../ui/Button';
import { GuideHero } from './GuideHero';
import { GuideSteps } from './GuideSteps';
import { GuideFormats } from './GuideFormats';
import { GuideTips } from './GuideTips';

export function UserGuide() {
  const { t } = useTranslation();
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Back button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('app')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t('guide.back')}
          </Button>
        </motion.div>

        <GuideHero />
        <GuideSteps />
        <GuideFormats />
        <GuideTips />

        {/* CTA */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => setCurrentView('app')}
          >
            {t('guide.tryNow')}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </motion.div>
      </main>
    </motion.div>
  );
}
