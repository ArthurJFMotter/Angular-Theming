import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NotificationService } from '../../../core/services/notification.service';

import { PreferencesService, CustomColors } from 'ng-material-preferences';

@Component({
  selector: 'app-modal-bottom-sheet',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './modal-bottom-sheet.component.html',
  styleUrl: './modal-bottom-sheet.component.scss'
})
export class ModalBottomSheetComponent {
  private sheetRef = inject(MatBottomSheetRef);
  private notify = inject(NotificationService);
  readonly prefs = inject(PreferencesService);

  readonly isExportMode = signal(true); // Toggle between Share / Import
  readonly importCode = signal('');
  readonly profileName = signal('');

  // Generate a shareable code from the active custom colors
  get shareableCode(): string {
    try {
      const colors = this.prefs.activeCustomColors();
      const json = JSON.stringify(colors);
      return btoa(json); // Base64
    } catch {
      return '';
    }
  }

  // Copy to clipboard
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.shareableCode).then(() => {
      this.notify.show('success', 'Profile code copied to clipboard!');
      this.close();
    });
  }

  // Import and Save
  importProfile(): void {
    try {
      const decoded = atob(this.importCode().trim());
      const parsed: Partial<CustomColors> = JSON.parse(decoded);

      if (!parsed.primary) {
        throw new Error('Invalid code: Missing primary color.');
      }

      // Temporarily set them to the active scratchpad
      this.prefs.setCustomColors(parsed);
      
      // Save them as a real profile
      const name = this.profileName().trim() || 'Imported Profile';
      this.prefs.saveCurrentAsProfile(name);
      
      this.notify.show('success', `Imported '${name}' successfully!`);
      this.close();
    } catch (e) {
      this.notify.show('error', 'Failed to import. The code is invalid.');
    }
  }

  close(): void {
    this.sheetRef.dismiss();
  }
}