import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FlxTheme } from '../theme/FlxTheme';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import { Hero } from '../components/Hero';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';

describe('FlxTheme', () => {
  it('renders children with theme root', () => {
    render(
      <FlxTheme>
        <p>Hello</p>
      </FlxTheme>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('sets data-theme attribute', () => {
    const { container } = render(
      <FlxTheme defaultMode="dark">
        <p>Dark</p>
      </FlxTheme>
    );
    expect(container.querySelector('[data-theme="dark"]')).toBeTruthy();
  });
});

describe('Header', () => {
  it('renders with logo and actions', () => {
    render(
      <Header logo={<span>Logo</span>} actions={<button>Action</button>}>
        <span>Nav</span>
      </Header>
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('Section', () => {
  it('renders with title and subtitle', () => {
    render(<Section title="My Section" subtitle="A subtitle">Content</Section>);
    expect(screen.getByText('My Section')).toBeInTheDocument();
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('renders title and subtitle', () => {
    render(<Hero title="Welcome" subtitle="Sub" />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
  });
});

describe('Card', () => {
  it('renders with sub-components', () => {
    render(
      <Card>
        <CardHeader>Head</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Foot</CardFooter>
      </Card>
    );
    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });
});
