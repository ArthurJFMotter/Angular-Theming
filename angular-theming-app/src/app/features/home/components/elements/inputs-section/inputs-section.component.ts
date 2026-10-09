import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-inputs-section',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  templateUrl: './inputs-section.component.html',
  styleUrl: './inputs-section.component.scss',
})
export class InputsSectionComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  constructor() {
    this.emailControl.markAsTouched();
  }
}
