import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalBottomSheetComponent } from '../../shared/components/modal-bottom-sheet/modal-bottom-sheet.component';
import { DynamicModalComponent } from '../../shared/components/dynamic-modal/dynamic-modal.component';
import { ModalData } from '../models/modal.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);

  // =========================================================
  // DYNAMIC MODAL ENGINE
  // =========================================================

  /**
   * Spawns a highly customizable dynamic modal.
   * @param data The content and actions to render in the modal
   * @param config Optional MatDialogConfig (width, height, animations, etc.)
   */
  open<T = any>(data: ModalData, config?: MatDialogConfig): Observable<T | undefined> {
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '400px',
      maxWidth: '90vw',
      ...config,
      data
    });

    return dialogRef.afterClosed();
  }

  /** Quick "OK" Alert */
  alert(title: string, message: string, icon?: string, config?: MatDialogConfig): Observable<boolean> {
    return this.open<boolean>({
      title,
      message,
      icon,
      showCloseButton: false,
      actions: [{ label: 'OK', value: true, isPrimary: true }]
    }, config).pipe(map(result => !!result));
  }

  /** Quick "Confirm / Cancel" Dialog */
  confirm(title: string, message: string, icon?: string, config?: MatDialogConfig): Observable<boolean> {
    return this.open<boolean>({
      title,
      message,
      icon,
      showCloseButton: false,
      actions: [
        { label: 'Cancel', value: false },
        { label: 'Confirm', value: true, isPrimary: true, color: 'primary' }
      ]
    }, config).pipe(map(result => !!result));
  }

  /** Dangerous "Delete / Cancel" Dialog */
  confirmDanger(title: string, message: string, icon: string = 'warning', config?: MatDialogConfig): Observable<boolean> {
    return this.open<boolean>({
      title,
      message,
      icon,
      showCloseButton: false,
      actions: [
        { label: 'Cancel', value: false },
        { label: 'Delete', value: true, isPrimary: true, color: 'warn' }
      ]
    }, config).pipe(map(result => !!result));
  }

  /** 
   * Spawns the Documentation Modal with a preview, 
   * and automatically handles routing to the external links.
   */
  showDocs(config?: MatDialogConfig): void {
    this.open({
      title: 'Documentation',
      icon: 'menu_book',
      message: 'ng-material-preferences is fully documented on NPM. Here is a quick preview of the installation and zero-config setup:',
      previewSnippet: `npm install ng-material-preferences\n\nimport { providePreferences } from 'ng-material-preferences';\n\nexport const appConfig = {\n  providers: [\n    // Zero-config, or pass options for granular control\n    providePreferences({\n      disableRemoteFonts: true,\n      notifications: false // Tree-shake unused domains!\n    })\n  ]\n};`,
      showCloseButton: true,
      actions: [
        { label: 'View on NPM', value: 'npm', isPrimary: true, color: 'primary' }
      ]
    }, {
      width: '600px',
      ...config
    }).subscribe(result => {
      if (result === 'npm') {
        window.open('https://www.npmjs.com/package/ng-material-preferences', '_blank', 'noopener,noreferrer');
      }
    });
  }

  // =========================================================
  // APP-SPECIFIC IMPLEMENTATIONS
  // =========================================================

  initModalBottomSheet(): void {
    this.bottomSheet.open(ModalBottomSheetComponent);
  }

  initModalDialog(): void {
    this.open({
      title: 'Advanced Preferences',
      icon: 'settings',
      message: 'Future home for advanced theming configuration, deeper accessibility overrides, and JSON import/export settings.\n\nNotice how Material 3 uses Surface Tinting and --mat-sys-scrim to separate this layer from the background instead of a heavy drop-shadow!',
      showCloseButton: false, 
      actions: [
        { label: 'Cancel', value: false },
        { label: 'Save Settings', value: true, isPrimary: true, color: 'primary' }
      ]
    });
  }
}