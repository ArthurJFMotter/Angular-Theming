import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ColorScheme,
  COLOR_SCHEMES,
  CustomColors,
  DEFAULT_THEME_STATE,
  isValidHexColor,
  ThemeMode,
  THEME_MODES,
  ThemeState,
  THEME_STORAGE_KEY
} from '../models/theme.model';
import { ColorEngine, MatSysColorTokens } from '../utils/color-engine';

/** Base hex colors used to dynamically compute High Contrast for preset schemes. */
const PRESET_BASE_COLORS: Record<Exclude<ColorScheme, 'custom'>, CustomColors> = {
  blue: { primary: '#3b6fd6' },
  green: { primary: '#006e1c' },
  purple: { primary: '#6750a4' }
};

/**
 * ThemeService
 * -------------
 * Single source of truth for the app's visual theme.
 *
 * Two theming mechanisms coexist here:
 *
 * 1. PRESET schemes ('blue' | 'green' | 'purple') — fully compiled ahead of
 *    time in _themes.scss via `mat.theme()`. Switching to one of these just
 *    sets `data-theme-scheme` on <html> and clears any inline color
 *    overrides, letting the static CSS rules take over.
 *
 * 2. CUSTOM scheme — built live in the browser from user-chosen hex colors
 *    via ColorEngine (wrapping @material/material-color-utilities, the same
 *    color-science library Material's own presets are compiled from).
 *    Selecting 'custom' computes a full --mat-sys-* token set for both
 *    light and dark up front, then writes the set matching the current
 *    mode as inline custom properties on <html>. Because every Material
 *    component already reads its colors via var(--mat-sys-*) at the end of
 *    its own fallback chain, an inline override here beats the static
 *    stylesheet rule (inline styles win the cascade) and repaints instantly
 *    — no rebuild, no reload.
 *
 * 3. HIGH CONTRAST — an independent boolean flag that, when true, overrides
 *    both mode and scheme with a pure black-and-white M3 theme compiled in
 *    _themes.scss (scoped to html[data-theme-contrast='high']). The user's
 *    original mode/scheme are preserved in the signals so toggling HC off
 *    restores exactly what they had. When HC is active and the scheme is
 *    'custom', the HC inline tokens are written directly to <html> so they
 *    beat any existing custom-scheme inline properties.
 *
 * Mode (light/dark) is always a hard binary in both mechanisms, by design:
 * tone/lightness is never user-controlled, only hue/chroma are. This is
 * what keeps custom themes from ever producing low-contrast or "blurry"
 * surfaces, no matter which color the user picks.
 *
 * Everything (mode, scheme, custom color inputs, and highContrast) persists
 * to localStorage so the choice survives a refresh.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly modeSignal = signal<ThemeMode>(DEFAULT_THEME_STATE.mode);
  private readonly schemeSignal = signal<ColorScheme>(DEFAULT_THEME_STATE.scheme);
  private readonly customColorsSignal = signal<CustomColors>(DEFAULT_THEME_STATE.customColors);
  private readonly highContrastSignal = signal<boolean>(DEFAULT_THEME_STATE.highContrast);

  /** Current mode as a read-only signal. */
  readonly mode = this.modeSignal.asReadonly();
  /** Current color scheme as a read-only signal. */
  readonly scheme = this.schemeSignal.asReadonly();
  /** Current custom color hex inputs as a read-only signal. */
  readonly customColors = this.customColorsSignal.asReadonly();
  /** Whether High Contrast mode is active as a read-only signal. */
  readonly highContrast = this.highContrastSignal.asReadonly();

  /** Convenience computed signal bundling all values together. */
  readonly theme = computed<ThemeState>(() => ({
    mode: this.modeSignal(),
    scheme: this.schemeSignal(),
    customColors: this.customColorsSignal(),
    highContrast: this.highContrastSignal()
  }));

  /**
   * Both light and dark token sets for the current custom colors,
   * recomputed only when customColors actually changes (not on every mode
   * toggle), so flipping mode while on the custom scheme is cheap.
   */
  private readonly customTokenPair = computed(() => ColorEngine.buildTokenPair(this.customColorsSignal()));

  readonly availableModes = THEME_MODES;
  readonly availableSchemes = COLOR_SCHEMES;

  constructor() {
    this.restoreFromStorage();

    // Reacts to every change of mode/scheme/customColors/highContrast:
    // updates the DOM + persists it.
    effect(() => {
      const state = this.theme();
      this.applyToDocument(state);
      this.persist(state);
    });
  }

  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
  }

  setScheme(scheme: ColorScheme): void {
    this.schemeSignal.set(scheme);
  }

  toggleMode(): void {
    this.modeSignal.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(state: ThemeState): void {
    this.modeSignal.set(state.mode);
    this.schemeSignal.set(state.scheme);
    this.customColorsSignal.set(state.customColors);
    this.highContrastSignal.set(state.highContrast);
  }

  /**
   * Updates one or more custom color roles and switches the active scheme
   * to 'custom' so the change is immediately visible. Invalid/empty hex
   * values are dropped rather than applied, so a half-typed color in an
   * input field never breaks the live preview.
   */
  setCustomColors(colors: Partial<CustomColors>): void {
    const next: CustomColors = { ...this.customColorsSignal() };

    if (colors.primary !== undefined && isValidHexColor(colors.primary)) {
      next.primary = colors.primary;
    }
    for (const role of ['secondary', 'tertiary', 'error'] as const) {
      if (colors[role] !== undefined) {
        const value = colors[role];
        next[role] = value && isValidHexColor(value) ? value : undefined;
      }
    }

    this.customColorsSignal.set(next);
    this.schemeSignal.set('custom');
  }

  /** Clears an optional role back to "derive from primary automatically". */
  clearCustomColorRole(role: 'secondary' | 'tertiary' | 'error'): void {
    const next = { ...this.customColorsSignal() };
    delete next[role];
    this.customColorsSignal.set(next);
  }

  /** Returns the secondary/tertiary/error the engine would derive right now, for UI previews. */
  suggestedCustomDefaults() {
    return ColorEngine.suggestDefaults(this.customColorsSignal().primary);
  }

  /** Toggles High Contrast mode on/off. */
  toggleHighContrast(): void {
    this.highContrastSignal.update((current) => !current);
  }

  /** Explicitly sets High Contrast mode. */
  setHighContrast(value: boolean): void {
    this.highContrastSignal.set(value);
  }

  /** Applies the current theme as data attributes (+ inline color tokens for custom/HC) on <html>. */
 private applyToDocument(state: ThemeState): void {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', state.mode);
    root.setAttribute('data-theme-scheme', state.scheme);
    root.style.colorScheme = state.mode;

    if (state.highContrast) {
      root.setAttribute('data-theme-contrast', 'high');
      
      // 1. Figure out what base color we are currently using
      const baseColors = state.scheme === 'custom' 
        ? state.customColors 
        : PRESET_BASE_COLORS[state.scheme];
        
      // 2. Compute dynamic HIGH CONTRAST tokens for that specific hue
      const hcTokens = ColorEngine.buildTokens(baseColors, state.mode, 1);
      
      // 3. Apply them as inline styles (which overrides the SCSS instantly)
      this.applyTokens(root, hcTokens);
      
    } else {
      root.removeAttribute('data-theme-contrast');

      // Normal behavior when High Contrast is off
      if (state.scheme === 'custom') {
        this.applyCustomTokens(root, state.mode);
      } else {
        // Clear inline tokens so the normal SCSS presets can take over
        this.clearCustomTokens(root);
      }
    }
  }

  private applyCustomTokens(root: HTMLElement, mode: ThemeMode): void {
    const tokens: MatSysColorTokens = this.customTokenPair()[mode];
    this.applyTokens(root, tokens);
  }

  private applyTokens(root: HTMLElement, tokens: MatSysColorTokens): void {
    for (const [token, value] of Object.entries(tokens)) {
      root.style.setProperty(`--mat-sys-${token}`, value);
    }
  }

  private clearCustomTokens(root: HTMLElement): void {
    // Removing just the properties we ever set lets the compiled preset
    // CSS (scoped to the active data-theme-scheme attribute) take back over.
    const sampleTokens = this.customTokenPair().light;
    for (const token of Object.keys(sampleTokens)) {
      root.style.removeProperty(`--mat-sys-${token}`);
    }
  }

  private persist(state: ThemeState): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage can throw in private-browsing / storage-full edge cases.
      // Theming still works for the current session, it just won't persist.
    }
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Partial<ThemeState>;

      if (parsed.mode && THEME_MODES.includes(parsed.mode)) {
        this.modeSignal.set(parsed.mode);
      }
      if (parsed.scheme && COLOR_SCHEMES.includes(parsed.scheme)) {
        this.schemeSignal.set(parsed.scheme);
      }
      if (parsed.customColors && isValidHexColor(parsed.customColors.primary)) {
        const restored: CustomColors = { primary: parsed.customColors.primary };
        for (const role of ['secondary', 'tertiary', 'error'] as const) {
          const value = parsed.customColors[role];
          if (isValidHexColor(value)) {
            restored[role] = value;
          }
        }
        this.customColorsSignal.set(restored);
      }
      if (typeof parsed.highContrast === 'boolean') {
        this.highContrastSignal.set(parsed.highContrast);
      }
    } catch {
      // Corrupt or inaccessible storage — fall back to defaults silently.
    }
  }
}
