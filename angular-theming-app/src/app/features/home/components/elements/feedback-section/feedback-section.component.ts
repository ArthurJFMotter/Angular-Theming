import { Component, computed, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PreferencesService } from 'ng-material-preferences';
import { NotificationType } from '../../../../../core/models/notification.model';

@Component({
  selector: 'app-feedback-section',
  standalone: true,
  imports: [MatProgressBarModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './feedback-section.component.html',
  styleUrl: './feedback-section.component.scss',
})
export class FeedbackSectionComponent {
  private notify = inject(NotificationService);
  private prefs = inject(PreferencesService);

  // Fetch the extended roles directly from the library state
  readonly customRoles = computed(() => this.prefs.activeCustomColors().extended || []);

  triggerToast(type: NotificationType) {
    this.notify.show(type, `This is a simulated ${type} alert.`, { label: 'Dismiss', actionFn: () => {} });
  }

  triggerCustomToast(id: string, label: string) {
    // Pass the custom ID, a custom message, an action button, a duration, AND a custom icon!
    this.notify.show(
      id, 
      `This is a custom alert painted with the "${label}" role tokens!`, 
      { label: 'Awesome', actionFn: () => {} }, 
      5000, 
      'star'
    );
  }
}
