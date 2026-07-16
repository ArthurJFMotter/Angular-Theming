import { Injectable, Inject, Optional } from '@angular/core';
import { IPreferencesStorage, PREFERENCES_STORAGE_KEY_TOKEN } from './preferences-storage.interface';
import { PreferencesState } from '../models/preferences.types';

@Injectable({ providedIn: 'root' })
export class LocalPreferencesStorageService implements IPreferencesStorage {
  private readonly storageKey: string;

  // Inject the token, fallback to a safe default if not provided
  constructor(@Optional() @Inject(PREFERENCES_STORAGE_KEY_TOKEN) key: string | null) {
    this.storageKey = key || 'ng-material-theming.prefs'; 
  }

  load(): Partial<PreferencesState> | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<PreferencesState>;
    } catch {
      return null;
    }
  }

  save(state: PreferencesState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage', e);
    }
  }
}