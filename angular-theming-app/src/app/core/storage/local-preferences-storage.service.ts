import { Injectable } from '@angular/core';
import { IPreferencesStorage } from './preferences-storage.interface';
import { PreferencesState } from '../models/preferences.types';
import { PREFERENCES_STORAGE_KEY } from '../models/preferences.constants';

@Injectable({ providedIn: 'root' })
export class LocalPreferencesStorageService implements IPreferencesStorage {
  load(): Partial<PreferencesState> | null {
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<PreferencesState>;
    } catch {
      return null;
    }
  }

  save(state: PreferencesState): void {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage', e);
    }
  }
}
