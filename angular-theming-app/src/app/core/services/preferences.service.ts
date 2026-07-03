import { Injectable, signal, computed, effect } from '@angular/core';
import {
  ColorScheme, CustomColors, CustomProfile,
  DEFAULT_PREFERENCES_STATE, isValidHexColor, ThemeMode, PreferencesState,
  PREFERENCES_STORAGE_KEY, ContrastMode, CvdMode
} from '../models/preferences.model';
import { ColorEngine } from '../utils/color-engine';
import { DomEngine } from '../utils/dom-engine';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  // State Signals
  private readonly modeSignal = signal<ThemeMode>(DEFAULT_PREFERENCES_STATE.mode);
  private readonly contrastSignal = signal<ContrastMode>(DEFAULT_PREFERENCES_STATE.contrast);
  private readonly schemeSignal = signal<ColorScheme>(DEFAULT_PREFERENCES_STATE.scheme);
  private readonly customColorsSignal = signal<CustomColors>(DEFAULT_PREFERENCES_STATE.customColors);
  private readonly savedProfilesSignal = signal<CustomProfile[]>(DEFAULT_PREFERENCES_STATE.savedProfiles);
  private readonly cvdSignal = signal<CvdMode>(DEFAULT_PREFERENCES_STATE.cvd);
  private readonly fontFamilySignal = signal<string>(DEFAULT_PREFERENCES_STATE.fontFamily);
  private readonly fontScaleSignal = signal<number>(DEFAULT_PREFERENCES_STATE.fontScale);
  private readonly shapeScaleSignal = signal<number>(DEFAULT_PREFERENCES_STATE.shapeScale);
  private readonly densityScaleSignal = signal<number>(DEFAULT_PREFERENCES_STATE.densityScale);

  // OS Listeners
  private readonly prefersDark = signal<boolean>(false);
  private readonly prefersHighContrast = signal<boolean>(false);

  // Readonly exposures
  readonly mode = this.modeSignal.asReadonly();
  readonly contrast = this.contrastSignal.asReadonly();
  readonly scheme = this.schemeSignal.asReadonly();
  readonly customColors = this.customColorsSignal.asReadonly();
  readonly savedProfiles = this.savedProfilesSignal.asReadonly();
  readonly cvd = this.cvdSignal.asReadonly();
  readonly fontFamily = this.fontFamilySignal.asReadonly();
  readonly fontScale = this.fontScaleSignal.asReadonly();
  readonly shapeScale = this.shapeScaleSignal.asReadonly();
  readonly densityScale = this.densityScaleSignal.asReadonly();

  readonly resolvedMode = computed<'light' | 'dark'>(() => 
    this.modeSignal() === 'auto' ? (this.prefersDark() ? 'dark' : 'light') : (this.modeSignal() as 'light' | 'dark')
  );

  readonly resolvedHighContrast = computed<boolean>(() => 
    this.contrastSignal() === 'auto' ? this.prefersHighContrast() : this.contrastSignal() === 'high'
  );

  readonly activeCustomColors = computed<CustomColors>(() => {
    const scheme = this.schemeSignal();
    if (scheme === 'custom') return this.customColorsSignal();
    const profile = this.savedProfilesSignal().find((p) => p.id === scheme);
    return profile ? profile.colors : this.customColorsSignal();
  });

  readonly activeProfile = computed<CustomProfile | undefined>(() => 
    this.savedProfilesSignal().find((p) => p.id === this.schemeSignal())
  );

  readonly canCreateColorProfile = computed(() => this.savedProfilesSignal().length < 12);

  readonly preferences = computed<PreferencesState>(() => ({
    mode: this.modeSignal(), contrast: this.contrastSignal(), scheme: this.schemeSignal(),
    customColors: this.customColorsSignal(), savedProfiles: this.savedProfilesSignal(), cvd: this.cvdSignal(),
    fontFamily: this.fontFamilySignal(), fontScale: this.fontScaleSignal(),
    shapeScale: this.shapeScaleSignal(), densityScale: this.densityScaleSignal(),
  }));

  private readonly activeTokenPair = computed(() => ColorEngine.buildTokenPair(this.activeCustomColors()));

  constructor() {
    this.initMediaListeners();
    DomEngine.injectCvdFilters();
    this.restoreFromStorage();

    effect(() => {
      const state = this.preferences();
      this.applyToDocument(state);
      this.persist(state);
    });
  }

  // Setters
  setMode(mode: ThemeMode): void { this.modeSignal.set(mode); }
  setContrast(contrast: ContrastMode): void { this.contrastSignal.set(contrast); }
  setScheme(scheme: ColorScheme): void { this.schemeSignal.set(scheme); }
  setCvdMode(mode: CvdMode): void { this.cvdSignal.set(mode); }
  setFontFamily(family: string): void { this.fontFamilySignal.set(family); }
  setFontScale(scale: number): void { this.fontScaleSignal.set(scale); }
  setShapeScale(scale: number): void { this.shapeScaleSignal.set(scale); }
  setDensityScale(scale: number): void { this.densityScaleSignal.set(scale); }

  saveCurrentAsProfile(name: string): void {
    const newId = 'profile-' + Date.now();
    this.savedProfilesSignal.update((p) => [...p, { id: newId, name, colors: { ...this.activeCustomColors() } }]);
    this.schemeSignal.set(newId);
  }

  updateActiveProfileName(name: string): void {
    const current = this.schemeSignal();
    if (current.startsWith('profile-')) {
      this.savedProfilesSignal.update((profiles) => profiles.map((p) => (p.id === current ? { ...p, name } : p)));
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
    if (this.schemeSignal() !== 'custom' && !this.schemeSignal().startsWith('profile-')) this.schemeSignal.set('custom');
    const nextColors = { ...this.activeCustomColors() };
    if (colors.primary !== undefined && isValidHexColor(colors.primary)) nextColors.primary = colors.primary;
    
    const ROLES = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'] as const;
    for (const role of ROLES) {
      if (colors[role] !== undefined) {
        const val = colors[role];
        nextColors[role] = val && isValidHexColor(val) ? val : undefined;
      }
    }

    if (this.schemeSignal() === 'custom') this.customColorsSignal.set(nextColors);
    else this.savedProfilesSignal.update((p) => p.map((x) => x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x));
  }

  clearCustomColorRole(role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info'): void {
    const nextColors = { ...this.activeCustomColors() };
    delete nextColors[role];
    if (this.schemeSignal() === 'custom') this.customColorsSignal.set(nextColors);
    else this.savedProfilesSignal.update((p) => p.map((x) => x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x));
  }

  suggestedCustomDefaults() { return ColorEngine.suggestDefaults(this.activeCustomColors().primary); }

  private applyToDocument(state: PreferencesState): void {
    const root = document.documentElement;
    const activeMode = this.resolvedMode();
    
    DomEngine.applyCvdFilter(root, state.cvd);
    DomEngine.applyTypography(root, state.fontFamily, state.fontScale);
    DomEngine.applyShape(root, state.shapeScale);

    root.setAttribute('data-theme-mode', activeMode);
    root.setAttribute('data-theme-scheme', state.scheme);
    root.setAttribute('data-theme-density', state.densityScale.toString());
    root.style.colorScheme = activeMode;

    if (this.resolvedHighContrast()) {
      root.setAttribute('data-theme-contrast', 'high');
      // Force contrastLevel 1
      DomEngine.applyTokens(root, ColorEngine.buildTokens(this.activeCustomColors(), activeMode, 1));
    } else {
      root.removeAttribute('data-theme-contrast');
      // Apply standard tokens
      DomEngine.applyTokens(root, this.activeTokenPair()[activeMode]);
    }
  }

  private persist(state: PreferencesState): void {
    try { localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  private initMediaListeners(): void {
    if (typeof window !== 'undefined') {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.prefersDark.set(darkQuery.matches);
      darkQuery.addEventListener('change', (e) => this.prefersDark.set(e.matches));
      const contrastQuery = window.matchMedia('(prefers-contrast: more)');
      this.prefersHighContrast.set(contrastQuery.matches);
      contrastQuery.addEventListener('change', (e) => this.prefersHighContrast.set(e.matches));
    }
  }

  resetToDefaults(): void {
    this.modeSignal.set(DEFAULT_PREFERENCES_STATE.mode);
    this.contrastSignal.set(DEFAULT_PREFERENCES_STATE.contrast);
    this.schemeSignal.set(DEFAULT_PREFERENCES_STATE.scheme);
    this.customColorsSignal.set({ ...DEFAULT_PREFERENCES_STATE.customColors });
    this.cvdSignal.set(DEFAULT_PREFERENCES_STATE.cvd);
    this.fontFamilySignal.set(DEFAULT_PREFERENCES_STATE.fontFamily);
    this.fontScaleSignal.set(DEFAULT_PREFERENCES_STATE.fontScale);
    this.shapeScaleSignal.set(DEFAULT_PREFERENCES_STATE.shapeScale);
    this.densityScaleSignal.set(DEFAULT_PREFERENCES_STATE.densityScale);
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PreferencesState> & { highContrast?: boolean; contrast?: ContrastMode };
      
      if (parsed.mode) this.modeSignal.set(parsed.mode);
      if (parsed.scheme) this.schemeSignal.set(parsed.scheme);
      if (parsed.savedProfiles) this.savedProfilesSignal.set(parsed.savedProfiles.map((p) => ({ ...p, name: p.name || 'Saved Profile' })));
      if (typeof parsed.highContrast === 'boolean') this.contrastSignal.set(parsed.highContrast ? 'high' : 'normal');
      else if (parsed.contrast) this.contrastSignal.set(parsed.contrast);
      if (parsed.cvd) this.cvdSignal.set(parsed.cvd);
      if (parsed.fontFamily) this.fontFamilySignal.set(parsed.fontFamily);
      if (parsed.fontScale) this.fontScaleSignal.set(parsed.fontScale);
      if (parsed.shapeScale !== undefined) this.shapeScaleSignal.set(parsed.shapeScale);
      if (parsed.densityScale !== undefined) this.densityScaleSignal.set(parsed.densityScale);

      if (parsed.customColors && isValidHexColor(parsed.customColors.primary)) {
        const restored: CustomColors = { primary: parsed.customColors.primary };
        const ROLES = ['secondary', 'tertiary', 'error', 'success', 'warning', 'info'] as const;
        for (const role of ROLES) {
          const value = parsed.customColors[role];
          if (isValidHexColor(value)) restored[role] = value;
        }
        this.customColorsSignal.set(restored);
      }
    } catch {}
  }
}