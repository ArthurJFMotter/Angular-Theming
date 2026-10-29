import { Injectable, inject, isDevMode } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreferencesService } from 'ng-material-preferences';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import {
  NotificationAction,
  NotificationData,
  NotificationType,
} from '../models/notification.model';

/** Types the library's SCSS (`snackbar-variants()`) already styles. */
const BUILT_IN_TYPES: ReadonlySet<string> = new Set([
  'default',
  'success',
  'warning',
  'info',
  'error',
]);

/** A safe CSS identifier. Anything else is never placed into a class name. */
const SAFE_ROLE = /^[A-Za-z_][A-Za-z0-9_-]*$/;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);

  show(
    type: NotificationType,
    message: string,
    action?: NotificationAction,
    customDuration?: number,
    icon?: string,
  ): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type, action, icon } satisfies NotificationData,
      duration: customDuration ?? 4000,
      horizontalPosition: this.prefs.hasNotifications
        ? this.prefs.snackbarHPosition()
        : 'center',
      verticalPosition: this.prefs.hasNotifications
        ? this.prefs.snackbarVPosition()
        : 'bottom',
      panelClass: this.panelClassFor(type),
    });
  }

  /**
   * Built-in types are styled by the library's SCSS; custom roles by the library's
   * runtime stylesheet (SnackbarRoleStylesService), which it keeps in sync with the
   * extended colors. Here we only validate the name and build the class.
   */
  private panelClassFor(type: NotificationType): string[] | undefined {
    if (type === 'default') return undefined;

    if (!BUILT_IN_TYPES.has(type) && !SAFE_ROLE.test(type)) {
      if (isDevMode()) {
        console.warn(`[NotificationService] Ignoring unsafe notification type "${type}".`);
      }
      return undefined;
    }
    return [`snackbar-${type}`];
  }
}