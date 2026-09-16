# Adding a language (or a product)

The docs site is **content-driven**. The shell (`index.html` + `docs/app.js` + `docs/shell.css`)
is product- and language-agnostic. There are two dimensions:

- **Product** — `web` (Web Portal guide) and `mobile` (Mobile App guide). Declared in `docs/products.js`.
- **Language** — each product declares which languages it ships (`langs`). Display names live in `docs/languages.js`.

Content lives at **`docs/content/<product>/<lang>.html`**. Screenshots are shared per product:
web uses `docs/img/…`, mobile uses `images/…` (repo root).

## Add a language to a product (about 2 file touches)

Example — add **Tamil** to the **web** guide:

1. **Create the content file**:
   ```bash
   cp docs/content/web/_template.html docs/content/web/ta.html
   ```
   Translate `docs/content/web/hi.html` (the reference version) into it. Rules:
   - Keep every `<section id="…">` **id unchanged** (anchors / deep-links depend on it).
   - Keep every `<img src="…">` **unchanged** (screenshots are shared).
   - Translate the visible text, `data-nav` / `data-group` (sidebar labels & groups),
     and the `data-ui-*` values in `#doc-meta`.
   - **Style rule (house style):** everyday spoken words; do NOT translate commonly-used
     English words — keep UI labels + trade terms in English inline (Deals, Dispatch,
     Settlement, Ledger, Payment, Sign In, roles, freight, quintal, bank, screen, data…).
     Translate only the connecting prose. (Hindi and Telugu both follow this.)

2. **Turn it on** in `docs/products.js` — add the code to that product's `langs`:
   ```js
   { code: 'web', …, langs: ['hi', 'te', 'ta'] },   // added 'ta'
   ```
   If the language isn't in `docs/languages.js` yet, add one row there (for its endonym).

3. **(New script only)** add its web font in `index.html`'s Google-Fonts `<link>`
   (e.g. `Noto Sans Tamil`). The `:lang()` font stacks in `docs/shell.css` already cover it
   with system fonts, so it renders even before you add the webfont.

That's it — the picker, sidebar index, product switcher, deep-links and fonts pick it up
automatically. No change to `app.js` or the shell.

## Add a whole new product

1. Add an entry to `docs/products.js` (`code`, `icon`, `name` per language, `langs`).
2. Create `docs/content/<code>/<lang>.html` for each language (same section contract).
3. Add that product's screenshots (its content just references whatever paths you use).

## Notes
- **Serve over HTTP** — the shell `fetch()`es content files, so `file://` won't work.
  Locally: `python3 -m http.server` in the repo root, then open it.
- State is remembered in `localStorage` (`rtnp-docs-product`, `rtnp-docs-lang`);
  `?product=web&lang=hi#section` gives shareable deep-links.
- Files starting with `_` (e.g. `web/_template.html`) are skeletons; the shell never loads them.
- **Mobile guide status:** `docs/content/mobile/hi.html` currently reuses the *old* mobile
  guide content (ported verbatim). Review/update it before relying on it as current.
