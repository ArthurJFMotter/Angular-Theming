import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ModalBottomSheetComponent } from '../../shared/components/modal-bottom-sheet/modal-bottom-sheet.component';
import { ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);

  initModalDialog(): void {
    this.dialog.open(ModalDialogComponent, { 
      width: '400px',
      autoFocus: 'dialog'
    });
  }

  initModalBottomSheet(): void {
    this.bottomSheet.open(ModalBottomSheetComponent);
  }
}