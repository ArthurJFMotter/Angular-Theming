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
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ModalService } from '../../../core/services/modal.service';

import {
  PreferencesService,
  ThemeMode,
  CvdMode,
  SchemeVariant,
  CVD_MODES,
  FONT_OPTIONS,
  SCHEME_VARIANTS,
  SCREEN_FILTERS,
  CONTRAST_SCALE,
  FONT_SCALE,
  SHAPE_SCALE,
  DENSITY_SCALE,
  MOTION_SCALE,
  CVD_SEVERITY_SCALE,
  SCREEN_FILTER_INTENSITY_SCALE
} from 'ng-material-preferences';

@Component({
  selector: 'app-preferences-side-drawer',
  standalone: true,
  imports: [
    FormsModule, PercentPipe, MatAutocompleteModule, MatButtonToggleModule,
    MatIconModule, MatTooltipModule, MatMenuModule, MatButtonModule,
    MatDividerModule, MatSliderModule, MatSelectModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, ColorPickerComponent,
  ],
  templateUrl: './preferences-side-drawer.component.html',
  styleUrl: './preferences-side-drawer.component.scss',
})
export class PreferencesSideDrawerComponent {
  readonly prefs = inject(PreferencesService);
  private modals = inject(ModalService);

  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @Output() closeDrawer = new EventEmitter<void>();

  // Expose arrays for dropdowns
  readonly cvdOptions = CVD_MODES;
  readonly screenFilterOptions = SCREEN_FILTERS;
  readonly fontOptions = FONT_OPTIONS;
  readonly variantOptions = SCHEME_VARIANTS;

  // Expose ScaleDefinitions for sliders
  readonly contrastScale = CONTRAST_SCALE;
  readonly fontScale = FONT_SCALE;
  readonly shapeScale = SHAPE_SCALE;
  readonly densityScale = DENSITY_SCALE;
  readonly motionScale = MOTION_SCALE;
  readonly cvdSeverityScale = CVD_SEVERITY_SCALE;
  readonly screenFilterScale = SCREEN_FILTER_INTENSITY_SCALE;

  // --- Display Helpers ---
  getVariantLabel(value: string): string {
    return this.variantOptions.find((v) => v.value === value)?.label || value;
  }
  getCvdLabel(value: string): string {
    return this.cvdOptions.find((v) => v.value === value)?.label || value;
  }
  getScreenFilterLabel(value: string): string {
    return this.screenFilterOptions.find((v) => v.value === value)?.label || value;
  }
  formatContrast(value: number): string {
    return this.contrastScale.presets.find(p => p.value === value)?.label || value.toString();
  }
  formatMotion(value: number): string {
    return this.motionScale.presets.find(p => p.value === value)?.label || value.toString();
  }

  // --- Simple Setters ---
  setVariant(v: SchemeVariant): void { this.prefs.setVariant(v); }
  onModeChange(mode: ThemeMode): void { this.prefs.setMode(mode); }
  onSchemeSelect(scheme: string): void { this.prefs.setScheme(scheme); }
  onCustomMenuOpened(scheme: string): void { this.prefs.setScheme(scheme); }
  closeCustomMenu(): void { this.menuTriggers.forEach((t) => t.closeMenu()); }
  onCvdChange(mode: CvdMode): void { this.prefs.setCvdMode(mode); }
  setHeadingFontFamily(f: string): void { this.prefs.setHeadingFontFamily(f); }
  setBodyFontFamily(f: string): void { this.prefs.setBodyFontFamily(f); }

  // --- Slider Math (Now using dynamic constants!) ---
  increaseContrast(): void {
    const c = this.prefs.contrastLevel();
    if (c < this.contrastScale.max) this.prefs.setContrastLevel(c + this.contrastScale.step);
  }
  decreaseContrast(): void {
    const c = this.prefs.contrastLevel();
    if (c > this.contrastScale.min) this.prefs.setContrastLevel(c - this.contrastScale.step);
  }

  setFontScale(s: number): void { this.prefs.setFontScale(s); }
  scaleUp(): void {
    const c = this.prefs.fontScale();
    if (c < this.fontScale.max) this.setFontScale(Math.round((c + this.fontScale.step) * 100) / 100);
  }
  scaleDown(): void {
    const c = this.prefs.fontScale();
    if (c > this.fontScale.min) this.setFontScale(Math.round((c - this.fontScale.step) * 100) / 100);
  }

  setShapeScale(s: number): void { this.prefs.setShapeScale(s); }
  scaleShapeUp(): void {
    const c = this.prefs.shapeScale();
    if (c < this.shapeScale.max) this.setShapeScale(Math.round((c + this.shapeScale.step) * 100) / 100);
  }
  scaleShapeDown(): void {
    const c = this.prefs.shapeScale();
    if (c > this.shapeScale.min) this.setShapeScale(Math.round((c - this.shapeScale.step) * 100) / 100);
  }

  setDensityScale(s: number): void { this.prefs.setDensityScale(s); }
  scaleDensityUp(): void {
    const c = this.prefs.densityScale();
    if (c < this.densityScale.max) this.setDensityScale(c + this.densityScale.step);
  }
  scaleDensityDown(): void {
    const c = this.prefs.densityScale();
    if (c > this.densityScale.min) this.setDensityScale(c - this.densityScale.step);
  }

  setMotionScale(s: number): void { this.prefs.setMotionScale(s); }
  increaseMotion(): void {
    const c = this.prefs.motionScale();
    if (c < this.motionScale.max) this.setMotionScale(c + this.motionScale.step);
  }
  decreaseMotion(): void {
    const c = this.prefs.motionScale();
    if (c > this.motionScale.min) this.setMotionScale(c - this.motionScale.step);
  }

  increaseCvdSeverity(): void {
    const c = this.prefs.cvdSeverity();
    if (c < this.cvdSeverityScale.max) this.prefs.setCvdSeverity(c + this.cvdSeverityScale.step);
  }
  decreaseCvdSeverity(): void {
    const c = this.prefs.cvdSeverity();
    if (c > this.cvdSeverityScale.min) this.prefs.setCvdSeverity(c - this.cvdSeverityScale.step);
  }

  increaseScreenFilterIntensity(): void {
    const c = this.prefs.screenFilterIntensity();
    if (c < this.screenFilterScale.max) this.prefs.setScreenFilterIntensity(c + this.screenFilterScale.step);
  }
  decreaseScreenFilterIntensity(): void {
    const c = this.prefs.screenFilterIntensity();
    if (c > this.screenFilterScale.min) this.prefs.setScreenFilterIntensity(c - this.screenFilterScale.step);
  }

  // --- SAFETY CONFIRMATION ---
  confirmReset(): void {
    this.modals.confirmDanger(
      'Reset All Preferences',
      'Are you sure you want to restore everything to the factory defaults? All custom color palettes and settings will be lost.',
      'restore'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.prefs.resetToDefaults();
      }
    });
  }
}