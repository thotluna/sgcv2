// src/modules/rbac/decorators/roles.decorator.ts
import { requireRoles } from '../guards/roles.guard';

/**
 * Decorator-like helper to attach role guard to a route.
 * Usage (Express):
 *   router.get('/admin', Roles('admin', 'gerente'), handler);
 */
export const Roles = (...allowedRoles: string[]) => requireRoles(...allowedRoles);
