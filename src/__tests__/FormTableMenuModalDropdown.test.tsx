import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Input, Textarea, Select, Checkbox } from '../components/Form';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/Table';
import { Menu, MenuItem } from '../components/Menu';
import { Modal, ModalProvider, useModal } from '../components/Modal';
import { Dropdown, DropdownItem } from '../components/Dropdown';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders options', () => {
    render(
      <Select
        label="Country"
        options={[
          { value: 'us', label: 'USA' },
          { value: 'uk', label: 'UK' },
        ]}
      />
    );
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('toggles on click', () => {
    render(<Checkbox label="Check" />);
    const checkbox = screen.getByLabelText('Check') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});

describe('Table', () => {
  it('renders headers and rows', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Name</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});

describe('Menu', () => {
  it('renders menu items', () => {
    render(
      <Menu>
        <MenuItem>Dashboard</MenuItem>
        <MenuItem active>Settings</MenuItem>
      </Menu>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal open title="Test Modal">Content</Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal open={false} title="Hidden">Content</Modal>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('works with ModalProvider', () => {
    function Opener() {
      const { openModal } = useModal();
      return <button onClick={() => openModal('test')}>Open</button>;
    }

    render(
      <ModalProvider>
        <Opener />
        <Modal id="test" title="Ctx Modal">Ctx Content</Modal>
      </ModalProvider>
    );

    expect(screen.queryByText('Ctx Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Ctx Content')).toBeInTheDocument();
  });
});

describe('Dropdown', () => {
  it('opens on trigger click', () => {
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem>Option 1</DropdownItem>
      </Dropdown>
    );
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
});
