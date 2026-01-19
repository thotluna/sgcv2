import { serverRolesService } from '@/lib/api/server-roles.service';
import { PermissionsTable } from './_components/permissions-table';
import { ShieldCheck } from 'lucide-react';

export default async function PermissionsPage() {
  let permissions: any[] = [];

  try {
    const response = await serverRolesService.getAllPermissions();
    if (response?.success) {
      permissions = response.data || [];
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Permisos del Sistema</h1>
          </div>
          <p className="text-muted-foreground">
            Lista completa de todos los permisos definidos en el sistema. Estos permisos se asignan a los roles para controlar el acceso a los recursos.
          </p>
        </div>
      </header>

      <main className="flex w-full flex-col gap-4">
        <PermissionsTable data={permissions} />
      </main>
    </div>
  );
}
