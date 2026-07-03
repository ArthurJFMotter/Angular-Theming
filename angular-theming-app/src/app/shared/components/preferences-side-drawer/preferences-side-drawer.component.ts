import { Component, inject, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
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
import { PresetColorScheme, ThemeMode, ContrastMode, CVD_MODES, CvdMode, FONT_OPTIONS } from '../../../core/models/preferences.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';

interface SchemeOption { value: PresetColorScheme; label: string; swatch: string; }

@Component({
    selector: 'app-preferences-side-drawer',
  standalone: true,
  imports: [
    FormsModule, PercentPipe, MatButtonToggleModule, MatIconModule, MatTooltipModule,
    MatMenuModule, MatButtonModule, MatDividerModule, MatSliderModule,
    MatSelectModule, MatFormFieldModule, 
    CustomColorPickerComponent,
  ],
   templateUrl: './preferences-side-drawer.component.html',
  styleUrl: './preferences-side-drawer.component.scss'
})
export class PreferencesSideDrawerComponent {
  private readonly prefs = inject(PreferencesService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

  @Output() closeDrawer = new EventEmitter<void>(); 

  readonly mode = this.prefs.mode;
  readonly contrast = this.prefs.contrast;
  readonly scheme = this.prefs.scheme;
  readonly customColors = this.prefs.customColors;
  readonly savedProfiles = this.prefs.savedProfiles;
  readonly cvd = this.prefs.cvd;
  readonly cvdOptions = CVD_MODES;
  readonly fontFamily = this.prefs.fontFamily;
  readonly fontScale = this.prefs.fontScale;
  readonly fontOptions = FONT_OPTIONS;
  readonly shapeScale = this.prefs.shapeScale;
  readonly densityScale = this.prefs.densityScale;

  readonly schemeOptions: SchemeOption[] = [
    { value: 'blue', label: 'Blue', swatch: '#3b6fd6' },
    { value: 'green', label: 'Green', swatch: '#3a8048' },
    { value: 'purple', label: 'Purple', swatch: '#7a4fd1' },
  ];

  onModeChange(mode: ThemeMode): void { this.prefs.setMode(mode); }
  onContrastChange(contrast: ContrastMode): void { this.prefs.setContrast(contrast); }
  onSchemeSelect(scheme: string): void { this.prefs.setScheme(scheme); }
  onCustomMenuOpened(scheme: string): void { this.prefs.setScheme(scheme); }
  closeCustomMenu(): void { this.menuTriggers.forEach((t) => t.closeMenu()); }
  onCvdChange(mode: CvdMode): void { this.prefs.setCvdMode(mode); }
  setFontFamily(f: string): void { this.prefs.setFontFamily(f); }
  
  // Slider Controls
  setFontScale(s: number): void { this.prefs.setFontScale(s); }
  scaleUp(): void { const current = this.fontScale(); if (current < 1.3) this.setFontScale(Math.round((current + 0.05) * 100) / 100); }
  scaleDown(): void { const current = this.fontScale(); if (current > 0.8) this.setFontScale(Math.round((current - 0.05) * 100) / 100); }

  setShapeScale(s: number): void { this.prefs.setShapeScale(s); }
  scaleShapeUp(): void { const current = this.shapeScale(); if (current < 3) this.setShapeScale(Math.round((current + 0.25) * 100) / 100); }
  scaleShapeDown(): void { const current = this.shapeScale(); if (current > 0) this.setShapeScale(Math.round((current - 0.25) * 100) / 100); }

  setDensityScale(s: number): void { this.prefs.setDensityScale(s); }
  scaleDensityUp(): void { const current = this.densityScale(); if (current < 0) this.setDensityScale(current + 1); }
  scaleDensityDown(): void { const current = this.densityScale(); if (current > -3) this.setDensityScale(current - 1); }
}