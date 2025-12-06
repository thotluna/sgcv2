import axios from 'axios';

// Helper function to get cookie value (works in both server and client)
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    // Server-side: cookies should be passed via headers
    return undefined;
  }

  // Client-side
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: allows cookies to be sent with requests
});

apiClient.interceptors.request.use(config => {
  // Try to get token from cookie
  const token = getCookie('auth-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear the auth cookie
      document.cookie = 'auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';

      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
