import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'success' | 'warning' | 'destructive';
    showLabel?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ value, size = 'md', variant = 'primary', showLabel = false, className = '', ...props }, ref) => {
        const clamped = Math.max(0, Math.min(100, value));

        const sizes = {
            sm: 'h-1',
            md: 'h-2',
            lg: 'h-3',
        };
        const variants = {
            primary: 'bg-primary',
            success: 'bg-success',
            warning: 'bg-warning',
            destructive: 'bg-destructive',
        };

        return (
            <div className="flx-progress-wrap flex items-center gap-3 w-full">
                <div
                    ref={ref}
                    role="progressbar"
                    aria-valuenow={clamped}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className={[
                        'flx-progress flex-1 w-full bg-surface-hover rounded-full overflow-hidden',
                        sizes[size],
                        className,
                    ].filter(Boolean).join(' ')}
                    {...props}
                >
                    <div
                        className={['h-full rounded-full transition-all duration-300', variants[variant]].join(' ')}
                        style={{ width: `${clamped}%` }}
                    />
                </div>
                {showLabel && (
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums w-8 text-right shrink-0">
                        {clamped}%
                    </span>
                )}
            </div>
        );
    }
);

Progress.displayName = 'Progress';