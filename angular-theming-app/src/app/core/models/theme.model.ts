/**
 * Light/dark mode — controls the M3 "theme-type" (white vs black base
 * surfaces). Intentionally kept as a hard binary: mixing arbitrary user
 * color input with a third "mode" multiplies the contrast-risk surface,
 * so this stays simple by design.
 */
export type ThemeMode = 'light' | 'dark';

/**
 * High-contrast flag — when true, overrides the active mode and color
 * scheme with a pure black-and-white M3 theme (contrastLevel: 1) to
 * maximise legibility. The user's original mode/scheme are preserved so
 * toggling high-contrast off restores exactly what they had before.
 */
export type HighContrast = boolean;

/**
 * Color scheme — either one of the 3 hard-coded M3 presets (compiled ahead
 * of time in _themes.scss) or 'custom', meaning the active colors come from
 * CustomColors instead and are computed live in the browser.
 */
export type ColorScheme = 'blue' | 'green' | 'purple' | 'custom';

/**
 * Hex color inputs that drive the custom/dynamic theme.
 * - primary is required: every other role can be derived from it.
 * - secondary, tertiary, error are optional per-role overrides. When
 *   omitted, ColorEngine derives sensible M3-spec defaults from primary
 *   (same formula Angular Material itself uses for its preset palettes),
 *   so the user is never forced to pick 4 colors just to get started.
 *
 * Only hue + chroma are taken from these inputs. Tone (lightness) is always
 * recomputed per light/dark mode by ColorEngine, and surface/background
 * tones are pinned to a near-neutral palette regardless of input — this is
 * what keeps the light mode "white-ish" and dark mode "black-ish" and
 * avoids the low-contrast/blurry-surface problem of tinting backgrounds
 * with arbitrary user chroma.
 */
export interface CustomColors {
  // Native Options
  primary: string;
  secondary?: string;
  tertiary?: string;
  error?: string;
  // Custom Options
  success?: string; 
  warning?: string; 
  info?: string;    
}

export interface ThemeState {
  mode: ThemeMode;
  scheme: ColorScheme;
  customColors: CustomColors;
  highContrast: boolean;
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  primary: '#3b6fd6'
};

export const DEFAULT_THEME_STATE: ThemeState = {
  mode: 'light',
  scheme: 'blue',
  customColors: DEFAULT_CUSTOM_COLORS,
  highContrast: false
};

export const THEME_MODES: ThemeMode[] = ['light', 'dark'];
export const PRESET_COLOR_SCHEMES: Exclude<ColorScheme, 'custom'>[] = ['blue', 'green', 'purple'];
export const COLOR_SCHEMES: ColorScheme[] = [...PRESET_COLOR_SCHEMES, 'custom'];

/** localStorage key — centralized so service + any future SSR bootstrap code agree. */
export const THEME_STORAGE_KEY = 'angular-theming-app.theme';

/** Basic 3/6-digit hex validator, used before handing input to the color engine. */
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value: string | undefined | null): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}
