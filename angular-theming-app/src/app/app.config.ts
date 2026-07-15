import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { PREFERENCES_STORAGE_TOKEN } from './core/storage/preferences-storage.interface';
import { LocalPreferencesStorageService } from './core/storage/local-preferences-storage.service';
import { provideAllThemingPreferences } from './core/services/preferences/preferences.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: PREFERENCES_STORAGE_TOKEN,
      useClass: LocalPreferencesStorageService,
    },
    provideAllThemingPreferences(),
  ],
};
