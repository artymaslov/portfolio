# The home-page statement

Removed from the home page on 2026-11-18. The page now opens on the reel.

## What it was

A five-sentence statement standing above the reel — the title set at `--t5`
and the four paragraphs that backed it. On screens from 76rem it ran as two
columns, the sentence on the left and the paragraphs on the right, so that the
opening filled the same width as the reel beneath it.

## What is kept here

- `intro.css` — every rule that only served the statement, in source order.

## To put it back

1. Paste `intro.css` into `assets/site.css` immediately before `.figures {`.
2. Add `.intro__b` back to the front of two shared selector lists there:
   - the running-text rule, now `.case__p, .bio__p, .cta p, .empty p, .block__lead`
   - the paragraph-gap rule, now `.case__p p + p, .bio__p p + p, …`
3. In `build/site.mjs`, in `home()`, put the section back in place of the
   hidden `<h1>` and call `reelBlock()` without `{ lead: true }`:

```js
<section class="intro">
  <h1 class="intro__h">${esc(statement[0].t)}</h1>
  <div class="intro__b">${statement.slice(1).map((s) => `<p>${esc(s.t)}</p>`).join('')}</div>
</section>
```

The copy itself was never removed: `statement` is still in `build/content.mjs`,
and the home page still uses its first sentence as the meta description.
