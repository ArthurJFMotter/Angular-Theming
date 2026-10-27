import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PreferencesService } from 'ng-material-preferences';
import { PreferenceSelectComponent } from '../../../../../shared/components/preference-select/preference-select.component';

@Component({
  selector: 'app-actions-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatButtonToggleModule,
    PreferenceSelectComponent,
  ],
  templateUrl: './actions-section.component.html',
  styleUrl: './actions-section.component.scss',
})
export class ActionsSectionComponent {
  private prefs = inject(PreferencesService);

  readonly selectedView = signal('text');
  readonly selectedColor = signal('primary');

  readonly viewOptions = [
    { label: 'Text Buttons', value: 'text' },
    { label: 'Filled Buttons', value: 'filled' },
    { label: 'Stroked Buttons', value: 'stroked' },
    { label: 'Raised Buttons', value: 'raised' },
    { label: 'Button Toggles', value: 'toggle' },
    { label: 'FABs', value: 'fab' },
    { label: 'Chips', value: 'chip' },
  ];

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
    const custom = this.prefs.activeCustomColors().extended || [];
    return [...base, ...custom.map((c) => ({ label: c.label, value: c.id }))];
  });

  readonly activeRole = computed(() => {
    const id = this.selectedColor();
    if (
      [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'info',
        'error',
      ].includes(id)
    ) {
      return {
        id,
        isBase: true,
        btnClass: id === 'primary' ? '' : `btn-${id}`,
      };
    }
    return { id, isBase: false, btnClass: '' };
  });

  getOverridedStyle(role: any) {
    if (role.isBase) return null;

    return {
      // Remap Primary (Catches Flat Buttons, FABs, Form Fields, Sliders, Checkboxes)
      '--mat-sys-primary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-primary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-primary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-primary-container': `var(--mat-sys-on-${role.id}-container)`,

      // Remap Secondary (Catches Chips and Button Toggles)
      '--mat-sys-secondary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-secondary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-secondary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-secondary-container': `var(--mat-sys-on-${role.id}-container)`,
    };
  }
}
