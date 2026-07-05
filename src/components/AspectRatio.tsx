import React from 'react';
import { cn } from '../utils/cn';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number; // width / height, e.g. 16/9
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className = '', children, style, ...props }, ref) => {
    const paddingTop = `${(1 / ratio) * 100}%`;

    return (
      <div ref={ref} className={cn('relative w-full', className)} style={style} {...props}>
        <div aria-hidden style={{ paddingTop }} />
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;
