import { render, screen, fireEvent } from '@testing-library/react';
import { CustomersTable } from '../table';
import { CustomerDto } from '@sgcv2/shared';

// Mocks
jest.mock('../customerDropMenu', () => ({
  CustomerDropMenu: ({ id, customerName, onDelete }: any) => (
    <button onClick={() => onDelete(id)} data-testid={`delete-${id}`}>
      Delete {customerName}
    </button>
  ),
}));

const mockData: CustomerDto[] = [
  {
    id: '1',
    code: 'C001',
    legalName: 'Company A',
    businessName: 'Biz A',
    taxId: 'J-00000001',
    address: 'Address 1',
    phone: '111111',
    state: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: 'C002',
    legalName: 'Company B',
    businessName: 'Biz B',
    taxId: 'J-00000002',
    address: 'Address 2',
    phone: '222222',
    state: 'INACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('CustomersTable', () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(<CustomersTable data={[]} isLoading={true} onDelete={mockOnDelete} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<CustomersTable data={[]} isLoading={false} onDelete={mockOnDelete} />);
    expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    render(<CustomersTable data={mockData} isLoading={false} onDelete={mockOnDelete} />);

    // Headers
    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Razón Social')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();

    // Rows
    expect(screen.getByText('C001')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument(); // Badge label

    expect(screen.getByText('C002')).toBeInTheDocument();
    expect(screen.getByText('Company B')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('calls onDelete when delete action is triggered', () => {
    render(<CustomersTable data={mockData} isLoading={false} onDelete={mockOnDelete} />);

    const deleteBtn = screen.getByTestId('delete-1');
    fireEvent.click(deleteBtn);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
