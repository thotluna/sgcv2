import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { TYPES } from './types';
import { CustomerServiceImp } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRoutes } from './customer.routes';
import { CustomerService } from './customer.service';

export const customerContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<CustomerService>(TYPES.CustomerService).to(CustomerServiceImp);
  option.bind(TYPES.CustomerController).to(CustomerController);
  option.bind(TYPES.CustomerRoutes).to(CustomerRoutes);
});
