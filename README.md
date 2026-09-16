# RTNP — Documentation Website

The **RTNP web-portal documentation**, served at `docs.staging.rtnp.in`.
Plain HTML/CSS/JS — no build step, no framework, no runtime dependencies.

The landing page (`index.html`) is a **multi-product, multilingual documentation shell**:
the reader picks a **product** (💻 Web Portal / 📱 Mobile App) and a **language**, then reads
that guide. The look & feel is ported from the `rtnp_web` SPA (teal + cream + DM Sans).
**Screenshots are shared across languages** — only the text changes per language, so adding a
language is a text-only job.

Currently shipped:
- **Web Portal** — हिन्दी (Hindi), తెలుగు (Telugu).
- **Mobile App** — हिन्दी (Hindi). *(ported from the old guide; pending review)*

Other languages appear as "soon" in the picker until their content file exists.
➡️ To add a language or a product, see **`docs/HOW-TO-ADD-A-LANGUAGE.md`** (≈2 file touches).

## Structure
```
rtnp-website/
├── index.html                    # docs SHELL (product switcher + language picker + sidebar + loader)
├── docs/
│   ├── products.js               # product registry (web/mobile) + each product's languages
│   ├── languages.js              # language display names (endonyms)
│   ├── shell.css                 # web-portal look (teal/cream/DM Sans) + per-language font stacks
│   ├── app.js                    # loads <product>/<lang>, builds the sidebar index, scroll-spy
│   ├── content/
│   │   ├── web/                  # Web Portal guide
│   │   │   ├── hi.html           #   Hindi (reference version, hero + 16 sections)
│   │   │   ├── te.html           #   Telugu
│   │   │   └── _template.html    #   copy-me skeleton for a new language
│   │   └── mobile/               # Mobile App guide
│   │       └── hi.html           #   Hindi (ported from the old guide — pending review)
│   ├── img/                      # shared WEB screenshots (26)
│   └── HOW-TO-ADD-A-LANGUAGE.md  # step-by-step
├── images/                       # shared MOBILE screenshots (21) — used by mobile/*.html
├── legacy-guide.html             # the OLD single-page mobile+web bilingual guide (kept for reference)
├── css/ · js/                    # assets used only by legacy-guide.html
├── favicon.svg
├── .nojekyll                     # GitHub Pages: serve files as-is
└── README.md
```

### How it works
- `docs/products.js` lists products (`code`, `icon`, `name` per language, `langs`);
  `docs/languages.js` lists language display names. A language is available for a product
  iff it's in that product's `langs`.
- On load, `docs/app.js` resolves product + language (`?product=&lang=` → `localStorage` →
  first-visit picker / default product), fetches `docs/content/<product>/<lang>.html`, injects
  it, and **builds the sidebar index from the `<section>` tags** it finds (`data-nav` /
  `data-group`). So the index is always in the reader's language with zero duplication.
- Choice is remembered in `localStorage`; `?product=web&lang=hi#section` gives shareable deep-links.
- `document.documentElement.lang` is set to the language code, and `shell.css` has `:lang(...)`
  font stacks so each script renders with appropriate fonts.

> **Note:** because the shell `fetch()`es the content file, the site must be **served over
> HTTP** (not opened as `file://`). Any static host works — see *Run locally* below.

The older combined mobile+web guide is preserved verbatim as **`legacy-guide.html`** and still
works standalone (`js/main.js`, `css/styles.css`, `images/`).

## Run locally
It's static, so just open `index.html` — or serve the folder:
```bash
cd rtnp-website
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy free on GitHub Pages
1. Create a repo (e.g. **rtnp-website**) and push this folder's contents to the root.
2. **Settings → Pages** → Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.
3. Live at `https://<your-username>.github.io/rtnp-website/` in ~1 minute.

```bash
cd rtnp-website
git init && git add -A && git commit -m "RTNP how-to website"
git branch -M main
git remote add origin https://github.com/<your-username>/rtnp-website.git
git push -u origin main
```

## Editing
- **Text/steps:** edit `index.html`.
- **Look & feel / colors:** edit the CSS variables at the top of `css/styles.css`
  (`--paper`, `--maroon`, `--gold`, …); dark-mode values are in the same block.
- **Screenshots:** replace files in `images/` (keep the same filename), or add a new
  `<img>` in `index.html` pointing at `images/your-file.jpeg`.

## Notes
- All screenshots are real app screens (current teal/cream UI).
- **Mobile** screenshots live in `images/`; **Web portal** screenshots in `images/web/`.
- Web-portal screenshots were captured from the live `rtnp_web` SPA against the local
  backend (headless Chrome), and are shown inside a lightweight browser frame; each is a
  link that opens the full-size image in a new tab.
- Web-guide section ids are prefixed `w-` (e.g. `#w-deals`) so they never clash with the
  mobile sections.
