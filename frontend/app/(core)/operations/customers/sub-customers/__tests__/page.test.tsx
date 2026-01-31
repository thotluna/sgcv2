import { render, screen } from '@testing-library/react';
import SubCustomersPage from '../page';

// Mocks
jest.mock('@feature/customers/services/sub-customers.service');
jest.mock('@feature/customers/components/sub-customers-columns', () => ({
  getSubCustomersColumns: jest.fn(() => []),
}));
jest.mock('@feature/customers/components/sub-customers.filters', () => ({
  SubCustomersFilters: ({ search, customerId }: { search?: string; customerId?: string }) => (
    <div data-testid="filters">
      Filters: {search} - {customerId}
    </div>
  ),
}));
jest.mock('@/components/table-generic', () => ({
  DataTable: () => <div data-testid="data-table">DataTable</div>,
  TableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('SubCustomersPage (Server Component)', () => {
  it('renders title, filters and DataTable', async () => {
    const searchParams = Promise.resolve({ search: 'Sub A', customerId: 'cust-1' });
    const jsx = await SubCustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByText('Sub Clientes')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toHaveTextContent('Filters: Sub A - cust-1');
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('handles empty search parameters', async () => {
    const searchParams = Promise.resolve({});
    const jsx = await SubCustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByTestId('filters')).toHaveTextContent('Filters: -');
  });
});
