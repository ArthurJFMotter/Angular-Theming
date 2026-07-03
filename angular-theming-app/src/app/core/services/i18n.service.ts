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
      
      // Save to storage
      try { localStorage.setItem('angular-theming-app.locale', current); } catch {}
      
      // THE GOLDEN RULE OF A11Y: Tell the OS Screen Reader the language changed!
      document.documentElement.lang = current === 'pt' ? 'pt-BR' : 'en-US';
    });
  }

  toggleLocale(): void {
    this.locale.set(this.locale() === 'en' ? 'pt' : 'en');
  }

  /** Retrieves the translated string from the dictionary */
  translate(key: string): string {
    const dict = TRANSLATIONS[this.locale()];
    return (dict as any)[key] || key; // Fallback to the key if translation is missing
  }
}