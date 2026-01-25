import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '../customer-form';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

// Mock essential hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}));

describe('CustomerForm', () => {
  const mockBack = jest.fn();
  const mockAction = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
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

  it('calls router.back when cancel button is clicked', () => {
    render(<CustomerForm />);
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    expect(mockBack).toHaveBeenCalled();
  });
});
