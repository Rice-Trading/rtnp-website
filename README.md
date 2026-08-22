# RTNP — How-to Guide (Website)

A static, bilingual (Hindi + English) how-to guide for **RTNP**, built for beta testers.
Plain HTML/CSS/JS — no build step, no framework, no runtime dependencies.

It now covers **two products** on one page, chosen with a toggle at the top of the hero:

1. **📱 मोबाइल ऐप · Mobile App** — the Flutter field app (default view).
2. **💻 वेब पोर्टल · Web Portal** — the `rtnp_web` React SPA for office staff.

The chosen view is remembered in `localStorage`, and deep-links work across views: a URL
ending in `#w-ledger` (a web-guide section) auto-switches to the Web Portal view; `#ledger`
stays on the Mobile view.

## Structure
```
rtnp-website/
├── index.html          # both guides (markup only) — #view-mobile and #view-web
├── css/
│   └── styles.css      # all styles (theme-aware: light/dark) incl. .seg toggle + .browser frame
├── js/
│   └── main.js         # progressive enhancements (see below)
├── images/             # 21 real MOBILE app screenshots (.jpeg)
│   └── web/            # 21 real WEB PORTAL screenshots (.jpeg)
├── favicon.svg
├── .nojekyll           # tell GitHub Pages to serve files as-is
└── README.md
```

The page works fully **without JavaScript**: the Mobile view shows by default; the toggle
and view-switching need JS. `js/main.js` adds:
- **Guide switch** — Mobile app ⇄ Web portal, remembered in `localStorage`, hash-aware.
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
- **Mobile** screenshots live in `images/`; **Web portal** screenshots in `images/web/`.
- Web-portal screenshots were captured from the live `rtnp_web` SPA against the local
  backend (headless Chrome), and are shown inside a lightweight browser frame; each is a
  link that opens the full-size image in a new tab.
- Web-guide section ids are prefixed `w-` (e.g. `#w-deals`) so they never clash with the
  mobile sections.
