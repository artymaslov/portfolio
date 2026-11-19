/* artmaslov.com */
(() => {
  'use strict';

  const lessMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');

  /* Filter the work by how it was made. Hand and machine are not two lists;
     they are two views of one list, and some projects are in both. */
  const seg = document.querySelector('.seg');
  if (seg) {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-filter]');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      document.body.dataset.filter = b.dataset.filter;
    });
  }

  /* A preview holds a still until you point at it, then plays its clip.
     Touch devices and reduced-motion keep the still. */
  document.querySelectorAll('[data-thumb]').forEach((box) => {
    const clip = box.querySelector('video');
    if (!clip) return;
    const row = box.closest('a') || box;

    const play = () => {
      if (!canHover.matches || lessMotion.matches) return;
      box.classList.add('is-playing');
      const p = clip.play();
      if (p) p.catch(() => box.classList.remove('is-playing'));
    };
    const stop = () => {
      box.classList.remove('is-playing');
      clip.pause();
      clip.currentTime = 0;
    };

    row.addEventListener('pointerenter', play);
    row.addEventListener('pointerleave', stop);
    row.addEventListener('focusin', play);
    row.addEventListener('focusout', stop);
  });

  /* Silent looping clips stand in for what used to be GIFs. If the viewer has
     asked for less motion, they stop and get controls instead. */
  if (lessMotion.matches) {
    document.querySelectorAll('video[data-loop]').forEach((v) => {
      v.autoplay = false;
      v.controls = true;
      v.pause();
    });
  }

  /* A grid of stills opens in a <dialog>, which brings the focus trap and
     Escape with it. Only the opened image loads at full size. */
  const dlg = document.querySelector('[data-lb]');
  const plates = [...document.querySelectorAll('[data-gallery] .plate')];
  if (dlg && plates.length) {
    const img = dlg.querySelector('.lb__img');
    const count = dlg.querySelector('.lb__n');
    let at = 0;

    const show = (i) => {
      at = (i + plates.length) % plates.length;
      const b = plates[at];
      img.src = b.dataset.full;
      img.alt = b.querySelector('img').alt;
      count.textContent = `${at + 1} of ${plates.length}`;
    };

    plates.forEach((b, i) => b.addEventListener('click', () => {
      show(i);
      dlg.showModal();          // focus returns to this button on close
    }));

    dlg.addEventListener('click', (e) => {
      const step = e.target.closest('[data-lb-step]');
      if (step) { show(at + Number(step.dataset.lbStep)); return; }
      /* anything that is not the picture itself closes the viewer */
      if (!e.target.closest('.lb__nav')) dlg.close();
    });

    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
    });

    /* drop the large file once the viewer is shut */
    dlg.addEventListener('close', () => { img.removeAttribute('src'); img.alt = ''; });
  }

  /* A board on someone else's server loads on request, not on arrival. Until
     someone asks for it, the page carries a static export of the same thing. */
  document.querySelectorAll('[data-embed]').forEach((fig) => {
    const go = fig.querySelector('[data-embed-go]');
    if (!go) return;
    go.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = fig.dataset.src;
      f.title = fig.dataset.title;
      f.loading = 'lazy';
      f.allow = 'fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.style.aspectRatio = '16 / 9';
      fig.querySelector('.plate').replaceWith(f);
      go.remove();
    });
  });

  /* Before and after. The handle sits on the image and is dragged directly;
     the range input behind it keeps arrow keys and screen readers working. */
  document.querySelectorAll('[data-ba]').forEach((fig) => {
    const box = fig.querySelector('.ba__box');
    const input = fig.querySelector('input[type="range"]');
    if (!box || !input) return;

    const paint = () => fig.style.setProperty('--x', `${input.value}%`);

    const track = (e) => {
      const r = box.getBoundingClientRect();
      const pct = ((e.clientX - r.left) / r.width) * 100;
      input.value = String(Math.round(Math.min(100, Math.max(0, pct))));
      paint();
    };

    let dragging = false;
    box.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      track(e);                       // jump to where you clicked, first
      try { box.setPointerCapture(e.pointerId); } catch { /* capture is a bonus */ }
      e.preventDefault();
    });
    box.addEventListener('pointermove', (e) => { if (dragging) track(e); });
    const release = (e) => {
      dragging = false;
      try { if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    };
    box.addEventListener('pointerup', release);
    box.addEventListener('pointercancel', release);

    input.addEventListener('input', paint);
    paint();
  });

  /* The statement, running. It moves on its own until a pointer comes onto the
     band, and then it stops and follows the pointer instead — a reader who
     wants the sentence that has just gone past can simply push it back. The
     copy is doubled in the markup, so the offset only ever has to wrap round
     the width of one copy for the loop to be seamless. */
  const sayHit = document.querySelector('[data-say]');
  const said = document.getElementById('statement');
  if (sayHit && said) {
    const band = sayHit.closest('.say');
    const track = band.querySelector('[data-say-track]');
    const SPEED = 55;                  /* pixels a second, which is reading pace at this size */
    let runW = 0, at = 0, prev = 0, held = false, lastX = 0, raf = 0;

    const measure = () => { runW = track.firstElementChild.getBoundingClientRect().width; };
    const wrap = (v) => (runW ? ((v % runW) + runW) % runW : 0);
    const paint = () => { track.style.transform = `translate3d(${-wrap(at)}px,0,0)`; };

    const frame = (now) => {
      const dt = prev ? Math.min(now - prev, 64) : 0;   /* a tab left in the background does not leap on return */
      prev = now;
      at += SPEED * dt / 1000;
      paint();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !held && !lessMotion.matches) { prev = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    band.addEventListener('pointerenter', (e) => {
      if (!canHover.matches) return;
      held = true; lastX = e.clientX; stop();
    });
    band.addEventListener('pointermove', (e) => {
      if (!held) return;
      at -= e.clientX - lastX;         /* the text goes the way the hand goes */
      lastX = e.clientX;
      paint();
    });
    band.addEventListener('pointerleave', () => { held = false; start(); });

    sayHit.addEventListener('click', () => said.showModal());
    said.addEventListener('click', (e) => {
      /* the backdrop reports as the dialog itself */
      if (e.target === said || e.target.closest('[data-said-x]')) said.close();
    });

    measure();
    paint();
    if (document.fonts) document.fonts.ready.then(() => { measure(); paint(); });
    addEventListener('resize', () => { measure(); paint(); });

    /* nothing moves while the band is off screen */
    new IntersectionObserver((rows) => {
      rows.forEach((r) => (r.isIntersecting ? start() : stop()));
    }).observe(band);
  }

  /* The drawings beside the menu. Each link carries its own in a data
     attribute — geometry only, so the file's Illustrator stylesheet stays out
     of the page — and on hover it uncoils into the rule under the word.

     Both shapes are sampled into the same number of points, spaced by arc
     length rather than by command, so every point on the drawing has one place
     to go and the stroke reads as a single line moving. That is also why the
     drawing can be any shape: nothing here knows what it is. */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const PTS = 64;                      /* enough that the tightest curl stays a curve */

  /* Three things turn a morph into a lace being pulled straight.

     The first is that the points do not all set off together: each one waits
     until the one before it on the stroke is under way, so a wave runs from
     one end of the drawing to the other and the line arrives in order. LAG is
     how far behind the far end starts.

     The second is that no point travels in a straight line. Each bows out
     sideways and comes back, all of them to the same side, so the stroke
     swings through the move rather than folding into it. BOW is how far, as a
     fraction of how far that point has to go.

     The stroke is also written as curves through its points rather than as a
     run of straight segments, so every state in between is round — which is
     what the drawings are. */
  const SIZE = 18;                     /* how large the drawing is drawn, longest side */

  /* Two things turn a morph into a lace rather than one shape becoming
     another. The first is that the points do not all set off together: each
     waits until the one before it on the stroke is under way, so a wave runs
     along the drawing and the rule arrives in order. LAG is how far behind the
     far end starts. The second is that no point travels in a straight line:
     each bows out sideways and comes back, all to the same side, so the stroke
     swings through the move instead of folding into it. */
  const LAG = 0.55;
  const BOW = 0.22;
  const SPAN = 480;                    /* how long it takes, in ms */
  const curve = (u) => -(Math.cos(Math.PI * u) - 1) / 2;
  const rebuilds = [];

  const through = (pts) => {
    const n = pts.length;
    let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < n - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += `Q${pts[i][0].toFixed(2)},${pts[i][1].toFixed(2)} ${mx.toFixed(2)},${my.toFixed(2)}`;
    }
    return d + `L${pts[n - 1][0].toFixed(2)},${pts[n - 1][1].toFixed(2)}`;
  };

  document.querySelectorAll('.rail__nav a[data-deco]').forEach((link) => {
    const label = link.querySelector('.navl');
    if (!label) return;

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'navdeco');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(SVGNS, 'path');
    svg.appendChild(path);
    link.appendChild(svg);

    /* the page you are on keeps the rule, so the menu says where you are */
    const here = link.hasAttribute('aria-current');
    let from = [], to = [], t = here ? 1 : 0, aim = t, raf = 0, prev = 0, ready = false;

    const draw = () => {
      if (!ready) return;
      const pts = new Array(PTS);
      for (let i = 0; i < PTS; i++) {
        const s = i / (PTS - 1);
        /* where this point is in its own move, which is behind the one before it */
        let u = t * (1 + LAG) - LAG * s;
        u = curve(u < 0 ? 0 : u > 1 ? 1 : u);

        const a = from[i], b = to[i];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        let x = a[0] + dx * u, y = a[1] + dy * u;

        const far = Math.hypot(dx, dy);
        if (far > 0.01) {
          /* out to one side at the half way, and back by the end */
          const out = Math.sin(Math.PI * u) * Math.min(far * BOW, 16);
          x += (-dy / far) * out;
          y += (dx / far) * out;
        }
        pts[i] = [x, y];
      }
      path.setAttribute('d', through(pts));
    };

    const build = () => {
      if (getComputedStyle(svg).display === 'none') { ready = false; return; }
      const box = link.getBoundingClientRect();
      const lab = label.getBoundingClientRect();
      if (!box.width || !box.height) { ready = false; return; }

      const w = Math.round(box.width), h = Math.round(box.height);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));

      path.setAttribute('d', link.dataset.deco);
      const len = path.getTotalLength();
      if (!len) { ready = false; return; }
      const raw = [];
      for (let i = 0; i < PTS; i++) {
        const p = path.getPointAtLength((i / (PTS - 1)) * len);
        raw.push([p.x, p.y]);
      }

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const [x, y] of raw) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      const wide = Math.max(maxX - minX, 0.01), tall = Math.max(maxY - minY, 0.01);
      const fs = parseFloat(getComputedStyle(label).fontSize) || 14;
      const mid = (lab.top + lab.bottom) / 2 - box.top;      /* the word's own middle */
      const slot = w - (lab.right - box.left);

      /* the drawing sits beside the word, at the word's height, as large as
         the link and the slot beside the word allow */
      const k = Math.min(SIZE / Math.max(wide, tall), (h - 3) / tall, (slot - 3) / wide);
      const ox = w - maxX * k, oy = mid - ((minY + maxY) / 2) * k;
      from = raw.map(([px, py]) => [px * k + ox, py * k + oy]);

      /* the rule it becomes: as long as the word, a little under its baseline */
      const y = Math.round(mid + fs * 0.42 + 2.5);
      const x0 = Math.max(0, lab.left - box.left), x1 = lab.right - box.left;
      to = [];
      for (let i = 0; i < PTS; i++) to.push([x0 + (x1 - x0) * (i / (PTS - 1)), y]);

      ready = true;
      draw();
    };

    const step = (now) => {
      const dt = prev ? Math.min(now - prev, 64) : 16;
      prev = now;
      t = Math.min(1, Math.max(0, t + (aim > t ? 1 : -1) * dt / SPAN));
      draw();
      if (t !== aim) raf = requestAnimationFrame(step);
      else { raf = 0; prev = 0; }
    };
    const go = (next) => {
      aim = next;
      if (lessMotion.matches) { t = next; draw(); return; }
      if (!raf) { prev = 0; raf = requestAnimationFrame(step); }
    };

    /* Off the home page the word changes face under the pointer, so it also
       changes width, and the rule this drawing becomes is measured from the
       word. Measure again on the way in and on the way out — by the time the
       event runs the new face is already applied — or the rule uncoils to the
       length the word used to be. */
    const measured = (next) => { build(); go(next); };
    link.addEventListener('pointerenter', () => measured(1));
    link.addEventListener('pointerleave', () => measured(here ? 1 : 0));
    link.addEventListener('focus', () => measured(1));
    link.addEventListener('blur', () => measured(here ? 1 : 0));

    rebuilds.push(build);
    build();
  });

  if (rebuilds.length) {
    const again = () => rebuilds.forEach((f) => f());
    if (document.fonts) document.fonts.ready.then(again);   /* the word is a different width once its face has loaded */
    let hold = 0;
    addEventListener('resize', () => { clearTimeout(hold); hold = setTimeout(again, 120); });
  }


  /* Pictures below the fold fade up as they are reached. Anything already on
     screen when the page opens is left alone, and so is everything if the
     viewer has asked for less motion: in both cases the class that hides them
     is never added, so the page stands still rather than waiting on a script. */
  if (!lessMotion.matches && 'IntersectionObserver' in window) {
    const arriving = [...document.querySelectorAll('.fig, .exp li, .fig-media')]
      /* strictly below the fold: an element the reader can already see, even
         by a sliver, must not fade in under them as the page opens */
      .filter((el) => el.getBoundingClientRect().top >= innerHeight);

    if (arriving.length) {
      arriving.forEach((el) => {
        el.classList.add('reveal');
        /* a row of work arrives as a row, a beat apart, rather than as three
           unrelated events; a list down the page does not need the help */
        const kin = el.parentElement;
        if (kin && kin.classList.contains('figures')) {
          const n = [...kin.children].indexOf(el) % 3;
          if (n) el.style.transitionDelay = `${n * 70}ms`;
        }
      });

      const watch = new IntersectionObserver((rows) => {
        rows.forEach((r) => {
          if (!r.isIntersecting) return;
          r.target.classList.add('is-in');
          watch.unobserve(r.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });

      arriving.forEach((el) => watch.observe(el));
    }
  }

})();
