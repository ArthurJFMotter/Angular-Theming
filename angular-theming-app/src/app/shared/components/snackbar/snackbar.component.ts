import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationData } from '../../../core/models/notification.model';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);
  private readonly sanitizer = inject(DomSanitizer);
  readonly data: NotificationData = inject(MAT_SNACK_BAR_DATA);

  // THE FIX: Generate the dynamic CSS safely in TS!
  get customStyle(): SafeHtml | null {
    const t = this.data.type;
    if (['default', 'success', 'warning', 'info', 'error'].includes(t)) {
      return null;
    }

    const css = `
      .snackbar-${t} {
        --mdc-snackbar-container-color: var(--mat-sys-${t});
        --mdc-snackbar-supporting-text-color: var(--mat-sys-on-${t});
      }
    `;

    // Tell Angular this string is safe to inject as raw HTML
    return this.sanitizer.bypassSecurityTrustHtml(`<style>${css}</style>`);
  }

  get icon(): string | null {
    if (this.data.icon) return this.data.icon;
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'error':
        return 'error';
      default:
        return null;
    }
  }

  onActionClick(): void {
    if (this.data.action) {
      this.data.action.actionFn();
    }
    this.dismiss();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
