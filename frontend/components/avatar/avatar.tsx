'use client';
import router from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function AvatarUser() {
  const { logout, user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {user && (
        <>
          <button onClick={logout} aria-label="Logout">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col justify-start">
            <p className="text-sm font-medium">{user.username.toUpperCase()}</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </>
      )}
      {!user && (
        <button onClick={() => router.push('/login')} aria-label="Login">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </button>
      )}
    </div>
  );
}
