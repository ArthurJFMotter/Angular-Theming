import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../models/preferences.constants';
import { CvdMode, CvdIntent, ScreenFilter } from '../models/preferences.types';

@Injectable({ providedIn: 'root' })
export class AccessibilityPreferencesService {
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
}
