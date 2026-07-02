import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Progress } from '../components/Progress';
import { Skeleton } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { Sidebar } from '../components/Sidebar';
import { Toast, ToastProvider, useToast } from '../components/Toast';

// ─── Alert ────────────────────────────────────────────────────────────────────
describe('Alert', () => {
  it('renders with default variant', () => {
    render(<Alert>Info message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toContain('Info message');
    expect(alert.className).toContain('flx-alert');
  });

  it('renders with title', () => {
    render(<Alert title="Heads up">Details here</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Alert variant={variant}>msg</Alert>);
      expect(container.querySelector('.flx-alert')).toBeTruthy();
    });
  });
});

// ─── Badge ────────────────────────────────────────────────────────────────────
describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('New').className).toContain('flx-badge');
  });

  it('renders all variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'destructive', 'outline'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Badge variant={variant}>B</Badge>);
      expect(container.querySelector('.flx-badge')).toBeTruthy();
    });
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md'] as const;
    sizes.forEach((size) => {
      const { container } = render(<Badge size={size}>B</Badge>);
      expect(container.querySelector('.flx-badge')).toBeTruthy();
    });
  });
});

// ─── Progress ─────────────────────────────────────────────────────────────────
describe('Progress', () => {
  it('renders with value', () => {
    render(<Progress value={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
    expect(bar.getAttribute('aria-valuenow')).toBe('50');
  });

  it('clamps value to 0-100', () => {
    const { rerender } = render(<Progress value={-10} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');

    rerender(<Progress value={200} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
  });

  it('shows label when showLabel is true', () => {
    render(<Progress value={75} showLabel />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['primary', 'success', 'warning', 'destructive'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Progress value={50} variant={variant} />);
      expect(container.querySelector('.flx-progress')).toBeTruthy();
    });
  });
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────
describe('Skeleton', () => {
  it('renders with default variant', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.flx-skeleton')).toBeTruthy();
  });

  it('renders all variants', () => {
    const variants = ['text', 'circular', 'rectangular'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect(container.querySelector('.flx-skeleton')).toBeTruthy();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="w-32 h-8" />);
    expect(container.querySelector('.flx-skeleton')?.className).toContain('w-32');
  });
});

// ─── Spinner ──────────────────────────────────────────────────────────────────
describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner.className).toContain('flx-spinner');
  });

  it('has accessible label', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const { container } = render(<Spinner size={size} />);
      expect(container.querySelector('.flx-spinner')).toBeTruthy();
    });
  });
});

// ─── Sidebar ──────────────────────────────────────────────────────────────────
describe('Sidebar', () => {
  it('renders with title and children', () => {
    render(<Sidebar title="Dashboard"><p>Nav items</p></Sidebar>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Nav items')).toBeInTheDocument();
  });

  it('toggles collapse on button click', () => {
    const { container } = render(<Sidebar title="App"><p>Content</p></Sidebar>);
    const aside = container.querySelector('.flx-sidebar')!;
    expect(aside.className).not.toContain('flx-sidebar--collapsed');

    fireEvent.click(screen.getByLabelText('Collapse sidebar'));
    expect(aside.className).toContain('flx-sidebar--collapsed');
  });

  it('supports controlled collapsed state', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Sidebar collapsed={true} onCollapsedChange={onChange} title="App">
        <p>Content</p>
      </Sidebar>
    );
    const aside = container.querySelector('.flx-sidebar')!;
    expect(aside.className).toContain('flx-sidebar--collapsed');

    fireEvent.click(screen.getByLabelText('Expand sidebar'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

// ─── Toast (inline) ───────────────────────────────────────────────────────────
describe('Toast (inline)', () => {
  it('renders with title and children', () => {
    render(<Toast title="Done">Operation complete</Toast>);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Operation complete')).toBeInTheDocument();
  });

  it('renders close button when onClose provided', () => {
    const onClose = vi.fn();
    render(<Toast onClose={onClose}>msg</Toast>);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders all variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Toast variant={variant}>msg</Toast>);
      expect(container.querySelector('.flx-toast-inline')).toBeTruthy();
    });
  });
});

// ─── ToastProvider ────────────────────────────────────────────────────────────
describe('ToastProvider', () => {
  function Trigger() {
    const { toast } = useToast();
    return <button onClick={() => toast({ message: 'Hello toast' })}>Show</button>;
  }

  it('shows toast on trigger', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByText('Hello toast')).toBeInTheDocument();
  });
});
