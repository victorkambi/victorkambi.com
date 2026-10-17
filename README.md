# victorkambi.com

Victor Kambi's portfolio, built with Astro and deployed to GitHub Pages.
Work and Lab entries live in Markdown under `src/content/`; Zod schemas in
`src/content.config.ts` validate required fields and image alt text.

## Development

```sh
pnpm install
pnpm dev
```

## Add a work project

1. Add cover art under `src/assets/` and real gallery images alongside it.
2. Add a Markdown file in `src/content/work/`. Copy the frontmatter shape from
   `bomaos-console.md`; use a unique `slug` and `order`.
3. Include all nine case study headings in the required order. Keep unknown
   details as `TODO:` blocks until confirmed. Every gallery image needs a
   descriptive `alt` value and optional caption.
4. `status` must be `shipped`, `concept`, or `in-progress`. Only add verified
   public links.

## Add a Lab item

1. Add a Markdown file in `src/content/lab/` using `focus-ring-study.md` as a
   starting point.
2. Set a unique `slug`, `year`, `summary`, `kind`, and the demo component name.
   Add `source` only when there is a public source URL.
3. Wire the demo in `src/pages/lab/[slug].astro` if it needs a new interaction.

## Deploy

The `Deploy to GitHub Pages` workflow builds and deploys on each push to `main`.
Set **Settings → Pages → Build and deployment** to **GitHub Actions**. Keep the
`CNAME` in the repository root and `public/CNAME` so the domain is preserved in
the deployment artifact. The existing Cloudflare DNS configuration is outside
this repository and is not changed here.

The old `kambiv.github.io` repository contains the immediate redirect page. Do
not switch the custom domain until this site has been deployed and checked at
`victorkambi.com`.

## TODOs requiring Victor's input

- Confirm the primary audience: product-design hiring managers, freelance
  clients, or both.
- Supply licensed self-hosted font files and confirm font families. The current
  fallback stack uses system fonts because no font files were present.
- Replace the abstract SVG placeholder covers with real BomaOS, Jirani, and
  visual-work imagery. Add gallery images with verified alt text and captions.
- BomaOS Console: confirm role/ownership, team size, timeline, problem,
  constraints, research, key decisions, testing method and findings,
  iterations, final UI, architecture, and next steps.
- Jirani Portal: confirm role/ownership, team size, timeline, problem,
  constraints, research, key decisions, testing method and findings,
  iterations, final UI, architecture, and next steps.
- Replace the Visual study seed with a real project and complete the nine case
  study sections.
- Add Jirani's verified Google Play URL. Confirm whether the BomaOS store link
  should be displayed on the About page.
- Provide a current CV to replace `public/cv.pdf`.
- Add the motivation and design notes for the Focus Ring Study.
- Add a short personal detail and confirm public contact details.
- Run the requested mobile Lighthouse and WCAG 2.1 AA contrast review against
  the deployed page; these scores and checks are not asserted by this scaffold.

## Decisions made

- Kept system font stacks until licensed self-hosted font files are provided.
- Used original abstract SVG placeholders, labeled as placeholders, instead of
  implying they are real product screenshots.
- Generated per-page SVG social cards at build time to avoid adding an image
  generation dependency; confirm target platform compatibility before launch.
- Kept Writing route as an unlinked stub and omitted RSS until posts exist.
- Added a small keyboard focus study as the Lab interaction, matching the
  brief's example without inventing product claims.
