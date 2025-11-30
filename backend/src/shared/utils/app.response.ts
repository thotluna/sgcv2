export class ErrorData {
  code!: string;
  message!: string;
  details?: Record<string, string>;
}

export class Pagination {
  page!: number;
  perPage!: number;
  total!: number;
  totalPages!: number;
}

export class Metadata {
  timestamp!: string;
  requestId?: string;
  pagination?: Pagination;
}

export class AppResponse<T> {
  success!: boolean;
  data?: T;
  error?: ErrorData;
  metadata?: Metadata;
}
