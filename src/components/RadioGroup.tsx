import React from 'react';
import { cn } from '../utils/cn';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: RadioOption[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  direction?: 'vertical' | 'horizontal';
  name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      direction = 'vertical',
      name = 'radio-group',
      className = '',
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(value ?? defaultValue ?? options[0]?.value);

    const handleChange = (newValue: string | number) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flx-radio-group',
          direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'flex flex-col gap-3',
          className,
        )}
        role="radiogroup"
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flx-radio-item flex items-center gap-2 cursor-pointer select-none',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              disabled={option.disabled}
              className="flx-radio__input sr-only"
            />
            <span
              className={cn(
                'flx-radio__indicator w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                selectedValue === option.value
                  ? 'border-primary bg-primary'
                  : 'border-border hover:border-primary/50',
                option.disabled && 'cursor-not-allowed'
              )}
            >
              {selectedValue === option.value && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </span>
            <span className={cn(
              'flx-radio__label text-sm font-medium',
              selectedValue === option.value ? 'text-foreground' : 'text-foreground-muted'
            )}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
