import { Component, inject } from '@angular/core';
import { StepperConfig } from '../../../../../core/models/stepper.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DynamicStepperComponent } from '../../../../../shared/components/dynamic-stepper/dynamic-stepper.component';

@Component({
  selector: 'app-checkout-layout',
  standalone: true,
  imports: [DynamicStepperComponent],
  templateUrl: './checkout-layout.component.html',
  styleUrl: './checkout-layout.component.scss',
})
export class CheckoutLayoutComponent {
  private notify = inject(NotificationService);

  // The declarative JSON config
  stepperConfig: StepperConfig = {
    linear: true, // Forces users to complete forms before proceeding
    steps: [
      {
        id: 'account',
        label: 'Account Details',
        contentType: 'form',
        message: 'Enter your email to continue as a guest or login.',
        fields: [
          {
            key: 'email',
            label: 'Email address',
            type: 'email',
            required: true,
          },
        ],
        actions: [{ label: 'Next to Shipping', type: 'next', isPrimary: true }],
      },
      {
        id: 'shipping',
        label: 'Shipping Address',
        contentType: 'form',
        fields: [
          { key: 'firstName', label: 'First name', required: true },
          { key: 'lastName', label: 'Last name', required: true },
          { key: 'address', label: 'Address', required: true },
        ],
        actions: [
          { label: 'Back', type: 'previous' },
          { label: 'Next to Payment', type: 'next', isPrimary: true },
        ],
      },
      {
        id: 'confirmation',
        label: 'Confirmation',
        contentType: 'confirmation',
        icon: 'check_circle',
        message: 'Your items will be shipped to the address provided.',
        actions: [
          { label: 'Edit Details', type: 'previous' },
          {
            label: 'Submit Order',
            type: 'reset',
            isPrimary: true,
            customClass: 'btn-success-container',
            actionFn: (data) =>
              this.notify.show('success', 'Order submitted successfully!'),
          },
        ],
      },
    ],
  };
}
