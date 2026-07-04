import React, { useState, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  isActive?: boolean;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  isActive?: boolean;
}

const TabsContext = React.createContext<{
  activeTab: string;
  onTabChange: (value: string) => void;
  direction: 'horizontal' | 'vertical';
}>({
  activeTab: '',
  onTabChange: () => {},
  direction: 'horizontal',
});

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      direction = 'horizontal',
      defaultValue = '',
      value,
      onValueChange,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState(value ?? defaultValue);

    const handleTabChange = (newValue: string) => {
      setActiveTab(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange, direction }}>
        <div
          ref={ref}
          className={cn(
            'flx-tabs',
            direction === 'vertical' ? 'flx-tabs--vertical flex gap-4' : 'flx-tabs--horizontal',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    {
      direction = 'horizontal',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = direction === 'horizontal'
      ? 'flx-tabs__list border-b border-border flex gap-0 overflow-x-auto'
      : 'flx-tabs__list--vertical flex flex-col gap-0 border-r border-border pr-4';

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    {
      value,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(TabsContext);
    const isActive = context.activeTab === value;

    const baseClass = 'flx-tabs__trigger px-4 py-2 text-sm font-medium border-b-[2px] border-transparent text-foreground-muted hover:text-foreground transition-all duration-200 cursor-pointer outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40';

    const activeClass = isActive
      ? 'flx-tabs__trigger--active border-b-primary text-primary'
      : 'flx-tabs__trigger--inactive hover:border-b-border';

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        className={cn(
          baseClass,
          activeClass,
          className,
        )}
        onClick={() => context.onTabChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  (
    {
      value,
      isActive,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(TabsContext);
    const show = isActive ?? context.activeTab === value;

    if (!show) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'flx-tabs__content pt-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
