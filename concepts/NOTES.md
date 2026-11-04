# Concept notes

What the two reference sites do, measured page by page, and what each
concept takes from them.

## rsms.me → Raster

Pages visited: Home, About, Projects, Work, Photography, an article
(`/wasm-intro`).

**Grid (raster.css)**
- An 8px unit, with a 24px line height that doubles as the baseline.
- Six 128px columns with 64px gutters, so the content is 1088px wide, plus 64px of body padding.
- Columns drop to 4 at ≤1024px and to 1–2 at ≤640px.
- Thin vertical rules frame the page.

**Every page uses the same header:** a title spanning 4 columns, then the menu
spanning 2 (● About Projects Work Photography Shop).

**Each page is a room with its own palette:**

| Page | Background | Menu | Body |
|---|---|---|---|
| Home | white | hot-orange | 2+2+2 lists (Projects, Thoughts, Intro) |
| About | pear green | white, active black | bio in a 3-column span, portrait in columns 5–6, then a socials list |
| Projects | light pink | sunset pink, active black | a 3-up grid of 2-column cells, each a bold title plus a line |
| Work | brown | 50% black, active white | career story in 3 text columns, then "Notable work and contributions" in two 512px columns |
| Photography | white | grey | essay in 3 columns, then a photo grid of 2-column cells |

Articles put a small "rsms" link in column 1, the date across columns 2–6, and
the body text in columns 2–5 (`span="2+4"`), with illustrations floating into
column 6.

**Philosophy**
- Typography is the interface, and lists are the content.
- Hierarchy comes from weight and dimmed text, not more sizes.
- Colour marks where you are.
- Nothing decorates. The colophon ("This website…") is part of the craft.

## tracyqjx.com → Playground

Pages visited: Home (after the intro), About, the Amazon Music case study, the
Nike case study.

**Frame**
- 30px margins.
- The masthead splits at 50%: wordmark and a clock in the *visitor's own* city on the left, statement on the right.
- Mono nav and a light/dark toggle.
- A skippable intro that draws the type.

**Home**
- Featured projects sit in a horizontal snapping track of ~451px cards. Each card has a category chip, **Details +** and **Full Case Study →**.
- A Playground of numbered, hands-on experiments.
- A three-column footer with a "glyph of the day" toy.

**Case study**
- A sticky left index with scrollspy (Overview, Challenge, Problem, Insight, Model, System, Principles, Validation, Working with AI, Outcome, Reflection). The active item shows as a serif italic "— Overview".
- Each section is a row with a mono label in the gutter ("THE CHALLENGE") beside a heading and body text.
- Figma-style *selection boxes* with corner handles, tagged like files (`COLD_START.TXT`, `BRIEF.TXT`).
- A meta grid: Role / Team / Recognition / Timeline.
- A hero of staggered floating screens, numbered annotations ("01/"), and quotes with avatars.

**About**
- Split 50/50. The left side has mono gutter labels (WHOAMI?, EXPERIENCE, EDUCATION) and a coursework ticker.
- The right side has an italic serif "Beyond design" label beside a sticky interactive: a time-of-day slider that changes the sunlight in a photo.

**Philosophy**
- Show, don't tell. The tools of the trade (selection boxes, file names, sliders) become the visual language.
- Personality lives in small toys; the frame stays quiet.

## v2 directions

**Raster v2, "rooms":**
- Home, Work, Systems and About are hash-routed rooms on one page. Each has its own palette, blended with registered custom properties as on the live site.
- Every room shares the same 4+2 header.
- Work follows rsms's Work page: the story in 3 text columns, then notable work in two 3-column spans.
- Systems puts each product in a 2+2+2 or 2+4 row: notes, numbered annotations and a live device.
- About opens with "Habari" (as rsms's "Hej"), then the bio, socials, experience and a colophon.

**Playground v2, "case study":**
- Home keeps the track, now with Case study → links. The clock shows both your time and Nairobi's.
- Adds a light/dark toggle.
- Adds a BomaOS case study with a sticky scrollspy index, mono gutter labels, selection-box callouts named after real artefacts, a meta grid, and staggered live screens with annotations.
- About is a 50/50 split with an "Equator day" slider: Nairobi's daylight barely changes length across the year.
- The footer has a Swahili word of the day tied to the product names: boma means homestead, jirani means neighbour.
