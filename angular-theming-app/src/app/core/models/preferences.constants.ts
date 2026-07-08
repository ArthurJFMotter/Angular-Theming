import {
  PreferencesState,
  CustomColors,
  ThemeMode,
  ContrastMode,
  CvdMode,
} from './preferences.types';

export const PREFERENCES_STORAGE_KEY = 'angular-theming-app.prefs';
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

export const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  mode: 'auto',
  autoContrast: true,
  contrastLevel: 0,
  scheme: 'custom',
  customColors: DEFAULT_CUSTOM_COLORS,
  savedProfiles: [],
  cvd: 'none',
  headingFontFamily: 'Roboto',
  bodyFontFamily: 'Roboto',
  fontScale: 1,
  shapeScale: 1,
  densityScale: 0,
  snackbarHPosition: 'center',
  snackbarVPosition: 'bottom',
};

export const THEME_MODES: ThemeMode[] = ['light', 'auto', 'dark'];
export const CONTRAST_MODES: ContrastMode[] = ['normal', 'auto', 'high'];

export const CVD_MODES: { value: CvdMode; label: string }[] = [
  { value: 'none', label: 'Normal Vision' },
  { value: 'protanopia', label: 'Protanopia (Red-blind)' },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
  { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  { value: 'achromatopsia', label: 'Achromatopsia (Grayscale)' },
  { value: 'blur', label: 'Low Vision (Blur)' },
  { value: 'glare', label: 'Sunlight Glare' },
  { value: 'nightshift', label: 'Night Shift (Warm)' },
];

export const FONT_OPTIONS = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Atkinson Hyperlegible', label: 'Hyperlegible' },
  { value: 'system-ui, sans-serif', label: 'System Native' },
  { value: 'monospace', label: 'Monospace' },
];

export function isValidHexColor(
  value: string | undefined | null,
): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}
