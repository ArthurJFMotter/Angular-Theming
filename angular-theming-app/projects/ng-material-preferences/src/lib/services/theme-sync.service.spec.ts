import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSyncService } from './theme-sync.service';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { PREFERENCES_STORAGE_TOKEN } from '../storage/preferences-storage.interface';

// Dummy component to trigger Angular's effect() execution
@Component({ template: '' })
class DummyComponent { constructor(public sync: ThemeSyncService) {} }

describe('ThemeSyncService', () => {
  let mockStorage: any;
  let mockPrefs: any;
  let mockDom: any;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(() => {
    mockStorage = { load: jasmine.createSpy(), save: jasmine.createSpy() };
    
    // We mock the state to ONLY include the "color" domain
    mockPrefs = {
      patchState: jasmine.createSpy(),
      preferences: signal({ color: { scheme: 'custom', variant: 'vibrant' } }),
      resolvedMode: signal('light'),
      resolvedContrastLevel: signal(0),
      activeCustomColors: signal({ primary: '#000' })
    };

    mockDom = {
      injectCvdFilters: jasmine.createSpy(),
      applyAccessibilityFilters: jasmine.createSpy(),
      applyTypography: jasmine.createSpy(),
      applyShape: jasmine.createSpy(),
      applyMotion: jasmine.createSpy(),
      setAttribute: jasmine.createSpy(),
      removeAttribute: jasmine.createSpy(),
      setColorScheme: jasmine.createSpy(),
      applyTokens: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      imports: [DummyComponent],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: DomService, useValue: mockDom },
        { provide: PREFERENCES_STORAGE_TOKEN, useValue: mockStorage }
      ]
    });

    fixture = TestBed.createComponent(DummyComponent);
  });

  it('should strictly branch DOM calls based on active domains', () => {
    fixture.detectChanges(); // Flushes the effect()!

    // Color domain WAS present, so Color-related DOM methods should have been called
    expect(mockDom.setAttribute).toHaveBeenCalledWith('data-theme-scheme', 'custom');
    expect(mockDom.applyTokens).toHaveBeenCalled();

    // Typography & Layout domains were NOT present in the signal state.
    // They MUST NOT be called!
    expect(mockDom.applyTypography).not.toHaveBeenCalled();
    expect(mockDom.applyShape).not.toHaveBeenCalled();
    expect(mockDom.applyMotion).not.toHaveBeenCalled();
    expect(mockDom.applyAccessibilityFilters).not.toHaveBeenCalled();
  });
});