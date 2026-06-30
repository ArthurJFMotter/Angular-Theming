export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high' | 'auto';

export type ColorScheme = string;
export type PresetColorScheme = 'blue' | 'green' | 'purple';

export interface CustomColors {
  primary: string;
  secondary?: string;
  tertiary?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
}

export interface CustomProfile {
  id: string;
  name: string;
  colors: CustomColors;
}

export interface ThemeState {
  mode: ThemeMode;
  contrast: ContrastMode;
  scheme: ColorScheme;
  customColors: CustomColors;
  savedProfiles: CustomProfile[];
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

export const DEFAULT_THEME_STATE: ThemeState = {
  mode: 'auto',       // Default to OS preference
  contrast: 'auto',   // Default to OS preference
  scheme: 'blue',
  customColors: DEFAULT_CUSTOM_COLORS,
  savedProfiles: []
};

export const THEME_MODES: ThemeMode[] = ['light', 'auto', 'dark'];
export const CONTRAST_MODES: ContrastMode[] = ['normal', 'auto', 'high'];
export const PRESET_COLOR_SCHEMES: PresetColorScheme[] = ['blue', 'green', 'purple'];

/** localStorage key — centralized so service + any future SSR bootstrap code agree. */
export const THEME_STORAGE_KEY = 'angular-theming-app.theme';

/** Basic 3/6-digit hex validator, used before handing input to the color engine. */
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value: string | undefined | null): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}
