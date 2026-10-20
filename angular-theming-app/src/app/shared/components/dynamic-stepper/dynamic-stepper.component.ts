import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

import { StepperConfig, StepAction } from '../../../core/models/stepper.model';
import { StepperService } from '../../../core/services/stepper.service';

@Component({
  selector: 'app-dynamic-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dynamic-stepper.component.html',
  styleUrl: './dynamic-stepper.component.scss',
})
export class DynamicStepperComponent implements OnInit {
  private stepperService = inject(StepperService);
  private breakpointObserver = inject(BreakpointObserver);

  @Input({ required: true }) config!: Partial<StepperConfig> & {
    steps: StepperConfig['steps'];
  };

  resolvedConfig!: StepperConfig;
  stepForms: Record<string, FormGroup> = {};

  // Automatically switch to vertical on mobile screens!
  readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]),
    { initialValue: { matches: false, breakpoints: {} } },
  );

  ngOnInit() {
    this.resolvedConfig = this.stepperService.getDefaultConfig(this.config);
    this.stepForms = this.stepperService.buildForms(this.resolvedConfig.steps);
  }

  handleAction(action: StepAction, stepper: MatStepper) {
    if (action.type === 'next') stepper.next();
    else if (action.type === 'previous') stepper.previous();
    else if (action.type === 'reset') stepper.reset();

    // Pass the collected form data to the custom callback
    if (action.actionFn) {
      const allData = Object.keys(this.stepForms).reduce(
        (acc, key) => ({ ...acc, [key]: this.stepForms[key].value }),
        {},
      );
      action.actionFn(allData);
    }
  }
}
