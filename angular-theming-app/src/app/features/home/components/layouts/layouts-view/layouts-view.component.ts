import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
  Input,
  inject,
  computed,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AppUiStateService } from '../../../../../core/services/app-ui-state.service';
import { SandboxSection } from '../../../models/sandbox.model';
@Component({
  selector: 'app-layouts-view',
  standalone: true,
  imports: [NgComponentOutlet, MatDividerModule],
  templateUrl: './layouts-view.component.html',
  styleUrl: './layouts-view.component.scss',
})
export class LayoutsViewComponent implements AfterViewInit, OnDestroy {
 private uiState = inject(AppUiStateService);

  @Input({ required: true }) sections: SandboxSection[] = [];
  @Output() sectionScrolled = new EventEmitter<string>();

  @ViewChildren('spyTarget') spyTargets!: QueryList<ElementRef<HTMLElement>>;
  private observer: IntersectionObserver | null = null;

  readonly visibleSections = computed(() => {
    const isMobile = this.uiState.isMobile()?.matches;
    return this.sections.filter((s) => !(s.hideOnMobile && isMobile));
  });

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
