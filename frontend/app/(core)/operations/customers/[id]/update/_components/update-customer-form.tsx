import { CustomerForm } from '../../../_components/customer-form';
import { CustomerDto } from '@sgcv2/shared';

interface UpdateCustomerFormProps {
  customer: CustomerDto;
}

export function UpdateCustomerForm({ customer }: UpdateCustomerFormProps) {
  return <CustomerForm customer={customer} />;
}
