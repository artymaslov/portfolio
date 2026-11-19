# artmaslov.com

Static site. Plain HTML, CSS and JS, generated from one content file. No framework,
no runtime dependency; Node is only used to render the pages.

```bash
node build/site.mjs      # regenerate all 17 pages
python3 build/serve.py   # preview on http://localhost:4322
```

Two things keep a rebuild from hiding behind the browser cache: asset URLs carry the file's
mtime (`site.css?v=…`), and `build/serve.py` sends `Cache-Control: no-store`. It is the same
static server as `python3 -m http.server`, which sends no cache headers at all and will happily
serve you yesterday's page.

## Pages

| Route | Page |
|---|---|
| `/` | Home: who I am, the reel, recent work, lab |
| `/work/` | All work, filterable by how it was made |
| `/work/<slug>/` | One project, seven of them |
| `/lab/` | All experiments, then the playground |
| `/lab/<slug>/` | One experiment: question, what I built, result |
| `/resources/` | Under construction, and out of the nav until there is something on it |
| `/about/` | Portrait, bio, spec, awards |
| `/about/nodes/` | The same About as a draggable node graph |

## Files

```
build/content.mjs    all copy and data
build/site.mjs       the generator
build/serve.py       local preview server, no caching
build/grabframe.swift  pulls one frame out of a video at a given second
assets/logo.svg      the ARTY MASLOV wordmark, inlined at build time
assets/media/        real media, one folder per project
  reel/              the showreel and its poster — not a project, the home page's own media
  pavilion/          hero pair, ba/ before-and-after pairs, plates/, clips/, films/, og-cover
  raft/              the world reel and its poster, thumbnail
  configurator/      hero video, floor clip, before/after pairs, thumbnails
  lexus/, nike/      hero video and poster, clips/ loops, plates/ stills, thumbnails
  visit-dubai/       the same, plus films/ for the two pieces you start yourself
  mdlbeast/          hero video and poster, thumbnails
  jurassic-world/    breakdown reel and poster, thumbnails
  smurfs/            turntable reel, one wide clip, thumbnail
  csgo/              promo film and poster, plates/ process boards, thumbnails
                     (a lab page, not a work page: it was a personal entry)
  */_source/         the originals the webp files came from, referenced by nothing
assets/site.css      the whole design system
assets/site.js       the work filter, hover previews, before/after, the image viewer
assets/nodes.js      the node graph
content/*.json       original content export (source for build/content.mjs)
reference/*.dc.html  the original design mockups
DESIGN.md            the original spec
legacy/              the previous version of the site, kept for reference
```

## How it is designed

One typeface (Schibsted Grotesk). Neutrals plus one accent, `#1A3CFF`, which only ever
marks state: the current page, a hover, a focus ring, the active filter. Light and dark
through `prefers-color-scheme`. A 4px spacing scale. Transitions are 140ms and stop
entirely under `prefers-reduced-motion`.

Corners are rounded on one scale, `--r1` 6px through `--r4` 20px, plus `--r-full` for
pills. The radius follows the size of the box: chips and hover bands stay tight, list
thumbnails take 10px, figures and cards 14px, hero and full-width media 20px. Buttons
and toggles are capsules. Type, rules and the grid stay square.

Section headings sit above a single 1px rule — never bracketed between two.

The left rail is navigation only: wordmark, pages, contact. Nothing expands.

The wordmark is inlined rather than linked, so it costs no request and its paths — which
carry no fill of their own — take `currentColor`. That is what flips it from black to white
in dark mode, with no second file.

The hand/machine story is told by the filter on `/work/`, not by a slogan. Lexus and Nike
appear under both, because they were both.

Two things deliberately not carried over from `DESIGN.md`: the tracked-out uppercase mono
labels (`01 / WORK`, `EXP-001`, `Fig. N`) and arrows appended to link text. That kit is the
current signature of generated "AI lab" pages, so it works against the brief. The same
information is carried by position, weight and rules.

## Cut on purpose

Fun facts, the country table, the skill map, the likes button and the resources listing are
gone from the pages. The fun-facts and skill-map copy is still in `build/content.mjs`, marked
as not rendered, so nothing is lost if it comes back.

## Checked

