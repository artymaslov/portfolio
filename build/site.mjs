/* artmaslov.com — static site generator.
   node build/site.mjs */

import { writeFileSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  site, statement, reel, projects, experiments, clients,
  nav, lab, about, awards, press, graph
} from './content.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const out = (rel, html) => {
  const p = join(ROOT, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, html);
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Asset URLs carry the file's mtime, so a rebuild always wins over the
   browser cache and an unchanged build stays cacheable. */
const v = (rel) => {
  try { return `${rel}?v=${Math.floor(statSync(join(ROOT, rel.slice(1))).mtimeMs)}`; }
  catch { return rel; }
};

/* [TODO: …] stays visible and reads as deliberately pending */
const todo = (s) => esc(s).replace(/\[TODO:([^\]]*)\]/g, '<span class="todo">[TODO:$1]</span>');

/* Solid grey media placeholder, final aspect ratio, labelled. */
const ph = (label, ratio, extra = '') =>
  `<div class="ph${extra ? ' ' + extra : ''}" style="aspect-ratio:${ratio}" role="img" aria-label="${esc(label)}, placeholder"><span class="ph__l">${esc(label)}</span></div>`;

/* The portrait is one photograph. It was four for a while, swapped by hovering
   over quadrants; if that ever comes back, the zones belong here and not in the
   page body. */
const portraitFrame = (p) => `<div class="portrait__frame">
      <img class="portrait__img" src="${p.src}" width="${p.w}" height="${p.h}" decoding="async"
           alt="${esc(p.alt)}">
    </div>`;

const counts = {
  all: projects.length,
  hand: projects.filter((p) => p.made.includes('hand')).length,
  machine: projects.filter((p) => p.made.includes('machine')).length
};

const neighbours = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return { prev: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
};

/* The wordmark, inlined so it takes its colour from the page and costs no request.
   Its paths carry no fill, so `fill: currentColor` in the stylesheet drives it. */
