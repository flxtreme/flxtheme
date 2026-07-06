import React from 'react';
import { cn } from '../utils/cn';
import { Button, ButtonProps } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      secondaryAction,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClass =
      'flx-empty-state flex flex-col items-center justify-center text-center rounded-flx';

    const sizeClasses: Record<string, string> = {
      sm: 'flx-empty-state--sm py-8 px-4 gap-2',
      md: 'flx-empty-state--md py-14 px-6 gap-3',
      lg: 'flx-empty-state--lg py-20 px-8 gap-4',
    };

    const iconSizeClasses: Record<string, string> = {
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-18 h-18',
    };

    const classes = cn(baseClass, sizeClasses[size], className);

    return (
      <div ref={ref} className={classes} {...props}>
        {icon && (
          <div
            className={cn(
              'flx-empty-state__icon flex items-center justify-center rounded-full bg-surface-hover text-foreground/40',
              iconSizeClasses[size]
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3 className="flx-empty-state__title font-semibold text-foreground text-base">
          {title}
        </h3>
        {description && (
          <p className="flx-empty-state__description text-sm text-foreground/60 max-w-sm">
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="flx-empty-state__actions flex items-center gap-2 mt-2">
            {action && (
              <Button variant={action.variant || 'primary'} size="sm" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'ghost'}
                size="sm"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
