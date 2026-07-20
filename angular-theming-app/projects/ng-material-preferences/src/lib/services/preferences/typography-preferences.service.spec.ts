import { TestBed } from '@angular/core/testing';
import { TypographyPreferencesService } from './typography-preferences.service';

describe('TypographyPreferencesService', () => {
  let service: TypographyPreferencesService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TypographyPreferencesService] });
    service = TestBed.inject(TypographyPreferencesService);
  });

  it('should snapshot and patch state safely', () => {
    service.patchState({ headingFontFamily: 'Oswald', fontScale: 1.2 });
    const snap = service.getSnapshot();
    expect(snap.headingFontFamily).toBe('Oswald');
    expect(snap.bodyFontFamily).toBe('Roboto'); // Default
    expect(snap.fontScale).toBe(1.2);
  });

  it('should reset back to defaults', () => {
    service.setHeadingFontFamily('Comic Sans');
    service.reset();
    expect(service.headingFontFamily()).toBe('Roboto');
  });
});