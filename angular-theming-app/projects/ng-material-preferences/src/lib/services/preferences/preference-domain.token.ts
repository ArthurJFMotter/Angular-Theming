import { InjectionToken } from '@angular/core';

export type PreferenceDomainKey = 'color' | 'accessibility' | 'typography' | 'layout' | 'notifications';

export interface PreferenceDomain<T = any> {
  readonly key: PreferenceDomainKey;
  getSnapshot(): T;
  patchState(state: Partial<T>): void;
  reset(): void;
}

export const PREFERENCE_DOMAINS = new InjectionToken<PreferenceDomain[]>('PREFERENCE_DOMAINS');