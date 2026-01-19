import Link from 'next/link';
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
  Settings,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../components/ui/collapsible';
import { NavUser } from '../nav-user';
import { serverUsersService } from '@/lib/api/server-users.service';

export default async function SidebarApp() {
  const response = await serverUsersService.getMe();
  const userPermissions = response.data?.permissions || [];

  const hasPermission = (required?: string[]) => {
    if (!required || required.length === 0) return true;
    return required.some(perm => userPermissions.includes(perm));
  };

  const menuItems = [
    {
      session: 'Operaciones',
      icon: ClipboardList,
      permissions: [],
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          permissions: [],
          icon: HomeIcon,
        },
        {
          title: 'Órdenes de Servicio',
          href: '/operations/service-orders',
          permissions: [],
          icon: ClipboardList,
        },
        {
          title: 'Clientes',
          href: '/operations/customers',
          permissions: [],
          icon: Users,
        },
        {
          title: 'Cronograma',
          href: '/operations/schedule',
          permissions: [],
          icon: Calendar,
        },
        {
          title: 'Reportes',
          href: '/operations/reports',
          permissions: [],
          icon: FileText,
        },
      ],
    },
    {
      session: 'Logística',
      icon: Package,
      permissions: [],
      items: [
        {
          title: 'Equipos',
          href: '/dashboard/logistics/equipment',
          permissions: [],
          icon: Package,
        },
        {
          title: 'Herramientas',
          href: '/dashboard/logistics/tools',
          permissions: [],
          icon: Wrench,
        },
        {
          title: 'Insumos',
          href: '/dashboard/logistics/supplies',
          permissions: [],
          icon: Box,
        },
        {
          title: 'Vehículos',
          href: '/dashboard/logistics/vehicles',
          permissions: [],
          icon: Truck,
        },
        {
          title: 'Notas de Entrega',
          href: '/dashboard/logistics/delivery-notes',
          permissions: [],
          icon: FileCheck,
        },
      ],
    },
    {
      session: 'Administración',
      icon: Wallet,
      permissions: [],
      items: [
        {
          title: 'Proformas',
          href: '/dashboard/administration/proformas',
          permissions: [],
          icon: Receipt,
        },
        {
          title: 'Facturas',
          href: '/dashboard/administration/invoices',
          permissions: [],
          icon: FileText,
        },
        {
          title: 'Pagos',
          href: '/dashboard/administration/payments',
          permissions: [],
          icon: CreditCard,
        },
        {
          title: 'Cuentas por Cobrar',
          href: '/dashboard/administration/accounts-receivable',
          permissions: [],
          icon: DollarSign,
        },
        {
          title: 'Nómina',
          href: '/dashboard/administration/payroll',
          permissions: [],
          icon: Wallet,
        },
        {
          title: 'Empleados',
          href: '/dashboard/administration/employees',
          permissions: [],
          icon: UserCog,
        },
      ],
    },
    {
      session: 'Sistema',
      icon: Settings,
      permissions: ['users.read', 'roles.read', 'permissions.read'],
      items: [
        {
          title: 'Usuarios',
          href: '/users',
          permissions: ['users.read'],
          icon: UserCog,
        },
        {
          title: 'Roles',
          href: '/roles',
          permissions: ['roles.read'],
          icon: UserCog,
        },
        {
          title: 'Permisos',
          href: '/permissions',
          permissions: ['permissions.read'],
          icon: UserCog,
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter(section => hasPermission(section.permissions))
    .map(section => ({
      ...section,
      items: section.items.filter(item => hasPermission(item.permissions)),
    }))
    .filter(section => section.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>X TEL</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map(section => (
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
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
