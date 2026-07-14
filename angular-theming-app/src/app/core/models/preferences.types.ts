import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high' | 'auto';
export type ColorScheme = string; // Either 'custom' or a profile ID
export type SchemeVariant = 'tonal-spot' | 'vibrant' | 'expressive' | 'neutral' | 'monochrome' | 'fidelity' | 'content';
export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type CvdIntent = 'simulate' | 'compensate';
export type ScreenFilter = 'none' | 'blur' | 'glare' | 'nightshift' | 'astigmatism' | 'macular' | 'glaucoma';

export interface ExtendedColor {
  id: string;
  label: string;
  color: string; // Hex value
}

export interface CustomColors {
  primary: string;
  secondary?: string;
  tertiary?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  extended?: ExtendedColor[];
}

export interface CustomProfile {
  id: string;
  name: string;
  colors: CustomColors;
}

// Domain Slices
export interface ColorPreferences {
  mode: ThemeMode;
  autoContrast: boolean;
  contrastLevel: number;
  scheme: ColorScheme;
  variant: SchemeVariant;
  customColors: CustomColors;
  savedProfiles: CustomProfile[];
}

export interface AccessibilityPreferences {
  cvd: CvdMode;
  cvdSeverity: number;
  cvdIntent: CvdIntent;
  screenFilter: ScreenFilter;
  screenFilterIntensity: number;
}

export interface TypographyPreferences {
  headingFontFamily: string;
  bodyFontFamily: string;
  fontScale: number;
}

export interface LayoutPreferences {
  shapeScale: number;
  densityScale: number;
  motionScale: number;
}

export interface NotificationPreferences {
  snackbarHPosition: MatSnackBarHorizontalPosition;
  snackbarVPosition: MatSnackBarVerticalPosition;
}

// Master State Compose (EVERY domain is optional)
export interface PreferencesState {
  color?: ColorPreferences;
  accessibility?: AccessibilityPreferences;
  typography?: TypographyPreferences;
  layout?: LayoutPreferences;
  notifications?: NotificationPreferences;
}