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

  // Reusable Color Map
  private readonly statusColorMap: Record<string, UserData['statusColor']> = {
    Active: 'success',
    Review: 'warning',
    Pending: 'info',
    Offline: 'error',
  };

  // --- CRUD ACTIONS ---
  setFilter(filter: 'All' | 'Active' | 'Pending' | 'Review' | 'Offline') {
    this.activeFilter.set(filter);
  }

  inviteUser() {
    this.modals
      .open<any>({
        title: 'Invite Team Member',
        icon: 'person_add',
        message: 'Enter the details for the new team member.',
        showCloseButton: true,
        inputs: [
          {
            id: 'name',
            label: 'Full Name',
            value: '',
            placeholder: 'Enter full name...',
            isRequired: true,
          },
        ],
        selects: [
          {
            id: 'role',
            label: 'Role',
            value: 'Guest',
            isRequired: true,
            options: [
              { label: 'Principal Architect', value: 'Principal Architect' },
              { label: 'Developer', value: 'Developer' },
              { label: 'Designer', value: 'Designer' },
              { label: 'QA Engineer', value: 'QA Engineer' },
              { label: 'Product Manager', value: 'Product Manager' },
              { label: 'Frontend Dev', value: 'Frontend Dev' },
              { label: 'Guest', value: 'Guest' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            value: 'Pending',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Review', value: 'Review' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Offline', value: 'Offline' },
            ],
          },
        ],
        actions: [
          {
            label: 'Send Invitation',
            value: 'save',
            returnsPayload: true,
            isPrimary: true,
            color: 'primary',
          },
        ],
      })
      .subscribe((result) => {
        if (result && result.action === 'save') {
          const newName = result.inputs
            ?.find((i: any) => i.id === 'name')
            ?.value?.trim();
          if (!newName) return;

          const newRole =
            result.selects?.find((s: any) => s.id === 'role')?.value || 'Guest';
          const newStatus =
            result.selects?.find((s: any) => s.id === 'status')?.value ||
            'Pending';

          const newUser: UserData = {
            id: Date.now(),
            name: newName,
            role: newRole,
            status: newStatus,
            statusColor: this.statusColorMap[newStatus],
          };

          this.users.update((list) => [newUser, ...list]);
          this.notify.show('success', `Invitation sent to ${newName}!`);
        }
      });
  }

  editUser(user: UserData) {
    this.modals
      .open<any>({
        title: `Edit Team Member`,
        icon: 'edit',
        message: 'Update the name, role, or status of this team member.',
        showCloseButton: true,
        inputs: [
          {
            id: 'name',
            label: 'Full Name',
            value: user.name,
            placeholder: 'Enter full name...',
            isRequired: true,
          },
        ],
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
              { label: 'Product Manager', value: 'Product Manager' },
              { label: 'Frontend Dev', value: 'Frontend Dev' },
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
            value: 'save',
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
          return;
        }

        if (result && result.action === 'save') {
          const newName =
            result.inputs?.find((i: any) => i.id === 'name')?.value?.trim() ||
            user.name;
          const newRole =
            result.selects?.find((s: any) => s.id === 'role')?.value ||
            user.role;
          const newStatus =
            result.selects?.find((s: any) => s.id === 'status')?.value ||
            user.status;

          this.users.update((list) =>
            list.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    name: newName,
                    role: newRole,
                    status: newStatus,
                    statusColor: this.statusColorMap[newStatus],
                  }
                : u,
            ),
          );

          this.notify.show('success', `${newName} updated.`);
        }
      });
  }
}
