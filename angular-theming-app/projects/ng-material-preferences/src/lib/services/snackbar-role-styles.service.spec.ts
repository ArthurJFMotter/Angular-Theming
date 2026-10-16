import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SnackbarRoleStylesService } from './snackbar-role-styles.service';

/** Selectors of the rules in a constructable stylesheet. */
function selectors(sheet: CSSStyleSheet | undefined): string[] {
  return Array.from(sheet?.cssRules ?? []).map((r) => (r as CSSStyleRule).selectorText);
}

describe('SnackbarRoleStylesService', () => {
  // ─────────────────────────────────────────────────────────────
  // Real document: constructable stylesheet path (modern browsers)
  // ─────────────────────────────────────────────────────────────
  describe('with the real document (adoptedStyleSheets)', () => {
    let service: SnackbarRoleStylesService;
    let sheetsBefore: number;
    const probes: HTMLElement[] = [];
    const rootProps = new Set<string>();

    const lastSheet = () => document.adoptedStyleSheets.at(-1);

    /** Sets a token on :root; removed in afterEach. */
    function setToken(name: string, value: string): void {
      document.documentElement.style.setProperty(name, value);
      rootProps.add(name);
    }

    /** An element carrying the panel class, like Material's snackbar container. */
    function probe(role: string): HTMLElement {
      const el = document.createElement('div');
      el.className = `snackbar-${role}`;
      document.body.appendChild(el);
      probes.push(el);
      return el;
    }

    const computed = (el: HTMLElement, prop: string) =>
      getComputedStyle(el).getPropertyValue(prop).trim();

    beforeEach(() => {
      service = TestBed.inject(SnackbarRoleStylesService);
      sheetsBefore = document.adoptedStyleSheets.length;
    });

    afterEach(() => {
      service.ngOnDestroy();
      probes.splice(0).forEach((p) => p.remove());
      rootProps.forEach((n) => document.documentElement.style.removeProperty(n));
      rootProps.clear();
    });

    it('adds a single stylesheet on first sync and nothing to <head>', () => {
      service.sync(['brand']);
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore + 1);
      expect(document.head.querySelectorAll('style[data-ngmp="snackbar-roles"]').length).toBe(0);
    });

    it('writes a rule for every custom role, sorted', () => {
      service.sync(['brand', 'accent']);
      expect(selectors(lastSheet())).toEqual(['.snackbar-accent', '.snackbar-brand']);
    });

    it('adds nothing for built-in or unsafe roles', () => {
      service.sync(['success', 'warning', 'info', 'error', 'default']);
      service.sync(['x}</style>', 'bad role', '1x']);
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore);
    });

    it('is a no-op when called again with the same roles', () => {
      const replaceSync = spyOn(CSSStyleSheet.prototype, 'replaceSync').and.callThrough();
      service.sync(['brand']);
      service.sync(['brand']);
      service.sync(['brand'], 'container');
      expect(replaceSync).toHaveBeenCalledTimes(1);
    });

    it('updates the same stylesheet in place when the roles change', () => {
      service.sync(['brand']);
      const first = lastSheet();
      service.sync(['brand', 'accent']);
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore + 1);
      expect(lastSheet()).toBe(first);
      expect(selectors(lastSheet())).toEqual(['.snackbar-accent', '.snackbar-brand']);
    });

    it('rewrites the rules when only the tone changes', () => {
      const replaceSync = spyOn(CSSStyleSheet.prototype, 'replaceSync').and.callThrough();
      service.sync(['brand'], 'container');
      service.sync(['brand'], 'solid');
      expect(replaceSync).toHaveBeenCalledTimes(2);
    });

    it('removes the stylesheet when the list becomes empty, and re-adds it later', () => {
      service.sync(['brand']);
      service.sync([]);
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore);
      service.sync(['brand']);
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore + 1);
    });

    it('removes the stylesheet on destroy', () => {
      service.sync(['brand']);
      service.ngOnDestroy();
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore);
    });

    // ── The rules actually style an element, and follow live token changes ──
    it('applies the container pair to an element, and follows live token changes', () => {
      setToken('--mat-sys-brand-container', 'rgb(10, 20, 30)');
      setToken('--mat-sys-on-brand-container', 'rgb(200, 210, 220)');
      service.sync(['brand']);
      const el = probe('brand');

      expect(computed(el, '--mat-snack-bar-container-color')).toBe('rgb(10, 20, 30)');
      expect(computed(el, '--mdc-snackbar-container-color')).toBe('rgb(10, 20, 30)');
      expect(computed(el, '--mat-snack-bar-supporting-text-color')).toBe('rgb(200, 210, 220)');
      expect(computed(el, '--mdc-snackbar-supporting-text-color')).toBe('rgb(200, 210, 220)');
      expect(computed(el, '--mat-snack-bar-button-color')).toBe('rgb(200, 210, 220)');

      // The user edits the role color in the panel: an open snackbar follows.
      setToken('--mat-sys-brand-container', 'rgb(1, 2, 3)');
      expect(computed(el, '--mat-snack-bar-container-color')).toBe('rgb(1, 2, 3)');
    });

    it('applies the solid pair when asked', () => {
      setToken('--mat-sys-brand', 'rgb(11, 22, 33)');
      setToken('--mat-sys-on-brand', 'rgb(240, 241, 242)');
      setToken('--mat-sys-brand-container', 'rgb(99, 99, 99)');
      setToken('--mat-sys-on-brand-container', 'rgb(88, 88, 88)');
      service.sync(['brand'], 'solid');
      const el = probe('brand');

      expect(computed(el, '--mat-snack-bar-container-color')).toBe('rgb(11, 22, 33)');
      expect(computed(el, '--mat-snack-bar-supporting-text-color')).toBe('rgb(240, 241, 242)');
    });

    it('stops styling elements once the role is removed', () => {
      setToken('--mat-sys-brand-container', 'rgb(10, 20, 30)');
      service.sync(['brand']);
      const el = probe('brand');
      expect(computed(el, '--mat-snack-bar-container-color')).toBe('rgb(10, 20, 30)');

      service.sync([]);
      expect(computed(el, '--mat-snack-bar-container-color')).toBe('');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Document without constructable stylesheets: <style> fallback
  // ─────────────────────────────────────────────────────────────
  describe('when the document cannot adopt stylesheets (<style> fallback)', () => {
    let head: HTMLHeadElement;
    let service: SnackbarRoleStylesService;

    const styleEls = () => head.querySelectorAll('style[data-ngmp="snackbar-roles"]');

    beforeEach(() => {
      head = document.createElement('head');
      // No `adoptedStyleSheets`, and a window without CSSStyleSheet.
      const doc = {
        head,
        defaultView: { CSSStyleSheet: undefined },
        createElement: (tag: string) => document.createElement(tag),
      } as unknown as Document;

      TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: doc }] });
      service = TestBed.inject(SnackbarRoleStylesService);
    });

    it('writes one <style> element', () => {
      service.sync(['brand']);
      expect(styleEls().length).toBe(1);
      expect(styleEls().item(0).textContent).toContain('.snackbar-brand');
    });

    it('updates that element in place instead of adding new ones', () => {
      service.sync(['brand']);
      const el = styleEls().item(0);
      service.sync(['brand', 'accent']);
      expect(styleEls().length).toBe(1);
      expect(styleEls().item(0)).toBe(el);
      expect(el.textContent).toContain('.snackbar-accent');
    });

    it('removes the element when the list becomes empty', () => {
      service.sync(['brand']);
      service.sync([]);
      expect(styleEls().length).toBe(0);
    });

    it('removes the element on destroy', () => {
      service.sync(['brand']);
      service.ngOnDestroy();
      expect(styleEls().length).toBe(0);
    });

    it('writes nothing for built-in or unsafe roles', () => {
      service.sync(['success', 'x}</style>']);
      expect(styleEls().length).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // No window (server-side rendering)
  // ─────────────────────────────────────────────────────────────
  describe('without a window (SSR)', () => {
    it('does nothing and does not throw', () => {
      // A detached document has a <head> but a null defaultView.
      const detached = document.implementation.createHTMLDocument();
      TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: detached }] });
      const service = TestBed.inject(SnackbarRoleStylesService);

      expect(() => service.sync(['brand'])).not.toThrow();
      expect(detached.head.querySelector('style')).toBeNull();
      expect(detached.adoptedStyleSheets.length).toBe(0);
      expect(() => service.ngOnDestroy()).not.toThrow();
    });
  });
});