/* About, as a node graph.

   The whole graph is wider than any column it could sit in, so instead of
   scrolling the page sideways the canvas lives in a fixed window and is scaled
   to fit on load: everything is visible at once, and the reader zooms in on
   whatever they want to read. Nodes drag, wires follow, the canvas pans.

   Below 58rem there is no canvas at all: the nodes stack and each one carries a
   "feeds" line, so the same information survives without any of this. */
(() => {
  'use strict';

  const box = document.getElementById('graphbox');
  const graph = document.getElementById('graph');
  if (!box || !graph) return;

  const svg = graph.querySelector('.graph__wires');
  const wires = JSON.parse(graph.dataset.wires || '[]');
  const canvas = window.matchMedia('(min-width: 58rem)');

  const gw = parseFloat(getComputedStyle(graph).getPropertyValue('--gw')) || 0;
  const gh = parseFloat(getComputedStyle(graph).getPropertyValue('--gh')) || 0;

  const MIN = 0.15, MAX = 2.5, PAD = 24;
  const view = { k: 1, tx: 0, ty: 0 };
  const pos = {};

  graph.querySelectorAll('.node').forEach((n) => {
    const id = n.id.replace(/^n-/, '');
    const cs = getComputedStyle(n);
    pos[id] = {
      el: n,
      x: parseFloat(cs.getPropertyValue('--x')) || 0,
      y: parseFloat(cs.getPropertyValue('--y')) || 0
    };
  });

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

  /* ── the view ─────────────────────────────────────────── */

  function apply() {
    graph.style.setProperty('--k', view.k);
    graph.style.setProperty('--tx', `${view.tx}px`);
    graph.style.setProperty('--ty', `${view.ty}px`);
    /* The dot grid is the window's own background, so it has to be moved and
       scaled by hand to read as one sheet under the nodes. */
    const g = 20 * view.k;
    box.style.backgroundSize = `${g}px ${g}px`;
    box.style.backgroundPosition = `${view.tx}px ${view.ty}px`;
  }

  function fit() {
    if (!canvas.matches) return;
    const bw = box.clientWidth, bh = box.clientHeight;
    if (!bw || !bh || !gw || !gh) return;
    view.k = clamp(Math.min((bw - PAD * 2) / gw, (bh - PAD * 2) / gh), MIN, 1);
    view.tx = (bw - gw * view.k) / 2;
    view.ty = (bh - gh * view.k) / 2;
    apply();
  }

  /* Zoom about a point in window coordinates, so whatever is under the cursor
     stays under the cursor. */
  function zoomAt(k2, px, py) {
    k2 = clamp(k2, MIN, MAX);
    const r = k2 / view.k;
    view.tx = px - (px - view.tx) * r;
    view.ty = py - (py - view.ty) * r;
    view.k = k2;
    apply();
  }

  function zoomCentre(f) {
    zoomAt(view.k * f, box.clientWidth / 2, box.clientHeight / 2);
  }

  /* ── wires ────────────────────────────────────────────── */

  /* Where a wire meets a node: the centre of the named socket, as an offset
     from the node's own top in canvas units — hence the division by the
     current scale. A node with no such socket falls back to its middle, so a
     wire is never dropped. */
  function socketY(el, kind, id) {
    const dot = id && el.querySelector('[data-' + kind + '="' + id + '"]');
    if (!dot) return el.offsetHeight / 2;
    const d = dot.getBoundingClientRect(), n = el.getBoundingClientRect();
    return (d.top + d.height / 2 - n.top) / view.k;
  }

  function draw() {
    if (!canvas.matches) { svg.innerHTML = ''; return; }
    svg.innerHTML = wires.map(([a, outId, b, inId]) => {
      const A = pos[a], B = pos[b];
      if (!A || !B) return '';
      const x1 = A.x + A.el.offsetWidth, y1 = A.y + socketY(A.el, 'out', outId);
      const x2 = B.x, y2 = B.y + socketY(B.el, 'in', inId);
      const c = Math.max(40, Math.abs(x2 - x1) / 2);
      const live = A.el.classList.contains('is-dragging') || B.el.classList.contains('is-dragging');
      return `<path d="M${x1} ${y1} C ${x1 + c} ${y1}, ${x2 - c} ${y2}, ${x2} ${y2}"${live ? ' class="is-live"' : ''}/>`;
    }).join('');
  }

  function move(id, x, y) {
    const p = pos[id];
    p.x = clamp(x, 0, gw - p.el.offsetWidth);
    p.y = clamp(y, 0, gh - p.el.offsetHeight);
    p.el.style.setProperty('--x', `${p.x}px`);
    p.el.style.setProperty('--y', `${p.y}px`);
    draw();
  }

  /* ── dragging a node ──────────────────────────────────── */

  Object.entries(pos).forEach(([id, p]) => {
    p.el.addEventListener('pointerdown', (e) => {
      if (!canvas.matches || e.button !== 0) return;
      e.stopPropagation();                 /* a node drag is not a pan */
      const from = { x: p.x, y: p.y, cx: e.clientX, cy: e.clientY };
      p.el.setPointerCapture(e.pointerId);
      p.el.classList.add('is-dragging');
      const onMove = (ev) => {
        move(id, from.x + (ev.clientX - from.cx) / view.k, from.y + (ev.clientY - from.cy) / view.k);
      };
      const onUp = () => {
        p.el.classList.remove('is-dragging');
        p.el.removeEventListener('pointermove', onMove);
        p.el.removeEventListener('pointerup', onUp);
        draw();
      };
      p.el.addEventListener('pointermove', onMove);
      p.el.addEventListener('pointerup', onUp);
      e.preventDefault();
    });

    /* Keyboard: focus a node and nudge it. 8px, or 32px with shift. */
    p.el.addEventListener('keydown', (e) => {
      if (!canvas.matches) return;
      const step = e.shiftKey ? 32 : 8;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!d) return;
      move(id, p.x + d[0], p.y + d[1]);
      e.preventDefault();
    });
  });

  /* ── panning and zooming the canvas ───────────────────── */

  const touches = new Map();
  let pan = null, pinch = null;

  box.addEventListener('pointerdown', (e) => {
    if (!canvas.matches || e.target.closest('.zoom')) return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    box.setPointerCapture(e.pointerId);

    if (touches.size === 2) {
      const [a, b] = [...touches.values()];
      pan = null;
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
      box.classList.remove('is-panning');
      return;
    }
    if (e.button !== 0) return;
    pan = { tx: view.tx, ty: view.ty, cx: e.clientX, cy: e.clientY };
    box.classList.add('is-panning');
  });

  box.addEventListener('pointermove', (e) => {
    if (!touches.has(e.pointerId)) return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch && touches.size === 2) {
      const [a, b] = [...touches.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (!pinch.d) return;
      const r = box.getBoundingClientRect();
      zoomAt(pinch.k * (d / pinch.d), (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    if (!pan) return;
    view.tx = pan.tx + (e.clientX - pan.cx);
    view.ty = pan.ty + (e.clientY - pan.cy);
    apply();
  });

  const endPointer = (e) => {
    touches.delete(e.pointerId);
    if (touches.size < 2) pinch = null;
    if (!touches.size) { pan = null; box.classList.remove('is-panning'); }
  };
  box.addEventListener('pointerup', endPointer);
  box.addEventListener('pointercancel', endPointer);

  box.addEventListener('wheel', (e) => {
    if (!canvas.matches) return;
    e.preventDefault();
    const r = box.getBoundingClientRect();
    zoomAt(view.k * Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  box.addEventListener('dblclick', (e) => {
    if (!canvas.matches || e.target.closest('.zoom')) return;
    const r = box.getBoundingClientRect();
    zoomAt(view.k * 1.6, e.clientX - r.left, e.clientY - r.top);
  });

  box.querySelectorAll('[data-zoom]').forEach((b) => {
    b.addEventListener('click', () => {
      const a = b.dataset.zoom;
      if (a === 'fit') fit();
      else zoomCentre(a === 'in' ? 1.25 : 1 / 1.25);
    });
  });

  /* ── start ────────────────────────────────────────────── */

  /* Below the canvas breakpoint the nodes are a plain stacked list, so anything
     this script wrote inline has to come off again — otherwise a desktop view
     narrowed to a phone keeps a stale scale and a stale grid. */
  function clear() {
    ['--k', '--tx', '--ty'].forEach((v) => graph.style.removeProperty(v));
    box.style.removeProperty('background-size');
    box.style.removeProperty('background-position');
    box.classList.remove('is-panning');
  }

  function reset() {
    if (!canvas.matches) clear();
    else fit();
    draw();
  }

  reset();
  addEventListener('resize', reset);
  canvas.addEventListener('change', reset);
  if (document.fonts) document.fonts.ready.then(reset);
})();
