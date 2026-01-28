'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';

import { handlePermissionFilters } from '../actions';

interface PermissionsFiltersProps {
  search?: string;
}

export function PermissionsFilters({ search: initialSearch }: PermissionsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch || '');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch !== (initialSearch || '')) {
      handlePermissionFilters(router, searchParams, debouncedSearch);
    }
  }, [debouncedSearch, router, searchParams, initialSearch]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar permisos..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
