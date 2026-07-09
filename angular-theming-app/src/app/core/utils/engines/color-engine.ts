import {
  argbFromHex,
  hexFromArgb,
  Hct,
  TonalPalette,
  DynamicScheme,
  SchemeTonalSpot,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeFidelity,
  SchemeContent
} from '@material/material-color-utilities';
import { CustomColors, SchemeVariant, ThemeMode } from '../../models/preferences.types';

export interface MatSysColorTokens {
  primary: string;
  'on-primary': string;
  'primary-container': string;
  'on-primary-container': string;
  secondary: string;
  'on-secondary': string;
  'secondary-container': string;
  'on-secondary-container': string;
  tertiary: string;
  'on-tertiary': string;
  'tertiary-container': string;
  'on-tertiary-container': string;
  error: string;
  'on-error': string;
  'error-container': string;
  'on-error-container': string;
  background: string;
  'on-background': string;
  surface: string;
  'on-surface': string;
  'surface-variant': string;
  'on-surface-variant': string;
  'surface-dim': string;
  'surface-bright': string;
  'surface-container-lowest': string;
  'surface-container-low': string;
  'surface-container': string;
  'surface-container-high': string;
  'surface-container-highest': string;
  outline: string;
  'outline-variant': string;
  'inverse-surface': string;
  'inverse-on-surface': string;
  'inverse-primary': string;
  'surface-tint': string;
  shadow: string;
  scrim: string;
  success: string;
  'on-success': string;
  'success-container': string;
  'on-success-container': string;
  warning: string;
  'on-warning': string;
  'warning-container': string;
  'on-warning-container': string;
  info: string;
  'on-info': string;
  'info-container': string;
  'on-info-container': string;
  [key: string]: string; 
}

export class ColorEngine {
  static buildTokenPair(colors: CustomColors, contrastLevel = 0, variant: SchemeVariant = 'tonal-spot') {
    return {
      light: ColorEngine.buildTokens(colors, 'light', contrastLevel, variant),
      dark: ColorEngine.buildTokens(colors, 'dark', contrastLevel, variant),
    };
  }

  static buildTokens(colors: CustomColors, mode: ThemeMode, contrastLevel = 0, variant: SchemeVariant = 'tonal-spot'): MatSysColorTokens {
    const isDark = mode === 'dark';
    const scheme = ColorEngine.buildScheme(colors, isDark, contrastLevel, variant);
    const argb = (value: number) => hexFromArgb(value);

    const buildSemanticTokens = (hex: string, name: string) => {
      const palette = TonalPalette.fromInt(argbFromHex(hex));
      
      let tBase = isDark ? 80 : 40;
      let tOnBase = isDark ? 20 : 100;
      let tContainer = isDark ? 30 : 90;
      let tOnContainer = isDark ? 90 : 10;
      
      if (contrastLevel >= 0.5) { 
        tBase = isDark ? 90 : 30;
        tOnBase = isDark ? 0 : 100;
        tContainer = isDark ? 20 : 85;
        tOnContainer = isDark ? 100 : 0;
      }

      return {
        [`${name}`]: argb(palette.tone(tBase)),
        [`on-${name}`]: argb(palette.tone(tOnBase)),
        [`${name}-container`]: argb(palette.tone(tContainer)),
        [`on-${name}-container`]: argb(palette.tone(tOnContainer))
      };
    };

    const extendedTokens: Record<string, string> = {};
    if (colors.extended) {
      for (const ext of colors.extended) {
        Object.assign(extendedTokens, buildSemanticTokens(ext.color, ext.id));
      }
    }

    return {
      primary: argb(scheme.primary),
      'on-primary': argb(scheme.onPrimary),
      'primary-container': argb(scheme.primaryContainer),
      'on-primary-container': argb(scheme.onPrimaryContainer),
      secondary: argb(scheme.secondary),
      'on-secondary': argb(scheme.onSecondary),
      'secondary-container': argb(scheme.secondaryContainer),
      'on-secondary-container': argb(scheme.onSecondaryContainer),
      tertiary: argb(scheme.tertiary),
      'on-tertiary': argb(scheme.onTertiary),
      'tertiary-container': argb(scheme.tertiaryContainer),
      'on-tertiary-container': argb(scheme.onTertiaryContainer),
      error: argb(scheme.error),
      'on-error': argb(scheme.onError),
      'error-container': argb(scheme.errorContainer),
      'on-error-container': argb(scheme.onErrorContainer),
      background: argb(scheme.background),
      'on-background': argb(scheme.onBackground),
      surface: argb(scheme.surface),
      'on-surface': argb(scheme.onSurface),
      'surface-variant': argb(scheme.surfaceVariant),
      'on-surface-variant': argb(scheme.onSurfaceVariant),
      'surface-dim': argb(scheme.surfaceDim),
      'surface-bright': argb(scheme.surfaceBright),
      'surface-container-lowest': argb(scheme.surfaceContainerLowest),
      'surface-container-low': argb(scheme.surfaceContainerLow),
      'surface-container': argb(scheme.surfaceContainer),
      'surface-container-high': argb(scheme.surfaceContainerHigh),
      'surface-container-highest': argb(scheme.surfaceContainerHighest),
      outline: argb(scheme.outline),
      'outline-variant': argb(scheme.outlineVariant),
      'inverse-surface': argb(scheme.inverseSurface),
      'inverse-on-surface': argb(scheme.inverseOnSurface),
      'inverse-primary': argb(scheme.inversePrimary),
      'surface-tint': argb(scheme.primary),
      shadow: argb(scheme.shadow),
      scrim: argb(scheme.scrim),
      
      ...buildSemanticTokens(colors.success || '#188038', 'success'),
      ...buildSemanticTokens(colors.warning || '#f29900', 'warning'),
      ...buildSemanticTokens(colors.info || '#1967d2', 'info'),
      ...extendedTokens
    } as MatSysColorTokens;
  }

