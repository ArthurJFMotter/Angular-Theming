import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-sample-bottom-sheet',
  standalone: true,
  imports: [MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <div mat-subheader style="color: var(--mat-sys-primary); font-weight: 500;">Share Theme Profile</div>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>link</mat-icon> <span matListItemTitle>Copy link</span>
      </a>
      <a mat-list-item (click)="close()">
        <mat-icon matListItemIcon>code</mat-icon> <span matListItemTitle>Export CSS</span>
      </a>
    </mat-nav-list>
  `
})
export class SampleBottomSheetComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<SampleBottomSheetComponent>);
  close(): void { this.bottomSheetRef.dismiss(); }
}