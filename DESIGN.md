# artmaslov.com — Design Spec

Portfolio of Artem Maslov, AI Art Director & Creative Technologist (Edmonton, AB).
Target culture: Google Creative Lab, labs.google, oxman.com, GitHub.
Hosting: static site on GitHub Pages, custom domain artmaslov.com.

## 1. Concept: two selves

The site holds two versions of one person:

- **A — the hand (2016–2023):** concept art, 3D, AR/VR, art direction. Craft, eye, taste.
- **B — hand + machine (2024→):** code, math, generative pipelines, a lab-like method (question → test → measure).

Tagline: **"Trained by hand. Extended by machine."**

Visual language = a lab notebook: white ground, 1px hairlines, monospace labels like specimen tags (`01 / WORK`, `EXP-001`, `Fig. 1`), measurement grids, a single blue accent. Rounded cards, centered. No gradients, no emoji, no drop-shadow-heavy UI.

## 2. Sitemap

| Route | Page | Reference file |
|---|---|---|
| `/` | Home (pick A or B, see §5) | `reference/Main.dc.html` (A), `reference/HomeB.dc.html` (B) |
| `/work/` | Commercial work grid | `reference/Work.dc.html` |
| `/work/<slug>/` | Project page (case study or note) | `reference/Case.dc.html` |
| `/lab/` | Lab notebook + Playground section (`#playground`) | `reference/Lab.dc.html` |
| `/resources/` | Files, tutorials, tips, articles | `reference/Resources.dc.html` |
| `/about/` | About, classic view | `reference/About.dc.html` |
| `/about/nodes/` | About, node view | `reference/AboutNodes.dc.html` |

Home has 5 cards: Work, Lab, Playground (→ `/lab/#playground`), Resources, About.

## 3. Tokens

