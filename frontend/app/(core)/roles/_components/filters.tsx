import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { handleRoleFilters } from './actions';

interface RolesFiltersProps {
  search?: string;
}

export function RolesFilters({ search }: RolesFiltersProps) {
  return (
    <form
      action={handleRoleFilters}
      className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full sm:w-auto"
    >
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input name="search" placeholder="Buscar roles..." defaultValue={search} className="pl-8" />
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Buscar
      </Button>
    </form>
  );
}
