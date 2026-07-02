import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="custom-snackbar-layout">
      @if (icon) {
        <mat-icon class="status-icon">{{ icon }}</mat-icon>
      }
      <span class="message">{{ data.message }}</span>
      
      <!-- Close button adapts to the text color automatically -->
      <button mat-icon-button (click)="dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .custom-snackbar-layout {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: -4px -8px -4px 0; /* Offsets Material's default padding to align nicely */
    }
    .status-icon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
    .message {
      flex: 1;
      font-weight: 500;
    }
  `]
})
export class CustomSnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);
  readonly data: { message: string, type: NotificationType } = inject(MAT_SNACK_BAR_DATA);

  get icon(): string | null {
    switch(this.data.type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'error': return 'error';
      default: return null;
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}