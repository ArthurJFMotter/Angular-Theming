#!/usr/bin/env node
/**
 * Material token audit.
 *
 * Compiles the library's `setup-theming()` and fails when it sets a Material
 * component token (--mat-* / --mdc-*) that the INSTALLED @angular/material never
 * reads. Such an override silently does nothing (e.g. a renamed token after a
 * Material upgrade), which is how dead FAB / toggle / chip shape tokens went
 * unnoticed. System tokens (--mat-sys-*) are not component tokens and are skipped.
 *
 * It also checks the opposite direction: component tokens the library READS in
 * var(--x) that nothing defines (not set by the library, not read by Material).
 * Such a rule silently falls back, e.g. a `min-height: var(--old-token)` that is
 * simply ignored.
 *
 * Intentional exceptions live in material-token-allowlist.json, each with a reason
 * (older-Material compatibility, variables that are the library's own).
 *
 * Usage (from the repo root, after `npm ci`):
 *   node projects/ng-material-preferences/scripts/audit-material-tokens.mjs
 * Options:
 *   --styles <dir>      folder containing _theming.scss   (default ../src/styles)
 *   --material <dir>    installed @angular/material       (default ./node_modules/@angular/material)
 *   --allowlist <file>  allowlist JSON                    (default next to this script)
 * Exit code: 0 ok, 1 dead tokens found, 2 setup/compile error.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : fallback; };

const stylesDir = resolve(opt('styles', join(here, '../src/styles')));
const materialDir = resolve(opt('material', join(process.cwd(), 'node_modules/@angular/material')));
const allowlistPath = resolve(opt('allowlist', join(here, 'material-token-allowlist.json')));
const die = (msg) => { console.error(`✖ ${msg}`); process.exit(2); };

if (!existsSync(join(materialDir, 'fesm2022'))) die(`No fesm2022 folder in ${materialDir} (is @angular/material installed?)`);
if (!existsSync(join(stylesDir, '_theming.scss'))) die(`No _theming.scss in ${stylesDir}`);

// 1. Every component token the library SETS (declarations only, not var() reads).
let css;
try {
  css = sass.compileString("@use 'theming' as t;\n@include t.setup-theming();", {
    loadPaths: [stylesDir, join(process.cwd(), 'node_modules')],
    logger: sass.Logger.silent,
  }).css;
} catch (e) { die(`Sass compile failed:\n${e.message}`); }

const isComponentToken = (t) => /^--(mat|mdc)-/.test(t) && !t.startsWith('--mat-sys-');
const setTokens = new Set(
  [...css.matchAll(/(?:^|[;{\s])(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]).filter(isComponentToken),
);

// 2. Every token Material actually READS (var(--x ...)) across its component bundles.
const bundles = readdirSync(join(materialDir, 'fesm2022')).filter((f) => f.endsWith('.mjs'));
const readTokens = new Set();
for (const f of bundles) {
  for (const m of readFileSync(join(materialDir, 'fesm2022', f), 'utf8').matchAll(/var\((--[a-z0-9-]+)/g)) readTokens.add(m[1]);
}
const version = JSON.parse(readFileSync(join(materialDir, 'package.json'), 'utf8')).version;

// 3. Allowlist.
const allow = existsSync(allowlistPath) ? JSON.parse(readFileSync(allowlistPath, 'utf8')) : { groups: [] };
const allowed = new Map();   // token -> group name
const replacedBy = new Map(); // legacy token -> modern token it must be paired with
for (const g of allow.groups ?? []) {
  for (const t of g.tokens ?? []) allowed.set(t, g.name);
  for (const [legacy, modern] of Object.entries(g.replacedBy ?? {})) { allowed.set(legacy, g.name); replacedBy.set(legacy, modern); }
}

const dead = [...setTokens].filter((t) => !readTokens.has(t)).sort();

// Tokens the library's own CSS reads: they must be defined by the library or live in Material.
const ourReads = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]).filter(isComponentToken));
const undefinedReads = [...ourReads].filter((t) => !setTokens.has(t) && !readTokens.has(t) && !allowed.has(t)).sort();
const unexplained = dead.filter((t) => !allowed.has(t));
const explained = dead.filter((t) => allowed.has(t));
const stale = [...allowed.keys()].filter((t) => !setTokens.has(t)).sort();

const byGroup = {};
for (const t of explained) byGroup[allowed.get(t)] = (byGroup[allowed.get(t)] ?? 0) + 1;
console.log(`Material ${version} · ${setTokens.size} component tokens set by setup-theming()`);
console.log(`  ✔ ${setTokens.size - dead.length} read by Material`);
if (explained.length) console.log(`  ○ ${explained.length} allowlisted (${Object.entries(byGroup).map(([k, v]) => `${k}: ${v}`).join(', ')})`);
if (stale.length) console.log(`  ! ${stale.length} stale allowlist entries (no longer set by the library; remove them):\n${stale.map((t) => `      ${t}`).join('\n')}`);

// A legacy name is only acceptable next to its modern counterpart (set by the library AND read by Material).
const orphaned = [...replacedBy].filter(([legacy, modern]) => setTokens.has(legacy) && !(setTokens.has(modern) && readTokens.has(modern)));
if (orphaned.length) {
  console.log(`  ✖ ${orphaned.length} legacy token(s) set WITHOUT a live modern counterpart (works only on the older Material):\n${orphaned.map(([l, m]) => `      ${l}  → also needs ${m}`).join('\n')}`);
}

if (undefinedReads.length) {
  console.log(`  ✖ ${undefinedReads.length} token(s) READ by the library's CSS that nothing defines (the rule falls back silently):\n${undefinedReads.map((t) => `      ${t}`).join('\n')}`);
}

if (unexplained.length || orphaned.length || undefinedReads.length) process.exitCode = 1;
if (unexplained.length) {
  console.log(`  ✖ ${unexplained.length} set by the library but read by NO Material component:\n${unexplained.map((t) => `      ${t}`).join('\n')}`);
  console.log('\nThese overrides do nothing on this Material version. Rename them to the current token,\nor, if they are intentional (older Material / the library\'s own variables), add them to the allowlist with a reason.');
}
if (!process.exitCode) console.log('  → no dead tokens');
