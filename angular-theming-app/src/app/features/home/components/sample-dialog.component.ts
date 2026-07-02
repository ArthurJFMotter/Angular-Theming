import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-sample-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>M3 Elevation & Tinting</h2>
    <mat-dialog-content>
      <p style="margin-top: 8px; color: var(--mat-sys-on-surface-variant);">
        Notice how there is no heavy drop-shadow? Material 3 uses <strong>Surface Tinting</strong> to differentiate layers.
      </p>
      <p style="color: var(--mat-sys-on-surface-variant);">
        The background behind this dialog is dimmed using the dynamically generated <code>--mat-sys-scrim</code> color.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" mat-dialog-close>Acknowledge</button>
    </mat-dialog-actions>
  `
})
export class SampleDialogComponent {}