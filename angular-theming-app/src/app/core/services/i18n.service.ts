import { Injectable, signal, effect } from '@angular/core';
import { Locale, TRANSLATIONS } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>('en');

  constructor() {
    // 1. Restore from storage
    try {
      const saved = localStorage.getItem('angular-theming-app.locale') as Locale;
      if (saved && TRANSLATIONS[saved]) this.locale.set(saved);
    } catch {}

    // 2. React to changes
    effect(() => {
      const current = this.locale();
      try { localStorage.setItem('angular-theming-app.locale', current); } catch {}
      
      // Update DOM lang for OS Narrators (en-US, pt-BR, es-ES)
      document.documentElement.lang = current === 'pt' ? 'pt-BR' : current === 'es' ? 'es-ES' : 'en-US';
    });
  }

  toggleLocale(): void {
    const locales: Locale[] = ['en', 'pt', 'es'];
    const currentIndex = locales.indexOf(this.locale());
    const nextIndex = (currentIndex + 1) % locales.length;
    this.locale.set(locales[nextIndex]);
  }

  /** Retrieves the translated string from the dictionary */
  translate(key: string): string {
    const dict = TRANSLATIONS[this.locale()];
    return (dict as any)[key] || key; // Fallback to the key if translation is missing
  }
}