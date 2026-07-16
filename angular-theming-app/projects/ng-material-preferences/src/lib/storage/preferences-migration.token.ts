import { InjectionToken } from '@angular/core';
import { PreferencesState } from '../models/preferences.types';

/** A function that takes unknown raw storage data and maps it to the current PreferencesState */
export type PreferencesMigrationFn = (rawSavedData: any) => Partial<PreferencesState>;

export const PREFERENCES_MIGRATION_TOKEN = new InjectionToken<PreferencesMigrationFn>('PREFERENCES_MIGRATION_TOKEN');