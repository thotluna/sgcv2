import { render, screen } from '@testing-library/react';
import CustomersPage from '../page';
import { serverCustomersService } from '@/lib/api/server-customers.service';

// Mocks
jest.mock('@/lib/api/server-customers.service');
jest.mock('../_components/filters', () => ({
  CustomersFilters: ({ search, status }: any) => (
    <div data-testid="filters">
      Filters: {search} - {status}
    </div>
  ),
}));
jest.mock('../_components/table', () => ({
  CustomersTable: ({ data }: any) => (
    <div data-testid="table">
      {data.map((c: any) => (
        <div key={c.id}>{c.legalName}</div>
      ))}
    </div>
  ),
}));
jest.mock('@/components/data-pagination', () => ({
  DataPagination: ({ currentPage }: any) => <div data-testid="pagination">Page: {currentPage}</div>,
}));

// Mock Data
const mockCustomers = [
  {
    id: '1',
    code: 'C001',
    legalName: 'Test Company 1',
    taxId: 'J-12345678-1',
    phone: '1234567890',
    state: 'ACTIVE',
  },
  {
    id: '2',
    code: 'C002',
    legalName: 'Test Company 2',
    taxId: 'J-12345678-2',
    phone: '0987654321',
    state: 'INACTIVE',
  },
];

describe('CustomersPage (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (serverCustomersService.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCustomers,
      metadata: {
        pagination: {
          page: 1,
          perPage: 5,
          total: 2,
          totalPages: 1,
        },
      },
    });
  });

  it('renders customers table with data from server', async () => {
    const jsx = await CustomersPage({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page: 1');
  });

  it('passes search parameters to filters and service', async () => {
    const searchParams = Promise.resolve({ search: 'Company 1', status: 'ACTIVE', page: '2' });
    const jsx = await CustomersPage({ searchParams });
    render(jsx);

    expect(serverCustomersService.getAll).toHaveBeenCalledWith(
      2,
      5,
      expect.objectContaining({ search: 'Company 1', state: 'ACTIVE' })
    );

    expect(screen.getByTestId('filters')).toHaveTextContent('Filters: Company 1 - ACTIVE');
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page: 2');
  });

  it('handles empty data or errors gracefully', async () => {
    (serverCustomersService.getAll as jest.Mock).mockResolvedValue({
      success: false,
      error: { message: 'Error loading data' },
    });

    const jsx = await CustomersPage({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.queryByText('Test Company 1')).not.toBeInTheDocument();
  });
});
