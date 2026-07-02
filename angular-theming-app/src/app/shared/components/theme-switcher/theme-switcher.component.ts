import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PreferencesService } from '../../../core/services/preferences.service';
import {
  PresetColorScheme,
  ThemeMode,
  ContrastMode,
  CVD_MODES,
  CvdMode,
  FONT_OPTIONS,
} from '../../../core/models/preferences.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SchemeOption {
  value: PresetColorScheme;
  label: string;
  swatch: string;
}

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    FormsModule,
    PercentPipe,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    CustomColorPickerComponent,
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
})
export class ThemeSwitcherComponent {
  private readonly preferencesService = inject(PreferencesService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

  readonly mode = this.preferencesService.mode;
  readonly contrast = this.preferencesService.contrast;
  readonly scheme = this.preferencesService.scheme;
  readonly customColors = this.preferencesService.customColors;
  readonly savedProfiles = this.preferencesService.savedProfiles;
  readonly cvd = this.preferencesService.cvd;
  readonly cvdOptions = CVD_MODES;
  readonly fontFamily = this.preferencesService.fontFamily;
  readonly fontScale = this.preferencesService.fontScale;
  readonly fontOptions = FONT_OPTIONS;
  readonly shapeScale = this.preferencesService.shapeScale;
  readonly densityScale = this.preferencesService.densityScale;

  readonly schemeOptions: SchemeOption[] = [
    { value: 'blue', label: 'Blue', swatch: '#3b6fd6' },
    { value: 'green', label: 'Green', swatch: '#3a8048' },
    { value: 'purple', label: 'Purple', swatch: '#7a4fd1' },
  ];

  onModeChange(mode: ThemeMode): void {
    this.preferencesService.setMode(mode);
  }

  onContrastChange(contrast: ContrastMode): void {
    this.preferencesService.setContrast(contrast);
  }

  onSchemeSelect(scheme: string): void {
    this.preferencesService.setScheme(scheme);
  }

  onCustomMenuOpened(scheme: string): void {
    this.preferencesService.setScheme(scheme);
  }

  closeCustomMenu(): void {
    this.menuTriggers.forEach((t) => t.closeMenu());
  }

  onCvdChange(mode: CvdMode): void {
    this.preferencesService.setCvdMode(mode);
  }

  setFontFamily(f: string): void {
    this.preferencesService.setFontFamily(f);
  }

  setFontScale(s: number): void {
    this.preferencesService.setFontScale(s);
  }

  scaleUp(): void {
    const current = this.fontScale();
    if (current < 1.3)
      this.setFontScale(Math.round((current + 0.05) * 100) / 100);
  }

  scaleDown(): void {
    const current = this.fontScale();
    if (current > 0.8)
      this.setFontScale(Math.round((current - 0.05) * 100) / 100);
  }

  resetTypography(): void {
    this.setFontFamily('Roboto');
    this.setFontScale(1);
  }

  setShapeScale(s: number): void {
    this.preferencesService.setShapeScale(s);
  }

  scaleShapeUp(): void {
    const current = this.shapeScale();
    if (current < 3)
      this.setShapeScale(Math.round((current + 0.25) * 100) / 100);
  }

  scaleShapeDown(): void {
    const current = this.shapeScale();
    if (current > 0)
      this.setShapeScale(Math.round((current - 0.25) * 100) / 100);
  }

  resetShape(): void {
    this.setShapeScale(1);
  }

  setDensityScale(s: number): void {
    this.preferencesService.setDensityScale(s);
  }

  scaleDensityUp(): void {
    const current = this.densityScale();
    if (current < 0) this.setDensityScale(current + 1);
  }

  scaleDensityDown(): void {
    const current = this.densityScale();
    if (current > -3) this.setDensityScale(current - 1);
  }

  resetDensity(): void {
    this.setDensityScale(0);
  }
}
