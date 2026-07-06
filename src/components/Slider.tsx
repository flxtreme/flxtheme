import React from 'react';
import { cn } from '../utils/cn';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValue?: boolean;
  step?: number;
  marks?: number[];
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = 50,
      marks,
      className = '',
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(Number(e.target.value));
      onChange?.(e);
    };

    const percentage =
      ((Number(currentValue) - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="flx-slider__wrapper">
        {label && (
          <label className="flx-slider__label block text-sm font-medium text-foreground mb-2">
            {label}
            {showValue && (
              <span className="flx-slider__value float-right font-semibold text-primary">
                {currentValue}
              </span>
            )}
          </label>
        )}

        <div className="flx-slider__container relative pt-2">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'flx-slider__input w-full h-2 bg-border rounded-full outline-none appearance-none cursor-pointer',
              'accent-primary',
              disabled && 'opacity-50 cursor-not-allowed',
              className,
            )}
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`,
            } as React.CSSProperties}
            {...props}
          />

          {marks && marks.length > 0 && (
            <div className="flx-slider__marks absolute top-4 w-full flex justify-between px-0 -translate-y-1">
              {marks.map((mark) => (
                <span
                  key={mark}
                  className="flx-slider__mark w-1 h-1 bg-border rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {marks && marks.length > 0 && (
          <div className="flx-slider__labels flex justify-between text-xs text-foreground-muted mt-2">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';