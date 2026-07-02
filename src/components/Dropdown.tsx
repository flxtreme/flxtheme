import React, { useState, useRef, useEffect } from 'react';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`flx-dropdown relative inline-block ${className}`}>
      <div className="flx-dropdown__trigger cursor-pointer" onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div className={`flx-dropdown__menu absolute top-[calc(100%+0.375rem)] z-[60] min-w-[12rem] bg-surface border border-solid border-border rounded-flx shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-1.5 animate-flx-slide-up ${align === 'left' ? 'flx-dropdown__menu--left left-0' : 'flx-dropdown__menu--right right-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

Dropdown.displayName = 'Dropdown';

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ icon, disabled = false, className = '', children, onClick, ...props }, ref) => {
    const classes = [
      'flx-dropdown__item flex items-center gap-2 py-2 px-3 text-[0.875rem] text-foreground rounded-[calc(var(--flx-radius)-0.125rem)] cursor-pointer transition-colors duration-150 hover:bg-surface-hover',
      disabled ? 'flx-dropdown__item--disabled opacity-45 cursor-not-allowed pointer-events-none' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        onClick={disabled ? undefined : onClick}
        role="menuitem"
        {...props}
      >
        {icon && <span className="flx-dropdown__item-icon flex items-center text-base text-muted-foreground">{icon}</span>}
        <span>{children}</span>
      </div>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export const DropdownDivider: React.FC = () => <div className="flx-dropdown__divider h-px bg-border my-1.5" />;

DropdownDivider.displayName = 'DropdownDivider';
