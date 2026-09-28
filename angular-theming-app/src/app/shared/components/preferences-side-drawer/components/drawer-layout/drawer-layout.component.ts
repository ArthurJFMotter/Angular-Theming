import { Component, computed, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { PreferenceSliderComponent } from '../../../preferences-slider/preferences-slider.component';
import {
  PreferencesService,
  SHAPE_SCALE,
  DENSITY_SCALE,
  MOTION_SCALE,
} from 'ng-material-preferences';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-drawer-layout',
  standalone: true,
  imports: [MatDividerModule, PreferenceSliderComponent, PercentPipe],
  templateUrl: './drawer-layout.component.html',
  styleUrl: './drawer-layout.component.scss',
})
export class DrawerLayoutComponent {
  readonly prefs = inject(PreferencesService);
  readonly shapeScale = SHAPE_SCALE;
  readonly densityScale = DENSITY_SCALE;
  readonly motionScale = MOTION_SCALE;

  // Auto-lookup the motion label (Fast, Normal, Off) based on the current value!
  readonly motionName = computed(
    () =>
      this.motionScale.presets.find((m) => m.value === this.prefs.motionScale())
        ?.label || 'Normal',
  );
}
