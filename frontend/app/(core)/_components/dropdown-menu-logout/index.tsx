'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { IconLogout } from '@tabler/icons-react';

export function DropdownMenuLogout() {
  const { logout } = useAuth();
  return (
    <DropdownMenuItem onClick={() => logout()}>
      <IconLogout />
      Log out
    </DropdownMenuItem>
  );
}
