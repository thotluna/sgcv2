import { render, screen } from '@testing-library/react';
import CustomersPage from '../page';

// Mocks
jest.mock('@/lib/api/server-customers.service');
jest.mock('../_components/filters', () => ({
  CustomersFilters: ({ search, status }: any) => (
    <div data-testid="filters">
      Filters: {search} - {status}
    </div>
  ),
}));
jest.mock('../_components/table-content', () => ({
  CustomersTableContent: ({ filters }: any) => (
    <div data-testid="table-content">
      TableContent: {filters.search} - {filters.state}
    </div>
  ),
}));
jest.mock('@/components/table/table-skeleton', () => ({
  TableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('CustomersPage (Server Component)', () => {
  it('renders filters and CustomersTableContent wrapper', async () => {
    const searchParams = Promise.resolve({ search: 'Test', status: 'ACTIVE' });
    const jsx = await CustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('table-content')).toHaveTextContent('TableContent: Test - ACTIVE');
  });

  it('handles default search parameters', async () => {
    const searchParams = Promise.resolve({});
    const jsx = await CustomersPage({ searchParams });
    render(jsx);

    expect(screen.getByTestId('table-content')).toHaveTextContent('TableContent: -');
  });
});
