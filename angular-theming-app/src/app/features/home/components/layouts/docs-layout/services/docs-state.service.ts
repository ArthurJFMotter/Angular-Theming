import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocsStateService {
  readonly isAllExpanded = signal(false);

  private expandAllFn?: () => void;
  private collapseAllFn?: () => void;

  /**
   * Registers tree controller methods from DocsLayoutComponent
   */
  registerTreeHandlers(expandAll: () => void, collapseAll: () => void): void {
    this.expandAllFn = expandAll;
    this.collapseAllFn = collapseAll;
  }

  toggleExpandCollapse(): void {
    if (this.isAllExpanded()) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  expandAll(): void {
    this.expandAllFn?.();
    this.isAllExpanded.set(true);
  }

  collapseAll(): void {
    this.collapseAllFn?.();
    this.isAllExpanded.set(false);
  }
}