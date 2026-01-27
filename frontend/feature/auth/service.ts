import { fetchClient } from '@lib/api/fetch-client';

export async function login(username: string, password: string) {
  return fetchClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return fetchClient('/auth/logout', {
    method: 'POST',
  });
}
