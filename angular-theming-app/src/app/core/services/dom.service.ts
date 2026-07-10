import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CvdMode } from '../models/preferences.types';
import {
  CVD_FILTERS_SVG,
  TYPOGRAPHY_ROLES,
  SHAPE_ROLES,
} from '../models/design-tokens.constants';

@Injectable({ providedIn: 'root' })
export class DomService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  applyAccessibilityFilters(cvd: string, cvdSeverity: number, cvdIntent: string, screen: string, screenIntensity: number): void {
    const root = this.document.documentElement;
    let filterCss = '';

    // Pass the intent to the SVG generator
    if (cvd !== 'none' && cvdSeverity > 0) {
      this.updateDynamicCvdSvg(cvd, cvdSeverity, cvdIntent);
      filterCss += 'url(#dynamic-cvd-filter) ';
    }

    // 2. Handle Screen Filters (CSS based)
    if (screen !== 'none' && screenIntensity > 0) {
      const s = screenIntensity / 100;
      if (screen === 'blur') {
        filterCss += `blur(${s * 2.5}px) contrast(${1 - (s * 0.15)}) `;
      } else if (screen === 'glare') {
        filterCss += `contrast(${1 - (s * 0.45)}) brightness(${1 + (s * 0.35)}) sepia(${s * 0.2}) `;
      } else if (screen === 'nightshift') {
        filterCss += `sepia(${s * 0.4}) hue-rotate(${-s * 20}deg) contrast(${1 - (s * 0.05)}) brightness(${1 - (s * 0.1)}) `;
      }
    }

    root.style.filter = filterCss.trim();
  }

  private updateDynamicCvdSvg(mode: string, severity: number, intent: string): void {
    const svgId = 'accessibility-svg-filters';
    
    if (!this.document.getElementById(svgId)) {
      const newSvg = this.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      newSvg.id = svgId;
      newSvg.setAttribute('style', 'display: none; width: 0; height: 0;');
      newSvg.innerHTML = `<defs><filter id="dynamic-cvd-filter"><feColorMatrix id="dynamic-cvd-matrix" type="matrix" values="" /></filter></defs>`;
      this.document.body.appendChild(newSvg);
    }

    const matrixEl = this.document.getElementById('dynamic-cvd-matrix');
    if (!matrixEl) return;

    // 1. SIMULATION MATRICES (Loss of vision)
    const simMatrices: Record<string, number[]> = {
      protanopia: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
      deuteranopia: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
      tritanopia: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
      achromatopsia: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0]
    };

    // 2. COMPENSATION MATRICES (Daltonization - Shifting unseen color differences into visible channels)
    const compMatrices: Record<string, number[]> = {
      protanopia: [1, 0, 0, 0, 0, 0.303, 0.697, 0, 0, 0, 0.303, -0.303, 1, 0, 0, 0, 0, 0, 1, 0],
      deuteranopia: [0.51, 0.49, 0, 0, 0, 0, 1, 0, 0, 0, -0.49, 0.49, 1, 0, 0, 0, 0, 0, 1, 0],
      tritanopia: [1, -0.332, 0.332, 0, 0, 0, 0.668, 0.332, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      // Achromatopsia cannot be daltonized (no channels left to shift to). Fallback to standard greyscale.
      achromatopsia: simMatrices['achromatopsia']
    };

    const targetMap = intent === 'compensate' ? compMatrices : simMatrices;
    const target = targetMap[mode] || targetMap['achromatopsia'];
    
    // Normal 1:1 color vision
    const identity = [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0
    ];

    // Mathematical Interpolation
    const s = severity / 100;
    const values = identity.map((idVal, i) => idVal * (1 - s) + target[i] * s).join(' ');
    
    matrixEl.setAttribute('values', values);
  }

  // Helper to load fonts from Google Fonts
  private loadFont(family: string): void {
    // Extract just the primary font name (e.g. "'Fira Code', monospace" -> "Fira Code")
    const primaryFont = family.split(',')[0].replace(/['"]/g, '').trim();

    if (!primaryFont.toLowerCase().includes('system') && 
        !primaryFont.toLowerCase().includes('monospace') && 
        primaryFont.toLowerCase() !== 'roboto') {
          
      const urlFamily = primaryFont.replace(/\s+/g, '+');
      const linkId = `font-${urlFamily.toLowerCase()}`;
      
      if (!this.document.getElementById(linkId)) {
        const link = this.document.createElement('link');
        link.id = linkId; 
        link.rel = 'stylesheet';
        // Ask Google Fonts for the 400, 500, and 700 weights
        link.href = `https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;500;700&display=swap`;
        this.document.head.appendChild(link);
      }
    }
  }

  applyTypography(
    headingFamily: string,
    bodyFamily: string,
    scale: number,
  ): void {
    // Load fonts if needed
    this.loadFont(headingFamily);
    if (headingFamily !== bodyFamily) {
      this.loadFont(bodyFamily);
    }

    const root = this.document.documentElement;

    // Map roles to the correct font family
    for (const role of TYPOGRAPHY_ROLES) {
      // Display, Headline, and Title use the Heading Font. Body and Label use the Body Font.
      const isHeading =
        role.name.includes('display') ||
        role.name.includes('headline') ||
        role.name.includes('title');
      const family = isHeading ? headingFamily : bodyFamily;

      root.style.setProperty(`--mat-sys-${role.name}-font`, family);
      root.style.setProperty(
        `--mat-sys-${role.name}-size`,
        `calc(${role.size}px * ${scale})`,
      );
      root.style.setProperty(
        `--mat-sys-${role.name}-line-height`,
        `calc(${role.lh}px * ${scale})`,
      );
    }

    // Default base body font
    this.document.body.style.fontFamily = bodyFamily;
    root.style.fontSize = `${scale * 100}%`;
  }

  applyShape(scale: number): void {
    const root = this.document.documentElement;
    for (const role of SHAPE_ROLES) {
      root.style.setProperty(
        `--mat-sys-corner-${role.name}`,
        `calc(${role.size}px * ${scale})`,
      );
    }
  }

  applyMotion(scale: number): void {
    const root = this.document.documentElement;
    const styleId = 'theme-motion-override';
    let styleEl = this.document.getElementById(styleId);

    // If motion is turned off entirely (0x), aggressively disable all CSS animations/transitions globally
    if (scale === 0) {
      if (!styleEl) {
        styleEl = this.document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          *, *::before, *::after {
            transition-duration: 0.001ms !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        `;
        this.document.head.appendChild(styleEl);
      }
    } else {
      // If motion is normal or fast, remove the aggressive override
      if (styleEl) styleEl.remove();
    }

    // Expose the scale as a custom property for any custom SCSS you write in the future
    root.style.setProperty('--theme-motion-scale', scale.toString());
  }

  applyTokens<T extends object>(tokens: T): void {
    const root = this.document.documentElement;

    for (const [token, value] of Object.entries(tokens)) {
      if (value) root.style.setProperty(`--mat-sys-${token}`, value as string);
    }
  }

  setAttribute(name: string, value: string): void {
    this.document.documentElement.setAttribute(name, value);
  }

  removeAttribute(name: string): void {
    this.document.documentElement.removeAttribute(name);
  }

  setColorScheme(scheme: 'light' | 'dark'): void {
    this.document.documentElement.style.colorScheme = scheme;
  }
}
