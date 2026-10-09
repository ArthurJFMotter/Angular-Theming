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
import { MatDividerModule } from '@angular/material/divider';
import { ActionsSectionComponent } from '../actions-section/actions-section.component';
import { FeedbackSectionComponent } from '../feedback-section/feedback-section.component';
import { InputsSectionComponent } from '../inputs-section/inputs-section.component';
import { SurfacesSectionComponent } from '../surfaces-section/surfaces-section.component';

@Component({
  selector: 'app-elements-view',
  standalone: true,
  imports: [
    MatDividerModule,
    ActionsSectionComponent,
    InputsSectionComponent,
    SurfacesSectionComponent,
    FeedbackSectionComponent,
  ],
  templateUrl: './elements-view.component.html',
  styleUrl: './elements-view.component.scss',
})
export class ElementsViewComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('spyTarget') spyTargets!: QueryList<ElementRef<HTMLElement>>;
  @Output() sectionScrolled = new EventEmitter<string>();
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) this.sectionScrolled.emit(visible.target.id);
      },
      { rootMargin: '-100px 0px -60% 0px' },
    );
    this.spyTargets.forEach((target) =>
      this.observer?.observe(target.nativeElement),
    );
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
