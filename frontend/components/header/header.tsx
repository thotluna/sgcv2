'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function Header() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);

    const breadcrumbMap: Record<string, string> = {
      dashboard: 'Dashboard',
      operations: 'Operaciones',
      logistics: 'Logística',
      administration: 'Administración',
      'service-orders': 'Órdenes de Servicio',
      clients: 'Clientes',
      schedule: 'Cronograma',
      reports: 'Reportes',
      equipment: 'Equipos',
      tools: 'Herramientas',
      supplies: 'Insumos',
      vehicles: 'Vehículos',
      'delivery-notes': 'Notas de Entrega',
      proformas: 'Proformas',
      invoices: 'Facturas',
      payments: 'Pagos',
      'accounts-receivable': 'Cuentas por Cobrar',
      payroll: 'Nómina',
      employees: 'Empleados',
    };

    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = breadcrumbMap[path] || path;
      const isLast = index === paths.length - 1;

      return { href, label, isLast };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="h-6 w-px bg-border" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!crumb.isLast && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
