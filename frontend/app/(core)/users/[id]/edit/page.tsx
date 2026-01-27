import { notFound } from 'next/navigation';

import { serverUsersService } from '@/lib/api/server-users.service';

import { UserForm } from '../../../../../feature/users/components/admin/user-form';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  const response = await serverUsersService.getUserById(userId);

  if (!response.data) {
    notFound();
  }

  const user = response.data;

  const initialData = {
    username: user.username,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    status: user.status,
    password: '',
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administración de Usuarios</h1>
        <p className="text-muted-foreground">Edita la información del usuario {user.username}.</p>
      </div>
      <UserForm userId={userId} initialData={initialData} />
    </div>
  );
}
