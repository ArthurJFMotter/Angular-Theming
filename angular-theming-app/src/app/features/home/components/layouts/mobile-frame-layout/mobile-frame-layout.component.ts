import { Component, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mobile-frame-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mobile-frame-layout.component.html',
  styleUrl: './mobile-frame-layout.component.scss',
})
export class MobileFrameLayoutComponent implements OnDestroy {
  readonly sheetOpen = signal(false);
  readonly isHorizontal = signal(false);

  readonly isRotating = signal(false);
  private rotateTimer?: ReturnType<typeof setTimeout>;

  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly bp = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  readonly isRealMobile = computed(() => this.bp());

  toggleOrientation(): void {
    if (this.isRotating()) return;
    this.isRotating.set(true);

    const scale =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--theme-motion-scale',
        ) || '1',
      ) || 1;

    // 90° visual turn, then dimension swap at the end.
    const duration = 600 * scale;

    this.rotateTimer = setTimeout(() => {
      this.isHorizontal.update((v) => !v);
      this.isRotating.set(false);
    }, duration);
  }

  ngOnDestroy(): void {
    if (this.rotateTimer) clearTimeout(this.rotateTimer);
  }
}
