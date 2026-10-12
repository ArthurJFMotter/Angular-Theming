import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-kanban-layout',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './kanban-layout.component.html',
  styleUrl: './kanban-layout.component.scss',
})
export class KanbanLayoutComponent {}
