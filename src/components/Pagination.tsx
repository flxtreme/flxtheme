import React from 'react';
import { cn } from '../utils/cn';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  current: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      total,
      current,
      pageSize = 10,
      onPageChange,
      showQuickJumper = false,
      showTotal = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const totalPages = Math.ceil(total / pageSize);
    const canPrevious = current > 1;
    const canNext = current < totalPages;

    const renderPageNumbers = () => {
      const pages: (number | string)[] = [];
      const delta = 2;
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];
      let l: number | undefined;

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
          range.push(i);
        }
      }

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      });

      return rangeWithDots.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${idx}`}
              className="flx-pagination__dots px-2 py-1 text-foreground-muted"
            >
              {page}
            </span>
          );
        }

        const isActive = page === current;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={cn(
              'flx-pagination__number min-w-[40px] h-10 px-3 py-2 rounded-flx text-sm font-medium transition-all duration-200 border border-transparent outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40',
              isActive
                ? 'flx-pagination__number--active bg-primary text-white'
                : 'flx-pagination__number--inactive text-foreground hover:bg-surface-hover border-border'
            )}
          >
            {page}
          </button>
        );
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flx-pagination flex items-center justify-between gap-4',
          className,
        )}
        {...props}
      >
        <div className="flx-pagination__info flex items-center gap-4">
          {showTotal && (
            <span className="flx-pagination__total text-sm text-foreground-muted">
              Total {total} items
            </span>
          )}
        </div>

        <div className="flx-pagination__controls flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(current - 1)}
            disabled={!canPrevious}
            className={cn(
              'flx-pagination__prev min-w-[40px] h-10 px-3 py-2 rounded-flx text-sm font-medium transition-all duration-200 border border-border outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40',
              canPrevious
                ? 'text-foreground hover:bg-surface-hover cursor-pointer'
                : 'text-foreground-muted opacity-50 cursor-not-allowed'
            )}
          >
            Previous
          </button>

          <div className="flx-pagination__pages flex items-center gap-1">
            {renderPageNumbers()}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(current + 1)}
            disabled={!canNext}
            className={cn(
              'flx-pagination__next min-w-[40px] h-10 px-3 py-2 rounded-flx text-sm font-medium transition-all duration-200 border border-border outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40',
              canNext
                ? 'text-foreground hover:bg-surface-hover cursor-pointer'
                : 'text-foreground-muted opacity-50 cursor-not-allowed'
            )}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
