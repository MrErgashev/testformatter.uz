import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app-store';
import { QuestionCard } from './QuestionCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function QuestionList() {
  const { t } = useTranslation();
  const parseResult = useAppStore((s) => s.parseResult);

  if (!parseResult) return null;

  const { questions, errors } = parseResult;

  const errorQuestionNumbers = new Set(
    errors.filter((e) => e.questionNumber > 0).map((e) => e.questionNumber)
  );

  function getErrorMessage(err: typeof errors[number]): string {
    if (err.type === 'no_correct') return t('preview.noCorrectAnswer');
    if (err.type === 'few_answers') return t('preview.fewAnswers');
    return err.message;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white/90">
          {t('preview.title')}
        </h2>
        <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-400 text-xs font-semibold">
          {questions.length}
        </span>
      </div>

      {/* Error banner */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <svg
              className="w-4 h-4 text-amber-500 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {t('preview.warnings', { count: errors.length })}
            </span>
          </div>
          <ul className="space-y-0.5 pl-6">
            {errors.map((err, i) => (
              <li
                key={i}
                className="text-xs text-amber-600/80 dark:text-amber-400/80 list-disc"
              >
                {err.questionNumber > 0
                  ? `${t('preview.question')} #${err.questionNumber}: `
                  : ''}
                {getErrorMessage(err)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Question cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1"
      >
        {questions.map((question, index) => (
          <motion.div key={index} variants={cardVariants}>
            <QuestionCard
              question={question}
              index={index}
              hasError={errorQuestionNumbers.has(question.number)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
