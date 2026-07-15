import { Injectable, Inject, Optional, computed, signal } from '@angular/core';
import { PreferencesState, CustomColors } from '../models/preferences.types';
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

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private registry = new Map<string, PreferenceDomain>();

  constructor(
    @Optional() @Inject(PREFERENCE_DOMAINS) domains: PreferenceDomain[],
  ) {
    if (domains) {
      domains.forEach((domain) => this.registry.set(domain.key, domain));
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
  // PROXIES (Null-Safe & Tree-Shakeable)
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
  saveCurrentAsProfile(n: string) {
    this.color?.saveCurrentAsProfile(n);
  }
  updateActiveProfileName(n: string) {
    this.color?.updateActiveProfileName(n);
  }
  deleteActiveProfile() {
    this.color?.deleteActiveProfile();
  }
  setCustomColors(c: Partial<CustomColors>) {
    this.color?.setCustomColors(c);
  }
  clearCustomColorRole(r: any) {
    this.color?.clearCustomColorRole(r);
  }
  addExtendedColor(l: string, h: string) {
    this.color?.addExtendedColor(l, h);
  }
  updateExtendedColor(i: string, u: any) {
    this.color?.updateExtendedColor(i, u);
  }
  removeExtendedColor(i: string) {
    this.color?.removeExtendedColor(i);
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
    this.registry.forEach((domain) => domain.reset());
  }

  patchState(parsed: any): void {
    if (!parsed) return;

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

    // Dynamically patch all registered domains
    this.registry.forEach((domain, key) => {
      const slice = (state as any)[key];
      if (slice) domain.patchState(slice);
    });
  }
}
