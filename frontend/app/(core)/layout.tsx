import Header from './_components/header/header';
import SidebarApp from './_components/sidebar/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import StoreInitializer from '@/components/auth/store-initializer';
import { serverUsersService } from '@/lib/api/server-users.service';
import { AuthenticatedUserDto } from '@sgcv2/shared';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value || null;

  let user: AuthenticatedUserDto | null = null;

  if (token) {
    try {
      const response = await serverUsersService.getMe();
      const userWithRole = response.data;
      if (userWithRole) {
        user = {
          id: userWithRole.id,
          username: userWithRole.username,
          email: userWithRole.email,
          firstName: userWithRole.firstName || '',
          lastName: userWithRole.lastName || '',
          status: userWithRole.status,
          roles: userWithRole.roles?.map(role => role.name),
        };
      }
    } catch (error) {
      console.error('Failed to fetch user on server:', error);
      // User will be null, which is handled by StoreInitializer
    }
  }

  return (
    <SidebarProvider>
      <StoreInitializer user={user} token={token} />
      <SidebarApp />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
