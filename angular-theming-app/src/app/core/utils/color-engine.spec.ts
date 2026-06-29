import { ColorEngine } from './color-engine';
import { argbFromHex } from '@material/material-color-utilities';

/** Minimal WCAG relative-luminance contrast ratio, mirrors the spec formula. */
function contrastRatio(hexA: string, hexB: string): number {
  const luminance = (hex: string): number => {
    const argb = argbFromHex(hex);
    const r = ((argb >> 16) & 0xff) / 255;
    const g = ((argb >> 8) & 0xff) / 255;
    const b = (argb & 0xff) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const l1 = luminance(hexA);
  const l2 = luminance(hexB);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

describe('ColorEngine', () => {
  const extremeInputs = [
    { name: 'typical blue', primary: '#3b6fd6' },
    { name: 'very pale pastel', primary: '#fef6fb' },
    { name: 'near-black', primary: '#0a0a12' },
    { name: 'max saturation red', primary: '#ff0000' },
    { name: 'neon green', primary: '#39ff14' }
  ];

  for (const mode of ['light', 'dark'] as const) {
    describe(`${mode} mode`, () => {
      for (const input of extremeInputs) {
        it(`keeps role/on-role pairs above WCAG AA (4.5:1) for ${input.name}`, () => {
          const tokens = ColorEngine.buildTokens({ primary: input.primary }, mode);

          const pairs: Array<[string, string]> = [
            [tokens.primary, tokens['on-primary']],
            [tokens.secondary, tokens['on-secondary']],
            [tokens.tertiary, tokens['on-tertiary']],
            [tokens.error, tokens['on-error']],
            [tokens.surface, tokens['on-surface']],
            [tokens['primary-container'], tokens['on-primary-container']]
          ];

          for (const [fg, bg] of pairs) {
            expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
          }
        });

        it(`keeps light-mode surfaces near-white / dark-mode surfaces near-black for ${input.name}`, () => {
          const tokens = ColorEngine.buildTokens({ primary: input.primary }, mode);
          const surfaceLuminance = relativeLuminance(tokens.surface);

          if (mode === 'light') {
            expect(surfaceLuminance).toBeGreaterThan(0.85);
          } else {
            expect(surfaceLuminance).toBeLessThan(0.05);
          }
        });
      }

      it('keeps contrast safe even when secondary/tertiary/error clash wildly with primary', () => {
        const tokens = ColorEngine.buildTokens(
          { primary: '#3b6fd6', secondary: '#ff00ff', tertiary: '#ffff00', error: '#000000' },
          mode
        );

        expect(contrastRatio(tokens.secondary, tokens['on-secondary'])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(tokens.tertiary, tokens['on-tertiary'])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(tokens.error, tokens['on-error'])).toBeGreaterThanOrEqual(4.5);
      });
    });
  }

  it('produces a different primary hex for different input hues', () => {
    const blue = ColorEngine.buildTokens({ primary: '#3b6fd6' }, 'light');
    const green = ColorEngine.buildTokens({ primary: '#2e8b57' }, 'light');

    expect(blue.primary).not.toBe(green.primary);
  });

  it('suggestDefaults derives secondary/tertiary/error from the given primary', () => {
    const defaults = ColorEngine.suggestDefaults('#3b6fd6');

    expect(defaults.primary).toBe('#3b6fd6');
    expect(defaults.secondary).toMatch(/^#[0-9a-f]{6}$/i);
    expect(defaults.tertiary).toMatch(/^#[0-9a-f]{6}$/i);
    expect(defaults.error).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

function relativeLuminance(hex: string): number {
  const argb = argbFromHex(hex);
  const r = ((argb >> 16) & 0xff) / 255;
  const g = ((argb >> 8) & 0xff) / 255;
  const b = (argb & 0xff) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
