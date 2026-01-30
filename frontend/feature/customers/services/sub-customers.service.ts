import { fetchClient } from '@lib/api/fetch-client';

import {
  AppResponse,
  CreateSubCustomerDto,
  SubCustomerDto,
  UpdateSubCustomerDto,
} from '@sgcv2/shared';

export async function getSubCustomerById(
  customerId: string,
  id: string
): Promise<AppResponse<SubCustomerDto>> {
  return fetchClient(`/customers/${customerId}/sub-customers/${id}`);
}

export async function getAllSubCustomers(
  customerId: string,
  filters?: {
    search?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<AppResponse<SubCustomerDto[]>> {
  const searchParams = new URLSearchParams();
  if (filters?.page) searchParams.append('page', filters.page.toString());
  if (filters?.perPage) searchParams.append('perPage', filters.perPage.toString());
  if (filters?.search) searchParams.append('search', filters.search);
  if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) searchParams.append('sortOrder', filters.sortOrder);

  const queryString = searchParams.toString();
  const url = `/customers/${customerId}/sub-customers${queryString ? `?${queryString}` : ''}`;
  return fetchClient(url);
}

export async function createSubCustomer(
  customerId: string,
  data: CreateSubCustomerDto
): Promise<AppResponse<SubCustomerDto>> {
  return fetchClient(`/customers/${customerId}/sub-customers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubCustomer(
  customerId: string,
  id: string,
  data: UpdateSubCustomerDto
): Promise<AppResponse<SubCustomerDto>> {
  return fetchClient(`/customers/${customerId}/sub-customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSubCustomer(
  customerId: string,
  id: string
): Promise<AppResponse<void>> {
  return fetchClient(`/customers/${customerId}/sub-customers/${id}`, {
    method: 'DELETE',
  });
}