const LOGO = readFileSync(join(ROOT, 'assets/logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*\?>/g, '')          /* Illustrator's prolog */
  .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')  /* and its XMP block */
  .replace(/\s(?:id|data-name)="[^"]*"/g, '')
  .trim()
  .replace(/<svg /, '<svg class="logo" aria-hidden="true" focusable="false" ');

/* The contact marks. Single filled paths on a 24 unit box, taking their colour
   from the link through currentColor, so they follow the theme and the hover
   like the words they replaced. Each is given its name by the link's
   aria-label, not by text inside the drawing. */
const MARKS = {
  email: '<path d="M2.4 6.6A2.1 2.1 0 0 1 4.5 4.5h15a2.1 2.1 0 0 1 2.1 2.1v10.8a2.1 2.1 0 0 1-2.1 2.1h-15a2.1 2.1 0 0 1-2.1-2.1V6.6Zm2.9.3L12 12l6.7-5.1H5.3ZM20.1 8.3l-7.5 5.7a1 1 0 0 1-1.2 0L3.9 8.3v8.9h16.2V8.3Z"/>',
  linkedin: '<path d="M22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-.9-.8-1.7-1.8-1.7ZM7.1 20.5H3.6V9h3.5v11.5ZM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1Zm15.1 13.1h-3.5V15c0-1.4 0-3.1-1.9-3.1s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h-.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3Z"/>',
  github: '<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/>'
};
const mark = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${MARKS[n]}</svg>`;

/* The three drawings that sit beside the menu. Only the geometry is taken —
   the viewBox and the one path — because each file carries an Illustrator
   <style> block whose .cls-1 would leak into the page's own stylesheet if the
   file were inlined whole. The stroke is left to CSS, so the drawing takes the
   colour of the link it belongs to. */
const DECO = Object.fromEntries(['work', 'lab', 'about'].map((k) => {
  const src = readFileSync(join(ROOT, `assets/menu decorations/deco_${k}.svg`), 'utf8');
  return [k, {
    box: src.match(/viewBox="([^"]+)"/)[1],
    d: src.match(/<path[^>]*\sd="([^"]+)"/)[1]
  }];
}));

/* ── shell ─────────────────────────────────────────────────── */

function rail({ current }) {
  const navHtml = nav.map(([label, href]) => {
    const deco = DECO[label.toLowerCase()];
    /* The label is wrapped because the script measures it: the rule the drawing
       uncoils into is exactly as long as the word, not as the link's box. */
    return `<a href="${href}"${current === label ? ' aria-current="page"' : ''}`
      + (deco ? ` data-deco="${deco.d}" data-deco-box="${deco.box}"` : '')
      + `><span class="navl">${esc(label)}</span></a>`;
  }).join('');

  return `<aside class="rail">
  <div class="rail__id">
    <p class="id"><a href="/">${LOGO}<span class="vh">${esc(site.name)} — home</span></a></p>
    ${/* The ampersand is bound to the word before it, so the line never breaks
          with "& Art Director" hanging alone at the start of the second line. */ ''}
    <p class="id__sub">${esc(site.role).replace(/ &amp; /g, '&nbsp;&amp; ')}</p>
  </div>
  <nav class="rail__nav" aria-label="Pages">${navHtml}</nav>
  <nav class="rail__links rail__links--icons" aria-label="Contact">
    <a href="mailto:${site.email}" aria-label="Email">${mark('email')}</a>
    <a href="${site.linkedin}" aria-label="LinkedIn" rel="noopener">${mark('linkedin')}</a>
    <a href="${site.github}" aria-label="GitHub" rel="noopener">${mark('github')}</a>
  </nav>
</aside>`;
}

/* Google Analytics, loaded only on the real domain: a local preview or a file://
   open would otherwise count as traffic. One tag id, in site.analytics. */
function ga() {
  if (!site.analytics) return '';
  return `
<script>
(function(){
  var h = location.hostname;
  if (location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) return;
  var id = ${JSON.stringify(site.analytics)};
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id);
})();
</script>`;
}

function page({ title, desc, current, body, script = '', share = null, path = '', band = false }) {
  /* A link pasted into LinkedIn or a chat shows a card. Without these it shows
     the bare URL, so the share image is part of the page, not a nice-to-have. */
  const img = share ? `${site.origin}${share}` : '';
  const social = `
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${site.origin}/${path}">
<meta property="og:site_name" content="${esc(site.name)}">${img ? `
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">` : `
<meta name="twitter:card" content="summary">`}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${site.origin}/${path}">${social}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${v('/assets/site.css')}">
<script src="${v('/assets/site.js')}" defer></script>${script}${ga()}
</head>
<body data-filter="all"${current ? '' : ' data-home'}>
<a class="skip" href="#main">Skip to content</a>
${band ? sayBand() : ''}
<div class="shell">
${rail({ current })}
<main class="sheet" id="main">
${body}
<footer class="foot">
  <p><a href="mailto:${site.email}">${esc(site.email)}</a></p>
</footer>
</main>
</div>
${band ? saidDialog() : ''}
</body></html>`;
}

/* ── shared blocks ─────────────────────────────────────────── */

/* A still by default; the clip plays on hover or focus, if the viewer has a
   pointer and has not asked for less motion. Falls back to a placeholder. */
const thumb = (t) => {
  if (!t || !t.poster) return ph('Project cover 16:9', '16/9');
  return `<div class="thumb"${t.video ? ' data-thumb' : ''} style="aspect-ratio:16/9">
    <img class="thumb__still" src="${t.poster}" alt="" loading="lazy" decoding="async">
    ${t.video ? `<video class="thumb__clip" src="${t.video}" muted loop playsinline preload="none" tabindex="-1" aria-hidden="true"></video>` : ''}
  </div>`;
};

const figure = (p) => `<figure class="fig" data-slug="${p.slug}" data-made="${p.made}">
  <a href="/work/${p.slug}/">
    ${thumb(p.thumb)}
    <figcaption>
      <h3 class="fig__t">${esc(p.title)}</h3>
      <p class="fig__d">${esc(p.tagline)}</p>
      <p class="fig__m"><span class="fig__y">${todo(p.year)}</span></p>
    </figcaption>
  </a>
</figure>`;

const expList = (items) => `<ul class="exp">
  ${items.map((e) => `<li>
    <a class="exp__row" href="/lab/${e.slug}/">
      <span class="exp__thumb">${thumb(e.thumb)}</span>
      <span class="exp__t">${todo(e.title)}</span>
      <span class="exp__d">${todo(e.desc)}</span>
      <span class="exp__s" data-state="${e.state.toLowerCase().replace(/\s/g, '-')}">${esc(e.state)}</span>
    </a>
  </li>`).join('')}
</ul>`;

/* An autoplaying, muted, looping hero. Controls stay on, so sound is reachable
   and reduced-motion viewers get a stopped video they can drive themselves. */
const heroVideo = (h) => `<figure class="vid vid--hero">
  <video ${h.autoplay === false ? 'preload="none"' : 'data-loop autoplay muted loop preload="metadata"'}
         playsinline controls poster="${h.poster}" style="aspect-ratio:${h.ratio}">
    <source src="${h.video}" type="video/mp4">
    <p>Your browser cannot play this video. <a href="${h.video}">Download it instead</a>.</p>
  </video>
  ${h.caption ? `<figcaption class="cap">${todo(h.caption)}</figcaption>` : ''}
</figure>`;

/* The home reel. Built like a case-page hero — same frame, same radius, same
   edge — because it is the same kind of thing: the evidence under a claim. It
   autoplays muted and loops; the file has no audio track, so the controls are
   there to stop it rather than to find sound. Under reduced motion site.js
   pauses it and hands over the controls. */
/* `lead` marks it as the first thing on a page, which the reel is on the home
   page now that the statement has gone. */
const reelBlock = ({ lead = false } = {}) => `<section class="block${lead ? ' block--lead' : ''}">
  <div class="block__head">
    <h2>Reel</h2>
    <p class="block__meta">${esc(reel.year)} · ${esc(reel.length)} · silent</p>
  </div>
  <figure class="vid">
    <video data-loop autoplay muted loop playsinline controls preload="metadata"
           poster="${reel.poster}" style="aspect-ratio:${reel.ratio}">
      <source src="${reel.video}" type="video/mp4">
      <p>Your browser cannot play this video. <a href="${reel.video}">Download it instead</a>.</p>
    </video>
    <figcaption class="cap">${todo(reel.caption)}</figcaption>
  </figure>
</section>`;

/* The statement, as a band that runs. The moving copy is scenery — it is
   marked away from assistive software, which would otherwise be handed a
   500-character button name — and the button over it carries the name. The
   text itself is not hidden from anyone: it is in the dialog below, in the
   page, and it is this page's meta description. */
const sayBand = () => {
  const run = statement.map((s) => `<span class="say__s">${esc(s.t)}</span>`).join('');
  return `<section class="say" aria-label="Statement">
  <div class="say__view" aria-hidden="true"><span class="say__track" data-say-track><span class="say__run">${run}</span><span class="say__run">${run}</span></span></div>
  <button class="say__hit" type="button" data-say aria-haspopup="dialog" aria-controls="statement"><span class="vh">Read the full statement</span></button>
</section>`;
};

const saidDialog = () => `<dialog class="said" id="statement" aria-label="Statement">
  <div class="said__box">
    <div class="said__t">${statement.map((s) => `<p>${esc(s.t)}</p>`).join('')}</div>
    <button class="said__x" type="button" data-said-x>Close</button>
  </div>
</dialog>`;

/* A row of short silent loops. They run on their own, and they can be stopped:
   a loop someone wants to look at twice is a loop they should be able to hold
   still and scrub, so each one carries its controls like any other video. */
const clipsUl = (c) => `<ul class="clips" style="--cols:${c.cols || 3}">${c.items.map((it) => `<li>
    <video data-loop src="${it.src}" style="aspect-ratio:${c.ratio}"${c.fit ? ` data-fit="${c.fit}"` : ''}
           autoplay muted loop playsinline controls preload="metadata" aria-label="${esc(it.alt)}"></video>
  </li>`).join('')}</ul>`;

/* One still that opens full size. The grid carries the small file; the large
   one is only fetched when the viewer opens. */
const plate = (full, small, alt, ratio) => `<button type="button" class="plate" data-full="${full}">
    <img src="${small}" alt="${esc(alt)}" loading="lazy" decoding="async" style="aspect-ratio:${ratio}">
    <span class="vh">Open full size</span>
  </button>`;

/* A grid of stills. An item either names its files or follows the
   <prefix>_0_<n> convention inside the project's plates folder. */
const platesUl = (slug, g) => {
  const at = (it, suffix) => it.src
    ? it.src.replace(/(\.[a-z0-9]+)$/i, `${suffix}$1`)
    : `/assets/media/${slug}/plates/${g.prefix || slug}_0_${it.n}${suffix}.webp`;
  return `<ul class="plates" style="--cols:${g.cols}" data-gallery>${g.items.map((it) => `<li>
    ${plate(at(it, ''), at(it, '_t'), it.alt, g.ratio)}
  </li>`).join('')}</ul>`;
};

/* Before and after side by side. A wipe would lie here: the tool reframes the
   piece, so the two images are not the same photograph. */
const pairsUl = (pr) => `<ul class="pairs" style="--cols:${pr.cols || 2}" data-gallery>${pr.items.map((it) => `<li>
    <figure class="pair">
      <div class="pair__imgs">
        <div class="pair__one">${plate(`${it.base}-before.webp`, `${it.base}-before_t.webp`, `Before. ${it.before}`, pr.ratio)}<span class="pair__l">Before</span></div>
        <div class="pair__one">${plate(`${it.base}-after.webp`, `${it.base}-after_t.webp`, `After. ${it.after}`, pr.ratio)}<span class="pair__l">After</span></div>
      </div>
      ${it.caption ? `<figcaption class="cap">${todo(it.caption)}</figcaption>` : ''}
    </figure>
  </li>`).join('')}</ul>`;

/* A board that lives somewhere else. The static export is what loads; the live
   embed is one click away, so nobody pays for a third-party frame unasked. */
const embedBlock = (e) => `<figure class="embed" data-embed data-src="${esc(e.src)}" data-title="${esc(e.title)}">
  ${plate(e.still, e.stillSmall, e.alt, e.ratio)}
  <div class="embed__act">
    <button type="button" class="btn btn--q" data-embed-go>${esc(e.cta)}</button>
    <a href="${esc(e.href)}" rel="noopener">Open it on ${esc(e.host)}</a>
  </div>
  ${e.caption ? `<figcaption class="cap">${todo(e.caption)}</figcaption>` : ''}
</figure>`;

const headed = (h, lead, inner) => `<section class="block">
  <div class="block__head"><h2>${esc(h)}</h2></div>
  ${lead ? `<p class="block__lead">${todo(lead)}</p>` : ''}
  ${inner}
</section>`;

/* A before and after on one frame, wiped by a handle. Only honest when the two
   images are the same photograph; where they are not, use pairsUl instead. */
const baFigure = (c, pair, n) => `<figure class="ba" data-ba style="--x:50%">
  <div class="ba__box" style="aspect-ratio:${c.ratio}">
    <img class="ba__after" src="${pair.after}" alt="After. ${esc(pair.afterAlt || c.afterAlt || '')}" loading="lazy" decoding="async">
    <img class="ba__before" src="${pair.before}" alt="Before. ${esc(pair.beforeAlt || c.beforeAlt || '')}" loading="lazy" decoding="async">
    <span class="ba__line" aria-hidden="true"><span class="ba__knob">
      <svg width="17" height="9" viewBox="0 0 17 9" fill="currentColor" aria-hidden="true"><path d="M5 0 0 4.5 5 9z"/><path d="M12 0l5 4.5L12 9z"/></svg>
    </span></span>
    <label class="ba__ctl vh">
      <span>Example ${n + 1}: ${esc(c.drag || 'drag to reveal the original')}</span>
      <input type="range" min="0" max="100" step="1" value="50">
    </label>
  </div>
  ${pair.caption ? `<figcaption class="cap">${todo(pair.caption)}</figcaption>` : ''}
</figure>`;

const basDiv = (c) => {
  const style = [c.max && `--ba-max:${c.max}`, c.cols && `--cols:${c.cols}`].filter(Boolean).join(';');
  /* One comparison on its own — the picture a case opens with — is centred in
     the column. Held to its own width against the full reading measure it was
     hung on the left edge with a third of the page empty beside it. */
  const one = c.pairs.length === 1 ? ' bas--one' : '';
  return `<div class="bas${one}"${style ? ` style="${style}"` : ''}>${c.pairs.map((pair, n) => baFigure(c, pair, n)).join('')}</div>`;
};

const compareBlock = (c) => (c.h ? headed(c.h, c.lead, basDiv(c)) : basDiv(c));

/* Does this page have anything the viewer can open? */
const hasGallery = (p) => Boolean(p.plates || (p.sections || []).some((s) => s.pairs || s.plates || s.embed));

const clipRow = (c) => headed(c.h, c.lead, clipsUl(c));
const plateGrid = (slug, g) => headed(g.h, g.lead, platesUl(slug, g));

/* A film is a piece you sit through, so it waits for a click: nothing but the
   poster loads until then. */
const filmFigure = (f) => `<figure class="vid">
  <video controls playsinline preload="none" poster="${f.poster}" style="aspect-ratio:${f.ratio}">
    <source src="${f.src}" type="video/mp4">
    <p>Your browser cannot play this video. <a href="${f.src}">Download it instead</a>.</p>
  </video>
  ${f.caption ? `<figcaption class="cap">${todo(f.caption)}</figcaption>` : ''}
</figure>`;

const film = (f) => `<section class="block">
  <div class="block__head"><h2>${esc(f.h)}</h2></div>
  ${f.lead ? `<p class="block__lead">${todo(f.lead)}</p>` : ''}
  <figure class="vid">
    <video controls playsinline preload="none" poster="${f.poster}" style="aspect-ratio:${f.ratio}">
      <source src="${f.src}" type="video/mp4">
      <p>Your browser cannot play this video. <a href="${f.src}">Download it instead</a>.</p>
    </video>
    ${f.caption ? `<figcaption class="cap">${todo(f.caption)}</figcaption>` : ''}
  </figure>
</section>`;

/* A credit line. A third element makes the value a link, which is how a
   collaborator gets credited properly rather than as plain text. */
const creditsDl = (rows) => `<dl class="credits">${(rows || []).map(([k, val, href]) =>
  `<div><dt>${esc(k)}</dt><dd>${href ? `<a href="${esc(href)}" rel="noopener">${todo(val)}</a>` : todo(val)}</dd></div>`).join('')}</dl>`;

/* One viewer per page. <dialog> brings the focus trap and Escape with it. */
const lightbox = () => `<dialog class="lb" data-lb aria-label="Image viewer">
  <div class="lb__bar">
    <p class="lb__n" aria-live="polite"></p>
    <button type="button" class="lb__x" data-lb-close>Close<span aria-hidden="true">&#215;</span></button>
  </div>
  <img class="lb__img" alt="">
  <button type="button" class="lb__nav lb__nav--p" data-lb-step="-1" aria-label="Previous image">
    <svg width="11" height="18" viewBox="0 0 11 18" fill="currentColor" aria-hidden="true"><path d="M10 0 0 9l10 9z"/></svg>
  </button>
  <button type="button" class="lb__nav lb__nav--n" data-lb-step="1" aria-label="Next image">
    <svg width="11" height="18" viewBox="0 0 11 18" fill="currentColor" aria-hidden="true"><path d="M1 0l10 9-10 9z"/></svg>
  </button>
</dialog>`;

const pageHead = (h1, lead) => `<header class="ph1">
  <h1>${esc(h1)}</h1>
  ${lead ? `<p class="ph1__lead">${todo(lead)}</p>` : ''}
</header>`;

const workFilter = () => `<div class="worklead">
  <h2 id="work-h">Selected work</h2>
  <div class="seg" role="group" aria-labelledby="work-h">
    <button type="button" data-filter="all" aria-pressed="true">All <span class="seg__n">${counts.all}</span></button>
    <button type="button" data-filter="hand" aria-pressed="false">By hand <span class="seg__n">${counts.hand}</span></button>
    <button type="button" data-filter="machine" aria-pressed="false">With machine <span class="seg__n">${counts.machine}</span></button>
  </div>
</div>`;

/* ── home ──────────────────────────────────────────────────── */

function home() {
  /* The page opens on the work itself: no statement, the reel first. The only
     heading left is this one, which nothing draws — a page still needs an h1
     for a screen reader to announce it and for a search engine to read it, and
     the reel's "Reel" is an h2 under it, not a substitute for it. The statement
     itself is not lost: it is still this page's meta description below. */
  const body = `
<h1 class="vh">${esc(site.name)} — ${esc(site.role)}</h1>

${reelBlock({ lead: true })}

<section class="block">
  <div class="block__head">
    <h2>Recent work</h2>
    <a class="more" href="/work/">All ${counts.all} projects</a>
  </div>
  <div class="figures">${projects.slice(0, 3).map(figure).join('')}</div>
</section>

<section class="block">
  <div class="block__head">
    <h2>Lab</h2>
    <a class="more" href="/lab/">All experiments</a>
  </div>
  ${expList(experiments.slice(0, 3))}
</section>
`;

  return page({ title: `${site.name} — ${site.role}`, desc: statement[0].t, current: null, body, band: true,
    share: '/assets/media/og-home.jpg', path: '' });
}

/* ── work ──────────────────────────────────────────────────── */

function workIndexPage() {
  const body = `
${pageHead('Work', 'Client work in AI video, 3D, AR and immersive production, plus one tool in daily use. Seven projects, two of them still internal R&D.')}
${workFilter()}
<section class="figures" aria-labelledby="work-h">${projects.map(figure).join('')}</section>
<section class="cta">
  <h2>Have a brief in mind?</h2>
  <p>Tell me what it has to do and when. I will say plainly whether I am the right person for it.</p>
  <p><a class="btn" href="mailto:${site.email}">${esc(site.email)}</a></p>
</section>`;

  return page({ title: `Work — ${site.name}`, desc: 'Selected client work: AI video, 3D, AR and immersive production.', current: 'Work', body, path: 'work/' });
}

function projectPage(p) {
  const { prev, next } = neighbours(p.slug);
  const body = `
<article class="case">
  <nav class="crumb" aria-label="Breadcrumb"><a href="/work/">Work</a></nav>
  <header class="case__head">
    <h1>${esc(p.title)}</h1>
    ${p.summary ? '' : `<p class="case__tag">${esc(p.tagline)}</p>`}
    <dl class="case__meta">
      ${p.client ? `<div><dt>Client</dt><dd>${todo(p.client)}</dd></div>` : ''}
      ${/* speculative work names no client: it says what it is instead */ ''}
      ${p.type ? `<div><dt>Type</dt><dd>${esc(p.type)}</dd></div>` : ''}
      <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
      <div><dt>Disciplines</dt><dd>${esc(p.disciplines)}</dd></div>
      <div><dt>Year</dt><dd>${todo(p.year)}</dd></div>
      ${/* live lenses, reels and press: the things a reader can go and check */ ''}
      ${(p.links || []).map(([k, label, href]) =>
        `<div><dt>${esc(k)}</dt><dd><a href="${esc(href)}" rel="noopener">${esc(label)}</a></dd></div>`).join('')}
    </dl>
  </header>
  ${p.heroCompare ? compareBlock(p.heroCompare) : p.hero ? heroVideo(p.hero) : ph('Project hero 16:9', '16/9', 'ph--hero')}
  ${p.summary ? `<section class="case__sum">${p.summary.map(([k, v]) => `<div><h2>${esc(k)}</h2><p>${todo(v)}</p></div>`).join('')}</section>` : ''}
  <div class="case__body">
    ${(p.sections || []).map((s) => `<section class="case__sec">
      <h2>${esc(s.h)}</h2>
      <div class="case__p">${s.p.map((t) => `<p>${todo(t)}</p>`).join('')}</div>
      ${s.compare || s.pairs || s.plates || s.clips || s.embed || s.film ? `<div class="case__ev">
        ${s.compare ? basDiv(s.compare) : ''}
        ${s.pairs ? pairsUl(s.pairs) : ''}
        ${s.plates ? platesUl(p.slug, s.plates) : ''}
        ${s.clips ? clipsUl(s.clips) : ''}
        ${s.embed ? embedBlock(s.embed) : ''}
        ${s.film ? filmFigure(s.film) : ''}
      </div>` : ''}
    </section>`).join('')}
  </div>
  ${(p.order || ['clips', 'plates', 'films']).map((k) =>
      k === 'clips' ? (p.clips ? clipRow(p.clips) : '')
    : k === 'plates' ? (p.plates ? plateGrid(p.slug, p.plates) : '')
    : (p.films || []).map(film).join('')).join('')}
  ${/* A project that lists no tools and credits nobody but its author has
       nothing to put here, and an empty pair of headings is worse than none. */ ''}
  ${(p.tools || []).length || (p.credits || []).length ? `<section class="built">
    <h2>Made with</h2>
    <dl class="spec">
      ${(p.tools || []).length ? `<div><dt>Tools</dt><dd><ul class="tools">${p.tools.map((t) => `<li>${todo(t)}</li>`).join('')}</ul></dd></div>` : ''}
      ${(p.credits || []).map(([k, v, href]) =>
        `<div><dt>${esc(k)}</dt><dd>${href ? `<a href="${esc(href)}" rel="noopener">${todo(v)}</a>` : todo(v)}</dd></div>`).join('')}
    </dl>
  </section>` : ''}
  ${/* placeholders only where no real media has landed yet */ ''}
  ${p.plates || p.hero || p.heroCompare ? '' : `<div class="stills">${ph('Still 4:5', '4/5')}${ph('Still 4:5', '4/5')}</div>`}
  <nav class="pager" aria-label="More work">
    <a href="/work/${prev.slug}/"><span>Previous</span>${esc(prev.title)}</a>
    <a href="/work/${next.slug}/"><span>Next</span>${esc(next.title)}</a>
  </nav>
</article>
${hasGallery(p) ? lightbox() : ''}`;

  return page({
    title: `${p.title} — ${site.name}`, desc: p.tagline, current: 'Work', body,
    share: p.share, path: `work/${p.slug}/`
  });
}

/* ── lab ───────────────────────────────────────────────────── */

function labPage() {
  const body = `
${pageHead('Lab', lab.intro)}

<section class="block">
  <div class="block__head"><h2>All experiments</h2></div>
  ${expList(experiments)}
</section>

<section class="block" id="playground">
  <div class="block__head"><h2>Playground</h2></div>
  <p class="block__lead">${esc(lab.playground.body)}</p>
  <div class="empty">
    <p class="empty__h">Under construction.</p>
    <p>${esc(lab.playground.next)}</p>
  </div>
</section>`;

  return page({ title: `Lab — ${site.name}`, desc: lab.intro, current: 'Lab', body,
    share: '/assets/media/og-lab.jpg', path: 'lab/' });
}

function experimentPage(e) {
  const i = experiments.findIndex((x) => x.slug === e.slug);
  const prev = experiments[(i - 1 + experiments.length) % experiments.length];
  const next = experiments[(i + 1) % experiments.length];

  const hero = e.hero
    ? `<figure class="vid">
        <video controls playsinline preload="metadata" poster="${e.hero.poster}" style="aspect-ratio:${e.hero.ratio}">
          <source src="${e.hero.video}" type="video/mp4">
          <p>Your browser cannot play this video. <a href="${e.hero.video}">Download it instead</a>.</p>
        </video>
        ${e.hero.caption ? `<figcaption class="cap">${todo(e.hero.caption)}</figcaption>` : ''}
      </figure>`
    : ph('Experiment figure 16:9', '16/9', 'ph--hero');

  const built = e.stack ? `<section class="built">
    <h2>Made with</h2>
    <dl class="spec">${e.stack.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${todo(v)}</dd></div>`).join('')}</dl>
  </section>` : '';

  const prose = e.sections ? e.sections.map((sec) => `<section class="case__sec">
      <h2>${esc(sec.h)}</h2>
      <div class="case__p">
        ${sec.p.map((t) => `<p>${todo(t)}</p>`).join('')}
        ${sec.figure ? `<figure class="fig-media">
          ${/\.(mp4|webm)$/.test(sec.figure.src)
            ? `<video data-loop src="${sec.figure.src}" autoplay muted loop playsinline controls preload="metadata" style="aspect-ratio:${sec.figure.ratio}"></video>`
            : `<img src="${sec.figure.src}" alt="${esc(sec.figure.alt || sec.figure.caption)}" loading="lazy" decoding="async" style="aspect-ratio:${sec.figure.ratio}">`}
          <figcaption class="cap">${todo(sec.figure.caption)}</figcaption>
        </figure>` : ''}
      </div>
    </section>`).join('') : `
    <section class="case__sec"><h2>Question</h2><div class="case__p"><p>${todo(e.question)}</p></div></section>
    <section class="case__sec"><h2>What I built</h2><div class="case__p"><p>${todo(e.method)}</p></div></section>
    <section class="case__sec"><h2>Result</h2><div class="case__p"><p>${todo(e.result)}</p></div></section>
    <section class="case__sec"><h2>Tools</h2><div class="case__p"><ul class="tools">${(e.tools || []).map((t) => `<li>${todo(t)}</li>`).join('')}</ul></div></section>`;

  const stills = e.plates ? plateGrid(e.slug, e.plates) : '';

  const compare = e.compare ? compareBlock(e.compare) : '';

  const credits = e.credits ? `<section class="case__sec">
    <h2>Credits</h2>
    <div class="case__p">${creditsDl(e.credits)}</div>
  </section>` : '';

  const tryIt = e.tryIt ? `<section class="cta">
    <h2>Try it</h2>
    <p>${todo(e.tryIt.note)}</p>
    <p><a class="btn" href="${e.tryIt.href}" rel="noopener">${esc(e.tryIt.label)}</a></p>
  </section>` : '';

  const roadmap = e.roadmap ? `<section class="block">
    <div class="block__head"><h2>${esc(e.roadmap.h)}</h2></div>
    <ol class="road">
      ${e.roadmap.items.map(([h, d]) => `<li><h3>${todo(h)}</h3><p>${todo(d)}</p></li>`).join('')}
    </ol>
  </section>` : '';

  const body = `
<article class="case">
  <nav class="crumb" aria-label="Breadcrumb"><a href="/lab/">Lab</a></nav>
  <header class="case__head">
    <h1>${todo(e.title)}</h1>
    <p class="case__tag">${todo(e.desc)}</p>
    <dl class="case__meta">
      <div><dt>Status</dt><dd>${esc(e.state)}</dd></div>
      ${e.year ? `<div><dt>Year</dt><dd>${todo(e.year)}</dd></div>` : ''}
    </dl>
  </header>
  ${hero}
  ${built}
  <div class="case__body">${prose}${credits}</div>
  ${stills}
  ${compare}
  ${tryIt}
  ${roadmap}
  <nav class="pager" aria-label="More experiments">
    <a href="/lab/${prev.slug}/"><span>Previous</span>${todo(prev.title)}</a>
    <a href="/lab/${next.slug}/"><span>Next</span>${todo(next.title)}</a>
  </nav>
</article>
${e.plates ? lightbox() : ''}`;

  return page({
    title: `${e.title.replace(/\[TODO:[^\]]*\]/g, 'Next experiment')} — ${site.name}`,
    desc: e.desc.replace(/\[TODO:[^\]]*\]/g, '').trim() || 'An experiment.',
    current: 'Lab', body, share: e.share, path: `lab/${e.slug}/`
  });
}

