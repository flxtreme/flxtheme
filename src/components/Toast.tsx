import React, { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from '../icons/fi';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
    id: string;
    variant?: ToastVariant;
    title?: string;
    message: React.ReactNode;
    duration?: number; // ms, 0 = sticky
}

interface ToastContextValue {
    toast: (opts: Omit<ToastItem, 'id'>) => void;
    dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}

// ─── ToastItem component (individual floating toast) ─────────────────────────
const STYLES: Record<ToastVariant, { wrap: string; icon: React.ReactNode }> = {
    info: { wrap: 'bg-surface border-border text-foreground', icon: <FiInfo size={15} className="shrink-0 mt-0.5 text-info" /> },
    success: { wrap: 'bg-success/10 border-success/30 text-success', icon: <FiCheckCircle size={15} className="shrink-0 mt-0.5" /> },
    warning: { wrap: 'bg-warning/10 border-warning/30 text-warning', icon: <FiAlertTriangle size={15} className="shrink-0 mt-0.5" /> },
    error: { wrap: 'bg-destructive/10 border-destructive/30 text-destructive', icon: <FiXCircle size={15} className="shrink-0 mt-0.5" /> },
};

function ToastItemEl({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
    const [visible, setVisible] = useState(false);
    const { wrap, icon } = STYLES[item.variant ?? 'info'];
    const duration = item.duration ?? 2500;

    useEffect(() => {
        // Animate in
        const show = requestAnimationFrame(() => setVisible(true));
        if (duration > 0) {
            const t = setTimeout(() => {
                setVisible(false);
                setTimeout(() => onDismiss(item.id), 300);
            }, duration);
            return () => { cancelAnimationFrame(show); clearTimeout(t); };
        }
        return () => cancelAnimationFrame(show);
    }, [duration, item.id, onDismiss]);

    return (
        <div
            role="status"
            aria-live="polite"
            className={[
                'flx-toast flex items-start gap-3 rounded-flx border border-solid shadow-lg px-4 py-3 text-sm',
                'min-w-[280px] max-w-sm w-full pointer-events-auto',
                'transition-all duration-300',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                wrap,
            ].filter(Boolean).join(' ')}
        >
            {icon}
            <div className="flex-1 flex flex-col gap-0.5">
                {item.title && <p className="font-semibold leading-none text-[0.85rem]">{item.title}</p>}
                <div className="leading-snug opacity-90 text-[0.82rem]">{item.message}</div>
            </div>
            <button
                type="button"
                onClick={() => { setVisible(false); setTimeout(() => onDismiss(item.id), 300); }}
                aria-label="Dismiss"
                className="shrink-0 bg-transparent border-none cursor-pointer text-current opacity-40 hover:opacity-100 transition-opacity p-0 mt-0.5"
            >
                <FiX size={14} />
            </button>
        </div>
    );
}

// ─── ToastProvider ────────────────────────────────────────────────────────────
export interface ToastProviderProps {
    children: React.ReactNode;
    defaultDuration?: number; // ms, default 2500
}

export function ToastProvider({ children, defaultDuration = 2500 }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((opts: Omit<ToastItem, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts(prev => [...prev, { ...opts, id, duration: opts.duration ?? defaultDuration }]);
    }, [defaultDuration]);

    const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Floating portal — bottom-right */}
            <div
                aria-live="polite"
                aria-label="Notifications"
                className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
            >
                {toasts.map(item => (
                    <ToastItemEl key={item.id} item={item} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ─── Inline Toast (static, non-floating) — for docs / layout use ─────────────
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: ToastVariant;
    title?: string;
    onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({ variant = 'info', title, onClose, className = '', children, ...props }, ref) => {
        const { wrap, icon } = STYLES[variant];
        return (
            <div
                ref={ref}
                role="status"
                aria-live="polite"
                className={[
                    'flx-toast-inline flex items-start gap-3 rounded-flx border border-solid shadow-lg px-4 py-3 text-sm min-w-[280px] max-w-sm',
                    wrap,
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            >
                {icon}
                <div className="flex-1 flex flex-col gap-0.5">
                    {title && <p className="font-semibold leading-none text-[0.85rem]">{title}</p>}
                    <div className="leading-snug opacity-90 text-[0.82rem]">{children}</div>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss"
                        className="shrink-0 bg-transparent border-none cursor-pointer text-current opacity-40 hover:opacity-100 transition-opacity p-0 mt-0.5"
                    >
                        <FiX size={14} />
                    </button>
                )}
            </div>
        );
    }
);

Toast.displayName = 'Toast';