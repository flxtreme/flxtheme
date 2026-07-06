import React from 'react';
import { cn } from '../utils/cn';

export interface DataGridColumn<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataGridProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  filterKeys?: (keyof T)[];
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataGrid<T>({
  columns,
  data,
  rowKey,
  filterKeys,
  size = 'md',
  bordered = true,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  ...props
}: DataGridProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [query, setQuery] = React.useState('');

  const handleSort = (col: DataGridColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const filtered = React.useMemo(() => {
    if (!query || !filterKeys?.length) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      filterKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [data, query, filterKeys]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns]);

  const baseClass = 'flx-datagrid flex flex-col gap-3';

  const cellSizeClasses: Record<string, string> = {
    sm: 'flx-datagrid--sm text-xs py-2 px-3',
    md: 'flx-datagrid--md text-sm py-3 px-4',
    lg: 'flx-datagrid--lg text-base py-3.5 px-5',
  };

  const alignClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const classes = cn(baseClass, className);

  return (
    <div className={classes} {...props}>
      {filterKeys && filterKeys.length > 0 && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter..."
          className="flx-datagrid__filter w-full max-w-xs rounded-flx border-[1.5px] border-solid border-border px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
        />
      )}
      <div
        className={cn(
          'flx-datagrid__scroll overflow-x-auto rounded-flx',
          bordered ? 'border-[1.5px] border-solid border-border' : ''
        )}
      >
        <table className="flx-datagrid__table w-full border-collapse">
          <thead>
            <tr className="flx-datagrid__header-row bg-surface-hover">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col)}
                  className={cn(
                    'flx-datagrid__header font-semibold text-foreground/70 select-none',
                    cellSizeClasses[size],
                    alignClasses[col.align || 'left'],
                    col.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="flx-datagrid__sort-icon inline-flex flex-col w-3">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className={cn(
                            'w-3 h-3 transition-transform',
                            sortKey === col.key && sortDir === 'desc' ? 'rotate-180' : '',
                            sortKey === col.key ? 'text-foreground' : 'text-foreground/30'
                          )}
                        >
                          <path
                            d="M6 9l6-6 6 6M6 15l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="flx-datagrid__body divide-y divide-solid divide-border">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="flx-datagrid__empty text-center py-10 text-sm text-foreground/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'flx-datagrid__row transition-colors',
                    onRowClick ? 'cursor-pointer hover:bg-surface-hover' : ''
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'flx-datagrid__cell text-foreground',
                        cellSizeClasses[size],
                        alignClasses[col.align || 'left']
                      )}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataGrid.displayName = 'DataGrid';
