export const PERMISSIONS = {
  CUSTOMERS: {
    CREATE: { resource: 'customers', action: 'create' },
    READ: { resource: 'customers', action: 'read' },
    UPDATE: { resource: 'customers', action: 'update' },
    DELETE: { resource: 'customers', action: 'delete' },
  },
  USERS: {
    CREATE: { resource: 'users', action: 'create' },
    READ: { resource: 'users', action: 'read' },
    UPDATE: { resource: 'users', action: 'update' },
    DELETE: { resource: 'users', action: 'delete' },
  },
  ROLES: {
    CREATE: { resource: 'roles', action: 'create' },
    READ: { resource: 'roles', action: 'read' },
    UPDATE: { resource: 'roles', action: 'update' },
    DELETE: { resource: 'roles', action: 'delete' },
  },
  PERMISSIONS: {
    CREATE: { resource: 'permissions', action: 'create' },
    READ: { resource: 'permissions', action: 'read' },
    UPDATE: { resource: 'permissions', action: 'update' },
    DELETE: { resource: 'permissions', action: 'delete' },
  },
} as const;
