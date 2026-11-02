import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { KanbanStateService } from './services/kanban-state.service';

@Component({
  selector: 'app-kanban-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './kanban-layout.component.html',
  styleUrl: './kanban-layout.component.scss',
})
export class KanbanLayoutComponent {
  readonly kanbanState = inject(KanbanStateService);
}