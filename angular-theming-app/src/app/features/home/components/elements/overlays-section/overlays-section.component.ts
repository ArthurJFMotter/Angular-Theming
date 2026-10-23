import { Component, computed, inject, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalService } from '../../../../../core/services/modal.service';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-overlays-section',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTimepickerModule,
    MatTooltipModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './overlays-section.component.html',
  styleUrl: './overlays-section.component.scss',
})
export class OverlaysSectionComponent {
  private readonly modal = inject(ModalService);

  readonly coreOptions: Option[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'material', label: 'Angular Material' },
    { value: 'cdk', label: 'Angular CDK' },
  ];
  readonly toolingOptions: Option[] = [
    { value: 'sass', label: 'Sass' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rxjs', label: 'RxJS (disabled)', disabled: true },
  ];
  readonly multipleDefault = ['angular', 'sass'];

  // Autocomplete: a plain signal is enough, no forms module needed.
  private readonly allLabels = [
    ...this.coreOptions,
    ...this.toolingOptions,
  ].map((o) => o.label);
  readonly query = signal('');
  readonly suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.allLabels.filter((label) => label.toLowerCase().includes(q));
  });

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  // ---- Dialogs (through the app's ModalService) ----
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

  /** Controls inside a dialog: the select panel opens a SECOND overlay on top of the dialog. */
  openWithControls(): void {
    this.modal.open({
      title: 'Display settings',
      icon: 'tune',
      message:
        'Open the select: its panel is a second overlay stacked above this dialog.',
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

  // ---- Bottom sheet ----
  openSheet(): void {
    this.modal.initModalBottomSheet();
  }
}
