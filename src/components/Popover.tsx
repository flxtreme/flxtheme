import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface PopoverProps {
    trigger: React.ReactElement;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export function Popover({ trigger, children, side = 'bottom', align = 'start', className }: PopoverProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const positions: Record<string, string> = {
        'top-start': 'bottom-full left-0 mb-2',
        'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        'top-end': 'bottom-full right-0 mb-2',
        'bottom-start': 'top-full left-0 mt-2',
        'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-2',
        'bottom-end': 'top-full right-0 mt-2',
        'left-start': 'right-full top-0 mr-2',
        'left-center': 'right-full top-1/2 -translate-y-1/2 mr-2',
        'left-end': 'right-full bottom-0 mr-2',
        'right-start': 'left-full top-0 ml-2',
        'right-center': 'left-full top-1/2 -translate-y-1/2 ml-2',
        'right-end': 'left-full bottom-0 ml-2',
    };

    return (
        <div ref={ref} className="relative inline-flex">
            {React.cloneElement(trigger, { onClick: () => setOpen(o => !o) } as React.Attributes)}
            {open && (
                <div
                    role="dialog"
                    className={cn(
                        'flx-popover absolute z-50 min-w-[220px] rounded-flx border border-solid border-border',
                        'bg-surface shadow-lg p-4 text-sm text-foreground',
                        'animate-in fade-in-0 zoom-in-95 duration-150',
                        positions[`${side}-${align}`],
                        className,
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

Popover.displayName = 'Popover';