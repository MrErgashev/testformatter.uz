import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/app-store';
import { readFile } from '../../lib/file-reader';
import { parseTestText } from '../../lib/parser';
import { FileInfo } from './FileInfo';

const ACCEPTED_TYPES = '.txt,.doc,.docx';

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

  const file = useAppStore((s) => s.file);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const setFile = useAppStore((s) => s.setFile);
  const setIsLoading = useAppStore((s) => s.setIsLoading);
  const setParseResult = useAppStore((s) => s.setParseResult);
  const setError = useAppStore((s) => s.setError);

  const processFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setIsLoading(true);
      try {
        const text = await readFile(selectedFile);
        const result = parseTestText(text);
        setParseResult(result);
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
    [setFile, setIsLoading, setParseResult, setError, t]
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
