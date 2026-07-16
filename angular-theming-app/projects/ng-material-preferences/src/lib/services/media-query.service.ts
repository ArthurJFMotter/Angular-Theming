import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MediaQueryService {
  readonly prefersDark = signal<boolean>(false);
  readonly prefersHighContrast = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initListeners();
    }
  }

  private initListeners(): void {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.prefersDark.set(darkQuery.matches);
    darkQuery.addEventListener('change', (e) =>
      this.prefersDark.set(e.matches),
    );

    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    this.prefersHighContrast.set(contrastQuery.matches);
    contrastQuery.addEventListener('change', (e) =>
      this.prefersHighContrast.set(e.matches),
    );
  }
}
