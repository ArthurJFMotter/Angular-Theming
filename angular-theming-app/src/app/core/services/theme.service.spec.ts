import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { THEME_STORAGE_KEY } from '../models/theme.model';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme-mode');
    document.documentElement.removeAttribute('data-theme-scheme');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should default to light mode and the blue scheme', () => {
    expect(service.mode()).toBe('light');
    expect(service.scheme()).toBe('blue');
  });

  it('should update the mode signal and reflect it on <html>', () => {
    service.setMode('dark');

    expect(service.mode()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
  });

  it('should update the scheme signal and reflect it on <html>', () => {
    service.setScheme('purple');

    expect(service.scheme()).toBe('purple');
    expect(document.documentElement.getAttribute('data-theme-scheme')).toBe('purple');
  });

  it('should toggle between light and dark', () => {
    expect(service.mode()).toBe('light');

    service.toggleMode();
    expect(service.mode()).toBe('dark');

    service.toggleMode();
    expect(service.mode()).toBe('light');
  });

  it('should persist theme changes to localStorage', () => {
    service.setMode('dark');
    service.setScheme('green');

    const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? '{}');
    expect(stored.mode).toBe('dark');
    expect(stored.scheme).toBe('green');
  });

  it('should restore a previously saved theme on initialization', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark', scheme: 'purple' }));

    // Re-create the service so its constructor reads the seeded storage value.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restoredService = TestBed.inject(ThemeService);

    expect(restoredService.mode()).toBe('dark');
    expect(restoredService.scheme()).toBe('purple');
  });

  it('should fall back to default custom colors when restoring data saved before this feature existed', () => {
    // Pre-feature shape: no `customColors` key at all.
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'light', scheme: 'green' }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restoredService = TestBed.inject(ThemeService);

    expect(restoredService.scheme()).toBe('green');
    expect(restoredService.customColors().primary).toBeDefined();
  });

  it('should ignore corrupt localStorage data and fall back to defaults', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '{not-valid-json');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fallbackService = TestBed.inject(ThemeService);

    expect(fallbackService.mode()).toBe('light');
    expect(fallbackService.scheme()).toBe('blue');
  });

  it('should switch to the custom scheme and apply inline color tokens when setCustomColors is called', () => {
    service.setCustomColors({ primary: '#ff0000' });

    expect(service.scheme()).toBe('custom');
    expect(service.customColors().primary).toBe('#ff0000');

    const primaryToken = document.documentElement.style.getPropertyValue('--mat-sys-primary');
    expect(primaryToken).not.toBe('');
  });

  it('should reject an invalid hex value for primary and keep the previous color', () => {
    service.setCustomColors({ primary: '#3b6fd6' });
    service.setCustomColors({ primary: 'not-a-color' });

    expect(service.customColors().primary).toBe('#3b6fd6');
  });

  it('should clear an optional role back to auto-derived', () => {
    service.setCustomColors({ primary: '#3b6fd6', secondary: '#ff00ff' });
    expect(service.customColors().secondary).toBe('#ff00ff');

    service.clearCustomColorRole('secondary');
    expect(service.customColors().secondary).toBeUndefined();
  });

  it('should remove inline color tokens when switching from custom back to a preset', () => {
    service.setCustomColors({ primary: '#ff0000' });
    expect(document.documentElement.style.getPropertyValue('--mat-sys-primary')).not.toBe('');

    service.setScheme('blue');
    expect(document.documentElement.style.getPropertyValue('--mat-sys-primary')).toBe('');
  });

  it('should persist custom colors to localStorage', () => {
    service.setCustomColors({ primary: '#abcdef', secondary: '#123456' });

    const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? '{}');
    expect(stored.customColors.primary).toBe('#abcdef');
    expect(stored.customColors.secondary).toBe('#123456');
  });
});
