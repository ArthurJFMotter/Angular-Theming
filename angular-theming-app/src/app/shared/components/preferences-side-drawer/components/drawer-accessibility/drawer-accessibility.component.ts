import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PreferencesService,
  CVD_MODES,
  SCREEN_FILTERS,
  CVD_SEVERITY_SCALE,
  SCREEN_FILTER_INTENSITY_SCALE,
} from 'ng-material-preferences';
import { PreferenceSliderComponent } from '../../../preference-slider/preference-slider.component';
import { PreferenceSelectComponent } from '../../../preference-select/preference-select.component';

@Component({
  selector: 'app-drawer-accessibility',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    PreferenceSelectComponent,
    PreferenceSliderComponent,
  ],
  templateUrl: './drawer-accessibility.component.html',
  styleUrl: './drawer-accessibility.component.scss',
})
export class DrawerAccessibilityComponent {
  readonly prefs = inject(PreferencesService);
  
  readonly cvdOptions = CVD_MODES;
  readonly filterOptions = SCREEN_FILTERS;
  readonly cvdScale = CVD_SEVERITY_SCALE;
  readonly filterScale = SCREEN_FILTER_INTENSITY_SCALE;
}
