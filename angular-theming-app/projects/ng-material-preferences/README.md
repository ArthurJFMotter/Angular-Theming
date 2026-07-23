# ng-material-preferences

Headless, tree-shakeable user-preference state management for Angular Material 3 apps — theming, accessibility (CVD/screen filters), typography, layout, and notification positioning, all reactive via Signals and fully independent of any UI.

The library owns **state, math, persistence, and DOM/CSS-variable injection**. It renders zero markup and zero user-facing strings — you build your own settings UI (or copy the one in this repo's demo app) and bind it to the library's facade.

---

## Table of contents

1. [Installation](#1-installation)
2. [Quick start](#2-quick-start)
3. [Choosing your domains](#3-choosing-your-domains)
4. [SCSS setup](#4-scss-setup)
5. [Binding the facade to your UI](#5-binding-the-facade-to-your-ui)
6. [Accessibility features (CVD & screen filters)](#6-accessibility-features-cvd--screen-filters)
7. [The CSS custom properties contract](#7-the-css-custom-properties-contract)
8. [Storage, custom keys & migrations](#8-storage-custom-keys--migrations)
9. [Font loading](#9-font-loading)
10. [Convenience constants & i18n](#10-convenience-constants--i18n)
11. [Architectural constraints](#11-architectural-constraints)
12. [API reference](#12-api-reference)

---

## 1. Installation

```bash
npm install ng-material-preferences
```

### Peer dependencies

This library expects the following to already be installed in your app:

| Package | Why |
|---|---|
| `@angular/core` | Signals, DI, `ENVIRONMENT_INITIALIZER` |
| `@angular/common` | `DOCUMENT` injection |
| `@angular/material` | Snackbar position types, `mat.theme()` SCSS mixin |
| `@material/material-color-utilities` | M3 color science (HCT, tonal palettes, dynamic schemes) |

No Angular Material **components** are required by the library itself — it never imports `MatButtonModule`, `MatSelectModule`, etc. You only need those in your own UI, if you build one.

---

## 2. Quick start

**`app.config.ts`**

```ts
import { ApplicationConfig } from '@angular/core';
import {
  providePreferences,
  PREFERENCES_STORAGE_TOKEN,
  LocalPreferencesStorageService,
} from 'ng-material-preferences';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...your other providers (router, animations, etc.)

    { provide: PREFERENCES_STORAGE_TOKEN, useClass: LocalPreferencesStorageService },

    providePreferences(), // registers all five domains with sensible defaults
  ],
};
```

That's it. No further bootstrap step is needed — `providePreferences()` internally wires an `ENVIRONMENT_INITIALIZER` that wakes up the library's sync engine as soon as your app starts. You do **not** need to inject anything in `AppComponent` for state persistence or DOM/CSS effects to start working.

**`styles.scss`**

```scss
@use 'ng-material-preferences/src/styles/theming' as prefs;

@include prefs.setup-theming();
```

**Any component**

```ts
import { Component, inject } from '@angular/core';
import { PreferencesService } from 'ng-material-preferences';

@Component({ /* ... */ })
export class MySettingsComponent {
  readonly prefs = inject(PreferencesService);

  toggleDarkMode() {
    this.prefs.setMode(this.prefs.mode() === 'dark' ? 'light' : 'dark');
  }
}
```

Preferences are now persisted to `localStorage`, reactive across your whole app via Signals, and automatically reflected as CSS custom properties and data attributes on `<html>`.

---

## 3. Choosing your domains

State is split into five independent **domains**. You can register all of them, a subset, or none — anything you don't register is safely absent everywhere (no runtime errors, no leftover code in your bundle).

| Domain | Governs | Provider function |
|---|---|---|
| `color` | Theme mode, contrast, M3 scheme variant, custom color profiles | `provideColorPreferences()` |
| `accessibility` | Color-vision-deficiency simulation/compensation, screen filters (blur, glare, night shift, astigmatism, macular, glaucoma) | `provideAccessibilityPreferences()` |
| `typography` | Heading/body font family, font scale | `provideTypographyPreferences()` |
| `layout` | Corner radius scale, density scale, motion scale | `provideLayoutPreferences()` |
| `notifications` | Snackbar horizontal/vertical spawn position | `provideNotificationPreferences()` |

**Everything, via the convenience wrapper:**

```ts
providePreferences()
```

**A subset, via the same wrapper:**

```ts
providePreferences({
  accessibility: false,
  notifications: false,
})
```

**Fully granular, composing only what you need (best for bundle size):**

```ts
providers: [
  ...provideColorPreferences(),
  ...provideTypographyPreferences(),
]
```

Check what's actually active at runtime with the facade's capability flags — useful for gating your own UI:

```ts
prefs.hasColor          // boolean
prefs.hasAccessibility
prefs.hasTypography
prefs.hasLayout
prefs.hasNotifications
```

> **Building your own settings UI?** Always gate each section behind its matching `hasX` flag. A component that reads `prefs.snackbarHPosition()` without checking `prefs.hasNotifications` first will silently work off a harmless fallback value instead of failing — which feels safe, but means your UI can end up showing controls for a domain that was never actually registered.

---

## 4. SCSS setup

Angular Material's density system and a handful of CDK-rendered overlays (snackbars, dialogs, bottom sheets) can't be wired up with runtime CSS variables alone — they require SCSS-time mixin generation. The library ships an optional SCSS partial that handles this.

```scss
@use 'ng-material-preferences/src/styles/theming' as prefs;

@include prefs.setup-theming(); // convenience: includes everything below
```

Or compose only what you need:

```scss
@use 'ng-material-preferences/src/styles/theming' as prefs;

@include prefs.fallback-tokens();  // safe defaults if the color domain is omitted
@include prefs.cdk-overrides();    // wires snackbars/dialogs/bottom sheets to your tokens
@include prefs.apply-density();    // only needed if you use the layout domain's density feature
```

| Mixin | What it does | When you need it |
|---|---|---|
| `fallback-tokens()` | Defines `--mat-sys-success`, `-warning`, `-info` (and their `on-`/`-container` variants) at safe default values | Always — even if you use the color domain, this covers the brief moment before the first sync, and covers you entirely if you omit the color domain |
| `cdk-overrides()` | Shapes snackbars/dialogs/bottom sheets using your corner-radius tokens; maps `snackbar-success`/`-warning`/`-info`/`-error` panel classes (as used by a typical `NotificationService`) to your semantic color tokens | If you use notifications, dialogs, or bottom sheets |
| `apply-density()` | Generates the SCSS-time density variants (`-1` to `-3`) keyed to the `data-theme-density` attribute the library writes on `<html>` | Only if you use `layout` domain's `densityScale` |

You'll also need your own base Material theme declaration (a starting palette, typography, and density of `0`) — the library **overrides** this at runtime via CSS custom properties, it doesn't replace the need for Angular Material's own `@include mat.theme(...)` bootstrap:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (theme-type: light, primary: mat.$blue-palette, tertiary: mat.$azure-palette),
    typography: Roboto,
    density: 0,
  ));
}
```

---

## 5. Binding the facade to your UI

`PreferencesService` is the single injectable facade for every registered domain. Every readable property is a Signal; every mutation is a plain method.

```ts
readonly prefs = inject(PreferencesService);

// Read (in a template or computed):
prefs.mode()              // 'light' | 'dark' | 'auto'
prefs.scheme()            // active color scheme id
prefs.cvd()               // current CVD simulation mode
prefs.fontScale()         // current type scale multiplier

// Write:
prefs.setMode('dark');
prefs.setCvdMode('deuteranopia');
prefs.setFontScale(1.15);
```

If a domain isn't registered, its getters return safe, constant fallback Signals (e.g. `prefs.mode()` returns `'auto'`) and its setters are silent no-ops — nothing throws, nothing crashes. This lets a shared settings component degrade gracefully across apps with different domain configurations, though as noted above, gating with `hasX` is still the right call for anything the user should only see when it's actually meaningful.

A full-featured settings drawer/panel (color scheme picker, contrast slider, CVD selector, font pickers, density/motion sliders, notification position selects) is included as reference UI in this repo's demo app — not published as part of the library, since the library is intentionally headless. Feel free to copy it as a starting point.

---

## 6. Accessibility features (CVD & screen filters)

The `accessibility` domain drives two independent visual simulation systems, both applied globally via SVG filters and CSS `filter` on `<html>`:

**Color Vision Deficiency (CVD)** — `cvd`, `cvdSeverity` (0–100), `cvdIntent`:
- `simulate`: shows you what a person with the selected deficiency (protanopia, deuteranopia, tritanopia, achromatopsia) sees
- `compensate`: applies a "daltonization" color shift intended to make distinctions clearer *for* someone with that deficiency

**Screen/environmental filters** — `screenFilter`, `screenFilterIntensity` (0–100):
- `blur`, `glare`, `nightshift`: applied via CSS `filter` functions
- `astigmatism`: applied via an injected SVG filter (directional blur + screen blend)
- `macular`, `glaucoma`: render a mouse-tracked field-of-vision overlay simulating central or peripheral vision loss

All of this is handled internally — you only need to call `prefs.setCvdMode(...)` / `prefs.setScreenFilter(...)` and the corresponding intensity setters. No SCSS or manual filter wiring is required for these.

---

## 7. The CSS custom properties contract

This is the most important thing to understand if your UI doesn't visibly change after wiring the library up correctly.

The library **never touches your component templates or styles directly.** It writes CSS custom properties onto `document.documentElement` (and a couple of `data-*` attributes), and your own SCSS/CSS is responsible for actually consuming them. If your components don't reference these variables, nothing will visibly change — the library isn't broken, it's just not wired to anything your styles read from.

### Color tokens (`color` domain)
Full Material 3 role set: `--mat-sys-primary`, `--mat-sys-on-primary`, `--mat-sys-primary-container`, `--mat-sys-surface`, `--mat-sys-outline`, etc. — plus semantic extras: `--mat-sys-success`, `--mat-sys-warning`, `--mat-sys-info` (and their `on-`/`-container` pairs), and one four-token set per custom **extended color** you define (e.g. `--mat-sys-brand`, `--mat-sys-on-brand`, ...).

### Typography tokens (`typography` domain)
Per role (`display-large`, `headline-medium`, `body-small`, etc.): `--mat-sys-{role}-font`, `--mat-sys-{role}-size`, `--mat-sys-{role}-line-height`.

### Shape tokens (`layout` domain — shape)
`--mat-sys-corner-extra-small` through `--mat-sys-corner-full`.

### Data attributes
`data-theme-mode` (`light`/`dark`), `data-theme-scheme`, `data-theme-contrast` (`high`, or absent), `data-theme-density` (`0` to `-3`).

### `color-scheme` CSS property
Set directly on `<html>` to match the resolved mode, so native form controls/scrollbars follow suit automatically.

---

## 8. Storage, custom keys & migrations

By default, preferences persist to `localStorage` under the key `ng-material-theming.prefs`. Override it:

```ts
providePreferences({ storageKey: 'my-app.preferences' })
```

Preferences aren't tied to `localStorage` — implement `IPreferencesStorage` (`load()` / `save()`) and provide it via `PREFERENCES_STORAGE_TOKEN` to sync with a database, a backend API, or anything else.

### Upgrading from a pre-library flat storage schema

If your app previously stored preferences in a different (e.g. flat, non-domain-nested) shape, provide a `migrationStrategy` to translate old data into the current shape. The library doesn't assume anything about your history — this is entirely your function:

```ts
providePreferences({
  migrationStrategy: (raw: any) => {
    if (raw._v === 2) return raw; // already current
    return {
      _v: 2,
      color: { mode: raw.mode, scheme: raw.scheme /* ...map the rest */ },
      // ...other domains
    };
  },
})
```

If you omit `migrationStrategy` and your stored data doesn't match any registered domain's shape, the library logs a `console.warn` in dev mode rather than silently discarding your users' saved preferences without a trace — but it will still fall back to defaults, so don't skip this step if you have legacy data.

If your migration function throws, the library catches it, logs the error, and falls back to defaults rather than crashing your app at bootstrap.

---

## 9. Font loading

By default, the `typography` domain fetches non-system fonts from Google Fonts on demand. If you self-host fonts, use a different provider, or run under a CSP that blocks `fonts.googleapis.com`, disable this:

```ts
providePreferences({ disableRemoteFonts: true })
```

Or implement your own loading strategy entirely:

```ts
import { FontLoaderStrategy, FONT_LOADER_STRATEGY } from 'ng-material-preferences';

class MyFontLoader implements FontLoaderStrategy {
  loadFont(family: string, document: Document): void {
    // your own font-loading logic
  }
}

providers: [
  ...provideTypographyPreferences(),
  { provide: FONT_LOADER_STRATEGY, useClass: MyFontLoader },
]
```

---

## 10. Convenience constants & i18n

The library exports label constants for building your own UI quickly:

```ts
import { CVD_MODES, SCHEME_VARIANTS, SCREEN_FILTERS, FONT_OPTIONS } from 'ng-material-preferences';

CVD_MODES // [{ value: 'protanopia', label: 'Protanomaly/Protanopia', desc: 'Red-blindness spectrum' }, ...]
```

**Important:** the `value` field on each of these is the real, language-neutral contract — it's the exact string the typed setters (`setCvdMode`, `setVariant`, `setScreenFilter`) expect, and it's what gets persisted to storage. The `label` and `desc` fields are **English convenience defaults only**, provided so an English-language app can wire up a settings UI without writing its own copy.

If you're building a UI in another language, don't bind `label`/`desc` directly — write your own translated strings, keyed off the same `value`:

```ts
const CVD_LABELS_FR: Record<string, string> = {
  protanopia: 'Protanomalie/Protanopie',
  deuteranopia: 'Deutéranomalie/Deutéranopie',
  // ...
};
```

Because the library is headless — it renders no markup and no strings of its own — this is the *only* place English text appears in the package at all. Nothing the library actually renders (CSS variables, DOM attributes, SVG filter math) is language-dependent.

---

## 11. Architectural constraints

- **One instance per page.** `DomService` writes to `document.documentElement` and `document.body` globally (CSS variables, SVG filters, injected `<style>` tags for motion). Multiple independent instances on one page (e.g. theming two unrelated widgets differently) isn't supported in this version.
- **Storage schema stability is a documentation contract, not an enforced one.** A future major version of this library may change `PreferencesState`'s shape; if you provide a `migrationStrategy`, revisit it when upgrading across major versions.
- **This package ships pure state/logic + one optional SCSS partial — no Angular Material UI components.** You (or the demo app in this repo) own the actual settings interface.

---

## 12. API reference

### Setup

| Export | Purpose |
|---|---|
| `providePreferences(config?)` | Convenience provider covering domain selection, storage key, migration strategy, and remote font toggling |
| `provideColorPreferences()` | Register only the `color` domain |
| `provideAccessibilityPreferences()` | Register only the `accessibility` domain |
| `provideTypographyPreferences()` | Register only the `typography` domain |
| `provideLayoutPreferences()` | Register only the `layout` domain |
| `provideNotificationPreferences()` | Register only the `notifications` domain |
| `provideAllThemingPreferences()` | Register all five, without the config object |

### Facade

| Export | Purpose |
|---|---|
| `PreferencesService` | Inject this. Exposes every domain's signals/setters, `hasX` capability flags, `resetToDefaults()`, `patchState()` |

### Storage

| Export | Purpose |
|---|---|
| `IPreferencesStorage` | Interface to implement for custom persistence |
| `PREFERENCES_STORAGE_TOKEN` | DI token to provide your storage implementation |
| `LocalPreferencesStorageService` | Default `localStorage`-backed implementation |
| `PREFERENCES_STORAGE_KEY_TOKEN` | DI token to override the default storage key |
| `PreferencesMigrationFn` / `PREFERENCES_MIGRATION_TOKEN` | Type and token for legacy-data migration |

### Fonts

| Export | Purpose |
|---|---|
| `FontLoaderStrategy` | Interface to implement a custom font loader |
| `FONT_LOADER_STRATEGY` | DI token to provide it |
| `GoogleFontLoaderStrategy` | Default implementation |
| `NoopFontLoaderStrategy` | Opt-out implementation (no remote font loading) |

### Types & constants

| Export | Purpose |
|---|---|
| `PreferencesState` and per-domain interfaces (`ColorPreferences`, `AccessibilityPreferences`, etc.) | For type-safety in your own code |
| `ThemeMode`, `CvdMode`, `ScreenFilter`, `SchemeVariant`, etc. | Union types matching each setter's parameter |
| `CVD_MODES`, `SCHEME_VARIANTS`, `SCREEN_FILTERS`, `FONT_OPTIONS` | English-labeled convenience lists — see [§10](#10-convenience-constants--i18n) |
| `DEFAULT_PREFERENCES_STATE` | The full default state tree |
| `isValidHexColor` | Hex color validator used internally, exported for reuse |
