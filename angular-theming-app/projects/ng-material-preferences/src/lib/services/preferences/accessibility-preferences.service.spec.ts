import { TestBed } from '@angular/core/testing';
import { AccessibilityPreferencesService } from './accessibility-preferences.service';

describe('AccessibilityPreferencesService', () => {
  let service: AccessibilityPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessibilityPreferencesService]
    });
    service = TestBed.inject(AccessibilityPreferencesService);
  });

  it('should initialize with defaults', () => {
    expect(service.cvd()).toBe('none');
    expect(service.cvdSeverity()).toBe(100);
  });

  it('should take a snapshot matching the interface', () => {
    service.setCvdMode('protanopia');
    service.setScreenFilter('glare');
    
    const snapshot = service.getSnapshot();
    expect(snapshot.cvd).toBe('protanopia');
    expect(snapshot.screenFilter).toBe('glare');
  });

  it('should patch state selectively', () => {
    // Only patch severity, leave the rest alone
    service.patchState({ cvdSeverity: 50 });
    
    expect(service.cvdSeverity()).toBe(50);
    expect(service.cvd()).toBe('none'); // Unchanged
  });

  it('should reset back to defaults', () => {
    service.setCvdMode('tritanopia');
    service.reset();
    expect(service.cvd()).toBe('none');
  });
});