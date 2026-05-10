# ccs

`ccs` - short for **Common Components** — shared browser modules, and more.

Small, framework-free, jsDelivr-friendly browser modules (button state
machines, modals, drawers, popovers, toasts, i18n, theming) plus a
handful of server-side helpers for Cloudflare Workers. Each browser
module is one self-contained IIFE / CSS file. No bundler, no module
loader; just `<script>` / `<link>` tags.

[`onegbnet/ccs`](https://github.com/onegbnet/ccs) is the durable
jsDelivr source. History is append-only — any historical commit's SHA
stays resolvable on jsDelivr forever.

## Install

Reference each module via jsDelivr (`gh/onegbnet/ccs/<mod>/<file>` —
defaults to `main` HEAD, ~12h CDN cache):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/onegbnet/ccs/overlay/style.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/onegbnet/ccs/toast/style.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/onegbnet/ccs/spinner/style.min.css">

<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/i18n-engine/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/action/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/field/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/overlay/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/popover/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/toast/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/footer-brand/client.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/onegbnet/ccs/theme/client.min.js"></script>
```

`<script>` tags are parser-blocking and run in document order — load
`i18n-engine` and `action` *before* `overlay` (overlay reads
`window.tr` and `window.Action`).

**For production**: pin to a specific commit SHA from the
[`onegbnet/ccs` history](https://github.com/onegbnet/ccs/commits/main) —
`gh/onegbnet/ccs@<commit-SHA>/<mod>/<file>` gets a 1-year jsDelivr
cache (vs ~12h on the default URL) and stays immutable forever (history
is append-only / force-push forbidden).

## Modules

### action — async-button state machine

Wraps a `<button>` into `idle → (validate) → pending → success / error → idle`
states. Use it for any button that triggers async work (form submit,
fetch, multi-step flow).

```js
const btn = Action.create({
  text: 'Save',
  pendingText: 'Saving…',
  successText: 'Saved',
  retryText: 'Retry',
  validate: () => emailIsValid() || 'Email looks wrong',
  asyncFn:  async () => { await fetch('/api/save', { method: 'POST' }); },
  onSuccess: () => location.reload(),
});
container.appendChild(btn);

// Or wrap an existing button:
Action.wrap(document.querySelector('#submit'), {
  asyncFn: async () => { /* ... */ },
});
```

`window.Action.create(opts)` returns the button element (controller on
`btn._ctl`); `Action.wrap(btn, opts)` returns the controller directly.
The controller exposes `getState()`, `setEnabled()`, `setText()`,
`reset()`, `trigger()`, `detach()`.

### field — typing-time input validation

Wraps an `<input>` / `<textarea>` for char-level filtering + format
validation + submit gating. Composes with `action` (button submit-time
validate) and `overlay` (modal containers) — each manages a different
event domain.

```js
const ctl = Field.wrap(emailInput, {
  validate: (v) => /^[^@]+@[^@]+$/.test(v) || 'Invalid email',
  errorEl:  document.querySelector('#email-error'),
  onValidityChange: (valid, value, ctl) => submitBtn.disabled = !valid,
});
// ctl.isValid(), ctl.value, ctl.showError(), ctl.detach(), ...
```

### overlay — Modal, Drawer, inline overlay

A unified covering-layer primitive. Three variants cover the common cases:

- `box` — page-fixed centered box (Modal-style)
- `edge-right` — page-fixed slide-in panel (Drawer-style)
- `flat` — container-absolute overlay (in-section loading / busy state)

Two scopes: `'page'` (full-screen, with focus-return / scroll lock /
Esc / click-outside) or any `HTMLElement` (scoped, no page-level side
effects).

```js
// Sugar wrappers on window.Overlay (Modal-style box variants):
Overlay.confirm('Delete this item?', { onOk: () => doDelete() });
Overlay.alert('Saved successfully.');
Overlay.input('Project name?', { onOk: (val) => createProject(val) });

// Drawer (slide from right):
const drawer = Overlay.show({
  variant: 'edge-right',
  title: 'Settings',
  body: settingsPanelEl,
});
// later: drawer.close()

// Loading overlay scoped to a section:
await Overlay.run({
  variant: 'flat',
  scope: tableContainerEl,
  asyncFn: async () => { await reloadTable(); },
});
```

Requires `window.tr` (a `(key) => string` lookup, caller-provided)
and `window.Action` (load `action/client.min.js` first). If `tr`
isn't set, falls back to English defaults for built-in labels.

### popover — non-modal click-outside lifecycle

For caller-built popups (context menus, dropdowns) where you want
click-outside / Esc to close, but don't want the modal-style focus
trap or scroll lock.

```js
triggerBtn.addEventListener('click', (e) => {
  e.stopPropagation();   // prevent the click-outside detector from firing immediately
  myDropdownEl.style.display = 'block';
  Popover.show({
    el: myDropdownEl,
    closable: { escape: true, clickOutside: true },
    onClose: () => { myDropdownEl.style.display = 'none'; },
  });
});
```

You manage markup, positioning, and show/hide; `Popover` only manages
*when to close*.

### toast — bottom-right notifications

Top-down stacked, auto-dismissed.

```js
Toast.ok('Saved');                        // green, ~2s
Toast.err('Failed: ' + err.message);      // red, ~4.5s
Toast.show('Hello', 'ok');                // explicit kind
```

Container `<div id="toasts"></div>` is auto-created if missing. Drop
`<div id="toasts"></div>` in your markup if you want to control its
position. RTL pages get bottom-left placement automatically.

### spinner — CSS-only loading circle

```html
<div class="spinner"></div>
```

20×20 px ring, `@keyframes spin` rotation, no JS. Good as a button label,
inline-with-text indicator, or inside other components.

### footer-brand — branded `<footer>` IIFE

Drops a small, lang-aware footer at the bottom of the page. After your
i18n setup runs, call:

```js
FooterBrand.applyLang(currentLang);
```

Override `--footer-color` / `--footer-border` CSS vars if you want it
tinted differently.

### i18n-engine — language detection + DOM translation + LangSelect

20-language detection (including RTL: `ar`, `he`) with sensible Chinese
fallback (`zh-{hant,tw,hk,mo}` → `zh-tw`, other `zh*` → `zh-cn`).

```js
const SUPPORTED = ['en','fr','de','zh-cn','zh-tw','ja','ar', /* ... */];
const lang = detectLang(SUPPORTED);     // walks navigator.languages
applyLocaleAttrs(lang);                  // sets <html lang> + <html dir>

const TRANSLATIONS = {
  en: { hello: 'Hello', save: 'Save' },
  fr: { hello: 'Bonjour', save: 'Sauvegarder' },
  // ...
};
applyI18nAttrs(TRANSLATIONS[lang]);      // walks [data-i18n] / [data-i18n-ph] / [data-i18n-title]

// Optional <select> for switching. Persist server-mediated to keep
// behavior consistent across all browsers (storage-free):
//   <select id="lang-select">...</select>
LangSelect.init(lang, (newLang) => {
  fetch('/api/prefs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lang: newLang }),
  }).then(() => location.reload());
});
```

The engine functions (`detectLang`, `isRTL`, `applyLocaleAttrs`,
`applyI18nAttrs`) plus constants (`SUPPORTED_LANGS`, `RTL_LANGS`) are
exposed at script global scope. `LangSelect` is on `window.LangSelect`.

For server-side rendering of the initial language (e.g. setting
`<html lang>` from `Accept-Language` header before the IIFE runs), the
engine's `build.mjs` exports `detectLangFromAcceptLanguage(headerString,
supported)` — a worker-side mirror of the client-side `detectLang`.

### theme — dark/light toggle button (storage-free)

Drop in a button + load the IIFE. The IIFE reads `<html data-theme>`,
applies it on click, and POSTs `/api/prefs { theme }` so your server
persists the preference via `Set-Cookie`.

```html
<html data-theme="light">  <!-- server-renders this from `theme` cookie -->
  ...
  <button id="themeToggle">🌓</button>
  <script src=".../theme/client.min.js"></script>
```

Your worker must:

1. Parse the `theme` cookie at request time and substitute the
   `<html data-theme="...">` attribute when serving the page —
   first paint is correct theme, no FOUC.
2. Implement `POST /api/prefs` accepting `{ theme: 'light' | 'dark' }`
   and emit `Set-Cookie: theme=...; Path=/; Max-Age=31536000; SameSite=Lax`.

Define `--surface` / `--text` / etc. with two values gated on
`html[data-theme="dark"]` in your CSS.

This is **storage-free** — no `localStorage` / `sessionStorage` /
`document.cookie` access on the client side, so it works in 100% of
browsers including Strict Tracking Prevention modes (Edge Strict, Brave
Aggressive, Firefox Strict). Server-mediated cookie writes are accepted
in all modes.

## Required CSS variables

Modules read CSS custom properties on `:root`. Provide:

- All modules: `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--err`
- `toast`: also `--ok`
- `spinner`: uses `--border` and `--accent`
- `footer-brand`: optionally `--footer-color`, `--footer-border`

## License

MIT — see [LICENSE](LICENSE).
