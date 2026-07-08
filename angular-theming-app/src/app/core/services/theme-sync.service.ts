import { Injectable, Inject, effect } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { ColorEngine } from '../utils/engines/color-engine';
import { PREFERENCES_STORAGE_TOKEN, IPreferencesStorage } from '../storage/preferences-storage.interface';

@Injectable({ providedIn: 'root' })
export class ThemeSyncService {
  constructor(
    private prefs: PreferencesService,
    private dom: DomService,
    @Inject(PREFERENCES_STORAGE_TOKEN) private storage: IPreferencesStorage
  ) {
    this.initialize();
  }

  private initialize(): void {
    // 1. Setup global resources
    this.dom.injectCvdFilters();

    // 2. Load from storage and patch state
    const savedState = this.storage.load();
    if (savedState) {
      this.prefs.patchState(savedState);
    }

    // 3. Setup reactive side-effect to apply changes whenever state updates
    effect(() => {
      const state = this.prefs.preferences();
      const activeMode = this.prefs.resolvedMode();
      const isHighContrast = this.prefs.resolvedHighContrast();
      
      // Save to persistence
      this.storage.save(state);

      // Apply structural & layout styling
      this.dom.applyCvdFilter(state.cvd);
      this.dom.applyTypography(state.headingFontFamily, state.bodyFontFamily, state.fontScale);
      this.dom.applyShape(state.shapeScale);

      // Apply HTML data attributes for SCSS targeting
      this.dom.setAttribute('data-theme-mode', activeMode);
      this.dom.setAttribute('data-theme-scheme', state.scheme);
      this.dom.setAttribute('data-theme-density', state.densityScale.toString());
      this.dom.setColorScheme(activeMode);

      // Calculate and apply M3 color tokens
      if (isHighContrast) {
        this.dom.setAttribute('data-theme-contrast', 'high');
        const tokens = ColorEngine.buildTokens(this.prefs.activeCustomColors(), activeMode, 1);
        this.dom.applyTokens(tokens);
      } else {
        this.dom.removeAttribute('data-theme-contrast');
        const tokens = ColorEngine.buildTokens(this.prefs.activeCustomColors(), activeMode, 0);
        this.dom.applyTokens(tokens);
      }
    });
  }
}