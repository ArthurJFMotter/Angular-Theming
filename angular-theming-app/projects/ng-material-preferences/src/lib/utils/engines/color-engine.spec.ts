import {
  argbFromHex,
  Hct,
  hexFromArgb,
  TonalPalette,
} from '@material/material-color-utilities';
import { ColorEngine } from './color-engine';

describe('ColorEngine', () => {
  const mockCustomColors = {
    primary: '#3b6fd6', // Blue
    extended: [{ id: 'brand', label: 'Brand', color: '#ff0000' }], // Red
  };

  it('should generate a full M3 token set from a primary hex', () => {
    const tokens = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'tonal-spot',
    );

    // Core properties should exist
    expect(tokens.primary).toBeDefined();
    expect(tokens.surface).toBeDefined();
    expect(tokens.background).toBeDefined();

    // Semantic tokens should fall back to safe defaults if not provided
    expect(tokens.success).toBeDefined();
    expect(tokens['on-success']).toBeDefined();
  });

  it('should generate extended custom color tokens', () => {
    const tokens = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'tonal-spot',
    );

    // Our 'brand' extended color should generate a full 4-token set
    expect(tokens['brand']).toBeDefined();
    expect(tokens['on-brand']).toBeDefined();
    expect(tokens['brand-container']).toBeDefined();
    expect(tokens['on-brand-container']).toBeDefined();
  });

  it('should suggest safe defaults based on the primary color', () => {
    const suggestions = ColorEngine.suggestDefaults('#3b6fd6', 'vibrant');

    expect(suggestions.primary).toBe('#3b6fd6');
    expect(suggestions.secondary).toBeDefined();
    expect(suggestions.tertiary).toBeDefined();
    expect(suggestions.error).toBeDefined();
    expect(Array.isArray(suggestions.extended)).toBeTrue();
  });

  it('should shift tones in dark mode', () => {
    const light = ColorEngine.buildTokens(mockCustomColors, 'light');
    const dark = ColorEngine.buildTokens(mockCustomColors, 'dark');
    expect(light.primary).not.toBe(dark.primary); // Dark mode generates lighter primary tones
  });

  it('should shift container tones aggressively in High Contrast mode', () => {
    const normal = ColorEngine.buildTokens(mockCustomColors, 'light', 0);
    const high = ColorEngine.buildTokens(mockCustomColors, 'light', 1.0);
    expect(normal['primary-container']).not.toBe(high['primary-container']);
  });

  it('should respect Scheme Variants (Monochrome vs Vibrant)', () => {
    const monochrome = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'monochrome',
    );
    const vibrant = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'vibrant',
    );
    expect(monochrome.primary).not.toBe(vibrant.primary);
  });

  it('should generate comma-separated RGB channel tokens for state layer opacities', () => {
    const tokens = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'tonal-spot',
    );

    expect(tokens['primary-channel']).toBeDefined();

    // Crucial regression test: Ensure it formats as "R, G, B" (with commas!) and NOT as hex or missing commas
    expect(tokens['primary-channel']).toMatch(/^\d{1,3}, \d{1,3}, \d{1,3}$/);

    // Ensure semantic colors also get channels
    expect(tokens['success-channel']).toBeDefined();
  });

  it('should preserve semantic color hue/chroma regardless of Scheme Variant (Ticket Fix)', () => {
    // We pass a bright green for success
    const colorsWithSemantic = { ...mockCustomColors, success: '#00ff00' };

    // Build tokens using the Monochrome variant
    const monochromeTokens = ColorEngine.buildTokens(
      colorsWithSemantic,
      'light',
      0,
      'monochrome',
    );

    // The primary color SHOULD be desaturated (gray) because of Monochrome
    const primaryHct = Hct.fromInt(argbFromHex(monochromeTokens.primary));
    expect(primaryHct.chroma).toBeLessThan(5); // Chroma is near 0 for grays

    // The semantic Success color SHOULD NOT be desaturated! It must remain green.
    const successHct = Hct.fromInt(argbFromHex(monochromeTokens.success));
    expect(successHct.chroma).toBeGreaterThan(40); // High chroma means it kept its vibrant color
  });

  it('should keep success identical between tonal-spot and monochrome variants', () => {
    const tonalSpot = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'tonal-spot',
    );
    const monochrome = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'monochrome',
    );

    expect(monochrome.success).toBe(tonalSpot.success);
    expect(monochrome['success-container']).toBe(
      tonalSpot['success-container'],
    );
  });

  it('should preserve extended color hue under monochrome variant', () => {
    // mockCustomColors.extended already includes { id: 'brand', color: '#ff0000' }
    const monochrome = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'monochrome',
    );
    const brandHct = Hct.fromInt(argbFromHex(monochrome['brand']));

    // Pure red has high chroma. Monochrome backgrounds have ~0 chroma.
    // This proves the custom color skipped the monochrome flattening!
    expect(brandHct.chroma).toBeGreaterThan(40);
  });

  it('should produce mathematically unchanged token output under the default tonal-spot variant', () => {
    // Regression guard: Ensures our new direct TonalPalette generation matches
    // the expected MCU math for the default #188038 success green at tone 40.
    const tokens = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'tonal-spot',
    );

    const defaultSuccessInt = argbFromHex('#188038');
    const expectedTone40Hex = hexFromArgb(
      TonalPalette.fromInt(defaultSuccessInt).tone(40),
    );

    expect(tokens.success).toBe(expectedTone40Hex);
  });

  it('should keep success/warning/info visually distinct from each other under monochrome', () => {
    const tokens = ColorEngine.buildTokens(
      mockCustomColors,
      'light',
      0,
      'monochrome',
    );

    // If they were subjected to monochrome math, they would all collapse into nearly identical greys.
    // This proves they retained their distinct hues.
    expect(tokens.success).not.toBe(tokens.warning);
    expect(tokens.warning).not.toBe(tokens.info);
    expect(tokens.success).not.toBe(tokens.info);
  });
});
