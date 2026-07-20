import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import { providePreferences, provideTypographyPreferences } from './preferences.providers';
import { ColorPreferencesService } from './color-preferences.service';
import { GoogleFontLoaderStrategy, NoopFontLoaderStrategy } from './font-loader.strategy';
import { PREFERENCES_MIGRATION_TOKEN } from '../../storage/preferences-migration.token';
import { PREFERENCES_STORAGE_KEY_TOKEN } from '../../storage/preferences-storage.interface';

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
    const fontStrategy = providers.find((p: any) => p.useClass === NoopFontLoaderStrategy);
    expect(fontStrategy).toBeTruthy();
  });

  it('should ALWAYS include the ThemeSyncService auto-starter', () => {
    const providers = providePreferences({ color: false, typography: false, layout: false, accessibility: false, notifications: false });
    const hasInitializer = providers.some((p: any) => p.provide === ENVIRONMENT_INITIALIZER);
    expect(hasInitializer).toBeTrue();
  });

  it('should include the GoogleFontLoaderStrategy by default in granular typography providers', () => {
    const providers = provideTypographyPreferences();
    const fontStrategy = providers.find((p: any) => p.useClass === GoogleFontLoaderStrategy);
    expect(fontStrategy).toBeTruthy();
  });

  it('should wire the storage key token when provided in the config', () => {
    const providers = providePreferences({ storageKey: 'test-key' });
    const keyProvider = providers.find((p: any) => p.provide === PREFERENCES_STORAGE_KEY_TOKEN);
    expect((keyProvider as any).useValue).toBe('test-key');
  });

  it('should wire the migration strategy token when provided in the config', () => {
    const mockFn = () => ({});
    const providers = providePreferences({ migrationStrategy: mockFn });
    const migrationProvider = providers.find((p: any) => p.provide === PREFERENCES_MIGRATION_TOKEN);
    expect((migrationProvider as any).useValue).toBe(mockFn);
  });
});