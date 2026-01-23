import { ContainerModule } from 'inversify';
import { TYPES } from './types';
import { CustomerController } from '../infrastructure/http/customer.controller';
import { CustomerRoutes } from '../infrastructure/http/customer.routes';
import { CustomerRepository } from '../domain/customer.repository';
import { CustomerPrismaRepository } from '../infrastructure/persist/customer-prisma.repository';
import { CreateCustomerUseCase } from '../application/create-customer.use-case';
import { UpdateCustomerUseCase } from '../application/update-customer.use-case';
import { GetCustomerUseCase } from '../application/get-customer.use-case';
import { ListCustomersUseCase } from '../application/list-customers.use-case';
import { DeleteCustomerUseCase } from '../application/delete-customer.use-case';
import { CustomerService } from '../infrastructure/http/customer.service';
import { CreateCustomerService } from '../domain/create-customer.service';
import { UpdateCustomerService } from '../domain/update-customer.service';
import { GetCustomerService } from '../domain/get-customer.service';
import { ListCustomersService } from '../domain/list-customers.service';
import { DeleteCustomerService } from '../domain/delete-customer.service';

export const customerContainerModule = new ContainerModule(options => {
  options.bind<CustomerRepository>(TYPES.CustomerRepository).to(CustomerPrismaRepository);

  options.bind<CreateCustomerService>(TYPES.CreateCustomerService).to(CustomerService);
  options.bind<UpdateCustomerService>(TYPES.UpdateCustomerService).to(CustomerService);
  options.bind<GetCustomerService>(TYPES.GetCustomerService).to(CustomerService);
  options.bind<ListCustomersService>(TYPES.ListCustomersService).to(CustomerService);
  options.bind<DeleteCustomerService>(TYPES.DeleteCustomerService).to(CustomerService);

  options.bind(TYPES.CreateCustomerUseCase).to(CreateCustomerUseCase);
  options.bind(TYPES.UpdateCustomerUseCase).to(UpdateCustomerUseCase);
  options.bind(TYPES.GetCustomerUseCase).to(GetCustomerUseCase);
  options.bind(TYPES.ListCustomersUseCase).to(ListCustomersUseCase);
  options.bind(TYPES.DeleteCustomerUseCase).to(DeleteCustomerUseCase);

  options.bind(TYPES.CustomerController).to(CustomerController);
  options.bind(TYPES.CustomerRoutes).to(CustomerRoutes);
});
