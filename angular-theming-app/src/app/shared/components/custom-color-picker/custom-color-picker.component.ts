import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../../core/services/theme.service';
import { isValidHexColor } from '../../../core/models/theme.model';

type OptionalRole = 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';

interface RoleField {
  role: OptionalRole;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-custom-color-picker',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './custom-color-picker.component.html',
  styleUrl: './custom-color-picker.component.scss'
})
export class CustomColorPickerComponent {
  private readonly themeService = inject(ThemeService);

  readonly customColors = this.themeService.customColors;

  readonly roleFields: RoleField[] = [
    { role: 'secondary', label: 'Secondary', hint: 'Supporting accents.' },
    { role: 'tertiary', label: 'Tertiary', hint: 'Contrasting highlights.' },
    { role: 'error', label: 'Error', hint: 'Validation messages, destructive actions.' },
    { role: 'success', label: 'Success', hint: 'Completion messages, positive trends.' },
    { role: 'warning', label: 'Warning', hint: 'Cautionary messages, non-blocking issues.' },
    { role: 'info', label: 'Info', hint: 'Neutral tips, informational banners.' }
  ];

  readonly primaryDraft = signal(this.customColors().primary);
  readonly roleDrafts = signal<Record<OptionalRole, string>>(this.buildInitialDrafts());

  readonly suggested = computed(() => this.themeService.suggestedCustomDefaults());
  readonly primaryInvalid = computed(() => !isValidHexColor(this.primaryDraft()));

  /** 
   * Dynamically returns the text/color to show in the UI. 
   * If Custom: shows what the user is typing/has picked.
   * If Auto: bypasses drafts and shows the live calculated fallback.
   */
  getRoleDisplayValue(role: OptionalRole): string {
    return this.isRoleCustom(role) ? this.roleDrafts()[role] : this.suggested()[role];
  }

  isRoleCustom(role: OptionalRole): boolean {
    return !!this.customColors()[role];
  }

  roleDraftInvalid(role: OptionalRole): boolean {
    if (!this.isRoleCustom(role)) return false;
    const draft = this.roleDrafts()[role];
    return !!draft && !isValidHexColor(draft);
  }

  onPrimaryChange(value: string): void {
    this.primaryDraft.set(value);
    if (isValidHexColor(value)) {
      this.themeService.setCustomColors({ primary: value });
    }
  }

  onRoleToggle(role: OptionalRole, useCustom: boolean): void {
    if (useCustom) {
      // Lock the current live suggested color into the custom system
      const lockedColor = this.suggested()[role];
      this.roleDrafts.update((drafts) => ({ ...drafts, [role]: lockedColor }));
      this.themeService.setCustomColors({ [role]: lockedColor });
    } else {
      // Release it back to auto-updating
      this.themeService.clearCustomColorRole(role);
    }
  }

  onRoleChange(role: OptionalRole, value: string): void {
    this.roleDrafts.update((drafts) => ({ ...drafts, [role]: value }));
    if (isValidHexColor(value)) {
      this.themeService.setCustomColors({ [role]: value });
    }
  }

  /**
   * Complete reset to initial app state (Blue scheme). 
   * Reverts all toggles back to 'Auto'.
   */
  resetToDefault(): void {
    const defaultPrimary = '#3b6fd6'; // Standard Default Blue
    
    this.primaryDraft.set(defaultPrimary);
    this.themeService.setCustomColors({ primary: defaultPrimary });
    
    // Clear out ALL optional roles to force them back to Auto
    const roles: OptionalRole[] = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'];
    for (const role of roles) {
      this.themeService.clearCustomColorRole(role);
    }
  }

  private buildInitialDrafts(): Record<OptionalRole, string> {
    const current = this.customColors();
    return {
      secondary: current.secondary ?? '',
      tertiary: current.tertiary ?? '',
      error: current.error ?? '',
      success: current.success ?? '',
      warning: current.warning ?? '',
      info: current.info ?? ''
    };
  }
}