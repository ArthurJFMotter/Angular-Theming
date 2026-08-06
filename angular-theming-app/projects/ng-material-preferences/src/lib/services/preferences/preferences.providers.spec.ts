import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import {
  providePreferences,
  provideTypographyPreferences,
} from './preferences.providers';
import { ColorPreferencesService } from './color-preferences.service';
import {
  GoogleFontLoaderStrategy,
  NoopFontLoaderStrategy,
} from './font-loader.strategy';
import { PREFERENCES_MIGRATION_TOKEN } from '../../storage/preferences-migration.token';
import {
  PREFERENCES_STORAGE_KEY_TOKEN,
  PREFERENCES_STORAGE_TOKEN,
} from '../../storage/preferences-storage.interface';
import { TestBed } from '@angular/core/testing';
import { LayoutPreferencesService } from './layout-preferences.service';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { LocalPreferencesStorageService } from '../../storage/local-preferences-storage.service';

describe('Preferences Providers', () => {
  it('should include all domains by default', () => {
    const providers = providePreferences();
    const hasColor = providers.some((p: any) => p === ColorPreferencesService);
    expect(hasColor).toBeTrue();
  });

  it('should omit domains when explicitly set to false', () => {
    const providers = providePreferences({ color: false });
    const hasColor = providers.some((p: any) => p === ColorPreferencesService);
    expect(hasColor).toBeFalse();
  });

  it('should apply the NoopFontLoaderStrategy when remote fonts are disabled', () => {
    const providers = providePreferences({ disableRemoteFonts: true });
    const fontStrategy = providers.find(
      (p: any) => p.useClass === NoopFontLoaderStrategy,
    );
    expect(fontStrategy).toBeTruthy();
  });

  it('should ALWAYS include the ThemeSyncService auto-starter', () => {
    const providers = providePreferences({
      color: false,
      typography: false,
      layout: false,
      accessibility: false,
      notifications: false,
    });
    const hasInitializer = providers.some(
      (p: any) => p.provide === ENVIRONMENT_INITIALIZER,
    );
    expect(hasInitializer).toBeTrue();
  });

  it('should include the GoogleFontLoaderStrategy by default in granular typography providers', () => {
    const providers = provideTypographyPreferences();
    const fontStrategy = providers.find(
      (p: any) => p.useClass === GoogleFontLoaderStrategy,
    );
    expect(fontStrategy).toBeTruthy();
  });

  it('should wire the storage key token when provided in the config', () => {
    const providers = providePreferences({ storageKey: 'test-key' });
    const keyProvider = providers.find(
      (p: any) => p.provide === PREFERENCES_STORAGE_KEY_TOKEN,
    );
    expect((keyProvider as any).useValue).toBe('test-key');
  });

  it('should wire the migration strategy token when provided in the config', () => {
    const mockFn = () => ({});
    const providers = providePreferences({ migrationStrategy: mockFn });
    const migrationProvider = providers.find(
      (p: any) => p.provide === PREFERENCES_MIGRATION_TOKEN,
    );
    expect((migrationProvider as any).useValue).toBe(mockFn);
  });

  it('should auto-register the LocalPreferencesStorageService by default', () => {
    const providers = providePreferences();
    const storageProvider = providers.find(
      (p: any) => p.provide === PREFERENCES_STORAGE_TOKEN,
    );
    expect(storageProvider).toBeTruthy();
    expect((storageProvider as any).useClass).toBe(
      LocalPreferencesStorageService,
    );
  });

  describe('MAT_RIPPLE_GLOBAL_OPTIONS Factory', () => {
    it('should completely disable ripples when motionScale is 0', () => {
      TestBed.configureTestingModule({
        providers: [
          providePreferences(),
          
          // IMPORTANT: This mock MUST be placed after providePreferences() in the array.
          // Angular DI resolves non-multi tokens using "last provider wins". This allows 
          // us to override the real LayoutPreferencesService that was registered above.
          { provide: LayoutPreferencesService, useValue: { motionScale: () => 0 } }
        ]
      });
      
      const rippleOpts = TestBed.inject(MAT_RIPPLE_GLOBAL_OPTIONS) as RippleGlobalOptions;
      expect(rippleOpts.disabled).toBeTrue();
    });

    it('should scale ripple duration proportionally when motionScale is adjusted', () => {
      TestBed.configureTestingModule({
        providers: [
          providePreferences(),
          
          // IMPORTANT: This mock MUST be placed after providePreferences() in the array.
          // Angular DI resolves non-multi tokens using "last provider wins".
          { provide: LayoutPreferencesService, useValue: { motionScale: () => 0.5 } }
        ]
      });
      
      const rippleOpts = TestBed.inject(MAT_RIPPLE_GLOBAL_OPTIONS) as RippleGlobalOptions;
      expect(rippleOpts.disabled).toBeFalse();
      
      // Standard is 450/400. At 0.5x scale, it should be 225/200.
      expect(rippleOpts.animation?.enterDuration).toBe(225);
      expect(rippleOpts.animation?.exitDuration).toBe(200);
    });
  });
});
