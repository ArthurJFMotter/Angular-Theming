import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { PreferencesService } from 'ng-material-preferences';
import { PreferenceSelectComponent } from '../../../../../shared/components/preference-select/preference-select.component';

@Component({
  selector: 'app-surfaces-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    PreferenceSelectComponent,
  ],
  templateUrl: './surfaces-section.component.html',
  styleUrl: './surfaces-section.component.scss',
})
export class SurfacesSectionComponent {
  private prefs = inject(PreferencesService);

  readonly selectedView = signal('card');
  readonly selectedColor = signal('primary');
  readonly activeNav = signal<'home' | 'settings' | 'notifications'>('home');

  readonly viewOptions = [
    { label: 'Card', value: 'card' },
    { label: 'Expansion panel', value: 'accordion' },
    { label: 'List', value: 'list' },
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
      containerClass: `${id}-container`,
      containerColor: `var(--mat-sys-${id}-container)`,
      onContainerColor: `var(--mat-sys-on-${id}-container)`,
    };
  });

  getOverridedStyle(role: any) {
    // If primary (default), no need to override anything
    if (!role || role.id === 'primary') return null;

    const overrides: Record<string, string> = {
      // Direct M3 List Active Indicator Tokens (always safe, property name is distinct)
      '--mat-list-active-indicator-color': `var(--mat-sys-${role.id}-container)`,
      '--mat-list-active-indicator-label-text-color': `var(--mat-sys-on-${role.id}-container)`,
      '--mat-list-active-indicator-leading-icon-color': `var(--mat-sys-on-${role.id}-container)`,

      // Remap Primary to the chosen role
      '--mat-sys-primary': `var(--mat-sys-${role.id})`,
      '--mat-sys-on-primary': `var(--mat-sys-on-${role.id})`,
      '--mat-sys-primary-container': `var(--mat-sys-${role.id}-container)`,
      '--mat-sys-on-primary-container': `var(--mat-sys-on-${role.id}-container)`,
    };

    // ONLY remap Secondary if the selected role is NOT already 'secondary'
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
}
