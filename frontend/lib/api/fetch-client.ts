import 'server-only';
import { cookies } from 'next/headers';

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
    // Importante para que las cookies fluyan en el cliente
    credentials: isServer ? undefined : 'include',
  });

  // Manejo de error global (como hacía Axios)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }

  return response.json();
}
