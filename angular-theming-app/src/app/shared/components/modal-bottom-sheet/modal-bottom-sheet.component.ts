import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-modal-bottom-sheet',
  standalone: true,
  imports: [MatListModule, MatIconModule],
  templateUrl: './modal-bottom-sheet.component.html',
  styleUrl: './modal-bottom-sheet.component.scss',
})
export class ModalBottomSheetComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<ModalBottomSheetComponent>);
  
  close(): void { 
    this.bottomSheetRef.dismiss(); 
  }
}