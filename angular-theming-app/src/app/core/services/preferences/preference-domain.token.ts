import { InjectionToken } from '@angular/core';

export interface PreferenceDomain<T = any> {
  readonly key: string;
  getSnapshot(): T;
  patchState(state: Partial<T>): void;
  reset(): void;
}

export const PREFERENCE_DOMAINS = new InjectionToken<PreferenceDomain[]>('PREFERENCE_DOMAINS');