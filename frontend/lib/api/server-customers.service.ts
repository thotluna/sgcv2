import { createServerApiClient } from './server-client';
import { Customer } from '@/app/(main)/operations/customers/types/types';
import { AppResponse } from '@/types/response.type';
import { AxiosError } from 'axios';

/**
 * Server-side customers service for use in Server Components
 * Uses cookies from server context for authentication
 */

export const serverCustomersService = {
  getOne: async (id: string): Promise<AppResponse<Customer>> => {
    try {
      const client = await createServerApiClient();
      return await client.get(`/customers/${id}`);
    } catch (error) {
      console.error('Error fetching customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar el cliente',
        },
      };
    }
  },

  getAll: async (
    page: number,
    perPage: number,
    filters?: { state?: string; search?: string }
  ): Promise<AppResponse<Customer[]>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get('/customers', {
        params: { page, perPage, ...filters },
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar los clientes',
        },
      };
    }
  },
};
