import { sha256 } from 'js-sha256';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuthenticatedUserDto } from '@sgcv2/shared';

import { authService } from '@/lib/api/auth.service';
import { usersService } from '@/lib/api/users.service';

interface AuthState {
  user: AuthenticatedUserDto | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: AuthenticatedUserDto | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      urlAvatar: '',

      login: async (username, password) => {
        try {
          const response = await authService.login(username, password);

          if (!response.success) {
            throw new Error(response.error?.message || 'Login failed');
          }

          const user = response.data?.user;

          if (user) {
            const address = String(user.email).trim().toLowerCase();
            const hash = sha256(address);
            user.avatar = `https://gravatar.com/avatar/${hash}`;
          }
          // Cookie is set by backend (HttpOnly)

          set({ user: user || null, isAuthenticated: true });
        } catch (error) {
          console.error('Login failed:', error);
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout(); // Backend clears cookie
        } catch (error) {
          console.error('Logout failed', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          // This should only be called from the client (browser)
          const response = await usersService.getMe();
          const userWithRole = response.data;

          if (!userWithRole) {
            throw new Error('User not found');
          }

          const user: AuthenticatedUserDto = {
            id: userWithRole.id,
            username: userWithRole.username,
            email: userWithRole.email,
            firstName: userWithRole.firstName || '',
            lastName: userWithRole.lastName || '',
            status: userWithRole.status || 'ACTIVE',
            roles: userWithRole.roles?.map((role: { name: string }) => role.name),
            permissions: userWithRole.permissions || [],
          };

          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: user => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
