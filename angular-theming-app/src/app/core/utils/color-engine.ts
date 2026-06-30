import {
  argbFromHex,
  hexFromArgb,
  Hct,
  TonalPalette,
  DynamicScheme,
} from '@material/material-color-utilities';
import { CustomColors, ThemeMode } from '../models/theme.model';

/**
 * @material/material-color-utilities@0.3.0 exports `Variant` in its type
 * declarations but not from the package's public ESM `exports` map, so it
 * can't be imported directly. Its value is part of Google's published M3
 * spec (https://github.com/material-foundation/material-color-utilities)
 * and is stable: TONAL_SPOT = 2. This is the same variant Angular
 * Material's own `mat.theme()` SCSS mixin uses for its preset palettes,
 * which is what keeps custom and preset themes visually consistent.
 */
const VARIANT_TONAL_SPOT = 2;

/**
 * Full set of M3 system color tokens, matching the CSS custom-property
 * names Angular Material emits via `mat.theme()` (the `--mat-sys-*` family).
 * Keys here are the *unprefixed* token names — ColorEngine's caller is
 * responsible for adding the `--mat-sys-` prefix when writing to the DOM.
 */
export interface MatSysColorTokens {
  // Native Angular Material vars
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
  // Custom vars
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
}

/**
 * ColorEngine
 * -----------
 * Thin, pure-function wrapper around @material/material-color-utilities —
 * the same color-science library Angular Material's own SCSS theming is
 * generated from. Given hex inputs for primary/secondary/tertiary/error,
 * it builds an M3 DynamicScheme and reads off every system color role as a
 * hex string, ready to apply as CSS custom properties.
 *
 * Design choices that protect contrast (per product requirement: dynamic
 * color input must not be able to make the app low-contrast or "blurry"):
 *  - Neutral/neutral-variant palettes (which drive background/surface/
 *    outline) are ALWAYS derived from primary's hue at M3's low spec'd
 *    chroma (6 / 8). User-chosen chroma never reaches a surface color, only
 *    role colors (primary/secondary/tertiary/error) — so surfaces stay
 *    reliably near-white in light mode and near-black in dark mode no
 *    matter how saturated a color the user picks.
 *  - Tone (lightness) for every role is fixed by the M3 spec per
 *    light/dark mode, not by user input — only hue + chroma come from the
 *    user. This is what guarantees on-primary-on-X pairs always meet
 *    contrast, the same guarantee Material's hard-coded palettes give.
 */
export class ColorEngine {
  /**
   * Builds a complete light AND dark token set from a CustomColors input.
   */
  static buildTokenPair(
    colors: CustomColors,
    contrastLevel = 0,
  ): { light: MatSysColorTokens; dark: MatSysColorTokens } {
    return {
      light: ColorEngine.buildTokens(colors, 'light', contrastLevel),
      dark: ColorEngine.buildTokens(colors, 'dark', contrastLevel),
    };
  }

  /**
   * Builds a single mode's token set.
   */
  static buildTokens(
    colors: CustomColors,
    mode: ThemeMode,
    contrastLevel = 0,
  ): MatSysColorTokens {
    const isDark = mode === 'dark';
    const scheme = ColorEngine.buildScheme(colors, isDark, contrastLevel);
    const argb = (value: number) => hexFromArgb(value);

    // Helper: Material 3 spec for generating a custom semantic color
    const buildSemanticTokens = (hex: string, name: string) => {
      const palette = TonalPalette.fromInt(argbFromHex(hex));
      return {
        [`${name}`]: argb(palette.tone(isDark ? 80 : 40)),
        [`on-${name}`]: argb(palette.tone(isDark ? 20 : 100)),
        [`${name}-container`]: argb(palette.tone(isDark ? 30 : 90)),
        [`on-${name}-container`]: argb(palette.tone(isDark ? 90 : 10)),
      };
    };

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

      // Merge the new semantic tokens in!
      ...buildSemanticTokens(colors.success || '#188038', 'success'),
      ...buildSemanticTokens(colors.warning || '#f29900', 'warning'),
      ...buildSemanticTokens(colors.info || '#1967d2', 'info'),
    } as MatSysColorTokens; // Cast ensures all keys match the interface
  }

  /**
   * Suggests a default secondary/tertiary/error hex (as the M3 spec's
   * TonalSpot variant would derive them from primary alone), so the color
   * picker UI can show a sensible starting point for optional fields
   * instead of leaving them blank.
   */
  static suggestDefaults(primaryHex: string): Required<CustomColors> {
    const primaryHct = Hct.fromInt(argbFromHex(primaryHex));
    return {
      primary: primaryHex,
      secondary: hexFromArgb(
        TonalPalette.fromHueAndChroma(primaryHct.hue, 16).tone(40),
      ),
      tertiary: hexFromArgb(
        TonalPalette.fromHueAndChroma(
          sanitizeDegrees(primaryHct.hue + 60),
          24,
        ).tone(40),
      ),
      error: hexFromArgb(TonalPalette.fromHueAndChroma(25, 84).tone(40)),
      success: '#188038', // Green
      warning: '#f29900', // Amber/Orange
      info: '#1967d2', // Blue
    };
  }

  /**
   * Builds a DynamicScheme with each role palette wired to its own user
   * color when provided, falling back to the spec-default derivation
   * (relative to primary's hue) otherwise. Neutral palettes always follow
   * primary's hue at fixed low chroma — see class doc for why.
   */
  private static buildScheme(
    colors: CustomColors,
    isDark: boolean,
    contrastLevel = 0,
  ): DynamicScheme {
    const primaryHct = Hct.fromInt(argbFromHex(colors.primary));

    const primaryPalette = TonalPalette.fromHueAndChroma(
      primaryHct.hue,
      Math.max(primaryHct.chroma, 36),
    );

    const secondaryPalette = colors.secondary
      ? TonalPalette.fromInt(argbFromHex(colors.secondary))
      : TonalPalette.fromHueAndChroma(primaryHct.hue, 16);

    const tertiaryPalette = colors.tertiary
      ? TonalPalette.fromInt(argbFromHex(colors.tertiary))
      : TonalPalette.fromHueAndChroma(sanitizeDegrees(primaryHct.hue + 60), 24);

    const neutralPalette = TonalPalette.fromHueAndChroma(primaryHct.hue, 6);
    const neutralVariantPalette = TonalPalette.fromHueAndChroma(
      primaryHct.hue,
      8,
    );

    const scheme = new DynamicScheme({
      sourceColorArgb: primaryHct.toInt(),
      variant: VARIANT_TONAL_SPOT,
      contrastLevel,
      isDark,
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
    });

    if (colors.error) {
      scheme.errorPalette = TonalPalette.fromInt(argbFromHex(colors.error));
    }

    return scheme;
  }
}

function sanitizeDegrees(degrees: number): number {
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}
