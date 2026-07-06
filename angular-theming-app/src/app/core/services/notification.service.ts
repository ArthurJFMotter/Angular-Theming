import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { PreferencesService } from './preferences.service';

export type NotificationType = 'default' | 'success' | 'warning' | 'info' | 'error';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);

  show(type: NotificationType, message: string): void {
    let panelClass = '';
    if (type !== 'default') panelClass = `snackbar-${type}`;

    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: this.prefs.snackbarHPosition(),
      verticalPosition: this.prefs.snackbarVPosition(),
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}