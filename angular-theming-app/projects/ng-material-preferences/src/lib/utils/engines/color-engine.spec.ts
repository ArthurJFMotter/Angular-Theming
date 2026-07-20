import { ColorEngine } from './color-engine';

describe('ColorEngine', () => {
  const mockCustomColors = {
    primary: '#3b6fd6', // Blue
    extended: [{ id: 'brand', label: 'Brand', color: '#ff0000' }] // Red
  };

  it('should generate a full M3 token set from a primary hex', () => {
    const tokens = ColorEngine.buildTokens(mockCustomColors, 'light', 0, 'tonal-spot');
    
    // Core properties should exist
    expect(tokens.primary).toBeDefined();
    expect(tokens.surface).toBeDefined();
    expect(tokens.background).toBeDefined();
    
    // Semantic tokens should fall back to safe defaults if not provided
    expect(tokens.success).toBeDefined();
    expect(tokens['on-success']).toBeDefined();
  });

  it('should generate extended custom color tokens', () => {
    const tokens = ColorEngine.buildTokens(mockCustomColors, 'light', 0, 'tonal-spot');
    
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
    const monochrome = ColorEngine.buildTokens(mockCustomColors, 'light', 0, 'monochrome');
    const vibrant = ColorEngine.buildTokens(mockCustomColors, 'light', 0, 'vibrant');
    expect(monochrome.primary).not.toBe(vibrant.primary);
  });
});