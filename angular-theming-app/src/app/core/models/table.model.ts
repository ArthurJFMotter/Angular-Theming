export type ColumnType = 'text' | 'badge' | 'action';

export interface TableColumn<T = any> {
  key: string;             // The object property to bind to (e.g., 'name', 'status')
  label: string;           // The table header text
  type?: ColumnType;       // Defaults to 'text'
  sortable?: boolean;      // Can this specific column be sorted?
  
  // Specific to 'badge' type
  badgeColorKey?: string;  // A property in the data object that holds the color role (e.g. 'success')
  
  // Specific to 'action' type
  icon?: string;
  actionFn?: (element: T) => void;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}