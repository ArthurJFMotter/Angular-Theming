import { 
  PreferencesState, CustomColors, ThemeMode, CvdMode, 
  SchemeVariant, ScreenFilter, CvdIntent, ScaleDefinition 
} from './preferences.types';

export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// --- SYSTEM LIMITS & THRESHOLDS ---
export const HIGH_CONTRAST_THRESHOLD = 0.5;
export const MAX_COLOR_PROFILES = 12;
export const MAX_EXTENDED_COLORS = 5;

// --- OLD CONSTANTS (Retained for Backwards Compatibility) ---
export const THEME_MODES: ThemeMode[] = ['light', 'auto', 'dark'];
/** @deprecated Use CONTRAST_SCALE instead. Will be removed in v2.0.0. */
export const CONTRAST_MODES = ['normal', 'auto', 'high'];

// --- SCALE DEFINITIONS & DROPDOWN OPTIONS ---

/** @note `label` values are English defaults. Override for i18n. */
export const FONT_SCALE: ScaleDefinition = {
  min: 0.85, max: 1.3, step: 0.05, default: 1,
  presets: [
    { value: 0.85, label: 'Small' },
    { value: 1,    label: 'Medium' },
    { value: 1.15, label: 'Large' },
    { value: 1.3,  label: 'X-Large' },
  ],
};

/** @note `label` values are English defaults. Override for i18n. */
export const CONTRAST_SCALE: ScaleDefinition = {
  min: -1, max: 1, step: 0.5, default: 0,
  presets: [
    { value: -1,   label: 'Reduced' },
    { value: -0.5, label: 'Low' },
    { value: 0,    label: 'Standard' },
    { value: 0.5,  label: 'Medium' },
    { value: 1,    label: 'High' },
  ],
};

/** @note `label` values are English defaults. Override for i18n. */
export const SHAPE_SCALE: ScaleDefinition = {
  min: 0, max: 3, step: 0.25, default: 1,
  presets: [
    { value: 0, label: 'Sharp' },
    { value: 1, label: 'Rounded' },
    { value: 2, label: 'Extra Round' },
    { value: 3, label: 'Pill' },
  ],
};

/** 
 * @note `label` values are English defaults. Override for i18n.
 * @warning The minimum value (-3) MUST stay in sync with the SCSS `@for` loop in `_theming.scss`!
 */
export const DENSITY_SCALE: ScaleDefinition = {
  min: -3, max: 0, step: 1, default: 0,
  presets: [
    { value: -3, label: 'Compact' },
    { value: 0,  label: 'Comfort' },
  ],
};

/** @note `label` values are English defaults. Override for i18n. */
export const MOTION_SCALE: ScaleDefinition = {
  min: 0, max: 1, step: 0.5, default: 1,
  presets: [
    { value: 0,   label: 'Off' },
    { value: 0.5, label: 'Fast' },
    { value: 1,   label: 'Normal' },
  ],
};

/** @note `label` values are English defaults. Override for i18n. */
export const CVD_SEVERITY_SCALE: ScaleDefinition = {
  min: 0, max: 100, step: 10, default: 100, // 0 allowed for "Hold to compare" UI logic
  presets: [] 
};

/** @note `label` values are English defaults. Override for i18n. */
export const SCREEN_FILTER_INTENSITY_SCALE: ScaleDefinition = {
  min: 0, max: 100, step: 10, default: 50,
  presets: []
};

/** @note `label` values are English defaults. Override for i18n. */
export const SNACKBAR_V_POSITIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' }
] as const;

/** @note `label` values are English defaults. Override for i18n. */
export const SNACKBAR_H_POSITIONS = [
  { value: 'start', label: 'Start (Left)' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End (Right)' }
] as const;

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
 * @note The `label` and `desc` properties are English defaults. 
 * For i18n (Internationalization), map the `value` keys to your own translation dictionaries. 
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


export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#3b6fd6' };

// --- DEFAULT STATE ---
export const DEFAULT_PREFERENCES_STATE: Required<PreferencesState> = {
  _v: 2,
  color: {
    mode: 'auto',
    autoContrast: true,
    contrastLevel: CONTRAST_SCALE.default,
    scheme: 'custom',
    variant: 'tonal-spot',
    customColors: DEFAULT_CUSTOM_COLORS,
    savedProfiles: [],
  },
  accessibility: {
    cvd: 'none',
    cvdSeverity: CVD_SEVERITY_SCALE.default,
    cvdIntent: 'simulate',
    screenFilter: 'none',
    screenFilterIntensity: SCREEN_FILTER_INTENSITY_SCALE.default,
  },
  typography: {
    headingFontFamily: 'Roboto',
    bodyFontFamily: 'Roboto',
    fontScale: FONT_SCALE.default,
  },
  layout: {
    shapeScale: SHAPE_SCALE.default,
    densityScale: DENSITY_SCALE.default,
    motionScale: MOTION_SCALE.default,
  },
  notifications: {
    snackbarHPosition: 'center',
    snackbarVPosition: 'top',
  }
};

export function isValidHexColor(value: string | undefined | null): value is string {
  return !!value && HEX_COLOR_PATTERN.test(value.trim());
}