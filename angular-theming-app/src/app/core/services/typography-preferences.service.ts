import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../models/preferences.constants';

@Injectable()
export class TypographyPreferencesService {
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
}
