import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../../../../../core/services/modal.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { KanbanStateService } from '../services/kanban-state.service';

@Component({
  selector: 'app-kanban-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="kanban-header-actions">
      <button mat-button (click)="resetBoard()">
        <mat-icon>restart_alt</mat-icon>
        Reset
      </button>
      <button mat-flat-button (click)="openCreateTaskModal()">
        <mat-icon>add</mat-icon>
        Add Task
      </button>
    </div>
  `,
  styles: [
    `
      .kanban-header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    `,
  ],
})
export class KanbanActionsComponent {
  readonly state = inject(KanbanStateService);
  private readonly modal = inject(ModalService);
  private readonly notify = inject(NotificationService, { optional: true });

  openCreateTaskModal(): void {
    this.modal
      .open(
        {
          title: 'Create Kanban Task',
          icon: 'playlist_add',
          message:
            'Enter task details and assign it to a team member and workflow column.',
          showCloseButton: true,
          inputs: [
            {
              id: 'title',
              label: 'Title',
              value: '',
              placeholder: 'e.g. Implement token caching layer',
              isRequired: true,
            },
            {
              id: 'responsible',
              label: 'Who is Responsible (Assigned)',
              value: '',
              placeholder: 'e.g. Arthur Morgan or Sarah Jenkins',
            },
          ],
          selects: [
            {
              id: 'status',
              label: 'Which Column (Status)',
              value: 'todo',
              isRequired: true,
              options: [
                { label: 'To Do', value: 'todo' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Done', value: 'done' },
              ],
            },
            {
              id: 'tag',
              label: 'Tag / Priority',
              value: 'warning',
              options: [
                { label: 'High Priority', value: 'warning' },
                { label: 'Critical', value: 'error' },
                { label: 'Feature', value: 'success' },
                { label: 'Documentation', value: 'info' },
                { label: 'None', value: 'none' },
              ],
            },
          ],
          actions: [
            { label: 'Cancel', value: false },
            {
              label: 'Create Task',
              value: true,
              isPrimary: true,
              color: 'primary',
              returnsPayload: true,
            },
          ],
        },
        { width: '480px' }
      )
      .subscribe((payload: any) => {
        if (payload?.action) {
          const title =
            payload.inputs?.find((i: any) => i.id === 'title')?.value || '';
          const responsible =
            payload.inputs?.find((i: any) => i.id === 'responsible')?.value || '';
          const columnId =
            payload.selects?.find((s: any) => s.id === 'status')?.value || 'todo';
          const tag =
            payload.selects?.find((s: any) => s.id === 'tag')?.value || 'none';

          this.state.createTask({
            title,
            columnId,
            tag,
            responsible,
          });

          this.notify?.show('success', `Task added to "${columnId.toUpperCase()}"!`);
        }
      });
  }

  resetBoard(){
    this.state.reset()
    this.notify?.show('info', `Kanban board reseted to default view`);
  }
}