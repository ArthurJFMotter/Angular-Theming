import { Injectable, signal, effect, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

export type NotificationType = 'default' | 'success' | 'warning' | 'info' | 'error';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  readonly hPosition = signal<MatSnackBarHorizontalPosition>('center');
  readonly vPosition = signal<MatSnackBarVerticalPosition>('bottom');

  constructor() {
    // Restore positions
    try {
      const saved = localStorage.getItem('angular-theming-app.snackbar-prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.h) this.hPosition.set(parsed.h);
        if (parsed.v) this.vPosition.set(parsed.v);
      }
    } catch {}

    // Auto-save positions
    effect(() => {
      try {
        localStorage.setItem('angular-theming-app.snackbar-prefs', JSON.stringify({
          h: this.hPosition(),
          v: this.vPosition()
        }));
      } catch {}
    });
  }

  show(type: NotificationType, message: string): void {
    let panelClass = '';
    if (type !== 'default') panelClass = `snackbar-${type}`;

    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: this.hPosition(),
      verticalPosition: this.vPosition(),
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}