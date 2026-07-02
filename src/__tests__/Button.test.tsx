import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('flx-btn--primary');
    expect(btn.className).toContain('flx-btn--md');
  });

  it('renders all variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Button variant={variant}>V</Button>);
      expect(container.querySelector(`.flx-btn--${variant}`)).toBeTruthy();
    });
  });

  it('renders all sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    sizes.forEach((size) => {
      const { container } = render(<Button size={size}>S</Button>);
      expect(container.querySelector(`.flx-btn--${size}`)).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.className).toContain('flx-btn--loading');
  });

  it('handles fullWidth', () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    expect(container.querySelector('.flx-btn--full')).toBeTruthy();
  });

  it('handles click events', () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('does not fire click when disabled', () => {
    let clicked = false;
    render(<Button disabled onClick={() => { clicked = true; }}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });
});

describe('IconButton', () => {
  it('renders with icon and aria-label', () => {
    render(<IconButton icon={<span>★</span>} aria-label="Star" />);
    const btn = screen.getByRole('button', { name: /star/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('flx-icon-btn');
  });
});
