'use server';

import { redirect } from 'next/navigation';

export async function handleRoleFilters(formData: FormData) {
  const search = formData.get('search');

  const params = new URLSearchParams();
  if (search) params.set('search', search.toString());

  const queryString = params.toString();
  redirect(`/roles${queryString ? `?${queryString}` : ''}`);
}
