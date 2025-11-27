'use client';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function Nav() {
  const { logout, user } = useAuth();

  return (
    <>
      {user && (
        <button onClick={logout} aria-label="Logout">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      )}
    </>
  );
}
