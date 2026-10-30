import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MobileFrameStateService } from '../services/mobile-frame-state.service';

@Component({
  selector: 'app-mobile-rotate-action',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      mat-stroked-button
      [disabled]="state.isRotating()"
      (click)="state.toggleOrientation()"
    >
      <mat-icon>screen_rotation</mat-icon>
      Rotate Device
    </button>
  `,
})
export class MobileRotateActionComponent {
  readonly state = inject(MobileFrameStateService);
}