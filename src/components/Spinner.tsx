import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'muted';
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
    ({ size = 'md', variant = 'primary', className = '', ...props }, ref) => {
        const sizes = {
            sm: 'w-4 h-4 border-2',
            md: 'w-5 h-5 border-2',
            lg: 'w-8 h-8 border-[3px]',
        };
        const variants = {
            primary: 'border-primary/25 border-t-primary',
            secondary: 'border-secondary/25 border-t-secondary',
            muted: 'border-border border-t-muted-foreground',
        };

        return (
            <span
                ref={ref}
                role="status"
                aria-label="Loading"
                className={[
                    'flx-spinner inline-block rounded-full animate-spin',
                    sizes[size],
                    variants[variant],
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            />
        );
    }
);

Spinner.displayName = 'Spinner';