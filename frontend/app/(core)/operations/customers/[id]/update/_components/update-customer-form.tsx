import { CustomerDto } from '@sgcv2/shared';

import { CustomerForm } from '../../../../../../../feature/customers/components/customer-form';

interface UpdateCustomerFormProps {
  customer: CustomerDto;
}

export function UpdateCustomerForm({ customer }: UpdateCustomerFormProps) {
  return <CustomerForm customer={customer} />;
}
