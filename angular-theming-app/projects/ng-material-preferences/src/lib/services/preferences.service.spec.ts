import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';
import { PREFERENCE_DOMAINS } from './preferences/preference-domain.token';
import { PREFERENCES_MIGRATION_TOKEN } from '../storage/preferences-migration.token';
import { TypographyPreferencesService } from './preferences/typography-preferences.service';

describe('PreferencesService Facade', () => {
  let service: PreferencesService;

  describe('With no domains provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [PreferencesService]
        // Note: We intentionally DO NOT provide any domains here!
      });
      service = TestBed.inject(PreferencesService);
    });

    it('should report false for all capability flags', () => {
      expect(service.hasColor).toBeFalse();
      expect(service.hasTypography).toBeFalse();
    });

    it('should safely return fallback signals without crashing', () => {
      expect(service.headingFontFamily()).toBe('Roboto');
    });

    it('should safely swallow setter calls without crashing', () => {
      expect(() => service.setHeadingFontFamily('Oswald')).not.toThrow();
    });
  });

  describe('With Migration Strategy', () => {
    const mockMigration = jasmine.createSpy('migrationFn').and.callFake((raw: any) => {
      if (raw.crashMe) throw new Error('Boom');
      return { _v: 2, typography: { headingFontFamily: 'MigratedFont', bodyFontFamily: 'MigratedFont', fontScale: 1 } };
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          PreferencesService,
          TypographyPreferencesService,
          { provide: PREFERENCE_DOMAINS, useExisting: TypographyPreferencesService, multi: true },
          { provide: PREFERENCES_MIGRATION_TOKEN, useValue: mockMigration }
        ]
      });
      service = TestBed.inject(PreferencesService);
    });

    it('should apply the migration function when patching state', () => {
      service.patchState({ oldFlatFont: 'Times New Roman' });
      expect(mockMigration).toHaveBeenCalled();
      expect(service.headingFontFamily()).toBe('MigratedFont');
    });

    it('should gracefully catch migration errors and fall back to defaults', () => {
      // Temporarily suppress console.error so it doesn't clutter our test output
      spyOn(console, 'error'); 
      
      expect(() => service.patchState({ crashMe: true })).not.toThrow();
      expect(console.error).toHaveBeenCalled();
      // Should fall back to the default fallback signal value
      expect(service.headingFontFamily()).toBe('Roboto'); 
    });
  });

  describe('Safety & Reset Logic', () => {
    it('should reset all registered domains', () => {
      const mockDomain = { key: 'test', getSnapshot: () => ({}), patchState: () => {}, reset: jasmine.createSpy('reset') };
      TestBed.configureTestingModule({
        providers: [PreferencesService, { provide: PREFERENCE_DOMAINS, useValue: mockDomain, multi: true }]
      });
      const srv = TestBed.inject(PreferencesService);
      srv.resetToDefaults();
      expect(mockDomain.reset).toHaveBeenCalled();
    });

    it('should warn in dev mode if state data exists but no matching domains are found', () => {
      spyOn(console, 'warn');
      TestBed.configureTestingModule({ providers: [PreferencesService] });
      const srv = TestBed.inject(PreferencesService);
      
      // Pass V1 data with no migration strategy provided
      srv.patchState({ mode: 'dark', fontFamily: 'Arial' });
      expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching(/do not match the expected nested schema/));
    });
  });
});