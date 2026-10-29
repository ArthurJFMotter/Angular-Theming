import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalService } from '../../../../../core/services/modal.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PreferencesService } from 'ng-material-preferences';
import { PreferenceSelectComponent } from '../../../../../shared/components/preference-select/preference-select.component';
import { NotificationType } from '../../../../../core/models/notification.model';
import { BottomSheetService } from '../../../../../core/services/bottom-sheet.service';

@Component({
  selector: 'app-overlays-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    PreferenceSelectComponent,
  ],
  templateUrl: './overlays-section.component.html',
  styleUrl: './overlays-section.component.scss',
})
export class OverlaysSectionComponent {
  private readonly modal = inject(ModalService);
  private readonly bottomSheet = inject(BottomSheetService);
  private readonly notify = inject(NotificationService);
  private readonly prefs = inject(PreferencesService);

  readonly lastSheetResult = signal<string | null>(null);

  readonly selectedView = signal('dialogs');
  readonly selectedColor = signal('primary');

  readonly viewOptions = [
    { label: 'Dialogs', value: 'dialogs' },
    { label: 'Snackbars', value: 'snackbars' },
    { label: 'Menus & Tooltips', value: 'menus' },
    { label: 'Bottom Sheet', value: 'sheet' },
    { label: 'Loading & Activity', value: 'loading' },
  ];

  readonly customRoles = computed(
    () => this.prefs.activeCustomColors().extended || [],
  );

  readonly semanticRoles = [
    { id: 'success', label: 'Success' },
    { id: 'warning', label: 'Warning' },
    { id: 'info', label: 'Info' },
    { id: 'error', label: 'Error' },
  ] as const;

