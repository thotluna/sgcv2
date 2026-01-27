import { cookies } from 'next/headers';

import axios from 'axios';

/**
 * Server-side API client for use in Server Components and Server Actions
 * This client can access cookies from the server context
 */
export async function createServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
