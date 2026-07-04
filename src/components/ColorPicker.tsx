import React from 'react';
import { cn } from '../utils/cn';

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showInput?: boolean;
  presets?: string[];
  helperText?: string;
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      label,
      showInput = true,
      presets = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
      helperText,
      value = '#6366f1',
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : { r: 99, g: 102, b: 241 };
    };

    const rgb = hexToRgb(String(value));

    return (
      <div className={cn('flx-color-picker', className)}>
        {label && (
          <label className="flx-color-picker__label block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}

        <div className="flx-color-picker__container flex gap-3">
          {/* Color Input */}
          <div className="flx-color-picker__input-wrapper flex items-center gap-2">
            <div className="flx-color-picker__display relative w-12 h-12 rounded-flx border-2 border-border overflow-hidden cursor-pointer">
              <input
                ref={ref}
                type="color"
                value={value}
                onChange={onChange}
                className="flx-color-picker__input w-full h-full cursor-pointer"
                {...props}
              />
            </div>

            {showInput && (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange?.({
                  ...e,
                  target: { ...e.target, value: e.target.value }
                } as React.ChangeEvent<HTMLInputElement>)}
                placeholder="#000000"
                className="flx-color-picker__hex w-24 px-2.5 py-1.5 bg-surface border border-solid border-border rounded-flx text-xs font-mono outline-none focus:border-primary focus:ring-[2px] focus:ring-primary/40"
              />
            )}
          </div>

          {/* RGB Display */}
          <div className="flx-color-picker__rgb text-xs text-foreground-muted flex items-center">
            RGB({rgb.r}, {rgb.g}, {rgb.b})
          </div>
        </div>

        {/* Preset Colors */}
        {presets && presets.length > 0 && (
          <div className="flx-color-picker__presets mt-3">
            <p className="text-xs font-semibold text-foreground-muted mb-2">Presets</p>
            <div className="flex gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange?.({
                    target: { value: preset }
                  } as any)}
                  className={cn(
                    'flx-color-picker__preset w-8 h-8 rounded-flx border-2 transition-all duration-200',
                    value === preset ? 'border-foreground' : 'border-border hover:border-foreground/50'
                  )}
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
            </div>
          </div>
        )}

        {helperText && (
          <p className="flx-color-picker__helper text-xs text-foreground-muted mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
