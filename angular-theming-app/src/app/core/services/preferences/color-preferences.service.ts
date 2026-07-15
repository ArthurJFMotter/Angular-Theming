import { Injectable, signal, computed, inject } from '@angular/core';
import {
  DEFAULT_PREFERENCES_STATE,
  isValidHexColor,
} from '../../models/preferences.constants';
import {
  ThemeMode,
  ColorScheme,
  SchemeVariant,
  CustomColors,
  CustomProfile,
  ColorPreferences,
} from '../../models/preferences.types';
import { ColorEngine } from '../../utils/engines/color-engine';
import { MediaQueryService } from '../media-query.service';
import { PreferenceDomain } from './preference-domain.token';

@Injectable()
export class ColorPreferencesService implements PreferenceDomain<ColorPreferences> {
  readonly key = 'color';

  private mediaQuery = inject(MediaQueryService);
  private defaults = DEFAULT_PREFERENCES_STATE.color;

  readonly mode = signal<ThemeMode>(this.defaults.mode);
  readonly autoContrast = signal<boolean>(this.defaults.autoContrast);
  readonly contrastLevel = signal<number>(this.defaults.contrastLevel);
  readonly scheme = signal<ColorScheme>(this.defaults.scheme);
  readonly variant = signal<SchemeVariant>(this.defaults.variant);
  readonly customColors = signal<CustomColors>(this.defaults.customColors);
  readonly savedProfiles = signal<CustomProfile[]>(this.defaults.savedProfiles);

  readonly resolvedMode = computed<'light' | 'dark'>(() =>
    this.mode() === 'auto'
      ? this.mediaQuery.prefersDark()
        ? 'dark'
        : 'light'
      : (this.mode() as 'light' | 'dark'),
  );

  readonly resolvedContrastLevel = computed<number>(() =>
    this.autoContrast()
      ? this.mediaQuery.prefersHighContrast()
        ? 1.0
        : 0.0
      : this.contrastLevel(),
  );

  readonly activeCustomColors = computed<CustomColors>(() => {
    const s = this.scheme();
    if (s === 'custom') return this.customColors();
    return (
      this.savedProfiles().find((p) => p.id === s)?.colors ||
      this.customColors()
    );
  });

  readonly activeProfile = computed(() =>
    this.savedProfiles().find((p) => p.id === this.scheme()),
  );
  readonly canCreateColorProfile = computed(
    () => this.savedProfiles().length < 12,
  );

  // Setters
  setMode(v: ThemeMode): void {
    this.mode.set(v);
  }
  setAutoContrast(v: boolean): void {
    this.autoContrast.set(v);
  }
  setContrastLevel(v: number): void {
    this.contrastLevel.set(v);
  }
  setScheme(v: ColorScheme): void {
    this.scheme.set(v);
  }
  setVariant(v: SchemeVariant): void {
    this.variant.set(v);
  }

  // Profile Management
  saveCurrentAsProfile(name: string): void {
    const newId = 'profile-' + Date.now();
    this.savedProfiles.update((p) => [
      ...p,
      { id: newId, name, colors: { ...this.activeCustomColors() } },
    ]);
    this.scheme.set(newId);
  }
  updateActiveProfileName(name: string): void {
    if (this.scheme().startsWith('profile-'))
      this.savedProfiles.update((p) =>
        p.map((x) => (x.id === this.scheme() ? { ...x, name } : x)),
      );
  }
  deleteActiveProfile(): void {
    if (this.scheme().startsWith('profile-')) {
      this.savedProfiles.update((p) => p.filter((x) => x.id !== this.scheme()));
      this.scheme.set('custom');
    }
  }

  // Custom Colors Management
  setCustomColors(colors: Partial<CustomColors>): void {
    if (this.scheme() !== 'custom' && !this.scheme().startsWith('profile-'))
      this.scheme.set('custom');
    const nextColors = { ...this.activeCustomColors() };
    if (colors.primary !== undefined && isValidHexColor(colors.primary))
      nextColors.primary = colors.primary;

    const ROLES = [
      'secondary',
      'tertiary',
      'error',
      'success',
      'warning',
      'info',
    ] as const;
    for (const role of ROLES) {
      if (colors[role] !== undefined) {
        const val = colors[role];
        nextColors[role] = val && isValidHexColor(val) ? val : undefined;
      }
    }
    this.saveColors(nextColors);
  }

  clearCustomColorRole(
    role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info',
  ): void {
    const nextColors = { ...this.activeCustomColors() };
    delete nextColors[role];
    this.saveColors(nextColors);
  }

  addExtendedColor(label: string, hexColor: string): void {
    const nextColors = { ...this.activeCustomColors() };
    const extended = nextColors.extended || [];
    if (extended.length >= 5) return;
    const id = label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    nextColors.extended = [...extended, { id, label, color: hexColor }];
    this.saveColors(nextColors);
  }

  updateExtendedColor(
    id: string,
    updates: { label?: string; color?: string },
  ): void {
    const nextColors = { ...this.activeCustomColors() };
    if (nextColors.extended) {
      nextColors.extended = nextColors.extended.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      );
      this.saveColors(nextColors);
    }
  }

  removeExtendedColor(id: string): void {
    const nextColors = { ...this.activeCustomColors() };
    if (nextColors.extended) {
      nextColors.extended = nextColors.extended.filter((c) => c.id !== id);
      this.saveColors(nextColors);
    }
  }

  private saveColors(colors: CustomColors): void {
    if (this.scheme() === 'custom') this.customColors.set(colors);
    else
      this.savedProfiles.update((p) =>
        p.map((x) => (x.id === this.scheme() ? { ...x, colors } : x)),
      );
  }

  suggestedCustomDefaults() {
    return ColorEngine.suggestDefaults(
      this.activeCustomColors().primary,
      this.variant(),
    );
  }

  getSnapshot(): ColorPreferences {
    return {
      mode: this.mode(),
      autoContrast: this.autoContrast(),
      contrastLevel: this.contrastLevel(),
      scheme: this.scheme(),
      variant: this.variant(),
      customColors: this.customColors(),
      savedProfiles: this.savedProfiles(),
    };
  }

  patchState(state: Partial<ColorPreferences>): void {
    if (state.mode !== undefined) this.setMode(state.mode);
    if (state.autoContrast !== undefined)
      this.setAutoContrast(state.autoContrast);
    if (state.contrastLevel !== undefined)
      this.setContrastLevel(state.contrastLevel);
    if (state.scheme !== undefined) this.setScheme(state.scheme);
    if (state.variant !== undefined) this.setVariant(state.variant);
    if (state.savedProfiles) this.savedProfiles.set(state.savedProfiles);
    if (state.customColors) this.setCustomColors(state.customColors); // Includes extended colors logic natively
  }

  reset(): void {
    this.patchState(DEFAULT_PREFERENCES_STATE.color);
  }
}
