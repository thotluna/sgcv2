import { apiClient } from './client';

interface filters {
  state?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  search?: string;
}

export const customersService = {
  getAll: async (page: number, perPage: number, { state, search }: filters) => {
    const response = await apiClient.get('/customers', {
      params: { page, perPage, state, search },
    });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },
  create: async (customer: any) => {
    const response = await apiClient.post('/customers', customer);
    return response.data;
  },
  update: async (id: string, customer: any) => {
    const response = await apiClient.put(`/customers/${id}`, customer);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  },
};
