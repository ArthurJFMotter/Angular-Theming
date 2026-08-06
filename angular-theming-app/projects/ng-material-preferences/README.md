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
8. [The motion engine](#8-the-motion-engine)
9. [Storage, custom keys & migrations](#9-storage-custom-keys--migrations)
10. [Font loading](#10-font-loading)
11. [Convenience constants & i18n](#11-convenience-constants--i18n)
12. [Architectural constraints](#12-architectural-constraints)
13. [Troubleshooting](#13-troubleshooting)
14. [API reference](#14-api-reference)

---

## 1. Installation

```bash
npm install ng-material-preferences
```

### Peer dependencies

| Package | Why |
|---|---|
| `@angular/core` | Signals, DI, `ENVIRONMENT_INITIALIZER` |
| `@angular/common` | `DOCUMENT` injection |
| `@angular/material` | Snackbar position types, `mat.theme()` SCSS mixin |
| `@angular/cdk` | `OverlayContainer`, used to scope the motion kill-switch to overlay-attached components |
| `@material/material-color-utilities` | M3 color science (HCT, tonal palettes, dynamic schemes) |

No Angular Material **components** are required by the library itself — it never imports `MatButtonModule`, `MatSelectModule`, etc. You only need those in your own UI, if you build one.

---

## 2. Quick start

**`app.config.ts`**

```ts
import { ApplicationConfig } from '@angular/core';
import { providePreferences } from 'ng-material-preferences';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...your other providers (router, animations, etc.)

    providePreferences(), // registers all five domains, persists to localStorage by default
  ],
};
```

That's genuinely it. `providePreferences()` registers a default `localStorage`-backed storage implementation automatically, and internally wires an `ENVIRONMENT_INITIALIZER` that wakes up the library's sync engine as soon as your app starts. You do **not** need to provide a storage token or inject anything in `AppComponent` for state persistence or DOM/CSS effects to start working. (See [§9](#9-storage-custom-keys--migrations) if you want to override the default storage backend.)

**`app.component.ts`** — recommended, covers the small set of Material components still driven by Angular's animation engine rather than plain CSS (see [§8](#8-the-motion-engine)):

```ts
import { Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreferencesService } from 'ng-material-preferences';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private prefs = inject(PreferencesService);

  @HostBinding('@.disabled')
  get animationsDisabled() {
    return this.prefs.motionScale() === 0;
  }
}
```

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

Preferences are now persisted, reactive across your whole app via Signals, and automatically reflected as CSS custom properties and data attributes on `<html>`.

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

> Note: granular composition still requires you to separately wire a storage provider (`providePreferences()` is the one that auto-registers the default). See [§9](#9-storage-custom-keys--migrations).

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

Angular Material's density system, a handful of CDK-rendered overlays (snackbars, dialogs, bottom sheets), and the motion engine's forced-duration overrides can't be wired up with runtime JS/CSS-variable injection alone — they require SCSS-time mixin generation and class-targeted selectors. The library ships an optional SCSS partial that handles this.

```scss
@use 'ng-material-preferences/src/styles/theming' as prefs;

@include prefs.setup-theming(); // convenience: includes everything below
```

Or compose only what you need:

```scss
@use 'ng-material-preferences/src/styles/theming' as prefs;

@include prefs.fallback-tokens();  // safe defaults for tokens the color engine or Material's own mixin might not supply
@include prefs.cdk-overrides();    // wires snackbars/dialogs/bottom sheets to your tokens
@include prefs.apply-density();    // only needed if you use the layout domain's density feature
@include prefs.apply-motion();     // only needed if you use the layout domain's motion feature
```

| Mixin | What it does | When you need it |
|---|---|---|
| `fallback-tokens()` | Defines semantic color tokens (`--mat-sys-success`/`-warning`/`-info` and their `on-`/`-container` variants) plus the M3 state-layer opacity tokens (`--mat-sys-hover-state-layer-opacity` and friends) at safe default values | Always — even with the color domain active, this covers the moment before the first sync and guards against Angular Material builds that scope these tokens narrowly instead of emitting them at `:root` |
| `cdk-overrides()` | Shapes snackbars/dialogs/bottom sheets using your corner-radius tokens; maps `snackbar-success`/`-warning`/`-info`/`-error` panel classes to your semantic color tokens | If you use notifications, dialogs, or bottom sheets |
| `apply-density()` | Generates the SCSS-time density variants (`-1` to `-3`) keyed to the `data-theme-density` attribute the library writes on `<html>` | Only if you use `layout` domain's `densityScale` |
| `apply-motion()` | Class-targeted forced-duration overrides for both in-page (sidenav, chips, tabs, toggles, form fields) and CDK-overlay (dialogs, menus, snackbars, tooltips) components, keyed to `data-theme-motion`/`.theme-motion-off` | Only if you use `layout` domain's `motionScale` |

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
prefs.cvd()                // current CVD simulation mode
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

The library **never touches your component templates or styles directly.** It writes CSS custom properties onto `document.documentElement` (and a couple of `data-*` attributes), and your own SCSS/CSS — plus the library's own `setup-theming()` partial — is what actually consumes them. If your components don't reference these variables, nothing will visibly change; the library isn't broken, it's just not wired to anything your styles read from.

### Color tokens (`color` domain)
Full Material 3 role set: `--mat-sys-primary`, `--mat-sys-on-primary`, `--mat-sys-primary-container`, `--mat-sys-surface`, `--mat-sys-outline`, etc. — plus semantic extras: `--mat-sys-success`, `--mat-sys-warning`, `--mat-sys-info` (and their `on-`/`-container` pairs), and one four-token set per custom **extended color** you define (e.g. `--mat-sys-brand`, `--mat-sys-on-brand`, ...).

**`-channel` variants.** Every color token above also gets a matching `-channel` counterpart (e.g. `--mat-sys-primary-channel: 59, 111, 214`) — a bare `R, G, B` triplet with no `#` or `rgba()` wrapper. Angular Material's hover/focus/pressed state layers compose these with an opacity value at the point of use (`rgba(var(--mat-sys-primary-channel), 0.08)`), so this is what makes interactive states (button hover tints, ripple color) follow your dynamic theme instead of the SCSS-compiled fallback palette.

**State-layer opacity tokens.** `--mat-sys-hover-state-layer-opacity`, `-focus-`, `-pressed-`, `-dragged-state-layer-opacity` — these are not colors, so `ColorEngine` doesn't generate them; they're supplied by `fallback-tokens()` in the SCSS partial (see [§4](#4-scss-setup)) as a defensive default, since Angular Material's own `mat.theme()` mixin can scope them narrowly (e.g. to `.mat-app-background`) rather than emitting them globally at `:root`, which is what this library's dynamic, page-wide theme swapping needs.

### Typography tokens (`typography` domain)
Per role (`display-large`, `headline-medium`, `body-small`, etc.): `--mat-sys-{role}-font`, `--mat-sys-{role}-size`, `--mat-sys-{role}-line-height`.

### Shape tokens (`layout` domain — shape)
`--mat-sys-corner-extra-small` through `--mat-sys-corner-full`.

### Motion token (`layout` domain — motion)
`--theme-motion-scale` — a plain multiplier (`0`, `0.5`, `1`) exposed for your own CSS transitions. See [§8](#8-the-motion-engine) for the full motion picture; this variable is only *part* of how motion preference is enforced.

### Data attributes
`data-theme-mode` (`light`/`dark`), `data-theme-scheme`, `data-theme-contrast` (`high`, or absent), `data-theme-density` (`0` to `-3`), `data-theme-motion` (`off`, or absent).

### `color-scheme` CSS property
Set directly on `<html>` to match the resolved mode, so native form controls/scrollbars follow suit automatically.

---

## 8. The motion engine

Motion preference (`prefs.motionScale()` — `0` = off, `0.5` = fast, `1` = normal) is enforced through **three separate mechanisms**, because Angular Material's components don't all use the same animation system. Understanding this split matters if you're debugging why something isn't responding to the slider.

### Why three mechanisms

Most current Angular Material components (menus, selects, sidenav, chips, tabs, button-toggle, form field notches) animate via plain **CSS transitions** defined in Material's own stylesheets — not Angular's animation engine. A smaller set of components, along with your own app code, may still use Angular's `@angular/animations` triggers. And a third category — CDK-overlay-attached components (dialogs, menus, snackbars, tooltips) — sit outside your app's component view tree entirely, so mechanisms that rely on view-tree propagation can't reach them. One mechanism can't cover all three cases, so the library and its SCSS partial cover each explicitly:

1. **`data-theme-motion="off"` on `<html>`** (set by `ThemeSyncService`, consumed by the `apply-motion()` SCSS mixin) — forces `transition-duration`/`animation-duration` to near-zero on in-page, CSS-driven components (sidenav, chips, tabs, button-toggle, form fields, progress indicators).
2. **`.theme-motion-off` class on the CDK overlay container** (also set by `ThemeSyncService`, also consumed by `apply-motion()`) — same forced-duration treatment, scoped to `.cdk-overlay-pane` and its descendants, so it reaches dialogs/menus/snackbars/tooltips without needing view-tree propagation. This is scoped narrowly enough that it does not interfere with button ripples (which are governed separately — see below).
3. **`[@.disabled]`**, bound in your own `AppComponent` (recommended in [§2](#2-quick-start)) — Angular's built-in mechanism for disabling any remaining components that genuinely use `@angular/animations` triggers rather than CSS transitions.

Ripples are handled independently of all three, via `MAT_RIPPLE_GLOBAL_OPTIONS`, which the library provides automatically — ripple duration scales proportionally with `motionScale` (not just on/off), and continues to render correctly at every motion setting, including inside dialogs and menus.

### Off vs. Fast — an important asymmetry

- **`motionScale = 0` (Off)** — genuinely stops nearly all Material component animations, via the two CSS class/attribute switches above, plus `[@.disabled]` as a safety net for anything else. This is the setting that matters for motion-sensitive users and should be considered reliable.
- **`motionScale = 0.5` (Fast)** — only affects **your own app's CSS** that explicitly reads `--theme-motion-scale`:
  ```scss
  .my-component {
    transition: all calc(0.2s * var(--theme-motion-scale, 1)) ease;
  }
  ```
  Angular Material's own built-in component animation *durations* are not proportionally adjustable at runtime — there's no supported API to multiply a third-party component's hardcoded transition duration. Ripple duration is the one exception (handled via the ripple provider). If you need "Fast" to visibly affect *your* UI, you must opt each custom transition in via the pattern above; it will never be automatic for you the way "Off" is.

---

## 9. Storage, custom keys & migrations

`providePreferences()` registers a `localStorage`-backed default automatically, under the key `ng-material-theming.prefs`. Override the key:

```ts
providePreferences({ storageKey: 'my-app.preferences' })
```

Or override the storage backend entirely — implement `IPreferencesStorage` (`load()` / `save()`) and provide it via `PREFERENCES_STORAGE_TOKEN` *after* `providePreferences()` in your `providers` array (Angular resolves the last provider for a token, so this cleanly overrides the default):

```ts
providers: [
  providePreferences(),
  { provide: PREFERENCES_STORAGE_TOKEN, useClass: MyDatabaseBackedStorageService },
]
```

> If you're composing domains granularly instead of using `providePreferences()`, you must provide `PREFERENCES_STORAGE_TOKEN` yourself — the default is only auto-registered by the convenience wrapper.

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

## 10. Font loading

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

## 11. Convenience constants & i18n

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

## 12. Architectural constraints

- **One instance per page.** `DomService` writes to `document.documentElement` and `document.body` globally (CSS variables, SVG filters). Multiple independent instances on one page (e.g. theming two unrelated widgets differently) isn't supported in this version.
- **Storage schema stability is a documentation contract, not an enforced one.** A future major version of this library may change `PreferencesState`'s shape; if you provide a `migrationStrategy`, revisit it when upgrading across major versions.
- **Motion "Fast" only accelerates opted-in CSS.** See [§8](#8-the-motion-engine) — this is a deliberate limitation of what's possible with third-party component animations, not an oversight.
- **This package ships pure state/logic + one optional SCSS partial — no Angular Material UI components.** You (or the demo app in this repo) own the actual settings interface.

---

## 13. Troubleshooting

**Blank white screen at app bootstrap, `NG0201: No provider found for InjectionToken PREFERENCES_STORAGE_TOKEN`**
You're using granular domain providers (`provideColorPreferences()`, etc.) without also providing storage — only `providePreferences()` auto-registers a default. Either switch to `providePreferences()`, or add `{ provide: PREFERENCES_STORAGE_TOKEN, useClass: LocalPreferencesStorageService }` yourself. See [§9](#9-storage-custom-keys--migrations).

**Buttons/chips/menus show a solid opaque color block on hover instead of a subtle tint**
The M3 state-layer opacity tokens (`--mat-sys-hover-state-layer-opacity`, etc.) aren't defined anywhere in your cascade, so the browser falls back to `opacity: 1`. Make sure `@include prefs.fallback-tokens()` (or `setup-theming()`) is included in your global styles — see [§4](#4-scss-setup) and [§7](#7-the-css-custom-properties-contract).

**Motion slider doesn't visibly affect dialogs, menus, sidenav, chips, or tabs**
Confirm `@include prefs.apply-motion()` (or `setup-theming()`) is included in your global styles. If it is and specific components still aren't responding, they may be using Angular's `@angular/animations` triggers rather than CSS transitions — make sure `[@.disabled]` is bound in your root component as shown in [§2](#2-quick-start).

**Motion "Fast" doesn't make my own custom transitions faster**
You need to explicitly opt each transition in via `calc(... * var(--theme-motion-scale, 1))` — this is not automatic. See [§8](#8-the-motion-engine).

---

## 14. API reference

### Setup

| Export | Purpose |
|---|---|
| `providePreferences(config?)` | Convenience provider covering domain selection, default storage, storage key, migration strategy, and remote font toggling |
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
| `PREFERENCES_STORAGE_TOKEN` | DI token to override the default storage implementation |
| `LocalPreferencesStorageService` | Default `localStorage`-backed implementation, auto-registered by `providePreferences()` |
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
| `CVD_MODES`, `SCHEME_VARIANTS`, `SCREEN_FILTERS`, `FONT_OPTIONS` | English-labeled convenience lists — see [§11](#11-convenience-constants--i18n) |
| `DEFAULT_PREFERENCES_STATE` | The full default state tree |
| `isValidHexColor` | Hex color validator used internally, exported for reuse |

### SCSS (`ng-material-preferences/src/styles/theming`)

| Mixin | Purpose |
|---|---|
| `setup-theming()` | Convenience: includes all four mixins below |
| `fallback-tokens()` | Semantic color + state-layer opacity token defaults |
| `cdk-overrides()` | Snackbar/dialog/bottom-sheet shape and color wiring |
| `apply-density()` | SCSS-time density variant generation |
| `apply-motion()` | Motion kill-switch selectors for in-page and CDK-overlay components |
