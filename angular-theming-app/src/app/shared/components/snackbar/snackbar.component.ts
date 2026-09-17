import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationData } from '../../../core/services/notification.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);
  readonly data: NotificationData = inject(MAT_SNACK_BAR_DATA);

  get icon(): string | null {
    if (this.data.icon) return this.data.icon; // Allows manual override
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
      this.data.action.actionFn(); // Execute the callback!
    }
    this.dismiss();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}