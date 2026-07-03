import { Directive, HostListener, Input, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Directive({
  selector: '[appReadAloud]',
  standalone: true
})
export class ReadAloudDirective {
  @Input('appReadAloud') textKey!: string;
  private readonly i18n = inject(I18nService);

  @HostListener('click')
  @HostListener('keydown.enter')
  speak(): void {
    if (!('speechSynthesis' in window)) return;

    // Stop anything currently being read
    window.speechSynthesis.cancel();

    const text = this.i18n.translate(this.textKey);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Assign the correct phonetic accent (e.g. 'pt-BR' or 'en-US')
    utterance.lang = this.i18n.locale() === 'pt' ? 'pt-BR' : this.i18n.locale() === 'es' ? 'es-ES' : 'en-US';
    
    // Optional: Slow it down slightly for better comprehension
    utterance.rate = 0.95; 

    window.speechSynthesis.speak(utterance);
  }
}