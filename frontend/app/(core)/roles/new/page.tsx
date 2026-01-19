import { serverPermissionsService } from '@/lib/api/server-permissions.service';
import { RoleForm } from '../_components/role-form';

export default async function NewRolePage() {
  const permissionsRes = await serverPermissionsService.getAll();
  const permissions = permissionsRes?.success ? permissionsRes.data || [] : [];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Rol</h1>
        <p className="text-muted-foreground">
          Define un nuevo rol y selecciona sus permisos.
        </p>
      </header>

      <main className="bg-card p-6 rounded-xl border shadow-sm">
        <RoleForm permissions={permissions} />
      </main>
    </div>
  );
}
