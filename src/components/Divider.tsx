import React from 'react';
import { cn } from '../utils/cn';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  thickness?: string; // CSS size like '1px' or '2px'
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', thickness = '1px', className = '', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn('inline-block bg-border', className)}
          style={{ width: thickness }}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref as any}
        className={cn('w-full border-0 bg-border', className)}
        style={{ height: thickness }}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
