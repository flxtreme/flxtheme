import React from 'react';
import { cn } from '../utils/cn';

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
                className={cn(
                    'flx-skeleton animate-pulse bg-surface-hover',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';