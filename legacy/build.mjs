import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const projects = read('content/projects.json');
const facts    = read('content/facts.json');
const skills   = read('content/skills.json');
const lab      = read('content/lab.json');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* placeholders stay visible, but read as deliberately pending */
const ph = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="pending">[$1]</span>');
const para = (s) => ph(s).split('\n').filter(Boolean).map((l) => `<p>${l}</p>`).join('');

/* ---- per-project presentation metadata (not in the content file) ---- */
const PRES = {
  'lexus':          { family: 'wave',       tags: 'ai-video',    client: 'Lexus — internal R&D' },
  'nike':           { family: 'hatch',      tags: 'ai-video',    client: 'Nike — internal R&D' },
  'visit-dubai':    { family: 'grid',       tags: 'ar-vr',       client: 'Visit Dubai, with Tactical' },
  'fish-and-cat':   { family: 'concentric', tags: 'ai-video',    client: 'Self-initiated' },
  'jurassic-world': { family: 'facet',      tags: '3d ar-vr',    client: 'Universal Pictures, with Pretty Big Monster' },
  'smurfs':         { family: 'facet',      tags: '3d',          client: 'Paramount Animation, with Pretty Big Monster' },
  'mdlbeast':       { family: 'grid',       tags: 'ar-vr',       client: 'MDLBEAST, Tactical with Snapchat' }
};
const metaOf = (p, k) => (p.meta.find((m) => m.k === k) || {}).v || '';
const roleLine = (p) => {
  const role = metaOf(p, 'ROLE'), year = metaOf(p, 'YEAR');
  return [role, year].filter(Boolean).join(', ');
};

