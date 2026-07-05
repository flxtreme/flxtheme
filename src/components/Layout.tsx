import React from 'react';
import { cn } from '../utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: string | number;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 2, gap = '4', className = '', children, ...props }, ref) => {
    const colsClass = `grid-cols-${cols}`;
    const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;
    const classes = cn('grid', colsClass, gapClass, className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string | number;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = '4', className = '', children, ...props }, ref) => {
    const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;
    const classes = cn('flex flex-col', gapClass, className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: string;
  justify?: string;
  gap?: string | number;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ align = 'items-center', justify = 'justify-start', gap = '4', className = '', children, ...props }, ref) => {
    const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;
    const classes = cn('flex', align, justify, gapClass, className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

export default Grid;
