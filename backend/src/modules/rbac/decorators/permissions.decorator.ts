import { requirePermission } from '../guards/permissions.guard';

/**
 * Decorator-like helper to attach permission guard to a route.
 * Usage (Express):
 *   router.get('/customers', Permission('customers', 'read'), handler);
 */
export const Permission = (resource: string, action: string) => requirePermission(resource, action);
