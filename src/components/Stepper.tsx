import React from 'react';
import { cn } from '../utils/cn';

export interface StepperStep {
  id: string | number;
  label: string;
  description?: string;
  completed?: boolean;
  error?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepChange?: (step: number) => void;
  clickable?: boolean;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = 'horizontal',
      onStepChange,
      clickable = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClass = orientation === 'horizontal'
      ? 'flx-stepper'
      : 'flx-stepper--vertical';

    const containerClass = orientation === 'horizontal'
      ? 'flex items-center justify-between'
      : 'flex flex-col gap-8';

    return (
      <div
        ref={ref}
        className={cn(baseClass, className)}
        {...props}
      >
        <div className={cn('flx-stepper__container', containerClass)}>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = step.completed || index < currentStep;
            const hasError = step.error;

            return (
              <div
                key={step.id}
                className="flx-stepper__item flex items-center flex-1 last:flex-none"
              >
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => clickable && onStepChange?.(index)}
                  disabled={!clickable}
                  className={cn(
                    'flx-stepper__step relative min-w-10 h-10 rounded-full font-semibold flex items-center justify-center border-2 transition-all duration-200 outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40',
                    isCompleted && !hasError
                      ? 'flx-stepper__step--completed bg-primary border-primary text-white'
                      : isActive
                      ? 'flx-stepper__step--active bg-surface border-primary text-primary'
                      : hasError
                      ? 'flx-stepper__step--error bg-surface border-destructive text-destructive'
                      : 'flx-stepper__step--inactive bg-surface border-border text-foreground-muted',
                    clickable ? 'cursor-pointer hover:border-primary' : 'cursor-default',
                  )}
                >
                  {isCompleted && !hasError ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step Label & Description */}
                <div className="flx-stepper__content ml-3 flex-1">
                  <div className={cn(
                    'flx-stepper__label text-sm font-semibold',
                    isActive || isCompleted
                      ? hasError ? 'text-destructive' : 'text-primary'
                      : 'text-foreground'
                  )}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="flx-stepper__description text-xs text-foreground-muted mt-1">
                      {step.description}
                    </div>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      orientation === 'horizontal'
                        ? 'absolute left-[calc(50%+20px)] top-5 w-[calc(100%-40px)] h-[2px]'
                        : 'absolute left-5 top-10 w-[2px] h-12',
                      'flx-stepper__connector transition-all duration-200',
                      isCompleted
                        ? 'bg-primary'
                        : 'bg-border'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
