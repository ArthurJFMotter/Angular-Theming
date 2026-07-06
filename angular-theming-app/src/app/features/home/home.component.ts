import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { PreferencesSideDrawerComponent } from '../../shared/components/preferences-side-drawer/preferences-side-drawer.component';
import { NotificationService } from '../../core/services/notification.service';
import { ModalService } from '../../core/services/modal.service';

import { MatSidenavModule } from '@angular/material/sidenav';
import { PreferencesService } from '../../core/services/preferences.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    MatBadgeModule,
    MatSelectModule,
    MatSidenavModule,
    PreferencesSideDrawerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly notify = inject(NotificationService);
  readonly modals = inject(ModalService);
  readonly prefs = inject(PreferencesService);

  readonly chips = ['Angular', 'Material 3', 'SCSS', 'Signals'];

  // ADD THIS COMPUTED SIGNAL:
  readonly paletteSwatches = computed(() => {
    const baseSwatches = [
      { id: 'primary', label: 'Primary' },
      { id: 'secondary', label: 'Secondary' },
      { id: 'tertiary', label: 'Tertiary' },
      { id: 'surface', label: 'Surface' },
      { id: 'error', label: 'Error' },
      { id: 'success', label: 'Success' },
      { id: 'warning', label: 'Warning' },
      { id: 'info', label: 'Info' },
    ];

    const extended = this.prefs.activeCustomColors().extended || [];

    return [
      ...baseSwatches,
      ...extended.map((ext) => ({ id: ext.id, label: ext.label })),
    ];
  });

  triggerSnackbar(type: 'default' | 'success' | 'warning' | 'info' | 'error') {
    let msg = 'Action completed.';
    if (type === 'success') msg = 'Changes saved successfully!';
    if (type === 'warning')
      msg = 'Warning: Your subscription expires in 3 days.';
    if (type === 'info')
      msg = 'Did you know? New features are available in settings.';
    if (type === 'error') msg = 'Error: Failed to communicate with the server.';

    this.notify.show(type, msg);
  }

  openDialog() {
    this.modals.initModalDialog();
  }

  openBottomSheet() {
    this.modals.initModalBottomSheet();
  }
}
