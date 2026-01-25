import { render, screen, fireEvent } from '@testing-library/react';
import NewCustomerPage from '../new/page';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../_components/customer-form', () => ({
  CustomerForm: ({ onCancel }: any) => (
    <div>
      <button onClick={onCancel}>Cancel Form</button>
    </div>
  ),
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
}));
jest.mock('../_components/actions', () => ({
  createCustomerAction: jest.fn(),
}));

describe('NewCustomerPage', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
  });

  it('renders page title', () => {
    render(<NewCustomerPage />);
    expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument();
  });

  it('navigates back on cancel', () => {
    render(<NewCustomerPage />);

    fireEvent.click(screen.getByText('Cancel Form'));

    expect(mockBack).toHaveBeenCalled();
  });
});
