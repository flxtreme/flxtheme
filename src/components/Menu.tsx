import React from 'react';

/* ─── Menu ─── */
export interface MenuProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'vertical' | 'horizontal';
}

export const Menu = React.forwardRef<HTMLElement, MenuProps>(
  ({ orientation = 'vertical', className = '', children, ...props }, ref) => {
    const classes = [
      'flx-menu w-full',
      orientation === 'vertical' ? 'flx-menu--vertical' : 'flx-menu--horizontal',
      className
    ].filter(Boolean).join(' ');

    return (
      <nav ref={ref} className={classes} role="navigation" {...props}>
        <ul className={`flx-menu__list list-none m-0 p-0 flex gap-0.5 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}>{children}</ul>
      </nav>
    );
  }
);

Menu.displayName = 'Menu';

/* ─── MenuItem ─── */
export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ active = false, disabled = false, icon, href, onClick, className = '', children, ...props }, ref) => {
    const classes = [
      'flx-menu__item',
      active ? 'flx-menu__item--active' : '',
      disabled ? 'flx-menu__item--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {icon && <span className="flx-menu__icon flex items-center text-lg shrink-0">{icon}</span>}
        <span className="flx-menu__label flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{children}</span>
      </>
    );

    const linkClasses = `flx-menu__link flex items-center gap-4 w-full py-2 px-7 border-none bg-transparent text-foreground no-underline text-[0.875rem] font-inherit cursor-pointer transition-colors duration-150 text-left ${active ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-surface-hover'} ${disabled ? 'opacity-45 cursor-not-allowed pointer-events-none' : ''}`;

    return (
      <li ref={ref} className={classes} {...props}>
        {href ? (
          <a href={href} className={linkClasses} onClick={disabled ? (e) => e.preventDefault() : onClick}>
            {content}
          </a>
        ) : (
          <button
            type="button"
            className={linkClasses}
            onClick={onClick}
            disabled={disabled}
          >
            {content}
          </button>
        )}
      </li>
    );
  }
);

MenuItem.displayName = 'MenuItem';

/* ─── MenuDivider ─── */
export const MenuDivider: React.FC = () => <li className="flx-menu__divider h-px bg-border mx-4 my-1.5" role="separator" />;

MenuDivider.displayName = 'MenuDivider';
