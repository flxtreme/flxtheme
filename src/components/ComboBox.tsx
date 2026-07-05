import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface ComboBoxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  options: ComboBoxOption[];
  value?: string | number | null;
  onValueChange?: (value: string | number | null) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export const ComboBox = React.forwardRef<HTMLDivElement, ComboBoxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select an option...',
      label,
      searchable = true,
      clearable = true,
      disabled = false,
      error,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const filtered = options.filter(opt =>
      opt.label.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
      onValueChange?.(optionValue);
      setOpen(false);
      setSearchText('');
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.(null);
      setSearchText('');
    };

    return (
      <div
        ref={ref}
        className={cn('flx-combobox', className)}
        {...props}
      >
        {label && (
          <label className="flx-combobox__label block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}

        <div ref={containerRef} className="flx-combobox__container relative">
          <div
            className={cn(
              'flx-combobox__trigger flex items-center gap-2 px-3.5 py-2 bg-surface border border-solid rounded-flx cursor-pointer transition-all duration-200',
              open
                ? 'border-primary ring-[2px] ring-primary/40'
                : error
                ? 'border-destructive'
                : 'border-border hover:border-primary/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && setOpen(!open)}
          >
            {searchable && open ? (
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
            ) : (
              <span className={cn(
                'flex-1 text-sm',
                selectedOption ? 'text-foreground' : 'text-foreground-muted'
              )}>
                {selectedOption?.label || placeholder}
              </span>
            )}

            <div className="flex items-center gap-1">
              {clearable && value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-foreground-muted hover:text-foreground"
                >
                  ✕
                </button>
              )}
              <svg
                className={cn(
                  'w-4 h-4 text-foreground-muted transition-transform',
                  open && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="flx-combobox__dropdown absolute top-full left-0 right-0 mt-1 bg-surface border border-solid border-border rounded-flx shadow-lg z-50 max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                <ul className="flx-combobox__list py-1">
                  {filtered.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        'flx-combobox__item px-3.5 py-2 text-sm cursor-pointer transition-colors',
                        value === option.value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-surface-hover text-foreground'
                      )}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3.5 py-4 text-center text-sm text-foreground-muted">
                  No options found
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="flx-combobox__error text-xs text-destructive mt-1.5">{error}</p>
        )}
        {!error && helperText && (
          <p className="flx-combobox__helper text-xs text-foreground-muted mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

ComboBox.displayName = 'ComboBox';
