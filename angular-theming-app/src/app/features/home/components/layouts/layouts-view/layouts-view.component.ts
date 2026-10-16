import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
} from '@angular/core';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { KanbanLayoutComponent } from '../kanban-layout/kanban-layout.component';
import { MobileFrameLayoutComponent } from '../mobile-frame-layout/mobile-frame-layout.component';
import { TableLayoutComponent } from '../table-layout/table-layout.component';
import { CheckoutLayoutComponent } from '../checkout-layout/checkout-layout.component';

@Component({
  selector: 'app-layouts-view',
  standalone: true,
  imports: [
    DashboardLayoutComponent,
    TableLayoutComponent,
    CheckoutLayoutComponent,
    KanbanLayoutComponent,
    MobileFrameLayoutComponent,
  ],
  templateUrl: './layouts-view.component.html',
  styleUrl: './layouts-view.component.scss',
})
export class LayoutsViewComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('spyTarget') spyTargets!: QueryList<ElementRef<HTMLElement>>;
  @Output() sectionScrolled = new EventEmitter<string>();
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) this.sectionScrolled.emit(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );

    this.spyTargets.forEach((target) =>
      this.observer?.observe(target.nativeElement),
    );
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
