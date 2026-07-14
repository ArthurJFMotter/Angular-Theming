import { Injectable, signal } from '@angular/core';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DEFAULT_PREFERENCES_STATE } from '../models/preferences.constants';

@Injectable({ providedIn: 'root' })
export class NotificationPreferencesService {
  private defaults = DEFAULT_PREFERENCES_STATE.notifications;

  readonly snackbarHPosition = signal<MatSnackBarHorizontalPosition>(
    this.defaults.snackbarHPosition,
  );
  readonly snackbarVPosition = signal<MatSnackBarVerticalPosition>(
    this.defaults.snackbarVPosition,
  );

  setSnackbarHPosition(v: MatSnackBarHorizontalPosition): void {
    this.snackbarHPosition.set(v);
  }
  setSnackbarVPosition(v: MatSnackBarVerticalPosition): void {
    this.snackbarVPosition.set(v);
  }
}