  static suggestDefaults(primaryHex: string, variant: SchemeVariant = 'tonal-spot'): Required<CustomColors> {
    const primaryHct = Hct.fromInt(argbFromHex(primaryHex));
    const mockScheme = ColorEngine.buildScheme({ primary: primaryHex }, false, 0, variant);

    return {
      primary: primaryHex,
      secondary: hexFromArgb(mockScheme.secondaryPalette.tone(40)),
      tertiary: hexFromArgb(mockScheme.tertiaryPalette.tone(40)),
      // Fallback used safely just in case the Scheme version doesn't initialize errorPalette immediately
      error: hexFromArgb((mockScheme as any).errorPalette?.tone(40) || TonalPalette.fromHueAndChroma(25, 84).tone(40)),
      success: '#188038', 
      warning: '#f29900', 
      info: '#1967d2', 
      extended: []
    };
  }

  private static buildScheme(
    colors: CustomColors,
    isDark: boolean,
    contrastLevel = 0,
    variant: SchemeVariant = 'tonal-spot'
  ): DynamicScheme {
    const primaryHct = Hct.fromInt(argbFromHex(colors.primary));
    let scheme: DynamicScheme;

    // 1. Initialize the correct Google scheme class
    switch (variant) {
      case 'vibrant': scheme = new SchemeVibrant(primaryHct, isDark, contrastLevel); break;
      case 'expressive': scheme = new SchemeExpressive(primaryHct, isDark, contrastLevel); break;
      case 'neutral': scheme = new SchemeNeutral(primaryHct, isDark, contrastLevel); break;
      case 'monochrome': scheme = new SchemeMonochrome(primaryHct, isDark, contrastLevel); break;
      case 'fidelity': scheme = new SchemeFidelity(primaryHct, isDark, contrastLevel); break;
      case 'content': scheme = new SchemeContent(primaryHct, isDark, contrastLevel); break;
      case 'tonal-spot':
      default:
        scheme = new SchemeTonalSpot(primaryHct, isDark, contrastLevel); break;
    }

    // 2. Forcefully override the palettes if the user has locked custom colors.
    // Bypassing the TypeScript readonly constraint with (scheme as any) guarantees 
    // the variant math is preserved for everything else!
    if (colors.secondary) {
      (scheme as any).secondaryPalette = TonalPalette.fromInt(argbFromHex(colors.secondary));
    }
    if (colors.tertiary) {
      (scheme as any).tertiaryPalette = TonalPalette.fromInt(argbFromHex(colors.tertiary));
    }
    if (colors.error) {
      (scheme as any).errorPalette = TonalPalette.fromInt(argbFromHex(colors.error));
    }

    return scheme;
  }
}