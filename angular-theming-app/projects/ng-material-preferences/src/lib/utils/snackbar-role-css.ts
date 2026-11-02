/**
 * Pure helpers (no Angular) that build the runtime `.snackbar-<role>` rules.
 *
 * KEEP IN SYNC with the SCSS `apply-snackbar-theme()` mixin
 * (styles/theming/cdk/_snackbar.scss): same five custom properties, same
 * token mapping. Built-in roles are emitted by SCSS, so they are skipped here.
 */

export type SnackbarRoleTone = 'container' | 'solid';

/** Roles the SCSS `snackbar-variants()` already generates (plus 'default'). */
export const BUILT_IN_SNACKBAR_ROLES: ReadonlySet<string> = new Set([
  'default',
  'success',
  'warning',
  'info',
  'error',
]);

/**
 * Letters, digits, `_` and `-` only. The role is used as a class suffix
 * (`.snackbar-<role>`) and inside custom-property names (`--mat-sys-<role>-container`),
 * where every such string is valid, including `2024-promo`. The library's own
 * extended-color ids (`label.toLowerCase().replace(/[^a-z0-9]/g, '-')`) always match.
 * Anything else is never placed into CSS.
 */
const SAFE_ROLE = /^[A-Za-z0-9_-]+$/;

export function isSafeRoleName(role: string): boolean {
  return SAFE_ROLE.test(role);
}

export function buildSnackbarRoleCss(
  roles: readonly string[],
  tone: SnackbarRoleTone = 'container',
): string {
  const unique = [...new Set(roles)]
    .filter((r) => isSafeRoleName(r) && !BUILT_IN_SNACKBAR_ROLES.has(r))
    .sort();

  return unique
    .map((role) => {
      const bg = tone === 'solid' ? `--mat-sys-${role}` : `--mat-sys-${role}-container`;
      const fg = tone === 'solid' ? `--mat-sys-on-${role}` : `--mat-sys-on-${role}-container`;
      return (
        `.snackbar-${role}{` +
        `--mdc-snackbar-container-color:var(${bg});` +
        `--mdc-snackbar-supporting-text-color:var(${fg});` +
        `--mat-snack-bar-container-color:var(${bg});` +
        `--mat-snack-bar-supporting-text-color:var(${fg});` +
        `--mat-snack-bar-button-color:var(${fg});}`
      );
    })
    .join('\n');
}