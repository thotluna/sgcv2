import { CustomerLocation } from '@prisma/client';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import {
  CreateCustomerLocationDto,
  UpdateCustomerLocationDto,
  CustomerLocationDto,
} from '@sgcv2/shared';
import { CreateLocationInput, UpdateLocationInput } from '@customer/domain/inputs/location.input';

export class LocationMapper {
  static toEntity(model: CustomerLocation): CustomerLocationEntity {
    return {
      id: model.id,
      customerId: model.customerId,
      subCustomerId: model.subCustomerId,
      name: model.name,
      address: model.address,
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
    };
  }

  static toUpdateInput(dto: UpdateCustomerLocationDto): UpdateLocationInput {
    return {
      name: dto.name,
      address: dto.address,
    };
  }

  static toDto(entity: CustomerLocationEntity): CustomerLocationDto {
    return {
      id: entity.id,
      customerId: entity.customerId,
      subCustomerId: entity.subCustomerId,
      name: entity.name,
      address: entity.address,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
