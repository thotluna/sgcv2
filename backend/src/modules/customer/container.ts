import { Container } from 'inversify';
import { TYPES } from './types';
import { CustomerServiceImp } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRoutes } from './customer.routes';

export const customerContainer = new Container();

customerContainer.bind(TYPES.CustomerService).to(CustomerServiceImp);
customerContainer.bind(TYPES.CustomerController).to(CustomerController);
customerContainer.bind(TYPES.CustomerRoutes).to(CustomerRoutes);
