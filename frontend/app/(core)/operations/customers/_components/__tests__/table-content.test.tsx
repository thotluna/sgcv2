import { render, screen } from '@testing-library/react';
import { CustomersTableContent } from '../table-content';
import { serverCustomersService } from '@/lib/api/server-customers.service';

// Mocks
jest.mock('@/lib/api/server-customers.service');
jest.mock('../table', () => ({
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

const mockCustomers = [
  {
    id: '1',
    code: 'C001',
    legalName: 'Test Company 1',
    taxId: 'J-12345678-1',
    state: 'ACTIVE',
  },
];

describe('CustomersTableContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and renders customers', async () => {
    (serverCustomersService.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCustomers,
      metadata: {
        pagination: {
          page: 1,
          perPage: 20,
          total: 1,
          totalPages: 1,
        },
      },
    });

    const jsx = await CustomersTableContent({
      page: 1,
      perPage: 20,
      filters: { search: 'test', state: 'ACTIVE' as any },
    });
    render(jsx);

    expect(serverCustomersService.getAll).toHaveBeenCalledWith(1, 20, {
      search: 'test',
      state: 'ACTIVE',
    });
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page: 1');
  });

  it('handles errors gracefully', async () => {
    (serverCustomersService.getAll as jest.Mock).mockResolvedValue({
      success: false,
      error: { message: 'Error' },
    });

    const jsx = await CustomersTableContent({
      page: 1,
      perPage: 20,
      filters: {},
    });
    render(jsx);

    expect(screen.queryByText('Test Company 1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table')).toBeInTheDocument(); // DataTable shows empty message
  });
});
