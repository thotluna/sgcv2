import { authService } from '@/lib/api/auth.service';
import { User } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const { user, token } = await authService.login(username, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error('Login failed:', error);
          set({ user: null, token: null, isAuthenticated: false });
          throw error; //
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },

      checkAuth: async () => {
        const { user, token } = await authService.getMe();
        set({ user, token, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
