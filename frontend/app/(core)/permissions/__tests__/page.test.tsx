import { render, screen } from '@testing-library/react';
import PermissionsPage from '../page';
import { serverRolesService } from '@/lib/api/server-roles.service';
import '@testing-library/jest-dom';

jest.mock('@/lib/api/server-roles.service');

describe('PermissionsPage', () => {
  const mockPermissions = [{ id: 1, resource: 'users', action: 'read', description: 'Read users' }];

  it('should fetch and display permissions', async () => {
    (serverRolesService.getAllPermissions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPermissions,
    });

    // Since PermissionsPage is an async component, we render its result
    const Page = await PermissionsPage();
    render(Page);

    expect(screen.getByText('Permisos del Sistema')).toBeInTheDocument();
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('read')).toBeInTheDocument();
  });

  it('should handle error when fetching permissions', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (serverRolesService.getAllPermissions as jest.Mock).mockRejectedValue(
      new Error('Fetch failed')
    );

    const Page = await PermissionsPage();
    render(Page);

    expect(screen.getByText('No se encontraron permisos.')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
