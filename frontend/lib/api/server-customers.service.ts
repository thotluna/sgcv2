import { createServerApiClient } from './server-client';

/**
 * Server-side customers service for use in Server Components
 * Uses cookies from server context for authentication
 */

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

export const serverCustomersService = {
  getOne: async (id: string): Promise<ServiceResponse<any>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/customers/${id}`);
      return {
        data: response.data.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Error fetching customer:', error);
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar el cliente',
      };
    }
  },

  getAll: async (
    page: number,
    perPage: number,
    filters?: { state?: string; search?: string }
  ): Promise<ServiceResponse<any[]>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get('/customers', {
        params: { page, perPage, ...filters },
      });
      return {
        data: response.data.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar los clientes',
      };
    }
  },
};
