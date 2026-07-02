import React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
    size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary/10 text-primary border-primary/20',
            secondary: 'bg-secondary/10 text-secondary border-secondary/20',
            success: 'bg-success/10 text-success border-success/20',
            warning: 'bg-warning/10 text-warning border-warning/20',
            destructive: 'bg-destructive/10 text-destructive border-destructive/20',
            outline: 'bg-transparent text-foreground border-border',
        };
        const sizes = {
            sm: 'px-1.5 py-px text-[0.65rem]',
            md: 'px-2 py-0.5 text-xs',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'flx-badge inline-flex items-center rounded-full border border-solid font-semibold leading-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';