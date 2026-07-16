import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../../models/preferences.constants';
import { LayoutPreferences } from '../../models/preferences.types';
import { PreferenceDomain } from './preference-domain.token';

@Injectable()
export class LayoutPreferencesService implements PreferenceDomain<LayoutPreferences> {
  readonly key = 'layout';

  private defaults = DEFAULT_PREFERENCES_STATE.layout;

  readonly shapeScale = signal<number>(this.defaults.shapeScale);
  readonly densityScale = signal<number>(this.defaults.densityScale);
  readonly motionScale = signal<number>(this.defaults.motionScale);

  setShapeScale(v: number): void {
    this.shapeScale.set(v);
  }
  setDensityScale(v: number): void {
    this.densityScale.set(v);
  }
  setMotionScale(v: number): void {
    this.motionScale.set(v);
  }

  getSnapshot(): LayoutPreferences {
    return { shapeScale: this.shapeScale(), densityScale: this.densityScale(), motionScale: this.motionScale() };
  }

  patchState(state: Partial<LayoutPreferences>): void {
    if (state.shapeScale !== undefined) this.setShapeScale(state.shapeScale);
    if (state.densityScale !== undefined) this.setDensityScale(state.densityScale);
    if (state.motionScale !== undefined) this.setMotionScale(state.motionScale);
  }

  reset(): void { this.patchState(DEFAULT_PREFERENCES_STATE.layout); }
}
