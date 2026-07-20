import {
  PreferencesState,
  CustomColors,
  ThemeMode,
  ContrastMode,
  CvdMode,
  SchemeVariant,
  ScreenFilter,
} from './preferences.types';

export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

export const DEFAULT_PREFERENCES_STATE: Required<PreferencesState> = {
   _v: 2, // preferences Version (current: version 2.0)
  color: {
    mode: 'auto',
    autoContrast: true,
    contrastLevel: 0,
    scheme: 'custom',
    variant: 'tonal-spot',
    customColors: DEFAULT_CUSTOM_COLORS,
    savedProfiles: [],
  },
  accessibility: {
    cvd: 'none',
    cvdSeverity: 100,
    cvdIntent: 'simulate',
    screenFilter: 'none',
    screenFilterIntensity: 50,
  },
  typography: {
    headingFontFamily: 'Roboto',
    bodyFontFamily: 'Roboto',
    fontScale: 1,
  },
  layout: {
    shapeScale: 1,
    densityScale: 0,
    motionScale: 1,
  },
  notifications: {
    snackbarHPosition: 'center',
    snackbarVPosition: 'bottom',
  }
};

export const THEME_MODES: ThemeMode[] = ['light', 'auto', 'dark'];
export const CONTRAST_MODES: ContrastMode[] = ['normal', 'auto', 'high'];

/** 
 * Convenience array for UI dropdowns. 
 * @note The `label` and `desc` properties are English defaults. Override for i18n.
 */
export const SCHEME_VARIANTS: { value: SchemeVariant; label: string; desc: string }[] = [
  { value: 'tonal-spot', label: 'Tonal Spot', desc: 'Standard Material 3 (Pastel/Safe)' },
  { value: 'vibrant', label: 'Vibrant', desc: 'Maximized saturation' },
  { value: 'expressive', label: 'Expressive', desc: 'Unexpected complementary hues' },
  { value: 'neutral', label: 'Neutral', desc: 'Washed out, professional look' },
  { value: 'monochrome', label: 'Monochrome', desc: 'Pure greyscale UI' },
  { value: 'fidelity', label: 'Fidelity', desc: 'Strictly follows primary color' },
  { value: 'content', label: 'Content', desc: 'Optimized for embedded content' },
];

/** 
 * Convenience array for UI dropdowns. 
 * @note The `label` and `desc` properties are English defaults. 
 * For i18n (Internationalization), map the `value` keys to your own translation dictionaries. 
 */
export const CVD_MODES: { value: CvdMode; label: string; desc: string }[] = [
  { value: 'none', label: 'Normal Vision', desc: 'No color deficiency' },
  { value: 'protanopia', label: 'Protanomaly/Protanopia', desc: 'Red-blindness spectrum' },
  { value: 'deuteranopia', label: 'Deuteranomaly/Deuteranopia', desc: 'Green-blindness spectrum' },
  { value: 'tritanopia', label: 'Tritanomaly/Tritanopia', desc: 'Blue-blindness spectrum' },
  { value: 'achromatopsia', label: 'Achromatomaly/Achromatopsia', desc: 'Grayscale spectrum' },
];

/** 
 * Convenience array for UI dropdowns. 
 * @note The `label` and `desc` properties are English defaults. Override for i18n.
 */
export const SCREEN_FILTERS: { value: ScreenFilter; label: string; desc: string }[] = [
  { value: 'none', label: 'No Overlay', desc: 'Clear screen' },
  { value: 'blur', label: 'Low Vision', desc: 'Simulates blurred vision' },
  { value: 'glare', label: 'Sunlight Glare', desc: 'Washed out, low-contrast screen' },
  { value: 'nightshift', label: 'Night Shift', desc: 'Warm blue-light reduction' },
  { value: 'astigmatism', label: 'Astigmatism', desc: 'Dark mode halation / streaking' },
  { value: 'macular', label: 'Macular Degeneration', desc: 'Central vision loss (Mouse Tracked)' },
  { value: 'glaucoma', label: 'Glaucoma', desc: 'Tunnel vision (Mouse Tracked)' },
];

/** 
 * Standard font recommendations. 
 * @note The `label` properties are English defaults. Override for i18n.
 */
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
