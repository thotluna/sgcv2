import { fetchClient } from '@lib/api/fetch-client';

import {
  AppResponse,
  CreateCustomerLocationDto,
  CustomerLocationDto,
  UpdateCustomerLocationDto,
} from '@sgcv2/shared';

export async function getLocationById(id: string): Promise<AppResponse<CustomerLocationDto>> {
  return fetchClient(`/locations/${id}`);
}

export async function getAllLocations(
  customerId?: string,
  filters?: {
    search?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<AppResponse<CustomerLocationDto[]>> {
  const searchParams = new URLSearchParams();
  if (filters?.page) searchParams.append('page', filters.page.toString());
  if (filters?.perPage) searchParams.append('perPage', filters.perPage.toString());
  if (filters?.search) searchParams.append('search', filters.search);
  if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) searchParams.append('sortOrder', filters.sortOrder || 'asc');

  const queryString = searchParams.toString();
  const url = customerId
    ? `/customers/${customerId}/locations${queryString ? `?${queryString}` : ''}`
    : `/locations${queryString ? `?${queryString}` : ''}`;
  return fetchClient(url);
}

export async function createLocation(
  customerId: string,
  data: CreateCustomerLocationDto
): Promise<AppResponse<CustomerLocationDto>> {
  return fetchClient(`/customers/${customerId}/locations`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLocation(
  id: string,
  data: UpdateCustomerLocationDto
): Promise<AppResponse<CustomerLocationDto>> {
  return fetchClient(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLocation(id: string): Promise<AppResponse<void>> {
  return fetchClient(`/locations/${id}`, {
    method: 'DELETE',
  });
}
