/**
 * @swagger
 * components:
 *   schemas:
 *     PermissionDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         resource:
 *           type: string
 *           example: users
 *         action:
 *           type: string
 *           example: create
 *         description:
 *           type: string
 *           nullable: true
 *           example: Can create new users
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class PermissionDto {
  id!: number;
  resource!: string;
  action!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PermissionFilterDto {
  search?: string;
  resource?: string;
  action?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}
