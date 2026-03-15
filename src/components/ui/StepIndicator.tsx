import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

type Step = 'upload' | 'preview' | 'download';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps: { id: Step; icon: 'upload' | 'eye' | 'download' }[] = [
  { id: 'upload', icon: 'upload' },
  { id: 'preview', icon: 'eye' },
  { id: 'download', icon: 'download' },
];

const stepOrder: Record<Step, number> = { upload: 0, preview: 1, download: 2 };

function StepIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === 'upload') {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14V4" />
        <polyline points="6 8 10 4 14 8" />
        <path d="M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
      </svg>
    );
  }
  if (icon === 'eye') {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6v8" />
      <polyline points="6 10 10 14 14 10" />
      <path d="M3 5V4a2 2 0 012-2h10a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = stepOrder[currentStep];

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
                isCompleted && 'bg-blue-500/15 border-2 border-blue-500 backdrop-blur-sm',
                isCurrent && 'bg-gradient-to-r from-blue-600 to-cyan-500 border-2 border-blue-400/50 shadow-lg shadow-blue-500/30',
                isFuture && 'glass border-2 border-transparent',
              )}
            >
              {isCompleted ? (
                <CheckIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              ) : (
                <StepIcon
                  icon={step.icon}
                  className={cn(
                    'w-4 h-4',
                    isCurrent && 'text-white',
                    isFuture && 'text-slate-400 dark:text-white/40',
                  )}
                />
              )}
            </motion.div>

            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div className="relative w-16 sm:w-24 h-0.5 mx-1">
                <div className="absolute inset-0 bg-slate-200 dark:bg-white/10 rounded-full" />
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: i < currentIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
