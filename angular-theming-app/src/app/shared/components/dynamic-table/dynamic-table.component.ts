import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TableConfig } from '../../../core/models/table.model';
import { TableService } from '../../../core/services/table.service';
import { DynamicPaginatorComponent } from '../dynamic-paginator/dynamic-paginator.component';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule, DynamicPaginatorComponent],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent<T> implements OnInit, OnChanges, AfterViewInit {
  private tableService = inject(TableService);

  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) config!: Partial<TableConfig<T>> & { columns: TableConfig<T>['columns'] };

  resolvedConfig!: TableConfig<T>;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(DynamicPaginatorComponent) dynamicPaginator!: DynamicPaginatorComponent;

  ngOnInit() {
    this.resolvedConfig = this.tableService.getDefaultConfig(this.config);
    this.displayedColumns = this.tableService.getDisplayedColumns(this.resolvedConfig.columns);
    this.dataSource.data = this.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    if (this.resolvedConfig.enableSorting) {
      this.dataSource.sort = this.sort;
    }
    if (this.resolvedConfig.enablePagination && this.dynamicPaginator) {
      this.dataSource.paginator = this.dynamicPaginator.paginator;
    }
  }
}