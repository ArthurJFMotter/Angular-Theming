import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocsStateService } from '../services/docs-state.service';

@Component({
  selector: 'app-docs-tree-action',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      mat-stroked-button
      (click)="docsState.toggleExpandCollapse()"
    >
      <mat-icon>{{ docsState.isAllExpanded() ? 'unfold_less' : 'unfold_more' }}</mat-icon>
      {{ docsState.isAllExpanded() ? 'Collapse All' : 'Expand All' }}
    </button>
  `,
})
export class DocsTreeActionComponent {
  readonly docsState = inject(DocsStateService);
}