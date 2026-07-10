import { Injectable, signal, computed } from '@angular/core';
import {
  ColorScheme,
  CustomColors,
  CustomProfile,
  ThemeMode,
  ContrastMode,
  CvdMode,
  PreferencesState,
  SchemeVariant,
  ScreenFilter,
  CvdIntent,
} from '../models/preferences.types';
import {
  DEFAULT_PREFERENCES_STATE,
  isValidHexColor,
} from '../models/preferences.constants';
import { MediaQueryService } from './media-query.service';
import { ColorEngine } from '../utils/engines/color-engine';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  // State Signals
  private readonly modeSignal = signal<ThemeMode>(
    DEFAULT_PREFERENCES_STATE.mode,
  );

  private readonly autoContrastSignal = signal<boolean>(
    DEFAULT_PREFERENCES_STATE.autoContrast,
  );

  private readonly contrastLevelSignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.contrastLevel,
  );

  private readonly schemeSignal = signal<ColorScheme>(
    DEFAULT_PREFERENCES_STATE.scheme,
  );

  private readonly variantSignal = signal<SchemeVariant>(
    DEFAULT_PREFERENCES_STATE.variant,
  );

  private readonly customColorsSignal = signal<CustomColors>(
    DEFAULT_PREFERENCES_STATE.customColors,
  );

  private readonly savedProfilesSignal = signal<CustomProfile[]>(
    DEFAULT_PREFERENCES_STATE.savedProfiles,
  );

  private readonly cvdSignal = signal<CvdMode>(DEFAULT_PREFERENCES_STATE.cvd);

  private readonly cvdSeveritySignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.cvdSeverity,
  );

  private readonly cvdIntentSignal = signal<CvdIntent>(
    DEFAULT_PREFERENCES_STATE.cvdIntent,
  );

  private readonly screenFilterSignal = signal<ScreenFilter>(
    DEFAULT_PREFERENCES_STATE.screenFilter,
  );

  private readonly screenFilterIntensitySignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.screenFilterIntensity,
  );

  private readonly headingFontFamilySignal = signal<string>(
    DEFAULT_PREFERENCES_STATE.headingFontFamily,
  );

  private readonly bodyFontFamilySignal = signal<string>(
    DEFAULT_PREFERENCES_STATE.bodyFontFamily,
  );

  private readonly fontScaleSignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.fontScale,
  );

  private readonly shapeScaleSignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.shapeScale,
  );

  private readonly densityScaleSignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.densityScale,
  );

  private readonly motionScaleSignal = signal<number>(
    DEFAULT_PREFERENCES_STATE.motionScale,
  );

  private readonly snackbarHSignal = signal<MatSnackBarHorizontalPosition>(
    DEFAULT_PREFERENCES_STATE.snackbarHPosition,
  );

  private readonly snackbarVSignal = signal<MatSnackBarVerticalPosition>(
    DEFAULT_PREFERENCES_STATE.snackbarVPosition,
  );

  // Readonly exposures
  readonly mode = this.modeSignal.asReadonly();
  readonly autoContrast = this.autoContrastSignal.asReadonly();
  readonly contrastLevel = this.contrastLevelSignal.asReadonly();
  readonly scheme = this.schemeSignal.asReadonly();
  readonly variant = this.variantSignal.asReadonly();
  readonly customColors = this.customColorsSignal.asReadonly();
  readonly savedProfiles = this.savedProfilesSignal.asReadonly();
  readonly cvd = this.cvdSignal.asReadonly();
  readonly cvdSeverity = this.cvdSeveritySignal.asReadonly();
  readonly cvdIntent = this.cvdIntentSignal.asReadonly();
  readonly screenFilter = this.screenFilterSignal.asReadonly();
  readonly screenFilterIntensity =
    this.screenFilterIntensitySignal.asReadonly();
  readonly headingFontFamily = this.headingFontFamilySignal.asReadonly();
  readonly bodyFontFamily = this.bodyFontFamilySignal.asReadonly();
  readonly fontScale = this.fontScaleSignal.asReadonly();
  readonly shapeScale = this.shapeScaleSignal.asReadonly();
  readonly densityScale = this.densityScaleSignal.asReadonly();
  readonly motionScale = this.motionScaleSignal.asReadonly();
  readonly snackbarHPosition = this.snackbarHSignal.asReadonly();
  readonly snackbarVPosition = this.snackbarVSignal.asReadonly();

  // Computed state relying on MediaQueryService for 'auto' modes
  readonly resolvedMode = computed<'light' | 'dark'>(() =>
    this.modeSignal() === 'auto'
      ? this.mediaQuery.prefersDark()
        ? 'dark'
        : 'light'
      : (this.modeSignal() as 'light' | 'dark'),
  );

  readonly resolvedContrastLevel = computed<number>(() => {
    if (this.autoContrastSignal()) {
      // If OS prefers high contrast, jump to 1.0, otherwise 0
      return this.mediaQuery.prefersHighContrast() ? 1.0 : 0.0;
    }
    return this.contrastLevelSignal();
  });

  readonly activeCustomColors = computed<CustomColors>(() => {
    const scheme = this.schemeSignal();
    if (scheme === 'custom') return this.customColorsSignal();
    const profile = this.savedProfilesSignal().find((p) => p.id === scheme);
    return profile ? profile.colors : this.customColorsSignal();
  });

  readonly activeProfile = computed<CustomProfile | undefined>(() =>
    this.savedProfilesSignal().find((p) => p.id === this.schemeSignal()),
  );

  readonly canCreateColorProfile = computed(
    () => this.savedProfilesSignal().length < 12,
  );

  // Full state payload getter for the ThemeSyncService
  readonly preferences = computed<PreferencesState>(() => ({
    mode: this.modeSignal(),
    autoContrast: this.autoContrastSignal(),
    contrastLevel: this.contrastLevelSignal(),
    scheme: this.schemeSignal(),
    variant: this.variantSignal(),
    customColors: this.customColorsSignal(),
    savedProfiles: this.savedProfilesSignal(),
    cvd: this.cvdSignal(),
    cvdSeverity: this.cvdSeveritySignal(),
    cvdIntent: this.cvdIntentSignal(),
    screenFilter: this.screenFilterSignal(),
    screenFilterIntensity: this.screenFilterIntensitySignal(),
    headingFontFamily: this.headingFontFamilySignal(),
    bodyFontFamily: this.bodyFontFamilySignal(),
    fontScale: this.fontScaleSignal(),
    shapeScale: this.shapeScaleSignal(),
    densityScale: this.densityScaleSignal(),
    motionScale: this.motionScaleSignal(),
    snackbarHPosition: this.snackbarHSignal(),
    snackbarVPosition: this.snackbarVSignal(),
  }));

  constructor(private mediaQuery: MediaQueryService) {}

  // Setters
  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
  }
  setAutoContrast(auto: boolean): void {
    this.autoContrastSignal.set(auto);
  }
  setContrastLevel(level: number): void {
    this.contrastLevelSignal.set(level);
  }
  setScheme(scheme: ColorScheme): void {
    this.schemeSignal.set(scheme);
  }
  setVariant(variant: SchemeVariant): void {
    this.variantSignal.set(variant);
  }
  setCvdMode(mode: CvdMode): void {
    this.cvdSignal.set(mode);
  }
  setCvdSeverity(val: number): void {
    this.cvdSeveritySignal.set(val);
  }
  setCvdIntent(intent: CvdIntent): void {
    this.cvdIntentSignal.set(intent);
  }
  setScreenFilter(val: ScreenFilter): void {
    this.screenFilterSignal.set(val);
  }
  setScreenFilterIntensity(val: number): void {
    this.screenFilterIntensitySignal.set(val);
  }
  setHeadingFontFamily(family: string): void {
    this.headingFontFamilySignal.set(family);
  }
  setBodyFontFamily(family: string): void {
    this.bodyFontFamilySignal.set(family);
  }
  setFontScale(scale: number): void {
    this.fontScaleSignal.set(scale);
  }
  setShapeScale(scale: number): void {
    this.shapeScaleSignal.set(scale);
  }
  setDensityScale(scale: number): void {
    this.densityScaleSignal.set(scale);
  }
  setMotionScale(scale: number): void {
    this.motionScaleSignal.set(scale);
  }
  setSnackbarHPosition(pos: MatSnackBarHorizontalPosition): void {
    this.snackbarHSignal.set(pos);
  }
  setSnackbarVPosition(pos: MatSnackBarVerticalPosition): void {
    this.snackbarVSignal.set(pos);
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
    if (
      this.schemeSignal() !== 'custom' &&
      !this.schemeSignal().startsWith('profile-')
    )
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

    if (this.schemeSignal() === 'custom')
      this.customColorsSignal.set(nextColors);
    else
      this.savedProfilesSignal.update((p) =>
        p.map((x) =>
          x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x,
        ),
      );
  }

  clearCustomColorRole(
    role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info',
  ): void {
    const nextColors = { ...this.activeCustomColors() };
    delete nextColors[role];
    if (this.schemeSignal() === 'custom')
      this.customColorsSignal.set(nextColors);
    else
      this.savedProfilesSignal.update((p) =>
        p.map((x) =>
          x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x,
        ),
      );
  }

  addExtendedColor(label: string, hexColor: string): void {
    const nextColors = { ...this.activeCustomColors() };
    const currentExtended = nextColors.extended || [];

    if (currentExtended.length >= 5) {
      console.warn('Maximum of 5 extended colors reached per profile.');
      return;
    }

    const id = label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    nextColors.extended = [...currentExtended, { id, label, color: hexColor }];

    if (this.schemeSignal() === 'custom')
      this.customColorsSignal.set(nextColors);
    else
      this.savedProfilesSignal.update((p) =>
        p.map((x) =>
          x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x,
        ),
      );
  }

  updateExtendedColor(
    id: string,
    updates: { label?: string; color?: string },
  ): void {
    const nextColors = { ...this.activeCustomColors() };
    if (!nextColors.extended) return;

    nextColors.extended = nextColors.extended.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );

    if (this.schemeSignal() === 'custom')
      this.customColorsSignal.set(nextColors);
    else
      this.savedProfilesSignal.update((p) =>
        p.map((x) =>
          x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x,
        ),
      );
  }

  removeExtendedColor(id: string): void {
    const nextColors = { ...this.activeCustomColors() };
    if (!nextColors.extended) return;

    nextColors.extended = nextColors.extended.filter((c) => c.id !== id);

    if (this.schemeSignal() === 'custom')
      this.customColorsSignal.set(nextColors);
    else
      this.savedProfilesSignal.update((p) =>
        p.map((x) =>
          x.id === this.schemeSignal() ? { ...x, colors: nextColors } : x,
        ),
      );
  }

  suggestedCustomDefaults() {
    return ColorEngine.suggestDefaults(
      this.activeCustomColors().primary,
      this.variantSignal(),
    );
  }

  resetToDefaults(): void {
    this.patchState(DEFAULT_PREFERENCES_STATE);
  }

  // Called once on app startup by ThemeSyncService
  patchState(
    parsed: Partial<PreferencesState> & { highContrast?: boolean },
  ): void {
    if (parsed.mode) this.modeSignal.set(parsed.mode);
    if (parsed.scheme) this.schemeSignal.set(parsed.scheme);
    if (parsed.variant) this.variantSignal.set(parsed.variant);
    if (parsed.savedProfiles)
      this.savedProfilesSignal.set(
        parsed.savedProfiles.map((p) => ({
          ...p,
          name: p.name || 'Saved Profile',
        })),
      );
    if (parsed.autoContrast !== undefined)
      this.autoContrastSignal.set(parsed.autoContrast);
    if (parsed.contrastLevel !== undefined)
      this.contrastLevelSignal.set(parsed.contrastLevel);
    if (parsed.cvd) this.cvdSignal.set(parsed.cvd);
    if (parsed.cvdSeverity !== undefined)
      this.cvdSeveritySignal.set(parsed.cvdSeverity);
    if (parsed.cvdIntent) this.cvdIntentSignal.set(parsed.cvdIntent);
    if (parsed.screenFilter !== undefined)
      this.screenFilterSignal.set(parsed.screenFilter);
    if (parsed.screenFilterIntensity !== undefined)
      this.screenFilterIntensitySignal.set(parsed.screenFilterIntensity);
    if (parsed.headingFontFamily)
      this.headingFontFamilySignal.set(parsed.headingFontFamily);
    if (parsed.bodyFontFamily)
      this.bodyFontFamilySignal.set(parsed.bodyFontFamily);

    // Migration for legacy saves
    if ((parsed as any).fontFamily && !parsed.headingFontFamily) {
      this.headingFontFamilySignal.set((parsed as any).fontFamily);
      this.bodyFontFamilySignal.set((parsed as any).fontFamily);
    }

    if (parsed.fontScale) this.fontScaleSignal.set(parsed.fontScale);
    if (parsed.shapeScale !== undefined)
      this.shapeScaleSignal.set(parsed.shapeScale);
    if (parsed.densityScale !== undefined)
      this.densityScaleSignal.set(parsed.densityScale);
    if (parsed.motionScale !== undefined)
      this.motionScaleSignal.set(parsed.motionScale);
    if (parsed.snackbarHPosition)
      this.snackbarHSignal.set(parsed.snackbarHPosition);
    if (parsed.snackbarVPosition)
      this.snackbarVSignal.set(parsed.snackbarVPosition);

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
  }
}
