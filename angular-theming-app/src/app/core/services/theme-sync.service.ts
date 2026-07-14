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
      
      // Save full state to persistence
      this.storage.save(state);

      // --- COLOR DOMAIN ---
      if (state.color) {
        const activeMode = this.prefs.resolvedMode();
        const contrastValue = this.prefs.resolvedContrastLevel();
        
        this.dom.setAttribute('data-theme-mode', activeMode);
        this.dom.setAttribute('data-theme-scheme', state.color.scheme);
        this.dom.setColorScheme(activeMode);

        if (contrastValue >= 0.5) {
          this.dom.setAttribute('data-theme-contrast', 'high');
        } else {
          this.dom.removeAttribute('data-theme-contrast');
        }
        
        const tokens = ColorEngine.buildTokens(this.prefs.activeCustomColors(), activeMode, contrastValue, state.color.variant);
        this.dom.applyTokens(tokens);
      }

      // --- ACCESSIBILITY DOMAIN ---
      if (state.accessibility) {
        this.dom.applyAccessibilityFilters(
          state.accessibility.cvd, 
          state.accessibility.cvdSeverity, 
          state.accessibility.cvdIntent, 
          state.accessibility.screenFilter, 
          state.accessibility.screenFilterIntensity
        );
      }

      // --- TYPOGRAPHY DOMAIN ---
      if (state.typography) {
        this.dom.applyTypography(
          state.typography.headingFontFamily, 
          state.typography.bodyFontFamily, 
          state.typography.fontScale
        );
      }

      // --- LAYOUT DOMAIN ---
      if (state.layout) {
        this.dom.setAttribute('data-theme-density', state.layout.densityScale.toString());
        this.dom.applyShape(state.layout.shapeScale);
        this.dom.applyMotion(state.layout.motionScale);
      }
    });
  }
}