import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: allows cookies to be sent with requests
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        // Prevent redirect loop if we are already on the login page
        // if (!window.location.pathname.startsWith('/login')) {
        //   window.location.href = '/login?expired=true';
        // }
      }
    }
    return Promise.reject(error);
  }
);
