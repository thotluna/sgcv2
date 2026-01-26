import { CustomerState } from '../types/customers.type';

/**
 * @swagger
 * components:
 *   schemas:
 *     BaseCustomerDto:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "CUST-001"
 *         legalName:
 *           type: string
 *           example: "Acme Corporation SAS"
 *         taxId:
 *           type: string
 *           example: "900.123.456-7"
 *         address:
 *           type: string
 *           example: "123 Main St, Springfield"
 *         businessName:
 *           type: string
 *           example: "Acme Corp"
 *         phone:
 *           type: string
 *           example: "+573001234567"
 */
class BaseCustomerDto {
  code!: string;
  legalName!: string;
  taxId!: string;
  address!: string;
  businessName?: string;
  phone?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCustomerDto:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseCustomerDto'
 *         - type: object
 *           required:
 *             - code
 *             - legalName
 *             - taxId
 *             - address
 */
export class CreateCustomerDto extends BaseCustomerDto {}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCustomerDto:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseCustomerDto'
 *         - type: object
 *           properties:
 *             state:
 *               type: string
 *               enum: [ACTIVE, INACTIVE, BLOCKED]
 */
export class UpdateCustomerDto {
  code?: string;
  legalName?: string;
  taxId?: string;
  address?: string;
  businessName?: string;
  phone?: string;
  state?: CustomerState;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerDto:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseCustomerDto'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             state:
 *               type: string
 *               enum: [ACTIVE, INACTIVE, BLOCKED]
 *               example: "ACTIVE"
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */
export class CustomerDto extends BaseCustomerDto {
  id!: string;
  state!: CustomerState;
  createdAt!: Date;
  updatedAt!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCustomerDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           format: uuid
 *         businessName:
 *           type: string
 *           example: "Branch Office"
 *         externalCode:
 *           type: string
 *           example: "EXT-001"
 *         state:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class SubCustomerDto {
  id!: string;
  customerId!: string;
  customerName?: string;
  businessName!: string;
  externalCode!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSubCustomerDto:
 *       type: object
 *       required:
 *         - businessName
 *         - externalCode
 *       properties:
 *         businessName:
 *           type: string
 *         externalCode:
 *           type: string
 */
export class CreateSubCustomerDto {
  businessName!: string;
  externalCode!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSubCustomerDto:
 *       type: object
 *       properties:
 *         businessName:
 *           type: string
 *         externalCode:
 *           type: string
 *         state:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 */
export class UpdateSubCustomerDto {
  businessName?: string;
  externalCode?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerLocationDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           format: uuid
 *         subCustomerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         name:
 *           type: string
 *           example: "Main Node"
 *         address:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class CustomerLocationDto {
  id!: string;
  customerId!: string;
  subCustomerId?: string | null;
  name!: string;
  address!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCustomerLocationDto:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         subCustomerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         name:
 *           type: string
 *         address:
 *           type: string
 */
export class CreateCustomerLocationDto {
  subCustomerId?: string | null;
  name!: string;
  address!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCustomerLocationDto:
 *       type: object
 *       properties:
 *         subCustomerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         name:
 *           type: string
 *         address:
 *           type: string
 */
export class UpdateCustomerLocationDto {
  subCustomerId?: string | null;
  name?: string;
  address?: string;
}
