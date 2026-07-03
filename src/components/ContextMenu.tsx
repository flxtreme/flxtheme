import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface ContextMenuItemProps {
    icon?: React.ReactNode;
    label: string;
    shortcut?: string;
    disabled?: boolean;
    destructive?: boolean;
    onClick?: () => void;
}

export interface ContextMenuSeparator {
    type: 'separator';
}

export type ContextMenuItem = ContextMenuItemProps | ContextMenuSeparator;

export interface ContextMenuProps {
    items: ContextMenuItem[];
    children: React.ReactNode;
    className?: string;
}

function isSeparator(item: ContextMenuItem): item is ContextMenuSeparator {
    return (item as ContextMenuSeparator).type === 'separator';
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setPos(null), []);

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
        };
        const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', key);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', key);
        };
    }, [close]);

    return (
        <>
            <div onContextMenu={onContextMenu} className="flx-context-menu-trigger">
                {children}
            </div>

            {pos && (
                <div
                    ref={menuRef}
                    role="menu"
                    className={cn(
                        'flx-context-menu fixed z-[9999] min-w-[180px] rounded-flx border border-solid border-border',
                        'bg-surface shadow-xl py-1 text-sm',
                        'animate-in fade-in-0 zoom-in-95 duration-100',
                        className,
                    )}
                    style={{ top: pos.y, left: pos.x }}
                >
                    {items.map((item, i) => {
                        if (isSeparator(item)) {
                            return <div key={i} className="my-1 h-px bg-border" />;
                        }
                        return (
                            <button
                                key={i}
                                type="button"
                                role="menuitem"
                                disabled={item.disabled}
                                onClick={() => { item.onClick?.(); close(); }}
                                className={cn(
                                    'flx-context-menu__item w-full flex items-center gap-2.5 px-3 py-1.5 text-left',
                                    'bg-transparent border-none cursor-pointer transition-colors duration-100',
                                    item.destructive
                                        ? 'text-destructive hover:bg-destructive/10'
                                        : 'text-foreground hover:bg-muted',
                                    item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                                )}
                            >
                                {item.icon && <span className="shrink-0 text-base">{item.icon}</span>}
                                <span className="flex-1">{item.label}</span>
                                {item.shortcut && (
                                    <span className="text-xs text-muted-foreground font-mono">{item.shortcut}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}

ContextMenu.displayName = 'ContextMenu';