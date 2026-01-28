export interface PermissionEntity {
  id: number;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
