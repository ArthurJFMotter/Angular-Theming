import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { PREFERENCES_STORAGE_TOKEN } from './core/storage/preferences-storage.interface';
import { LocalPreferencesStorageService } from './core/storage/local-preferences-storage.service';
import { AccessibilityPreferencesService } from './core/services/accessibility-preferences.service';
import { ColorPreferencesService } from './core/services/color-preferences.service';
import { LayoutPreferencesService } from './core/services/layout-preferences.service';
import { NotificationPreferencesService } from './core/services/notification-preferences.service';
import { TypographyPreferencesService } from './core/services/typography-preferences.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: PREFERENCES_STORAGE_TOKEN,
      useClass: LocalPreferencesStorageService,
    },
    ColorPreferencesService,
    AccessibilityPreferencesService,
    TypographyPreferencesService,
    LayoutPreferencesService,
    NotificationPreferencesService,
  ],
};
