import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { PreferencesService } from 'ng-material-preferences';

export type NotificationType = 'default' | 'success' | 'warning' | 'info' | 'error';

export interface NotificationAction {
  label: string;
  actionFn: () => void;
}

export interface NotificationData {
  message: string;
  type: NotificationType;
  icon?: string;
  action?: NotificationAction;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);

  show(
    type: NotificationType, 
    message: string, 
    action?: NotificationAction, 
    customDuration?: number
  ): void {
    let panelClass = '';
    if (type !== 'default') panelClass = `snackbar-${type}`;

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type, action } as NotificationData,
      duration: customDuration ?? 4000,
      horizontalPosition: this.prefs.snackbarHPosition?.() || 'center',
      verticalPosition: this.prefs.snackbarVPosition?.() || 'bottom',
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}