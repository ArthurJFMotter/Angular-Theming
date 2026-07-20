import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { DomService } from './dom.service';

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
});