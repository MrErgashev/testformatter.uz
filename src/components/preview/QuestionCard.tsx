import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { ParsedQuestion } from '../../types';

interface QuestionCardProps {
  question: ParsedQuestion;
  index: number;
}

const answerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const },
  }),
};

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <div className={cn(
      'rounded-xl overflow-hidden border-l-2 border-l-blue-500',
      'glass',
      'neo-raised',
    )}>
      {/* Question header */}
      <div className="px-5 py-4 flex items-start gap-3 border-b border-slate-100/50 dark:border-white/5">
        <span className="shrink-0 inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-400 text-xs font-semibold">
          #{index + 1}
        </span>
        <p className="text-sm font-medium text-slate-800 dark:text-white/90 leading-relaxed pt-0.5">
          {question.text}
        </p>
      </div>

      {/* Answers */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {question.answers.map((answer, i) => (
          <motion.div
            key={answer.letter}
            custom={i}
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
              answer.isCorrect
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300'
                : 'bg-slate-50/50 dark:bg-white/5 text-slate-700 dark:text-white/70'
            )}
          >
            <span
              className={cn(
                'shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold uppercase',
                answer.isCorrect
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-slate-200/70 dark:bg-white/10 text-slate-500 dark:text-white/50'
              )}
            >
              {answer.letter}
            </span>
            <span className="text-sm leading-relaxed flex-1">{answer.text}</span>
            {answer.isCorrect && (
              <svg className="shrink-0 w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
