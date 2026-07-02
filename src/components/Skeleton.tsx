import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ variant = 'rectangular', className = '', ...props }, ref) => {
        const variants = {
            text: 'rounded-md h-4',
            circular: 'rounded-full',
            rectangular: 'rounded-flx',
        };

        return (
            <div
                ref={ref}
                className={[
                    'flx-skeleton animate-pulse bg-surface-hover',
                    variants[variant],
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';