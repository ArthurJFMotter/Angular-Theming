import { Provider } from '@angular/core';
import { PREFERENCE_DOMAINS } from './preference-domain.token';
import { AccessibilityPreferencesService } from './accessibility-preferences.service';
import { ColorPreferencesService } from './color-preferences.service';
import { LayoutPreferencesService } from './layout-preferences.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { TypographyPreferencesService } from './typography-preferences.service';

// Individual Domain Providers
export function provideColorPreferences(): Provider[] {
  return [ColorPreferencesService, { provide: PREFERENCE_DOMAINS, useExisting: ColorPreferencesService, multi: true }];
}

export function provideAccessibilityPreferences(): Provider[] {
  return [AccessibilityPreferencesService, { provide: PREFERENCE_DOMAINS, useExisting: AccessibilityPreferencesService, multi: true }];
}

export function provideTypographyPreferences(): Provider[] {
  return [TypographyPreferencesService, { provide: PREFERENCE_DOMAINS, useExisting: TypographyPreferencesService, multi: true }];
}

export function provideLayoutPreferences(): Provider[] {
  return [LayoutPreferencesService, { provide: PREFERENCE_DOMAINS, useExisting: LayoutPreferencesService, multi: true }];
}

export function provideNotificationPreferences(): Provider[] {
  return [NotificationPreferencesService, { provide: PREFERENCE_DOMAINS, useExisting: NotificationPreferencesService, multi: true }];
}

// Master Provider (For apps that want everything)
export function provideAllThemingPreferences(): Provider[] {
  return [
    provideColorPreferences(),
    provideAccessibilityPreferences(),
    provideTypographyPreferences(),
    provideLayoutPreferences(),
    provideNotificationPreferences()
  ];
}