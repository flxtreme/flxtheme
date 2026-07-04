import React, { useState } from 'react';
import { cn } from '../utils/cn';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  dateFormat?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      helperText,
      error,
      dateFormat = 'YYYY-MM-DD',
      className = '',
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const baseInputClass = 'flx-date-picker__input w-full px-3.5 py-2 bg-surface border border-solid rounded-flx text-sm font-medium outline-none transition-all duration-200 placeholder:text-foreground-muted disabled:opacity-50 disabled:cursor-not-allowed focus:ring-[2px] focus:ring-primary/40 focus:border-primary';

    return (
      <div className={cn('flx-date-picker', className)}>
        {label && (
          <label className="flx-date-picker__label block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}

        <div className="flx-date-picker__wrapper relative">
          <input
            ref={ref}
            type="date"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              baseInputClass,
              error
                ? 'border-destructive focus:ring-destructive/40 focus:border-destructive'
                : 'border-border'
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="flx-date-picker__error text-xs text-destructive mt-1.5">{error}</p>
        )}
        {!error && helperText && (
          <p className="flx-date-picker__helper text-xs text-foreground-muted mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
