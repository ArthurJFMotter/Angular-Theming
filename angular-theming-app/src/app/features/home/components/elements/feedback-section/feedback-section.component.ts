import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-feedback-section',
  standalone: true,
  imports: [MatProgressBarModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './feedback-section.component.html',
  styleUrl: './feedback-section.component.scss',
})
export class FeedbackSectionComponent {
  private notify = inject(NotificationService);

  triggerToast(type: 'success' | 'warning' | 'info' | 'error') {
    this.notify.show(type, `This is a simulated ${type} alert.`, {
      label: 'Dismiss',
      actionFn: () => {},
    });
  }
}
