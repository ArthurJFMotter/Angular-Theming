import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../core/services/theme.service';
import { ColorScheme, PRESET_COLOR_SCHEMES, ThemeMode } from '../../../core/models/theme.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';

interface SchemeOption {
  value: Exclude<ColorScheme, 'custom'>;
  label: string;
  /** Swatch color shown on the picker, independent of the active theme. */
  swatch: string;
}

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule, MatMenuModule, CustomColorPickerComponent],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);

  readonly mode = this.themeService.mode;
  readonly scheme = this.themeService.scheme;
  readonly customColors = this.themeService.customColors;

  readonly presetSchemes = PRESET_COLOR_SCHEMES;

  readonly schemeOptions: SchemeOption[] = [
    { value: 'blue', label: 'Blue', swatch: '#3b6fd6' },
    { value: 'green', label: 'Green', swatch: '#3a8048' },
    { value: 'purple', label: 'Purple', swatch: '#7a4fd1' }
  ];

  onModeChange(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }

  onSchemeSelect(scheme: Exclude<ColorScheme, 'custom'>): void {
    this.themeService.setScheme(scheme);
  }

  /** Switches the active scheme to 'custom' as soon as the menu opens, so the live preview matches the panel immediately. */
  onCustomMenuOpened(): void {
    this.themeService.setScheme('custom');
  }
}
