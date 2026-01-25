import { createServerApiClient } from './server-client';
import {
  CustomerDto as Customer,
  AppResponse,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@sgcv2/shared';
import { AxiosError } from 'axios';

/**
 * Server-side customers service for use in Server Components
 * Uses cookies from server context for authentication
 */

export const serverCustomersService = {
  getOne: async (id: string): Promise<AppResponse<Customer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/customers/${id}`);
      return response.data;
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

  create: async (data: CreateCustomerDto): Promise<AppResponse<Customer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.post('/customers', data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al crear el cliente',
        },
      };
    }
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<AppResponse<Customer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.put(`/customers/${id}`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al actualizar el cliente',
        },
      };
    }
  },

  delete: async (id: string): Promise<AppResponse<void>> => {
    try {
      const client = await createServerApiClient();
      await client.delete(`/customers/${id}`);
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al eliminar el cliente',
        },
      };
    }
  },
};
