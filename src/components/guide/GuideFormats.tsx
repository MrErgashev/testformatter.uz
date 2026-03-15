import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FormatItem {
  titleKey: string;
  descKey: string;
  ext: string;
  color: 'blue' | 'emerald' | 'slate';
  icon: React.ReactNode;
}

function FormatCard({ item, index }: { item: FormatItem; index: number }) {
  const { t } = useTranslation();
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-400/5',
      border: 'border-blue-500/15 dark:border-blue-400/10',
      text: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-500/15 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/5',
      border: 'border-emerald-500/15 dark:border-emerald-400/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500/15 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
    },
    slate: {
      bg: 'bg-slate-500/10 dark:bg-white/5',
      border: 'border-slate-500/15 dark:border-white/10',
      text: 'text-slate-600 dark:text-white/70',
      badge: 'bg-slate-500/15 dark:bg-white/10 text-slate-600 dark:text-white/70',
    },
  };
  const c = colorMap[item.color];

  return (
    <motion.div
      className={`glass neo-raised rounded-xl p-5 border ${c.border}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="font-['Outfit',sans-serif] font-semibold text-slate-800 dark:text-white/90">
              {t(item.titleKey)}
            </h4>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${c.badge}`}>
              {item.ext}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-white/45 leading-relaxed">
            {t(item.descKey)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function GuideFormats() {
  const { t } = useTranslation();

  const inputFormats: FormatItem[] = [
    {
      titleKey: 'guide.formats.txtTitle',
      descKey: 'guide.formats.txtDesc',
      ext: '.txt',
      color: 'slate',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      titleKey: 'guide.formats.docxTitle',
      descKey: 'guide.formats.docxDesc',
      ext: '.docx',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  const outputFormats: FormatItem[] = [
    {
      titleKey: 'guide.formats.hemisTitle',
      descKey: 'guide.formats.hemisDesc',
      ext: '.txt',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      titleKey: 'guide.formats.kahootTitle',
      descKey: 'guide.formats.kahootDesc',
      ext: '.xlsx',
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="mb-20">
      <motion.h2
        className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10 text-slate-800 dark:text-white/90"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('guide.formats.title')}
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div>
          <motion.h3
            className="font-['Outfit',sans-serif] text-lg font-semibold text-slate-600 dark:text-white/60 mb-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {t('guide.formats.input')}
          </motion.h3>
          <div className="space-y-3">
            {inputFormats.map((item, i) => (
              <FormatCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <motion.h3
            className="font-['Outfit',sans-serif] text-lg font-semibold text-slate-600 dark:text-white/60 mb-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t('guide.formats.output')}
          </motion.h3>
          <div className="space-y-3">
            {outputFormats.map((item, i) => (
              <FormatCard key={i} item={item} index={i + 2} />
            ))}
          </div>
        </div>
      </div>

      {/* Sample format visual */}
      <motion.div
        className="mt-10 glass neo-raised rounded-2xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-['Outfit',sans-serif] font-semibold text-slate-700 dark:text-white/80 mb-4 text-center">
          {t('guide.formats.input')} — TXT
        </h4>
        <div className="bg-slate-900/80 dark:bg-black/40 rounded-xl p-5 font-mono text-sm leading-relaxed overflow-x-auto">
          <div className="text-slate-400 dark:text-white/30">
            <span className="text-blue-400">1.</span> <span className="text-white/80">O'zbekiston poytaxti qaysi shahar?</span>
          </div>
          <div className="text-slate-400 dark:text-white/30 pl-4 mt-1">
            <span className="text-emerald-400 font-bold">*</span><span className="text-cyan-400">A)</span> <span className="text-white/70">Toshkent</span>
          </div>
          <div className="text-slate-400 dark:text-white/30 pl-4">
            <span className="text-cyan-400">B)</span> <span className="text-white/70">Samarqand</span>
          </div>
          <div className="text-slate-400 dark:text-white/30 pl-4">
            <span className="text-cyan-400">C)</span> <span className="text-white/70">Buxoro</span>
          </div>
          <div className="text-slate-400 dark:text-white/30 pl-4">
            <span className="text-cyan-400">D)</span> <span className="text-white/70">Namangan</span>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-white/25 mt-3">
          <span className="text-emerald-500 font-bold">*</span> = to'g'ri javob / correct answer / правильный ответ
        </p>
      </motion.div>
    </section>
  );
}
