import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-sm font-medium rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base font-semibold rounded-xl gap-2.5',
} as const;

const variantClasses = {
  primary: [
    'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
    'shadow-lg shadow-blue-500/25',
    'hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110',
    'active:brightness-95',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'glass',
    'text-slate-800 dark:text-white/90',
    'hover:brightness-110 dark:hover:brightness-125',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-slate-700 dark:text-white/80',
    'hover:bg-white/50 dark:hover:bg-white/5',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
} as const;

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150',
          'font-["DM_Sans",sans-serif] cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        disabled={isDisabled}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && <Spinner className="shrink-0" />}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
