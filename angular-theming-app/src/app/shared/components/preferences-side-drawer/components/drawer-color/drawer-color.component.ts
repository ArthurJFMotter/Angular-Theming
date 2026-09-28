import {
  Component,
  inject,
  computed,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PreferencesService,
  SCHEME_VARIANTS,
  CONTRAST_SCALE,
} from 'ng-material-preferences';
import { PreferenceSliderComponent } from '../../../preferences-slider/preferences-slider.component';
import { ColorPickerComponent } from '../../../color-picker/color-picker.component';

@Component({
  selector: 'app-drawer-color',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    PreferenceSliderComponent,
    ColorPickerComponent,
  ],
  templateUrl: './drawer-color.component.html',
  styleUrl: './drawer-color.component.scss',
})
export class DrawerColorComponent {
  readonly prefs = inject(PreferencesService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

  readonly variantOptions = SCHEME_VARIANTS;
  readonly contrastScale = CONTRAST_SCALE;

  readonly variantName = computed(
    () =>
      this.variantOptions.find((v) => v.value === this.prefs.variant())
        ?.label || 'Tonal Spot',
  );
  readonly contrastName = computed(
    () =>
      this.contrastScale.presets.find(
        (p) => p.value === this.prefs.contrastLevel(),
      )?.label || 'Standard',
  );

  closeCustomMenu() {
    this.menuTriggers.forEach((t) => t.closeMenu());
  }
}
