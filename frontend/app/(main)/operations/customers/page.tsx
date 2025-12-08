'use client';

import { AxiosError } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CustomersTable } from './_components/table';
import { CustomersToolbar } from './_components/toolbar';
import { customersService } from '@/lib/api/customers.service';
import { CustomerDto, CustomerState } from '@sgcv2/shared';
import { toast } from 'sonner';
import { DataPagination } from '@/components/data-pagination';

interface FilterType {
  search?: string;
  state?: CustomerState;
}

export default function CustomersPage() {
  const router = useRouter();
  const [data, setData] = useState<CustomerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CustomerState | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: FilterType = {};
      if (status) filters.state = status;
      if (search) filters.search = search;

      const response = await customersService.getAll(currentPage, itemsPerPage, filters);

      if (response.error) {
        toast.error(response.error.message);
        setData([]);
        setTotalPages(1);
      }

      if (response.success) {
        setData(response.data || []);
        const pages = response.metadata?.pagination?.totalPages || 1;
        setTotalPages(pages);
      }
    } catch (error) {
      console.error('Failed to fetch customers', error);
      toast.error('Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, search, status]);

  const handleDelete = async (id: string) => {
    try {
      await customersService.delete(id);
      toast.success('Cliente eliminado exitosamente');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete customer', error);
      let errorMessage = 'Error al eliminar el cliente';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onCreateClick={() => router.push('/operations/customers/new')}
      />

      <CustomersTable data={data} isLoading={isLoading} onDelete={handleDelete} />

      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
