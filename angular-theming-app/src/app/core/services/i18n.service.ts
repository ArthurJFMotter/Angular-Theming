import { Injectable, signal, effect } from '@angular/core';
import { Locale, TRANSLATIONS } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>('en');
  readonly locales: { value: Locale; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'es', label: 'Español' },
    { value: 'ar', label: 'العربية' },
  ];

  constructor() {
    try {
      const saved = localStorage.getItem('angular-theming-app.locale') as Locale;
      if (saved && TRANSLATIONS[saved]) this.locale.set(saved);
    } catch {}

    effect(() => {
      const current = this.locale();
      try { localStorage.setItem('angular-theming-app.locale', current); } catch {}
      
      // Map locales to full HTML lang attributes
      const langMap: Record<Locale, string> = { en: 'en-US', pt: 'pt-BR', es: 'es-ES', ar: 'ar' };
      document.documentElement.lang = langMap[current];

      // THE MAGIC FLIP: Set text direction for RTL!
      document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
    });
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
  }

  translate(key: string): string {
    const dict = TRANSLATIONS[this.locale()];
    return (dict as any)[key] || key;
  }
}