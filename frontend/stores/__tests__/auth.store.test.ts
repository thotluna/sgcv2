import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth.store';
import { authService } from '@/lib/api/auth.service';
import { usersService } from '@/lib/api/users.service';

// Mock the services
jest.mock('@/lib/api/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/lib/api/users.service', () => ({
  usersService: {
    getMe: jest.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully and update state', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
      };

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
        },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(result.current.user).toEqual(mockUser);
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
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user state on logout', async () => {
      // Setup initial state
      useAuthStore.setState({
        user: { id: 1, username: 'user' } as any,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useAuthStore());

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should default status to ACTIVE if status is null (edge case)', async () => {
      const mockUserWithNullStatus = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [{ name: 'admin' }],
        firstName: 'Test',
        lastName: 'User',
        status: null, // Simulate null status from backend
      };

      (usersService.getMe as jest.Mock).mockResolvedValue({
        success: true,
        data: mockUserWithNullStatus,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(usersService.getMe).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE', // Expect status to be defaulted to ACTIVE
      });
    });

    it('should fetch user data and update state', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: [{ name: 'admin' }],
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
      };

      (usersService.getMe as jest.Mock).mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(usersService.getMe).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
      });
    });

    it('should clear state on checkAuth failure', async () => {
      (usersService.getMe as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
