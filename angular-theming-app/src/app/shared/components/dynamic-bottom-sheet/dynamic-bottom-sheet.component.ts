import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BottomSheetData, BottomSheetItem } from '../../../core/models/bottom-sheet.model';
import { ModalAction } from '../../../core/models/modal.model';

@Component({
  selector: 'app-dynamic-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './dynamic-bottom-sheet.component.html',
  styleUrl: './dynamic-bottom-sheet.component.scss',
})
export class DynamicBottomSheetComponent {
  private readonly sheetRef = inject(MatBottomSheetRef<DynamicBottomSheetComponent>);
  readonly data: BottomSheetData = inject(MAT_BOTTOM_SHEET_DATA) || {};

  selectItem(item: BottomSheetItem): void {
    if (item.disabled) return;
    this.sheetRef.dismiss(item.value);
  }

  isFormInvalid(): boolean {
    const invalidInputs =
      this.data.inputs?.some((input) => input.isRequired && this.isEmpty(input.value)) ??
      false;

    const invalidSelects =
      this.data.selects?.some((select) => select.isRequired && this.isEmpty(select.value)) ??
      false;

    return invalidInputs || invalidSelects;
  }

  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    return false;
  }

  handleAction(action: ModalAction): void {
    if (action.returnsPayload) {
      this.sheetRef.dismiss({
        action: action.value,
        inputs: this.data.inputs,
        selects: this.data.selects,
        toggles: this.data.toggles,
        checklist: this.data.checklist,
      });
    } else {
      this.sheetRef.dismiss(action.value);
    }
  }

  close(): void {
    this.sheetRef.dismiss();
  }
}