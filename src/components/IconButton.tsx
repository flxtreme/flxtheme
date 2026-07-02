import React from 'react';
import { cn } from '../utils/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', icon, className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover border-transparent',
      secondary: 'bg-secondary text-white hover:bg-secondary-hover border-transparent',
      outline: 'bg-transparent text-primary hover:bg-muted border-primary',
      ghost: 'bg-transparent text-foreground hover:bg-muted border-transparent',
      destructive: 'bg-transparent text-destructive hover:bg-destructive/10 border-transparent',
    };
    const sizes = {
      sm: 'w-7 h-7 text-sm',
      md: 'w-9 h-9 text-base',
      lg: 'w-11 h-11 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flx-icon-btn inline-flex items-center justify-center rounded-flx border border-solid',
          'cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';