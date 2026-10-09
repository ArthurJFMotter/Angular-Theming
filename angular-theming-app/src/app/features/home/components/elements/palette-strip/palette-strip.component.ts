import { Component, computed, inject } from '@angular/core';
import { PreferencesService } from 'ng-material-preferences';

@Component({
  selector: 'app-palette-strip',
  standalone: true,
  templateUrl: './palette-strip.component.html',
  styleUrl: './palette-strip.component.scss',
})
export class PaletteStripComponent {
  readonly prefs = inject(PreferencesService);

  readonly coreSwatches = [
    { id: 'primary', label: 'Primary' },
    { id: 'secondary', label: 'Secondary' },
    { id: 'tertiary', label: 'Tertiary' },
  ];

  readonly semanticSwatches = [
    { id: 'error', label: 'Error' },
    { id: 'success', label: 'Success' },
    { id: 'warning', label: 'Warning' },
    { id: 'info', label: 'Info' },
  ];

  readonly customSwatches = computed(() => {
    const extended = this.prefs.activeCustomColors().extended || [];
    return extended.map((ext) => ({ id: ext.id, label: ext.label }));
  });
}
