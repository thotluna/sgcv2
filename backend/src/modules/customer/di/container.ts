import { ContainerModule } from 'inversify';
import { TYPES } from '@customer/di/types';
import { CustomerController } from '@customer/infrastructure/http/customer.controller';
import { CustomerRoutes } from '@customer/infrastructure/http/customer.routes';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { CustomerPrismaRepository } from '@customer/infrastructure/persist/customer-prisma.repository';
import { CreateCustomerUseCase } from '@customer/application/create-customer.use-case';
import { UpdateCustomerUseCase } from '@customer/application/update-customer.use-case';
import { GetCustomerUseCase } from '@customer/application/get-customer.use-case';
import { ListCustomersUseCase } from '@customer/application/list-customers.use-case';
import { DeleteCustomerUseCase } from '@customer/application/delete-customer.use-case';
import { CustomerService } from '@customer/infrastructure/http/customer.service';
import { CreateCustomerService } from '@customer/domain/create-customer.service';
import { UpdateCustomerService } from '@customer/domain/update-customer.service';
import { GetCustomerService } from '@customer/domain/get-customer.service';
import { ListCustomersService } from '@customer/domain/list-customers.service';
import { DeleteCustomerService } from '@customer/domain/delete-customer.service';

// SubCustomer
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { SubCustomerPrismaRepository } from '@customer/infrastructure/persist/subcustomer-prisma.repository';
import { CreateSubCustomerService } from '@customer/domain/create-subcustomer.service';
import { UpdateSubCustomerService } from '@customer/domain/update-subcustomer.service';
import { GetSubCustomerService } from '@customer/domain/get-subcustomer.service';
import { ListSubCustomersService } from '@customer/domain/list-subcustomers.service';
import { DeleteSubCustomerService } from '@customer/domain/delete-subcustomer.service';
import { SubCustomerService } from '@customer/infrastructure/http/subcustomer.service';
import { CreateSubCustomerUseCase } from '@customer/application/create-subcustomer.use-case';
import { UpdateSubCustomerUseCase } from '@customer/application/update-subcustomer.use-case';
import { GetSubCustomerUseCase } from '@customer/application/get-subcustomer.use-case';
import { ListSubCustomersUseCase } from '@customer/application/list-subcustomers.use-case';
import { DeleteSubCustomerUseCase } from '@customer/application/delete-subcustomer.use-case';
import { SubCustomerController } from '@customer/infrastructure/http/subcustomer.controller';
import { SubCustomerRoutes } from '@customer/infrastructure/http/subcustomer.routes';

export const customerContainerModule = new ContainerModule(options => {
  // Customer
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

  // SubCustomer
  options.bind<SubCustomerRepository>(TYPES.SubCustomerRepository).to(SubCustomerPrismaRepository);
  options.bind<CreateSubCustomerService>(TYPES.CreateSubCustomerService).to(SubCustomerService);
  options.bind<UpdateSubCustomerService>(TYPES.UpdateSubCustomerService).to(SubCustomerService);
  options.bind<GetSubCustomerService>(TYPES.GetSubCustomerService).to(SubCustomerService);
  options.bind<ListSubCustomersService>(TYPES.ListSubCustomersService).to(SubCustomerService);
  options.bind<DeleteSubCustomerService>(TYPES.DeleteSubCustomerService).to(SubCustomerService);

  options.bind(TYPES.CreateSubCustomerUseCase).to(CreateSubCustomerUseCase);
  options.bind(TYPES.UpdateSubCustomerUseCase).to(UpdateSubCustomerUseCase);
  options.bind(TYPES.GetSubCustomerUseCase).to(GetSubCustomerUseCase);
  options.bind(TYPES.ListSubCustomersUseCase).to(ListSubCustomersUseCase);
  options.bind(TYPES.DeleteSubCustomerUseCase).to(DeleteSubCustomerUseCase);

  options.bind(TYPES.SubCustomerController).to(SubCustomerController);
  options.bind(TYPES.SubCustomerRoutes).to(SubCustomerRoutes);
});