  readonly colorOptions = computed(() => {
    const base = [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Tertiary', value: 'tertiary' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Info', value: 'info' },
      { label: 'Error', value: 'error' },
    ];
    return [
      ...base,
      ...this.customRoles().map((c) => ({ label: c.label, value: c.id })),
    ];
  });

  readonly activeRole = computed(() => {
    const id = this.selectedColor();
    const isBase = [
      'primary',
      'secondary',
      'tertiary',
      'success',
      'warning',
      'info',
      'error',
    ].includes(id);

    return {
      id,
      isBase,
      btnClass: isBase && id !== 'primary' ? `btn-${id}` : '',
      containerColor: `var(--mat-sys-${id}-container)`,
      onContainerColor: `var(--mat-sys-on-${id}-container)`,
    };
  });

  getOverridedStyle(role: any) {
    if (!role || role.id === 'primary') return null;

    const overrides: Record<string, string> = {
      '--mat-sys-primary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-primary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-primary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-primary-container': `var(--mat-sys-on-${role.id}-container)`,
    };

    // Prevent circular reference on secondary
    if (role.id !== 'secondary') {
      overrides['--mat-sys-secondary'] = `var(--mat-sys-${role.id})`;
      overrides['--mat-sys-on-secondary'] = `var(--mat-sys-on-${role.id})`;
      overrides['--mat-sys-secondary-container'] =
        `var(--mat-sys-${role.id}-container)`;
      overrides['--mat-sys-on-secondary-container'] =
        `var(--mat-sys-on-${role.id}-container)`;
    }

    return overrides;
  }

  // ---- Dialog Triggers ----
  openAlert(): void {
    this.modal.alert(
      'Heads up',
      'A short alert: one action, surface tint and scrim from the theme.',
      'info',
    );
  }

  openConfirm(): void {
    this.modal.confirm(
      'Apply changes?',
      'Confirm / Cancel pair with a primary action.',
      'help',
    );
  }

  openDanger(): void {
    this.modal.confirmDanger(
      'Delete project?',
      'Destructive action: the primary button uses the warn color.',
    );
  }

  openWithControls(): void {
    this.modal.open({
      title: 'Display settings',
      icon: 'tune',
      message: 'Configure system performance and animation preferences.',
      showCloseButton: true,
      selects: [
        {
          id: 'density',
          label: 'Density',
          value: 0,
          options: [
            { label: 'Default', value: 0 },
            { label: 'Comfortable', value: -1 },
            { label: 'Compact', value: -3 },
          ],
        },
      ],
      toggles: [{ id: 'motion', label: 'Animations', checked: true }],
      checklist: [
        { id: 'contrast', label: 'High contrast', checked: false },
        { id: 'locked', label: 'Locked option', checked: true, disabled: true },
      ],
      actions: [
        { label: 'Cancel', value: false },
        {
          label: 'Apply',
          value: true,
          isPrimary: true,
          color: 'primary',
          returnsPayload: true,
        },
      ],
    });
  }

  // ---- Bottom Sheet ----

  // 1. Action List: Classic contextual menu sheet
  openActionSheet(): void {
    this.bottomSheet
      .actionSheet(
        'Document Actions',
        [
          {
            label: 'Share Link',
            icon: 'share',
            value: 'share',
            sublabel: 'Anyone with link can view',
          },
          { label: 'Duplicate Item', icon: 'content_copy', value: 'duplicate' },
          {
            label: 'Move to Archive',
            icon: 'drive_file_move',
            value: 'archive',
          },
          {
            label: 'Delete Document',
            icon: 'delete',
            value: 'delete',
            color: 'warn',
          },
        ],
        'Document: project_spec_2026.pdf',
      )
      .subscribe((choice) => {
        if (choice) {
          this.lastSheetResult.set(`Action chosen: "${choice}"`);
          this.notify.show('info', `Selected action: ${choice}`);
        }
      });
  }

  // 2. Confirm: Quick bottom-up confirmation prompt
  openConfirmSheet(): void {
    this.bottomSheet
      .open<boolean>({
        title: 'Discard draft changes?',
        icon: 'help_outline',
        message:
          'You have unsaved changes in this form. If you exit now, your edits will be discarded.',
        showCloseButton: false,
        actions: [
          { label: 'Keep Editing', value: false },
          { label: 'Discard', value: true, isPrimary: true, color: 'primary' },
        ],
      })
      .subscribe((confirmed) => {
        if (confirmed !== undefined) {
          this.lastSheetResult.set(
            confirmed ? 'Discarded changes' : 'Cancelled',
          );
          this.notify.show(
            confirmed ? 'warning' : 'info',
            confirmed ? 'Draft discarded' : 'Cancelled',
          );
        }
      });
  }

  // 3. Danger: Destructive confirmation with warning styling
  openDangerSheet(): void {
    this.bottomSheet
      .open<boolean>({
        title: 'Revoke Production Access?',
        icon: 'warning',
        message:
          'All API keys and active bearer tokens for this environment will be terminated immediately.',
        showCloseButton: false,
        actions: [
          { label: 'Cancel', value: false },
          {
            label: 'Revoke Immediately',
            value: true,
            isPrimary: true,
            color: 'warn',
          },
        ],
      })
      .subscribe((dangerConfirmed) => {
        if (dangerConfirmed !== undefined) {
          this.lastSheetResult.set(
            dangerConfirmed ? 'Revoked credentials' : 'Aborted',
          );
          this.notify.show(
            dangerConfirmed ? 'error' : 'info',
            dangerConfirmed ? 'Access revoked!' : 'Revocation aborted',
          );
        }
      });
  }

  // 4. With Controls: Rich dynamic form sheet with inputs, selects, and toggles
  openWithControlsSheet(): void {
    this.bottomSheet
      .open({
        title: 'Filter & Display Preferences',
        icon: 'tune',
        message:
          'Configure search criteria, result sorting, and real-time syncing parameters.',
        showCloseButton: true,
        inputs: [
          {
            id: 'keyword',
            label: 'Search query',
            value: '',
            placeholder: 'e.g. Quarterly audit',
          },
        ],
        selects: [
          {
            id: 'sortBy',
            label: 'Sort by',
            value: 'date',
            options: [
              { label: 'Last Modified', value: 'date' },
              { label: 'Alphabetical', value: 'alpha' },
              { label: 'Priority', value: 'priority' },
            ],
          },
        ],
        toggles: [
          {
            id: 'offlineCache',
            label: 'Enable offline storage',
            checked: true,
          },
          { id: 'realtime', label: 'Live streaming updates', checked: false },
        ],
        checklist: [
          { id: 'completed', label: 'Include completed', checked: true },
          { id: 'archived', label: 'Include archived items', checked: false },
        ],
        actions: [
          { label: 'Cancel', value: false },
          {
            label: 'Apply Filters',
            value: true,
            isPrimary: true,
            color: 'primary',
            returnsPayload: true,
          },
        ],
      })
      .subscribe((payload: any) => {
        if (payload && payload.action) {
          const query =
            payload.inputs?.find((i: any) => i.id === 'keyword')?.value ||
            'None';
          this.lastSheetResult.set(`Filters applied (query: "${query}")`);
          this.notify.show('success', 'Filter criteria updated successfully');
        }
      });
  }

  // ---- Snackbars ----
  triggerActiveToast(): void {
    const id = this.selectedColor();
    this.notify.show(
      id as NotificationType,
      `Simulated toast rendered with "${id}" role tokens.`,
      { label: 'Dismiss', actionFn: () => {} },
      4000,
      'notifications',
    );
  }

  triggerToast(type: NotificationType): void {
    this.notify.show(type, `This is a simulated ${type} alert.`, {
      label: 'Dismiss',
      actionFn: () => {},
    });
  }

  triggerActionToast(): void {
    this.notify.show(
      'info',
      'Item moved to trash.',
      { label: 'Undo', actionFn: () => console.log('Undone') },
      6000,
      'delete',
    );
  }

  triggerCustomToast(id: string, label: string): void {
    this.notify.show(
      id as any,
      `Custom toast using "${label}" role tokens.`,
      { label: 'Dismiss', actionFn: () => {} },
      4000,
      'star',
    );
  }
}
