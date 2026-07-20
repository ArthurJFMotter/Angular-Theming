import { TestBed } from '@angular/core/testing';
import { LayoutPreferencesService } from './layout-preferences.service';

describe('LayoutPreferencesService', () => {
  let service: LayoutPreferencesService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LayoutPreferencesService] });
    service = TestBed.inject(LayoutPreferencesService);
  });

  it('should snapshot and patch state safely', () => {
    service.patchState({ shapeScale: 2, motionScale: 0 });
    const snap = service.getSnapshot();
    expect(snap.shapeScale).toBe(2);
    expect(snap.motionScale).toBe(0);
    expect(snap.densityScale).toBe(0); // Untouched default
  });

  it('should reset to defaults', () => {
    service.setDensityScale(-3);
    service.reset();
    expect(service.densityScale()).toBe(0);
  });
});