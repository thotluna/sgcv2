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
  setUser: (user: User | null) => void;
}

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Use Secure flag only in production (HTTPS)
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? ';Secure' : '';

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secureFlag}`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const response = await authService.login(username, password);

          if (!response.success) {
            throw new Error(response.error?.message || 'Login failed');
          }

          const user = response.data?.user;
          const token = response.data?.token;

          setCookie('auth-token', token || '');

          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error('Login failed:', error);
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        deleteCookie('auth-token');

        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const token = getCookie('auth-token');

          if (!token) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }

          const user = await authService.getMe();

          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error('Auth check failed:', error);
          deleteCookie('auth-token');
          set({ user: null, token: null, isAuthenticated: false });
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
