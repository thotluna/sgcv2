import { CreateLocationInput, UpdateLocationInput } from '@customer/domain/inputs/location.input';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { CustomerLocation } from '@prisma/client';

import {
  CreateCustomerLocationDto,
  CustomerLocationDto,
  UpdateCustomerLocationDto,
} from '@sgcv2/shared';

export class LocationMapper {
  static toEntity(model: CustomerLocation): CustomerLocationEntity {
    return {
      id: model.id,
      customerId: model.customerId,
      subCustomerId: model.subCustomerId,
      name: model.name,
      address: model.address,
      city: model.city,
      zipCode: model.zipCode,
      isMain: model.isMain,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toCreateInput(dto: CreateCustomerLocationDto, customerId: string): CreateLocationInput {
    return {
      customerId,
      subCustomerId: dto.subCustomerId,
      name: dto.name,
      address: dto.address,
      city: dto.city,
      zipCode: dto.zipCode,
      isMain: dto.isMain,
    };
  }

  static toUpdateInput(dto: UpdateCustomerLocationDto): UpdateLocationInput {
    return {
      name: dto.name,
      address: dto.address,
      city: dto.city,
      zipCode: dto.zipCode,
      isMain: dto.isMain,
    };
  }

  static toDto(entity: CustomerLocationEntity): CustomerLocationDto {
    return {
      id: entity.id,
      customerId: entity.customerId,
      subCustomerId: entity.subCustomerId,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      zipCode: entity.zipCode,
      isMain: entity.isMain,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
