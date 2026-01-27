import { Search } from 'lucide-react';

import { UserStatus } from '@sgcv2/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { handleUserFilters } from './actions';

interface UsersFiltersProps {
  search?: string;
  status?: UserStatus;
}

export function UsersFilters({ search, status }: UsersFiltersProps) {
  return (
    <form
      action={handleUserFilters}
      className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full sm:w-auto"
    >
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input name="search" placeholder="Search users..." defaultValue={search} className="pl-8" />
      </div>
      <div className="flex items-center gap-2">
        <select
          name="status"
          defaultValue={status || ''}
          className="h-9 w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <Button type="submit" variant="secondary" size="sm">
          Buscar
        </Button>
      </div>
    </form>
  );
}
