import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import type { ParsedQuestion, ParsedAnswer } from '../../types';

interface QuestionCardProps {
  question: ParsedQuestion;
  index: number;
  hasError?: boolean;
  onUpdate?: (question: ParsedQuestion) => void;
  onDelete?: () => void;
}

const answerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const },
  }),
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function QuestionCard({ question, index, hasError, onUpdate, onDelete }: QuestionCardProps) {
  const { t } = useTranslation();
  const hasText = question.text.trim().length > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question.text);
  const [editAnswers, setEditAnswers] = useState<ParsedAnswer[]>(question.answers);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditText(question.text);
    setEditAnswers(question.answers.map((a) => ({ ...a })));
    setIsEditing(true);
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    if (!onUpdate) return;
    onUpdate({
      ...question,
      text: editText,
      answers: editAnswers,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  const handleAnswerTextChange = (i: number, text: string) => {
    setEditAnswers((prev) => prev.map((a, idx) => (idx === i ? { ...a, text } : a)));
  };

  const handleCorrectToggle = (i: number) => {
    setEditAnswers((prev) =>
      prev.map((a, idx) => ({ ...a, isCorrect: idx === i }))
    );
  };

  const handleDeleteAnswer = (i: number) => {
    if (editAnswers.length <= 2) return;
    setEditAnswers((prev) => {
      const filtered = prev.filter((_, idx) => idx !== i);
      return filtered.map((a, idx) => ({ ...a, letter: LETTERS[idx] || a.letter }));
    });
  };

  const handleAddAnswer = () => {
    if (editAnswers.length >= 8) return;
    const letter = LETTERS[editAnswers.length] || String(editAnswers.length + 1);
    setEditAnswers((prev) => [...prev, { letter, text: '', isCorrect: false }]);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  // Edit mode
  if (isEditing) {
    return (
      <motion.div
        layout
        className={cn(
          'rounded-xl overflow-hidden border-l-2 border-l-blue-500',
          'glass neo-raised',
          'ring-2 ring-blue-500/30 dark:ring-blue-400/20'
        )}
      >
        {/* Question text edit */}
        <div className="px-5 py-4 border-b border-slate-100/50 dark:border-white/5">
          <div className="flex items-start gap-3">
            <span className="shrink-0 inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500 dark:text-blue-400">
              #{index + 1}
            </span>
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onInput={handleTextareaInput}
              placeholder={t('edit.questionText')}
              className={cn(
                'flex-1 text-sm font-medium leading-relaxed resize-none bg-transparent',
                'border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                'text-slate-800 dark:text-white/90',
                'placeholder:text-slate-400 dark:placeholder:text-white/30'
              )}
              rows={1}
            />
          </div>
        </div>

        {/* Answers edit */}
        <div className="px-4 py-3 flex flex-col gap-2">
          {editAnswers.map((answer, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                answer.isCorrect
                  ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                  : 'bg-slate-50/50 dark:bg-white/5'
              )}
            >
              {/* Correct radio */}
              <button
                type="button"
                onClick={() => handleCorrectToggle(i)}
                title={t('edit.correctAnswer')}
                className={cn(
                  'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors',
                  answer.isCorrect
                    ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400'
                    : 'border-slate-300 dark:border-white/20 hover:border-emerald-400'
                )}
              >
                {answer.isCorrect && (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Letter badge */}
              <span className={cn(
                'shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold uppercase',
                answer.isCorrect
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-slate-200/70 dark:bg-white/10 text-slate-500 dark:text-white/50'
              )}>
                {answer.letter}
              </span>

              {/* Answer text input */}
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerTextChange(i, e.target.value)}
                placeholder={t('edit.answerText')}
                className={cn(
                  'flex-1 text-sm bg-transparent border-none focus:outline-none',
                  answer.isCorrect
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-white/70',
                  'placeholder:text-slate-400 dark:placeholder:text-white/30'
                )}
              />

              {/* Delete answer */}
              {editAnswers.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleDeleteAnswer(i)}
                  className="shrink-0 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {/* Add answer button */}
          {editAnswers.length < 8 && (
            <button
              type="button"
              onClick={handleAddAnswer}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-lg cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t('edit.addAnswer')}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors',
              showDeleteConfirm
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            {showDeleteConfirm ? t('edit.deleteConfirm') : t('edit.delete')}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1.5 text-sm text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
            >
              {t('edit.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-md shadow-blue-500/25 cursor-pointer hover:brightness-110 transition-all"
            >
              {t('edit.save')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Read-only mode (original)
  return (
    <div className={cn(
      'rounded-xl overflow-hidden border-l-2 group relative',
      hasError ? 'border-l-red-500' : 'border-l-blue-500',
      'glass',
      'neo-raised',
    )}>
      {/* Edit button */}
      {onUpdate && (
        <button
          type="button"
          onClick={handleStartEdit}
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-lg z-10 cursor-pointer',
            'text-slate-400 dark:text-white/30',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-white/60 dark:hover:bg-white/10 hover:text-blue-500 dark:hover:text-blue-400'
          )}
          title={t('edit.button')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      )}

      {/* Question header */}
      <div className={cn(
        'px-5 py-4 flex items-start gap-3 border-b border-slate-100/50 dark:border-white/5',
        hasError && 'bg-red-50/50 dark:bg-red-500/5'
      )}>
        <span className={cn(
          'shrink-0 inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full text-xs font-semibold',
          hasError
            ? 'bg-red-500/15 text-red-500 dark:text-red-400'
            : 'bg-blue-500/15 text-blue-500 dark:text-blue-400'
        )}>
          #{index + 1}
        </span>
        <p className={cn(
          'text-sm font-medium leading-relaxed pt-0.5',
          hasText
            ? 'text-slate-800 dark:text-white/90'
            : 'text-red-400 dark:text-red-400/70 italic'
        )}>
          {hasText ? question.text : `(${t('preview.noQuestionText')})`}
        </p>
      </div>

      {/* Answers */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {question.answers.map((answer, i) => (
          <motion.div
            key={`${answer.letter}-${i}`}
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
