import { TestBed } from '@angular/core/testing';
import { ThemeSyncService } from './theme-sync.service';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { PREFERENCES_STORAGE_TOKEN } from '../storage/preferences-storage.interface';
import { signal } from '@angular/core';

describe('ThemeSyncService', () => {
  let mockStorage: any;
  let mockPrefs: any;
  let mockDom: any;

  beforeEach(() => {
    // Mock the dependencies so we aren't triggering real DOM/Storage changes
    mockStorage = {
      load: jasmine.createSpy('load').and.returnValue({ _v: 2, color: { mode: 'dark' } }),
      save: jasmine.createSpy('save')
    };

    mockPrefs = {
      patchState: jasmine.createSpy('patchState'),
      preferences: signal({}), // Dummy state
      resolvedMode: signal('dark'),
      resolvedContrastLevel: signal(0),
      activeCustomColors: signal({ primary: '#000' })
    };

    mockDom = {
      injectCvdFilters: jasmine.createSpy('injectCvdFilters'),
      applyAccessibilityFilters: jasmine.createSpy('applyAccessibilityFilters'),
      applyTypography: jasmine.createSpy('applyTypography'),
      applyShape: jasmine.createSpy('applyShape'),
      applyMotion: jasmine.createSpy('applyMotion'),
      setAttribute: jasmine.createSpy('setAttribute'),
      removeAttribute: jasmine.createSpy('removeAttribute'),
      setColorScheme: jasmine.createSpy('setColorScheme'),
      applyTokens: jasmine.createSpy('applyTokens')
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeSyncService,
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: DomService, useValue: mockDom },
        { provide: PREFERENCES_STORAGE_TOKEN, useValue: mockStorage }
      ]
    });
  });

  it('should load state from storage and patch it during initialization', () => {
    TestBed.inject(ThemeSyncService);
    expect(mockStorage.load).toHaveBeenCalled();
    expect(mockPrefs.patchState).toHaveBeenCalledWith({ _v: 2, color: { mode: 'dark' } });
  });

  // Note: Testing the exact effect() execution requires Angular's ComponentFixture/flush 
  // but just verifying the initialization dependencies is the most crucial structural test.
});