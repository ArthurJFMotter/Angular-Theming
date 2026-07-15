import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../../models/preferences.constants';
import { TypographyPreferences } from '../../models/preferences.types';
import { PreferenceDomain } from './preference-domain.token';

@Injectable()
export class TypographyPreferencesService implements PreferenceDomain<TypographyPreferences> {
  readonly key = 'typography';

  private defaults = DEFAULT_PREFERENCES_STATE.typography;

  readonly headingFontFamily = signal<string>(this.defaults.headingFontFamily);
  readonly bodyFontFamily = signal<string>(this.defaults.bodyFontFamily);
  readonly fontScale = signal<number>(this.defaults.fontScale);

  setHeadingFontFamily(v: string): void {
    this.headingFontFamily.set(v);
  }
  setBodyFontFamily(v: string): void {
    this.bodyFontFamily.set(v);
  }
  setFontScale(v: number): void {
    this.fontScale.set(v);
  }

  getSnapshot(): TypographyPreferences {
    return { headingFontFamily: this.headingFontFamily(), bodyFontFamily: this.bodyFontFamily(), fontScale: this.fontScale() };
  }

  patchState(state: Partial<TypographyPreferences>): void {
    if (state.headingFontFamily !== undefined) this.setHeadingFontFamily(state.headingFontFamily);
    if (state.bodyFontFamily !== undefined) this.setBodyFontFamily(state.bodyFontFamily);
    if (state.fontScale !== undefined) this.setFontScale(state.fontScale);
  }

  reset(): void { this.patchState(DEFAULT_PREFERENCES_STATE.typography); }
}
