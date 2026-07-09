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
    // Load from storage and patch state
    const savedState = this.storage.load();
    if (savedState) {
      this.prefs.patchState(savedState);
    }

    // Setup reactive side-effect to apply changes whenever state updates
    effect(() => {
      const state = this.prefs.preferences();
      const activeMode = this.prefs.resolvedMode();
      const contrastValue = this.prefs.resolvedContrastLevel();
      
      // Save to persistence
      this.storage.save(state);

      // Apply structural, layout, & motion styling
      this.dom.applyAccessibilityFilters(state.cvd, state.cvdSeverity, state.screenFilter, state.screenFilterIntensity);
      this.dom.applyTypography(state.headingFontFamily, state.bodyFontFamily, state.fontScale);
      this.dom.applyTypography(state.headingFontFamily, state.bodyFontFamily, state.fontScale);
      this.dom.applyShape(state.shapeScale);
      this.dom.applyMotion(state.motionScale);

      // Apply HTML data attributes for SCSS targeting
      this.dom.setAttribute('data-theme-mode', activeMode);
      this.dom.setAttribute('data-theme-scheme', state.scheme);
      this.dom.setAttribute('data-theme-density', state.densityScale.toString());
      this.dom.setColorScheme(activeMode);

      // Handle high contrast data attribute
      if (contrastValue >= 0.5) {
        this.dom.setAttribute('data-theme-contrast', 'high');
      } else {
        this.dom.removeAttribute('data-theme-contrast');
      }
      
      // Handle color variant data attribute
      const tokens = ColorEngine.buildTokens(this.prefs.activeCustomColors(), activeMode, contrastValue, state.variant);
      this.dom.applyTokens(tokens);
    });
  }
}