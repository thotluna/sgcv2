import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    checkAuth,
  } = useAuthStore();

  const login = useCallback(
    async (username: string, password: string) => {
      await storeLogin(username, password);
      router.push('/dashboard');
    },
    [storeLogin, router]
  );

  const logout = useCallback(() => {
    storeLogout();
    router.push('/login');
  }, [storeLogout, router]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
