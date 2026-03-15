import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function GuideHero() {
  const { t } = useTranslation();

  return (
    <section className="text-center mb-20">
      {/* Animated illustration */}
      <motion.div
        className="relative mx-auto mb-10 w-64 h-64 sm:w-80 sm:h-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />

        {/* Central file icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* File body */}
            <motion.rect
              x="25" y="10" width="70" height="90" rx="8"
              className="stroke-blue-500 dark:stroke-blue-400"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            {/* File fold */}
            <motion.path
              d="M70 10 L95 35 L70 35 Z"
              className="stroke-blue-500 dark:stroke-blue-400"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
            />
            {/* Text lines */}
            {[0, 1, 2, 3].map((i) => (
              <motion.rect
                key={i}
                x="38"
                y={50 + i * 12}
                width={i === 3 ? 30 : 44}
                height="3"
                rx="1.5"
                className="fill-blue-400/60 dark:fill-blue-300/40"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.15 }}
              />
            ))}
            {/* Checkmark */}
            <motion.path
              d="M35 55 L42 62 L55 48"
              className="stroke-emerald-500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            />
          </svg>
        </motion.div>

        {/* Orbiting format badges */}
        <motion.div
          className="absolute top-4 right-4 sm:top-6 sm:right-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="glass neo-raised px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            HEMIS .txt
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-2 sm:bottom-10 sm:left-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="glass neo-raised px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            Kahoot .xlsx
          </motion.div>
        </motion.div>

        {/* Arrow from file to HEMIS */}
        <motion.svg
          className="absolute top-12 right-16 sm:top-14 sm:right-14 w-12 h-12"
          viewBox="0 0 48 48"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <motion.path
            d="M8 40 Q24 20 40 8"
            className="stroke-blue-400/50 dark:stroke-blue-300/30"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2.4 }}
          />
        </motion.svg>

        {/* Arrow from file to Kahoot */}
        <motion.svg
          className="absolute bottom-16 left-14 sm:bottom-18 sm:left-12 w-12 h-12"
          viewBox="0 0 48 48"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          <motion.path
            d="M40 8 Q24 28 8 40"
            className="stroke-emerald-400/50 dark:stroke-emerald-300/30"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
          />
        </motion.svg>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-['Outfit',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {t('guide.hero.title')}
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg sm:text-xl text-slate-500 dark:text-white/50 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {t('guide.hero.subtitle')}
      </motion.p>
    </section>
  );
}
