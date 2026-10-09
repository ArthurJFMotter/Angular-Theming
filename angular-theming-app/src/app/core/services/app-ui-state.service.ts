import { Injectable, signal, effect, computed, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreferencesService } from 'ng-material-preferences';
import { ModalService } from './modal.service';
import { DrawerConfig } from '../models/drawer.model';

export type WidgetMode = 'fab' | 'drawer' | 'none';

@Injectable({ providedIn: 'root' })
export class AppUiStateService {
  private prefs = inject(PreferencesService);
  private modals = inject(ModalService);
  private breakpointObserver = inject(BreakpointObserver);

  // --- PERSISTED STATE ---
  readonly widgetMode = signal<WidgetMode>('fab');
  readonly fabMenus = signal<Record<string, boolean>>({
    color: true,
    typography: true,
    layout: true,
    notifications: true,
    accessibility: true,
  });
  readonly drawerConfig = signal<DrawerConfig>({
    mode: 'over',
    position: 'end',
    hasBackdrop: true,
  });

  // --- DERIVED STATE ---
  readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]),
    { initialValue: { matches: false, breakpoints: {} } },
  );

  readonly safeDrawerConfig = computed(() => {
    const config = this.drawerConfig();
    // Force safe rendering on narrow viewports
    if (this.isMobile()?.matches) {
      return { ...config, mode: 'over' as const, hasBackdrop: true };
    }
    return config;
  });

  constructor() {
    try {
      const saved = localStorage.getItem('app-ui-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.widgetMode !== undefined)
          this.widgetMode.set(parsed.widgetMode);
        else if (parsed.showQuickFab !== undefined)
          this.widgetMode.set(parsed.showQuickFab ? 'fab' : 'none');

        if (parsed.fabMenus) this.fabMenus.set(parsed.fabMenus);
        if (parsed.drawerConfig) this.drawerConfig.set(parsed.drawerConfig);
      }
    } catch {}

    effect(() => {
      localStorage.setItem(
        'app-ui-state',
        JSON.stringify({
          widgetMode: this.widgetMode(),
          fabMenus: this.fabMenus(),
          drawerConfig: this.drawerConfig(),
        }),
      );
    });
  }

  // --- ORCHESTRATION ---
  triggerGlobalReset(): void {
    this.modals
      .confirmDanger(
        'Reset All Settings',
        'Are you sure you want to restore everything to factory defaults? All custom color palettes, accessibility settings, and quick-access widget configurations will be lost.',
        'restore',
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          // Reset Library
          this.prefs.resetToDefaults();

          // Reset App UI State
          this.widgetMode.set('fab');
          this.fabMenus.set({
            color: true,
            typography: true,
            layout: true,
            notifications: true,
            accessibility: true,
          });
          this.drawerConfig.set({
            mode: 'over',
            position: 'end',
            hasBackdrop: true,
          });

          window.scrollTo({
            top: 0,
            behavior: this.prefs.motionScale() === 0 ? 'instant' : 'smooth',
          });
        }
      });
  }
}
