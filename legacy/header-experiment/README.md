# Header experiment (parked)

Tried in November 2026 and rolled back: all navigation in one fixed top bar with
progressive "iOS glass" blur, a full-screen reel on the home page, and
difference-blended header text.

`site.css` here is the whole stylesheet as it stood at the end of the experiment.
The override block is at the bottom of the file, under a marked comment; everything
above it is the normal stylesheet. To try it again, copy that block to the end of
`assets/site.css` and make these four changes back:

1. `build/site.mjs`, `rail()` — add before `<aside class="rail">`:
   `<div class="topfade" aria-hidden="true"><span></span>×6</div>`
2. `build/site.mjs`, `page()` — add before `</body>`:
   `<div class="botfade" aria-hidden="true"><span></span>×6</div>`
3. `build/site.mjs`, `home()` — replace the `.intro` section and `${reelBlock()}`
   with a `.hero` section: a full-bleed `<video class="hero__v">` and an `<h1 class="hero__h">`
   carrying `statement[0].t` alone.
4. `assets/site.js` — the `data-scrolled` attribute on `<html>`, set from `scrollY > 8`,
   which is what shrinks the wordmark once the page moves.

Why it was rolled back: the bottom glass blurred the lines you were about to read on
a case page, difference blending lost contrast over mid-tone images, and the whole
thing moved the site from a working catalogue to an agency landing page. See the
critique in the session that built it.
