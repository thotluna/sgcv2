import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewCustomerPage from '../new/page';
import { customersService } from '@/lib/api/customers.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
jest.mock('../_components/customer-form', () => ({
  CustomerForm: ({ onSubmit, onCancel, isLoading }: any) => (
    <div>
      <button onClick={() => onSubmit({ code: 'C001', legalName: 'Test' })}>Submit Form</button>
      <button onClick={onCancel}>Cancel Form</button>
      {isLoading && <span>Loading...</span>}
    </div>
  ),
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
}));

describe('NewCustomerPage', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  it('renders page title', () => {
    render(<NewCustomerPage />);
    expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument();
  });

  it('calls create service on form submit', async () => {
    (customersService.create as jest.Mock).mockResolvedValue({ success: true, data: {} });

    render(<NewCustomerPage />);

    fireEvent.click(screen.getByText('Submit Form'));

    await waitFor(() => {
      expect(customersService.create).toHaveBeenCalledWith({ code: 'C001', legalName: 'Test' });
      expect(toast.success).toHaveBeenCalledWith('Cliente creado exitosamente');
      expect(mockPush).toHaveBeenCalledWith('/operations/customers');
    });
  });

  it('handles create error', async () => {
    const errorMsg = 'Error creating';
    (customersService.create as jest.Mock).mockRejectedValue({
      response: { data: { error: { message: errorMsg } } },
    });

    render(<NewCustomerPage />);

    fireEvent.click(screen.getByText('Submit Form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Error al crear el cliente: Error desconocido')
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('navigates back on cancel', () => {
    render(<NewCustomerPage />);

    fireEvent.click(screen.getByText('Cancel Form'));

    expect(mockBack).toHaveBeenCalled();
  });
});
