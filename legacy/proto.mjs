/* Builds the three design directions into /proto.
   node build/proto.mjs */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, statement, pins, projects, experiments, clients, directions } from './proto-content.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const out = (rel, html) => {
  const p = join(ROOT, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, html);
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* [TODO: …] stays visible but reads as deliberately pending */
const todo = (s) => esc(s).replace(/\[TODO:([^\]]*)\]/g, '<span class="todo">[TODO:$1]</span>');

/* Solid grey media placeholder with the final aspect ratio and a label. */
const ph = (label, ratio, extra = '') =>
  `<div class="ph${extra ? ' ' + extra : ''}" style="aspect-ratio:${ratio}" role="img" aria-label="${esc(label)}, placeholder"><span class="ph__l">${esc(label)}</span></div>`;

const head = (dir, title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/proto/${dir}/style.css">
<script src="/proto/${dir}/app.js" defer></script>
</head>`;

const switcher = (cur) => `<nav class="switch" aria-label="Design direction">
  <span class="switch__l">Direction</span>
  ${directions.map((d) => `<a href="/proto/${d.key}/"${d.key === cur ? ' aria-current="page"' : ''}>${esc(d.name)}</a>`).join('')}
  <a href="/proto/">Compare</a>
</nav>`;

const counts = {
  all: projects.length,
  hand: projects.filter((p) => p.made.includes('hand')).length,
  machine: projects.filter((p) => p.made.includes('machine')).length
};

const neighbours = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return { prev: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
};

/* ============================================================
   A · INDEX
   ============================================================ */

const aRail = (cur) => `<aside class="rail">
  <div class="rail__id">
    <p class="id"><a href="/proto/a/">${esc(site.name)}</a></p>
    <p class="id__sub">${esc(site.role)}, ${esc(site.place)}</p>
  </div>
  <nav class="rail__links" aria-label="Contact">
    <a href="mailto:${site.email}">Email</a>
    <a href="${site.linkedin}">LinkedIn</a>
    <a href="${site.github}">GitHub</a>
  </nav>
  <nav class="rail__work" aria-label="Selected work">
    <ol class="index">
      ${projects.map((p) => `<li data-slug="${p.slug}" data-made="${p.made}">
        <a href="/proto/a/work/${p.slug}/"${cur === p.slug ? ' aria-current="page"' : ''}>
          <span class="index__t">${esc(p.title)}</span>
          <span class="index__d">${esc(p.disciplines)}</span>
        </a></li>`).join('')}
    </ol>
  </nav>
  <nav class="rail__links rail__links--end" aria-label="More">
    <a href="/proto/a/#lab">Lab notebook</a>
    <a href="/proto/a/#about">About</a>
  </nav>
</aside>`;

function aHome() {
  const figs = projects.map((p) => `<figure class="fig" data-slug="${p.slug}" data-made="${p.made}">
    <a href="/proto/a/work/${p.slug}/">
      ${ph('Project cover 16:10', '16/10')}
      <figcaption>
        <h3 class="fig__t">${esc(p.title)}</h3>
        <p class="fig__d">${esc(p.tagline)}</p>
        <p class="fig__m"><span>${esc(p.role)}</span><span class="fig__y">${todo(p.year)}</span></p>
      </figcaption>
    </a>
  </figure>`).join('');

  return `${head('a', `${site.name} — ${site.role}`, statement[0].t)}
<body class="dir-a" data-filter="all">
<a class="skip" href="#main">Skip to content</a>
${switcher('a')}
<div class="shell">
${aRail(null)}
<main class="sheet" id="main">
  <section class="intro">
    <h1 class="intro__h">${esc(statement[0].t)}</h1>
    <div class="intro__b">
      ${statement.slice(1).map((s) => `<p>${esc(s.t)}</p>`).join('')}
    </div>
  </section>
  <div class="worklead">
    <h2 id="work-h">Selected work</h2>
    <div class="seg" role="group" aria-labelledby="work-h">
      <button type="button" data-filter="all" aria-pressed="true">All <span class="seg__n">${counts.all}</span></button>
      <button type="button" data-filter="hand" aria-pressed="false">By hand <span class="seg__n">${counts.hand}</span></button>
      <button type="button" data-filter="machine" aria-pressed="false">With machine <span class="seg__n">${counts.machine}</span></button>
    </div>
  </div>
  <section class="figures" aria-labelledby="work-h">${figs}</section>
  <section class="block" id="lab">
    <h2 class="block__h">Lab notebook</h2>
    <p class="block__lead">Things I build to answer a question. Each one gets written up the same way: what I asked, what I built, what came out.</p>
    <ul class="exp">
      ${experiments.map((e) => `<li class="exp__row">
        <span class="exp__t">${todo(e.id)}</span>
        <span class="exp__d">${todo(e.desc)}</span>
        <span class="exp__s" data-state="${e.state.toLowerCase().replace(/\s/g, '-')}">${esc(e.state)}</span>
      </li>`).join('')}
    </ul>
  </section>
  <section class="block" id="about">
    <h2 class="block__h">Worked with</h2>
    <ul class="clients">${clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <p class="block__lead block__lead--end">Previously senior concept artist at Snap and associate art director at Tactical. <a href="mailto:${site.email}">${esc(site.email)}</a></p>
  </section>
  <footer class="foot"><p>${esc(site.place)} <span class="foot__c">${esc(site.coords)}</span></p></footer>
</main>
</div>
</body></html>`;
}

function aCase(p) {
  const { prev, next } = neighbours(p.slug);
  return `${head('a', `${p.title} — ${site.name}`, p.tagline)}
<body class="dir-a dir-a--case" data-filter="all">
<a class="skip" href="#main">Skip to content</a>
${switcher('a')}
<div class="shell">
${aRail(p.slug)}
<main class="sheet" id="main">
  <article class="case">
    <header class="case__head">
      <h1>${esc(p.title)}</h1>
      <p class="case__tag">${esc(p.tagline)}</p>
      <dl class="case__meta">
        <div><dt>Client</dt><dd>${todo(p.client)}</dd></div>
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Disciplines</dt><dd>${esc(p.disciplines)}</dd></div>
        <div><dt>Year</dt><dd>${todo(p.year)}</dd></div>
      </dl>
    </header>
    ${ph('Project hero 16:9', '16/9', 'ph--hero')}
    ${p.summary ? `<section class="case__sum">${p.summary.map(([k, v]) => `<div><h2>${esc(k)}</h2><p>${todo(v)}</p></div>`).join('')}</section>` : ''}
    <div class="case__body">
      ${(p.sections || []).map((s) => `<section class="case__sec">
        <h2>${esc(s.h)}</h2>
        <div class="case__p">${s.p.map((t) => `<p>${todo(t)}</p>`).join('')}</div>
      </section>`).join('')}
      <section class="case__sec">
        <h2>Tools</h2>
        <div class="case__p"><ul class="tools">${p.tools.map((t) => `<li>${todo(t)}</li>`).join('')}</ul></div>
      </section>
      <section class="case__sec">
        <h2>Credits</h2>
        <div class="case__p"><dl class="credits">${(p.credits || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${todo(v)}</dd></div>`).join('')}</dl></div>
      </section>
    </div>
    <div class="stills">${ph('Still 4:5', '4/5')}${ph('Still 4:5', '4/5')}</div>
    <nav class="pager" aria-label="More work">
      <a href="/proto/a/work/${prev.slug}/"><span>Previous</span>${esc(prev.title)}</a>
      <a href="/proto/a/work/${next.slug}/"><span>Next</span>${esc(next.title)}</a>
    </nav>
  </article>
  <footer class="foot"><p>${esc(site.place)} <span class="foot__c">${esc(site.coords)}</span></p></footer>
</main>
</div>
</body></html>`;
}

/* ============================================================
   B · DARKROOM
   ============================================================ */

const bHeader = (cur) => `<header class="top">
  <p class="top__id"><a href="/proto/b/">${esc(site.name)}</a> <span>${esc(site.role.toLowerCase())}, ${esc(site.place.toLowerCase())}</span></p>
  <nav class="top__nav" aria-label="Contact">
    <a href="mailto:${site.email}">email</a>
    <a href="${site.linkedin}">linkedin</a>
    <a href="${site.github}">github</a>
  </nav>
</header>`;

function bHome() {
  const frames = projects.map((p, i) => `<li>
    <button type="button" class="sheet__b" data-i="${i}" aria-label="Frame ${i + 1}, ${esc(p.title)}"${i === 0 ? ' aria-current="true"' : ''}>
      ${ph(`Frame ${i + 1} 16:9`, '16/9')}
    </button></li>`).join('');

  return `${head('b', `${site.name} — ${site.role}`, statement[0].t)}
<body class="dir-b">
<a class="skip" href="#main">Skip to content</a>
${switcher('b')}
${bHeader()}
<main id="main">
  <section class="viewer" aria-label="Showreel">
    <div class="viewer__frame">${ph('Showreel 16:9', '16/9', 'ph--big')}</div>
    <div class="viewer__bar">
      <p class="readout" aria-live="polite">
        <span class="readout__n" data-read="n">1/${projects.length}</span>
        <a class="readout__t" data-read="link" href="/proto/b/work/${projects[0].slug}/">${esc(projects[0].title)}</a>
        <span class="readout__k" data-read="tools">${esc(projects[0].tools.join(', '))}</span>
      </p>
      <label class="scrub">
        <span class="vh">Showreel frame</span>
        <input type="range" min="1" max="${projects.length}" step="1" value="1" id="scrub">
      </label>
    </div>
    <ol class="sheet" aria-label="All frames">${frames}</ol>
  </section>

  <section class="say">
    ${statement.map((s, i) => `<p${i === 0 ? ' class="say__first"' : ''}>${esc(s.t)}</p>`).join('')}
  </section>

  <section class="work" aria-labelledby="work-h">
    <h2 id="work-h" class="h">Selected work</h2>
    ${projects.map((p) => `<article class="row">
      <a class="row__media" href="/proto/b/work/${p.slug}/" tabindex="-1" aria-hidden="true">${ph('Project cover 16:10', '16/10')}</a>
      <div class="row__txt">
        <h3><a href="/proto/b/work/${p.slug}/">${esc(p.title)}</a></h3>
        <p class="row__d">${esc(p.tagline)}</p>
        <p class="row__m">${todo(p.client)}</p>
        <p class="row__m">${esc(p.role)}, ${todo(p.year)}</p>
        <p class="row__k">${p.tools.map((t) => todo(t)).join(', ')}</p>
      </div>
    </article>`).join('')}
  </section>

  <section class="work" aria-labelledby="lab-h">
    <h2 id="lab-h" class="h">Lab notebook</h2>
    <ul class="exp">
      ${experiments.map((e) => `<li class="exp__row">
        <span class="exp__t">${todo(e.id)}</span>
        <span class="exp__d">${todo(e.desc)}</span>
        <span class="exp__s" data-state="${e.state.toLowerCase().replace(/\s/g, '-')}">${esc(e.state.toLowerCase())}</span>
      </li>`).join('')}
    </ul>
  </section>
</main>
<footer class="foot">
  <p>previously senior concept artist at snap, associate art director at tactical.</p>
  <p><a href="mailto:${site.email}">${esc(site.email)}</a></p>
  <p>${esc(site.place.toLowerCase())} <span>${esc(site.coords)}</span></p>
</footer>
<script id="frames" type="application/json">${JSON.stringify(projects.map((p) => ({ t: p.title, s: p.slug, k: p.tools.join(', ') })))}</script>
</body></html>`;
}

function bCase(p) {
  const { prev, next } = neighbours(p.slug);
  return `${head('b', `${p.title} — ${site.name}`, p.tagline)}
<body class="dir-b">
<a class="skip" href="#main">Skip to content</a>
${switcher('b')}
${bHeader()}
<main id="main">
  <article class="case">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/proto/b/">all work</a></nav>
    <header class="case__head">
      <h1>${esc(p.title)}</h1>
      <p class="case__tag">${esc(p.tagline)}</p>
    </header>
    ${ph('Project hero 16:9', '16/9', 'ph--big')}
    <div class="case__cols">
      <div class="case__side">
        <dl class="meta">
          <div><dt>client</dt><dd>${todo(p.client)}</dd></div>
          <div><dt>role</dt><dd>${esc(p.role.toLowerCase())}</dd></div>
          <div><dt>year</dt><dd>${todo(p.year)}</dd></div>
          <div><dt>tools</dt><dd>${p.tools.map((t) => todo(t)).join('<br>')}</dd></div>
          ${(p.credits || []).map(([k, v]) => `<div><dt>${esc(k.toLowerCase())}</dt><dd>${todo(v)}</dd></div>`).join('')}
        </dl>
      </div>
      <div class="case__main">
        ${p.summary ? `<dl class="sum">${p.summary.map(([k, v]) => `<div><dt>${esc(k.toLowerCase())}</dt><dd>${todo(v)}</dd></div>`).join('')}</dl>` : ''}
        ${(p.sections || []).map((s) => `<section class="case__sec"><h2>${esc(s.h.toLowerCase())}</h2>${s.p.map((t) => `<p>${todo(t)}</p>`).join('')}</section>`).join('')}
      </div>
    </div>
    <div class="stills">${ph('Still 4:5', '4/5')}${ph('Still 4:5', '4/5')}</div>
    <nav class="pager" aria-label="More work">
      <a href="/proto/b/work/${prev.slug}/"><span>previous</span>${esc(prev.title)}</a>
      <a href="/proto/b/work/${next.slug}/"><span>next</span>${esc(next.title)}</a>
    </nav>
  </article>
</main>
<footer class="foot"><p><a href="mailto:${site.email}">${esc(site.email)}</a></p></footer>
</body></html>`;
}

/* ============================================================
   C · STATEMENT
   ============================================================ */

function cStatement() {
  return statement.map((s, i) => {
    let t = esc(s.t);
    pins.filter((p) => p.sentence === i).forEach((p) => {
      const needle = esc(p.phrase);
      t = t.replace(needle, `<a class="pin" href="/proto/c/work/${p.slug}/" data-slug="${p.slug}">${needle}</a>`);
    });
    return `<p>${t}</p>`;
  }).join('');
}

const cHeader = () => `<header class="top">
  <p class="top__id"><a href="/proto/c/">${esc(site.name)}</a></p>
  <p class="top__r">${esc(site.role)}, ${esc(site.place)}</p>
  <nav class="top__nav" aria-label="Contact">
    <a href="mailto:${site.email}">Email</a>
    <a href="${site.linkedin}">LinkedIn</a>
    <a href="${site.github}">GitHub</a>
  </nav>
</header>`;

function cHome() {
  return `${head('c', `${site.name} — ${site.role}`, statement[0].t)}
<body class="dir-c">
<a class="skip" href="#main">Skip to content</a>
${switcher('c')}
${cHeader()}
<main id="main">
  <section class="say">
    <h1 class="vh">${esc(site.name)}, ${esc(site.role.toLowerCase())}</h1>
    <div class="say__t">${cStatement()}</div>
    <figure class="finder" data-default="Showreel 16:9">
      <div class="finder__box">${ph('Showreel 16:9', '16/9')}</div>
      <figcaption class="finder__cap" data-cap>The reel. Point at a phrase to see the work behind it.</figcaption>
    </figure>
  </section>

  <section class="ledger" aria-labelledby="work-h">
    <h2 id="work-h">Selected work</h2>
    <ol class="ledger__list">
      ${projects.map((p) => `<li>
        <a href="/proto/c/work/${p.slug}/">
          <span class="ledger__t">${esc(p.title)}</span>
          <span class="ledger__d">${esc(p.tagline)}</span>
          <span class="ledger__m">${todo(p.client)}</span>
          <span class="ledger__r">${esc(p.role)}</span>
          <span class="ledger__y">${todo(p.year)}</span>
        </a></li>`).join('')}
    </ol>
  </section>

  <section class="ledger" aria-labelledby="lab-h">
    <h2 id="lab-h">Lab notebook</h2>
    <ul class="exp">
      ${experiments.map((e) => `<li class="exp__row">
        <span class="exp__t">${todo(e.id)}</span>
        <span class="exp__d">${todo(e.desc)}</span>
        <span class="exp__s" data-state="${e.state.toLowerCase().replace(/\s/g, '-')}">${esc(e.state)}</span>
      </li>`).join('')}
    </ul>
  </section>

  <section class="ledger" aria-labelledby="with-h">
    <h2 id="with-h">Worked with</h2>
    <ul class="clients">${clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
  </section>
</main>
<footer class="foot">
  <p>Previously senior concept artist at Snap, associate art director at Tactical.</p>
  <p><a href="mailto:${site.email}">${esc(site.email)}</a></p>
  <p>${esc(site.place)} <span>${esc(site.coords)}</span></p>
</footer>
</body></html>`;
}

function cCase(p) {
  const { prev, next } = neighbours(p.slug);
  return `${head('c', `${p.title} — ${site.name}`, p.tagline)}
<body class="dir-c">
<a class="skip" href="#main">Skip to content</a>
${switcher('c')}
${cHeader()}
<main id="main">
  <article class="case">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/proto/c/">All work</a></nav>
    <h1>${esc(p.title)}</h1>
    <p class="case__tag">${esc(p.tagline)}</p>
    ${ph('Project hero 16:9', '16/9')}
    <div class="track">
      <div class="track__made">
        ${p.summary ? `<section class="case__sec"><h2>What it is</h2>${p.summary.map(([k, v]) => `<p><b>${esc(k)}.</b> ${todo(v)}</p>`).join('')}</section>` : ''}
        ${(p.sections || []).map((s) => `<section class="case__sec"><h2>${esc(s.h)}</h2>${s.p.map((t) => `<p>${todo(t)}</p>`).join('')}</section>`).join('')}
        <div class="stills">${ph('Still 4:5', '4/5')}${ph('Still 4:5', '4/5')}</div>
      </div>
      <aside class="track__how" aria-label="How it was made">
        <dl class="mech">
          <div><dt>client</dt><dd>${todo(p.client)}</dd></div>
          <div><dt>role</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>year</dt><dd>${todo(p.year)}</dd></div>
          <div><dt>disciplines</dt><dd>${esc(p.disciplines)}</dd></div>
          <div><dt>tools</dt><dd>${p.tools.map((t) => todo(t)).join('<br>')}</dd></div>
          ${(p.credits || []).map(([k, v]) => `<div><dt>${esc(k.toLowerCase())}</dt><dd>${todo(v)}</dd></div>`).join('')}
        </dl>
        <p class="mech__n">${esc(p.note)}</p>
      </aside>
    </div>
    <nav class="pager" aria-label="More work">
      <a href="/proto/c/work/${prev.slug}/"><span>Previous</span>${esc(prev.title)}</a>
      <a href="/proto/c/work/${next.slug}/"><span>Next</span>${esc(next.title)}</a>
    </nav>
  </article>
</main>
<footer class="foot"><p><a href="mailto:${site.email}">${esc(site.email)}</a></p></footer>
</body></html>`;
}

/* ============================================================
   Index of directions
   ============================================================ */

function compare() {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Three directions — ${esc(site.name)}</title>
<link rel="stylesheet" href="/proto/compare.css">
</head><body>
<main>
  <h1>Three directions</h1>
  <p class="lead">Same content in all three, so the comparison is about design. Each has a homepage and seven project pages.</p>
  <ol class="dirs">
    ${directions.map((d) => `<li>
      <h2><a href="/proto/${d.key}/">${esc(d.name)}</a></h2>
      <p>${esc(d.blurb)}</p>
      <p class="links"><a href="/proto/${d.key}/">Homepage</a> <a href="/proto/${d.key}/work/lexus/">Project page</a></p>
    </li>`).join('')}
  </ol>
  <p class="foot">The current site is still at <a href="/">/</a>.</p>
</main>
</body></html>`;
}

/* ---- write ---- */
out('proto/index.html', compare());
out('proto/a/index.html', aHome());
out('proto/b/index.html', bHome());
out('proto/c/index.html', cHome());
projects.forEach((p) => {
  out(`proto/a/work/${p.slug}/index.html`, aCase(p));
  out(`proto/b/work/${p.slug}/index.html`, bCase(p));
  out(`proto/c/work/${p.slug}/index.html`, cCase(p));
});
console.log(`built ${3 + 1 + projects.length * 3} pages`);
