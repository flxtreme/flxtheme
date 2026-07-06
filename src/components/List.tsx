import React from 'react';
import { cn } from '../utils/cn';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  bordered?: boolean;
  divided?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ bordered = false, divided = true, size = 'md', className = '', children, ...props }, ref) => {
    const baseClass = 'flx-list flex flex-col list-none m-0 p-0 rounded-flx';

    const classes = cn(
      baseClass,
      bordered ? 'flx-list--bordered border-[1.5px] border-solid border-border' : '',
      divided ? 'flx-list--divided divide-y divide-solid divide-border' : '',
      className
    );

    return (
      <ul ref={ref} className={classes} {...props}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<ListItemProps>, { size })
            : child
        )}
      </ul>
    );
  }
);

List.displayName = 'List';

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  disabled?: boolean;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      trailing,
      title,
      description,
      size = 'md',
      interactive = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'flx-list-item flex items-center gap-3 transition-colors duration-150';

    const sizeClasses: Record<string, string> = {
      sm: 'flx-list-item--sm py-2 px-3',
      md: 'flx-list-item--md py-3 px-4',
      lg: 'flx-list-item--lg py-4 px-5',
    };

    const classes = cn(
      baseClass,
      sizeClasses[size],
      interactive && !disabled ? 'flx-list-item--interactive cursor-pointer hover:bg-surface-hover' : '',
      disabled ? 'flx-list-item--disabled opacity-50 cursor-not-allowed' : '',
      className
    );

    return (
      <li ref={ref} className={classes} aria-disabled={disabled} {...props}>
        {leading && <div className="flx-list-item__leading shrink-0 flex items-center">{leading}</div>}
        <div className="flx-list-item__body flex-1 min-w-0">
          {title && (
            <div className="flx-list-item__title font-medium text-sm text-foreground truncate">
              {title}
            </div>
          )}
          {description && (
            <div className="flx-list-item__description text-xs text-foreground/60 truncate">
              {description}
            </div>
          )}
          {children}
        </div>
        {trailing && <div className="flx-list-item__trailing shrink-0 flex items-center">{trailing}</div>}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';