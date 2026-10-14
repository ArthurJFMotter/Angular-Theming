import { DOCUMENT } from '@angular/common';
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

/** A safe CSS identifier. Anything else is never placed into CSS or a class name. */
const SAFE_ROLE = /^[A-Za-z_][A-Za-z0-9_-]*$/;

/**
 * Use the solid pair (`--mat-sys-<role>`) instead of the container pair
 * (`--mat-sys-<role>-container`). The container pair matches the built-in
 * success/warning/info/error snackbars.
 */
const SOLID_TONE = false;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly prefs = inject(PreferencesService);
  private readonly doc = inject(DOCUMENT);

  /** Roles whose `.snackbar-<role>` rule is already in <head>. */
  private readonly registeredRoles = new Set<string>();

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

  private panelClassFor(type: NotificationType): string[] | undefined {
    if (type === 'default') return undefined;

    if (!BUILT_IN_TYPES.has(type)) {
      if (!SAFE_ROLE.test(type)) {
        if (isDevMode()) {
          console.warn(`[NotificationService] Ignoring unsafe notification type "${type}".`);
        }
        return undefined;
      }
      this.registerRole(type);
    }
    return [`snackbar-${type}`];
  }

  /**
   * INTERIM: registers `.snackbar-<role>` once. Delete this method (and
   * SOLID_TONE) when the library registers role styles itself
   * (SnackbarRoleStylesService); keep the SAFE_ROLE check.
   */
  private registerRole(role: string): void {
    if (this.registeredRoles.has(role)) return;
    this.registeredRoles.add(role);

    const bg = SOLID_TONE ? `--mat-sys-${role}` : `--mat-sys-${role}-container`;
    const fg = SOLID_TONE ? `--mat-sys-on-${role}` : `--mat-sys-on-${role}-container`;

    const style = this.doc.createElement('style');
    style.setAttribute('data-snackbar-role', role);
    style.textContent =
      `.snackbar-${role}{` +
      `--mdc-snackbar-container-color:var(${bg});` +
      `--mdc-snackbar-supporting-text-color:var(${fg});` +
      `--mat-snack-bar-container-color:var(${bg});` +
      `--mat-snack-bar-supporting-text-color:var(${fg});` +
      `--mat-snack-bar-button-color:var(${fg});}`;
    this.doc.head.appendChild(style);
  }
}