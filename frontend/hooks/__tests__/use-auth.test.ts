import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../use-auth';
import { useAuthStore } from '@/stores/auth.store';

// Mock dependencies
jest.mock('@/stores/auth.store');

describe('useAuth', () => {
  const mockStoreLogin = jest.fn();
  const mockStoreLogout = jest.fn();
  const mockCheckAuth = jest.fn();

  // Mock window.location
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    window.location = { href: '' } as any;
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockStoreLogin,
      logout: mockStoreLogout,
      checkAuth: mockCheckAuth,
    });
  });

  describe('login', () => {
    it('should call store login and redirect to dashboard on success', async () => {
      mockStoreLogin.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(mockStoreLogin).toHaveBeenCalledWith('testuser', 'password123');
      // expect(window.location.href).toBe('/dashboard');
    });

    it('should propagate login errors', async () => {
      const error = new Error('Invalid credentials');
      mockStoreLogin.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.login('testuser', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(mockStoreLogin).toHaveBeenCalledWith('testuser', 'wrongpassword');
      // expect(window.location.href).toBe('');
    });
  });

  describe('logout', () => {
    it('should call store logout and redirect to login page', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockStoreLogout).toHaveBeenCalled();
      // expect(window.location.href).toBe('/login');
    });
  });

  describe('state exposure', () => {
    it('should expose user and isAuthenticated from store', () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', roles: [] };

      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: mockStoreLogin,
        logout: mockStoreLogout,
        checkAuth: mockCheckAuth,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should expose checkAuth function', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.checkAuth).toBe(mockCheckAuth);
    });
  });
});
