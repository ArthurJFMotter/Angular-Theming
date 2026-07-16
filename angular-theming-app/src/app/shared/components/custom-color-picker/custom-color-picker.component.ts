import { Component, computed, inject, signal, effect, untracked, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { PreferencesService } from '../../../core/services/preferences.service';
import { isValidHexColor } from '../../models/preferences.constants';

type OptionalRole = 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';

interface RoleField {
  role: OptionalRole;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-custom-color-picker',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSlideToggleModule, MatDividerModule],
  templateUrl: './custom-color-picker.component.html',
  styleUrl: './custom-color-picker.component.scss'
})
export class CustomColorPickerComponent {
  readonly preferencesService = inject(PreferencesService);

  @Output() actionComplete = new EventEmitter<void>();

  readonly activeCustomColors = this.preferencesService.activeCustomColors;
  readonly activeProfile = this.preferencesService.activeProfile;
  readonly isProfileMode = computed(() => this.preferencesService.scheme().startsWith('profile-'));

  readonly confirmDelete = signal(false);

  // Initialize as empty signals. The effect() below will populate them safely.
  readonly primaryDraft = signal('');
  readonly profileNameDraft = signal('');
  readonly roleDrafts = signal<Record<OptionalRole, string>>({
    secondary: '', tertiary: '', error: '', success: '', warning: '', info: ''
  });

  // Extended Colors signals
  readonly extendedColors = computed(() => this.activeCustomColors().extended || []);
  readonly canAddExtendedColor = computed(() => this.extendedColors().length < 5);

  readonly roleFields: RoleField[] = [
    { role: 'secondary', label: 'Secondary', hint: 'Supporting accents.' },
    { role: 'tertiary', label: 'Tertiary', hint: 'Contrasting highlights.' },
    { role: 'error', label: 'Error', hint: 'Validation messages, destructive actions.' },
    { role: 'success', label: 'Success', hint: 'Completion messages, positive trends.' },
    { role: 'warning', label: 'Warning', hint: 'Cautionary messages, non-blocking issues.' },
    { role: 'info', label: 'Info', hint: 'Neutral tips, informational banners.' }
  ];

  readonly suggested = computed(() => this.preferencesService.suggestedCustomDefaults());
  readonly primaryInvalid = computed(() => !isValidHexColor(this.primaryDraft()));

  constructor() {
    effect(() => {
      const currentScheme = this.preferencesService.scheme();

      untracked(() => {
        const currentColors = this.activeCustomColors();
        
        this.primaryDraft.set(currentColors.primary);
        this.profileNameDraft.set(this.activeProfile()?.name || '');
        this.roleDrafts.set({
          secondary: currentColors.secondary ?? '',
          tertiary: currentColors.tertiary ?? '',
          error: currentColors.error ?? '',
          success: currentColors.success ?? '',
          warning: currentColors.warning ?? '',
          info: currentColors.info ?? ''
        });
      });
    });
  }

  getRoleDisplayValue(role: OptionalRole): string {
    return this.isRoleCustom(role) ? this.roleDrafts()[role] : this.suggested()[role];
  }

  isRoleCustom(role: OptionalRole): boolean {
    return !!this.activeCustomColors()[role];
  }

  roleDraftInvalid(role: OptionalRole): boolean {
    if (!this.isRoleCustom(role)) return false;
    const draft = this.roleDrafts()[role];
    return !!draft && !isValidHexColor(draft);
  }

  onPrimaryChange(value: string): void {
    this.primaryDraft.set(value);
    if (isValidHexColor(value)) {
      this.preferencesService.setCustomColors({ primary: value });
    }
  }

  onRoleToggle(role: OptionalRole, useCustom: boolean): void {
    if (useCustom) {
      const lockedColor = this.suggested()[role];
      this.roleDrafts.update(drafts => ({ ...drafts, [role]: lockedColor }));
      this.preferencesService.setCustomColors({ [role]: lockedColor });
    } else {
      this.preferencesService.clearCustomColorRole(role);
    }
  }

  onRoleChange(role: OptionalRole, value: string): void {
    this.roleDrafts.update(drafts => ({ ...drafts, [role]: value }));
    if (isValidHexColor(value)) {
      this.preferencesService.setCustomColors({ [role]: value });
    }
  }

  // --- Extended Colors Methods ---
  addExtendedRole() {
    if (!this.canAddExtendedColor()) return;
    const nextNumber = this.extendedColors().length + 1;
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    this.preferencesService.addExtendedColor(`Custom Role ${nextNumber}`, randomHex);
  }

  updateExtendedColorHex(id: string, value: string) {
    if (isValidHexColor(value)) {
      this.preferencesService.updateExtendedColor(id, { color: value.trim() });
    }
  }

  updateExtendedColorLabel(id: string, value: string) {
    if (value.trim()) {
      this.preferencesService.updateExtendedColor(id, { label: value.trim() });
    }
  }

  removeExtendedRole(id: string) {
    this.preferencesService.removeExtendedColor(id);
  }

  resetToDefault(): void {
    const defaultPrimary = '#3b6fd6';
    this.primaryDraft.set(defaultPrimary);
    this.profileNameDraft.set('');
    
    this.preferencesService.setCustomColors({ primary: defaultPrimary });
    const roles: OptionalRole[] = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'];
    for (const role of roles) {
      this.preferencesService.clearCustomColorRole(role);
    }

    // Also clear extended colors on reset
    const currentExtended = this.extendedColors();
    for (const ext of currentExtended) {
      this.preferencesService.removeExtendedColor(ext.id);
    }
  }

  onSaveProfile(): void {
    const name = this.profileNameDraft().trim() || 'Custom Theme';
    if (this.isProfileMode()) {
      this.preferencesService.updateActiveProfileName(name);
      this.actionComplete.emit();
    } else {
      this.preferencesService.saveCurrentAsProfile(name);
      this.actionComplete.emit();
    }
  }

  onDeleteProfileConfirm(): void {
    this.preferencesService.deleteActiveProfile();
    this.actionComplete.emit();
  }
}