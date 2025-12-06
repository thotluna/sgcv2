'use client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function AvatarUser() {
  const router = useRouter();
  const { logout, user } = useAuth();

  // Don't render anything if user data is not available
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={logout} aria-label="Logout">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{user.username?.slice(0, 2).toUpperCase() || 'US'}</AvatarFallback>
        </Avatar>
      </button>
      <div className="flex flex-col justify-start">
        <p className="text-sm font-medium">{user.username?.toUpperCase() || 'Usuario'}</p>
        <p className="text-sm font-medium">{user.email || ''}</p>
      </div>
    </div>
  );
}
