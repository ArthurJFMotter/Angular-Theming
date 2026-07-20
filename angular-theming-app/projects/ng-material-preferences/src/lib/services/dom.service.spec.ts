import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { DomService } from './dom.service';
import { FONT_LOADER_STRATEGY } from './preferences/font-loader.strategy';

describe('DomService', () => {
  let service: DomService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomService]
    });
    service = TestBed.inject(DomService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    // Clean up DOM mutations after each test
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('data-theme-mode');
    const motionStyle = document.getElementById('theme-motion-override');
    if (motionStyle) motionStyle.remove();
  });

  it('should apply CSS tokens to the root element', () => {
    service.applyTokens({ 'test-color': '#ffffff' });
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--mat-sys-test-color')).toBe('#ffffff');
  });

  it('should inject motion override styles when motion is disabled', () => {
    service.applyMotion(0); // 0 = Off
    const styleEl = document.getElementById('theme-motion-override');
    expect(styleEl).toBeTruthy();
    expect(styleEl?.innerHTML).toContain('0.001ms');
    
    service.applyMotion(1); // 1 = Normal
    expect(document.getElementById('theme-motion-override')).toBeNull();
  });

  it('should set layout scale custom properties', () => {
    service.applyShape(2); // Double border-radius
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--mat-sys-corner-small')).toBe('calc(8px * 2)');
  });

  it('should inject dynamic CVD SVGs and chain Astigmatism', () => {
    service.applyAccessibilityFilters('protanopia', 100, 'simulate', 'astigmatism', 50);
    
    expect(document.getElementById('accessibility-svg-filters')).toBeTruthy();
    const cvdMatrix = document.getElementById('dynamic-cvd-matrix');
    expect(cvdMatrix?.getAttribute('values')).toContain('0.567');

    const root = document.documentElement;
    // Should chain both SVG filters in the CSS
    expect(root.style.filter).toContain('dynamic-cvd-filter');
    expect(root.style.filter).toContain('dynamic-astigmatism-filter');
  });

  it('should generate Field of Vision (FOV) overlays and clean them up', () => {
    service.applyAccessibilityFilters('none', 0, 'simulate', 'glaucoma', 50);
    const fov = document.getElementById('fov-overlay');
    expect(fov).toBeTruthy();
    expect(fov?.style.background).toContain('radial-gradient');

    // Switch back to none, should clean up!
    service.applyAccessibilityFilters('none', 0, 'simulate', 'none', 0);
    expect(document.getElementById('fov-overlay')).toBeNull();
  });
});

describe('With FontLoaderStrategy', () => {
    let mockFontLoader: any;
    let domWithLoader: DomService;

    beforeEach(() => {
      mockFontLoader = { loadFont: jasmine.createSpy('loadFont') };
      TestBed.resetTestingModule(); // Reset the previous setup
      TestBed.configureTestingModule({
        providers: [
          DomService,
          { provide: FONT_LOADER_STRATEGY, useValue: mockFontLoader } 
        ]
      });
      domWithLoader = TestBed.inject(DomService);
    });

    it('should delegate to the FontLoaderStrategy when applying typography', () => {
      domWithLoader.applyTypography('Oswald', 'Roboto', 1);
      expect(mockFontLoader.loadFont).toHaveBeenCalledWith('Oswald', jasmine.any(Object));
      expect(mockFontLoader.loadFont).toHaveBeenCalledWith('Roboto', jasmine.any(Object));
    });
  });