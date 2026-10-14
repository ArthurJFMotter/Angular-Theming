import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { SnackbarRoleTone, buildSnackbarRoleCss } from '../utils/snackbar-role-css';

/**
 * Keeps ONE managed stylesheet with a `.snackbar-<role>` rule for every custom
 * (extended) color role, so consumers can open a snackbar with
 * `panelClass: 'snackbar-<role>'` and nothing else.
 *
 * Call `sync()` with the full list of role slugs (the same slug that ends up in
 * `--mat-sys-<slug>`) whenever that list changes. Unchanged input is a no-op.
 *
 * Uses a constructable stylesheet (`adoptedStyleSheets`) when available, which
 * works under a strict CSP `style-src`; otherwise falls back to one <style>.
 */
@Injectable({ providedIn: 'root' })
export class SnackbarRoleStylesService implements OnDestroy {
  private readonly doc = inject(DOCUMENT);

  private sheet: CSSStyleSheet | null = null;
  private styleEl: HTMLStyleElement | null = null;
  private lastCss: string | null = null;

  sync(roles: readonly string[], tone: SnackbarRoleTone = 'container'): void {
    const css = buildSnackbarRoleCss(roles, tone);
    if (css === this.lastCss) return;
    this.lastCss = css;
    this.write(css);
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private write(css: string): void {
    const win = this.doc.defaultView;
    if (!win || !this.doc.head) return; // no DOM (SSR)

    if (!css) {
      this.dispose();
      return;
    }

    const canAdopt =
      'adoptedStyleSheets' in this.doc &&
      typeof win.CSSStyleSheet === 'function' &&
      'replaceSync' in win.CSSStyleSheet.prototype;

    if (canAdopt) {
      if (!this.sheet) {
        this.sheet = new win.CSSStyleSheet();
        this.doc.adoptedStyleSheets = [...this.doc.adoptedStyleSheets, this.sheet];
      }
      this.sheet.replaceSync(css);
      return;
    }

    if (!this.styleEl) {
      this.styleEl = this.doc.createElement('style');
      this.styleEl.setAttribute('data-ngmp', 'snackbar-roles');
      this.doc.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = css;
  }

  private dispose(): void {
    if (this.sheet) {
      const sheet = this.sheet;
      this.doc.adoptedStyleSheets = this.doc.adoptedStyleSheets.filter((s) => s !== sheet);
      this.sheet = null;
    }
    this.styleEl?.remove();
    this.styleEl = null;
    this.lastCss = null;
  }
}