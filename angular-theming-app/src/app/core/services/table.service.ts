import { Injectable } from '@angular/core';
import { TableConfig } from '../models/table.model';

@Injectable({ providedIn: 'root' })
export class TableService {
  /** Provides a standardized fallback configuration if the user omits properties */
  getDefaultConfig<T>(
    config: Partial<TableConfig<T>> & { columns: TableConfig<T>['columns'] },
  ): TableConfig<T> {
    return {
      columns: config.columns,
      enableSorting: config.enableSorting ?? true,
      enablePagination: config.enablePagination ?? true,
      pageSizeOptions: config.pageSizeOptions ?? [5, 10, 25, 50],
      defaultPageSize: config.defaultPageSize ?? 5,
    };
  }

  /** Gets the keys array needed for MatTable's displayedColumns directive */
  getDisplayedColumns(columns: TableConfig['columns']): string[] {
    return columns.map((c) => c.key);
  }
}
