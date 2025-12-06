'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { StateCustomer } from '../types/types';

interface CustomersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StateCustomer | undefined;
  onStatusChange: (value: StateCustomer) => void;
  onCreateClick: () => void;
}

export function CustomersToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreateClick,
}: CustomersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
      <div className="flex flex-1 w-full sm:w-auto gap-2 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="relative">
          <select
            value={status || ''}
            onChange={e => onStatusChange(e.target.value as StateCustomer)}
            className="h-9 w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="SUSPENDED">Suspendido</option>
          </select>
        </div>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </Button>
    </div>
  );
}
