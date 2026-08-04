import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSyncService } from './theme-sync.service';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { PREFERENCES_STORAGE_TOKEN } from '../storage/preferences-storage.interface';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({ template: '' })
class DummyComponent { constructor(public sync: ThemeSyncService) {} }

describe('ThemeSyncService', () => {
  let mockStorage: any;
  let mockPrefs: any;
  let mockDom: any;
  let mockOverlay: any;
  let mockClassList: any;
  let fixture: ComponentFixture<DummyComponent>;
  let preferencesSignal: WritableSignal<any>;

  beforeEach(() => {
    mockStorage = { load: jasmine.createSpy(), save: jasmine.createSpy() };
    
    // Extract the signal so we can easily change the state in individual tests
    preferencesSignal = signal({ color: { scheme: 'custom', variant: 'vibrant' } });

    mockPrefs = {
      patchState: jasmine.createSpy(),
      preferences: preferencesSignal,
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

    // Create a stable reference for the classList mock
    mockClassList = {
      add: jasmine.createSpy('add'),
      remove: jasmine.createSpy('remove')
    };

    mockOverlay = {
      getContainerElement: () => ({ classList: mockClassList })
    };

    TestBed.configureTestingModule({
      imports: [DummyComponent],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: DomService, useValue: mockDom },
        { provide: PREFERENCES_STORAGE_TOKEN, useValue: mockStorage },
        { provide: OverlayContainer, useValue: mockOverlay }
      ]
    });

    fixture = TestBed.createComponent(DummyComponent);
  });

  it('should strictly branch DOM calls based on active domains', () => {
    fixture.detectChanges(); // Flushes the effect() with just the Color domain!

    // Color
    expect(mockDom.setAttribute).toHaveBeenCalledWith('data-theme-scheme', 'custom');
    expect(mockDom.applyTokens).toHaveBeenCalled();

    // Missing Domains (Typography, Accessibility, Layout) should NOT be called
    expect(mockDom.applyTypography).not.toHaveBeenCalled();
    expect(mockDom.applyAccessibilityFilters).not.toHaveBeenCalled();
    expect(mockDom.applyMotion).not.toHaveBeenCalled();
  });

  it('should toggle motion-off attribute and overlay class when motionScale is 0', () => {
    // Inject the layout domain with motion set to 0
    preferencesSignal.set({ layout: { shapeScale: 1, densityScale: 0, motionScale: 0 } });
    fixture.detectChanges(); // Flush the effect!

    expect(mockDom.applyMotion).toHaveBeenCalledWith(0);
    
    // Assert the dual-pronged DOM kill-switches were applied
    expect(mockDom.setAttribute).toHaveBeenCalledWith('data-theme-motion', 'off');
    expect(mockClassList.add).toHaveBeenCalledWith('theme-motion-off');
  });

  it('should remove motion-off attribute and overlay class when motionScale is nonzero', () => {
    // Inject the layout domain with motion set to 1 (Normal)
    preferencesSignal.set({ layout: { shapeScale: 1, densityScale: 0, motionScale: 1 } });
    fixture.detectChanges(); // Flush the effect!

    expect(mockDom.applyMotion).toHaveBeenCalledWith(1);
    
    // Assert the dual-pronged DOM kill-switches were removed
    expect(mockDom.removeAttribute).toHaveBeenCalledWith('data-theme-motion');
    expect(mockClassList.remove).toHaveBeenCalledWith('theme-motion-off');
  });
});