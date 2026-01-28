import { CustomerDto, CustomerState } from '@sgcv2/shared';

import { DataPagination } from '@/components/data-pagination';
import { serverCustomersService } from '@/lib/api/server-customers.service';

import { CustomersTable } from './table';

interface CustomersTableContentProps {
  page: number;
  perPage: number;
  filters: {
    search?: string;
    state?: CustomerState;
  };
}

export async function CustomersTableContent({
  page,
  perPage,
  filters,
}: CustomersTableContentProps) {
  let customers: CustomerDto[] = [];
  let totalPages = 1;

  try {
    const response = await serverCustomersService.getAll(page, perPage, filters);
    if (response.success) {
      customers = response.data || [];
      totalPages = response.metadata?.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
  }

  const createPageUrl = (newPage: number) => {
    const urlParams = new URLSearchParams();

    if (filters.search) {
      urlParams.set('search', filters.search);
    }

    if (filters.state) {
      urlParams.set('status', filters.state);
    }

    if (newPage > 1) {
      urlParams.set('page', newPage.toString());
    }

    if (perPage !== 5) {
      urlParams.set('perPage', perPage.toString());
    }

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '/operations/customers';
  };

  return (
    <>
      <CustomersTable data={customers} />
      <DataPagination currentPage={page} totalPages={totalPages} createPageUrl={createPageUrl} />
    </>
  );
}
