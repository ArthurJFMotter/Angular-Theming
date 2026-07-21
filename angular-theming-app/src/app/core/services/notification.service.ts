import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { PreferencesService } from 'ng-material-preferences';

export type NotificationType = 'default' | 'success' | 'warning' | 'info' | 'error';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);

  show(type: NotificationType, message: string): void {
    let panelClass = '';
    if (type !== 'default') panelClass = `snackbar-${type}`;

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: this.prefs.snackbarHPosition?.() || 'center',
      verticalPosition: this.prefs.snackbarVPosition?.() || 'bottom',
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}