# Three design directions — prototypes

Static HTML/CSS/JS. No framework, no build dependency beyond Node for generation.

```bash
node build/proto.mjs          # regenerate all 25 pages
python3 -m http.server 4322   # serve from the project root
```

Then open `/proto/`.

| | A · Index | B · Darkroom | C · Statement |
|---|---|---|---|
| Ground | white | near-black (light mode inverts) | near-white |
| Type | Schibsted Grotesk only | Spline Sans Mono only | Bricolage Grotesque + IBM Plex Mono |
| Accent | `#1A3CFF`, state only | `#FF5A2B`, the control only | none — colour comes from the work |
| Hero | no hero; the index is the hero | a scrubbable contact sheet | five sentences |
| Craft + engineering | a filter that re-sorts one list | an instrument you operate | said plainly, with the work inline |

Shared content lives in `build/proto-content.mjs`. All three directions render from it, so the
comparison is about design, not copy.

## What is built
Homepage + seven project pages per direction. Lab notebook and "worked with" appear as sections
on the homepage. Not built yet (they come after a direction is picked): Resources, About classic,
About nodes, the Lab's `#playground`.

## What I dropped from DESIGN.md, and why
The *features* are all intact. What I did not carry over is the spec's label system —
`01 / WORK`, `EXP-001`, `Fig. N`, tracked-out uppercase mono eyebrows, `→` appended to links,
rounded cards with soft shadows. That exact kit is the current house style of generated
"AI lab" pages, so it works against the brief rather than for it. The same information is
carried by position, weight and rules instead.

Same reasoning applies to the current live site: vellum ground `#E8E8E3`, a serif display face
and a terracotta accent `#9E3B26` is the single most common generated-design palette right now.

## Media
Every image and video is a solid grey box with its final aspect ratio and a label
(`Showreel 16:9`, `Project cover 16:10`, `Still 4:5`). They use `aspect-ratio`, so dropping in
real media will not shift the layout.

## Open items

### Facts I could not verify
The resume is not in this folder. Everything below comes from `content/*.json` and Artem's brief;
nothing was invented. These still need checking against the resume:

- `[TODO: agency name]` — the Middle Eastern agency behind the Lexus and Nike R&D (appears 4×)
- `[TODO: year]` — Lexus, Nike, Visit Dubai, Fish and Cat, MDLBEAST
- `[TODO: tools]` — Visit Dubai, Smurfs, MDLBEAST; `[TODO: 3D / AR tools]` — Jurassic World
- `[TODO: one line on the visual concept]` — Lexus, Nike
- `[TODO: the installation concept…]` and `[TODO: what the installations achieved…]` — Visit Dubai
- `[TODO: the story in one line]` — Fish and Cat
- `[TODO: names]` — Visit Dubai team credits
- `[TODO: project name]` — the Meta Horizon Mobile Hackathon winning entry
- `[TODO: next experiment]` + `[TODO: the question it asks]` — lab
- The client strip (Dior, Nike, Amazon, L'Oréal, Cartier, Snap Inc., Universal Pictures,
  Paramount Animation, Olympic Games) is taken verbatim from `reference/Main.dc.html`.
  Confirm each one is yours to claim.

### Before deploy
- Self-host the three font families instead of loading them from Google Fonts.
- Replace the grey boxes with real media; add `loading="lazy"` and `poster` on video.
- Decide what happens to the likes counter and the node graph from DESIGN.md.
