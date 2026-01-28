import { cookies } from 'next/headers';

import 'server-only';

export async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const isServer = typeof window === 'undefined';
  let token: string | undefined;

  if (isServer) {
    const cookieStore = await cookies();
    token = cookieStore.get('auth-token')?.value;
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: isServer ? undefined : 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData) {
      return errorData;
    }
    throw new Error(response.statusText || 'API Error');
  }

  return response.json();
}
