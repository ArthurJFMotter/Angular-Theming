import { Injectable, signal } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

export interface KanbanTask {
  id: string;
  text: string;
  badge?: { text: string; colorClass: string };
  avatar?: { initials: string; bgColor: string; textColor: string };
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

const INITIAL_COLUMNS: KanbanColumn[] = [
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

@Injectable({ providedIn: 'root' })
export class KanbanStateService {
  readonly columns = signal<KanbanColumn[]>(
    JSON.parse(JSON.stringify(INITIAL_COLUMNS))
  );

  /**
   * Creates and inserts a task created from the dynamic modal form.
   */
  createTask(params: {
    title: string;
    columnId: string;
    tag?: string;
    responsible?: string;
  }): void {
    const badgeMap: Record<string, { text: string; colorClass: string }> = {
      warning: { text: 'High Priority', colorClass: 'warning' },
      error: { text: 'Critical', colorClass: 'error' },
      success: { text: 'Feature', colorClass: 'success' },
      info: { text: 'Docs', colorClass: 'info' },
    };

    const badge =
      params.tag && params.tag !== 'none' ? badgeMap[params.tag] : undefined;

    let avatar: KanbanTask['avatar'] = undefined;
    if (params.responsible && params.responsible.trim()) {
      avatar = {
        initials: this.extractInitials(params.responsible.trim()),
        bgColor: 'var(--mat-sys-primary-container)',
        textColor: 'var(--mat-sys-on-primary-container)',
      };
    }

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      text: params.title.trim(),
      badge,
      avatar,
    };

    // Prepend the new task to the selected column
    this.columns.update((cols) =>
      cols.map((col) =>
        col.id === params.columnId
          ? { ...col, tasks: [newTask, ...col.tasks] }
          : col
      )
    );
  }

  reset(): void {
    this.columns.set(JSON.parse(JSON.stringify(INITIAL_COLUMNS)));
  }

  drop(event: CdkDragDrop<KanbanTask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.columns.update((cols) => [...cols]);
  }

  private extractInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (!parts.length || !parts[0]) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}