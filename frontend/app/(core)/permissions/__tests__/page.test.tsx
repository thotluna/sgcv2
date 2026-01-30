import { render, screen } from '@testing-library/react';
import PermissionsPage from '../page';
import '@testing-library/jest-dom';

jest.mock('@feature/permissions/components', () => ({
  PermissionsFilters: () => <div data-testid="permissions-filters">Filters</div>,
}));

jest.mock('@/components/table-generic', () => ({
  DataTable: () => <div data-testid="data-table">DataTable</div>,
  TableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('PermissionsPage', () => {
  it('should render the page title and children components', async () => {
    const Page = await PermissionsPage({ searchParams: Promise.resolve({}) });
    render(Page);

    expect(screen.getByText('Permisos')).toBeInTheDocument();
    expect(screen.getByTestId('permissions-filters')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('should handle searchParams correctly', async () => {
    const searchParams = Promise.resolve({ search: 'test', page: '1', perPage: '20' });
    const Page = await PermissionsPage({ searchParams });
    render(Page);

    expect(screen.getByText('Permisos')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });
});
