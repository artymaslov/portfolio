/* artmaslov.com — drawing engine.
   Everything here is plotted: 1px strokes, multiply blend, no gradients,
   no glow. The hand draws in sanguine, the machine rules in cyanotype. */

const cssVar = (name, fallback) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};
const INK   = () => cssVar('--ink', '#1F1C18');
const SANG  = () => cssVar('--sanguine', '#9E3B26');
const CYAN  = () => cssVar('--cyanotype', '#15567E');
const PAPER = () => cssVar('--plate-bg', '#F3F3EF');

/* ---- deterministic randomness: same slug always draws the same plate ---- */
function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* smooth 1-D value noise */
function noise1(seed) {
  const r = mulberry32(seed);
  const tbl = Array.from({ length: 512 }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x), f = x - i;
    const a = tbl[((i % 512) + 512) % 512], b = tbl[(((i + 1) % 512) + 512) % 512];
    const s = f * f * (3 - 2 * f);
    return a + (b - a) * s;
  };
}

function fitCanvas(cv) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = cv.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
  if (cv.width !== w * dpr || cv.height !== h * dpr) {
    cv.width = w * dpr; cv.height = h * dpr;
  }
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = PAPER(); ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return { ctx, w, h };
}

/* ============================================================
   PROJECT PLATES
   One line-family per discipline, so the thumbnails carry
   information instead of being decoration.
   ============================================================ */
const families = {
  /* AI video: stacked ridges — a waveform read across time */
  wave(ctx, w, h, rnd, seed) {
    const n = noise1(seed), rows = Math.max(16, Math.min(46, Math.round(h / 19))), pad = w * 0.07;
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const y = h * 0.1 + t * h * 0.8;
      ctx.beginPath();
      for (let x = pad; x <= w - pad; x += 3) {
        const u = (x - pad) / (w - 2 * pad);
        const bump = Math.exp(-Math.pow((u - 0.46) / 0.3, 2));
        const a = n(u * 6 + i * 1.7) * h * 0.11 * bump * (0.3 + t * 1.1);
        const yy = y + a;
        x === pad ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      const hot = i === Math.floor(rows * 0.58);
      ctx.strokeStyle = hot ? SANG() : INK();
      ctx.globalAlpha = hot ? 0.95 : 0.26 + t * 0.4;
      ctx.lineWidth = hot ? 1.3 : 1;
      ctx.stroke();
    }
  },

  /* AI stills: crosshatch, the oldest way to make a tone */
  hatch(ctx, w, h, rnd, seed) {
    const n = noise1(seed);
    const box = { x: w * 0.1, y: h * 0.12, w: w * 0.8, h: h * 0.76 };
    ctx.save();
    ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
    const passes = [[38, INK(), 0.34, 11], [-52, INK(), 0.26, 15], [12, SANG(), 0.42, 34]];
    for (const [deg, col, alpha, step] of passes) {
      const a = (deg * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a);
      const span = Math.hypot(w, h);
      for (let k = -span; k < span; k += step) {
        const cx = w / 2 - dy * k, cy = h / 2 + dx * k;
        const j = n(k * 0.08) * 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - dx * span + j, cy - dy * span);
        ctx.lineTo(cx + dx * span + j, cy + dy * span);
        ctx.strokeStyle = col; ctx.globalAlpha = alpha; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 0.62; ctx.strokeStyle = INK(); ctx.lineWidth = 1;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
  },

  /* Immersive / installation: a room drawn to a vanishing point */
  grid(ctx, w, h) {
    const vx = w * 0.5, vy = h * 0.47;
    const floor = h * 0.9, back = h * 0.3;
    ctx.globalAlpha = 0.34; ctx.strokeStyle = INK(); ctx.lineWidth = 1;
    for (let i = -14; i <= 14; i++) {
      ctx.beginPath(); ctx.moveTo(vx + i * (w / 7), floor); ctx.lineTo(vx, vy); ctx.stroke();
    }
    for (let i = 1; i <= 16; i++) {
      const t = Math.pow(i / 16, 2.3);
      const y = floor - (floor - back) * t;
      ctx.globalAlpha = 0.4 - t * 0.22;
      ctx.beginPath(); ctx.moveTo(w * 0.02, y); ctx.lineTo(w * 0.98, y); ctx.stroke();
    }
    ctx.globalAlpha = 0.95; ctx.strokeStyle = CYAN(); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.rect(vx - w * 0.1, vy - h * 0.12, w * 0.2, h * 0.24); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = SANG();
    ctx.beginPath(); ctx.arc(vx, vy, 3, 0, Math.PI * 2); ctx.fill();
  },

  /* 3D: a faceted shell, the way a mesh is actually built */
  facet(ctx, w, h, rnd) {
    const cols = 7, rows = 6;
    const bx = w * 0.14, by = h * 0.14, bw = w * 0.72, bh = h * 0.72;
    const pts = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) {
        const u = i / cols, v = j / rows;
        const edge = Math.min(u, 1 - u, v, 1 - v);
        const k = Math.min(1, edge * 3.2);
        row.push([
          bx + u * bw + (rnd() - 0.5) * bw * 0.06 * k,
          by + v * bh + (rnd() - 0.5) * bh * 0.09 * k - Math.sin(u * Math.PI) * bh * 0.1 * k
        ]);
      }
      pts.push(row);
    }
    ctx.lineWidth = 1;
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
      const p = pts[j][i];
      if (i < cols) { ctx.globalAlpha = 0.42; ctx.strokeStyle = INK();
        ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...pts[j][i + 1]); ctx.stroke(); }
      if (j < rows) { ctx.globalAlpha = 0.42; ctx.strokeStyle = INK();
        ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...pts[j + 1][i]); ctx.stroke(); }
      if (i < cols && j < rows) { ctx.globalAlpha = 0.24; ctx.strokeStyle = CYAN();
        ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...pts[j + 1][i + 1]); ctx.stroke(); }
    }
    ctx.globalAlpha = 1; ctx.fillStyle = SANG();
    for (const [i, j] of [[2, 1], [5, 4]]) {
      ctx.beginPath(); ctx.arc(pts[j][i][0], pts[j][i][1], 2.6, 0, Math.PI * 2); ctx.fill();
    }
  },

  /* A measured object: concentric rings and radial ticks */
  concentric(ctx, w, h, rnd, seed) {
    const n = noise1(seed);
    const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.39;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 22; i++) {
      const r = (i / 22) * R;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.06) {
        const wob = n(a * 2.4 + i * 3.1) * R * 0.022 * (1 - i / 30);
        const x = cx + Math.cos(a) * (r + wob), y = cy + Math.sin(a) * (r + wob) * 0.92;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i % 7 === 0 ? CYAN() : INK();
      ctx.globalAlpha = i % 7 === 0 ? 0.78 : 0.3;
      ctx.stroke();
    }
    for (let k = 0; k < 48; k++) {
      const a = (k / 48) * Math.PI * 2, long = k % 6 === 0;
      ctx.globalAlpha = long ? 0.75 : 0.3; ctx.strokeStyle = long ? SANG() : INK();
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 1.04, cy + Math.sin(a) * R * 0.96);
      ctx.lineTo(cx + Math.cos(a) * R * (long ? 1.16 : 1.09), cy + Math.sin(a) * R * (long ? 1.07 : 1.0));
      ctx.stroke();
    }
  }
};

