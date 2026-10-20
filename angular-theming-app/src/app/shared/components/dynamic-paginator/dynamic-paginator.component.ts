import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-dynamic-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './dynamic-paginator.component.html',
  styleUrl: './dynamic-paginator.component.scss',
})
export class DynamicPaginatorComponent implements AfterViewInit {
  @Input() pageSize: number = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    // Expose the underlying paginator instance to parent tables
  }
}
