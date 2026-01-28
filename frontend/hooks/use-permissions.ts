'use client';

import { useAuthStore } from '@/stores/auth.store';

/**
 * Hook to check user permissions in client components.
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuthStore();
  const userPermissions = user?.permissions || [];

  /**
   * Check if user has at least one of the required permissions.
   * If no permissions are required, returns true.
   */
  const hasPermission = (required?: string[]) => {
    if (!isAuthenticated) return false;
    if (!required || required.length === 0) return true;
    return required.some(perm => userPermissions.includes(perm));
  };

  /**
   * Check if user has ALL the required permissions.
   */
  const hasAllPermissions = (required: string[]) => {
    if (!isAuthenticated) return false;
    return required.every(perm => userPermissions.includes(perm));
  };

  /**
   * Check if user has at least one of the specified roles.
   */
  const hasRole = (roleNames: string[]) => {
    if (!isAuthenticated) return false;
    const userRoles = user?.roles || [];
    return roleNames.some(role => userRoles.includes(role));
  };

  return {
    permissions: userPermissions,
    hasPermission,
    hasAllPermissions,
    hasRole,
    isAuthenticated,
  };
}
