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

let cookieStore = '';

Object.defineProperty(document, 'cookie', {
  get: () => cookieStore,
  set: (value: string) => {
    const [cookiePair] = value.split(';');
    const [name, val] = cookiePair.split('=');

    if (value.includes('expires=Thu, 01 Jan 1970')) {
      const cookies = cookieStore.split('; ').filter(c => !c.startsWith(`${name}=`));
      cookieStore = cookies.join('; ');
    } else {
      const cookies = cookieStore.split('; ').filter(c => c && !c.startsWith(`${name}=`));
      cookies.push(`${name}=${val}`);
      cookieStore = cookies.join('; ');
    }
  },
  configurable: true,
});

function getCookie(name: string): string | null {
  const value = `; ${cookieStore}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

describe('useAuthStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
    jest.clearAllMocks();
    localStorageMock.clear();
    cookieStore = '';
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
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
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

    it('should store token in cookie on successful login', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      const mockToken = 'mock-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(getCookie('auth-token')).toBe(mockToken);
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
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
        },
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

    it('should remove auth token from cookies', async () => {
      // First login to set the cookie
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      // Verify cookie is set
      expect(getCookie('auth-token')).toBe('mock-token');

      // Logout
      act(() => {
        result.current.logout();
      });

      // Verify cookie is removed
      expect(getCookie('auth-token')).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should fetch user data when token exists in cookie', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };

      // Set a token in cookie
      cookieStore = 'auth-token=mock-token';

      (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(authService.getMe).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should not fetch user data when no token in cookie', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(authService.getMe).not.toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear state on checkAuth failure', async () => {
      // Set a token in cookie
      cookieStore = 'auth-token=invalid-token';

      (authService.getMe as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      // Cookie should be cleared
      expect(getCookie('auth-token')).toBeNull();
    });
  });

  describe('persistence', () => {
    it('should store token in cookies and maintain state', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [],
        permissions: [],
      };
      const mockToken = 'mock-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      // Verify state is updated
      expect(result.current.token).toBe(mockToken);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);

      // Verify token is in cookie (secure storage)
      expect(getCookie('auth-token')).toBe(mockToken);

      // The important part: token is in cookies, not localStorage
      // User data persistence is handled by Zustand persist middleware
    });
  });
});
