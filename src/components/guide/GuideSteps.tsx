import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StepData {
  badge: string;
  titleKey: string;
  descKey: string;
  tipKey: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

function UploadIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <svg ref={ref} viewBox="0 0 240 160" fill="none" className="w-full h-auto">
      {/* Dropzone outline */}
      <motion.rect
        x="20" y="10" width="200" height="140" rx="16"
        className="stroke-blue-400/40 dark:stroke-blue-300/20"
        strokeWidth="2"
        strokeDasharray="8 6"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.5 }}
      />
      {/* Upload cloud icon */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.path
          d="M100 50 C100 35 115 25 130 30 C135 20 150 15 160 25 C175 20 185 30 180 45 C190 45 195 60 185 65 L55 65 C45 60 50 45 60 45 C55 30 65 20 80 25 C85 15 100 20 100 30"
          className="fill-blue-100/80 dark:fill-blue-500/10 stroke-blue-400 dark:stroke-blue-300/50"
          strokeWidth="1.5"
        />
      </motion.g>
      {/* Upload arrow */}
      <motion.g
        animate={inView ? { y: [0, -5, 0] } : { y: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path
          d="M120 100 L120 70"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        <motion.path
          d="M110 80 L120 70 L130 80"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.3 }}
        />
      </motion.g>
      {/* File types */}
      <motion.text
        x="85" y="130"
        className="fill-slate-400 dark:fill-white/30"
        fontSize="11"
        fontFamily="'DM Sans', sans-serif"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5 }}
      >
        .txt  &middot;  .docx
      </motion.text>
    </svg>
  );
}

function PreviewIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const questions = [
    { w: 160, correct: 1 },
    { w: 140, correct: 2 },
    { w: 150, correct: 0 },
  ];

  return (
    <svg ref={ref} viewBox="0 0 240 160" fill="none" className="w-full h-auto">
      {questions.map((q, qi) => (
        <motion.g
          key={qi}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0.3 + qi * 0.2, duration: 0.5 }}
        >
          {/* Question card */}
          <rect
            x="15" y={10 + qi * 50}
            width="210" height="42" rx="8"
            className="fill-slate-50 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10"
            strokeWidth="1"
          />
          {/* Question number */}
          <circle
            cx="35" cy={31 + qi * 50}
            r="10"
            className="fill-blue-500/15 dark:fill-blue-400/10"
          />
          <text
            x="35" y={35 + qi * 50}
            textAnchor="middle"
            className="fill-blue-600 dark:fill-blue-400"
            fontSize="11"
            fontWeight="bold"
            fontFamily="'DM Sans', sans-serif"
          >
            {qi + 1}
          </text>
          {/* Question text placeholder */}
          <rect
            x="52" y={24 + qi * 50}
            width={q.w} height="5" rx="2.5"
            className="fill-slate-300 dark:fill-white/10"
          />
          <rect
            x="52" y={33 + qi * 50}
            width={q.w - 40} height="4" rx="2"
            className="fill-slate-200 dark:fill-white/5"
          />
          {/* Answer options */}
          {[0, 1, 2, 3].map((ai) => (
            <motion.rect
              key={ai}
              x={52 + ai * 42}
              y={24 + qi * 50}
              width="0"
              height="0"
              rx="0"
            />
          ))}
          {/* Correct indicator */}
          <motion.circle
            cx="210" cy={31 + qi * 50}
            r="6"
            className="fill-emerald-500/20 stroke-emerald-500 dark:fill-emerald-400/10 dark:stroke-emerald-400"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.8 + qi * 0.2, type: 'spring' }}
          />
          <motion.path
            d={`M206 ${31 + qi * 50} L209 ${34 + qi * 50} L215 ${28 + qi * 50}`}
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ delay: 1 + qi * 0.2, duration: 0.3 }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

function DownloadIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <svg ref={ref} viewBox="0 0 240 160" fill="none" className="w-full h-auto">
      {/* Two format cards */}
      {/* HEMIS card */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <rect
          x="10" y="15" width="100" height="100" rx="12"
          className="fill-blue-50 dark:fill-blue-400/5 stroke-blue-300 dark:stroke-blue-300/15"
          strokeWidth="1.5"
        />
        <text
          x="60" y="55"
          textAnchor="middle"
          className="fill-blue-600 dark:fill-blue-400"
          fontSize="13"
          fontWeight="bold"
          fontFamily="'Outfit', sans-serif"
        >
          HEMIS
        </text>
        <text
          x="60" y="72"
          textAnchor="middle"
          className="fill-blue-400/60 dark:fill-blue-300/40"
          fontSize="10"
          fontFamily="'DM Sans', sans-serif"
        >
          .txt
        </text>
        {/* Mini file icon */}
        <rect x="48" y="80" width="24" height="28" rx="3" className="stroke-blue-300 dark:stroke-blue-300/20" strokeWidth="1" fill="none" />
        <rect x="52" y="90" width="16" height="2" rx="1" className="fill-blue-300 dark:fill-blue-300/15" />
        <rect x="52" y="95" width="12" height="2" rx="1" className="fill-blue-300 dark:fill-blue-300/15" />
        <rect x="52" y="100" width="14" height="2" rx="1" className="fill-blue-300 dark:fill-blue-300/15" />
      </motion.g>

      {/* Kahoot card */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect
          x="130" y="15" width="100" height="100" rx="12"
          className="fill-emerald-50 dark:fill-emerald-400/5 stroke-emerald-300 dark:stroke-emerald-300/15"
          strokeWidth="1.5"
        />
        <text
          x="180" y="55"
          textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400"
          fontSize="13"
          fontWeight="bold"
          fontFamily="'Outfit', sans-serif"
        >
          Kahoot
        </text>
        <text
          x="180" y="72"
          textAnchor="middle"
          className="fill-emerald-400/60 dark:fill-emerald-300/40"
          fontSize="10"
          fontFamily="'DM Sans', sans-serif"
        >
          .xlsx
        </text>
        {/* Mini spreadsheet icon */}
        <rect x="168" y="80" width="24" height="28" rx="3" className="stroke-emerald-300 dark:stroke-emerald-300/20" strokeWidth="1" fill="none" />
        <line x1="168" y1="90" x2="192" y2="90" className="stroke-emerald-300 dark:stroke-emerald-300/10" strokeWidth="0.8" />
        <line x1="168" y1="96" x2="192" y2="96" className="stroke-emerald-300 dark:stroke-emerald-300/10" strokeWidth="0.8" />
        <line x1="180" y1="80" x2="180" y2="108" className="stroke-emerald-300 dark:stroke-emerald-300/10" strokeWidth="0.8" />
      </motion.g>

      {/* Download arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.path
          d="M120 125 L120 150"
          className="stroke-slate-400 dark:stroke-white/30"
          strokeWidth="2"
          strokeLinecap="round"
          animate={inView ? { y: [0, 3, 0] } : { y: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M114 145 L120 152 L126 145"
          className="stroke-slate-400 dark:stroke-white/30"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={inView ? { y: [0, 3, 0] } : { y: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
    </svg>
  );
}

export function GuideSteps() {
  const { t } = useTranslation();

  const steps: StepData[] = [
    {
      badge: t('guide.step1.badge'),
      titleKey: 'guide.step1.title',
      descKey: 'guide.step1.desc',
      tipKey: 'guide.step1.tip',
      color: 'blue',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      illustration: <UploadIllustration />,
    },
    {
      badge: t('guide.step2.badge'),
      titleKey: 'guide.step2.title',
      descKey: 'guide.step2.desc',
      tipKey: 'guide.step2.tip',
      color: 'cyan',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      illustration: <PreviewIllustration />,
    },
    {
      badge: t('guide.step3.badge'),
      titleKey: 'guide.step3.title',
      descKey: 'guide.step3.desc',
      tipKey: 'guide.step3.tip',
      color: 'emerald',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-cyan-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      illustration: <DownloadIllustration />,
    },
  ];

  return (
    <section className="mb-20">
      <div className="space-y-12 lg:space-y-16">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="glass neo-raised rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Text content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-3 mb-5"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} text-white font-bold text-sm shadow-lg`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {step.badge}
                  </span>
                  <span className="text-white/60 dark:text-white/30">
                    {step.icon}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-slate-800 dark:text-white/90"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {t(step.titleKey)}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-base sm:text-lg text-slate-600 dark:text-white/60 mb-5 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  {t(step.descKey)}
                </motion.p>

                {/* Tip */}
                <motion.div
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/10 dark:border-blue-400/10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <svg className="w-5 h-5 mt-0.5 text-blue-500 dark:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-white/50 leading-relaxed">
                    {t(step.tipKey)}
                  </span>
                </motion.div>
              </div>

              {/* Illustration */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="glass rounded-xl p-4 sm:p-6">
                  {step.illustration}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