64 checks (16 routes × 375, 768, 1024, 1440px) and 978 contrast measurements in each
theme: no horizontal scroll, no missing alt, no broken image, no WCAG AA contrast failure,
and no touch target
under 44px — the smallest image button on a phone measures 94px. The one thing the sweep
leaves alone is the 16px `<input type="range">` behind each before/after handle; it is
visually hidden and exists for keyboard and screen readers, and the thing you actually drag
is the full height of the image. Node graph works with
pointer and keyboard, and stacks into a readable list below 928px.

## Media

Posters come out of the videos themselves. `qlmanage -t` gives you the first frame, which
is often a title card mid-wipe, and pads it with black; `build/grabframe.swift` takes a
frame at whatever second you name, at full size and with nothing added:

```bash
swiftc -O build/grabframe.swift -o /tmp/grabframe
/tmp/grabframe assets/media/mdlbeast/hero.mp4 57 /tmp/frame.png
```

A page with a hero or a still grid shows no placeholders. Anything else without real media
yet is a solid grey box with its final aspect ratio and a label
(`Project cover 16:10`, `Project hero 16:9`, `Still 4:5`, `Portrait 4:5`). Everything uses
`aspect-ratio`, so dropping media in never shifts the layout.

A list preview shows a still and plays a short clip on hover or keyboard focus. Touch devices
and `prefers-reduced-motion` keep the still. Give an experiment a `thumb: { poster, video }`
and it picks the behaviour up; leave it off and it falls back to the grey box.

### Weight

The six before/after PNGs were 10 MB; as webp they are 542 KB, and the list thumbnail went
from 840 KB to 24 KB. Artem re-encoded the two heavy files himself: the hero went from 26 MB
to 2.7 MB, and the 9.5 MB floor GIF was replaced by an 833 KB mp4.

Everything the configurator page serves now comes to about 4 MB, and the hero is
`preload="metadata"` behind its poster, so the bulk of it only loads on play.

Lexus and Nike arrived as 24 MB of full-size webp. Re-encoded to a 1600px copy for the
viewer and a 640px copy for the grid, the fourteen stills come to 1.1 MB in all. The two
hero posters were pulled out of the videos with `qlmanage` and trimmed back to the frame.

Each project keeps its originals in `_source/`. Nothing references those folders; delete
them if the repo should stay small (lexus 20 MB, nike 3.5 MB, configurator 10 MB).

A lab hero never autoplays, so Raft's page costs 72 KB until someone presses play on the
49-second reel behind it (8.8 MB), and Cat Therapy's costs 20 KB.

Served weight: home 3.7 MB, nearly all of it the reel, which autoplays behind a 30 KB
poster — lighter than the Nike hero that already did. pavilion 2.4 MB on open and 7.2 MB if the walkthrough is played. The
Set and Unset examples are sliders, so both halves of each pair load at 1200px rather
than one 640px thumbnail; that is the cost of the slider and it is worth it on jewellery.
configurator about 4 MB, lexus 4.9 MB, nike 5.3 MB, smurfs 2 MB,
visit-dubai 11 MB on open and 22 MB if both films are played, mdlbeast 13 MB —
a single 65-second reel, and the heaviest page that loads on its own. Jurassic World's reel is 45 MB — 36 seconds at
10 Mbit/s, near master quality — so that one does not autoplay: the page loads no
media until someone presses play: its poster is 7 KB. Artem has decided to leave the videos as they are;
the heroes are the heavy part (nike 4.7 MB, visit-dubai 8.9 MB) and they autoplay, so an
`ffmpeg` pass is the one obvious win if that ever matters. There is no `ffmpeg` on this
machine, so every image here was handled with `cwebp`, `sips`, Pillow and `qlmanage`.

A silent looping clip stands in for what used to be a GIF: `autoplay muted loop playsinline`,
and under `prefers-reduced-motion` it stops and gains controls instead. Any `figure` whose
source ends in `.mp4` or `.webm` renders that way automatically.

### Three kinds of video

