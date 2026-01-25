import { render, screen } from '@testing-library/react';
import NewCustomerPage from '../page';

// Mock components
jest.mock('../_components/customer-form', () => ({
  CustomerForm: () => <div data-testid="customer-form">Customer Form</div>,
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NewCustomerPage', () => {
  it('renders title and description', () => {
    render(<NewCustomerPage />);

    expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument();
    expect(
      screen.getByText('Ingrese los datos básicos para registrar un nuevo cliente en el sistema.')
    ).toBeInTheDocument();
  });

  it('renders CustomerForm', () => {
    render(<NewCustomerPage />);
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
  });
});
