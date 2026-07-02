import React from 'react';
import { cn } from '../utils/cn';

/* ─── Table ─── */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  bordered?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ striped = false, hoverable = true, compact = false, bordered = false, className = '', children, ...props }, ref) => {
    const classes = cn(
      'flx-table-wrapper w-full overflow-x-auto rounded-flx border border-solid border-border',
      className
    );

    const tableClasses = cn(
      'flx-table w-full border-collapse text-left text-[0.875rem]',
      striped ? 'flx-table--striped [&_tbody_tr:nth-child(even)]:bg-muted/20' : '',
      hoverable ? 'flx-table--hoverable [&_tbody_tr:hover]:bg-muted/30' : '',
      compact ? 'flx-table--compact [&_th]:py-2 [&_th]:px-3 [&_td]:py-2 [&_td]:px-3' : '',
      bordered ? 'flx-table--bordered [&_th]:border [&_th]:border-solid [&_th]:border-border [&_td]:border [&_td]:border-solid [&_td]:border-border' : '',
      className,
    );

    return (
      <div className={classes}>
        <table ref={ref} className={tableClasses} {...props}>
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

/* ─── TableHeader ─── */
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> { }

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <thead ref={ref} className={cn(
      'flx-table__header bg-muted/50 border-b border-solid border-border',
      className
    )} {...props}>
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

/* ─── TableBody ─── */
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> { }

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <tbody ref={ref} className={cn(
      'flx-table__body',
      className
    )} {...props}>
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

/* ─── TableRow ─── */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected = false, className = '', children, ...props }, ref) => {
    const classes = cn(
      'flx-table__row transition-colors',
      selected ? 'flx-table__row--selected bg-primary/5' : '',
      className
    );
    return (
      <tr ref={ref} className={classes} {...props}>
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

/* ─── TableCell ─── */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  header?: boolean;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ header = false, className = '', children, ...props }, ref) => {
    const Tag = header ? 'th' : 'td';
    const classes = cn(
      header ? 'flx-table__th p-4 font-semibold text-muted-foreground whitespace-nowrap' : 'flx-table__td p-4 border-b border-solid border-border text-foreground transition-colors',
      className,
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

TableCell.displayName = 'TableCell';
