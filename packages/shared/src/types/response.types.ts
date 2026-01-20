export interface ErrorData {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface Metadata {
  timestamp: string;
  requestId?: string;
  pagination?: Pagination;
}

export interface AppResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorData;
  metadata?: Metadata;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}
