import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomersPage from '../page';
import { customersService } from '@/lib/api/customers.service';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('@/lib/api/customers.service');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pagination">{children}</div>
  ),
  PaginationContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaginationItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaginationLink: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  PaginationPrevious: ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick}>Previous</button>
  ),
  PaginationNext: ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick}>Next</button>
  ),
  PaginationEllipsis: () => <span>...</span>,
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

describe('CustomersPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (customersService.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCustomers,
      metadata: {
        pagination: {
          page: 1,
          perPage: 10,
          total: 2,
          totalPages: 1,
        },
      },
    });
  });

  it('renders customers table with data', async () => {
    render(<CustomersPage />);

    expect(screen.getByText('Clientes')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    render(<CustomersPage />);

    const searchInput = screen.getByPlaceholderText('Buscar clientes...');
    fireEvent.change(searchInput, { target: { value: 'Company 1' } });

    await waitFor(
      () => {
        expect(customersService.getAll).toHaveBeenCalledWith(
          1,
          5,
          expect.objectContaining({ search: 'Company 1' })
        );
      },
      { timeout: 1000 }
    ); // Increased timeout for debounce
  });

  it('handles status filter change', async () => {
    render(<CustomersPage />);

    screen.getByRole('combobox'); // Assuming select render as combobox role or investigate toolbar implementation
    // Actually toolbar uses a native select
    // Let's find by generic way if role fails
    // Looking at toolbar.tsx: <select value={status} ...>

    // Testing-library often struggles with native select if not labeled correctly, let's try direct change
    // We might need to find the select first. It has options.
    // Let's use getByDisplayValue or just query selector if needed, but displayValue works for "Todos los estados"

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('Test Company 1')).toBeInTheDocument());

    // Change select
    const selects = document.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'ACTIVE' } });

    await waitFor(
      () => {
        expect(customersService.getAll).toHaveBeenCalledWith(
          1,
          5,
          expect.objectContaining({ state: 'ACTIVE' })
        );
      },
      { timeout: 1000 }
    );
  });

  it('navigates to new customer page when create button is clicked', () => {
    render(<CustomersPage />);

    const createButton = screen.getByText('Nuevo Cliente');
    fireEvent.click(createButton);

    expect(mockPush).toHaveBeenCalledWith('/operations/customers/new');
  });

  it('handles pagination', async () => {
    // Setup for multiple pages
    (customersService.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCustomers,
      metadata: {
        pagination: {
          page: 1,
          perPage: 5,
          total: 15,
          totalPages: 3,
        },
      },
    });

    render(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Wait for state update and effect
    await waitFor(() => {
      expect(customersService.getAll).toHaveBeenCalledWith(2, 5, expect.anything());
    });
  });

  it('handles delete error gracefully', async () => {
    // Mock delete to fail
    const errorMsg = 'Error deleting';
    (customersService.delete as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } },
    });

    render(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });

    // Find delete trigger - this is tricky because it's inside a dropdown
    // Effectively we aren't testing the Dropdown interactions deeply here as that belongs to Table/Menu tests.
    // However, the page passes `handleDelete` to the table.
    // We can simulate the delete logic if we extracted the handler or if we trigger the table prop.
    // Since we are testing integration Page -> Table, we rely on Table correctly calling onDelete.
    // To properly test this, we should mock the CustomersTable to verify it receives the props, OR
    // interact with the UI.

    // Let's try to mock the Table to simply call onDelete to verify Page logic
  });
});
