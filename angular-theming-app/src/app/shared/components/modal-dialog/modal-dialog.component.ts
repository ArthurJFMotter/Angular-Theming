import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="display: flex; align-items: center; gap: 8px;">
      <mat-icon color="primary">settings</mat-icon>
      Advanced Preferences
    </h2>

    <mat-dialog-content>
      <p style="margin-top: 8px; color: var(--mat-sys-on-surface-variant);">
        Future home for advanced theming configuration, deeper accessibility
        overrides, and JSON import/export settings.
      </p>
      <p style="color: var(--mat-sys-on-surface-variant);">
        <em
          >Notice how Material 3 uses <strong>Surface Tinting</strong> and
          <code>--mat-sys-scrim</code> to separate this layer from the
          background instead of a heavy drop-shadow!</em
        >
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" mat-dialog-close>
        Save Settings
      </button>
    </mat-dialog-actions>
  `,
})
export class ModalDialogComponent {}
