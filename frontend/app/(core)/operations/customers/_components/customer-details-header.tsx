import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerDto, CustomerState } from '@sgcv2/shared';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface CustomerDetailsHeaderProps {
  customer: CustomerDto;
}

export function CustomerDetailsHeader({ customer }: CustomerDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{customer.legalName}</h2>
          <Badge variant={customer.state === CustomerState.ACTIVE ? 'default' : 'secondary'}>
            {customer.state}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Código: <span className="font-mono font-medium">{customer.code}</span>
        </p>
      </div>
      <Button asChild>
        <Link href={`/operations/customers/${customer.id}/update`}>
          <Edit className="mr-2 h-4 w-4" />
          Editar Cliente
        </Link>
      </Button>
    </div>
  );
}
