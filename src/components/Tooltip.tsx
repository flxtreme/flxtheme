import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    side?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export function Tooltip({ content, children, side = 'top', delay = 300, className }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const show = () => { timer.current = setTimeout(() => setVisible(true), delay); };
    const hide = () => { clearTimeout(timer.current); setVisible(false); };

    useEffect(() => () => clearTimeout(timer.current), []);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-foreground',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-foreground',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-foreground',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-foreground',
    };

    return (
        <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            {children}
            {visible && (
                <span
                    role="tooltip"
                    className={cn(
                        'flx-tooltip absolute z-50 whitespace-nowrap rounded-flx bg-foreground text-background',
                        'px-2.5 py-1.5 text-xs font-medium shadow-md pointer-events-none',
                        'animate-in fade-in-0 zoom-in-95 duration-100',
                        positions[side],
                        className,
                    )}
                >
                    {content}
                    <span className={cn('absolute border-4 border-solid', arrows[side])} />
                </span>
            )}
        </span>
    );
}

Tooltip.displayName = 'Tooltip';