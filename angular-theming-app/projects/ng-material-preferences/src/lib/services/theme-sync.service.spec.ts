import { Component, computed, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSyncService } from './theme-sync.service';
import { PreferencesService } from './preferences.service';
import { DomService } from './dom.service';
import { PREFERENCES_STORAGE_TOKEN } from '../storage/preferences-storage.interface';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HIGH_CONTRAST_THRESHOLD } from '../models/preferences.constants';
import { ColorEngine } from '../utils/engines/color-engine';
import { SnackbarRoleStylesService } from './snackbar-role-styles.service';

@Component({ template: '' })
class DummyComponent {
  constructor(public sync: ThemeSyncService) {}
}

/* --- Main Component Test Block with Domains --- */
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
    preferencesSignal = signal({
      color: { scheme: 'custom', variant: 'vibrant' },
    });

    mockPrefs = {
      patchState: jasmine.createSpy(),
      preferences: preferencesSignal,
      resolvedMode: signal('light'),
      resolvedContrastLevel: signal(0),
      activeCustomColors: signal({ primary: '#000' }),
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
      applyTokens: jasmine.createSpy(),
    };

    // Create a stable reference for the classList mock
    mockClassList = {
      add: jasmine.createSpy('add'),
      remove: jasmine.createSpy('remove'),
    };

    mockOverlay = {
      getContainerElement: () => ({ classList: mockClassList }),
    };

    TestBed.configureTestingModule({
      imports: [DummyComponent],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: DomService, useValue: mockDom },
        { provide: PREFERENCES_STORAGE_TOKEN, useValue: mockStorage },
        { provide: OverlayContainer, useValue: mockOverlay },
      ],
    });

    fixture = TestBed.createComponent(DummyComponent);
  });

  it('should strictly branch DOM calls based on active domains', () => {
    fixture.detectChanges(); // Flushes the effect() with just the Color domain!

    // Color
    expect(mockDom.setAttribute).toHaveBeenCalledWith(
      'data-theme-scheme',
      'custom',
    );
    expect(mockDom.applyTokens).toHaveBeenCalled();

    // Missing Domains (Typography, Accessibility, Layout) should NOT be called
    expect(mockDom.applyTypography).not.toHaveBeenCalled();
    expect(mockDom.applyAccessibilityFilters).not.toHaveBeenCalled();
    expect(mockDom.applyMotion).not.toHaveBeenCalled();
  });

  it('should toggle motion-off attribute and overlay class when motionScale is 0', () => {
    // Inject the layout domain with motion set to 0
    preferencesSignal.set({
      layout: { shapeScale: 1, densityScale: 0, motionScale: 0 },
    });
    fixture.detectChanges(); // Flush the effect!

    expect(mockDom.applyMotion).toHaveBeenCalledWith(0);

    // Assert the dual-pronged DOM kill-switches were applied
    expect(mockDom.setAttribute).toHaveBeenCalledWith(
      'data-theme-motion',
      'off',
    );
    expect(mockClassList.add).toHaveBeenCalledWith('theme-motion-off');
  });

  it('should remove motion-off attribute and overlay class when motionScale is nonzero', () => {
    // Inject the layout domain with motion set to 1 (Normal)
    preferencesSignal.set({
      layout: { shapeScale: 1, densityScale: 0, motionScale: 1 },
    });
    fixture.detectChanges(); // Flush the effect!

    expect(mockDom.applyMotion).toHaveBeenCalledWith(1);

    // Assert the dual-pronged DOM kill-switches were removed
    expect(mockDom.removeAttribute).toHaveBeenCalledWith('data-theme-motion');
    expect(mockClassList.remove).toHaveBeenCalledWith('theme-motion-off');
  });

  it('should apply data-theme-contrast attribute exactly at the HIGH_CONTRAST_THRESHOLD', () => {
    // Set the mock contrast level to perfectly match the constant
    mockPrefs.resolvedContrastLevel = signal(HIGH_CONTRAST_THRESHOLD);
    preferencesSignal.set({ color: { scheme: 'custom', variant: 'vibrant' } });

    fixture.detectChanges(); // Flush effect

    expect(mockDom.setAttribute).toHaveBeenCalledWith(
      'data-theme-contrast',
      'high',
    );
  });
});

/* --- Snackbar Dedicated Test Block --- */
interface Extended {
  id: string;
  label: string;
  color: string;
}

describe('ThemeSyncService → snackbar role styles', () => {
  let extended: ReturnType<typeof signal<Extended[] | undefined>>;
  let colorDomain: ReturnType<typeof signal<boolean>>;
  let sync: jasmine.Spy;

  function setup(options: {
    colorDomain: boolean;
    extended?: Extended[];
  }): void {
    extended = signal(options.extended);
    colorDomain = signal(options.colorDomain);

    const fakePrefs = {
      preferences: computed(() => ({
        color: colorDomain()
          ? { scheme: 'custom', variant: 'tonal-spot' }
          : undefined,
      })),
      resolvedMode: () => 'dark',
      resolvedContrastLevel: () => 0,
      activeCustomColors: () => ({ primary: '#6750a4', extended: extended() }),
      patchState: () => {},
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PreferencesService, useValue: fakePrefs },
        {
          provide: DomService,
          useValue: jasmine.createSpyObj('DomService', [
            'setAttribute',
            'removeAttribute',
            'setColorScheme',
            'applyTokens',
          ]),
        },
        { provide: PREFERENCES_STORAGE_TOKEN, useValue: null },
        {
          provide: OverlayContainer,
          useValue: {
            getContainerElement: () => document.createElement('div'),
          },
        },
      ],
    });

    // The engine is not what is under test here.
    spyOn(ColorEngine, 'buildTokens').and.returnValue({} as never);
    sync = spyOn(TestBed.inject(SnackbarRoleStylesService), 'sync');
    TestBed.inject(ThemeSyncService);
    TestBed.tick();
  }

  const brand: Extended = { id: 'brand', label: 'Brand', color: '#ff00aa' };
  const promo: Extended = {
    id: '2024-promo',
    label: '2024 Promo',
    color: '#00ccaa',
  };

  it('syncs the extended color ids when the color domain is active', () => {
    setup({ colorDomain: true, extended: [brand, promo] });
    expect(sync).toHaveBeenCalledWith(['brand', '2024-promo']);
  });

  it('passes an empty list when there are no extended colors', () => {
    setup({ colorDomain: true, extended: undefined });
    expect(sync).toHaveBeenCalledWith([]);
  });

  it('syncs again when a role is added, then removed', () => {
    setup({ colorDomain: true, extended: [brand] });
    sync.calls.reset();

    extended.set([brand, promo]);
    TestBed.tick();
    expect(sync).toHaveBeenCalledWith(['brand', '2024-promo']);

    extended.set([]);
    TestBed.tick();
    expect(sync).toHaveBeenCalledWith([]);
  });

  it('does not touch the snackbar styles when the color domain is not active', () => {
    setup({ colorDomain: false, extended: [brand] });
    expect(sync).not.toHaveBeenCalled();
  });
});
