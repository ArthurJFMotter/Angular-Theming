import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TableConfig } from '../../../../../core/models/table.model';
import { ModalService } from '../../../../../core/services/modal.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

interface UserData {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Review' | 'Offline' | 'Pending';
  statusColor: 'success' | 'warning' | 'error' | 'info';
}

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
  private modals = inject(ModalService);
  private notify = inject(NotificationService);

  // Mock Users Data
  readonly users = signal<UserData[]>([
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
  ]);

  // Active Filter
  readonly activeFilter = signal<
    'All' | 'Active' | 'Pending' | 'Review' | 'Offline'
  >('All');

  // Table Data
  readonly filteredUsers = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') return this.users();
    return this.users().filter((u) => u.status === filter);
  });

  // Table Columns
  readonly tableConfig: TableConfig<UserData> = {
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
        actionFn: (user) => this.editUser(user),
      },
    ],
  };

  // --- CRUD ACTIONS ---
  setFilter(filter: 'All' | 'Active' | 'Pending' | 'Review' | 'Offline') {
    this.activeFilter.set(filter);
  }

  inviteUser() {
    const newUser: UserData = {
      id: Date.now(),
      name: 'New Teammate',
      role: 'Guest',
      status: 'Pending',
      statusColor: 'info',
    };

    // Add to the top of the list
    this.users.update((list) => [newUser, ...list]);
    this.notify.show('success', 'Invitation sent!');
  }

  editUser(user: UserData) {
    this.modals
      .open<any>({
        title: `Edit ${user.name}`,
        icon: 'edit',
        message: 'Update the role or status of this team member.',
        showCloseButton: true,
        selects: [
          {
            id: 'role',
            label: 'Role',
            value: user.role,
            options: [
              { label: 'Principal Architect', value: 'Principal Architect' },
              { label: 'Developer', value: 'Developer' },
              { label: 'Designer', value: 'Designer' },
              { label: 'QA Engineer', value: 'QA Engineer' },
              { label: 'Guest', value: 'Guest' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            value: user.status,
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Review', value: 'Review' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Offline', value: 'Offline' },
            ],
          },
        ],
        actions: [
          { label: 'Delete User', value: 'delete', color: 'warn' },
          {
            label: 'Save Changes',
            returnsPayload: true,
            isPrimary: true,
            color: 'primary',
          },
        ],
      })
      .subscribe((result) => {
        if (result === 'delete') {
          this.users.update((list) => list.filter((u) => u.id !== user.id));
          this.notify.show('error', `${user.name} removed from team.`);
        } else if (result && result.selects) {
          const newRole = result.selects.find(
            (s: any) => s.id === 'role',
          ).value;
          const newStatus = result.selects.find(
            (s: any) => s.id === 'status',
          ).value;

          const colorMap: any = {
            Active: 'success',
            Review: 'warning',
            Pending: 'info',
            Offline: 'error',
          };

          this.users.update((list) =>
            list.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    role: newRole,
                    status: newStatus,
                    statusColor: colorMap[newStatus],
                  }
                : u,
            ),
          );

          this.notify.show('success', `${user.name} updated.`);
        }
      });
  }
}