A **hero** autoplays, muted, on a loop, with controls on so sound stays reachable. The
home page's reel is one of these, built by `reelBlock()` rather than from a project's
`hero`: same frame, same radius, same edge, because it is the same kind of thing. Its
file carries no audio track at all, which is why the section head says so and the
controls are there to stop it rather than to find sound.
A **clip** is a short silent loop in a row of three; nothing to click. `cols` on the clip
row changes how many sit across — Smurfs uses one, full width. A letterboxed source gets
`fit: 'cover'` and a `ratio` matching the picture inside the bars, so the box crops the
black off rather than printing it on the page.
A hero can opt out of autoplay with `autoplay: false`, which is what a 45 MB reel does.
A **film** is a minute-long piece you sit through, so it waits: `preload="none"` behind its
poster, and not a byte of it loads unless someone presses play. Visit Dubai carries two of
those, which is why its folder is 22 MB but its page opens at 11.

`order` on a project decides whether the clip row or the still grid comes first.

A lab page builds its hero the same way but never autoplays it, which is why Cat Therapy's
11 MB film costs 20 KB until someone presses play. Lab pages take `plates` and `year` too,
so an experiment can carry the same image grid and the same viewer a project does.

### The edge of a picture

A catalogue shot is white to its own corners, so on a white page it has no edge and bleeds
into the paper. Every media frame — `.ba__box`, `.plate`, `.thumb`, and video — draws one
in `--edge`, a token that exists for nothing else.

It has to be a ring painted **after** the content, as `::after`. An `inset` box-shadow on
the frame itself paints beneath absolutely positioned children, which on these components
is the picture, so it shows only in the corner curves where the image is clipped away —
which looks exactly like a frame that is working, and is not one. Video takes the inset
shadow instead, since a `<video>` is the element itself rather than a child of one.

### The image viewer

A still in a grid is a `<button>`, so it opens from the keyboard as well as the mouse, and
the grid only ever loads the 640px copy. Opening one puts the 1600px copy into a `<dialog>`,
which brings the focus trap, Escape and focus-restore with it; arrow keys and the two
chevrons step through the set, and a click anywhere that is not a chevron closes it. Closing
drops the `src`, so the large file is not held once it is off screen.

`html:has(.lb[open]) { overflow: hidden }` stops the page scrolling behind the viewer.

### Embeds

A board that lives on someone else's server (Pavilion's flow, on Miro) ships as a static
export with a **Load the interactive board** button beside it. Nobody pays for a
third-party frame unless they ask for one, and the page still shows the diagram if Miro
is down, blocked, or the sharing link changes.

### Credits, and links in prose

A credit row takes an optional third element — `['Logic and physics', 'Pavlo Tkachenko',
'https://…']` — and becomes a link. Both project and lab pages use the same block, so a
collaborator, a write-up or a submission is credited where it belongs instead of in a
paragraph.

Links inside running text are underlined, thin and in `--fg3`, going accent on hover.
Colour alone is reserved for state here, so without that rule a link in a paragraph was
not readable as a link at all — the GitHub link on `/resources/` had the same problem and
is fixed by the same rule.

### The row hover

A hovered row in the experiment list hides its own borders and the rule the next row draws
(`:has()`), so the rounded highlight has no straight line crossing it. Before that fix only
the last row looked right, because it was the one that owned the rule on both of its edges.

### Share cards

Every page carries Open Graph and Twitter tags and a canonical URL, built from
`site.origin` in `build/content.mjs` — **change that one string if the domain is not
`artmaslov.com`**, because og:image has to be absolute. A project can set
`share: '/path/to/1200x630.jpg'`; without one the card falls back to a text summary.
Pavilion has the only share image so far.

### One project, one page

The lab used to carry a stub called "Jewelry AI pipeline" — the same ComfyUI jewellery
work, written as an open question before it had a client on it. The Pavilion page
supersedes it, so it was removed rather than left as a thinner second entry.

### Before and after, two ways

A **slider** (`compare`, or `heroCompare` in a hero slot) wipes one image over another.
It reads best when both are the same photograph — Pavilion's hero pair is — but Artem
asked for sliders on the Set and Unset examples too, and with square frames and the piece
near the centre they work. `cols` puts two across.

**Side by side** (`pairs`) labels Before and After under two stills that both stay visible.
Pavilion's failures use it on purpose: with a miss you want the original and the wrong
result on screen at once, and a wipe hides one of them. Those stills feed the viewer.

