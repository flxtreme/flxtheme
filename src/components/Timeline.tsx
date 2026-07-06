import React from 'react';
import { cn } from '../utils/cn';

export interface TimelineItemData {
  id: string | number;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'destructive';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItemData[];
  size?: 'sm' | 'md' | 'lg';
}

const statusDotClasses: Record<string, string> = {
  default: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  destructive: 'bg-destructive',
};

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, size = 'md', className = '', ...props }, ref) => {
    const baseClass = 'flx-timeline flex flex-col';

    const gapClasses: Record<string, string> = {
      sm: 'flx-timeline--sm',
      md: 'flx-timeline--md',
      lg: 'flx-timeline--lg',
    };

    const classes = cn(baseClass, gapClasses[size], className);

    return (
      <div ref={ref} className={classes} {...props}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={item.id} className="flx-timeline__row flex gap-3">
              <div className="flx-timeline__rail flex flex-col items-center">
                <span
                  className={cn(
                    'flx-timeline__dot flex items-center justify-center shrink-0 rounded-full w-6 h-6 text-white',
                    statusDotClasses[item.status || 'default']
                  )}
                >
                  {item.icon ?? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                {!isLast && (
                  <span className="flx-timeline__connector w-px flex-1 bg-border my-1" />
                )}
              </div>
              <div className={cn('flx-timeline__content pb-6', isLast ? 'pb-0' : '')}>
                <div className="flx-timeline__header flex items-center gap-2 flex-wrap">
                  <span className="flx-timeline__title font-semibold text-sm text-foreground">
                    {item.title}
                  </span>
                  {item.timestamp && (
                    <span className="flx-timeline__timestamp text-xs text-foreground/50">
                      {item.timestamp}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="flx-timeline__description text-sm text-foreground/60 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';
