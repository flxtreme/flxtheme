import React from 'react';
import { cn } from '../utils/cn';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      removable = false,
      onRemove,
      icon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass =
      'flx-tag inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap select-none transition-all duration-200';

    const variantClasses: Record<string, string> = {
      primary: 'flx-tag--primary bg-primary text-white',
      secondary: 'flx-tag--secondary bg-surface-hover text-foreground',
      outline: 'flx-tag--outline bg-transparent text-foreground border-[1.5px] border-solid border-border',
      ghost: 'flx-tag--ghost bg-primary/10 text-primary',
      destructive: 'flx-tag--destructive bg-destructive/10 text-destructive',
      success: 'flx-tag--success bg-emerald-500/10 text-emerald-600',
      warning: 'flx-tag--warning bg-amber-500/10 text-amber-600',
    };

    const sizeClasses: Record<string, string> = {
      xs: 'flx-tag--xs text-[0.625rem] px-2 py-0.5',
      sm: 'flx-tag--sm text-xs px-2.5 py-0.5',
      md: 'flx-tag--md text-[0.8125rem] px-3 py-1',
      lg: 'flx-tag--lg text-sm px-3.5 py-1.5',
    };

    const classes = cn(
      baseClass,
      variantClasses[variant],
      sizeClasses[size],
      removable ? 'flx-tag--removable' : '',
      className
    );

    return (
      <span ref={ref} className={classes} {...props}>
        {icon && <span className="flx-tag__icon inline-flex shrink-0">{icon}</span>}
        <span className="flx-tag__label">{children}</span>
        {removable && (
          <button
            type="button"
            className="flx-tag__remove inline-flex items-center justify-center shrink-0 rounded-full hover:bg-black/10 w-3.5 h-3.5 -mr-1 transition-colors"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// Chip is a semantic alias of Tag with the same styling contract
export const Chip = Tag;
export type ChipProps = TagProps;
