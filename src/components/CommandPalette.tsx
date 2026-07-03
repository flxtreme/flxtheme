import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiSearch, FiCommand } from '../icons/fi';
import { cn } from '../utils/cn';

export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    group?: string;
    shortcut?: string;
    onSelect: () => void;
}

export interface CommandPaletteProps {
    items: CommandItem[];
    placeholder?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    hotkey?: string; // default 'k'
    className?: string;
}

export function CommandPalette({
    items,
    placeholder = 'Search commands…',
    open: controlledOpen,
    onOpenChange,
    hotkey = 'k',
    className,
}: CommandPaletteProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback((val: boolean) => {
        if (!isControlled) setInternalOpen(val);
        onOpenChange?.(val);
    }, [isControlled, onOpenChange]);

    // ⌘K / Ctrl+K hotkey
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
                e.preventDefault();
                setOpen(!open);
            }
            if (e.key === 'Escape' && open) setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, hotkey, setOpen]);

    // Focus input on open
    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return q ? items.filter(i =>
            i.label.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q) ||
            i.group?.toLowerCase().includes(q)
        ) : items;
    }, [items, query]);

    // Group items
    const grouped = useMemo(() => {
        const map = new Map<string, CommandItem[]>();
        filtered.forEach(item => {
            const g = item.group ?? '';
            if (!map.has(g)) map.set(g, []);
            map.get(g)!.push(item);
        });
        return map;
    }, [filtered]);

    const flatFiltered = filtered;

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = flatFiltered[activeIndex];
            if (item) { item.onSelect(); setOpen(false); }
        }
    };

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    let flatIndex = -1;

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
            onClick={() => setOpen(false)}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                onClick={e => e.stopPropagation()}
                className={cn(
                    'flx-command-palette relative z-10 w-full max-w-lg rounded-flx border border-solid border-border',
                    'bg-surface shadow-2xl overflow-hidden',
                    'animate-in fade-in-0 zoom-in-95 duration-150',
                    className,
                )}
            >
                {/* Search row */}
                <div className="flex items-center gap-3 px-4 border-b border-solid border-border">
                    <FiSearch size={16} className="shrink-0 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        className={cn(
                            'flex-1 bg-transparent border-none outline-none py-4 text-sm text-foreground',
                            'placeholder:text-muted-foreground font-inherit',
                        )}
                    />
                    <kbd className="shrink-0 text-[0.65rem] text-muted-foreground bg-muted border border-solid border-border rounded px-1.5 py-0.5 font-mono">
                        esc
                    </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} role="listbox" className="max-h-80 overflow-y-auto py-2">
                    {flatFiltered.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No results for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        Array.from(grouped.entries()).map(([group, groupItems]) => (
                            <div key={group}>
                                {group && (
                                    <div className="px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
                                        {group}
                                    </div>
                                )}
                                {groupItems.map(item => {
                                    flatIndex++;
                                    const idx = flatIndex;
                                    const isActive = activeIndex === idx;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            data-active={isActive}
                                            onClick={() => { item.onSelect(); setOpen(false); }}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            className={cn(
                                                'flx-command-palette__item w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm',
                                                'bg-transparent border-none cursor-pointer transition-colors duration-75',
                                                isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                                            )}
                                        >
                                            {item.icon && (
                                                <span className={cn('shrink-0 text-base', isActive ? 'text-primary' : 'text-muted-foreground')}>
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium leading-none">{item.label}</span>
                                                {item.description && (
                                                    <span className="block text-xs text-muted-foreground mt-0.5 truncate">{item.description}</span>
                                                )}
                                            </span>
                                            {item.shortcut && (
                                                <kbd className="shrink-0 text-[0.65rem] text-muted-foreground bg-muted border border-solid border-border rounded px-1.5 py-0.5 font-mono">
                                                    {item.shortcut}
                                                </kbd>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-t border-solid border-border text-[0.68rem] text-muted-foreground">
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-muted border border-solid border-border rounded px-1">↑↓</kbd> navigate</span>
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-muted border border-solid border-border rounded px-1">↵</kbd> select</span>
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-muted border border-solid border-border rounded px-1">esc</kbd> close</span>
                    <span className="ml-auto flex items-center gap-1 opacity-60"><FiCommand size={10} /> {hotkey.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}

CommandPalette.displayName = 'CommandPalette';