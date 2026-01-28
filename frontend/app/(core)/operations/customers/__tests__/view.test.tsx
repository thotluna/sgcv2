import { render, screen } from '@testing-library/react';
import CustomerViewPage from '../[id]/page';
import { serverCustomersService } from '@/lib/api/server-customers.service';
import { notFound } from 'next/navigation';

// Mocks
jest.mock('@/lib/api/server-customers.service');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
}));
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>Badge: {children}</span>,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => <button>{children}</button>,
  // Mock for Link inside button variant or similar if needed, but Page uses Link component wrapping Button
}));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/feature/customers/components/sub-customers-list', () => ({
  SubCustomersList: () => <div data-testid="sub-customers-list" />,
}));
jest.mock('@/feature/customers/components/locations-list', () => ({
  LocationsList: () => <div data-testid="locations-list" />,
}));

const mockCustomer = {
  id: '1',
  code: 'C001',
  legalName: 'Test Company',
  taxId: 'J-12345678-9',
  address: 'Test Address',
  phone: '1234567890',
  state: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CustomerViewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders customer details successfully', async () => {
    (serverCustomersService.getOne as jest.Mock).mockResolvedValue({
      data: mockCustomer,
    });

    const jsx = await CustomerViewPage({ params: Promise.resolve({ id: '1' }) });
    render(jsx);

    expect(screen.getByText('Datos Generales')).toBeInTheDocument();
    // There might be multiple occurrences (title and detail). Check length or just getAll
    expect(screen.getAllByText('Test Company').length).toBeGreaterThan(0);
    expect(screen.getAllByText('C001').length).toBeGreaterThan(0);
    expect(screen.getByText('Badge: ACTIVE')).toBeInTheDocument();
  });

  it('calls notFound when error occurs', async () => {
    (serverCustomersService.getOne as jest.Mock).mockResolvedValue({
      error: 'Not found',
    });

    // notFound mock throws error to stop execution
    await expect(CustomerViewPage({ params: Promise.resolve({ id: '999' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND'
    );

    expect(notFound).toHaveBeenCalled();
  });
});
