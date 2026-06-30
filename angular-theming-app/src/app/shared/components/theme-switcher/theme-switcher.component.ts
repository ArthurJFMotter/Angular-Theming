import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';
import { PresetColorScheme, PRESET_COLOR_SCHEMES, ThemeMode } from '../../../core/models/theme.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';

interface SchemeOption {
  value: PresetColorScheme;
  label: string;
  swatch: string;
}

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule, MatMenuModule, MatButtonModule, CustomColorPickerComponent],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

  readonly mode = this.themeService.mode;
  readonly scheme = this.themeService.scheme;
  readonly customColors = this.themeService.customColors;
  readonly savedProfiles = this.themeService.savedProfiles;
  readonly highContrast = this.themeService.highContrast;

  readonly schemeOptions: SchemeOption[] = [
    { value: 'blue', label: 'Blue', swatch: '#3b6fd6' },
    { value: 'green', label: 'Green', swatch: '#3a8048' },
    { value: 'purple', label: 'Purple', swatch: '#7a4fd1' }
  ];

  onModeChange(mode: ThemeMode): void { this.themeService.setMode(mode); }
  onSchemeSelect(scheme: string): void { this.themeService.setScheme(scheme); }
  onHighContrastToggle(): void { this.themeService.toggleHighContrast(); }
  onCustomMenuOpened(scheme: string): void { this.themeService.setScheme(scheme); }

  closeCustomMenu(): void {
    this.menuTriggers.forEach(t => t.closeMenu());
  }
}