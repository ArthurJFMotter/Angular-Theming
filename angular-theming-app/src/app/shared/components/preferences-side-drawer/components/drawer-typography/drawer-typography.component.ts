import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PercentPipe } from '@angular/common';
import {
  PreferencesService,
  FONT_OPTIONS,
  FONT_SCALE,
} from 'ng-material-preferences';
import { PreferenceSliderComponent } from '../../../preferences-slider/preferences-slider.component';

@Component({
  selector: 'app-drawer-typography',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    PercentPipe,
    PreferenceSliderComponent,
  ],
  templateUrl: './drawer-typography.component.html',
  styleUrl: './drawer-typography.component.scss',
  template: ``,
})
export class DrawerTypographyComponent {
  readonly prefs = inject(PreferencesService);
  readonly fontOptions = FONT_OPTIONS;
  readonly fontScale = FONT_SCALE;
}
