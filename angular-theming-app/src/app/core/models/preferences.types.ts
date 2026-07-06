export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high' | 'auto';
export type ColorScheme = string; // Either 'custom' or a profile ID
export type CvdMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'blur' | 'glare' | 'nightshift';

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

export interface PreferencesState {
  mode: ThemeMode;
  contrast: ContrastMode;
  scheme: ColorScheme;
  customColors: CustomColors;
  savedProfiles: CustomProfile[];
  cvd: CvdMode;
  fontFamily: string;
  fontScale: number;
  shapeScale: number;
  densityScale: number;
}