import { OverlayContainer } from '@angular/cdk/overlay';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PREFERENCES_STORAGE_TOKEN } from '../storage/preferences-storage.interface';
import { ColorEngine } from '../utils/engines/color-engine';
import { DomService } from './dom.service';
import { PreferencesService } from './preferences.service';
import { SnackbarRoleStylesService } from './snackbar-role-styles.service';
import { ThemeSyncService } from './theme-sync.service';

interface Extended {
  id: string;
  label: string;
  color: string;
}

describe('ThemeSyncService → snackbar role styles', () => {
  let extended: ReturnType<typeof signal<Extended[] | undefined>>;
  let colorDomain: ReturnType<typeof signal<boolean>>;
  let sync: jasmine.Spy;

  function setup(options: { colorDomain: boolean; extended?: Extended[] }): void {
    extended = signal(options.extended);
    colorDomain = signal(options.colorDomain);

    const fakePrefs = {
      preferences: computed(() => ({
        color: colorDomain() ? { scheme: 'custom', variant: 'tonal-spot' } : undefined,
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
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ],
    });

    // The engine is not what is under test here.
    spyOn(ColorEngine, 'buildTokens').and.returnValue({} as never);
    sync = spyOn(TestBed.inject(SnackbarRoleStylesService), 'sync');
    TestBed.inject(ThemeSyncService);
    TestBed.tick();
  }

  const brand: Extended = { id: 'brand', label: 'Brand', color: '#ff00aa' };
  const promo: Extended = { id: '2024-promo', label: '2024 Promo', color: '#00ccaa' };

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

  it('end to end: an extended color becomes a real `.snackbar-<id>` rule, and removing it removes the rule', () => {
    setup({ colorDomain: true, extended: [] });
    sync.and.callThrough();

    const hasRule = (selector: string) =>
      document.adoptedStyleSheets.some((sheet) =>
        Array.from(sheet.cssRules).some((rule) => (rule as CSSStyleRule).selectorText === selector),
      );

    extended.set([promo]);
    TestBed.tick();
    expect(hasRule('.snackbar-2024-promo')).toBeTrue();

    extended.set([]);
    TestBed.tick();
    expect(hasRule('.snackbar-2024-promo')).toBeFalse();
  });

  it('does not touch the snackbar styles when the color domain is not active', () => {
    setup({ colorDomain: false, extended: [brand] });
    expect(sync).not.toHaveBeenCalled();
  });
});