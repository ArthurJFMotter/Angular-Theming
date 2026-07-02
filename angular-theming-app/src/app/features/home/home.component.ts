import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';           
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { MatListModule } from '@angular/material/list';                                        
import { ThemeSwitcherComponent } from '../../shared/components/theme-switcher/theme-switcher.component';

// =============================================================================
// Inline Overlay Components (Dialog & Bottom Sheet)
// =============================================================================

@Component({
  selector: 'app-sample-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>M3 Elevation & Tinting</h2>
    <mat-dialog-content>
      <p style="margin-top: 8px; color: var(--mat-sys-on-surface-variant);">
        Notice how there is no heavy drop-shadow? Material 3 uses <strong>Surface Tinting</strong> (the <code>surface-container-highest</code> token) to differentiate floating layers from the background.
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

@Component({
  selector: 'app-sample-bottom-sheet',
  standalone: true,
  imports: [MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <div mat-subheader style="color: var(--mat-sys-primary); font-weight: 500;">Share Theme Profile</div>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>link</mat-icon>
        <span matListItemTitle>Copy link</span>
      </a>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>code</mat-icon>
        <span matListItemTitle>Export CSS</span>
      </a>
    </mat-nav-list>
  `
})
export class SampleBottomSheetComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<SampleBottomSheetComponent>);
  close(): void { this.bottomSheetRef.dismiss(); }
}


// =============================================================================
// Main Home Component
// =============================================================================

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, 
    MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatProgressBarModule, 
    MatDividerModule, MatTabsModule, MatBadgeModule, MatSelectModule, MatSnackBarModule, 
    MatDialogModule, MatBottomSheetModule, 
    ThemeSwitcherComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);             
  private readonly bottomSheet = inject(MatBottomSheet);   

  readonly chips = ['Angular', 'Material 3', 'SCSS', 'Signals'];

  hPosition: MatSnackBarHorizontalPosition = 'center';
  vPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackbar(type: 'default' | 'success' | 'warning' | 'info' | 'error') {
    let message = 'Action completed.';
    let panelClass = '';
    switch (type) {
      case 'success': message = 'Changes saved successfully!'; panelClass = 'snackbar-success'; break;
      case 'warning': message = 'Warning: Your subscription expires in 3 days.'; panelClass = 'snackbar-warning'; break;
      case 'info': message = 'Did you know? New features are available in settings.'; panelClass = 'snackbar-info'; break;
      case 'error': message = 'Error: Failed to communicate with the server.'; panelClass = 'snackbar-error'; break;
    }
    this.snackBar.open(message, 'Close', {
      duration: 4000, horizontalPosition: this.hPosition, verticalPosition: this.vPosition,
      panelClass: panelClass ? [panelClass] : undefined
    });
  }

  openDialog() {
    this.dialog.open(SampleDialogComponent, { width: '400px' });
  }

  openBottomSheet() {
    this.bottomSheet.open(SampleBottomSheetComponent);
  }
}