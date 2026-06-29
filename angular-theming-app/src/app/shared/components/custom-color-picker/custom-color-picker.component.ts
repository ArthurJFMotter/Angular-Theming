import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../../core/services/theme.service';
import { isValidHexColor } from '../../../core/models/theme.model';

type OptionalRole = 'secondary' | 'tertiary' | 'error';

interface RoleField {
  role: OptionalRole;
  label: string;
  hint: string;
}

/**
 * Panel for picking the 4 role colors behind the 'custom' theme scheme.
 *
 * Primary is the only required input — secondary/tertiary/error each have
 * an Auto/Custom toggle. "Auto" means ColorEngine derives that role from
 * primary's hue (same formula Material's own presets use); flipping a role
 * to "Custom" reveals a picker for that role specifically.
 *
 * Every color feeds ONLY hue + chroma into the theme — never tone/lightness
 * and never the neutral/surface palette — so no input here can make text
 * unreadable or surfaces low-contrast. See ColorEngine for the full
 * rationale.
 */
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
    { role: 'secondary', label: 'Secondary', hint: 'Supporting accents — chips, toggles, less prominent actions.' },
    { role: 'tertiary', label: 'Tertiary', hint: 'Contrasting highlights — badges, special call-outs.' },
    { role: 'error', label: 'Error', hint: 'Validation messages, destructive actions.' }
  ];

  /** Local draft for the primary hex text input, so typos don't immediately wipe the live theme. */
  readonly primaryDraft = signal(this.customColors().primary);
  /** One local draft per optional role, keyed by role name. */
  readonly roleDrafts = signal<Record<OptionalRole, string>>(this.buildInitialDrafts());

  readonly suggested = computed(() => this.themeService.suggestedCustomDefaults());

  readonly primaryInvalid = computed(() => !isValidHexColor(this.primaryDraft()));

  isRoleCustom(role: OptionalRole): boolean {
    return !!this.customColors()[role];
  }

  roleDraftInvalid(role: OptionalRole): boolean {
    const draft = this.roleDrafts()[role];
    return !!draft && !isValidHexColor(draft);
  }

  onPrimaryTextChange(value: string): void {
    this.primaryDraft.set(value);
    if (isValidHexColor(value)) {
      this.themeService.setCustomColors({ primary: value });
    }
  }

  onPrimaryPickerChange(value: string): void {
    this.primaryDraft.set(value);
    this.themeService.setCustomColors({ primary: value });
  }

  onRoleToggle(role: OptionalRole, useCustom: boolean): void {
    if (useCustom) {
      const fallback = this.suggested()[role];
      this.roleDrafts.update((drafts) => ({ ...drafts, [role]: fallback }));
      this.themeService.setCustomColors({ [role]: fallback });
    } else {
      this.themeService.clearCustomColorRole(role);
    }
  }

  onRoleTextChange(role: OptionalRole, value: string): void {
    this.roleDrafts.update((drafts) => ({ ...drafts, [role]: value }));
    if (isValidHexColor(value)) {
      this.themeService.setCustomColors({ [role]: value });
    }
  }

  onRolePickerChange(role: OptionalRole, value: string): void {
    this.roleDrafts.update((drafts) => ({ ...drafts, [role]: value }));
    this.themeService.setCustomColors({ [role]: value });
  }

  resetToSuggested(): void {
    const defaults = this.suggested();
    this.primaryDraft.set(defaults.primary);
    this.roleDrafts.set({ secondary: defaults.secondary, tertiary: defaults.tertiary, error: defaults.error });
    this.themeService.setCustomColors(defaults);
  }

  private buildInitialDrafts(): Record<OptionalRole, string> {
    const current = this.customColors();
    const suggested = this.themeService.suggestedCustomDefaults();
    return {
      secondary: current.secondary ?? suggested.secondary,
      tertiary: current.tertiary ?? suggested.tertiary,
      error: current.error ?? suggested.error
    };
  }
}
