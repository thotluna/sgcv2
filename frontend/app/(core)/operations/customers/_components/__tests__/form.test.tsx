import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '../customer-form';
import { useActionState } from 'react';

// Mock essential hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}));

describe('CustomerForm', () => {
  const mockAction = jest.fn();
  const mockBack = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useActionState as jest.Mock).mockReturnValue([{ success: false }, mockAction, false]);
  });

  it('renders all form fields', () => {
    render(<CustomerForm />);

    expect(screen.getByLabelText(/Código/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RIF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Legal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Razón Social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
  });

  it('calls window.history.back when cancel button is clicked', () => {
    render(<CustomerForm />);
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    expect(mockBack).toHaveBeenCalled();
  });
});