A `section` on a project can carry its own evidence — `pairs`, `plates`, `clips`,
`embed` or `film` — and it spans the full width under that section rather than
squeezing into the prose column.

### The slider

The handle sits on the image and is dragged directly. Behind it is a real
`<input type="range">`, visually hidden but focusable, so arrow keys and screen readers work
without a second implementation. `touch-action: pan-y` on the frame means a horizontal drag
moves the handle while a vertical swipe still scrolls the page.

## Open items

The resume is not in this folder, so nothing below could be verified. Everything on the
site comes from `content/*.json` and Artem's own brief; nothing was invented, and every
gap is a visible `[TODO: …]`.

**Work**
- Lexus and Nike name no client and no commissioner. Both are self-initiated
  speculative R&D, the pages say so in the meta row and in Made, and there is
  nothing pending here. Do not re-add an agency.
- `[TODO: tools]` — Visit Dubai, Smurfs, MDLBEAST, Jurassic World
- `[TODO: the installation concept]`, `[TODO: what the installations achieved]` — Visit Dubai
- `[TODO: names]` — Visit Dubai team credits

**Pavilion**
- `[TODO: the front end and where it runs]` in Tools.
- Numbers: brands on the tool and generations run, from `/admin/stats`, as of the day
  the page goes up — plus a written ok from Mico on the figures and before any brand or
  piece is named. No brand is named on the page today.
- Nikita: full name and a link, in My part and in Credits.
- The "what I changed my mind about" section would be stronger with the old
  code-geometry render beside the current one. If that render is gone, it stays text.
- There is no CleanUp before/after pair, so that mode is described and not shown.

**Work**, continued
- Every project now has a real cover.
- `[TODO: the modelling and rigging stack]` — Smurfs. `projects.json` carries `[Tools]` and
  nothing identifiable shows in the reel.
- `[TODO: the AR toolchain]` — Jurassic World. Marvelous Designer and Blender are both
  visible in the reel; what the lens itself was built in is not recorded here.
- `[TODO: the rest of the stack]` — MDLBEAST tools. Snapchat AR is in the brief, the rest
  is not. The page has the reel and nothing else: no stills, no AR capture of its own.
- `[TODO: which lenses were mine…]` — the AR section describes what is visible in the reel.
  Which of it Artem built, and how many lenses shipped, is not recorded anywhere here.
- The MDLBEAST copy cites a timestamp (“the AR starts around 0:22”). Re-encode or recut
  that hero and the number has to move with it.
- `[TODO: the rest of the stack]` — Visit Dubai tools. Apple Vision Pro is confirmed, the
  rest is not.

**Lab**
- Raft: no gaps. Every line on that page is checked against the Devpost submission and the
  Devpost interview, both linked in its credits. The award is Best New User Onboarding
  Experience, from the Meta Horizon Creator Competition: Mobile Innovation.
- Web configurator: the front-end stack, and which ComfyUI models and nodes the workflow uses
  plus how long a frame takes
- Cat Therapy (`/lab/csgo/`): it has **no entry in `content/projects.json`**, so the copy was
  written from the boards and the film plus what Artem said — a personal entry to the
  Counter-Strike twentieth-anniversary contest, 2019. What the texture and the renders were
  made in is still `[TODO]`, and how the entry placed is not recorded.
- The last row is a placeholder for the next experiment; delete it or fill it

**About**
- `[TODO: course and years]` — NAIT; `[TODO: degree]` — Odesa
- `[TODO: CV link]` — the button in the About bar
- Both award rows are real now. The Fast Company one is **Tactical's award, not Artem's** —
  he was on the team, art directing, and the Apple Vision Pro work the citation names is the
  Visit Dubai project. The row says so in its own line; do not let that line get edited out.

**Elsewhere**
- The client strip on Home is taken verbatim from `reference/Main.dc.html`. Confirm every name.
- Resources is under construction and no longer linked from the nav. The page still builds at
  `/resources/`; put the row back in `nav` in `build/content.mjs` to show it again.

### Before deploy
- Self-host Schibsted Grotesk instead of loading it from Google Fonts.
- Replace the grey boxes with real media; add `loading="lazy"` and a `poster` on video.
