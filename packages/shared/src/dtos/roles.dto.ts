import { PermissionDto } from './permissions.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: admin
 *         description:
 *           type: string
 *           nullable: true
 *           example: System Administrator
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class RoleDto {
  id!: number;
  name!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: manager
 *         description:
 *           type: string
 *           example: Department manager with limited admin rights
 *         permissionIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 5]
 */
export class CreateRoleDto {
  name!: string;
  description?: string;
  permissionIds?: number[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissionIds:
 *           type: array
 *           items:
 *             type: integer
 */
export class UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleWithPermissionsDto:
 *       allOf:
 *         - $ref: '#/components/schemas/RoleDto'
 *         - type: object
 *           properties:
 *             permissions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionDto'
 */
export class RoleWithPermissionsDto extends RoleDto {
  permissions!: PermissionDto[];
}

export class RoleFilterDto {
  search?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export class ManageRolePermissionsDto {
  permissionIds!: number[];
}
