'use client';

import { CustomerDto } from '@sgcv2/shared';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '../../../_components/customer-form';
import { updateCustomerAction } from '../../../_components/actions';

export function UpdateCustomerForm({ customer }: { customer: CustomerDto }) {
  const router = useRouter();
  const updateAction = updateCustomerAction.bind(null, customer.id);

  return (
    <CustomerForm
      action={updateAction}
      defaultValues={customer}
      onCancel={() => router.back()}
      isUpdate={true}
    />
  );
}
