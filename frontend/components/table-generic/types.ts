export interface HeaderType {
  id: string;
  label: string;
  isOrderable: boolean;
}

export interface TableColumn<T> extends HeaderType {
  cell?: (item: T) => React.ReactNode;
}

export type SortOrder = 'asc' | 'desc';
