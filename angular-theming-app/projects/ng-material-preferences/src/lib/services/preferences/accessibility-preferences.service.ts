import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../../models/preferences.constants';
import { CvdMode, CvdIntent, ScreenFilter, AccessibilityPreferences } from '../../models/preferences.types';
import { PreferenceDomain } from './preference-domain.token';

@Injectable()
export class AccessibilityPreferencesService implements PreferenceDomain<AccessibilityPreferences> {
  readonly key = 'accessibility';

  private defaults = DEFAULT_PREFERENCES_STATE.accessibility;

  readonly cvd = signal<CvdMode>(this.defaults.cvd);
  readonly cvdSeverity = signal<number>(this.defaults.cvdSeverity);
  readonly cvdIntent = signal<CvdIntent>(this.defaults.cvdIntent);
  readonly screenFilter = signal<ScreenFilter>(this.defaults.screenFilter);
  readonly screenFilterIntensity = signal<number>(
    this.defaults.screenFilterIntensity,
  );

  setCvdMode(v: CvdMode): void {
    this.cvd.set(v);
  }
  setCvdSeverity(v: number): void {
    this.cvdSeverity.set(v);
  }
  setCvdIntent(v: CvdIntent): void {
    this.cvdIntent.set(v);
  }
  setScreenFilter(v: ScreenFilter): void {
    this.screenFilter.set(v);
  }
  setScreenFilterIntensity(v: number): void {
    this.screenFilterIntensity.set(v);
  }

  getSnapshot(): AccessibilityPreferences {
    return {
      cvd: this.cvd(), cvdSeverity: this.cvdSeverity(), cvdIntent: this.cvdIntent(),
      screenFilter: this.screenFilter(), screenFilterIntensity: this.screenFilterIntensity()
    };
  }

  patchState(state: Partial<AccessibilityPreferences>): void {
    if (state.cvd !== undefined) this.setCvdMode(state.cvd);
    if (state.cvdSeverity !== undefined) this.setCvdSeverity(state.cvdSeverity);
    if (state.cvdIntent !== undefined) this.setCvdIntent(state.cvdIntent);
    if (state.screenFilter !== undefined) this.setScreenFilter(state.screenFilter);
    if (state.screenFilterIntensity !== undefined) this.setScreenFilterIntensity(state.screenFilterIntensity);
  }

  reset(): void { this.patchState(DEFAULT_PREFERENCES_STATE.accessibility); }
}
