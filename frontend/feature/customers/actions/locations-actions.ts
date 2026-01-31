'use server';

import { redirect } from 'next/navigation';

export async function handleLocationFilters(formData: FormData) {
  const search = formData.get('search') as string;

  const params = new URLSearchParams();

  if (search && search.trim() !== '') {
    params.set('search', search.trim());
  }

  const queryString = params.toString();
  redirect(`/operations/customers/locations${queryString ? `?${queryString}` : ''}`);
}
