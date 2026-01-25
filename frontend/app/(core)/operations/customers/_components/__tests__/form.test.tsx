import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '../customer-form';

// Mock useActionState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (action: any, initialState: any) => {
    return [initialState, action, false];
  },
}));

describe('CustomerForm', () => {
  const mockAction = jest.fn().mockResolvedValue({ success: true });
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields', () => {
    render(<CustomerForm action={mockAction} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/código/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre legal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/razón social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rif \/ nit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<CustomerForm action={mockAction} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('dispatches the action on submit', async () => {
    render(<CustomerForm action={mockAction} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /guardar cliente/i });
    fireEvent.click(submitButton);

    expect(mockAction).toHaveBeenCalled();
  });
});
