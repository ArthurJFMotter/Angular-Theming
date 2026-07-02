import { MatSysColorTokens } from './color-engine';
import { CvdMode } from '../models/preferences.model';

export class DomEngine {
  static applyCvdFilter(root: HTMLElement, cvd: CvdMode): void {
    if (cvd === 'blur') root.style.filter = 'blur(1.5px) contrast(0.95)';
    else if (cvd === 'glare') root.style.filter = 'contrast(0.75) brightness(1.15) sepia(0.1)';
    else if (cvd === 'nightshift') root.style.filter = 'sepia(0.35) hue-rotate(-15deg) contrast(0.9)';
    else if (cvd !== 'none') root.style.filter = `url(#cvd-${cvd})`;
    else root.style.filter = '';
  }

  static injectCvdFilters(): void {
    if (typeof document === 'undefined' || document.getElementById('cvd-filters-svg')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'cvd-filters-svg';
    svg.setAttribute('style', 'display: none; width: 0; height: 0;');
    svg.innerHTML = `
      <defs>
        <filter id="cvd-protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" /></filter>
        <filter id="cvd-deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" /></filter>
        <filter id="cvd-tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" /></filter>
        <filter id="cvd-achromatopsia"><feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" /></filter>
      </defs>`;
    document.body.appendChild(svg);
  }

  static applyTypography(root: HTMLElement, family: string, scale: number): void {
    if (typeof document === 'undefined') return;
    if (!family.includes('system') && !family.includes('monospace') && family !== 'Roboto') {
      const urlFamily = family.replace(/\s+/g, '+');
      const linkId = `font-${urlFamily}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId; link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;500;700&display=swap`;
        document.head.appendChild(link);
      }
    }

    const roles = [
      { name: 'display-large', size: 57, lh: 64 }, { name: 'display-medium', size: 45, lh: 52 }, { name: 'display-small', size: 36, lh: 44 },
      { name: 'headline-large', size: 32, lh: 40 }, { name: 'headline-medium', size: 28, lh: 36 }, { name: 'headline-small', size: 24, lh: 32 },
      { name: 'title-large', size: 22, lh: 28 }, { name: 'title-medium', size: 16, lh: 24 }, { name: 'title-small', size: 14, lh: 20 },
      { name: 'body-large', size: 16, lh: 24 }, { name: 'body-medium', size: 14, lh: 20 }, { name: 'body-small', size: 12, lh: 16 },
      { name: 'label-large', size: 14, lh: 20 }, { name: 'label-medium', size: 12, lh: 16 }, { name: 'label-small', size: 11, lh: 16 },
    ];

    for (const role of roles) {
      root.style.setProperty(`--mat-sys-${role.name}-font`, family);
      root.style.setProperty(`--mat-sys-${role.name}-size`, `calc(${role.size}px * ${scale})`);
      root.style.setProperty(`--mat-sys-${role.name}-line-height`, `calc(${role.lh}px * ${scale})`);
    }
    document.body.style.fontFamily = family;
    root.style.fontSize = `${scale * 100}%`;
  }

  static applyShape(root: HTMLElement, scale: number): void {
    if (typeof document === 'undefined') return;
    const roles = [
      { name: 'extra-small', size: 4 }, { name: 'small', size: 8 }, { name: 'medium', size: 12 },
      { name: 'large', size: 16 }, { name: 'extra-large', size: 28 }, { name: 'full', size: 9999 }
    ];
    for (const role of roles) root.style.setProperty(`--mat-sys-corner-${role.name}`, `calc(${role.size}px * ${scale})`);
  }

  static applyTokens(root: HTMLElement, tokens: Partial<MatSysColorTokens>): void {
    for (const [token, value] of Object.entries(tokens)) {
      if (value) root.style.setProperty(`--mat-sys-${token}`, value);
    }
  }

  static clearCustomTokens(root: HTMLElement, sampleTokens: Partial<MatSysColorTokens>): void {
    for (const token of Object.keys(sampleTokens)) {
      root.style.removeProperty(`--mat-sys-${token}`);
    }
  }
}