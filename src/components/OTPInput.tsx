import React from 'react';
import { cn } from '../utils/cn';

export interface OTPInputProps extends React.HTMLAttributes<HTMLDivElement> {
  length?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: string;
}

export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 6,
      value = '',
      onValueChange,
      onComplete,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const [otp, setOtp] = React.useState(value.split(''));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, digit: string) => {
      if (!/^\d*$/.test(digit)) return;

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      const otpValue = newOtp.join('');
      onValueChange?.(otpValue);

      if (newOtp.every(d => d !== '') && newOtp.length === length) {
        onComplete?.(otpValue);
      }

      // Move to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text');
      const digits = text.split('').filter(c => /^\d$/.test(c));
      
      if (digits.length === length) {
        setOtp(digits);
        const otpValue = digits.join('');
        onValueChange?.(otpValue);
        onComplete?.(otpValue);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flx-otp-input', className)}
        {...props}
      >
        {label && (
          <label className="flx-otp-input__label block text-sm font-medium text-foreground mb-3">
            {label}
          </label>
        )}

        <div className="flx-otp-input__container flex gap-2 justify-center">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                'flx-otp-input__field w-10 h-10 text-center font-bold text-lg rounded-flx border-2 border-border outline-none transition-all duration-200',
                'focus:border-primary focus:ring-[2px] focus:ring-primary/40',
                otp[index] ? 'bg-surface text-foreground' : 'bg-surface text-foreground-muted'
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput';
