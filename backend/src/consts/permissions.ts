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
} as const;
