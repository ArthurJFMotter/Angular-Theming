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

  applyCvdFilter(cvd: CvdMode): void {
    const root = this.document.documentElement;
    if (cvd === 'blur') root.style.filter = 'blur(1.5px) contrast(0.95)';
    else if (cvd === 'glare')
      root.style.filter = 'contrast(0.75) brightness(1.15) sepia(0.1)';
    else if (cvd === 'nightshift')
      root.style.filter = 'sepia(0.35) hue-rotate(-15deg) contrast(0.9)';
    else if (cvd !== 'none') root.style.filter = `url(#cvd-${cvd})`;
    else root.style.filter = '';
  }

  injectCvdFilters(): void {
    if (this.document.getElementById('cvd-filters-svg')) return;

    const svg = this.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    svg.id = 'cvd-filters-svg';
    svg.setAttribute('style', 'display: none; width: 0; height: 0;');
    svg.innerHTML = CVD_FILTERS_SVG;

    this.document.body.appendChild(svg);
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
