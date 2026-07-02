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
import { ThemeSwitcherComponent } from '../../shared/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    MatBadgeModule,
    MatSelectModule,      
    MatSnackBarModule,    
    ThemeSwitcherComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly snackBar = inject(MatSnackBar);

  readonly chips = ['Angular', 'Material 3', 'SCSS', 'Signals'];

  // Default snackbar spawn positions
  hPosition: MatSnackBarHorizontalPosition = 'center';
  vPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackbar(type: 'default' | 'success' | 'warning' | 'info' | 'error') {
    let message = 'Action completed.';
    let panelClass = '';

    // Map the requested type to our semantic messages and custom CSS classes
    switch (type) {
      case 'success': 
        message = 'Changes saved successfully!'; 
        panelClass = 'snackbar-success'; 
        break;
      case 'warning': 
        message = 'Warning: Your subscription expires in 3 days.'; 
        panelClass = 'snackbar-warning'; 
        break;
      case 'info': 
        message = 'Did you know? New features are available in settings.'; 
        panelClass = 'snackbar-info'; 
        break;
      case 'error': 
        message = 'Error: Failed to communicate with the server.'; 
        panelClass = 'snackbar-error'; 
        break;
    }

    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: this.hPosition,
      verticalPosition: this.vPosition,
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}