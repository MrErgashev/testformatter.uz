import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hover = false }) => {
  const Component = hover ? motion.div : 'div';

  const hoverProps = hover
    ? {
        whileHover: {
          scale: 1.015,
          boxShadow: '0 0 30px -10px rgba(59, 130, 246, 0.15)',
        },
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-2xl p-6',
        'glass',
        'neo-raised',
        hover && 'cursor-pointer',
        className,
      )}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};

export default Card;
