import Link from 'next/link';

import {
  Box,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  HomeIcon,
  type LucideIcon,
  Package,
  Receipt,
  Settings,
  Truck,
  UserCog,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { serverUsersService } from '@/lib/api/server-users.service';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../components/ui/collapsible';
import { NavUser } from '../nav-user';

export default async function SidebarApp() {
  const response = await serverUsersService.getMe();
  const userPermissions = response.data?.permissions || [];

  const hasPermission = (required?: string[]) => {
    if (!required || required.length === 0) return true;
    return required.some(perm => userPermissions.includes(perm));
  };

  interface MenuItem {
    title: string;
    href: string;
    permissions: string[];
    icon: LucideIcon;
    subItems?: { title: string; href: string; permissions?: string[] }[];
  }

  interface MenuSection {
    session: string;
    icon: LucideIcon;
    permissions: string[];
    items: MenuItem[];
  }

  const menuItems: MenuSection[] = [
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
          href: '#',
          permissions: [],
          icon: Users,
          subItems: [
            {
              title: 'Listado',
              href: '/operations/customers',
              permissions: [],
            },
            {
              title: 'Sub Clientes',
              href: '/operations/customers/sub-customers',
              permissions: [],
            },
            {
              title: 'Sedes',
              href: '/operations/customers/locations',
              permissions: [],
            },
          ],
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
      items: section.items
        .filter(item => hasPermission(item.permissions))
        .map(item => ({
          ...item,
          subItems: item.subItems?.filter(sub => hasPermission(sub.permissions)),
        })),
    }))
    .filter(section => section.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-6 py-4 font-bold text-xl tracking-tight">X TEL</SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {filteredMenuItems.map(section => (
            <Collapsible key={section.session} defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <section.icon className="size-4" />
                    <span className="font-semibold">{section.session}</span>
                    <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-2 border-l-0 border-transparent">
                    {section.items.map(item => (
                      <SidebarMenuItem key={item.title}>
                        {item.subItems && item.subItems.length > 0 ? (
                          <Collapsible className="group/sub-collapsible">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton>
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub className="ml-6 mt-1 border-l border-sidebar-border/50">
                                {item.subItems.map(subItem => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <Link
                                        href={subItem.href}
                                        className="text-sidebar-foreground/70"
                                      >
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <SidebarMenuButton asChild>
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
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
