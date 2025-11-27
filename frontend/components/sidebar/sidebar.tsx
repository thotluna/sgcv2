'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  ChevronDown,
  HomeIcon,
  ClipboardList,
  Users,
  Calendar,
  FileText,
  Package,
  Wrench,
  Box,
  Truck,
  FileCheck,
  Receipt,
  CreditCard,
  DollarSign,
  Wallet,
  UserCog,
} from 'lucide-react';
import { AvatarUser } from '../avatar/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export default function SidebarApp() {
  const menuItems = [
    {
      session: 'Operaciones',
      icon: ClipboardList,
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: HomeIcon,
        },
        {
          title: 'Órdenes de Servicio',
          href: '/dashboard/operations/service-orders',
          icon: ClipboardList,
        },
        {
          title: 'Clientes',
          href: '/dashboard/operations/clients',
          icon: Users,
        },
        {
          title: 'Cronograma',
          href: '/dashboard/operations/schedule',
          icon: Calendar,
        },
        {
          title: 'Reportes',
          href: '/dashboard/operations/reports',
          icon: FileText,
        },
      ],
    },
    {
      session: 'Logística',
      icon: Package,
      items: [
        {
          title: 'Equipos',
          href: '/dashboard/logistics/equipment',
          icon: Package,
        },
        {
          title: 'Herramientas',
          href: '/dashboard/logistics/tools',
          icon: Wrench,
        },
        {
          title: 'Insumos',
          href: '/dashboard/logistics/supplies',
          icon: Box,
        },
        {
          title: 'Vehículos',
          href: '/dashboard/logistics/vehicles',
          icon: Truck,
        },
        {
          title: 'Notas de Entrega',
          href: '/dashboard/logistics/delivery-notes',
          icon: FileCheck,
        },
      ],
    },
    {
      session: 'Administración',
      icon: Wallet,
      items: [
        {
          title: 'Proformas',
          href: '/dashboard/administration/proformas',
          icon: Receipt,
        },
        {
          title: 'Facturas',
          href: '/dashboard/administration/invoices',
          icon: FileText,
        },
        {
          title: 'Pagos',
          href: '/dashboard/administration/payments',
          icon: CreditCard,
        },
        {
          title: 'Cuentas por Cobrar',
          href: '/dashboard/administration/accounts-receivable',
          icon: DollarSign,
        },
        {
          title: 'Nómina',
          href: '/dashboard/administration/payroll',
          icon: Wallet,
        },
        {
          title: 'Empleados',
          href: '/dashboard/administration/employees',
          icon: UserCog,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>X TEL</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(section => (
            <Collapsible key={section.session} defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <section.icon />
                    <span>{section.session}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {section.items.map(item => (
                      <SidebarMenuSubItem key={item.title}>
                        <a href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <AvatarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
