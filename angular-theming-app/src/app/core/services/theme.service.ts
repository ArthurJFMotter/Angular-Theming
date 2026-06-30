import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ColorScheme, PresetColorScheme, PRESET_COLOR_SCHEMES, CustomColors, CustomProfile,
  DEFAULT_THEME_STATE, isValidHexColor, ThemeMode, THEME_MODES, ThemeState, THEME_STORAGE_KEY
} from '../models/theme.model';
import { ColorEngine, MatSysColorTokens } from '../utils/color-engine';

const PRESET_BASE_COLORS: Record<PresetColorScheme, CustomColors> = {
  blue: { primary: '#3b6fd6' },
  green: { primary: '#006e1c' },
  purple: { primary: '#6750a4' }
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly modeSignal = signal<ThemeMode>(DEFAULT_THEME_STATE.mode);
  private readonly schemeSignal = signal<ColorScheme>(DEFAULT_THEME_STATE.scheme);
  private readonly customColorsSignal = signal<CustomColors>(DEFAULT_THEME_STATE.customColors);
  private readonly highContrastSignal = signal<boolean>(DEFAULT_THEME_STATE.highContrast);
  private readonly savedProfilesSignal = signal<CustomProfile[]>(DEFAULT_THEME_STATE.savedProfiles);

  readonly mode = this.modeSignal.asReadonly();
  readonly scheme = this.schemeSignal.asReadonly();
  readonly customColors = this.customColorsSignal.asReadonly();
  readonly highContrast = this.highContrastSignal.asReadonly();
  readonly savedProfiles = this.savedProfilesSignal.asReadonly();

  /** Determines whether the active scheme is the scratchpad or a saved profile, and serves the correct colors. */
  readonly activeCustomColors = computed<CustomColors>(() => {
    const scheme = this.schemeSignal();
    if (scheme === 'custom') return this.customColorsSignal();
    const profile = this.savedProfilesSignal().find(p => p.id === scheme);
    return profile ? profile.colors : this.customColorsSignal();
  });

  /** Grabs the full profile object (including its name) if a profile is active. */
  readonly activeProfile = computed<CustomProfile | undefined>(() => {
    return this.savedProfilesSignal().find(p => p.id === this.schemeSignal());
  });

  readonly theme = computed<ThemeState>(() => ({
    mode: this.modeSignal(),
    scheme: this.schemeSignal(),
    customColors: this.customColorsSignal(),
    highContrast: this.highContrastSignal(),
    savedProfiles: this.savedProfilesSignal()
  }));

  /** Tracks the currently active custom/profile token pair for instant mode switching. */
  private readonly activeTokenPair = computed(() => ColorEngine.buildTokenPair(this.activeCustomColors()));

  readonly availableModes = THEME_MODES;
  readonly availableSchemes = PRESET_COLOR_SCHEMES;

  constructor() {
    this.restoreFromStorage();
    effect(() => {
      const state = this.theme();
      this.applyToDocument(state);
      this.persist(state);
    });
  }

  setMode(mode: ThemeMode): void { this.modeSignal.set(mode); }
  setScheme(scheme: ColorScheme): void { this.schemeSignal.set(scheme); }
  toggleMode(): void { this.modeSignal.update(c => c === 'light' ? 'dark' : 'light'); }
  toggleHighContrast(): void { this.highContrastSignal.update(c => !c); }
  
  /** Saves the current scratchpad state as a permanent profile. */
  saveCurrentAsProfile(name: string): void {
    const newId = 'profile-' + Date.now();
    const newProfile: CustomProfile = {
      id: newId,
      name,
      colors: { ...this.activeCustomColors() }
    };
    this.savedProfilesSignal.update(p => [...p, newProfile]);
    this.schemeSignal.set(newId);
  }

  /** Updates the active profile's name */
  updateActiveProfileName(name: string): void {
    const current = this.schemeSignal();
    if (current.startsWith('profile-')) {
       this.savedProfilesSignal.update(profiles => {
         return profiles.map(p => p.id === current ? { ...p, name } : p);
       });
    }
  }

  /** Deletes the active profile and falls back to the custom scratchpad. */
  deleteActiveProfile(): void {
    const current = this.schemeSignal();
    if (current.startsWith('profile-')) {
      this.savedProfilesSignal.update(p => p.filter(x => x.id !== current));
      this.schemeSignal.set('custom');
    }
  }

  setCustomColors(colors: Partial<CustomColors>): void {
    const currentScheme = this.schemeSignal();
    
    // Jump to the custom scratchpad if a user edits while on a preset
    if (currentScheme !== 'custom' && !currentScheme.startsWith('profile-')) {
      this.schemeSignal.set('custom');
    }

    const nextColors = { ...this.activeCustomColors() };
    if (colors.primary !== undefined && isValidHexColor(colors.primary)) nextColors.primary = colors.primary;
    
    const ROLES = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'] as const;
    for (const role of ROLES) {
      if (colors[role] !== undefined) {
        const val = colors[role];
        nextColors[role] = val && isValidHexColor(val) ? val : undefined;
      }
    }

    if (this.schemeSignal() === 'custom') {
      this.customColorsSignal.set(nextColors);
    } else {
      this.savedProfilesSignal.update(profiles => {
        const idx = profiles.findIndex(p => p.id === this.schemeSignal());
        if (idx > -1) {
          const updated = [...profiles];
          updated[idx] = { ...updated[idx], colors: nextColors };
          return updated;
        }
        return profiles;
      });
    }
  }

  clearCustomColorRole(role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info'): void {
    const nextColors = { ...this.activeCustomColors() };
    delete nextColors[role];
    
    if (this.schemeSignal() === 'custom') {
      this.customColorsSignal.set(nextColors);
    } else {
      this.savedProfilesSignal.update(profiles => {
        const idx = profiles.findIndex(p => p.id === this.schemeSignal());
        if (idx > -1) {
          const updated = [...profiles];
          updated[idx] = { ...updated[idx], colors: nextColors };
          return updated;
        }
        return profiles;
      });
    }
  }

  suggestedCustomDefaults() {
    return ColorEngine.suggestDefaults(this.activeCustomColors().primary);
  }

  private applyToDocument(state: ThemeState): void {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', state.mode);
    root.setAttribute('data-theme-scheme', state.scheme);
    root.style.colorScheme = state.mode;

    const isPreset = PRESET_COLOR_SCHEMES.includes(state.scheme as PresetColorScheme);
    const activeColors = state.scheme === 'custom' 
      ? state.customColors 
      : (state.savedProfiles.find(p => p.id === state.scheme)?.colors || state.customColors);

    const baseColors = isPreset ? PRESET_BASE_COLORS[state.scheme as PresetColorScheme] : activeColors;

    if (state.highContrast) {
      root.setAttribute('data-theme-contrast', 'high');
      const hcTokens = ColorEngine.buildTokens(baseColors, state.mode, 1);
      this.applyTokens(root, hcTokens);
    } else {
      root.removeAttribute('data-theme-contrast');

      if (!isPreset) {
        this.applyTokens(root, this.activeTokenPair()[state.mode]);
      } else {
        this.clearCustomTokens(root);
        const presetTokens = ColorEngine.buildTokens(baseColors, state.mode, 0);
        this.applyTokens(root, {
          'success': presetTokens.success, 'on-success': presetTokens['on-success'],
          'success-container': presetTokens['success-container'], 'on-success-container': presetTokens['on-success-container'],
          'warning': presetTokens.warning, 'on-warning': presetTokens['on-warning'],
          'warning-container': presetTokens['warning-container'], 'on-warning-container': presetTokens['on-warning-container'],
          'info': presetTokens.info, 'on-info': presetTokens['on-info'],
          'info-container': presetTokens['info-container'], 'on-info-container': presetTokens['on-info-container'],
        });
      }
    }
  }

  private applyTokens(root: HTMLElement, tokens: Partial<MatSysColorTokens>): void {
    for (const [token, value] of Object.entries(tokens)) {
      if (value) root.style.setProperty(`--mat-sys-${token}`, value);
    }
  }

  private clearCustomTokens(root: HTMLElement): void {
    const sampleTokens = this.activeTokenPair().light;
    for (const token of Object.keys(sampleTokens)) {
      root.style.removeProperty(`--mat-sys-${token}`);
    }
  }

  private persist(state: ThemeState): void {
    try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ThemeState>;

      if (parsed.mode) this.modeSignal.set(parsed.mode);
      if (parsed.scheme) this.schemeSignal.set(parsed.scheme);
      if (parsed.savedProfiles) {
        const profiles = parsed.savedProfiles.map(p => ({ ...p, name: p.name || 'Saved Profile' }));
        this.savedProfilesSignal.set(profiles);
      }
      if (typeof parsed.highContrast === 'boolean') this.highContrastSignal.set(parsed.highContrast);
      
      if (parsed.customColors && isValidHexColor(parsed.customColors.primary)) {
        const restored: CustomColors = { primary: parsed.customColors.primary };
        const ROLES = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'] as const;
        for (const role of ROLES) {
          const value = parsed.customColors[role];
          if (isValidHexColor(value)) restored[role] = value;
        }
        this.customColorsSignal.set(restored);
      }
    } catch {}
  }
}
