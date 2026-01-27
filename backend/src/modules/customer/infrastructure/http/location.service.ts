import { TYPES } from '@customer/di/types';
import { CreateLocationService } from '@customer/domain/create-location.service';
import { CustomerEntity } from '@customer/domain/customer.entity';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { DeleteLocationService } from '@customer/domain/delete-location.service';
import { GetLocationService } from '@customer/domain/get-location.service';
import {
  CreateLocationInput,
  LocationFilterInput,
  PaginatedLocations,
  UpdateLocationInput,
} from '@customer/domain/inputs/location.input';
import { ListLocationsService } from '@customer/domain/list-locations.service';
import { CustomerLocationEntity } from '@customer/domain/location.entity';
import { LocationRepository } from '@customer/domain/location.repository';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { UpdateLocationService } from '@customer/domain/update-location.service';
import { inject, injectable } from 'inversify';

@injectable()
export class LocationService
  implements
    CreateLocationService,
    UpdateLocationService,
    DeleteLocationService,
    GetLocationService,
    ListLocationsService
{
  constructor(
    @inject(TYPES.LocationRepository) private readonly locationRepository: LocationRepository,
    @inject(TYPES.CustomerRepository) private readonly customerRepository: CustomerRepository,
    @inject(TYPES.SubCustomerRepository)
    private readonly subCustomerRepository: SubCustomerRepository
  ) {}

  async create(data: CreateLocationInput): Promise<CustomerLocationEntity> {
    return this.locationRepository.create(data);
  }

  async update(id: string, data: UpdateLocationInput): Promise<CustomerLocationEntity> {
    return this.locationRepository.update(id, data);
  }

  async delete(id: string): Promise<CustomerLocationEntity> {
    return this.locationRepository.delete(id);
  }

  async findById(id: string): Promise<CustomerLocationEntity | null> {
    return this.locationRepository.findById(id);
  }

  async findAll(filters: LocationFilterInput, customerId?: string): Promise<PaginatedLocations> {
    return this.locationRepository.findAll(filters, customerId);
  }

  async findCustomerById(id: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findById(id);
  }

  async findSubCustomerById(id: string): Promise<SubCustomerEntity | null> {
    return this.subCustomerRepository.findById(id);
  }
}
