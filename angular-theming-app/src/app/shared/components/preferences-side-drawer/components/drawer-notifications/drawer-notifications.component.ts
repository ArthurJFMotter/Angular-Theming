import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

import {
  PreferencesService,
  SNACKBAR_V_POSITIONS,
  SNACKBAR_H_POSITIONS,
} from 'ng-material-preferences';
import { PreferenceSelectComponent } from '../../../preference-select/preference-select.component';
import {
  NotificationService,
  NotificationType,
} from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-drawer-notifications',
  standalone: true,
  imports: [MatButtonModule, PreferenceSelectComponent],
  templateUrl: './drawer-notifications.component.html',
  styleUrl: './drawer-notifications.component.scss',
})
export class DrawerNotificationsComponent {
  readonly prefs = inject(PreferencesService);
  private notify = inject(NotificationService);

  readonly vPositions = SNACKBAR_V_POSITIONS;
  readonly hPositions = SNACKBAR_H_POSITIONS;

  updateVPosition(val: MatSnackBarVerticalPosition) {
    this.prefs.setSnackbarVPosition(val);
    this.notify.show('default', `Vertical spawn updated to ${val}.`);
  }

  updateHPosition(val: MatSnackBarHorizontalPosition) {
    this.prefs.setSnackbarHPosition(val);
    this.notify.show('default', `Horizontal spawn updated to ${val}.`);
  }

}
