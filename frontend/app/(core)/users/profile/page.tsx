import { redirect } from 'next/navigation';

import axios from 'axios';

import { Separator } from '@/components/ui/separator';
import { serverUsersService } from '@/lib/api/server-users.service';

import { AvatarForm } from './_components/avatar-form';
import { EmailForm } from './_components/email-form';
import { PasswordForm } from './_components/password-form';
import { ProfileHeader } from './_components/profile-header';
import { ProfileInfo } from './_components/profile-info';

export default async function ProfilePage() {
  let user;
  try {
    const response = await serverUsersService.getMe();
    user = response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirect('/login?expired=true');
    }
    throw error;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configuración del Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona los detalles de tu cuenta y visualiza tu información de acceso.
        </p>
      </div>
      <Separator className="my-6" />

      <ProfileHeader user={user} />

      {/* Layout principal con flex para evitar que el formulario se estire demasiado y forzar el lado a lado */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Columna de Información (Punto 1): Ancho fijo controlado */}
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-6">
          <ProfileInfo user={user} />
        </aside>

        {/* Columna de Formularios (Punto 2): Toma el resto pero con un ancho máximo pequeño */}
        <div className="flex-1 w-full max-w-2xl space-y-8">
          <AvatarForm initialAvatar={user.avatar ?? undefined} />
          <EmailForm initialEmail={user.email} />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
