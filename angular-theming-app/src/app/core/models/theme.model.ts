export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'blur' | 'glare' | 'nightshift';

export const CVD_MODES: { value: CvdMode; label: string }[] = [
  { value: 'none', label: 'Normal Vision' },
  { value: 'protanopia', label: 'Protanopia (Red-blind)' },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
  { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  { value: 'achromatopsia', label: 'Achromatopsia (Grayscale)' },
  { value: 'blur', label: 'Low Vision (Blur)' },
  { value: 'glare', label: 'Sunlight Glare' },
  { value: 'nightshift', label: 'Night Shift (Warm)' }
];

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
  cvd: CvdMode;
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };
export interface ThemeState {
  mode: ThemeMode;
  contrast: ContrastMode;
  scheme: ColorScheme;
  customColors: CustomColors;
  savedProfiles: CustomProfile[];
  cvd: CvdMode;
  fontFamily: string;
  fontScale: number;
  shapeScale: number;
}

export const DEFAULT_THEME_STATE: ThemeState = {
  mode: 'auto',
  contrast: 'auto',
  scheme: 'blue',
  customColors: DEFAULT_CUSTOM_COLORS,
  savedProfiles: [],
  cvd: 'none',
  fontFamily: 'Roboto',
  fontScale: 1,
  shapeScale: 1       // (1 = 100% standard Material shape)
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

export const FONT_OPTIONS = [
  { value: 'Roboto', label: 'Roboto (Default)' },
  { value: 'Inter', label: 'Inter (Modern & Clean)' },
  { value: 'Montserrat', label: 'Montserrat (Geometric)' },
  { value: 'Atkinson Hyperlegible', label: 'Hyperlegible (A11y)' },
  { value: 'system-ui, sans-serif', label: 'System Native' },
  { value: 'monospace', label: 'Monospace (Code)' }
];
