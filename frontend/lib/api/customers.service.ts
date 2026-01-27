import { CreateCustomerDto, CustomerDto as Customer, UpdateCustomerDto } from '@sgcv2/shared';
import { AppResponse, CustomerState } from '@sgcv2/shared';

import { apiClient } from './client';

interface Filters {
  state?: CustomerState;
  search?: string;
}

export const customersService = {
  getAll: async (
    page: number,
    perPage: number,
    { state, search }: Filters
  ): Promise<AppResponse<Customer[]>> => {
    const response = await apiClient.get<AppResponse<Customer[]>>('/customers', {
      params: { page, perPage, state, search },
    });
    return response.data;
  },
  getOne: async (id: string): Promise<AppResponse<Customer>> => {
    const response = await apiClient.get<AppResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },
  create: async (customer: CreateCustomerDto): Promise<AppResponse<Customer>> => {
    const response = await apiClient.post<AppResponse<Customer>>('/customers', customer);
    return response.data;
  },
  update: async (id: string, customer: UpdateCustomerDto): Promise<AppResponse<Customer>> => {
    const response = await apiClient.put<AppResponse<Customer>>(`/customers/${id}`, customer);
    return response.data;
  },
  delete: async (id: string): Promise<AppResponse<void>> => {
    const response = await apiClient.delete<AppResponse<void>>(`/customers/${id}`);
    return response.data;
  },
};
