'use client';

import { IconLogout } from '@tabler/icons-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

export function DropdownMenuLogout() {
  const { logout } = useAuth();
  return (
    <DropdownMenuItem onClick={() => logout()}>
      <IconLogout />
      Log out
    </DropdownMenuItem>
  );
}
