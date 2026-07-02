import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';
import { cn } from '../utils/cn';

/* ─── Modal Context ─── */
interface ModalContextValue {
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a <ModalProvider>');
  return ctx;
}

export interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const openModal = useCallback((id: string) => {
    setOpenModals((prev) => new Set(prev).add(id));
  }, []);

  const closeModal = useCallback((id: string) => {
    setOpenModals((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isOpen = useCallback((id: string) => openModals.has(id), [openModals]);

  const value = useMemo(() => ({ openModal, closeModal, isOpen }), [openModal, closeModal, isOpen]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/* ─── Modal ─── */
export interface ModalProps {
  id?: string;
  open?: boolean;
  onClose?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
}

export function Modal({
  id,
  open: controlledOpen,
  onClose: controlledOnClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
}: ModalProps) {
  const ctx = useContext(ModalContext);

  const isOpen = controlledOpen !== undefined ? controlledOpen : (id ? ctx?.isOpen(id) ?? false : false);
  const handleClose = controlledOnClose || (id ? () => ctx?.closeModal(id) : undefined);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay && handleClose) handleClose();
  };

  return (
    <div className="flx-modal-overlay fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-flx-modal-fade-in" onClick={handleOverlayClick} role="presentation">
      <div
        className={cn(
          'flx-modal bg-surface rounded-[calc(var(--flx-radius)+0.25rem)] shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-solid border-border w-full max-h-[90vh] flex flex-col relative animate-flx-modal-slide-up',
          size === 'sm' && 'flx-modal--sm max-w-sm',
          size === 'md' && 'flx-modal--md max-w-lg',
          size === 'lg' && 'flx-modal--lg max-w-2xl',
          size === 'xl' && 'flx-modal--xl max-w-4xl',
          size === 'full' && 'flx-modal--full max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'flx-modal-title' : undefined}
      >
        {title && (
          <div className="flx-modal__header flex shrink-0 items-center justify-between p-6 pb-4 border-b border-solid border-border">
            <h2 className="flx-modal__title m-0 text-xl font-bold tracking-tight text-foreground" id="flx-modal-title">
              {title}
            </h2>
            {handleClose && (
              <button
                className="flx-modal__close w-8 h-8 rounded-full border-none bg-transparent flex items-center justify-center cursor-pointer text-muted-foreground text-xl transition-colors hover:bg-muted hover:text-foreground"
                onClick={handleClose}
                aria-label="Close modal"
                type="button"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="flx-modal__body flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="flx-modal__footer flex shrink-0 items-center justify-end gap-3 p-6 pt-4 border-t border-solid border-border bg-muted/30 rounded-b-[calc(var(--flx-radius)+0.25rem)]">{footer}</div>}
      </div>
    </div>
  );
}

Modal.displayName = 'Modal';
