# RTNP — How-to Guide (Website)

A static, bilingual (Hindi + English) how-to guide for the **RTNP** mobile app, built for
beta testers. Plain HTML/CSS/JS — no build step, no framework, no runtime dependencies.

## Structure
```
rtnp-website/
├── index.html          # the page (markup only)
├── css/
│   └── styles.css      # all styles (theme-aware: light/dark)
├── js/
│   └── main.js         # progressive enhancements (see below)
├── images/             # 21 real app screenshots (.jpeg)
├── favicon.svg
├── .nojekyll           # tell GitHub Pages to serve files as-is
└── README.md
```

The page works fully **without JavaScript**. `js/main.js` only adds niceties:
- **Theme toggle** — cycles Auto (system) → Light → Dark, remembered in `localStorage`.
- **Scroll-spy** — highlights the current section in the contents list.
- **Back-to-top** button (appears after scrolling).

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
- The **Reports** section is text-only pending a screenshot of *More → Reports → Outstanding Report*.
