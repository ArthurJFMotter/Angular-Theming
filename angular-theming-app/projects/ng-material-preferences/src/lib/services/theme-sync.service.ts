import { Injectable, Inject, Optional, effect } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { ColorEngine } from '../utils/engines/color-engine';
import { PREFERENCES_STORAGE_TOKEN, IPreferencesStorage } from '../storage/preferences-storage.interface';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({ providedIn: 'root' })
export class ThemeSyncService {
  constructor(
    private prefs: PreferencesService,
    private dom: DomService,
    @Optional() @Inject(PREFERENCES_STORAGE_TOKEN) private storage: IPreferencesStorage | null,
    private overlay: OverlayContainer
  ) {
    this.initialize();
  }

  private initialize(): void {

    const savedState = this.storage?.load();
    if (savedState) {
      this.prefs.patchState(savedState);
    }

    effect(() => {
      const state = this.prefs.preferences();
      this.storage?.save(state);

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

        if (state.layout.motionScale === 0) {
          this.dom.setAttribute('data-theme-motion', 'off');
          this.overlay.getContainerElement().classList.add('theme-motion-off');
        } else {
          this.dom.removeAttribute('data-theme-motion');
          this.overlay.getContainerElement().classList.remove('theme-motion-off');
        }
      }
    });
  }
}