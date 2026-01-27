import { CustomerDto, CustomerState } from '@sgcv2/shared';

import { DataPagination } from '@/components/data-pagination';
import { serverCustomersService } from '@/lib/api/server-customers.service';

import { CustomersFilters } from './_components/filters';
import { CustomersTable } from './_components/table';

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const perPage = typeof params.perPage === 'string' ? parseInt(params.perPage) : 5;

  const filters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    state: typeof params.status === 'string' ? (params.status as CustomerState) : undefined,
  };

  let customers: CustomerDto[] = [];
  let totalPages = 1;

  try {
    const response = await serverCustomersService.getAll(page, perPage, filters);
    if (response.success) {
      customers = response.data || [];
      // Note: Assuming the service or a future update provides actual total pages
      // For now, if we have a way to calculate it or if metadata exists.
      // Based on users page pattern:
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
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <CustomersFilters search={filters.search} status={filters.state} />

      <CustomersTable data={customers} />

      <DataPagination currentPage={page} totalPages={totalPages} createPageUrl={createPageUrl} />
    </div>
  );
}
