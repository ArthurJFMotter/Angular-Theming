# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*(Any new features, fixes, or breaking changes currently in development will be logged here).*

## [1.1.1] - 2026-10-08
### Changed
- **Snackbar Default Position**: `DEFAULT_PREFERENCES_STATE.notifications.snackbarVPosition` now defaults to `'top'` (previously `'bottom'`). Consumers who relied on the old default and have no persisted preference will see snackbars appear at the top of the viewport; set `snackbarVPosition: 'bottom'` explicitly to retain the previous behavior.

### Fixed
- **Shape Scale Corner Radius**: `cdk-overrides()` now applies the correct shape-scale corner curves to `mat-button`, `mat-button-toggle`, and `mat-chip` components and all of their variants (text, raised, unelevated, outlined, FAB / mini-FAB, chip option / row / basic chip and the underlying `mdc-evolution-chip` elements). Previously, these components only responded to two shape states and did not follow the full `SHAPE_SCALE` range, so intermediate settings (e.g., "Extra Round" and "Pill") did not render with the expected curvature.

## [1.1.0] - 2026-09-29
### Added
- **Single Source of Truth Metrics**: Exported new heavily-typed `ScaleDefinition` objects (`FONT_SCALE`, `SHAPE_SCALE`, `CONTRAST_SCALE`, `DENSITY_SCALE`, `MOTION_SCALE`, `CVD_SEVERITY_SCALE`, `SCREEN_FILTER_INTENSITY_SCALE`). UI components should consume these directly to build sliders and cycle buttons.
- **Threshold Constants**: Exported `HIGH_CONTRAST_THRESHOLD`, `MAX_COLOR_PROFILES`, and `MAX_EXTENDED_COLORS` to standardize UI warnings and state-layer shifts.
- **Snackbar Option Arrays**: Exported `SNACKBAR_V_POSITIONS` and `SNACKBAR_H_POSITIONS`.

### Deprecated
- `ContrastMode` and `CONTRAST_MODES`: These flat-state legacy typings are no longer valid under the v2 auto-contrast/level paradigm and will be removed in v2.0.0. Use `CONTRAST_SCALE` instead.

## [1.0.2] - 2026-09-18
### Fixed
- **Snackbar Width**: `cdk-overrides()` now sets `min-width: fit-content` on the snackbar surface. Short messages (e.g. "Action completed.") render at their natural width instead of stretching to Material's default fixed minimum.
- **Snackbar Action & Dismiss Button Color**: `cdk-overrides()` now targets any snackbar with a class name containing `snackbar-` (`[class*="snackbar-"]`) and applies the semantic `on-*-container` color to its action button (e.g. "UNDO", "RETRY") and dismiss icon, via both the relevant Material CSS custom properties and a direct `color` override — the custom-property mapping alone was not sufficient to win Material's own cascade in testing. Previously, these buttons always rendered in the theme's primary color regardless of the snackbar's severity, so an error toast's action button could read in the same color as a success toast's.

## [1.0.1] - 2026-09-09
### Fixed
- **Monochrome Semantic Colors**: Refactored `ColorEngine.buildSemanticTokens` to generate tones directly from the source HEX. Semantic colors (Success, Warning, Info) now correctly preserve their hue and chroma under all Scheme Variants (e.g., Monochrome), matching the native MCU Error palette behavior.

## [1.0.0] - 2026-08-07
### Added
- **Granular DI Architecture**: Introduced `providePreferences()` and individual domain providers (`provideColorPreferences()`, etc.) to enable strict tree-shaking of unused features.
- **Pluggable Migrations**: Added `PreferencesMigrationFn` and `PREFERENCES_MIGRATION_TOKEN` to allow consumers to safely upgrade legacy `localStorage` schemas.
- **Side-Effect Boundaries**: Added opt-out mechanisms for remote font loading (`disableRemoteFonts`) and configurable `localStorage` keys.
- **State-Layer Opacity**: Added `fallback-tokens()` SCSS mixin to globally inject M3 interaction opacities (`--mat-sys-hover-state-layer-opacity`, etc.), ensuring proper button/ripple shading across custom palettes.
- **RGB Channel Tokens**: `ColorEngine` now automatically generates comma-separated RGB variants (e.g., `--mat-sys-primary-channel`) required by Angular Material for `rgba()` composition.
- **`@angular/cdk` Peer Dependency**: Formally added to `package.json` to support strictly-hoisted package managers (like `pnpm`).
- **Comprehensive Test Suite**: Achieved full coverage across DOM mutations, Facade routing, safe-fallbacks, and Color Engine math generation.

### Changed
- **Facade Pattern**: Refactored the monolithic `PreferencesService` into a type-safe, null-safe facade proxying 5 independent domain services.
- **Motion Engine Overhaul**: Replaced the blunt "CSS Hammer" with a targeted, dual-pronged approach (`data-theme-motion` for in-page elements, `.theme-motion-off` for CDK Overlays).

### Fixed
- **Stuck Ripple Bug**: Fixed an issue where setting Motion to 0 caused Material ripples to permanently stick to the DOM. Ripples are now properly scaled/disabled natively via `MAT_RIPPLE_GLOBAL_OPTIONS`.
- **Silent Data Loss**: Fixed a bug where `patchState` would silently swallow legacy storage formats. Added `try/catch` wrappers and dev-mode heuristic console warnings to guide developers.
- **State Restoration Overwrite**: Fixed a bug in `ColorPreferencesService` where restoring the scratchpad color during boot-time `patchState` inadvertently routed through the same "smart" logic used for user-driven color changes — which writes into whichever profile is currently active — silently overwriting a saved profile's colors with default scratchpad values on every page reload. `patchState` now sets the underlying signal directly, bypassing that logic entirely.
- **Component Domain Guards**: Ensured UI components strictly check capability flags (e.g., `prefs.hasColor`) before attempting to render domain-specific controls, preventing silent proxy failures.

## [0.0.1] - 2026-07-16
### Added
- Initial proof-of-concept release. 
- Basic Material 3 tonal palette generation and global CSS injection.
- Initial Vision Simulator (CVD matrices and environmental CSS filters).