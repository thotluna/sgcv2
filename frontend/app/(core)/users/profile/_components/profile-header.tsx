import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserWithRolesDto } from '@sgcv2/shared';

interface ProfileHeaderProps {
  user: UserWithRolesDto;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials =
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() ||
    user.username[0].toUpperCase();

  return (
    <div className="flex items-center gap-4 py-6">
      <Avatar className="h-20 w-20 border">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-muted-foreground">@{user.username}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.roles?.map(role => (
            <span
              key={role.id}
              className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {role.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
