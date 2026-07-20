import { TestBed } from '@angular/core/testing';
import { ColorPreferencesService } from './color-preferences.service';
import { MediaQueryService } from '../media-query.service';
import { signal } from '@angular/core';

describe('ColorPreferencesService', () => {
  let service: ColorPreferencesService;

  // Mock the OS media query service so our tests don't rely on the actual browser window
  const mockMediaQueryService = {
    prefersDark: signal(false),
    prefersHighContrast: signal(false)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ColorPreferencesService,
        { provide: MediaQueryService, useValue: mockMediaQueryService }
      ]
    });
    service = TestBed.inject(ColorPreferencesService);
  });

  it('should initialize with default values', () => {
    expect(service.mode()).toBe('auto');
    expect(service.scheme()).toBe('custom');
    expect(service.customColors().primary).toBe('#3b6fd6'); // Default primary
  });

  it('should update theme mode', () => {
    service.setMode('dark');
    expect(service.mode()).toBe('dark');
  });

  it('should reject invalid hex codes when setting custom colors', () => {
    service.setCustomColors({ primary: 'invalid-color', secondary: '#ff0000' });
    // Primary should remain the default, secondary should update
    expect(service.customColors().primary).toBe('#3b6fd6');
    expect(service.customColors().secondary).toBe('#ff0000');
  });

  it('should enforce a maximum of 5 extended colors', () => {
    for (let i = 1; i <= 6; i++) {
      service.addExtendedColor(`Role ${i}`, '#000000');
    }
    const extended = service.customColors().extended || [];
    expect(extended.length).toBe(5); // The 6th one should be ignored
    expect(extended[0].id).toBe('role-1'); // Tests the ID slugification
  });

  it('should correctly delete extended colors', () => {
    service.addExtendedColor('Brand', '#ff00aa');
    expect(service.customColors().extended?.length).toBe(1);
    
    service.removeExtendedColor('brand');
    expect(service.customColors().extended?.length).toBe(0);
  });
});