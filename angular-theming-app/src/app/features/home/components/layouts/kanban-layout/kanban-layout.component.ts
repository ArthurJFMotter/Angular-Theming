import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface KanbanTask {
  id: string;
  text: string;
  badge?: { text: string; colorClass: string };
  avatar?: { initials: string; bgColor: string; textColor: string };
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

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
  // Dynamic State for the Kanban Board
  columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: '1',
          text: 'Update authentication flow tokens',
          badge: { text: 'High Priority', colorClass: 'warning' },
        },
        {
          id: '2',
          text: 'Write API Documentation',
          badge: { text: 'Docs', colorClass: 'info' },
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: '3',
          text: 'Refactor SCSS mixins for M3',
          avatar: {
            initials: 'AM',
            bgColor: 'var(--mat-sys-primary)',
            textColor: 'var(--mat-sys-on-primary)',
          },
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '4',
          text: 'Fix density clipping bug',
          badge: { text: 'Deployed', colorClass: 'success' },
        },
      ],
    },
  ];

  // Drag-and-drop array manipulation
  drop(event: CdkDragDrop<KanbanTask[]>) {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      // Moving to a new column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
