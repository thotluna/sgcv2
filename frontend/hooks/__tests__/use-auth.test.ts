import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/stores/auth.store');
jest.mock('next/navigation');

describe('useAuth', () => {
  const mockStoreLogin = jest.fn();
  const mockStoreLogout = jest.fn();
  const mockCheckAuth = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      login: mockStoreLogin,
      logout: mockStoreLogout,
      checkAuth: mockCheckAuth,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
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
      expect(mockRouterPush).toHaveBeenCalledWith('/');
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
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call store logout and redirect to login page', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(mockStoreLogout).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('state exposure', () => {
    it('should expose user, token, and isAuthenticated from store', () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', roles: [] };
      const mockToken = 'mock-token';

      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        login: mockStoreLogin,
        logout: mockStoreLogout,
        checkAuth: mockCheckAuth,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toEqual(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should expose checkAuth function', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.checkAuth).toBe(mockCheckAuth);
    });
  });
});
