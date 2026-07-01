import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ColorScheme,
  PresetColorScheme,
  PRESET_COLOR_SCHEMES,
  CustomColors,
  CustomProfile,
  DEFAULT_THEME_STATE,
  isValidHexColor,
  ThemeMode,
  THEME_MODES,
  ThemeState,
  THEME_STORAGE_KEY,
  ContrastMode,
  CvdMode,
} from '../models/theme.model';
import { ColorEngine, MatSysColorTokens } from '../utils/color-engine';

const PRESET_BASE_COLORS: Record<PresetColorScheme, CustomColors> = {
  blue: { primary: '#3b6fd6' },
  green: { primary: '#006e1c' },
  purple: { primary: '#6750a4' },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly modeSignal = signal<ThemeMode>(DEFAULT_THEME_STATE.mode);
  private readonly contrastSignal = signal<ContrastMode>(
    DEFAULT_THEME_STATE.contrast,
  );
  private readonly schemeSignal = signal<ColorScheme>(
    DEFAULT_THEME_STATE.scheme,
  );
  private readonly customColorsSignal = signal<CustomColors>(
    DEFAULT_THEME_STATE.customColors,
  );
  private readonly savedProfilesSignal = signal<CustomProfile[]>(
    DEFAULT_THEME_STATE.savedProfiles,
  );

  // OS Media Query listeners
  private readonly prefersDark = signal<boolean>(false);
  private readonly prefersHighContrast = signal<boolean>(false);

  private readonly fontFamilySignal = signal<string>(
    DEFAULT_THEME_STATE.fontFamily,
  );
  private readonly fontScaleSignal = signal<number>(
    DEFAULT_THEME_STATE.fontScale,
  );

  readonly fontFamily = this.fontFamilySignal.asReadonly();
  readonly fontScale = this.fontScaleSignal.asReadonly();

  readonly mode = this.modeSignal.asReadonly();
  readonly contrast = this.contrastSignal.asReadonly();
  readonly scheme = this.schemeSignal.asReadonly();
  readonly customColors = this.customColorsSignal.asReadonly();
  readonly savedProfiles = this.savedProfilesSignal.asReadonly();

  /** Resolves 'auto' mode into actual 'light' or 'dark' based on OS */
  readonly resolvedMode = computed<'light' | 'dark'>(() => {
    return this.modeSignal() === 'auto'
      ? this.prefersDark()
        ? 'dark'
        : 'light'
      : (this.modeSignal() as 'light' | 'dark');
  });

  /** Resolves 'auto' contrast into true/false based on OS */
  readonly resolvedHighContrast = computed<boolean>(() => {
    return this.contrastSignal() === 'auto'
      ? this.prefersHighContrast()
      : this.contrastSignal() === 'high';
  });

  readonly activeCustomColors = computed<CustomColors>(() => {
    const scheme = this.schemeSignal();
    if (scheme === 'custom') return this.customColorsSignal();
    const profile = this.savedProfilesSignal().find((p) => p.id === scheme);
    return profile ? profile.colors : this.customColorsSignal();
  });

  readonly activeProfile = computed<CustomProfile | undefined>(() => {
    return this.savedProfilesSignal().find((p) => p.id === this.schemeSignal());
  });

  private readonly cvdSignal = signal<CvdMode>(DEFAULT_THEME_STATE.cvd);
  readonly cvd = this.cvdSignal.asReadonly();

  readonly theme = computed<ThemeState>(() => ({
    mode: this.modeSignal(),
    contrast: this.contrastSignal(),
    scheme: this.schemeSignal(),
    customColors: this.customColorsSignal(),
    savedProfiles: this.savedProfilesSignal(),
    cvd: this.cvdSignal(),
    fontFamily: this.fontFamilySignal(),
    fontScale: this.fontScaleSignal(),
  }));

  // Setters
  setCvdMode(mode: CvdMode): void {
    this.cvdSignal.set(mode);
  }

  setFontFamily(family: string): void {
    this.fontFamilySignal.set(family);
  }
  setFontScale(scale: number): void {
    this.fontScaleSignal.set(scale);
  }

  constructor() {
    this.initMediaListeners();
    this.injectCvdFilters();
    this.restoreFromStorage();

    effect(() => {
      const state = this.theme();
      this.applyToDocument(state);
      this.persist(state);
    });
  }

  private readonly activeTokenPair = computed(() =>
    ColorEngine.buildTokenPair(this.activeCustomColors()),
  );

  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
  }
  setContrast(contrast: ContrastMode): void {
    this.contrastSignal.set(contrast);
  }
  setScheme(scheme: ColorScheme): void {
    this.schemeSignal.set(scheme);
  }

  saveCurrentAsProfile(name: string): void {
    const newId = 'profile-' + Date.now();
    this.savedProfilesSignal.update((p) => [
      ...p,
      { id: newId, name, colors: { ...this.activeCustomColors() } },
    ]);
    this.schemeSignal.set(newId);
  }

  updateActiveProfileName(name: string): void {
    const current = this.schemeSignal();
    if (current.startsWith('profile-')) {
      this.savedProfilesSignal.update((profiles) =>
        profiles.map((p) => (p.id === current ? { ...p, name } : p)),
      );
    }
  }

  deleteActiveProfile(): void {
    const current = this.schemeSignal();
    if (current.startsWith('profile-')) {
      this.savedProfilesSignal.update((p) => p.filter((x) => x.id !== current));
      this.schemeSignal.set('custom');
    }
  }

  setCustomColors(colors: Partial<CustomColors>): void {
    const currentScheme = this.schemeSignal();
    if (currentScheme !== 'custom' && !currentScheme.startsWith('profile-'))
      this.schemeSignal.set('custom');

    const nextColors = { ...this.activeCustomColors() };
    if (colors.primary !== undefined && isValidHexColor(colors.primary))
      nextColors.primary = colors.primary;

    const ROLES = [
      'secondary',
      'tertiary',
      'error',
      'success',
      'warning',
      'info',
    ] as const;
    for (const role of ROLES) {
      if (colors[role] !== undefined) {
        const val = colors[role];
        nextColors[role] = val && isValidHexColor(val) ? val : undefined;
      }
    }

    if (this.schemeSignal() === 'custom') {
      this.customColorsSignal.set(nextColors);
    } else {
      this.savedProfilesSignal.update((profiles) =>
        profiles.map((p) =>
          p.id === this.schemeSignal() ? { ...p, colors: nextColors } : p,
        ),
      );
    }
  }

  clearCustomColorRole(
    role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info',
  ): void {
    const nextColors = { ...this.activeCustomColors() };
    delete nextColors[role];

    if (this.schemeSignal() === 'custom') {
      this.customColorsSignal.set(nextColors);
    } else {
      this.savedProfilesSignal.update((profiles) =>
        profiles.map((p) =>
          p.id === this.schemeSignal() ? { ...p, colors: nextColors } : p,
        ),
      );
    }
  }

  suggestedCustomDefaults() {
    return ColorEngine.suggestDefaults(this.activeCustomColors().primary);
  }

  private applyToDocument(state: ThemeState): void {
    const root = document.documentElement;
    // Apply Vision/Accessibility Simulation Filter
    if (state.cvd === 'blur') {
      root.style.filter = 'blur(1.5px) contrast(0.95)';
    } else if (state.cvd === 'glare') {
      root.style.filter = 'contrast(0.75) brightness(1.15) sepia(0.1)';
    } else if (state.cvd === 'nightshift') {
      root.style.filter = 'sepia(0.35) hue-rotate(-15deg) contrast(0.9)';
    } else if (state.cvd !== 'none') {
      root.style.filter = `url(#cvd-${state.cvd})`;
    } else {
      root.style.filter = '';
    }

    const activeMode = this.resolvedMode();
    const isHighContrast = this.resolvedHighContrast();

    root.setAttribute('data-theme-mode', activeMode);
    root.setAttribute('data-theme-scheme', state.scheme);
    root.style.colorScheme = activeMode;
    this.applyTypography(root, state.fontFamily, state.fontScale);

    const isPreset = PRESET_COLOR_SCHEMES.includes(
      state.scheme as PresetColorScheme,
    );
    const activeColors =
      state.scheme === 'custom'
        ? state.customColors
        : state.savedProfiles.find((p) => p.id === state.scheme)?.colors ||
          state.customColors;
    const baseColors = isPreset
      ? PRESET_BASE_COLORS[state.scheme as PresetColorScheme]
      : activeColors;

    if (isHighContrast) {
      root.setAttribute('data-theme-contrast', 'high');
      const hcTokens = ColorEngine.buildTokens(baseColors, activeMode, 1);
      this.applyTokens(root, hcTokens);
    } else {
      root.removeAttribute('data-theme-contrast');
      if (!isPreset) {
        this.applyTokens(root, this.activeTokenPair()[activeMode]);
      } else {
        this.clearCustomTokens(root);
        const presetTokens = ColorEngine.buildTokens(baseColors, activeMode, 0);
        this.applyTokens(root, {
          success: presetTokens.success,
          'on-success': presetTokens['on-success'],
          'success-container': presetTokens['success-container'],
          'on-success-container': presetTokens['on-success-container'],
          warning: presetTokens.warning,
          'on-warning': presetTokens['on-warning'],
          'warning-container': presetTokens['warning-container'],
          'on-warning-container': presetTokens['on-warning-container'],
          info: presetTokens.info,
          'on-info': presetTokens['on-info'],
          'info-container': presetTokens['info-container'],
          'on-info-container': presetTokens['on-info-container'],
        });
      }
    }
  }

  private applyTokens(
    root: HTMLElement,
    tokens: Partial<MatSysColorTokens>,
  ): void {
    for (const [token, value] of Object.entries(tokens))
      if (value) root.style.setProperty(`--mat-sys-${token}`, value);
  }

  private clearCustomTokens(root: HTMLElement): void {
    const sampleTokens = this.activeTokenPair().light;
    for (const token of Object.keys(sampleTokens))
      root.style.removeProperty(`--mat-sys-${token}`);
  }

  private persist(state: ThemeState): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  private initMediaListeners(): void {
    if (typeof window !== 'undefined') {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.prefersDark.set(darkQuery.matches);
      darkQuery.addEventListener('change', (e) =>
        this.prefersDark.set(e.matches),
      );

      const contrastQuery = window.matchMedia('(prefers-contrast: more)');
      this.prefersHighContrast.set(contrastQuery.matches);
      contrastQuery.addEventListener('change', (e) =>
        this.prefersHighContrast.set(e.matches),
      );
    }
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ThemeState> & {
        highContrast?: boolean;
      }; // Account for legacy boolean

      if (parsed.mode) this.modeSignal.set(parsed.mode);
      if (parsed.scheme) this.schemeSignal.set(parsed.scheme);
      if (parsed.savedProfiles)
        this.savedProfilesSignal.set(
          parsed.savedProfiles.map((p) => ({
            ...p,
            name: p.name || 'Saved Profile',
          })),
        );

      // Legacy support for your previous HighContrast boolean data!
      if (typeof parsed.highContrast === 'boolean') {
        this.contrastSignal.set(parsed.highContrast ? 'high' : 'normal');
      } else if (parsed.contrast) {
        this.contrastSignal.set(parsed.contrast);
      }

      if (parsed.customColors && isValidHexColor(parsed.customColors.primary)) {
        const restored: CustomColors = { primary: parsed.customColors.primary };
        const ROLES = [
          'secondary',
          'tertiary',
          'error',
          'success',
          'warning',
          'info',
        ] as const;
        for (const role of ROLES) {
          const value = parsed.customColors[role];
          if (isValidHexColor(value)) restored[role] = value;
        }
        this.customColorsSignal.set(restored);
      }
      if (parsed.cvd) this.cvdSignal.set(parsed.cvd);
      if (parsed.fontFamily) this.fontFamilySignal.set(parsed.fontFamily);
      if (parsed.fontScale) this.fontScaleSignal.set(parsed.fontScale);
    } catch {}
  }

  // Method to dynamically inject the SVG Color Matrices
  private injectCvdFilters(): void {
    if (
      typeof document === 'undefined' ||
      document.getElementById('cvd-filters-svg')
    )
      return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'cvd-filters-svg';
    svg.setAttribute('style', 'display: none; width: 0; height: 0;');

    // Mathematically accurate color matrices for vision deficiency simulation
    svg.innerHTML = `
    <defs>
      <!-- Red blind -->
      <filter id="cvd-protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
      </filter>
      <!-- Green blind -->
      <filter id="cvd-deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
      </filter>
      <!-- Blue blind -->
      <filter id="cvd-tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
      </filter>
      <!-- Monochromacy -->
      <filter id="cvd-achromatopsia">
        <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  `;
    document.body.appendChild(svg);
  }

  // Typography engine
  private applyTypography(root: HTMLElement, family: string, scale: number): void {
    if (typeof document === 'undefined') return;

    // Dynamically load Google Fonts if it's a web font (skipping OS fonts)
    if (!family.includes('system') && !family.includes('monospace') && family !== 'Roboto') {
      const urlFamily = family.replace(/\s+/g, '+');
      const linkId = `font-${urlFamily}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;500;700&display=swap`;
        document.head.appendChild(link);
      }
    }

    // Material 3 Typography Scale (Base Pixel Sizes & Line Heights)
    const roles = [
      { name: 'display-large', size: 57, lh: 64 }, { name: 'display-medium', size: 45, lh: 52 }, { name: 'display-small', size: 36, lh: 44 },
      { name: 'headline-large', size: 32, lh: 40 }, { name: 'headline-medium', size: 28, lh: 36 }, { name: 'headline-small', size: 24, lh: 32 },
      { name: 'title-large', size: 22, lh: 28 }, { name: 'title-medium', size: 16, lh: 24 }, { name: 'title-small', size: 14, lh: 20 },
      { name: 'body-large', size: 16, lh: 24 }, { name: 'body-medium', size: 14, lh: 20 }, { name: 'body-small', size: 12, lh: 16 },
      { name: 'label-large', size: 14, lh: 20 }, { name: 'label-medium', size: 12, lh: 16 }, { name: 'label-small', size: 11, lh: 16 },
    ];

    for (const role of roles) {
      root.style.setProperty(`--mat-sys-${role.name}-font`, family);
      root.style.setProperty(`--mat-sys-${role.name}-size`, `calc(${role.size}px * ${scale})`);
      root.style.setProperty(`--mat-sys-${role.name}-line-height`, `calc(${role.lh}px * ${scale})`);
    }

    // Apply font-family to standard non-Material HTML
    document.body.style.fontFamily = family;
    
    // FIX: Scale standard HTML elements (p, h1, span) by adjusting the root percentage!
    // A scale of 1.3 becomes 130%, naturally blowing up all 'rem' and inherited text.
    root.style.fontSize = `${scale * 100}%`;
  }
}