All in `tokens.css`. Key rules:
- Fonts: **Mona Sans** (UI/display) + **JetBrains Mono** (labels, metadata, buttons in pill groups).
- Mono labels: 12px, uppercase, letter-spacing .06–.08em, color `--muted`.
- One accent `--accent` (#1967D2). Used for arrows, active dots, CTAs, section numbers.
- Cards: white, 1px `--line` border, radius 20px, padding 20–24px.
- Big section heads sit on a 1px `--ink` top rule; rows below use `--line-soft`.

## 4. Shared components

**Header** — left: logo mark (28px circle with crosshair + filled center dot, inline SVG) + "Artem Maslov" 17px/600; breadcrumb in mono (`/ work / lexus`). Right: nav WORK · LAB · RESOURCES · ABOUT | LINKEDIN ↗ · GITHUB ↗ (mono 12px). Current page underlined (`aria-current="page"`). Wraps on mobile.

**Home card** — 340px tall (A) / 220px (B), flex column space-between: mono index row (`01 / WORK` + accent `→`), line illustration (inline SVG, 1px stroke, accent details), title 26px/600 + mono caption. Hover: translateY(-4px) + soft shadow.

**About card (special)** — NOT a link. On hover or `:focus-within`, illustration fades to 10% and two stacked pill links appear: `CLASSIC VIEW` (filled ink) and `NODE VIEW` (outlined, with a tiny two-node icon). On `(hover: none)` devices both buttons are always visible.

**Pill toggle** — rounded container with 4px padding; options are pills, the active one filled `--ink` with white text. Used for: Hand / Hand + Machine (Home B), CLASSIC / NODES (About), NOTEBOOK / PLAYGROUND (Lab).

**Filter chips** — 44px pills, mono 12px; active = filled ink. Real `<button aria-pressed>`.

**Media placeholder** — `--reel` background with a 24–48px faint grid; replace with real video/images. Captions as `Fig. N — …` in mono.

**Clients strip** — "WORKED WITH" mono label + client names inline, wrapping, centered. Lives on Home under the cards (light text on the reel in A; between hairlines in B).

## 5. Pages

### Home — two directions (choose one)
- **A · Lab Bench:** showreel full-bleed (muted, autoplay, loop, `playsinline`), dark. Header in white. One line intro ("Art director trained by hand. Technologist extended by machine."), 5 white cards centered (max-width 1320, `repeat(auto-fit, minmax(200px,1fr))`), clients strip, bottom instrument bar: role · coordinates `53.5461° N, 113.4938° W` · `● REEL 2026 · LOOP` + **SOUND OFF/ON** button.
- **B · Two Selves:** light page; reel inside a 28px-radius frame split by a vertical hairline. Left label `A · 2016 → 2023 / Hand. Eye. Taste.`; right `B · 2024 → ∞ / + Code. Math. Systems.` with a blue measurement grid overlay on the right half only. Toggle in header switches the overlay off/on. Pill at seam: `output = taste × compute`. Cards overlap the frame bottom by −120px.

### Work
Title "Selected client work", intro sentence listing clients, discipline chips (ALL, AI VIDEO, 3D, AR / VR, CONCEPT). Grid `auto-fill minmax(340px,1fr)`: 16:10 thumb (hover-play clip) with `W-001 · CASE STUDY|NOTE`, then title, client line, `role · year`. Data: `content/projects.json`. CTA box: "Need work for a specific brief?" → email.

### Project page (data-driven, one template)
Two layouts from `projects.json` → `layout`:
- **case-study:** hero (code `W-003 / 007 · CASE STUDY`, 72px title, tagline 24px, meta row CLIENT/AGENCY/ROLE/YEAR) → 16:9 hero media → **Overview** panel (grey `--ground-2`, MADE / NEED / VALUE rows) → `01 Problem` → `02 Solution` → `03 Contribution` → `04 Tools` (chips) → Credits grid → 2 stills (4:5) → Prev/Next cards.
- **project-note:** same hero/media, then `01 Overview`, `02 Role`, `03 Tools`, Credits, stills, Prev/Next. No Made/Need/Value.
Section row = number + heading left (flex 1), body right (flex 3), separated by 1px ink rules.

### Lab
Title "Hypothesis → build → measure". Featured experiment (figure + Question / Method / Result), then a GitHub-like list: `EXP-00N · title · description · status` (● SHIPPED, ◐ DEMO, ★ WINNER, ○ IN PROGRESS). Then **#playground**: currently an empty dashed box "The first toys are still on the bench." Planned first toy: Face Pong (paddles are photos of Artem's face that change expression on each hit).

### Resources
Title "Take what's useful". Filter chips ALL/FILES/TUTORIALS/TIPS/ARTICLES (working filter). Cards: grid-paper thumb with type tag + glyph, title, one-liner, mono `format · size` + action (DOWNLOAD ↓ / WATCH ↗ / READ →). Footer CTA: follow on GitHub.

### About — classic
Top bar: label + CLASSIC/NODES toggle + **Download CV (PDF) ↓** (Google Drive link). Two columns: H1 "Trained by hand. Extended by machine." + 2 bio paragraphs | portrait (caption "SPECIMEN: A. MASLOV · EDMONTON, AB") + spec list (Role, Practice, Previously, Teaching, Education).
Then **Fun facts** (`content/facts.json`): cards with a like button (heart + count); F-04 is wide with a 5-row country → lesson table. Then **Skill map** (`content/skills.json`): dumbbell chart, one row per skill, hollow grey dot = before, filled accent dot = after, accent line between, `a → b` at right, axis 0 NONE · 5 WORKING · 10 EXPERT. Then **Awards & wins** table.

### About — nodes
ComfyUI-style graph on a dotted canvas. Nodes (white, 12px radius, mono type label colored by kind):
`LOAD · ORIGIN` (Odesa, BFA) → `SAMPLER · CAREER` (Snap, ARNI, Tactical, clients)
`LOAD · CRAFT` → CAREER
`LOAD MODEL · AI · 2024` (blue border, blue wire) → `MERGE · A + B` ("Hand + Machine", weights taste/craft/compute 1.00, curiosity ∞)
CAREER → MERGE → `OUTPUT · 2026` (dark node: name, role, email, CV link) → `PREVIEW · AWARDS`
CAREER → `SAVE · TEACHING` (NAIT).
Build: absolutely positioned nodes + SVG wires; nodes draggable (pointer events, wires follow). On mobile, fall back to a vertical stack with wires drawn downward, or link to classic view.

## 6. Behaviour & tech notes
- Static site; keep it framework-light (Astro or plain HTML + small JS are both fine). Project pages generated from `content/projects.json`.
- **Likes:** GitHub Pages has no backend. Use a tiny service (Firebase/Supabase free tier or a Cloudflare Worker + KV) storing a count per fact id; mark "liked" in `localStorage` for one-like-per-browser.
- Showreel: MP4/WebM, muted autoplay loop, poster image, pause under `prefers-reduced-motion`.
- Accessibility: real `<a>`/`<button>`, 44px targets, text ≥ 4.5:1, visible focus, `aria-pressed` on toggles/chips/likes, decorative SVG `aria-hidden`.
- Responsive: cards and grids use `auto-fit/auto-fill minmax`; header and chip groups wrap; node view stacks.
- Analytics: Google Analytics (was on the previous site).

## 7. Open items (placeholders in content)
Years, agency names, Visit Dubai concept + result, tools for several projects, team credits, award list, CV link, portrait, country lessons, toy names, resource items, real skill values. Home direction A vs B still to choose.

## 8. About the reference files
`reference/*.dc.html` are exported design mockups. Each is an HTML template: markup inside `<x-dc>`, `{{ holes }}` filled by `renderVals()` in the `<script type="text/x-dc">` class at the bottom, `<sc-for>` = loop, `<sc-if>` = conditional. They will not run on their own (they need the design tool's runtime). Read them for exact markup, spacing, colors and copy; re-implement as normal HTML/CSS/JS.
