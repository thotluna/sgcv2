import { serverRolesService } from '@/lib/api/server-roles.service';
import { serverPermissionsService } from '@/lib/api/server-permissions.service';
import { RoleForm } from '../_components/role-form';
import { notFound } from 'next/navigation';

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params;
  const roleId = parseInt(id);

  if (isNaN(roleId)) {
    return notFound();
  }

  const [roleRes, permissionsRes] = await Promise.all([
    serverRolesService.getById(roleId),
    serverPermissionsService.getAll(),
  ]);

  if (!roleRes?.success || !roleRes.data) {
    return notFound();
  }

  const role = roleRes.data;
  const permissions = permissionsRes?.success ? permissionsRes.data || [] : [];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Editar Rol: {role.name}</h1>
        <p className="text-muted-foreground">
          Modifica los detalles del rol y actualiza sus permisos.
        </p>
      </header>

      <main className="bg-card p-6 rounded-xl border shadow-sm">
        <RoleForm initialData={role} permissions={permissions} />
      </main>
    </div>
  );
}
