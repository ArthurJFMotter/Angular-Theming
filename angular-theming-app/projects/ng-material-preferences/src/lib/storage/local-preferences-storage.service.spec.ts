import { TestBed } from '@angular/core/testing';
import { LocalPreferencesStorageService } from './local-preferences-storage.service';
import { PREFERENCES_STORAGE_KEY_TOKEN } from './preferences-storage.interface';

describe('LocalPreferencesStorageService', () => {
  let service: LocalPreferencesStorageService;

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
  });

  describe('With default storage key', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [LocalPreferencesStorageService]
      });
      service = TestBed.inject(LocalPreferencesStorageService);
    });

    it('should use the default storage key when loading', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      service.load();
      expect(localStorage.getItem).toHaveBeenCalledWith('ng-material-theming.prefs');
    });

    it('should parse valid JSON from storage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('{"_v": 2, "color": {"mode": "dark"}}');
      const result = service.load();
      expect(result?.color?.mode).toBe('dark');
    });

    it('should safely return null on corrupted JSON', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('not-valid-json');
      const result = service.load();
      expect(result).toBeNull(); // Should catch the error and not crash!
    });
  });

  describe('With custom storage key', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          LocalPreferencesStorageService,
          { provide: PREFERENCES_STORAGE_KEY_TOKEN, useValue: 'my-custom-key' }
        ]
      });
      service = TestBed.inject(LocalPreferencesStorageService);
    });

    it('should save using the custom provided key', () => {
      service.save({ _v: 2 } as any);
      expect(localStorage.setItem).toHaveBeenCalledWith('my-custom-key', '{"_v":2}');
    });
  });
});