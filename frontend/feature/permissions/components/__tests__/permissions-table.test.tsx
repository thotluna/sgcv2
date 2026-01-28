import { render, screen } from '@testing-library/react';
import { PermissionsTable } from '../permissions-table';
import '@testing-library/jest-dom';

describe('PermissionsTable', () => {
  const mockPermissions = [
    { id: 1, resource: 'users', action: 'read', description: 'Read users' },
    { id: 2, resource: 'roles', action: 'write', description: 'Write roles' },
  ];

  it('should render table with permissions data', () => {
    render(<PermissionsTable data={mockPermissions} />);

    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('read')).toBeInTheDocument();
    expect(screen.getByText('Read users')).toBeInTheDocument();
    expect(screen.getByText('roles')).toBeInTheDocument();
    expect(screen.getByText('write')).toBeInTheDocument();
    expect(screen.getByText('Write roles')).toBeInTheDocument();
  });

  it('should render empty state when no data is provided', () => {
    render(<PermissionsTable data={[]} />);

    expect(screen.getByText('No se encontraron permisos.')).toBeInTheDocument();
  });
});
