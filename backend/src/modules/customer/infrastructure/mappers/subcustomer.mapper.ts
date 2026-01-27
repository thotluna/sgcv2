import {
  CreateSubCustomerInput,
  UpdateSubCustomerInput,
} from '@customer/domain/inputs/subcustomer.input';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { Customer, SubCustomer } from '@prisma/client';

import { CreateSubCustomerDto, SubCustomerDto, UpdateSubCustomerDto } from '@sgcv2/shared';

export type SubCustomerWithCustomer = SubCustomer & {
  customer?: Customer;
};

export class SubCustomerMapper {
  static toEntity(model: SubCustomerWithCustomer): SubCustomerEntity {
    return {
      id: model.id,
      customerId: model.customerId,
      businessName: model.businessName,
      externalCode: model.externalCode,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      customer: model.customer
        ? {
            legalName: model.customer.legalName,
            businessName: model.customer.businessName,
          }
        : undefined,
    };
  }

  static toCreateInput(dto: CreateSubCustomerDto, customerId: string): CreateSubCustomerInput {
    return {
      customerId,
      businessName: dto.businessName,
      externalCode: dto.externalCode,
    };
  }

  static toUpdateInput(dto: UpdateSubCustomerDto): UpdateSubCustomerInput {
    return {
      businessName: dto.businessName,
      externalCode: dto.externalCode,
    };
  }

  static toDto(entity: SubCustomerEntity): SubCustomerDto {
    return {
      id: entity.id,
      customerId: entity.customerId,
      customerName: entity.customer?.legalName,
      businessName: entity.businessName,
      externalCode: entity.externalCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
