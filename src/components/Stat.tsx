import React from 'react';
import { cn } from '../utils/cn';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'flat';
  };
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const TrendArrow = ({ direction }: { direction: 'up' | 'down' | 'flat' }) => {
  if (direction === 'flat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
        <path d="M5 12h14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    );
  }
  const rotate = direction === 'up' ? '' : 'rotate-180';
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('w-3.5 h-3.5', rotate)}>
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  (
    { label, value, trend, icon, size = 'md', bordered = false, className = '', ...props },
    ref
  ) => {
    const baseClass = 'flx-stat flex flex-col gap-1.5 rounded-flx bg-surface';

    const sizeClasses: Record<string, string> = {
      sm: 'flx-stat--sm p-3',
      md: 'flx-stat--md p-4',
      lg: 'flx-stat--lg p-5',
    };

    const valueSizeClasses: Record<string, string> = {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    };

    const trendColorClasses: Record<string, string> = {
      up: 'text-emerald-600 bg-emerald-500/10',
      down: 'text-destructive bg-destructive/10',
      flat: 'text-foreground/50 bg-surface-hover',
    };

    const classes = cn(
      baseClass,
      sizeClasses[size],
      bordered ? 'flx-stat--bordered border-[1.5px] border-solid border-border' : '',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        <div className="flx-stat__header flex items-center justify-between">
          <span className="flx-stat__label text-sm font-medium text-foreground/60">{label}</span>
          {icon && (
            <span className="flx-stat__icon inline-flex items-center justify-center text-foreground/40 w-5 h-5">
              {icon}
            </span>
          )}
        </div>
        <div className="flx-stat__body flex items-end justify-between gap-2">
          <span className={cn('flx-stat__value font-bold text-foreground', valueSizeClasses[size])}>
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'flx-stat__trend inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                trendColorClasses[trend.direction]
              )}
            >
              <TrendArrow direction={trend.direction} />
              {trend.value}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Stat.displayName = 'Stat';

// KPICard is a semantic alias of Stat
export const KPICard = Stat;
export type KPICardProps = StatProps;
