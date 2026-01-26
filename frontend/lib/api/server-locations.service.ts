import { createServerApiClient } from './server-client';
import {
  CustomerLocationDto as CustomerLocation,
  AppResponse,
  CreateCustomerLocationDto,
  UpdateCustomerLocationDto,
} from '@sgcv2/shared';
import { AxiosError } from 'axios';

/**
 * Server-side locations service for use in Server Components
 */

export const serverLocationsService = {
  getOne: async (id: string): Promise<AppResponse<CustomerLocation>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar la sede',
        },
      };
    }
  },

  getAll: async (
    customerId: string,
    filters?: { search?: string; page?: number; perPage?: number }
  ): Promise<AppResponse<CustomerLocation[]>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.get(`/customers/${customerId}/locations`, {
        params: filters,
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching locations:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al cargar las sedes',
        },
      };
    }
  },

  create: async (
    customerId: string,
    data: CreateCustomerLocationDto
  ): Promise<AppResponse<CustomerLocation>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.post(`/customers/${customerId}/locations`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error creating location:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al crear la sede',
        },
      };
    }
  },

  update: async (id: string, data: UpdateCustomerLocationDto): Promise<AppResponse<CustomerLocation>> => {
    try {
      const client = await createServerApiClient();
      const response = await client.put(`/locations/${id}`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error updating location:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al actualizar la sede',
        },
      };
    }
  },

  delete: async (id: string): Promise<AppResponse<void>> => {
    try {
      const client = await createServerApiClient();
      await client.delete(`/locations/${id}`);
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting location:', error);
      const isAxiosError = error instanceof AxiosError;
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: isAxiosError ? error.response?.data?.message : 'Error al eliminar la sede',
        },
      };
    }
  },
};