function resourcesPage() {
  const body = `
${pageHead('Resources', null)}
<div class="empty empty--page">
  <p class="empty__h">Under construction.</p>
  <p>Workflow files, tutorials and notes from the bench will live here, free and without an email in exchange. Until then, the unfinished versions go up on <a href="${site.github}">GitHub</a> first.</p>
</div>`;

  return page({ title: `Resources — ${site.name}`, desc: 'Workflow files, tutorials and notes from the bench. Under construction.', current: 'Resources', body, path: 'resources/' });
}

/* ── about ─────────────────────────────────────────────────── */

const aboutToggle = (view) => `<div class="abar">
  <nav class="viewtoggle" aria-label="About view">
    <a href="/about/"${view === 'written' ? ' aria-current="page"' : ''}>Written</a>
    <a href="/about/nodes/"${view === 'nodes' ? ' aria-current="page"' : ''}>Nodes</a>
  </nav>
  <a class="btn" href="${about.cvHref === '[TODO: CV link]' ? '#' : about.cvHref}">${esc(about.cvLabel)}${about.cvHref === '[TODO: CV link]' ? ' <span class="todo">[TODO: link]</span>' : ''}</a>
</div>`;

function aboutPage() {
  const body = `
${aboutToggle('written')}
${pageHead(about.h1, null)}

<section class="bio">
  <figure class="portrait">
    ${portraitFrame(about.portrait)}
  </figure>
  <div class="bio__txt">
    <div class="bio__p">${about.bio.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <dl class="spec">
      ${about.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v.map((l) => todo(l)).join('<br>')}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="block">
  <div class="block__head"><h2>Worked with</h2></div>
  <ul class="clients">${clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
</section>

<section class="block">
  <div class="block__head"><h2>Awards and wins</h2></div>
  <table class="awards">
    <thead><tr><th scope="col">Year</th><th scope="col">What</th><th scope="col">Project</th></tr></thead>
    <tbody>${awards.map((a) => `<tr>
      <td>${todo(a.year)}</td>
      <td>${a.href ? `<a href="${esc(a.href)}"${/^http/.test(a.href) ? ' rel="noopener"' : ''}>${todo(a.what)}</a>` : todo(a.what)}</td>
      <td>${todo(a.note)}${a.sub ? `<span class="awards__n">${todo(a.sub)}</span>` : ''}</td>
    </tr>`).join('')}</tbody>
  </table>
</section>

<section class="block">
  <div class="block__head"><h2>Press and publications</h2></div>
  <table class="awards">
    <thead><tr><th scope="col">Year</th><th scope="col">Where</th><th scope="col">What</th></tr></thead>
    <tbody>${press.map((a) => `<tr>
      <td>${todo(a.year)}</td>
      <td>${todo(a.where)}</td>
      <td><a href="${esc(a.href)}" rel="noopener">${todo(a.what)}</a>${a.note ? `<span class="awards__n">${todo(a.note)}</span>` : ''}</td>
    </tr>`).join('')}</tbody>
  </table>
</section>`;

  return page({ title: `About — ${site.name}`, desc: about.bio[0], current: 'About', body, path: 'about/' });
}

