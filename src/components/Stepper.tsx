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
      ? 'flex items-stretch gap-0'
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
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={cn(
                  'flx-stepper__item',
                  orientation === 'horizontal'
                    ? 'flex items-center flex-1 relative'
                    : 'flex flex-col items-start'
                )}
              >
                {/* Step Circle */}
                <div className="flx-stepper__step-wrapper flex items-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => clickable && onStepChange?.(index)}
                    disabled={!clickable}
                    className={cn(
                      'flx-stepper__step relative w-10 h-10 rounded-full font-semibold flex items-center justify-center border-2 transition-all duration-200 outline-none focus-visible:ring-[2px] focus-visible:ring-primary/40 flex-shrink-0',
                      isCompleted && !hasError
                        ? 'flx-stepper__step--completed bg-primary border-primary text-white'
                        : isActive
                        ? 'flx-stepper__step--active bg-surface border-primary text-primary shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
                        : hasError
                        ? 'flx-stepper__step--error bg-surface border-destructive text-destructive'
                        : 'flx-stepper__step--inactive bg-surface border-border text-foreground-muted',
                      clickable ? 'cursor-pointer hover:border-primary hover:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' : 'cursor-default',
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

                  {/* Step Label & Description - Hidden when collapsed */}
                  {orientation === 'vertical' && (
                    <div className="flx-stepper__content flex-1">
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
                  )}
                </div>

                {/* Horizontal: Label & Description below step */}
                {orientation === 'horizontal' && (
                  <div className="flx-stepper__content text-center flex-1 px-2">
                    <div className={cn(
                      'flx-stepper__label text-xs font-semibold truncate',
                      isActive || isCompleted
                        ? hasError ? 'text-destructive' : 'text-primary'
                        : 'text-foreground'
                    )}>
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="flx-stepper__description text-[0.7rem] text-foreground-muted mt-0.5 truncate">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      orientation === 'horizontal'
                        ? 'absolute top-5 left-[calc(50%+20px)] right-0 h-[2px] -z-10'
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
