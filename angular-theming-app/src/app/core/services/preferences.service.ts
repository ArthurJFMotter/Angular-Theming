import { Injectable, Optional, computed, signal } from '@angular/core';
import { PreferencesState, CustomColors } from '../models/preferences.types';
import {
  DEFAULT_PREFERENCES_STATE,
  isValidHexColor,
} from '../models/preferences.constants';
import { AccessibilityPreferencesService } from './accessibility-preferences.service';
import { ColorPreferencesService } from './color-preferences.service';
import { LayoutPreferencesService } from './layout-preferences.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { TypographyPreferencesService } from './typography-preferences.service';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  constructor(
    @Optional() public color: ColorPreferencesService,
    @Optional() public accessibility: AccessibilityPreferencesService,
    @Optional() public typography: TypographyPreferencesService,
    @Optional() public layout: LayoutPreferencesService,
    @Optional() public notifications: NotificationPreferencesService,
  ) {}

  // =========================================================
  // THE MASTER STATE COMPUTED (For the ThemeSyncService effect)
  // =========================================================
  readonly preferences = computed<PreferencesState>(() => {
    return {
      _v: 2,
      ...(this.color && {
        color: {
          mode: this.color.mode(),
          autoContrast: this.color.autoContrast(),
          contrastLevel: this.color.contrastLevel(),
          scheme: this.color.scheme(),
          variant: this.color.variant(),
          customColors: this.color.customColors(),
          savedProfiles: this.color.savedProfiles(),
        },
      }),
      ...(this.accessibility && {
        accessibility: {
          cvd: this.accessibility.cvd(),
          cvdSeverity: this.accessibility.cvdSeverity(),
          cvdIntent: this.accessibility.cvdIntent(),
          screenFilter: this.accessibility.screenFilter(),
          screenFilterIntensity: this.accessibility.screenFilterIntensity(),
        },
      }),
      ...(this.typography && {
        typography: {
          headingFontFamily: this.typography.headingFontFamily(),
          bodyFontFamily: this.typography.bodyFontFamily(),
          fontScale: this.typography.fontScale(),
        },
      }),
      ...(this.layout && {
        layout: {
          shapeScale: this.layout.shapeScale(),
          densityScale: this.layout.densityScale(),
          motionScale: this.layout.motionScale(),
        },
      }),
      ...(this.notifications && {
        notifications: {
          snackbarHPosition: this.notifications.snackbarHPosition(),
          snackbarVPosition: this.notifications.snackbarVPosition(),
        },
      }),
    };
  });

  // =========================================================
  // CAPABILITY FLAGS (For the UI to *ngIf sections)
  // =========================================================
  get hasColor() {
    return !!this.color;
  }
  get hasAccessibility() {
    return !!this.accessibility;
  }
  get hasTypography() {
    return !!this.typography;
  }
  get hasLayout() {
    return !!this.layout;
  }
  get hasNotifications() {
    return !!this.notifications;
  }

  // =========================================================
  // PROXIES FOR UI COMPONENTS (Null-Safe!)
  // =========================================================

  // =========================================================
  // PROXIES FOR UI COMPONENTS (So templates don't break!)
  // =========================================================

  // -- Color Proxies --
  get mode() {
    return this.color?.mode ?? signal('auto');
  }
  get autoContrast() {
    return this.color?.autoContrast ?? signal(true);
  }
  get contrastLevel() {
    return this.color?.contrastLevel ?? signal(0);
  }
  get scheme() {
    return this.color?.scheme ?? signal('custom');
  }
  get variant() {
    return this.color?.variant ?? signal('tonal-spot');
  }
  get customColors() {
    return (
      this.color?.customColors ??
      signal(DEFAULT_PREFERENCES_STATE.color.customColors)
    );
  }
  get savedProfiles() {
    return this.color?.savedProfiles ?? signal([]);
  }
  get resolvedMode() {
    return this.color?.resolvedMode ?? computed(() => 'light');
  }
  get resolvedContrastLevel() {
    return this.color?.resolvedContrastLevel ?? computed(() => 0);
  }
  get activeCustomColors() {
    return (
      this.color?.activeCustomColors ??
      computed(() => DEFAULT_PREFERENCES_STATE.color.customColors)
    );
  }
  get activeProfile() {
    return this.color?.activeProfile ?? computed(() => undefined);
  }
  get canCreateColorProfile() {
    return this.color?.canCreateColorProfile ?? computed(() => false);
  }

  setMode(v: any) {
    this.color?.setMode(v);
  }
  setAutoContrast(v: any) {
    this.color?.setAutoContrast(v);
  }
  setContrastLevel(v: any) {
    this.color?.setContrastLevel(v);
  }
  setScheme(v: any) {
    this.color?.setScheme(v);
  }
  setVariant(v: any) {
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
  clearCustomColorRole(role: any) {
    this.color?.clearCustomColorRole(role);
  }
  addExtendedColor(label: string, hex: string) {
    this.color?.addExtendedColor(label, hex);
  }
  updateExtendedColor(id: string, updates: any) {
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
    return this.accessibility?.cvd ?? signal('none');
  }
  get cvdSeverity() {
    return this.accessibility?.cvdSeverity ?? signal(100);
  }
  get cvdIntent() {
    return this.accessibility?.cvdIntent ?? signal('simulate');
  }
  get screenFilter() {
    return this.accessibility?.screenFilter ?? signal('none');
  }
  get screenFilterIntensity() {
    return this.accessibility?.screenFilterIntensity ?? signal(50);
  }

  setCvdMode(v: any) {
    this.accessibility?.setCvdMode(v);
  }
  setCvdSeverity(v: any) {
    this.accessibility?.setCvdSeverity(v);
  }
  setCvdIntent(v: any) {
    this.accessibility?.setCvdIntent(v);
  }
  setScreenFilter(v: any) {
    this.accessibility?.setScreenFilter(v);
  }
  setScreenFilterIntensity(v: any) {
    this.accessibility?.setScreenFilterIntensity(v);
  }

  // -- Typography Proxies --
  get headingFontFamily() {
    return this.typography?.headingFontFamily ?? signal('Roboto');
  }
  get bodyFontFamily() {
    return this.typography?.bodyFontFamily ?? signal('Roboto');
  }
  get fontScale() {
    return this.typography?.fontScale ?? signal(1);
  }

  setHeadingFontFamily(v: any) {
    this.typography?.setHeadingFontFamily(v);
  }
  setBodyFontFamily(v: any) {
    this.typography?.setBodyFontFamily(v);
  }
  setFontScale(v: any) {
    this.typography?.setFontScale(v);
  }

  // -- Layout Proxies --
  get shapeScale() {
    return this.layout?.shapeScale ?? signal(1);
  }
  get densityScale() {
    return this.layout?.densityScale ?? signal(0);
  }
  get motionScale() {
    return this.layout?.motionScale ?? signal(1);
  }

  setShapeScale(v: any) {
    this.layout?.setShapeScale(v);
  }
  setDensityScale(v: any) {
    this.layout?.setDensityScale(v);
  }
  setMotionScale(v: any) {
    this.layout?.setMotionScale(v);
  }

  // -- Notification Proxies --
  get snackbarHPosition() {
    return this.notifications?.snackbarHPosition ?? signal('center');
  }
  get snackbarVPosition() {
    return this.notifications?.snackbarVPosition ?? signal('bottom');
  }

  setSnackbarHPosition(v: any) {
    this.notifications?.setSnackbarHPosition(v);
  }
  setSnackbarVPosition(v: any) {
    this.notifications?.setSnackbarVPosition(v);
  }

  // =========================================================
  // GLOBAL RESTORE & RESET
  // =========================================================
  resetToDefaults(): void {
    this.patchState(DEFAULT_PREFERENCES_STATE);
  }

  patchState(parsed: any): void {
     if (!parsed) return;

    // Check explicit version tag OR if it already has the nested 'color' object
    const isV2 = parsed._v === 2 || !!parsed.color;

    const state: PreferencesState = isV2
      ? parsed
      : {
          _v: 2,
          color: {
            mode: parsed.mode,
            autoContrast: parsed.autoContrast,
            contrastLevel: parsed.contrastLevel,
            scheme: parsed.scheme,
            variant: parsed.variant,
            customColors: parsed.customColors,
            savedProfiles: parsed.savedProfiles,
          },
          accessibility: {
            cvd: parsed.cvd,
            cvdSeverity: parsed.cvdSeverity,
            cvdIntent: parsed.cvdIntent,
            screenFilter: parsed.screenFilter,
            screenFilterIntensity: parsed.screenFilterIntensity,
          },
          typography: {
            headingFontFamily: parsed.headingFontFamily || parsed.fontFamily,
            bodyFontFamily: parsed.bodyFontFamily || parsed.fontFamily,
            fontScale: parsed.fontScale,
          },
          layout: {
            shapeScale: parsed.shapeScale,
            densityScale: parsed.densityScale,
            motionScale: parsed.motionScale,
          },
          notifications: {
            snackbarHPosition: parsed.snackbarHPosition,
            snackbarVPosition: parsed.snackbarVPosition,
          },
        };

    // Safely route the nested objects to their respective sub-services
    if (this.color && state.color) {
      if (state.color.mode !== undefined) this.color.setMode(state.color.mode);
      if (state.color.autoContrast !== undefined)
        this.color.setAutoContrast(state.color.autoContrast);
      if (state.color.contrastLevel !== undefined)
        this.color.setContrastLevel(state.color.contrastLevel);
      if (state.color.scheme !== undefined)
        this.color.setScheme(state.color.scheme);
      if (state.color.variant !== undefined)
        this.color.setVariant(state.color.variant);
      if (state.color.savedProfiles)
        this.color.savedProfiles.set(state.color.savedProfiles);

      // Strict Custom Colors restoration
      if (
        state.color.customColors &&
        isValidHexColor(state.color.customColors.primary)
      ) {
        const restored: CustomColors = {
          primary: state.color.customColors.primary,
        };
        const ROLES = [
          'secondary',
          'tertiary',
          'error',
          'success',
          'warning',
          'info',
        ] as const;
        for (const role of ROLES) {
          const value = state.color.customColors[role];
          if (isValidHexColor(value)) restored[role] = value;
        }
        if (state.color.customColors.extended)
          restored.extended = state.color.customColors.extended;
        this.color.customColors.set(restored);
      }
    }

    if (this.accessibility && state.accessibility) {
      if (state.accessibility.cvd !== undefined)
        this.accessibility.setCvdMode(state.accessibility.cvd);
      if (state.accessibility.cvdSeverity !== undefined)
        this.accessibility.setCvdSeverity(state.accessibility.cvdSeverity);
      if (state.accessibility.cvdIntent !== undefined)
        this.accessibility.setCvdIntent(state.accessibility.cvdIntent);
      if (state.accessibility.screenFilter !== undefined)
        this.accessibility.setScreenFilter(state.accessibility.screenFilter);
      if (state.accessibility.screenFilterIntensity !== undefined)
        this.accessibility.setScreenFilterIntensity(
          state.accessibility.screenFilterIntensity,
        );
    }

    if (this.typography && state.typography) {
      if (state.typography.headingFontFamily !== undefined)
        this.typography.setHeadingFontFamily(
          state.typography.headingFontFamily,
        );
      if (state.typography.bodyFontFamily !== undefined)
        this.typography.setBodyFontFamily(state.typography.bodyFontFamily);
      if (state.typography.fontScale !== undefined)
        this.typography.setFontScale(state.typography.fontScale);
    }

    if (this.layout && state.layout) {
      if (state.layout.shapeScale !== undefined)
        this.layout.setShapeScale(state.layout.shapeScale);
      if (state.layout.densityScale !== undefined)
        this.layout.setDensityScale(state.layout.densityScale);
      if (state.layout.motionScale !== undefined)
        this.layout.setMotionScale(state.layout.motionScale);
    }

    if (this.notifications && state.notifications) {
      if (state.notifications.snackbarHPosition !== undefined)
        this.notifications.setSnackbarHPosition(
          state.notifications.snackbarHPosition,
        );
      if (state.notifications.snackbarVPosition !== undefined)
        this.notifications.setSnackbarVPosition(
          state.notifications.snackbarVPosition,
        );
    }
  }
}
