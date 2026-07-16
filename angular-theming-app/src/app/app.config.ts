import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

// Import EVERYTHING from your library!
import {
  PREFERENCES_STORAGE_TOKEN,
  LocalPreferencesStorageService,
  providePreferences,
} from 'ng-material-preferences';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: PREFERENCES_STORAGE_TOKEN,
      useClass: LocalPreferencesStorageService,
    },
    providePreferences(),
  ],
};