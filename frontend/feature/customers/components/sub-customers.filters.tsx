import Link from 'next/link';

import { handleCustomerFilters } from '@feature/customers/actions/customers.actions';
import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SubCustomersFiltersProps {
  customerId?: string;
  search?: string;
}

export function SubCustomersFilters({ customerId, search }: SubCustomersFiltersProps) {
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
        <Button type="submit" variant="secondary" size="sm">
          Buscar
        </Button>
      </form>
      <Button asChild>
        <Link href={`/operations/customers/sub-customers/${customerId}/new`}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Sub Cliente
        </Link>
      </Button>
    </div>
  );
}
