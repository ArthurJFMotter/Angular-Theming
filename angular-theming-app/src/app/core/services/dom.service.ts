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

  applyTypography(family: string, scale: number): void {
    if (
      !family.includes('system') &&
      !family.includes('monospace') &&
      family !== 'Roboto'
    ) {
      const urlFamily = family.replace(/\s+/g, '+');
      const linkId = `font-${urlFamily}`;
      if (!this.document.getElementById(linkId)) {
        const link = this.document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;500;700&display=swap`;
        this.document.head.appendChild(link);
      }
    }

    const root = this.document.documentElement;
    for (const role of TYPOGRAPHY_ROLES) {
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

    this.document.body.style.fontFamily = family;
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
