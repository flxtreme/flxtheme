import React, { useEffect } from 'react';
import { cn } from '../utils/cn';

export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    side?: 'left' | 'right' | 'top' | 'bottom';
    size?: string;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function Drawer({
    open,
    onClose,
    side = 'right',
    size,
    title,
    footer,
    children,
    className,
}: DrawerProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    const isHorizontal = side === 'left' || side === 'right';

    const translate = {
        left: open ? 'translate-x-0' : '-translate-x-full',
        right: open ? 'translate-x-0' : 'translate-x-full',
        top: open ? 'translate-y-0' : '-translate-y-full',
        bottom: open ? 'translate-y-0' : 'translate-y-full',
    };

    const placement = {
        left: 'inset-y-0 left-0',
        right: 'inset-y-0 right-0',
        top: 'inset-x-0 top-0',
        bottom: 'inset-x-0 bottom-0',
    };

    const defaultSize = isHorizontal ? '320px' : '360px';
    const sizeStyle = isHorizontal
        ? { width: size ?? defaultSize }
        : { height: size ?? defaultSize };

    return (
        <>
            {/* Overlay */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className={cn(
                    'fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                )}
            />

            {/* Panel */}
            <aside
                role="dialog"
                aria-modal="true"
                className={cn(
                    'flx-drawer fixed z-50 bg-surface flex flex-col shadow-2xl',
                    'transition-transform duration-300 ease-in-out',
                    placement[side],
                    translate[side],
                    className,
                )}
                style={sizeStyle}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 h-14 border-b border-solid border-border shrink-0">
                        <div className="font-semibold text-base text-foreground">{title}</div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close drawer"
                            className="bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-0 text-lg leading-none"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="shrink-0 border-t border-solid border-border px-6 py-4">{footer}</div>
                )}
            </aside>
        </>
    );
}

Drawer.displayName = 'Drawer';