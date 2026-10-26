import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalData, ModalAction } from '../../../core/models/modal.model';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  private readonly dialogRef = inject(MatDialogRef<DynamicModalComponent>);
  readonly data: ModalData = inject(MAT_DIALOG_DATA);

  /**
   * Returns true if any field marked as isRequired is empty.
   * Non-required fields are completely ignored.
   */
  isFormInvalid(): boolean {
    const invalidInputs = this.data.inputs?.some(
      (input) => input.isRequired && this.isEmpty(input.value)
    ) ?? false;

    const invalidSelects = this.data.selects?.some(
      (select) => select.isRequired && this.isEmpty(select.value)
    ) ?? false;

    return invalidInputs || invalidSelects;
  }

  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    return false;
  }

  handleAction(action: ModalAction): void {
    if (action.returnsPayload) {
      this.dialogRef.close({
        action: action.value,
        inputs: this.data.inputs,
        selects: this.data.selects,
        toggles: this.data.toggles,
        checklist: this.data.checklist,
      });
    } else {
      this.dialogRef.close(action.value);
    }
  }
}