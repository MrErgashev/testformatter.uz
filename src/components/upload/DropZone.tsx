import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/app-store';
import { readFile } from '../../lib/file-reader';
import { parseTestText } from '../../lib/parser';
import { postprocessParseResult } from '../../utils/question-postprocess';
import { detectUnnumberedQuestions, autoNumberQuestions } from '../../utils/auto-number';
import { FileInfo } from './FileInfo';

const ACCEPTED_TYPES = '.txt,.doc,.docx';
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const VALID_MIMES = [
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

function CloudUploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M44 44a12 12 0 001.5-23.9A16 16 0 0014 24a16 16 0 001.2 6.1A10 10 0 0020 50h24a12 12 0 000-6" />
      <polyline points="32 42 32 22" />
      <polyline points="24 30 32 22 40 30" />
    </svg>
  );
}

export function DropZone() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [unnumberedText, setUnnumberedText] = useState<string | null>(null);

  const file = useAppStore((s) => s.file);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const setFile = useAppStore((s) => s.setFile);
  const setIsLoading = useAppStore((s) => s.setIsLoading);
  const setParseResult = useAppStore((s) => s.setParseResult);
  const setSplitCount = useAppStore((s) => s.setSplitCount);
  const setError = useAppStore((s) => s.setError);
  const reset = useAppStore((s) => s.reset);

  const processFile = useCallback(
    async (selectedFile: File) => {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setError(t('errors.fileTooLarge', { max: MAX_FILE_SIZE_MB }));
        return;
      }

      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      const isValidMime = VALID_MIMES.includes(selectedFile.type) || selectedFile.type === '';
      const isValidExt = ['txt', 'doc', 'docx'].includes(ext || '');
      if (!isValidExt || !isValidMime) {
        setError(t('errors.unsupportedFormat'));
        return;
      }

      setFile(selectedFile);
      setIsLoading(true);
      try {
        const text = await readFile(selectedFile);

        // Detect unnumbered questions and show confirmation dialog
        if (detectUnnumberedQuestions(text)) {
          setUnnumberedText(text);
          return;
        }

        const rawResult = parseTestText(text);
        const { result, splitCount } = postprocessParseResult(rawResult);

        if (result.questions.length === 0) {
          setError(t('errors.emptyFile'));
          return;
        }

        setParseResult(result);
        setSplitCount(splitCount);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'UNKNOWN_ERROR';
        if (message === 'DOC_NOT_SUPPORTED') {
          setError(t('errors.docNotSupported'));
        } else if (message === 'UNSUPPORTED_FORMAT') {
          setError(t('errors.unsupportedFormat'));
        } else {
          setError(t('errors.readFailed'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setFile, setIsLoading, setParseResult, setSplitCount, setError, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) processFile(droppedFile);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) processFile(selectedFile);
    },
    [processFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleAutoNumber = useCallback(() => {
    if (!unnumberedText) return;
    const numberedText = autoNumberQuestions(unnumberedText);
    setUnnumberedText(null);

    const rawResult = parseTestText(numberedText);
    const { result, splitCount } = postprocessParseResult(rawResult);

    if (result.questions.length === 0) {
      setError(t('errors.emptyFile'));
      return;
    }

    setParseResult(result);
    setSplitCount(splitCount);
  }, [unnumberedText, setParseResult, setSplitCount, setError, t]);

  const handleCancelAutoNumber = useCallback(() => {
    setUnnumberedText(null);
    reset();
  }, [reset]);

  // Unnumbered questions detected — show confirmation dialog
  if (unnumberedText) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong neo-raised rounded-2xl p-8 text-center"
      >
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3
          className="text-lg font-semibold text-slate-800 dark:text-white/90 mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {t('autoNumber.title')}
        </h3>

        <p
          className="text-sm text-slate-500 dark:text-white/50 mb-8 max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {t('autoNumber.description')}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCancelAutoNumber}
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'text-slate-600 dark:text-white/60',
              'hover:bg-slate-100 dark:hover:bg-white/5',
              'active:scale-95'
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t('autoNumber.cancel')}
          </button>
          <button
            onClick={handleAutoNumber}
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'bg-blue-500 text-white shadow-lg shadow-blue-500/25',
              'hover:bg-blue-600 hover:shadow-blue-500/40',
              'active:scale-95'
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t('autoNumber.confirm')}
          </button>
        </div>
      </motion.div>
    );
  }

  // File already loaded — show FileInfo
  if (file && !isLoading) {
    return (
      <div className="relative">
        <FileInfo />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 text-center text-sm text-red-500 dark:text-red-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative cursor-pointer rounded-2xl py-8 px-6 text-center transition-all duration-300',
        'glass-strong',
        'neo-raised',
        'dropzone-glow',
        isDragOver
          ? '!border-blue-500 !bg-blue-500/5 dark:!bg-blue-500/10'
          : isHovered
            ? '!border-blue-500/50 glow-blue'
            : ''
      )}
    >
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <svg
              className="h-8 w-8 animate-spin text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag-over pulsing ring */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.01, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl border-2 border-blue-500 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Upload icon with floating animation */}
      <div className="mb-4 flex justify-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudUploadIcon
            className={cn(
              'h-12 w-12 transition-colors duration-300',
              isDragOver || isHovered
                ? 'text-blue-500 dark:text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-slate-300 dark:text-white/20'
            )}
          />
        </motion.div>
      </div>

      {/* Text */}
      <p
        className="text-lg font-semibold text-slate-700 dark:text-white/90"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {t('upload.dropzone')}
      </p>
      <p
        className="mt-2 text-sm text-slate-500 dark:text-white/50"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <span className="text-blue-500 underline underline-offset-2 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
          {t('upload.browse')}
        </span>
      </p>
      <p
        className="mt-2 text-xs text-slate-400 dark:text-white/30"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {t('upload.formats')}
      </p>

      {/* Sample files download */}
      <div
        className="mt-3 pt-3 border-t border-slate-200/40 dark:border-white/8"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-xs text-slate-400 dark:text-white/35 mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {t('upload.sampleTitle')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/samples/namuna.txt"
            download="namuna.txt"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
              'hover:bg-blue-500/20 dark:hover:bg-blue-500/25 hover:scale-105'
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('upload.sampleTxt')}
          </a>
          <a
            href="/samples/namuna.docx"
            download="namuna.docx"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
              'hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25 hover:scale-105'
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('upload.sampleDocx')}
          </a>
        </div>
      </div>

      {/* Error message (when no file yet) */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 text-sm text-red-500 dark:text-red-400"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
