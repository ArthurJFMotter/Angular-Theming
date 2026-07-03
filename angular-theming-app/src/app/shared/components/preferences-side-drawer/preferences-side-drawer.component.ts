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
  CVD_MODES,
  CvdMode,
  FONT_OPTIONS,
} from '../../../core/models/preferences.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-preferences-side-drawer',
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
    MatSelectModule,
    MatFormFieldModule,
    TranslatePipe,
    CustomColorPickerComponent,
  ],
  templateUrl: './preferences-side-drawer.component.html',
  styleUrl: './preferences-side-drawer.component.scss',
})
export class PreferencesSideDrawerComponent {
  readonly preferencesService = inject(PreferencesService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @Output() closeDrawer = new EventEmitter<void>();

  readonly cvdOptions = CVD_MODES;
  readonly fontOptions = FONT_OPTIONS;

  // Extracted simple helpers
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

  // Slider Math
  setFontScale(s: number): void {
    this.preferencesService.setFontScale(s);
  }

  scaleUp(): void {
    const c = this.preferencesService.fontScale();
    if (c < 1.3) this.setFontScale(Math.round((c + 0.05) * 100) / 100);
  }

  scaleDown(): void {
    const c = this.preferencesService.fontScale();
    if (c > 0.8) this.setFontScale(Math.round((c - 0.05) * 100) / 100);
  }

  setShapeScale(s: number): void {
    this.preferencesService.setShapeScale(s);
  }

  scaleShapeUp(): void {
    const c = this.preferencesService.shapeScale();
    if (c < 3) this.setShapeScale(Math.round((c + 0.25) * 100) / 100);
  }

  scaleShapeDown(): void {
    const c = this.preferencesService.shapeScale();
    if (c > 0) this.setShapeScale(Math.round((c - 0.25) * 100) / 100);
  }

  setDensityScale(s: number): void {
    this.preferencesService.setDensityScale(s);
  }

  scaleDensityUp(): void {
    const c = this.preferencesService.densityScale();
    if (c < 0) this.setDensityScale(c + 1);
  }

  scaleDensityDown(): void {
    const c = this.preferencesService.densityScale();
    if (c > -3) this.setDensityScale(c - 1);
  }
}
