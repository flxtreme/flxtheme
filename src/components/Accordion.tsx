import React from 'react';
import { cn } from '../utils/cn';

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      type = 'single',
      defaultOpen = [],
      size = 'md',
      bordered = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(defaultOpen));

    const toggle = (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (type === 'single') next.clear();
          next.add(id);
        }
        return next;
      });
    };

    const baseClass = 'flx-accordion flex flex-col';

    const sizeClasses: Record<string, string> = {
      sm: 'flx-accordion--sm',
      md: 'flx-accordion--md',
      lg: 'flx-accordion--lg',
    };

    const headerSizeClasses: Record<string, string> = {
      sm: 'text-sm py-2.5 px-3',
      md: 'text-sm py-3 px-4',
      lg: 'text-base py-3.5 px-5',
    };

    const classes = cn(baseClass, sizeClasses[size], className);

    return (
      <div ref={ref} className={classes} {...props}>
        {items.map((item, i) => {
          const isOpen = openIds.has(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                'flx-accordion__item',
                bordered ? 'border-solid border-border border-b-[1.5px]' : '',
                bordered && i === 0 ? 'border-t-[1.5px]' : ''
              )}
            >
              <button
                type="button"
                disabled={item.disabled}
                aria-expanded={isOpen}
                onClick={() => !item.disabled && toggle(item.id)}
                className={cn(
                  'flx-accordion__trigger w-full flex items-center justify-between gap-2 font-medium text-foreground bg-transparent border-none cursor-pointer transition-colors hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed',
                  headerSizeClasses[size]
                )}
              >
                <span className="flx-accordion__title text-left">{item.title}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={cn(
                    'flx-accordion__chevron w-4 h-4 shrink-0 text-foreground/50 transition-transform duration-200',
                    isOpen ? 'rotate-180' : ''
                  )}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                className="flx-accordion__panel grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <div className="flx-accordion__content px-4 pb-4 text-sm text-foreground/70">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

// Collapse is a semantic alias of Accordion
export const Collapse = Accordion;
export type CollapseProps = AccordionProps;