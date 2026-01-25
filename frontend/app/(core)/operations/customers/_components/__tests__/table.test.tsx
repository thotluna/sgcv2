import { render, screen } from '@testing-library/react';
import { CustomersTable } from '../table';
import { CustomerDto, CustomerState } from '@sgcv2/shared';

// Mock delete action
const mockDeleteAction = jest.fn();
jest.mock('../actions', () => ({
  deleteCustomerAction: (id: string) => mockDeleteAction(id),
}));

const mockCustomers: CustomerDto[] = [
  {
    id: '1',
    code: 'C001',
    legalName: 'Test Customer 1',
    taxId: 'V-12345678-9',
    address: 'Address 1',
    state: CustomerState.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('CustomersTable', () => {
  it('renders empty state when no customers', () => {
    render(<CustomersTable data={[]} isLoading={false} onDelete={jest.fn()} />);
    expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument();
  });

  it('renders customer data', () => {
    render(<CustomersTable data={mockCustomers} isLoading={false} onDelete={jest.fn()} />);
    expect(screen.getByText('C001')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.getByText('V-12345678-9')).toBeInTheDocument();
  });
});
