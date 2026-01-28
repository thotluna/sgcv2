import Link from 'next/link';

import { handleCustomerFilters } from '@feature/customers/actions/customers.actions';
import { Plus, Search } from 'lucide-react';

import { CustomerState } from '@sgcv2/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomersFiltersProps {
  search?: string;
  status?: CustomerState;
}

export function CustomersFilters({ search, status }: CustomersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
      <form
        action={handleCustomerFilters}
        className="flex flex-1 w-full sm:w-auto gap-2 items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Buscar clientes..."
            defaultValue={search || ''}
            className="pl-8"
          />
        </div>
        <div className="relative">
          <select
            name="status"
            defaultValue={status || ''}
            className="h-9 w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="SUSPENDED">Suspendido</option>
          </select>
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Buscar
        </Button>
      </form>
      <Button asChild>
        <Link href="/operations/customers/new">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Link>
      </Button>
    </div>
  );
}
