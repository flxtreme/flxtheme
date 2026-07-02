import React from 'react';
import { cn } from '../utils/cn';

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      title,
      subtitle,
      actions,
      backgroundImage,
      overlay = true,
      centered = true,
      size = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      sm: 'flx-hero--sm min-h-[240px] p-8',
      md: 'flx-hero--md min-h-[400px] p-12',
      lg: 'flx-hero--lg min-h-[560px] p-16',
      full: 'flx-hero--full min-h-screen p-16'
    };

    const classes = cn(
      'flx-hero relative flex items-center bg-gradient-to-br from-primary to-secondary text-white overflow-hidden bg-cover bg-center',
      sizeClasses[size],
      centered ? 'flx-hero--centered justify-center text-center' : '',
      backgroundImage ? `flx-hero--bg bg-[url(${backgroundImage})]` : '',
      className,
    );

    return (
      <section ref={ref} className={classes} {...props}>
        {backgroundImage && overlay && <div className="flx-hero__overlay absolute inset-0 bg-black/45" />}
        <div className={cn('flx-hero__content relative z-10 flex flex-col gap-4 max-w-5xl', centered ? 'items-center' : '')}>
          <h1 className="flx-hero__title text-5xl font-extrabold leading-[1.15] m-0">{title}</h1>
          {subtitle && <p className="flx-hero__subtitle text-xl opacity-90 max-w-2xl m-0">{subtitle}</p>}
          {actions && <div className="flx-hero__actions flex gap-3 mt-2">{actions}</div>}
          {children}
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';
