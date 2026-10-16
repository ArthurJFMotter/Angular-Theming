import {
  BUILT_IN_SNACKBAR_ROLES,
  buildSnackbarRoleCss,
  isSafeRoleName,
} from './snackbar-role-css';

/**
 * Every custom property a role rule must set.
 * Mirrors the SCSS `apply-snackbar-theme()` mixin (styles/theming/cdk/_snackbar.scss):
 * if one side changes, this contract test fails until the other follows.
 */
const ROLE_PROPERTIES = [
  '--mdc-snackbar-container-color',
  '--mdc-snackbar-supporting-text-color',
  '--mat-snack-bar-container-color',
  '--mat-snack-bar-supporting-text-color',
  '--mat-snack-bar-button-color',
] as const;

interface ParsedRule {
  selector: string;
  declarations: Record<string, string>;
}

/** Parses the generated `.snackbar-x{a:b;c:d;}` lines (one rule per line). */
function parseRules(css: string): ParsedRule[] {
  return css
    .split('\n')
    .filter(Boolean)
    .map((rule) => {
      const open = rule.indexOf('{');
      const close = rule.lastIndexOf('}');
      const declarations: Record<string, string> = {};
      for (const decl of rule.slice(open + 1, close).split(';').filter(Boolean)) {
        const colon = decl.indexOf(':');
        declarations[decl.slice(0, colon)] = decl.slice(colon + 1);
      }
      return { selector: rule.slice(0, open), declarations };
    });
}

/** First generated rule; fails the test clearly if none was emitted. */
function firstRule(css: string): ParsedRule {
  const rule = parseRules(css)[0];
  if (!rule) throw new Error('Expected at least one generated rule');
  return rule;
}

describe('snackbar-role-css', () => {
  describe('BUILT_IN_SNACKBAR_ROLES', () => {
    it('lists exactly the roles the SCSS already covers, plus "default"', () => {
      expect([...BUILT_IN_SNACKBAR_ROLES].sort()).toEqual([
        'default',
        'error',
        'info',
        'success',
        'warning',
      ]);
    });
  });

  describe('isSafeRoleName', () => {
    const valid = ['brand', 'Brand', 'custom-role-2', 'custom_role', '_x', 'a1', 'a-b-c'];
    const invalid: [string, string][] = [
      ['', 'empty'],
      ['1a', 'leading digit'],
      ['-a', 'leading hyphen'],
      ['--a', 'leading double hyphen'],
      ['my role', 'space'],
      ['a.b', 'dot'],
      ['a}', 'closing brace'],
      ['a{b', 'opening brace'],
      ['<b>', 'markup'],
      ['a;b', 'semicolon'],
      ['a/b', 'slash'],
      ["a'b", 'single quote'],
      ['a"b', 'double quote'],
      ['a\nb', 'newline'],
      ['café', 'non-ASCII'],
    ];

    for (const role of valid) {
      it(`accepts "${role}"`, () => {
        expect(isSafeRoleName(role)).toBeTrue();
      });
    }

    for (const [role, why] of invalid) {
      it(`rejects ${why}`, () => {
        expect(isSafeRoleName(role)).toBeFalse();
      });
    }
  });

  describe('buildSnackbarRoleCss', () => {
    it('returns an empty string when there is nothing to emit', () => {
      expect(buildSnackbarRoleCss([])).toBe('');
      expect(buildSnackbarRoleCss(['success', 'default', 'error'])).toBe('');
      expect(buildSnackbarRoleCss(['bad role', '1x'])).toBe('');
    });

    it('emits one `.snackbar-<role>` rule per role', () => {
      const rules = parseRules(buildSnackbarRoleCss(['brand', 'accent']));
      expect(rules.map((r) => r.selector)).toEqual(['.snackbar-accent', '.snackbar-brand']);
    });

    it('sets exactly the five contract properties on every rule', () => {
      for (const rule of parseRules(buildSnackbarRoleCss(['brand', 'accent']))) {
        expect(Object.keys(rule.declarations).sort()).toEqual([...ROLE_PROPERTIES].sort());
      }
    });

    it('uses the container pair by default', () => {
      const rule = firstRule(buildSnackbarRoleCss(['brand']));
      const bg = 'var(--mat-sys-brand-container)';
      const fg = 'var(--mat-sys-on-brand-container)';
      expect(rule.declarations).toEqual({
        '--mdc-snackbar-container-color': bg,
        '--mdc-snackbar-supporting-text-color': fg,
        '--mat-snack-bar-container-color': bg,
        '--mat-snack-bar-supporting-text-color': fg,
        '--mat-snack-bar-button-color': fg,
      });
    });

    it('uses the solid pair when asked', () => {
      const rule = firstRule(buildSnackbarRoleCss(['brand'], 'solid'));
      const bg = 'var(--mat-sys-brand)';
      const fg = 'var(--mat-sys-on-brand)';
      expect(rule.declarations).toEqual({
        '--mdc-snackbar-container-color': bg,
        '--mdc-snackbar-supporting-text-color': fg,
        '--mat-snack-bar-container-color': bg,
        '--mat-snack-bar-supporting-text-color': fg,
        '--mat-snack-bar-button-color': fg,
      });
    });

    it('skips built-in roles (the SCSS already generates them)', () => {
      const css = buildSnackbarRoleCss(['success', 'warning', 'info', 'error', 'default', 'brand']);
      expect(parseRules(css).map((r) => r.selector)).toEqual(['.snackbar-brand']);
    });

    it('de-duplicates roles', () => {
      const css = buildSnackbarRoleCss(['brand', 'brand', 'brand']);
      expect(parseRules(css).length).toBe(1);
    });

    it('is deterministic regardless of input order', () => {
      expect(buildSnackbarRoleCss(['b', 'a', 'c'])).toBe(buildSnackbarRoleCss(['c', 'a', 'b']));
    });

    it('drops unsafe names but keeps the safe ones from the same call', () => {
      const css = buildSnackbarRoleCss(['brand', 'x}</style><img src=x onerror=alert(1)>', 'my role', '1x']);
      expect(parseRules(css).map((r) => r.selector)).toEqual(['.snackbar-brand']);
    });

    it('never lets a role name break out of its rule', () => {
      const css = buildSnackbarRoleCss(['a', 'b', 'evil}.x{color:red', 'c']);
      expect(css.split('{').length - 1).toBe(3);
      expect(css.split('}').length - 1).toBe(3);
      expect(css).not.toContain('<');
      expect(css).not.toContain('color:red');
    });
  });
});