export function drawPlate(cv) {
  const seedStr = cv.dataset.plate || 'plate';
  const fam = families[cv.dataset.family] ? cv.dataset.family : 'hatch';
  const { ctx, w, h } = fitCanvas(cv);
  const seed = hash32(seedStr);
  ctx.globalCompositeOperation = 'multiply';
  families[fam](ctx, w, h, mulberry32(seed), seed);
  ctx.globalAlpha = 1;
}

/* ============================================================
   THE INTERFERENCE INSTRUMENT  (home hero)
   Field A is drawn by hand: irregular spacing, wandering lines.
   Field B is ruled by machine: perfect, offset 6.4 degrees.
   Moiré only appears once the hand stops wandering — structure
   neither field contains on its own.
   ============================================================ */
export function makeInterference(cv) {
  const nA = noise1(0x5EED1), nW = noise1(0x5EED2);

  function render(m) {
    const { ctx, w, h } = fitCanvas(cv);
    const pad = Math.round(Math.min(w, h) * 0.055);
    const ix = pad, iy = pad, iw = w - pad * 2, ih = h - pad * 2;

    const step = Math.max(9, ih / 27);
    const jitter = (1 - m) * step * 0.62;

    ctx.save();
    ctx.beginPath(); ctx.rect(ix, iy, iw, ih); ctx.clip();
    ctx.globalCompositeOperation = 'multiply';

    /* field A — the hand: ruled by eye, so it wanders a little */
    ctx.strokeStyle = SANG();
    let i = 0;
    for (let y = iy - step; y < iy + ih + step; i++, y += step * (1 + (1 - m) * nW(i * 0.9) * 0.2)) {
      ctx.beginPath();
      for (let x = ix - 6; x <= ix + iw + 6; x += 6) {
        const yy = y + nA(x * 0.0026 + i * 3.1) * jitter;
        x === ix - 6 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.lineWidth = 1.5 + (1 - m) * nW(i * 2.1) * 0.35;
      ctx.globalAlpha = 0.88;
      ctx.stroke();
    }

    /* field B — the machine: ruled to 3.4 degrees, exactly */
    if (m > 0.004) {
      const a = (3.4 * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a);
      const span = Math.hypot(w, h) * 1.1;
      ctx.strokeStyle = CYAN(); ctx.lineWidth = 1.5; ctx.globalAlpha = m * 0.82;
      for (let k = -span; k < span; k += step) {
        const cx = w / 2 - dy * k, cy = h / 2 + dx * k;
        ctx.beginPath();
        ctx.moveTo(cx - dx * span, cy - dy * span);
        ctx.lineTo(cx + dx * span, cy + dy * span);
        ctx.stroke();
      }
    }
    ctx.restore();

    /* the plate is a measured object: inner frame and registration corners */
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.28; ctx.strokeStyle = INK(); ctx.lineWidth = 1;
    ctx.strokeRect(ix + 0.5, iy + 0.5, iw - 1, ih - 1);
    ctx.globalAlpha = 0.6;
    const t = Math.max(7, pad * 0.55);
    for (const [x, sx] of [[ix, 1], [ix + iw, -1]]) for (const [y, sy] of [[iy, 1], [iy + ih, -1]]) {
      ctx.beginPath();
      ctx.moveTo(x - sx * t, y); ctx.lineTo(x + sx * t, y);
      ctx.moveTo(x, y - sy * t); ctx.lineTo(x, y + sy * t);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  return render;
}
