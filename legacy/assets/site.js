import { drawPlate, makeInterference } from './draw.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const debounce = (fn, ms = 140) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ---------- project plates ---------- */
function initPlates() {
  const canvases = [...document.querySelectorAll('canvas[data-plate]')];
  if (!canvases.length) return;
  const paint = () => canvases.forEach((c) => { if (c.offsetParent !== null) drawPlate(c); });
  paint();
  window.addEventListener('resize', debounce(paint));
  document.addEventListener('plates:repaint', paint);
}

/* ---------- the interference instrument ---------- */
function initInstrument() {
  const cv = document.getElementById('interference');
  const slider = document.getElementById('mix');
  if (!cv || !slider) return;

  const render = makeInterference(cv);
  const readA = document.querySelector('[data-read="a"]');
  const readB = document.querySelector('[data-read="b"]');

  const paint = (m) => {
    render(m);
    if (readA) readA.textContent = (1 - m).toFixed(2);
    if (readB) readB.textContent = m.toFixed(2);
    slider.setAttribute('aria-valuetext',
      `drawn by hand ${(1 - m).toFixed(2)}, computed ${m.toFixed(2)}`);
  };

  const target = 0.78;
  slider.value = String(target);
  slider.addEventListener('input', () => paint(Number(slider.value)));
  window.addEventListener('resize', debounce(() => paint(Number(slider.value))));

  if (reduced) { paint(target); return; }

  /* one orchestrated page-load moment: the machine arrives over the hand */
  const t0 = performance.now(), dur = 1700;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  (function step(now) {
    const t = Math.min(1, (now - t0) / dur);
    paint(ease(t) * target);
    if (t < 1) requestAnimationFrame(step);
  })(performance.now());
}

/* ---------- filters (work, resources) ---------- */
function initFilters() {
  document.querySelectorAll('[data-filterbar]').forEach((bar) => {
    const listSel = bar.dataset.filterbar;
    const rows = [...document.querySelectorAll(`${listSel} [data-tags]`)];
    const count = bar.querySelector('.filterbar__count');
    const buttons = [...bar.querySelectorAll('button[data-tag]')];

    const apply = (tag) => {
      let n = 0;
      rows.forEach((r) => {
        const show = tag === 'all' || r.dataset.tags.split(' ').includes(tag);
        r.hidden = !show;
        if (show) n++;
      });
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tag === tag)));
      if (count) count.textContent = `${n} of ${rows.length}`;
      document.dispatchEvent(new Event('plates:repaint'));
    };

    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.tag)));
    apply('all');
  });
}

/* ---------- likes: kept in this browser, honestly labelled ---------- */
function initLikes() {
  const buttons = [...document.querySelectorAll('.like[data-fact]')];
  if (!buttons.length) return;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('am.liked') || '{}'); } catch {}

  buttons.forEach((b) => {
    const id = b.dataset.fact;
    const set = (on) => {
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('.like__t').textContent = on ? 'liked' : 'like';
    };
    set(!!saved[id]);
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      set(on); saved[id] = on;
      try { localStorage.setItem('am.liked', JSON.stringify(saved)); } catch {}
    });
  });
}

/* ---------- node graph ---------- */
function initNodes() {
  const field = document.querySelector('[data-nodes]');
  if (!field) return;
  const inner = field.querySelector('.canvasfield__inner');
  const svg = field.querySelector('svg');
  const nodes = [...field.querySelectorAll('.node')];
  const edges = JSON.parse(field.dataset.edges || '[]');

  const stackQuery = window.matchMedia('(max-width: 59.99rem)');
  let stacked = false;

  const place = () => {
    nodes.forEach((n) => { n.style.left = n.dataset.x + 'px'; n.style.top = n.dataset.y + 'px'; });
  };

  const port = (el, side) => {
    const r = el.getBoundingClientRect(), f = inner.getBoundingClientRect();
    return { x: (side === 'out' ? r.right : r.left) - f.left, y: r.top - f.top + 22 };
  };

  const wires = () => {
    if (stacked) { svg.innerHTML = ''; return; }
    const f = inner.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${f.width} ${f.height}`);
    svg.innerHTML = edges.map(([a, b, kind]) => {
      const A = field.querySelector(`#${a}`), B = field.querySelector(`#${b}`);
      if (!A || !B) return '';
      const p = port(A, 'out'), q = port(B, 'in');
      const dx = Math.max(44, Math.abs(q.x - p.x) * 0.45);
      const stroke = kind === 'machine' ? 'var(--cyanotype)' : kind === 'hand' ? 'var(--sanguine)' : 'var(--ink-3)';
      return `<path d="M${p.x} ${p.y} C${p.x + dx} ${p.y}, ${q.x - dx} ${q.y}, ${q.x} ${q.y}"
        fill="none" stroke="${stroke}" stroke-width="1.25" opacity=".85"/>`;
    }).join('');
  };

  const syncMode = () => {
    stacked = stackQuery.matches;
    field.classList.toggle('is-stack', stacked);
    if (!stacked) place();
    else nodes.forEach((n) => { n.style.left = ''; n.style.top = ''; });
    wires();
  };

  /* drag */
  nodes.forEach((n) => {
    const handle = n.querySelector('.node__hd');
    handle.addEventListener('pointerdown', (e) => {
      if (stacked) return;
      const x0 = e.clientX, y0 = e.clientY;
      const ox = parseFloat(n.dataset.x), oy = parseFloat(n.dataset.y);
      handle.setPointerCapture(e.pointerId);
      n.style.zIndex = '10';
      const move = (ev) => {
        n.dataset.x = Math.max(0, ox + ev.clientX - x0);
        n.dataset.y = Math.max(0, oy + ev.clientY - y0);
        n.style.left = n.dataset.x + 'px'; n.style.top = n.dataset.y + 'px';
        wires();
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        n.style.zIndex = '';
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  });

  syncMode();
  stackQuery.addEventListener('change', syncMode);
  window.addEventListener('resize', debounce(wires, 60));
  field.addEventListener('scroll', debounce(wires, 60));
}

/* ---------- skill dumbbells ---------- */
function initSkills() {
  document.querySelectorAll('[data-skill]').forEach((row) => {
    const a = Number(row.dataset.a), b = Number(row.dataset.b);
    const pct = (v) => 4 + (v / 10) * 92;
    const span = row.querySelector('.dumb__span');
    row.querySelector('.dumb__a').style.left = pct(a) + '%';
    row.querySelector('.dumb__b').style.left = pct(b) + '%';
    if (b > a) { span.style.left = pct(a) + '%'; span.style.width = (pct(b) - pct(a)) + '%'; }
    else { span.style.display = 'none'; row.classList.add('is-same'); }
  });
}

initPlates(); initInstrument(); initFilters(); initLikes(); initNodes(); initSkills();
