import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'flx-card rounded-flx bg-surface transition-all duration-200 overflow-hidden';

    const variantClasses: Record<string, string> = {
      default: 'flx-card--default border border-solid border-border',
      outlined: 'flx-card--outlined border-[1.5px] border-solid border-border bg-transparent',
      elevated: 'flx-card--elevated shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-solid border-border',
      filled: 'flx-card--filled bg-muted'
    };

    const paddingClasses: Record<string, string> = {
      none: 'flx-card--pad-none p-0',
      sm: 'flx-card--pad-sm p-3',
      md: 'flx-card--pad-md p-5',
      lg: 'flx-card--pad-lg p-8'
    };

    const classes = cn(
      baseClass,
      variantClasses[variant],
      paddingClasses[padding],
      hoverable ? 'flx-card--hoverable hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : '',
      className,
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flx-card__header pb-3 border-b border-solid border-border mb-4 font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flx-card__body',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flx-card__footer pt-3 border-t border-solid border-border mt-4 flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
