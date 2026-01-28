'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function handlePermissionFilters(
  router: ReturnType<typeof useRouter>,
  searchParams: ReturnType<typeof useSearchParams>,
  search?: string
) {
  const params = new URLSearchParams(searchParams.toString());

  if (search !== undefined) {
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    // Si cambia el filtro, reiniciamos el offset
    params.delete('offset');
  }

  const query = params.toString();
  router.push(query ? `/permissions?${query}` : '/permissions');
}
