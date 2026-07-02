import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-modal-bottom-sheet',
  standalone: true,
  imports: [MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <div mat-subheader style="color: var(--mat-sys-primary); font-weight: 500;">Export & Share Profile</div>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>link</mat-icon> 
        <span matListItemTitle>Copy URL Link</span>
      </a>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>code</mat-icon> 
        <span matListItemTitle>Export to SCSS / CSS</span>
      </a>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>data_object</mat-icon> 
        <span matListItemTitle>Download JSON</span>
      </a>
    </mat-nav-list>
  `
})
export class ModalBottomSheetComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<ModalBottomSheetComponent>);
  
  close(): void { 
    this.bottomSheetRef.dismiss(); 
  }
}