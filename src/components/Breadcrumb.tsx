import React from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  href?: string;
}

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      separator = '/',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
      <nav
        ref={ref}
        className={cn(
          'flx-breadcrumb',
          className,
        )}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flx-breadcrumb__list flex items-center gap-2 flex-wrap">
          {childrenArray.map((child, index) => (
            <li key={index} className="flx-breadcrumb__item flex items-center gap-2">
              {child}
              {index < childrenArray.length - 1 && (
                <span className="flx-breadcrumb__separator text-foreground-muted">
                  {separator}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbItem = React.forwardRef<HTMLDivElement, BreadcrumbItemProps>(
  (
    {
      isActive = false,
      href,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'flx-breadcrumb__link text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40 rounded-sm px-1';

    const activeClass = isActive
      ? 'flx-breadcrumb__link--active text-foreground cursor-default'
      : 'flx-breadcrumb__link--inactive text-foreground-muted hover:text-primary cursor-pointer';

    if (href && !isActive) {
      return (
        <a
          ref={ref as any}
          href={href}
          className={cn(baseClass, activeClass, className)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClass, activeClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
