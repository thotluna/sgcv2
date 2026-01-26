import { createServerApiClient } from './server-client';
import {
  SubCustomerDto as SubCustomer,
  AppResponse,
  CreateSubCustomerDto,
  UpdateSubCustomerDto,
} from '@sgcv2/shared';
import { AxiosError } from 'axios';

/**
 * Server-side sub-customers service for use in Server Components
 */

export const serverSubCustomersService = {
  getOne: async (customerId: string, id: string): Promise<AppResponse<SubCustomer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/customers/${customerId}/sub-customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub-customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar el sub-cliente',
        },
      };
    }
  },

  getAll: async (
    customerId: string,
    filters?: { search?: string; page?: number; perPage?: number }
  ): Promise<AppResponse<SubCustomer[]>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/customers/${customerId}/sub-customers`, {
        params: filters,
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching sub-customers:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar los sub-clientes',
        },
      };
    }
  },

  create: async (customerId: string, data: CreateSubCustomerDto): Promise<AppResponse<SubCustomer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.post(`/customers/${customerId}/sub-customers`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error creating sub-customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al crear el sub-cliente',
        },
      };
    }
  },

  update: async (
    customerId: string,
    id: string,
    data: UpdateSubCustomerDto
  ): Promise<AppResponse<SubCustomer>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.put(`/customers/${customerId}/sub-customers/${id}`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error updating sub-customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al actualizar el sub-cliente',
        },
      };
    }
  },

  delete: async (customerId: string, id: string): Promise<AppResponse<void>> => {
    try {
      const client = await createServerApiClient();
      await client.delete(`/customers/${customerId}/sub-customers/${id}`);
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting sub-customer:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al eliminar el sub-cliente',
        },
      };
    }
  },
};
