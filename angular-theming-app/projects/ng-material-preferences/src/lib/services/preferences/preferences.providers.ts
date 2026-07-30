import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { PREFERENCE_DOMAINS } from './preference-domain.token';
import { AccessibilityPreferencesService } from './accessibility-preferences.service';
import { ColorPreferencesService } from './color-preferences.service';
import { LayoutPreferencesService } from './layout-preferences.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { TypographyPreferencesService } from './typography-preferences.service';
import { ThemeSyncService } from '../theme-sync.service';
import { LocalPreferencesStorageService } from '../../storage/local-preferences-storage.service';
import { PREFERENCES_STORAGE_KEY_TOKEN, PREFERENCES_STORAGE_TOKEN } from '../../storage/preferences-storage.interface';
import { PREFERENCES_MIGRATION_TOKEN, PreferencesMigrationFn } from '../../storage/preferences-migration.token';
import {
  FONT_LOADER_STRATEGY,
  NoopFontLoaderStrategy,
  GoogleFontLoaderStrategy,
} from './font-loader.strategy';

// Individual Domain Providers
export function provideColorPreferences(): Provider[] {
  return [
    ColorPreferencesService,
    {
      provide: PREFERENCE_DOMAINS,
      useExisting: ColorPreferencesService,
      multi: true,
    },
  ];
}

export function provideAccessibilityPreferences(): Provider[] {
  return [
    AccessibilityPreferencesService,
    {
      provide: PREFERENCE_DOMAINS,
      useExisting: AccessibilityPreferencesService,
      multi: true,
    },
  ];
}

export function provideTypographyPreferences(): Provider[] {
  return [
    TypographyPreferencesService,
    {
      provide: PREFERENCE_DOMAINS,
      useExisting: TypographyPreferencesService,
      multi: true,
    },
    { provide: FONT_LOADER_STRATEGY, useClass: GoogleFontLoaderStrategy },
  ];
}

export function provideLayoutPreferences(): Provider[] {
  return [
    LayoutPreferencesService,
    {
      provide: PREFERENCE_DOMAINS,
      useExisting: LayoutPreferencesService,
      multi: true,
    },
  ];
}

export function provideNotificationPreferences(): Provider[] {
  return [
    NotificationPreferencesService,
    {
      provide: PREFERENCE_DOMAINS,
      useExisting: NotificationPreferencesService,
      multi: true,
    },
  ];
}

// Master Provider (For apps that want everything)
export function provideAllThemingPreferences(): Provider[] {
  return [
    provideColorPreferences(),
    provideAccessibilityPreferences(),
    provideTypographyPreferences(),
    provideLayoutPreferences(),
    provideNotificationPreferences(),
  ];
}

export interface ThemingConfig {
  // Domain toggles
  color?: boolean;
  accessibility?: boolean;
  typography?: boolean;
  layout?: boolean;
  notifications?: boolean;

  // Side-effect Boundaries
  storageKey?: string;
  disableRemoteFonts?: boolean;
  
  /** Provide a function to migrate legacy local storage data to the current schema */
  migrationStrategy?: PreferencesMigrationFn;
}

export function providePreferences(config: ThemingConfig = {}): Provider[] {
  const providers: Provider[] = [];
  
  // Register Domains
  if (config.color !== false) providers.push(...provideColorPreferences());
  if (config.accessibility !== false) providers.push(...provideAccessibilityPreferences());
  if (config.typography !== false) providers.push(...provideTypographyPreferences());
  if (config.layout !== false) providers.push(...provideLayoutPreferences());
  if (config.notifications !== false) providers.push(...provideNotificationPreferences());

  // Default Storage Boundary (Zero-config fallback!)
  // Consumers can still override this by providing their own PREFERENCES_STORAGE_TOKEN in their app.config.ts
  providers.push({ provide: PREFERENCES_STORAGE_TOKEN, useClass: LocalPreferencesStorageService });

  if (config.storageKey) {
    providers.push({ provide: PREFERENCES_STORAGE_KEY_TOKEN, useValue: config.storageKey });
  }
  
  if (config.migrationStrategy) {
    providers.push({ provide: PREFERENCES_MIGRATION_TOKEN, useValue: config.migrationStrategy });
  }

  // Configure Font Loading Strategy Override
  if (config.disableRemoteFonts) {
    providers.push({ provide: FONT_LOADER_STRATEGY, useClass: NoopFontLoaderStrategy });
  }

  // This automatically wakes up the ThemeSyncService so the consumer doesn't have to!
  providers.push({
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => inject(ThemeSyncService)
  });

  providers.push({
    provide: MAT_RIPPLE_GLOBAL_OPTIONS,
    useFactory: (): RippleGlobalOptions => {
      const layout = inject(LayoutPreferencesService, { optional: true });
      
      return {
        get disabled() { 
          return layout ? layout.motionScale() === 0 : false; 
        },
        get animation() {
          const scale = layout ? layout.motionScale() : 1;
          return {
            enterDuration: 450 * scale, // Normal is 450ms, Fast is 225ms
            exitDuration: 400 * scale
          };
        }
      };
    }
  });

  return providers;
}