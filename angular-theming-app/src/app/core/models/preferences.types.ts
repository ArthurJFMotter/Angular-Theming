import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high' | 'auto';
export type ColorScheme = string; // Either 'custom' or a profile ID
export type SchemeVariant = 'tonal-spot' | 'vibrant' | 'expressive' | 'neutral' | 'monochrome' | 'fidelity' | 'content';
export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type ScreenFilter = 'none' | 'blur' | 'glare' | 'nightshift';

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

export interface PreferencesState {
  mode: ThemeMode;
  autoContrast: boolean;
  contrastLevel: number; // -1.0 to 1.0
  scheme: ColorScheme;
  variant: SchemeVariant;
  customColors: CustomColors;
  savedProfiles: CustomProfile[];
  cvd: CvdMode;
  cvdSeverity: number; // 0 to 100
  screenFilter: ScreenFilter;
  screenFilterIntensity: number; // 0 to 100
  headingFontFamily: string;
  bodyFontFamily: string;
  fontScale: number;
  shapeScale: number;
  densityScale: number;
  motionScale: number;
  snackbarHPosition: MatSnackBarHorizontalPosition;
  snackbarVPosition: MatSnackBarVerticalPosition;
}
