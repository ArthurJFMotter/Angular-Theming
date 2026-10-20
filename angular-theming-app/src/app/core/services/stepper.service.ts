import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperConfig, StepperStep } from '../models/stepper.model';

@Injectable({ providedIn: 'root' })
export class StepperService {
  private fb = inject(FormBuilder);

  getDefaultConfig(
    config: Partial<StepperConfig> & { steps: StepperStep[] },
  ): StepperConfig {
    return {
      linear: config.linear ?? true,
      orientation: config.orientation ?? 'horizontal',
      steps: config.steps,
    };
  }

  /** Dynamically generates a map of FormGroups for every step that requires inputs */
  buildForms(steps: StepperStep[]): Record<string, FormGroup> {
    const forms: Record<string, FormGroup> = {};

    steps.forEach((step) => {
      if (step.contentType === 'form' && step.fields) {
        const group: any = {};
        step.fields.forEach((field) => {
          const validators = [];
          if (field.required) validators.push(Validators.required);
          if (field.type === 'email') validators.push(Validators.email);

          group[field.key] = ['', validators];
        });
        forms[step.id] = this.fb.group(group);
      }
    });

    return forms;
  }
}
