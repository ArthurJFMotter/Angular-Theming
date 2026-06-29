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
 * Mode (light/dark) is always a hard binary in both mechanisms, by design:
 * tone/lightness is never user-controlled, only hue/chroma are. This is
 * what keeps custom themes from ever producing low-contrast or "blurry"
 * surfaces, no matter which color the user picks.
 *
 * Everything (mode, scheme, and the custom color inputs) persists to
 * localStorage so the choice survives a refresh.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly modeSignal = signal<ThemeMode>(DEFAULT_THEME_STATE.mode);
  private readonly schemeSignal = signal<ColorScheme>(DEFAULT_THEME_STATE.scheme);
  private readonly customColorsSignal = signal<CustomColors>(DEFAULT_THEME_STATE.customColors);

  /** Current mode as a read-only signal. */
  readonly mode = this.modeSignal.asReadonly();
  /** Current color scheme as a read-only signal. */
  readonly scheme = this.schemeSignal.asReadonly();
  /** Current custom color hex inputs as a read-only signal. */
  readonly customColors = this.customColorsSignal.asReadonly();

  /** Convenience computed signal bundling all three values together. */
  readonly theme = computed<ThemeState>(() => ({
    mode: this.modeSignal(),
    scheme: this.schemeSignal(),
    customColors: this.customColorsSignal()
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

    // Reacts to every change of mode/scheme/customColors: updates the DOM + persists it.
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

  /** Applies the current theme as data attributes (+ inline color tokens for custom) on <html>. */
  private applyToDocument(state: ThemeState): void {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', state.mode);
    root.setAttribute('data-theme-scheme', state.scheme);

    // Helps native form controls / scrollbars pick light or dark UI chrome.
    root.style.colorScheme = state.mode;

    if (state.scheme === 'custom') {
      this.applyCustomTokens(root, state.mode);
    } else {
      this.clearCustomTokens(root);
    }
  }

  private applyCustomTokens(root: HTMLElement, mode: ThemeMode): void {
    const tokens: MatSysColorTokens = this.customTokenPair()[mode];
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
    } catch {
      // Corrupt or inaccessible storage — fall back to defaults silently.
    }
  }
}
