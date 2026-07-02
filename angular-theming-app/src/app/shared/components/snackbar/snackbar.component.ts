import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class CustomSnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);
  readonly data: { message: string; type: NotificationType } =
    inject(MAT_SNACK_BAR_DATA);

  get icon(): string | null {
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

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
