import { IconClock, IconHash, IconMail, IconShield, IconUser } from '@tabler/icons-react';

import { UserWithRolesDto } from '@sgcv2/shared';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';

interface ProfileInfoProps {
  user: UserWithRolesDto;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card className="h-full min-w-[232px] overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Información de la Cuenta</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Detalles estáticos de tu perfil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className="space-y-4">
          {/* Nombre de Usuario */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="bg-primary/10 text-primary rounded-full p-2 shrink-0">
              <IconUser size={18} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                Usuario
              </span>
              <span className="text-sm font-semibold truncate" title={user.username}>
                {user.username}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="bg-primary/10 text-primary rounded-full p-2 shrink-0">
              <IconMail size={18} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                Email
              </span>
              <span className="text-sm font-semibold truncate break-all" title={user.email}>
                {user.email}
              </span>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="bg-primary/10 text-primary rounded-full p-2 shrink-0">
              <IconHash size={18} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                ID Interno
              </span>
              <span className="text-sm font-semibold truncate">#{user.id}</span>
            </div>
          </div>

          {/* Fecha */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="bg-primary/10 text-primary rounded-full p-2 shrink-0">
              <IconClock size={18} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                Registro
              </span>
              <span className="text-sm font-semibold leading-tight">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1 shrink-0">
            <IconShield size={16} className="text-primary shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider truncate">Roles</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map(role => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] sm:text-xs font-medium italic shrink-0 max-w-full truncate"
                >
                  {role.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Sin roles</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
