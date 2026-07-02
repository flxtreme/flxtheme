import React from 'react';

/* ─── Input ─── */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = false, leftIcon, rightIcon, className = '', id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wrapperClasses = [
      'flx-input-group flex flex-col gap-1.5',
      fullWidth ? 'flx-input-group--full w-full' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'flx-input w-full px-3 py-2 text-[0.875rem] font-inherit bg-background border-[1.5px] border-solid rounded-flx text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15 placeholder:text-muted-foreground',
      error ? 'border-destructive' : 'border-border',
      leftIcon ? 'flx-input--left-icon pl-10' : '',
      rightIcon ? 'flx-input--right-icon pr-10' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="flx-input__label text-[0.8125rem] font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="flx-input__wrapper relative flex items-center">
          {leftIcon && <span className="flx-input__icon flx-input__icon--left absolute flex items-center justify-center text-muted-foreground pointer-events-none left-3">{leftIcon}</span>}
          <input ref={ref} id={inputId} className={inputClasses} {...props} />
          {rightIcon && <span className="flx-input__icon flx-input__icon--right absolute flex items-center justify-center text-muted-foreground pointer-events-none right-3">{rightIcon}</span>}
        </div>
        {error && <span className="flx-input__error text-xs text-destructive">{error}</span>}
        {!error && helperText && <span className="flx-input__helper text-xs text-muted-foreground">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ─── Textarea ─── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = false, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wrapperClasses = [
      'flx-input-group flex flex-col gap-1.5',
      fullWidth ? 'flx-input-group--full w-full' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'flx-textarea w-full min-h-[5rem] resize-y px-3 py-2 text-[0.875rem] font-inherit bg-background border-[1.5px] border-solid rounded-flx text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15',
      error ? 'border-destructive' : 'border-border',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="flx-input__label text-[0.8125rem] font-semibold text-foreground">
            {label}
          </label>
        )}
        <textarea ref={ref} id={inputId} className={inputClasses} {...props} />
        {error && <span className="flx-input__error text-xs text-destructive">{error}</span>}
        {!error && helperText && <span className="flx-input__helper text-xs text-muted-foreground">{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/* ─── Select ─── */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, fullWidth = false, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wrapperClasses = [
      'flx-input-group flex flex-col gap-1.5',
      fullWidth ? 'flx-input-group--full w-full' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'flx-select w-full px-3 py-2 pr-9 text-[0.875rem] font-inherit bg-background border-[1.5px] border-solid rounded-flx text-foreground outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_0.75rem_center] focus:border-primary focus:ring-[3px] focus:ring-primary/15',
      error ? 'border-destructive' : 'border-border',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const selectClasses = `${inputClasses} bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22%2364748b%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M8%2011L3%206h10z%22/%3E%3C/svg%3E')]`;

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="flx-input__label text-[0.8125rem] font-semibold text-foreground">
            {label}
          </label>
        )}
        <select ref={ref} id={inputId} className={selectClasses} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="flx-input__error text-xs text-destructive">{error}</span>}
        {!error && helperText && <span className="flx-input__helper text-xs text-muted-foreground">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

/* ─── Checkbox ─── */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <label htmlFor={inputId} className={`flx-checkbox inline-flex items-center gap-2 cursor-pointer text-[0.875rem] ${className}`}>
        <input ref={ref} type="checkbox" id={inputId} className="flx-checkbox__input peer absolute opacity-0 w-0 h-0" {...props} />
        <span className="flx-checkbox__box w-[1.125rem] h-[1.125rem] border-[1.5px] border-solid border-border rounded-[0.25rem] bg-background transition-all duration-150 flex items-center justify-center shrink-0 peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-[3px] peer-focus-visible:ring-primary/40 after:content-[''] after:hidden peer-checked:after:block after:w-[0.375rem] after:h-[0.625rem] after:border-solid after:border-white after:border-t-0 after:border-l-0 after:border-b-2 after:border-r-2 after:rotate-45 after:-translate-y-px after:-translate-x-px" />
        {label && <span className="flx-checkbox__label text-foreground">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* ─── FormGroup ─── */
export interface FormGroupProps extends React.FormHTMLAttributes<HTMLFormElement> {
  layout?: 'vertical' | 'horizontal';
}

export const FormGroup = React.forwardRef<HTMLFormElement, FormGroupProps>(
  ({ layout = 'vertical', className = '', children, ...props }, ref) => {
    const classes = [
      'flx-form flex gap-5',
      layout === 'vertical' ? 'flx-form--vertical flex-col' : 'flx-form--horizontal flex-row flex-wrap items-end',
      className
    ].filter(Boolean).join(' ');
    
    return (
      <form ref={ref} className={classes} {...props}>
        {children}
      </form>
    );
  }
);

FormGroup.displayName = 'FormGroup';
