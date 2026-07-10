import {
  Component,
  inject,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PercentPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PreferencesService } from '../../../core/services/preferences.service';
import {
  ThemeMode,
  ContrastMode,
  CvdMode,
  SchemeVariant,
} from '../../../core/models/preferences.types';
import {
  CVD_MODES,
  FONT_OPTIONS,
  SCHEME_VARIANTS,
  SCREEN_FILTERS,
} from '../../../core/models/preferences.constants';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-preferences-side-drawer',
  standalone: true,
  imports: [
    FormsModule,
    PercentPipe,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    CustomColorPickerComponent,
  ],
  templateUrl: './preferences-side-drawer.component.html',
  styleUrl: './preferences-side-drawer.component.scss',
})
export class PreferencesSideDrawerComponent {
  readonly prefs = inject(PreferencesService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @Output() closeDrawer = new EventEmitter<void>();

  readonly cvdOptions = CVD_MODES;
  readonly screenFilterOptions = SCREEN_FILTERS;
  readonly fontOptions = FONT_OPTIONS;
  readonly variantOptions = SCHEME_VARIANTS;

  getVariantLabel(value: string): string {
    return this.variantOptions.find((v) => v.value === value)?.label || value;
  }

  setVariant(v: SchemeVariant): void {
    this.prefs.setVariant(v);
  }

  onModeChange(mode: ThemeMode): void {
    this.prefs.setMode(mode);
  }

  increaseContrast(): void {
    const c = this.prefs.contrastLevel();
    if (c < 1) {
      this.prefs.setContrastLevel(c + 0.5);
    }
  }

  decreaseContrast(): void {
    const c = this.prefs.contrastLevel();
    if (c > -1) {
      this.prefs.setContrastLevel(c - 0.5);
    }
  }

  formatContrast(value: number): string {
    if (value === -1) return 'Reduced';
    if (value === -0.5) return 'Low';
    if (value === 0) return 'Standard';
    if (value === 0.5) return 'Medium';
    if (value === 1) return 'High';
    return value.toString();
  }

  onSchemeSelect(scheme: string): void {
    this.prefs.setScheme(scheme);
  }

  onCustomMenuOpened(scheme: string): void {
    this.prefs.setScheme(scheme);
  }

  closeCustomMenu(): void {
    this.menuTriggers.forEach((t) => t.closeMenu());
  }

  onCvdChange(mode: CvdMode): void {
    this.prefs.setCvdMode(mode);
  }

  setHeadingFontFamily(f: string): void {
    this.prefs.setHeadingFontFamily(f);
  }

  setBodyFontFamily(f: string): void {
    this.prefs.setBodyFontFamily(f);
  }

  setFontScale(s: number): void {
    this.prefs.setFontScale(s);
  }

  scaleUp(): void {
    const c = this.prefs.fontScale();
    if (c < 1.3) this.setFontScale(Math.round((c + 0.05) * 100) / 100);
  }

  scaleDown(): void {
    const c = this.prefs.fontScale();
    if (c > 0.8) this.setFontScale(Math.round((c - 0.05) * 100) / 100);
  }

  setShapeScale(s: number): void {
    this.prefs.setShapeScale(s);
  }

  scaleShapeUp(): void {
    const c = this.prefs.shapeScale();
    if (c < 3) this.setShapeScale(Math.round((c + 0.25) * 100) / 100);
  }

  scaleShapeDown(): void {
    const c = this.prefs.shapeScale();
    if (c > 0) this.setShapeScale(Math.round((c - 0.25) * 100) / 100);
  }

  setDensityScale(s: number): void {
    this.prefs.setDensityScale(s);
  }

  scaleDensityUp(): void {
    const c = this.prefs.densityScale();
    if (c < 0) this.setDensityScale(c + 1);
  }

  scaleDensityDown(): void {
    const c = this.prefs.densityScale();
    if (c > -3) this.setDensityScale(c - 1);
  }

  setMotionScale(s: number): void {
    this.prefs.setMotionScale(s);
  }

  increaseMotion(): void {
    const c = this.prefs.motionScale();
    if (c < 1) this.setMotionScale(c + 0.5);
  }

  decreaseMotion(): void {
    const c = this.prefs.motionScale();
    if (c > 0) this.setMotionScale(c - 0.5);
  }

  formatMotion(value: number): string {
    if (value === 0) return 'Off';
    if (value === 0.5) return 'Fast';
    return 'Normal';
  }

  getCvdLabel(value: string): string {
    return this.cvdOptions.find((v) => v.value === value)?.label || value;
  }

  getScreenFilterLabel(value: string): string {
    return (
      this.screenFilterOptions.find((v) => v.value === value)?.label || value
    );
  }

  increaseCvdSeverity(): void {
    const c = this.prefs.cvdSeverity();
    if (c < 100) this.prefs.setCvdSeverity(c + 10);
  }

  decreaseCvdSeverity(): void {
    const c = this.prefs.cvdSeverity();
    if (c > 10) this.prefs.setCvdSeverity(c - 10);
  }

  increaseScreenFilterIntensity(): void {
    const c = this.prefs.screenFilterIntensity();
    if (c < 100) this.prefs.setScreenFilterIntensity(c + 10);
  }

  decreaseScreenFilterIntensity(): void {
    const c = this.prefs.screenFilterIntensity();
    if (c > 10) this.prefs.setScreenFilterIntensity(c - 10);
  }
}
