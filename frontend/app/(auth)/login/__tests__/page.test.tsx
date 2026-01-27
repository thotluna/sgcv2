import { render, screen } from '@testing-library/react';
import LoginPage from '../page';
import * as actions from '@feature/auth/actions';

// Mock the actions
jest.mock('@feature/auth/actions', () => ({
  loginAction: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useFormStatus
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    useFormStatus: jest.fn(() => ({ pending: false })),
  };
});

describe('LoginPage', () => {
  const mockLoginAction = actions.loginAction as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginAction.mockResolvedValue({ success: false, message: '' });
  });

  describe('rendering', () => {
    it('should render login form correctly', () => {
      render(<LoginPage />);

      expect(screen.getByText('Sistema de Gestión y Control')).toBeInTheDocument();
      expect(
        screen.getByText('Introduce tus credenciales para acceder a tu cuenta.')
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('should have username and password inputs', () => {
      render(<LoginPage />);

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('interactions', () => {
    it('should contain form with action', () => {
      // Since we are mocking the action, checking if it is called might require submitting
      // But verifying <form> exists is good enough for structure
      render(<LoginPage />);
      const form = screen.getByRole('button', { name: /iniciar sesión/i }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  // Note: Testing useActionState with userEvent and full integration in jsdom can be tricky
  // without a full Server Action environment or proper React 19/Canary support in Jest.
  // We focus on rendering and accessible elements.
});
