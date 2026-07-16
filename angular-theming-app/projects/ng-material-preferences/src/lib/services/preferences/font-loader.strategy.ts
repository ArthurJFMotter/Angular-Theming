import { InjectionToken } from '@angular/core';

export interface FontLoaderStrategy {
  loadFont(family: string, document: Document): void;
}

export const FONT_LOADER_STRATEGY = new InjectionToken<FontLoaderStrategy>('FONT_LOADER_STRATEGY');

/** Default implementation: Reaches out to fonts.googleapis.com */
export class GoogleFontLoaderStrategy implements FontLoaderStrategy {
  loadFont(family: string, document: Document): void {
    const primaryFont = family.split(',')[0].replace(/['"]/g, '').trim();

    if (!primaryFont.toLowerCase().includes('system') && 
        !primaryFont.toLowerCase().includes('monospace') && 
        primaryFont.toLowerCase() !== 'roboto') {
          
      const urlFamily = primaryFont.replace(/\s+/g, '+');
      const linkId = `font-${urlFamily.toLowerCase()}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId; 
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;500;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  }
}

/** Opt-out implementation: Does nothing (assumes consumer self-hosts fonts) */
export class NoopFontLoaderStrategy implements FontLoaderStrategy {
  loadFont(family: string, document: Document): void {}
}