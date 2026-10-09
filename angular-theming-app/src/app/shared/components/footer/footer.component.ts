import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [MatIcon],
})
export class FooterComponent {
  private modals = inject(ModalService);

  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openLicense(): void {
    this.modals.alert(
      'MIT License',
      'This project is open-source and free to use. Angular Prefs is designed to empower developers to build highly accessible applications.',
      'gavel',
    );
  }
}
