import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerForm } from '../customer-form';
import { createSchema } from '../../_schemas/schemas';

// Mocks
// ResizeObserver mock for some UI components if needed but usually fine for simple inputs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('CustomerForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields', () => {
    render(
      <CustomerForm
        schema={createSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/código/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre legal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/razón social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rif \/ nit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
  });

  it('displays validation errors for required fields', async () => {
    render(
      <CustomerForm
        schema={createSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
        defaultValues={{
          code: '',
          legalName: '',
          businessName: '',
          taxId: '',
          address: '',
          phone: '',
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(screen.getByText(/El código debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(
        screen.getByText(/El nombre legal debe tener al menos 3 caracteres/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Formato inválido. Debe ser: V-12345678-9/i)).toBeInTheDocument();
      expect(
        screen.getByText(/La dirección debe tener al menos 3 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('submits valid data', async () => {
    render(
      <CustomerForm
        schema={createSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/código/i), { target: { value: 'C001' } });
    fireEvent.change(screen.getByLabelText(/nombre legal/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/rif \/ nit/i), { target: { value: 'J-12345678-9' } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: 'Calle Test 123' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <CustomerForm
        schema={createSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
