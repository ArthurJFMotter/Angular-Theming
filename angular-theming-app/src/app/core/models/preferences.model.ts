export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high' | 'auto';
export type ColorScheme = string; // Either 'custom' or a profile ID
export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'blur' | 'glare' | 'nightshift';

export interface CustomColors {
  primary: string; secondary?: string; tertiary?: string; error?: string; success?: string; warning?: string; info?: string;
}

export interface CustomProfile { id: string; name: string; colors: CustomColors; }

export interface PreferencesState {
  mode: ThemeMode; contrast: ContrastMode; scheme: ColorScheme;
  customColors: CustomColors; savedProfiles: CustomProfile[]; cvd: CvdMode;
  fontFamily: string; fontScale: number; shapeScale: number; densityScale: number;
}

// Baseline starting colors
export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

export const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  mode: 'auto', contrast: 'auto',
  scheme: 'custom', // <-- defaults to custom scratchpad
  customColors: DEFAULT_CUSTOM_COLORS,
  savedProfiles: [],
  cvd: 'none', fontFamily: 'Roboto', fontScale: 1, shapeScale: 1, densityScale: 0,
};

export const THEME_MODES: ThemeMode[] = ['light', 'auto', 'dark'];
export const CONTRAST_MODES: ContrastMode[] = ['normal', 'auto', 'high'];

export const CVD_MODES: { value: CvdMode; label: string }[] = [
  { value: 'none', label: 'cvd.none' },
  { value: 'protanopia', label: 'cvd.protanopia' },
  { value: 'deuteranopia', label: 'cvd.deuteranopia' },
  { value: 'tritanopia', label: 'cvd.tritanopia' },
  { value: 'achromatopsia', label: 'cvd.achromatopsia' },
  { value: 'blur', label: 'cvd.blur' },
  { value: 'glare', label: 'cvd.glare' },
  { value: 'nightshift', label: 'cvd.nightshift' },
];

export const FONT_OPTIONS = [
  { value: 'Roboto', label: 'font.roboto' },
  { value: 'Inter', label: 'font.inter' },
  { value: 'Montserrat', label: 'font.montserrat' },
  { value: 'Atkinson Hyperlegible', label: 'font.hyperlegible' },
  { value: 'system-ui, sans-serif', label: 'font.system' },
  { value: 'monospace', label: 'font.monospace' },
];

export const PREFERENCES_STORAGE_KEY = 'angular-theming-app.prefs';
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value: string | undefined | null): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}