function nodesPage() {
  const feeds = {};
  graph.wires.forEach(([a, , b]) => {
    const list = (feeds[a] = feeds[a] || []);
    if (!list.includes(b)) list.push(b);
  });
  const titleOf = (id) => (graph.nodes.find((n) => n.id === id) || {}).title || id;

  /* Inputs on the left, outputs on the right, paired row by row the way a node
     editor stacks them. The socket straddles the node's border because that is
     where a wire lands; the word beside it names what travels down it. */
  const ports = (n) => {
    const ins = n.in || [], outs = n.out || [];
    const rows = Math.max(ins.length, outs.length);
    if (!rows) return '';
    return `<div class="sockets">${Array.from({ length: rows }, (_, i) => `<div class="row sockets__row">
      <span class="sockets__in">${ins[i] ? `<i class="sock" data-in="${esc(ins[i][0])}"></i>${esc(ins[i][1])}` : ''}</span>
      <span class="sockets__out">${outs[i] ? `${esc(outs[i][1])}<i class="sock" data-out="${esc(outs[i][0])}"></i>` : ''}</span>
    </div>`).join('')}</div>`;
  };

  const nodesHtml = graph.nodes.map((n) => `<article class="node node--${n.kind}" id="n-${n.id}" style="--x:${n.x}px;--y:${n.y}px" tabindex="0"
    aria-label="${esc(n.title)} node${feeds[n.id] ? `, feeds ${feeds[n.id].map(titleOf).join(' and ')}` : ''}">
    <div class="node__title"><span class="node__dot"></span><span class="node__name">${esc(n.title)}</span><span class="node__tag">${esc(n.kind)}</span></div>
    <div class="node__body">
      ${ports(n)}
      ${n.rows.map(([k, v]) => `<div class="row field"><span class="field__label">${todo(k)}</span><span class="field__value">${todo(v)}</span></div>`).join('')}
      ${feeds[n.id] ? `<p class="node__f">feeds ${feeds[n.id].map((f) => esc(titleOf(f))).join(', ')}</p>` : ''}
    </div>
  </article>`).join('');

  const body = `
${aboutToggle('nodes')}
<section class="graphwrap nodeui">
  <h1 class="vh">About, as a node graph</h1>
  <p class="graph__hint"><span class="canvasonly">Drag a node and the wires follow. Scroll to zoom, drag the canvas to pan. </span><a href="/about/">Read it as text instead</a>.</p>
  <div class="graphbox" id="graphbox">
    <div class="graph" id="graph" style="--gw:${graph.w}px;--gh:${graph.h}px" data-wires='${JSON.stringify(graph.wires)}'>
      <svg class="graph__wires" viewBox="0 0 ${graph.w} ${graph.h}" aria-hidden="true"></svg>
      ${nodesHtml}
    </div>
    <div class="zoom" role="group" aria-label="Zoom">
      <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
      <button type="button" data-zoom="out" aria-label="Zoom out">\u2212</button>
      <button type="button" data-zoom="fit" aria-label="Fit the whole graph">fit</button>
    </div>
  </div>
</section>`;

  return page({
    title: `About, node view — ${site.name}`,
    desc: 'The same biography as a node graph.',
    current: 'About', body, path: 'about/nodes/',
    script: `\n<script src="${v('/assets/nodes.js')}" defer></script>`
  });
}

/* ── write ─────────────────────────────────────────────────── */

out('index.html', home());
out('work/index.html', workIndexPage());
projects.forEach((p) => out(`work/${p.slug}/index.html`, projectPage(p)));
out('lab/index.html', labPage());
experiments.forEach((e) => out(`lab/${e.slug}/index.html`, experimentPage(e)));
out('resources/index.html', resourcesPage());
out('about/index.html', aboutPage());
out('about/nodes/index.html', nodesPage());

console.log(`built ${6 + projects.length + experiments.length} pages`);
