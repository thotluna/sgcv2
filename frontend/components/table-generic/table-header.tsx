'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { HeaderType, SortOrder } from '@components/table-generic';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';

interface TableHeaderProps {
  header: HeaderType;
  currentSortBy?: string;
  currentSortOrder?: SortOrder;
}

export function TableHeader({ header, currentSortBy, currentSortOrder }: TableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = () => {
    if (!header.isOrderable) return;

    const params = new URLSearchParams(searchParams.toString());

    if (currentSortBy === header.id) {
      const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortOrder', newOrder);
    } else {
      params.set('sortBy', header.id);
      params.set('sortOrder', 'asc');
    }

    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = () => {
    if (currentSortBy !== header.id) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return currentSortOrder === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHead>
      {header.isOrderable ? (
        <Button variant="ghost" onClick={handleSort} className="-ml-4 h-auto p-2 hover:bg-muted">
          {header.label}
          {getSortIcon()}
        </Button>
      ) : (
        <span>{header.label}</span>
      )}
    </TableHead>
  );
}
