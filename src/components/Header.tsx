import React from 'react';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ logo, actions, sticky = true, className = '', children, ...props }, ref) => {
    const classes = [
      'flx-header bg-surface z-50',
      sticky ? 'flx-header--sticky sticky top-0' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <header ref={ref} className={classes} {...props}>
        <div className="flx-header__inner flex items-center h-14 px-6 gap-4 max-w-full">
          {logo && <div className="flx-header__logo flex items-center text-xl font-bold text-primary shrink-0">{logo}</div>}
          <div className="flx-header__content flex-1 flex items-center justify-end">{children}</div>
          {actions && <div className="flx-header__actions flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';
