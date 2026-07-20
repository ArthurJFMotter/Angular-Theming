import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import { providePreferences } from './preferences.providers';
import { ColorPreferencesService } from './color-preferences.service';
import { NoopFontLoaderStrategy } from './font-loader.strategy';

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
});