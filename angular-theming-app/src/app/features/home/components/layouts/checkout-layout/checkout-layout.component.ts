import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AppUiStateService } from '../../../../../core/services/app-ui-state.service';

@Component({
  selector: 'app-checkout-layout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './checkout-layout.component.html',
  styleUrl: './checkout-layout.component.scss',
})
export class CheckoutLayoutComponent {
  readonly uiState = inject(AppUiStateService);
  emailCtrl = new FormControl('', [Validators.email]);
}
