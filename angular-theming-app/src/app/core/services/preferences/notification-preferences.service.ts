import { Injectable, signal } from '@angular/core';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DEFAULT_PREFERENCES_STATE } from '../../models/preferences.constants';
import { NotificationPreferences } from '../../models/preferences.types';
import { PreferenceDomain } from './preference-domain.token';

@Injectable()
export class NotificationPreferencesService implements PreferenceDomain<NotificationPreferences> {
  readonly key = 'notifications';

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

  getSnapshot(): NotificationPreferences {
    return { snackbarHPosition: this.snackbarHPosition(), snackbarVPosition: this.snackbarVPosition() };
  }

  patchState(state: Partial<NotificationPreferences>): void {
    if (state.snackbarHPosition !== undefined) this.setSnackbarHPosition(state.snackbarHPosition);
    if (state.snackbarVPosition !== undefined) this.setSnackbarVPosition(state.snackbarVPosition);
  }

  reset(): void { this.patchState(DEFAULT_PREFERENCES_STATE.notifications); }
}
