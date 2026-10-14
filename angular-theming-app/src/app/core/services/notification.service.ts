import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreferencesService } from 'ng-material-preferences';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { NotificationType, NotificationAction, NotificationData } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);

  show(
    type: NotificationType, 
    message: string, 
    action?: NotificationAction, 
    customDuration?: number,
    icon?: string
  ): void {
    let panelClass = '';
    if (type !== 'default') panelClass = `snackbar-${type}`;

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type, action, icon } as NotificationData,
      duration: customDuration ?? 4000,
      horizontalPosition: this.prefs.hasNotifications ? this.prefs.snackbarHPosition() : 'center',
      verticalPosition: this.prefs.hasNotifications ? this.prefs.snackbarVPosition() : 'bottom',
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}