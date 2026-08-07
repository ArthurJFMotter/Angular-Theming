# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*(Any new features, fixes, or breaking changes currently in development will be logged here).*

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
- **State Restoration Overwrite**: Fixed a bug in `ColorPreferencesService` where restoring the scratchpad color inadvertently overwrote saved color profiles upon page reload.
- **Component Domain Guards**: Ensured UI components strictly check capability flags (e.g., `prefs.hasColor`) before attempting to render domain-specific controls, preventing silent proxy failures.

## [0.0.1] - 2026-07-16
### Added
- Initial proof-of-concept release. 
- Basic Material 3 tonal palette generation and global CSS injection.
- Initial Vision Simulator (CVD matrices and environmental CSS filters).