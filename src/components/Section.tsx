import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  padded?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ title, subtitle, padded = true, className = '', children, ...props }, ref) => {
    const classes = [
      'flx-section w-full max-w-7xl mx-auto',
      padded ? 'flx-section--padded py-12 px-6 md:py-16 md:px-8' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <section ref={ref} className={classes} {...props}>
        {(title || subtitle) && (
          <div className="flx-section__header mb-10 flex flex-col gap-3 max-w-3xl">
            {title && <h2 className="flx-section__title m-0 text-3xl font-extrabold tracking-tight text-foreground leading-[1.2]">{title}</h2>}
            {subtitle && <p className="flx-section__subtitle m-0 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
          </div>
        )}
        <div className="flx-section__body">{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';
