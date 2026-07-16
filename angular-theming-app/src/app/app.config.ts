import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

import {
  PREFERENCES_STORAGE_TOKEN,
  LocalPreferencesStorageService,
  providePreferences,
  PreferencesState,
} from 'ng-material-preferences';

// Define YOUR APP's specific migration logic here!
const legacyMigrationFn = (parsed: any): Partial<PreferencesState> => {
  const isV2 = parsed._v === 2 || !!parsed.color;
  if (isV2) return parsed;

  // Map V1 flat structure to V2 nested structure
  return {
    _v: 2,
    color: {
      mode: parsed.mode,
      autoContrast: parsed.autoContrast,
      contrastLevel: parsed.contrastLevel,
      scheme: parsed.scheme,
      variant: parsed.variant,
      customColors: parsed.customColors,
      savedProfiles: parsed.savedProfiles,
    },
    accessibility: {
      cvd: parsed.cvd,
      cvdSeverity: parsed.cvdSeverity,
      cvdIntent: parsed.cvdIntent,
      screenFilter: parsed.screenFilter,
      screenFilterIntensity: parsed.screenFilterIntensity,
    },
    typography: {
      headingFontFamily: parsed.headingFontFamily || parsed.fontFamily,
      bodyFontFamily: parsed.bodyFontFamily || parsed.fontFamily,
      fontScale: parsed.fontScale,
    },
    layout: {
      shapeScale: parsed.shapeScale,
      densityScale: parsed.densityScale,
      motionScale: parsed.motionScale,
    },
    notifications: {
      snackbarHPosition: parsed.snackbarHPosition,
      snackbarVPosition: parsed.snackbarVPosition,
    },
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: PREFERENCES_STORAGE_TOKEN,
      useClass: LocalPreferencesStorageService,
    },
    providePreferences({
      migrationStrategy: legacyMigrationFn,
    }),
  ],
};
