import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth.store';
import { authService } from '@/lib/api/auth.service';

// Mock the auth service
jest.mock('@/lib/api/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully and update state', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      const mockToken = 'mock-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.login('testuser', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user state on logout', async () => {
      // First login
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should remove auth data from localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set some data in localStorage
      localStorageMock.setItem('auth-storage', JSON.stringify({ state: { token: 'test' } }));

      act(() => {
        result.current.logout();
      });

      expect(localStorageMock.getItem('auth-storage')).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should fetch user data and update state', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };

      (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(authService.getMe).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should update state correctly on login for persistence', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      const mockToken = 'mock-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      // Verify state is updated (Zustand will handle persistence automatically)
      expect(result.current.token).toBe(mockToken);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
