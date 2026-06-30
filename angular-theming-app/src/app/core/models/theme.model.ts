export type ThemeMode = 'light' | 'dark';
export type HighContrast = boolean;

// ColorScheme is now a generic string so it can store unique profile IDs
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
  scheme: ColorScheme;
  customColors: CustomColors;
  highContrast: boolean;
  savedProfiles: CustomProfile[];
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

export const DEFAULT_THEME_STATE: ThemeState = {
  mode: 'light',
  scheme: 'blue',
  customColors: DEFAULT_CUSTOM_COLORS,
  highContrast: false,
  savedProfiles: []
};

export const THEME_MODES: ThemeMode[] = ['light', 'dark'];
export const PRESET_COLOR_SCHEMES: PresetColorScheme[] = ['blue', 'green', 'purple'];

/** localStorage key — centralized so service + any future SSR bootstrap code agree. */
export const THEME_STORAGE_KEY = 'angular-theming-app.theme';

/** Basic 3/6-digit hex validator, used before handing input to the color engine. */
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value: string | undefined | null): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}