const MARK = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1"/>
<path d="M12 0.5v23M0.5 12h23" stroke="currentColor" stroke-width="1" opacity=".5"/>
<path d="M12 8A4 4 0 0 0 12 16Z" fill="var(--sanguine)"/>
<path d="M12 8A4 4 0 0 1 12 16Z" fill="var(--cyanotype)"/>
</svg>`;

const NAV = [
  ['work', '/work/'], ['lab', '/lab/'], ['resources', '/resources/'], ['about', '/about/']
];

function layout({ title, desc, current, body, back }) {
  const nav = NAV.map(([label, href]) =>
    `<a href="${href}"${current === label ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="/assets/site.css">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<script type="module" src="/assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="topbar__in">
    <span style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
      <a class="mark" href="/">${MARK}<span class="mark__name">Artem Maslov</span></a>
      ${back ? `<a class="back" href="${back.href}"><svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true" fill="none" stroke="currentColor"><path d="M13 4H1M4.5 1 1 4l3.5 3"/></svg>${esc(back.label)}</a>` : ''}
    </span>
    <nav class="nav" aria-label="Sections">
        ${nav}
    </nav>
  </div>
</div>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="foot__in">
    <span>AI art director and creative technologist. Edmonton, Alberta <span class="num">53.5461&deg;&thinsp;N, 113.4938&deg;&thinsp;W</span></span>
    <span class="foot__links">
      <a href="mailto:artem@artmaslov.com">artem@artmaslov.com</a>
      <a href="https://www.linkedin.com/in/maslov-artem/">LinkedIn</a>
      <a href="https://github.com/artymaslov">GitHub</a>
      <span>&copy; 2026</span>
    </span>
  </div>
</footer>
</body>
</html>
`;
}

const write = (p, html) => {
  const full = join(ROOT, p);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  console.log('  ' + p);
};

const CLIENTS = ['Dior', 'Nike', 'Amazon', 'L’Oréal', 'Cartier', 'Snap Inc.',
                 'Universal Pictures', 'Paramount Animation', 'Olympic Games'];

const stateClass = (s) => s.includes('SHIPPED') ? 'shipped' : s.includes('DEMO') ? 'demo'
                        : s.includes('WINNER') ? 'winner' : 'open';
const stateLabel = (s) => s.replace(/^[^A-Za-z[]*/, '').toLowerCase();

/* ============================================================
   HOME
   ============================================================ */
function home() {
  const recent = ['lexus', 'nike', 'fish-and-cat'].map((slug) => {
    const p = projects.find((x) => x.slug === slug), pres = PRES[slug];
    return `<a class="recent__item" href="/work/${slug}/">
        <figure class="plate"><canvas data-plate="${slug}" data-family="${pres.family}" width="420" height="300" style="aspect-ratio:7/5"></canvas></figure>
        <h3>${ph(p.title)}</h3>
        <span class="key">${ph(roleLine(p))}</span>
      </a>`;
  }).join('\n      ');

  const exps = lab.experiments.map((e) => `<div class="exprow">
        <span class="exprow__t">${ph(e.title)}</span>
        <span class="state state--${stateClass(e.status)}">${ph(stateLabel(e.status))}</span>
        <span class="exprow__d">${ph(e.desc)}</span>
      </div>`).join('\n      ');

  const body = `
<section class="hero wrap">
  <div class="hero__grid">
    <div>
      <h1><span class="hand">Trained by hand.</span><span class="machine">Extended by machine.</span></h1>
      <div class="hero__body prose">
        <p>For nine years I made images by hand — concept art at Snap, 3D and art direction for Dior, Nike and the Olympic Games. Since 2024 I build the pipelines that make them, and I measure what comes out.</p>
      </div>
      <div class="hero__cta">
        <a class="btn" href="/work/">See the work</a>
        <a class="btn-quiet" href="/lab/">Read the lab notes</a>
      </div>
    </div>

    <figure class="instr">
      <div class="instr__plate plate"><canvas id="interference" width="900" height="620"></canvas></div>
      <div class="instr__bar">
        <span class="instr__ends">
          <span class="instr__end instr__end--a">drawn <span class="num" data-read="a">1.00</span></span>
          <input id="mix" type="range" min="0" max="1" step="0.005" value="0.78"
                 aria-label="Mix the hand-drawn field with the machine-ruled field">
          <span class="instr__end instr__end--b">computed <span class="num" data-read="b">0.00</span></span>
        </span>
      </div>
      <figcaption class="cap"><b>fig. 1</b> &mdash; two line systems, one wandering and one ruled. Move the control: the moir&eacute; only appears once the hand stops wandering. Neither field contains it alone.</figcaption>
    </figure>
  </div>
</section>

<section class="section wrap">
  <p class="note" style="margin-bottom:1rem">worked with</p>
  <ul class="clients">${CLIENTS.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
</section>

<section class="section wrap">
  <div class="ledger">

    <div class="lrow">
      <div class="lrow__head">
        <h2><a href="/work/">Selected client work</a></h2>
        <p class="lrow__desc">AI video, 3D, AR and immersive production for brands, studios and film.</p>
        <a class="link ui" href="/work/">All seven projects</a>
      </div>
      <div class="recent">
      ${recent}
      </div>
    </div>

    <div class="lrow">
      <div class="lrow__head">
        <h2><a href="/lab/">The lab notebook</a></h2>
        <p class="lrow__desc">Pipelines and experiments, each written up the same way: question, method, result.</p>
        <a class="link ui" href="/lab/#playground">Playground &mdash; nothing on the bench yet</a>
      </div>
      <div class="explist">
      ${exps}
      </div>
    </div>

    <div class="lrow lrow--split">
      <div class="quiet">
        <h2><a href="/resources/">Take what&rsquo;s useful</a></h2>
        <p class="lrow__desc">Workflow files, tutorials and notes from the bench. Free to use.</p>
        <a class="link ui" href="/resources/">Browse the shelf</a>
      </div>
      <div class="quiet">
        <h2><a href="/about/">About</a></h2>
        <p class="lrow__desc">Nine years of practice, a skill map before and after AI, and a CV.</p>
        <span class="ui"><a class="link" href="/about/">Read it</a> <span style="color:var(--ink-3)">or</span> <a class="link" href="/about/nodes/">open it as a node graph</a></span>
      </div>
    </div>

  </div>
</section>`;

  write('index.html', layout({
    title: 'Artem Maslov — AI art director and creative technologist',
    desc: 'Trained by hand, extended by machine. AI video, 3D, AR and generative pipelines. Edmonton, Alberta.',
    current: null, body
  }));
}

/* ============================================================
   WORK
   ============================================================ */
function work() {
  const rows = projects.map((p) => {
    const pres = PRES[p.slug];
    const isCase = p.layout === 'case-study';
    return `<a class="wrow" href="/work/${p.slug}/" data-tags="${pres.tags}">
      <figure class="plate"><canvas data-plate="${p.slug}" data-family="${pres.family}" width="520" height="330" style="aspect-ratio:16/10"></canvas></figure>
      <span class="wrow__mid">
        <span class="wrow__tag${isCase ? ' wrow__tag--case' : ''}">${isCase ? 'case study' : 'project note'}</span>
        <span class="wrow__title">${ph(p.title)}</span>
        <span class="val">${ph(pres.client)}</span>
      </span>
      <span class="wrow__mid">
        <span class="key">${ph(roleLine(p))}</span>
        <span class="val" style="max-width:24ch">${ph(p.tagline)}</span>
      </span>
    </a>`;
  }).join('\n    ');

  const body = `
<section class="wrap" style="padding-top:clamp(2.5rem,6vw,5rem)">
  <h1>Selected client work</h1>
  <p class="lead" style="margin-top:1.25rem">AI video, 3D, AR and immersive production for Dior, Nike, Amazon, L&rsquo;Or&eacute;al, Cartier, Snap, Universal Pictures, Paramount Animation and the Olympic Games.</p>
</section>

<section class="wrap" style="margin-top:clamp(2.5rem,5vw,4rem)">
  <div class="filterbar" data-filterbar=".worklist" role="group" aria-label="Filter by discipline">
    <button data-tag="all" aria-pressed="true">all</button>
    <button data-tag="ai-video" aria-pressed="false">ai video</button>
    <button data-tag="3d" aria-pressed="false">3d</button>
    <button data-tag="ar-vr" aria-pressed="false">ar &amp; vr</button>
    <span class="filterbar__count num" aria-live="polite"></span>
  </div>
  <div class="worklist">
    ${rows}
  </div>
</section>

<section class="section wrap">
  <div class="callout">
    <div>
      <h2 style="font-size:1.6rem">Need work against a specific brief?</h2>
      <p class="val" style="margin-top:.5rem">I put a tailored deck together per client, with the closest references and what it would take.</p>
    </div>
    <a class="btn" href="mailto:artem@artmaslov.com?subject=Brief">Request a deck</a>
  </div>
</section>`;

  write('work/index.html', layout({
    title: 'Work — Artem Maslov',
    desc: 'Selected client work in AI video, 3D, AR and immersive production, 2016—2026.',
    current: 'work', body
  }));
}

/* ============================================================
   PROJECT PAGE  (one template, two layouts)
   ============================================================ */
function projectPage(p, prev, next) {
  const pres = PRES[p.slug];
  const isCase = p.layout === 'case-study';

  const meta = p.meta.map((m) => `<div><span class="key">${esc(m.k.toLowerCase())}</span><span class="val">${ph(m.v)}</span></div>`).join('');

  const overview = isCase && p.overview ? `
<section class="section wrap">
  <div class="overview">
    ${p.overview.map((o) => `<div><h3>${esc(o.k === 'MADE' ? 'What it is' : o.k === 'NEED' ? 'Why it existed' : 'What it was worth')}</h3><p>${ph(o.v)}</p></div>`).join('\n    ')}
  </div>
</section>` : '';

  const toolsN = String(p.sections.length + 1).padStart(2, '0');
  const steps = p.sections.map((s) => `<div class="step">
      <div><span class="step__n num">${esc(s.n)}</span><h2>${esc(s.h)}</h2></div>
      <div class="step__body prose">${para(s.body)}</div>
    </div>`).join('\n    ');

  const body = `
<section class="case__hero wrap">
  <p class="note">${isCase ? 'case study' : 'project note'}</p>
  <h1 class="case__title" style="margin-top:.6rem">${ph(p.title)}</h1>
  <p class="case__tag">${ph(p.tagline)}</p>
  <div class="case__meta">${meta}</div>
</section>

<section class="wrap" style="margin-top:clamp(2rem,4vw,3.25rem)">
  <figure class="plate"><canvas data-plate="${p.slug}" data-family="${pres.family}" width="1200" height="675" style="aspect-ratio:16/9"></canvas></figure>
  <figcaption class="cap"><b>fig. 1</b> &mdash; <span class="pending">[hero film or key visual]</span></figcaption>
</section>
${overview}

<section class="section wrap">
  <div class="steps">
    ${steps}
    <div class="step">
      <div><span class="step__n num">${toolsN}</span><h2>Tools</h2></div>
      <div><ul class="chips">${p.tools.map((t) => `<li>${ph(t)}</li>`).join('')}</ul></div>
    </div>
    <div class="step">
      <div><h2>Credits</h2></div>
      <div>
        <dl class="data" style="max-width:34rem">
          ${p.credits.map((c) => `<dt>${esc(c.k.toLowerCase())}</dt><dd>${ph(c.v)}</dd>`).join('\n          ')}
        </dl>
      </div>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="stills">
    <figure><div class="plate"><div class="plate__well" style="aspect-ratio:4/5">still</div></div><figcaption class="cap"><b>fig. 2</b> &mdash; <span class="pending">[still]</span></figcaption></figure>
    <figure><div class="plate"><div class="plate__well" style="aspect-ratio:4/5">still</div></div><figcaption class="cap"><b>fig. 3</b> &mdash; <span class="pending">[still]</span></figcaption></figure>
  </div>
</section>

<section class="section wrap">
  <div class="pager">
    <a href="/work/${prev.slug}/"><span class="key">previous</span><h3>${ph(prev.title)}</h3></a>
    <a class="pager--next" href="/work/${next.slug}/"><span class="key">next</span><h3>${ph(next.title)}</h3></a>
  </div>
</section>`;

  write(`work/${p.slug}/index.html`, layout({
    title: `${p.title} — Artem Maslov`,
    desc: p.tagline.replace(/\[|\]/g, ''),
    current: 'work', back: { href: '/work/', label: 'work' }, body
  }));
}

/* ============================================================
   LAB
   ============================================================ */
function labPage() {
  const featured = lab.experiments[0];
  const rest = lab.experiments.slice(1);

  const rows = rest.map((e) => `<div class="exprow">
        <span class="exprow__t">${ph(e.title)}</span>
        <span class="state state--${stateClass(e.status)}">${ph(stateLabel(e.status))}</span>
        <span class="exprow__d">${ph(e.desc)}</span>
      </div>`).join('\n      ');

  const body = `
<section class="wrap" style="padding-top:clamp(2.5rem,6vw,5rem)">
  <h1>Hypothesis, build, measure</h1>
  <p class="lead" style="margin-top:1.25rem">Tools, pipelines and experiments where art direction meets code. Every entry is written up the same way, so the ones that failed are as readable as the ones that shipped.</p>
</section>

<section class="section wrap">
  <div class="feature">
    <figure style="margin:0">
      <div class="plate"><canvas data-plate="exp-001-jewelry" data-family="concentric" width="760" height="570" style="aspect-ratio:4/3"></canvas></div>
      <figcaption class="cap"><b>fig. 1</b> &mdash; multi-workflow generation graph with perceptual quality gates (LPIPS, SSIM).</figcaption>
    </figure>
    <div>
      <p class="note">experiment 001, the one in production</p>
      <h2 style="margin-top:.5rem">${ph(featured.title)}</h2>
      <dl class="qmr">
        <div><dt>question</dt><dd>Can a generative pipeline hold product fidelity tightly enough for jewellery, where every facet matters?</dd></div>
        <div><dt>method</dt><dd>ComfyUI workflows behind a mode switch, with perceptual-similarity checks rejecting any frame that drifts.</dd></div>
        <div><dt>result</dt><dd><span class="pending">[Outcome in one line]</span></dd></div>
      </dl>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.5rem;align-items:center">
        <span class="state state--shipped">shipped mvp</span>
        <ul class="chips" style="margin-left:auto"><li>ComfyUI</li><li>Python</li><li>LPIPS / SSIM</li></ul>
      </div>
    </div>
  </div>
</section>

<section class="section section--rule wrap">
  <div class="section__head">
    <h2>Everything else on the bench</h2>
    <span class="key num">${rest.length} entries</span>
  </div>
  <div class="explist" style="border-top:1px solid var(--ink)">
      ${rows}
  </div>
</section>

<section class="section section--rule wrap" id="playground">
  <div class="section__head">
    <h2>Playground</h2>
    <span class="key">no write-up, just play</span>
  </div>
  <div class="empty">
    <p class="note">nothing on the bench yet</p>
    <p class="prose" style="font-size:var(--fs-lead);line-height:1.5">The first toy will be Face Pong: the paddles are photographs of my face, and the expression changes on every hit. It will run in the browser, and the source will be open.</p>
    <a class="btn-quiet" href="https://github.com/artymaslov">Watch the repo</a>
  </div>
</section>`;

  write('lab/index.html', layout({
    title: 'Lab — Artem Maslov',
    desc: 'Generative pipelines, tools and experiments, each written up as a lab note: question, method, result.',
    current: 'lab', body
  }));
}

/* ============================================================
   RESOURCES
   ============================================================ */
const RESOURCES = [
  { type: 'files',     glyph: '{ }', title: '[ComfyUI workflow]',   sub: 'json · [size]',   act: 'Download' },
  { type: 'tutorials', glyph: '▶',   title: '[Tutorial title]',     sub: 'video · [length]',act: 'Watch' },
  { type: 'tips',      glyph: '✳',   title: '[Tip title]',          sub: '[read time]',     act: 'Read' },
  { type: 'articles',  glyph: '¶',   title: '[Article title]',      sub: '[date]',          act: 'Read' },
  { type: 'files',     glyph: '◇',   title: '[Blender scene]',      sub: 'blend · [size]',  act: 'Download' },
  { type: 'tutorials', glyph: '▶',   title: '[Tutorial title]',     sub: 'video · [length]',act: 'Watch' },
  { type: 'tips',      glyph: '✳',   title: '[Tip title]',          sub: '[read time]',     act: 'Read' },
  { type: 'files',     glyph: '▤',   title: '[Project template]',   sub: 'zip · [size]',    act: 'Download' }
];

function resources() {
  const rows = RESOURCES.map((r) => `<div class="resrow" data-tags="${r.type}">
      <span class="resrow__glyph" aria-hidden="true">${esc(r.glyph)}</span>
      <span>
        <h3>${ph(r.title)}</h3>
        <span class="resrow__sub">${ph(r.sub)}</span>
      </span>
      <span class="resrow__act">${esc(r.act)}</span>
    </div>`).join('\n    ');

  const body = `
<section class="wrap" style="padding-top:clamp(2.5rem,6vw,5rem)">
  <h1>Take what&rsquo;s useful</h1>
  <p class="lead" style="margin-top:1.25rem">Workflow files, tutorials, tips and articles from the bench. Free to use in your own work; a credit is welcome but not required.</p>
</section>

<section class="wrap" style="margin-top:clamp(2.5rem,5vw,4rem)">
  <div class="filterbar" data-filterbar=".reslist" role="group" aria-label="Filter by kind">
    <button data-tag="all" aria-pressed="true">all</button>
    <button data-tag="files" aria-pressed="false">files</button>
    <button data-tag="tutorials" aria-pressed="false">tutorials</button>
    <button data-tag="tips" aria-pressed="false">tips</button>
    <button data-tag="articles" aria-pressed="false">articles</button>
    <span class="filterbar__count num" aria-live="polite"></span>
  </div>
  <div class="reslist">
    ${rows}
  </div>
  <p class="cap" style="margin-top:1.25rem">Eight entries are reserved and not yet published. The bracketed fields are waiting on content.</p>
</section>

<section class="section wrap">
  <div class="callout">
    <div>
      <h2 style="font-size:1.6rem">New files land here first</h2>
      <p class="val" style="margin-top:.5rem">Follow along on GitHub to catch the next drop.</p>
    </div>
    <a class="btn" href="https://github.com/artymaslov">Follow on GitHub</a>
  </div>
</section>`;

  write('resources/index.html', layout({
    title: 'Resources — Artem Maslov',
    desc: 'Workflow files, tutorials, tips and articles from the bench.',
    current: 'resources', body
  }));
}

/* ============================================================
   ABOUT — classic
   ============================================================ */
const NODE_ICON = `<svg width="15" height="11" viewBox="0 0 16 12" aria-hidden="true" fill="none" stroke="currentColor"><rect x=".5" y=".5" width="5" height="5" rx="1"/><rect x="10.5" y="6.5" width="5" height="5" rx="1"/><path d="M5.5 3C8 3 8 9 10.5 9"/></svg>`;

const HEART = `<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.4-9.1C1.1 7.9 3.3 4.6 6.7 4.6c2.1 0 3.8 1.2 5.3 3 1.5-1.8 3.2-3 5.3-3 3.4 0 5.6 3.3 4.1 6.8-1.9 4.5-9.4 9.1-9.4 9.1z"/></svg>`;

function viewToggle(current) {
  return `<nav class="viewtoggle" aria-label="About view">
      <a href="/about/"${current === 'classic' ? ' aria-current="page"' : ''}>written</a>
      <a href="/about/nodes/"${current === 'nodes' ? ' aria-current="page"' : ''}>${NODE_ICON}graph</a>
    </nav>`;
}

function about() {
  const spec = [
    ['role', 'AI art director and creative technologist'],
    ['practice', 'AI video, 3D, AR and VR, immersive'],
    ['previously', 'Tactical, Rotterdam · ARNI Studio, founder · Snap Inc.'],
    ['teaching', 'NAIT — Visual Assets for Games'],
    ['education', 'BFA, Odesa State Academy of Civil Engineering and Architecture']
  ].map(([k, v]) => `<dt>${esc(k)}</dt><dd>${ph(v)}</dd>`).join('\n          ');

  const rows = skills.skills.map((s) => `<div class="dumb__row" data-skill data-a="${s.before}" data-b="${s.after}">
        <span class="dumb__label">${esc(s.label)}</span>
        <span class="dumb__track"><span class="dumb__span"></span><span class="dumb__a"></span><span class="dumb__b"></span></span>
        <span class="dumb__v">${s.before} to ${s.after}</span>
      </div>`).join('\n      ');

  const simple = facts.filter((f) => !f.lessons);
  const wide = facts.find((f) => f.lessons);

  const factCards = simple.map((f) => `<article class="fact">
        <p>${ph(f.text)}</p>
        <button class="like" data-fact="${f.id}" aria-pressed="false">${HEART}<span class="like__t">like</span></button>
      </article>`).join('\n      ');

  const lessonRows = wide.lessons.map((l) => {
    const code = { Ukraine: 'ua', Montenegro: 'me', Portugal: 'pt', Netherlands: 'nl', Canada: 'ca' }[l.country] || '';
    return `<div><span class="key">${esc(code)}</span><b>${esc(l.country)}</b><span class="val">${ph(l.lesson)}</span></div>`;
  }).join('\n          ');

  const awards = [
    ['2025', 'Meta Horizon Mobile Innovation Hackathon', 'winner'],
    ['[Year]', '[Award or festival]', '[Result]'],
    ['[Year]', '[Award or festival]', '[Result]']
  ].map(([y, t, r], i) => `<div>
        <span class="awards__y num">${ph(y)}</span>
        <span class="awards__t">${ph(t)}</span>
        <span class="${i === 0 ? 'state state--winner' : 'key'}">${ph(r)}</span>
      </div>`).join('\n      ');

  const body = `
<section class="wrap" style="padding-top:clamp(2rem,4vw,3rem)">
  <div style="display:flex;gap:1rem 1.5rem;flex-wrap:wrap;align-items:center;justify-content:space-between">
    ${viewToggle('classic')}
    <a class="btn" href="#" data-cv>Download CV (PDF)</a>
  </div>
</section>

<section class="wrap" style="margin-top:clamp(2.5rem,5vw,4rem)">
  <div class="bio">
    <div>
      <h1>Trained by hand.<span class="machine">Extended by machine.</span></h1>
      <div class="prose" style="margin-top:1.75rem;font-size:var(--fs-lead);line-height:1.52">
        <p>I&rsquo;m Artem Maslov, an AI art director and creative technologist in Edmonton. For nine years I made images for brands, studios and platforms: concept art at Snap, my own studio ARNI, art direction at Tactical in Rotterdam.</p>
        <p>Then a second instrument arrived. Today I write code, build generative pipelines, and approach creative problems the way a lab does &mdash; a question, a test, a measurement. This site holds both versions of me.</p>
      </div>
    </div>
    <div>
      <figure style="margin:0">
        <div class="plate"><div class="plate__well" style="aspect-ratio:4/5">portrait</div></div>
        <figcaption class="cap">specimen: A. Maslov, Edmonton AB</figcaption>
      </figure>
      <dl class="data" style="margin-top:1.75rem">
          ${spec}
      </dl>
    </div>
  </div>
</section>

<section class="section section--rule wrap">
  <div class="section__head">
    <h2>Skills, before and after</h2>
    <span class="legend">
      <span><i class="a"></i>2016&ndash;2023, by hand</span>
      <span><i class="b"></i>2024 onward, with machine</span>
    </span>
  </div>
  <div class="dumb">
      ${rows}
    <div class="dumb__axis" aria-hidden="true">
      <span></span>
      <span><i style="left:4%">0 none</i><i style="left:50%">5 working</i><i style="left:96%">10 expert</i></span>
      <span></span>
    </div>
  </div>
  <p class="cap" style="margin-top:1.75rem">Self-assessed, 0 to 10. <span class="pending">[Sample values — set your own before launch]</span></p>
</section>

<section class="section section--rule wrap">
  <h2 style="margin-bottom:clamp(1.5rem,3vw,2.5rem)">Awards and wins</h2>
  <div class="awards">
      ${awards}
  </div>
</section>

<section class="section section--rule wrap">
  <div class="section__head">
    <div>
      <h2>Field notes</h2>
      <p class="val" style="margin-top:.5rem">Four things that are true and not on the CV.</p>
    </div>
    <span class="key">likes are kept in this browser, nowhere else</span>
  </div>
  <div class="facts">
      ${factCards}
    <article class="fact fact--wide">
      <div>
        <p>${ph(wide.text)}</p>
        <div class="lessons" style="margin-top:1.25rem">
          ${lessonRows}
        </div>
      </div>
      <button class="like" data-fact="${wide.id}" aria-pressed="false">${HEART}<span class="like__t">like</span></button>
    </article>
  </div>
</section>`;

  write('about/index.html', layout({
    title: 'About — Artem Maslov',
    desc: 'Nine years of practice by hand, then generative pipelines. Bio, skill map, awards and CV.',
    current: 'about', body
  }));
}

/* ============================================================
   ABOUT — node graph
   ============================================================ */
function aboutNodes() {
  const N = (id, x, y, kind, type, title, lines, rows, cls) => `
    <div class="node ${cls || ''}" id="${id}" data-x="${x}" data-y="${y}">
      <span class="node__port node__port--in" aria-hidden="true"></span>
      <span class="node__port node__port--out" aria-hidden="true"></span>
      <div class="node__hd node__hd--${kind}">${esc(type)}</div>
      <div class="node__bd">
        <span class="node__t">${ph(title)}</span>
        ${lines.map((l) => `<span class="node__k">${ph(l)}</span>`).join('')}
        ${rows ? `<span class="node__rows">${rows.map(([k, v]) => `<span><span>${esc(k)}</span><span>${esc(v)}</span></span>`).join('')}</span>` : ''}
      </div>
    </div>`;

  const nodes = [
    N('n-origin', 0, 20, 'hand', 'load · origin', 'Odesa, Ukraine',
      ['BFA, Odesa State Academy of Civil Engineering and Architecture']),
    N('n-craft', 0, 272, 'hand', 'load · craft', 'The hand',
      ['Concept art, 3D, AR and VR, immersive production', '2016 to 2023']),
    N('n-ai', 0, 524, 'machine', 'load model · ai · 2024', 'The second instrument',
      ['Code, math, generative pipelines'], null, 'node--machine'),
    N('n-career', 300, 62, 'hand', 'sampler · career', 'Nine years in production', [], [
      ['Snap Inc.', '3.5 yrs'], ['ARNI Studio', 'founder'], ['Tactical, Rotterdam', '2023–25']
    ]),
    N('n-teach', 600, 20, 'out', 'save · teaching', 'NAIT, Edmonton',
      ['Visual Assets for Games, since 2026']),
    N('n-merge', 600, 384, 'machine', 'merge · a + b', 'Hand plus machine', [], [
      ['taste', '1.00'], ['craft', '1.00'], ['compute', '1.00'], ['curiosity', '∞']
    ], 'node--machine'),
    N('n-out', 880, 296, 'out', 'output · 2026', 'Artem Maslov',
      ['AI art director and creative technologist', 'Edmonton, AB', 'artem@artmaslov.com'], null, 'node--out'),
    N('n-awards', 880, 596, 'out', 'preview · awards', 'Winner, Meta Horizon Mobile Innovation Hackathon',
      ['2025', '[More awards]'])
  ].join('');

  const edges = JSON.stringify([
    ['n-origin', 'n-career', 'hand'],
    ['n-craft', 'n-career', 'hand'],
    ['n-career', 'n-teach', 'plain'],
    ['n-career', 'n-merge', 'hand'],
    ['n-ai', 'n-merge', 'machine'],
    ['n-merge', 'n-out', 'plain'],
    ['n-out', 'n-awards', 'plain']
  ]).replace(/"/g, '&quot;');

  const body = `
<section class="wrap" style="padding-top:clamp(2rem,4vw,3rem)">
  <div style="display:flex;gap:1rem 1.5rem;flex-wrap:wrap;align-items:center;justify-content:space-between">
    ${viewToggle('nodes')}
    <a class="btn" href="#" data-cv>Download CV (PDF)</a>
  </div>
</section>

<section class="wrap" style="margin-top:clamp(2rem,4vw,3rem)">
  <h1 style="font-size:clamp(2rem,3.6vw,2.75rem)">The same bio, wired up</h1>
  <p class="lead" style="margin-top:1rem">This is how I actually think about it: two inputs, nine years of sampling, one model loaded in 2024, and a merge. Drag any node.</p>
</section>

<section class="wrap" style="margin-top:clamp(1.75rem,3.5vw,2.5rem)">
  <div class="canvasfield" data-nodes data-edges="${edges}">
    <div class="canvasfield__inner">
      <svg aria-hidden="true" preserveAspectRatio="none"></svg>
      ${nodes}
    </div>
  </div>
  <p class="hint" style="margin-top:.85rem">Drag a node by its header. <a class="link" href="/about/">Read the written version</a> if you would rather not.</p>
</section>`;

  write('about/nodes/index.html', layout({
    title: 'About, as a node graph — Artem Maslov',
    desc: 'The bio as a node graph: two inputs, nine years of sampling, one model loaded in 2024, and a merge.',
    current: 'about', body
  }));
}

/* ---- favicon ---- */
function mark() {
  writeFileSync(join(ROOT, 'assets/mark.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<rect width="24" height="24" fill="#E8E8E3"/>
<circle cx="12" cy="12" r="9" fill="none" stroke="#1F1C18" stroke-width="1.2"/>
<path d="M12 1.5v21M1.5 12h21" stroke="#1F1C18" stroke-width="1.2" opacity=".5"/>
<path d="M12 8.5A3.5 3.5 0 0 0 12 15.5Z" fill="#9E3B26"/>
<path d="M12 8.5A3.5 3.5 0 0 1 12 15.5Z" fill="#15567E"/>
</svg>`);
  console.log('  assets/mark.svg');
}

/* ---- run ---- */
console.log('building artmaslov.com');
home(); work(); labPage(); resources(); about(); aboutNodes(); mark();
projects.forEach((p, i) => projectPage(
  p,
  projects[(i - 1 + projects.length) % projects.length],
  projects[(i + 1) % projects.length]
));
console.log(`done — ${projects.length + 6} pages`);
