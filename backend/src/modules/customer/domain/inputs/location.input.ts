export interface CreateLocationInput {
  customerId: string;
  subCustomerId?: string | null;
  name: string;
  address: string;
  city: string;
  zipCode?: string | null;
  isMain?: boolean;
}

export interface UpdateLocationInput {
  name?: string;
  address?: string;
  city?: string;
  zipCode?: string | null;
  isMain?: boolean;
}

export interface LocationFilterInput {
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedLocations {
  items: import('@customer/domain/location.entity').CustomerLocationEntity[];
  total: number;
}
