import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { NotificationData } from '../../../core/models/notification.model';

const DEFAULT_ICONS: ReadonlyMap<string, string> = new Map([
  ['success', 'check_circle'],
  ['warning', 'warning'],
  ['info', 'info'],
  ['error', 'error'],
]);

@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef);
  readonly data: NotificationData = inject(MAT_SNACK_BAR_DATA);

  readonly icon: string | null =
    this.data.icon ?? DEFAULT_ICONS.get(this.data.type) ?? null;

  onActionClick(): void {
    this.data.action?.actionFn();
    this.dismiss();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}