import { Injectable, signal } from '@angular/core';
import { DEFAULT_PREFERENCES_STATE } from '../models/preferences.constants';

@Injectable({ providedIn: 'root' })
export class LayoutPreferencesService {
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
}
