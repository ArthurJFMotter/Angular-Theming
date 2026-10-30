import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MobileFrameStateService implements OnDestroy {
  readonly isHorizontal = signal(false);
  readonly isRotating = signal(false);
  private rotateTimer?: ReturnType<typeof setTimeout>;

  toggleOrientation(): void {
    if (this.isRotating()) return;
    this.isRotating.set(true);

    const scale =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--theme-motion-scale'
        ) || '1'
      ) || 1;

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