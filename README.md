# MAISON D'OR — Perfumery Tycoon

A React + TypeScript + Vite luxury perfume-house tycoon game.

## Project layout

- `App.tsx` — game UI, economy and progression logic
- `main.tsx` — React entry and production service-worker registration
- `index.html` — app shell
- `public/manifest.webmanifest` — install metadata
- `public/icon.svg` — scalable app icon
- `public/sw.js` — offline caching and update handling
- `test_economy.py` — offline smoke tests and economic formula checks
- `ECONOMY_TEST_PLAN.md` — playtesting checklist

## Local development

1. Install Node.js (current LTS recommended).
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open the Vite URL and test the game.

Production checks:

- `npm run build` — production build
- `npm run test:economy` — offline economy/source smoke checks (Python 3)

## Android/PWA testing

1. Build and deploy the production app over HTTPS.
2. Open it in Chrome on Android and load the game while online.
3. Use Chrome's menu → **Install app** or **Add to Home screen** (menu wording depends on Chrome version).
4. Launch from the home-screen icon.
5. Visit all four game tabs while online, then enable airplane mode and reload/continue to verify cached offline play.
6. Test **Backup** and **Restore** in the footer. Keep a backup outside the browser/device.

## Verification status (fixed 2026-11-18)

- Fixed for GitHub Pages: Vite `base` set to `/maison-d-or/`, manifest/icon/service-worker paths made scope-relative, and the service worker is network-first for the page document (updates appear on the next launch).
- `npm ci` and `npm run build` succeed; the production output is a single self-contained `dist/index.html` (~343 KB) plus `manifest.webmanifest`, `icon.svg` and `sw.js`.
- All 8 Python economy smoke tests pass, and the built game was render- and play-tested (loads, renders all four tabs, Advance Week advances to Week 2 and writes a save).
- Do NOT upload the raw source files to GitHub Pages — Pages cannot compile TypeScript. Upload the contents of `dist/` instead.
- Note: this React version uses save key `maison-dor.atelier.v1`; saves from the previous single-file version do not carry over.
