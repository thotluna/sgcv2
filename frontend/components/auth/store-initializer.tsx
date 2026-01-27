'use client';

import { useRef } from 'react';

import { AuthenticatedUserDto } from '@sgcv2/shared';

import { useAuthStore } from '@/stores/auth.store';

interface StoreInitializerProps {
  user: AuthenticatedUserDto | null;
  token: string | null;
}

export default function StoreInitializer({ user, token }: StoreInitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (token && user) {
      // User data was fetched on the server, use it directly
      useAuthStore.setState({ user, isAuthenticated: true });
    } else if (token && !user) {
      // Token exists but no user data, try to fetch it (fallback)
      useAuthStore.setState({ user: null, isAuthenticated: false });
      useAuthStore.getState().checkAuth();
    } else {
      // No token, user is not authenticated
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
    initialized.current = true;
  }

  return null;
}
