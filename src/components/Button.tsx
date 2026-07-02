import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'flx-btn inline-flex items-center justify-center gap-2 font-semibold border-none rounded-flx cursor-pointer transition-all duration-200 whitespace-nowrap select-none outline-none relative overflow-hidden focus-visible:ring-[3px] focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses: Record<string, string> = {
      primary: 'flx-btn--primary bg-primary text-white hover:enabled:bg-primary-hover hover:enabled:-translate-y-[1px] hover:enabled:shadow-[0_4px_12px_rgba(99,102,241,0.4)]',
      secondary: 'flx-btn--secondary bg-secondary text-white hover:enabled:bg-secondary-hover hover:enabled:-translate-y-[1px] hover:enabled:shadow-[0_4px_12px_rgba(139,92,246,0.4)]',
      outline: 'flx-btn--outline bg-transparent text-primary border-[1.5px] border-solid border-border hover:enabled:border-primary hover:enabled:bg-primary hover:enabled:text-white',
      ghost: 'flx-btn--ghost bg-transparent text-foreground hover:enabled:bg-surface-hover',
      destructive: 'flx-btn--destructive bg-destructive text-white hover:enabled:bg-destructive-hover hover:enabled:-translate-y-[1px] hover:enabled:shadow-[0_4px_12px_rgba(239,68,68,0.4)]',
      link: 'flx-btn--link bg-transparent text-primary underline underline-offset-2 hover:enabled:text-primary-hover'
    };

    const sizeClasses: Record<string, string> = {
      xs: 'flx-btn--xs text-xs px-2.5 py-1',
      sm: 'flx-btn--sm text-[0.8125rem] px-3.5 py-1.5',
      md: 'flx-btn--md text-sm px-[1.125rem] py-2',
      lg: 'flx-btn--lg text-base px-6 py-2.5',
      xl: 'flx-btn--xl text-lg px-8 py-3'
    };

    const classes = [
      baseClass,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'flx-btn--full w-full' : '',
      loading ? 'flx-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="flx-btn__spinner w-[1em] h-[1em] border-2 border-white/30 border-t-current rounded-full animate-spin" aria-hidden="true" />}
        <span className={loading ? 'flx-btn__content--loading opacity-70' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
