import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { CreateCustomerInput, UpdateCustomerInput } from '@customer/domain/inputs/customer.input';

import {
  CreateCustomerDto,
  CustomerDto,
  CustomerState as SharedCustomerState,
  UpdateCustomerDto,
} from '@sgcv2/shared';

export class CustomerMapper {
  static toCreateInput(dto: CreateCustomerDto): CreateCustomerInput {
    if (!dto.businessName) {
      throw new Error('businessName is required');
    }
    return {
      code: dto.code,
      businessName: dto.businessName,
      legalName: dto.legalName,
      taxId: dto.taxId,
      address: dto.address,
      ...(dto.phone && { phone: dto.phone }),
    };
  }

  static toUpdateInput(dto: UpdateCustomerDto): UpdateCustomerInput {
    return {
      businessName: dto.businessName,
      legalName: dto.legalName,
      taxId: dto.taxId,
      address: dto.address,
      phone: dto.phone,
      state: dto.state as CustomerState,
    };
  }

  static toDto(entity: CustomerEntity): CustomerDto {
    return {
      id: entity.id,
      code: entity.code,
      businessName: entity.businessName ?? undefined,
      legalName: entity.legalName,
      taxId: entity.taxId,
      address: entity.address ?? '',
      phone: entity.phone ?? undefined,
      state: entity.state as SharedCustomerState,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
