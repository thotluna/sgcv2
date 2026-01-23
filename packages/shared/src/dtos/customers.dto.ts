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
export class CreateCustomerDto extends BaseCustomerDto { }

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
export class UpdateCustomerDto extends BaseCustomerDto {
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
