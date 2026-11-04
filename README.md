# victorkambi.com

Victor Kambi's portfolio: one page with Work and About tabs, plus a 404 page.
It's plain HTML, CSS and JS with no build step, deployed to GitHub Pages.

```
site/
  index.html   Work list + About panel
  404.html     served by GitHub Pages for any unknown path
  styles.css   all styles (palettes, layout, components)
  script.js    tab switching (#work / #about), hover highlight, clock
```

## Preview

```sh
python3 -m http.server 8000 -d site
```

Then open http://localhost:8000. Use root-relative paths (`/styles.css`) in
`404.html`, because GitHub Pages serves it at whatever URL was requested.

## Edit

- **Work item:** copy an `<a class="row">` in `#work` in `index.html`. Use a
  `<div class="row">` for an item without a public link yet.
- **CV:** replace `site/Victor_Kambi_2026_CV.pdf` (if you rename it, update the
  link in the About panel).
- **Colours:** the two palettes are `html[data-experience='work'|'about']` at
  the top of `styles.css`, with display-p3 versions below.

The 404 page pulls the Work list from `index.html` at runtime
(`<div data-include="#work">`), so there's only one copy to edit.

## Concepts

`concepts/` holds two design explorations that are **not deployed**:
`raster/` (after rsms.me) and `playground/` (after tracyqjx.com). Both share
`concepts/shared/` for the Tajji brand palette, the device frames and the
rebuilt product screens. Those screens are illustrative HTML, not captures
of the real apps. Preview everything from the repo root:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/concepts/.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which uploads `site/`
to GitHub Pages. `site/CNAME` keeps the custom domain.
