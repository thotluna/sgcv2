import { handleLocationFilters } from '@feature/customers/actions/locations-actions';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationsFiltersProps {
  search?: string;
}

export function LocationsFilters({ search }: LocationsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
      <form
        action={handleLocationFilters}
        aria-label="Filtros de sedes"
        className="flex flex-1 w-full sm:w-auto gap-2 items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Buscar sedes..."
            defaultValue={search || ''}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Buscar
        </Button>
      </form>
    </div>
  );
}
