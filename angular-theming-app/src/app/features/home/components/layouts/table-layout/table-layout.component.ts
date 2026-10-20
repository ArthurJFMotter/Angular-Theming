import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TableConfig } from '../../../../../core/models/table.model';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-table-layout',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DynamicTableComponent,
  ],
  templateUrl: './table-layout.component.html',
  styleUrl: './table-layout.component.scss',
})
export class TableLayoutComponent {
  // Mock Data
  dataSource = [
    {
      id: 1,
      name: 'Arthur J.',
      role: 'Principal Architect',
      status: 'Active',
      statusColor: 'success',
    },
    {
      id: 2,
      name: 'Sarah M.',
      role: 'Designer',
      status: 'Review',
      statusColor: 'warning',
    },
    {
      id: 3,
      name: 'John D.',
      role: 'Developer',
      status: 'Offline',
      statusColor: 'error',
    },
    {
      id: 4,
      name: 'Elena R.',
      role: 'Product Manager',
      status: 'Active',
      statusColor: 'success',
    },
    {
      id: 5,
      name: 'Marcus T.',
      role: 'QA Engineer',
      status: 'Pending',
      statusColor: 'info',
    },
    {
      id: 6,
      name: 'Chloe W.',
      role: 'Frontend Dev',
      status: 'Active',
      statusColor: 'success',
    },
  ];

  // Table Configuration
  tableConfig: TableConfig<any> = {
    enableSorting: true,
    enablePagination: true,
    defaultPageSize: 5,
    columns: [
      { key: 'name', label: 'Name', type: 'text', sortable: true },
      { key: 'role', label: 'Role', type: 'text', sortable: true },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        badgeColorKey: 'statusColor',
        sortable: false,
      },
      {
        key: 'action',
        label: 'Edit',
        type: 'action',
        icon: 'edit',
        sortable: false,
        actionFn: (user) => console.log('Edit clicked for', user.name),
      },
    ],
  };
}
