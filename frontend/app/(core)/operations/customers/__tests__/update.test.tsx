import { render, screen } from '@testing-library/react';
import UpdateCustomerPage from '../[id]/update/page';
import { serverCustomersService } from '@/lib/api/server-customers.service';
import { notFound } from 'next/navigation';

// Mocks
jest.mock('@/lib/api/server-customers.service');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
}));
jest.mock('../[id]/update/_components/update-customer-form', () => ({
  UpdateCustomerForm: ({ customer }: any) => <div>Update Form for {customer.legalName}</div>,
}));

const mockCustomer = {
  id: '1',
  code: 'C001',
  legalName: 'Test Company',
  state: 'ACTIVE',
  // ... needed fields
};

describe('UpdateCustomerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders update form with customer data', async () => {
    (serverCustomersService.getOne as jest.Mock).mockResolvedValue({
      data: mockCustomer,
    });

    const jsx = await UpdateCustomerPage({ params: Promise.resolve({ id: '1' }) });
    render(jsx);

    expect(screen.getByText('Editar Cliente')).toBeInTheDocument();
    expect(screen.getByText('Update Form for Test Company')).toBeInTheDocument();
  });

  it('calls notFound when customer not found', async () => {
    (serverCustomersService.getOne as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Not found',
    });

    await expect(UpdateCustomerPage({ params: Promise.resolve({ id: '999' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND'
    );

    expect(notFound).toHaveBeenCalled();
  });
});
