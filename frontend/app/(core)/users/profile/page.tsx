import { getMe } from '@feature/users/service';
import {
  ProfileHeader,
  ProfileInfo,
  EmailForm,
  PasswordForm,
  AvatarForm,
} from '@feature/users/components';
import { Separator } from '@/components';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const response = await getMe();

  if (!response.success || !response.data) {
    redirect('/login?expired=true');
  }

  const user = response.data;

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

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-6">
          <ProfileInfo user={user} />
        </aside>

        <div className="flex-1 w-full max-w-2xl space-y-8">
          <AvatarForm initialAvatar={user.avatar ?? undefined} />
          <EmailForm initialEmail={user.email} />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
