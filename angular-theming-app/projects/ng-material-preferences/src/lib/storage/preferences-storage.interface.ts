import { InjectionToken } from '@angular/core';
import { PreferencesState } from '../models/preferences.types';

export interface IPreferencesStorage {
  load(): Partial<PreferencesState> | null;
  save(state: PreferencesState): void;
}

export const PREFERENCES_STORAGE_TOKEN = new InjectionToken<IPreferencesStorage>('PREFERENCES_STORAGE_TOKEN');
export const PREFERENCES_STORAGE_KEY_TOKEN = new InjectionToken<string>('PREFERENCES_STORAGE_KEY_TOKEN');