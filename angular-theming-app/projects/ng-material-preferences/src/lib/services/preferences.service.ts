import {
  Injectable,
  Inject,
  Optional,
  computed,
  signal,
  isDevMode,
} from '@angular/core';
import {
  PreferencesState,
  CustomColors,
  ColorScheme,
  CvdIntent,
  CvdMode,
  SchemeVariant,
  ScreenFilter,
  ThemeMode,
  CustomProfile,
} from '../models/preferences.types';
import { DEFAULT_PREFERENCES_STATE } from '../models/preferences.constants';
import {
  PREFERENCE_DOMAINS,
  PreferenceDomain,
} from './preferences/preference-domain.token';

import type { AccessibilityPreferencesService } from './preferences/accessibility-preferences.service';
import type { ColorPreferencesService } from './preferences/color-preferences.service';
import type { LayoutPreferencesService } from './preferences/layout-preferences.service';
import type { NotificationPreferencesService } from './preferences/notification-preferences.service';
import type { TypographyPreferencesService } from './preferences/typography-preferences.service';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  PREFERENCES_MIGRATION_TOKEN,
  PreferencesMigrationFn,
} from '../storage/preferences-migration.token';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private registry = new Map<string, PreferenceDomain>();

  constructor(
    @Optional() @Inject(PREFERENCE_DOMAINS) domains: PreferenceDomain[],
    @Optional()
    @Inject(PREFERENCES_MIGRATION_TOKEN)
    private migrationFn: PreferencesMigrationFn | null,
  ) {
    if (domains) {
      domains.forEach((domain) => {
        // Warn if a consumer accidentally provides the same domain twice
        if (isDevMode() && this.registry.has(domain.key)) {
          console.warn(
            `[PreferencesService] Duplicate domain registered for key: ${domain.key}`,
          );
        }
        this.registry.set(domain.key, domain);
      });
    }
  }

  // Type-safe lookup helper
  private getService<T extends PreferenceDomain>(key: string): T | null {
    return (this.registry.get(key) as T) || null;
  }

  // =========================================================
  // THE MASTER STATE COMPUTED (Dynamically built from registry!)
  // =========================================================
  readonly preferences = computed<PreferencesState>(() => {
    const state: PreferencesState = { _v: 2 };
    this.registry.forEach((domain, key) => {
      (state as any)[key] = domain.getSnapshot();
    });
    return state;
  });

  // =========================================================
  // CAPABILITY FLAGS
  // =========================================================
  get hasColor() {
    return this.registry.has('color');
  }
  get hasAccessibility() {
    return this.registry.has('accessibility');
  }
  get hasTypography() {
    return this.registry.has('typography');
  }
  get hasLayout() {
    return this.registry.has('layout');
  }
  get hasNotifications() {
    return this.registry.has('notifications');
  }

  // =========================================================
  // FALLBACK SIGNALS (Instantiated once to prevent GC thrashing)
  // =========================================================
  private readonly fbMode = signal<ThemeMode>('auto');
  private readonly fbAutoContrast = signal<boolean>(true);
  private readonly fbContrastLevel = signal<number>(0);
  private readonly fbScheme = signal<ColorScheme>('custom');
  private readonly fbVariant = signal<SchemeVariant>('tonal-spot');
  private readonly fbCustomColors = signal<CustomColors>(
    DEFAULT_PREFERENCES_STATE.color.customColors,
  );
  private readonly fbSavedProfiles = signal<CustomProfile[]>([]);

  private readonly fbResolvedMode = computed<'light' | 'dark'>(() => 'light');
  private readonly fbResolvedContrastLevel = computed<number>(() => 0);
  private readonly fbActiveCustomColors = computed<CustomColors>(
    () => DEFAULT_PREFERENCES_STATE.color.customColors,
  );
  private readonly fbActiveProfile = computed<CustomProfile | undefined>(
    () => undefined,
  );
  private readonly fbCanCreateColorProfile = computed<boolean>(() => false);

  private readonly fbCvd = signal<CvdMode>('none');
  private readonly fbCvdSeverity = signal<number>(100);
  private readonly fbCvdIntent = signal<CvdIntent>('simulate');
  private readonly fbScreenFilter = signal<ScreenFilter>('none');
  private readonly fbScreenFilterIntensity = signal<number>(50);

  private readonly fbHeadingFontFamily = signal<string>('Roboto');
  private readonly fbBodyFontFamily = signal<string>('Roboto');
  private readonly fbFontScale = signal<number>(1);

  private readonly fbShapeScale = signal<number>(1);
  private readonly fbDensityScale = signal<number>(0);
  private readonly fbMotionScale = signal<number>(1);

  private readonly fbSnackbarHPosition =
    signal<MatSnackBarHorizontalPosition>('center');
  private readonly fbSnackbarVPosition =
    signal<MatSnackBarVerticalPosition>('bottom');

  // =========================================================
  // PROXIES FOR UI COMPONENTS (Null-Safe & Performant)
  // =========================================================

  // -- Color Proxies --
  get mode() {
    return this.color?.mode ?? this.fbMode;
  }
  get autoContrast() {
    return this.color?.autoContrast ?? this.fbAutoContrast;
  }
  get contrastLevel() {
    return this.color?.contrastLevel ?? this.fbContrastLevel;
  }
  get scheme() {
    return this.color?.scheme ?? this.fbScheme;
  }
  get variant() {
    return this.color?.variant ?? this.fbVariant;
  }
  get customColors() {
    return this.color?.customColors ?? this.fbCustomColors;
  }
  get savedProfiles() {
    return this.color?.savedProfiles ?? this.fbSavedProfiles;
  }

  get resolvedMode() {
    return this.color?.resolvedMode ?? this.fbResolvedMode;
  }
  get resolvedContrastLevel() {
    return this.color?.resolvedContrastLevel ?? this.fbResolvedContrastLevel;
  }
  get activeCustomColors() {
    return this.color?.activeCustomColors ?? this.fbActiveCustomColors;
  }
  get activeProfile() {
    return this.color?.activeProfile ?? this.fbActiveProfile;
  }
  get canCreateColorProfile() {
    return this.color?.canCreateColorProfile ?? this.fbCanCreateColorProfile;
  }

  setMode(v: ThemeMode) {
    this.color?.setMode(v);
  }
  setAutoContrast(v: boolean) {
    this.color?.setAutoContrast(v);
  }
  setContrastLevel(v: number) {
    this.color?.setContrastLevel(v);
  }
  setScheme(v: ColorScheme) {
    this.color?.setScheme(v);
  }
  setVariant(v: SchemeVariant) {
    this.color?.setVariant(v);
  }
  saveCurrentAsProfile(name: string) {
    this.color?.saveCurrentAsProfile(name);
  }
  updateActiveProfileName(name: string) {
    this.color?.updateActiveProfileName(name);
  }
  deleteActiveProfile() {
    this.color?.deleteActiveProfile();
  }
  setCustomColors(colors: Partial<CustomColors>) {
    this.color?.setCustomColors(colors);
  }
  clearCustomColorRole(
    role: 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info',
  ) {
    this.color?.clearCustomColorRole(role);
  }
  addExtendedColor(label: string, hex: string) {
    this.color?.addExtendedColor(label, hex);
  }
  updateExtendedColor(id: string, updates: { label?: string; color?: string }) {
    this.color?.updateExtendedColor(id, updates);
  }
  removeExtendedColor(id: string) {
    this.color?.removeExtendedColor(id);
  }
  suggestedCustomDefaults() {
    return (
      this.color?.suggestedCustomDefaults() || ({} as Required<CustomColors>)
    );
  }

  // -- Accessibility Proxies --
  get cvd() {
    return this.accessibility?.cvd ?? this.fbCvd;
  }
  get cvdSeverity() {
    return this.accessibility?.cvdSeverity ?? this.fbCvdSeverity;
  }
  get cvdIntent() {
    return this.accessibility?.cvdIntent ?? this.fbCvdIntent;
  }
  get screenFilter() {
    return this.accessibility?.screenFilter ?? this.fbScreenFilter;
  }
  get screenFilterIntensity() {
    return (
      this.accessibility?.screenFilterIntensity ?? this.fbScreenFilterIntensity
    );
  }

  setCvdMode(v: CvdMode) {
    this.accessibility?.setCvdMode(v);
  }
  setCvdSeverity(v: number) {
    this.accessibility?.setCvdSeverity(v);
  }
  setCvdIntent(v: CvdIntent) {
    this.accessibility?.setCvdIntent(v);
  }
  setScreenFilter(v: ScreenFilter) {
    this.accessibility?.setScreenFilter(v);
  }
  setScreenFilterIntensity(v: number) {
    this.accessibility?.setScreenFilterIntensity(v);
  }

  // -- Typography Proxies --
  get headingFontFamily() {
    return this.typography?.headingFontFamily ?? this.fbHeadingFontFamily;
  }
  get bodyFontFamily() {
    return this.typography?.bodyFontFamily ?? this.fbBodyFontFamily;
  }
  get fontScale() {
    return this.typography?.fontScale ?? this.fbFontScale;
  }

  setHeadingFontFamily(v: string) {
    this.typography?.setHeadingFontFamily(v);
  }
  setBodyFontFamily(v: string) {
    this.typography?.setBodyFontFamily(v);
  }
  setFontScale(v: number) {
    this.typography?.setFontScale(v);
  }

  // -- Layout Proxies --
  get shapeScale() {
    return this.layout?.shapeScale ?? this.fbShapeScale;
  }
  get densityScale() {
    return this.layout?.densityScale ?? this.fbDensityScale;
  }
  get motionScale() {
    return this.layout?.motionScale ?? this.fbMotionScale;
  }

  setShapeScale(v: number) {
    this.layout?.setShapeScale(v);
  }
  setDensityScale(v: number) {
    this.layout?.setDensityScale(v);
  }
  setMotionScale(v: number) {
    this.layout?.setMotionScale(v);
  }

  // -- Notification Proxies --
  get snackbarHPosition() {
    return this.notifications?.snackbarHPosition ?? this.fbSnackbarHPosition;
  }
  get snackbarVPosition() {
    return this.notifications?.snackbarVPosition ?? this.fbSnackbarVPosition;
  }

  setSnackbarHPosition(v: MatSnackBarHorizontalPosition) {
    this.notifications?.setSnackbarHPosition(v);
  }
  setSnackbarVPosition(v: MatSnackBarVerticalPosition) {
    this.notifications?.setSnackbarVPosition(v);
  }

  // =========================================================
  // DOMAIN LOOKUP HELPERS
  // =========================================================

  private get color() {
    return this.getService<ColorPreferencesService>('color');
  }
  private get accessibility() {
    return this.getService<AccessibilityPreferencesService>('accessibility');
  }
  private get typography() {
    return this.getService<TypographyPreferencesService>('typography');
  }
  private get layout() {
    return this.getService<LayoutPreferencesService>('layout');
  }
  private get notifications() {
    return this.getService<NotificationPreferencesService>('notifications');
  }

  // =========================================================
  // GLOBAL RESTORE & RESET
  // =========================================================
  resetToDefaults(): void {
    this.registry.forEach((domain) => domain.reset());
  }

  patchState(parsed: any): void {
    if (!parsed || typeof parsed !== 'object') return;

    let state: PreferencesState;

    // Defensively try to run the consumer's migration strategy
    try {
      state = this.migrationFn ? this.migrationFn(parsed) : parsed;
    } catch (e) {
      if (isDevMode()) {
        console.error(
          '[ng-material-preferences] migrationStrategy threw an error. Falling back to defaults.',
          e,
        );
      }
      state = {};
    }

    /* Heuristic check to warn developers of silent data loss
     If they didn't provide a migration function, but the data exists and doesn't match our domains... */
    if (isDevMode() && !this.migrationFn && Object.keys(state).length > 0) {
      let hasAtLeastOneDomain = false;
      this.registry.forEach((_, key) => {
        if ((state as any)[key] !== undefined) hasAtLeastOneDomain = true;
      });

      if (!hasAtLeastOneDomain) {
        console.warn(
          `[ng-material-preferences] Loaded preferences do not match the expected nested schema. ` +
            `If you are upgrading from a previous flat-storage version, you must provide a 'migrationStrategy' ` +
            `in your 'providePreferences()' config to map the old data, otherwise it will be ignored.`,
        );
      }
    }

    // Dynamically patch all registered domains
    this.registry.forEach((domain, key) => {
      const slice = (state as any)[key];
      if (slice) domain.patchState(slice);
    });
  }
}
