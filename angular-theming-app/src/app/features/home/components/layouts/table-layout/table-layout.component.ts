import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-table-layout',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
  ],
  templateUrl: './table-layout.component.html',
  styleUrl: './table-layout.component.scss',
})
export class TableLayoutComponent {
  displayedColumns: string[] = ['name', 'role', 'status'];
  dataSource = [
    {
      name: 'Arthur J.',
      role: 'Principal Architect',
      status: 'Active',
      statusColor: 'success',
    },
    {
      name: 'Sarah M.',
      role: 'Designer',
      status: 'Review',
      statusColor: 'warning',
    },
    {
      name: 'John D.',
      role: 'Developer',
      status: 'Offline',
      statusColor: 'error',
    },
  ];
}
