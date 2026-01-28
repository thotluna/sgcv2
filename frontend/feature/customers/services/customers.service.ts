import { fetchClient } from '@lib/api/fetch-client';

import { AppResponse, CreateCustomerDto, CustomerDto, UpdateCustomerDto } from '@sgcv2/shared';

export async function getCustomerById(id: string): Promise<AppResponse<CustomerDto>> {
  return fetchClient(`/customers/${id}`);
}

export async function getAllCustomers(
  page: number,
  perPage: number,
  filters?: { state?: string; search?: string }
): Promise<AppResponse<CustomerDto[]>> {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (filters?.state) searchParams.append('state', filters.state);
  if (filters?.search) searchParams.append('search', filters.search);

  const queryString = searchParams.toString();
  return fetchClient(`/customers?${queryString}`);
}

export async function createCustomer(data: CreateCustomerDto): Promise<AppResponse<CustomerDto>> {
  return fetchClient('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerDto
): Promise<AppResponse<CustomerDto>> {
  return fetchClient(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: string): Promise<AppResponse<void>> {
  return fetchClient(`/customers/${id}`, {
    method: 'DELETE',
  });
}
