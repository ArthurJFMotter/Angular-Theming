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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheet } from '@angular/material/bottom-sheet'; // <-- ADD THIS

import { PreferencesSideDrawerComponent } from '../../shared/components/preferences-side-drawer/preferences-side-drawer.component';
import { ModalBottomSheetComponent } from '../../shared/components/modal-bottom-sheet/modal-bottom-sheet.component'; // <-- ADD THIS
import { ModalService } from '../../core/services/modal.service';
import { NotificationService, NotificationType } from '../../core/services/notification.service';
import { PreferencesService } from 'ng-material-preferences';

@Component({
  selector: 'app-home', // Or 'app-home' depending on what you named it
  standalone: true,
  imports: [
    MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatProgressBarModule,
    MatDividerModule, MatTabsModule, MatBadgeModule, MatSelectModule, MatSidenavModule,
    PreferencesSideDrawerComponent,
  ],
  templateUrl: './home.component.html', // Point to your HTML file
  styleUrl: './home.component.scss',    // Point to your SCSS file
})
export class HomeComponent {
  readonly notify = inject(NotificationService);
  readonly modals = inject(ModalService);
  readonly bottomSheet = inject(MatBottomSheet); // Inject native bottom sheet
  readonly prefs = inject(PreferencesService);

  readonly chips = ['Angular', 'Material 3', 'SCSS', 'Signals'];

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

  triggerSnackbar(type: NotificationType) {
    const messages: Record<NotificationType, string> = {
      default: 'Action completed.',
      success: 'Changes saved successfully!',
      warning: 'Warning: Your subscription expires in 3 days.',
      info: 'Did you know? New features are available in settings.',
      error: 'Error: Failed to communicate with the server.',
    };

    // Show off the new interactive action buttons in the sandbox!
    const actionLabels: Record<NotificationType, string | undefined> = {
      default: undefined,
      success: 'Undo',
      warning: 'Retry',
      info: 'Learn More',
      error: 'Report',
    };

    const label = actionLabels[type];
    const action = label ? { label, actionFn: () => console.log(`${label} clicked!`) } : undefined;

    this.notify.show(type, messages[type], action, 4000);
  }

  openDialog() {
    this.modals.alert(
      'Advanced Preferences',
      'Material 3 avoids heavy shadows, instead using surface tints to indicate elevation.',
      'settings'
    ).subscribe();
  }

  openBottomSheet() {
    this.bottomSheet.open(ModalBottomSheetComponent);
  }
}