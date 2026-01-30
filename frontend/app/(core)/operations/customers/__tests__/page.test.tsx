import { render, screen } from '@testing-library/react';
import CustomersPage from '../page';

// Mocks
jest.mock('@/feature/customers/services/customers.service');
jest.mock('@/feature/customers/components/filters', () => ({
  CustomersFilters: ({ search, status }: any) => (
    <div data-testid="filters">
      Filters: {search} - {status}
    </div>
  ),
}));
jest.mock('@/components/table-generic', () => ({
  DataTable: ({ searchParams }: any) => (
    <div data-testid="data-table">
      DataTable: {searchParams.search} - {searchParams.status}
    </div>
  ),
  TableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('CustomersPage (Server Component)', () => {
  it('renders filters and DataTable wrapper', async () => {
    const searchParams = Promise.resolve({ search: 'Test', status: 'ACTIVE' });
    const jsx = await CustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toHaveTextContent('DataTable: Test - ACTIVE');
  });

  it('handles default search parameters', async () => {
    const searchParams = Promise.resolve({});
    const jsx = await CustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByTestId('data-table')).toHaveTextContent('DataTable: -');
  });
});
