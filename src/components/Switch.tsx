import React from 'react';
import { cn } from '../utils/cn';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      helperText,
      className = '',
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flx-switch__wrapper">
        <label className={cn(
          'flx-switch flex items-center gap-3 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
        )}>
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="flx-switch__input sr-only"
            {...props}
          />
          <div className={cn(
            'flx-switch__toggle relative w-11 h-6 rounded-full transition-all duration-200 flex items-center',
            checked
              ? 'bg-primary'
              : 'bg-border',
            disabled && 'cursor-not-allowed',
          )}>
            <span
              className={cn(
                'flx-switch__thumb absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm',
                checked ? 'translate-x-5' : 'translate-x-0.5',
              )}
            />
          </div>
          {label && (
            <span className={cn(
              'flx-switch__label text-sm font-medium',
              checked ? 'text-foreground' : 'text-foreground-muted'
            )}>
              {label}
            </span>
          )}
        </label>
        {helperText && (
          <p className="flx-switch__helper text-xs text-foreground-muted mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
