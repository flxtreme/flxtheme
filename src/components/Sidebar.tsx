import React, { useState } from 'react';
import { FiChevronLeft, FiMenu } from 'react-icons/fi';
import { IconButton } from './IconButton';
import { cn } from '../utils/cn';

export interface SidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  width?: string;
  collapsedWidth?: string;
  title?: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      collapsed: controlledCollapsed,
      onCollapsedChange,
      width = '228px',
      collapsedWidth = '80px',
      title,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);

    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const handleToggle = () => {
      const next = !collapsed;

      if (!isControlled) {
        setInternalCollapsed(next);
      }

      onCollapsedChange?.(next);
    };

    const classes = cn(
      'flx-sidebar bg-surface border-r border-solid border-border flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out z-40',
      collapsed ? 'flx-sidebar--collapsed' : '',
      className
    );

    return (
      <aside
        ref={ref}
        className={classes}
        style={{ width: collapsed ? collapsedWidth : width }}
        {...props}
      >
        {/* Header */}
        <div
          className={cn(
            'flx-sidebar__header flex items-center h-14 overflow-hidden shrink-0',
            collapsed ? 'justify-center px-4' : 'px-4'
          )}
        >
          <IconButton className='mr-2' onClick={handleToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} icon={
            <FiChevronLeft
              size={18}
              className={cn(
                'transition-all duration-200',
                collapsed ? 'rotate-[180deg]' : ''
              )}
            />
          } />

          <div className={cn(
            'flx-sidebar__title flex-1 font-extrabold text-base text-primary tracking-tight truncate transition-opacity duration-200',
            collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}>
            {title}
          </div>
        </div>

        <div className="flx-sidebar__content flex-1 overflow-y-auto overflow-x-hidden py-4" style={{ width }}>
          {children}
        </div>
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';