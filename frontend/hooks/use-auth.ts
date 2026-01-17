import { useAuthStore } from '@/stores/auth.store';
import { useCallback } from 'react';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    checkAuth,
  } = useAuthStore();

  const login = useCallback(
    async (username: string, password: string) => {
      await storeLogin(username, password);
      // Force a hard navigation to ensure cookies are sent internally and middleware recognizes the session
      window.location.href = '/dashboard';
    },
    [storeLogin]
  );

  const logout = useCallback(async () => {
    await storeLogout();
    window.location.href = '/login';
  }, [storeLogout]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
