import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';
import { PresetColorScheme, ThemeMode, ContrastMode } from '../../../core/models/theme.model';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';

interface SchemeOption { value: PresetColorScheme; label: string; swatch: string; }

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
  readonly contrast = this.themeService.contrast; // Grab the contrast signal
  readonly scheme = this.themeService.scheme;
  readonly customColors = this.themeService.customColors;
  readonly savedProfiles = this.themeService.savedProfiles;

  readonly schemeOptions: SchemeOption[] = [
    { value: 'blue', label: 'Blue', swatch: '#3b6fd6' },
    { value: 'green', label: 'Green', swatch: '#3a8048' },
    { value: 'purple', label: 'Purple', swatch: '#7a4fd1' }
  ];

  onModeChange(mode: ThemeMode): void { this.themeService.setMode(mode); }
  onContrastChange(contrast: ContrastMode): void { this.themeService.setContrast(contrast); }
  onSchemeSelect(scheme: string): void { this.themeService.setScheme(scheme); }
  onCustomMenuOpened(scheme: string): void { this.themeService.setScheme(scheme); }

  closeCustomMenu(): void {
    this.menuTriggers.forEach(t => t.closeMenu());
  }
}