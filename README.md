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

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which uploads `site/`
to GitHub Pages. `site/CNAME` keeps the custom domain.
