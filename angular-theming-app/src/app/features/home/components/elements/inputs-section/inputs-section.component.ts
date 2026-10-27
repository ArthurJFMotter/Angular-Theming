import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PreferencesService } from 'ng-material-preferences';
import { PreferenceSelectComponent } from '../../../../../shared/components/preference-select/preference-select.component';

@Component({
  selector: 'app-inputs-section',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDatepickerModule,
    MatSelectModule,
    PreferenceSelectComponent,
  ],
  templateUrl: './inputs-section.component.html',
  styleUrl: './inputs-section.component.scss',
})
export class InputsSectionComponent {
  private prefs = inject(PreferencesService);
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor() {
    this.emailControl.markAsTouched();
  }

  readonly selectedView = signal('text');
  readonly selectedColor = signal('primary');

  readonly viewOptions = [
    { label: 'Text Inputs', value: 'text' },
    { label: 'Datepicker & Selects', value: 'date' },
    { label: 'Checkboxes', value: 'checkbox' },
    { label: 'Slide Toggles', value: 'toggle' },
    { label: 'Radio Buttons', value: 'radio' },
    { label: 'Sliders', value: 'slider' },
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
        themeClass: id === 'primary' ? '' : `theme-${id}`,
      };
    }
    return { id, isBase: false, themeClass: '' };
  });

  // The ultimate CSS trick to override Angular Material internal scoping for custom hexes
  getOverridedStyle(role: any) {
    if (role.isBase) return null;

    return {
      // Remap Primary (Catches Flat Buttons, FABs, Form Fields, Sliders, Checkboxes)
      '--mat-sys-primary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-primary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-primary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-primary-container': `var(--mat-sys-on-${role.id}-container)`,

      // THE FIX: Remap Secondary (Catches Chips and Button Toggles!)
      '--mat-sys-secondary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-secondary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-secondary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-secondary-container': `var(--mat-sys-on-${role.id}-container)`,
    };
  }
}
