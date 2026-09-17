import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalData, ModalAction } from '../../../core/models/modal.model';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  private readonly dialogRef = inject(MatDialogRef<DynamicModalComponent>);
  
  readonly data: ModalData = inject(MAT_DIALOG_DATA);

  handleAction(action: ModalAction): void {
    this.dialogRef.close(action.value);
  }
}