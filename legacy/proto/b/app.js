/* B · Darkroom — the contact sheet is the navigation.
   Drag the scrub bar, use the arrow keys, or pick a frame. */
(() => {
  'use strict';

  const data = document.getElementById('frames');
  const scrub = document.getElementById('scrub');
  if (!data || !scrub) return;

  const frames = JSON.parse(data.textContent);
  const big = document.querySelector('.viewer__frame .ph');
  const bigLabel = document.querySelector('.viewer__frame .ph__l');
  const n = document.querySelector('[data-read="n"]');
  const link = document.querySelector('[data-read="link"]');
  const tools = document.querySelector('[data-read="tools"]');
  const thumbs = [...document.querySelectorAll('.sheet__b')];
  const base = location.pathname.replace(/\/$/, '');

  let i = 0;
  function show(next) {
    i = Math.min(frames.length - 1, Math.max(0, next));
    const f = frames[i];
    n.textContent = `${i + 1}/${frames.length}`;
    link.textContent = f.t;
    link.href = `${base}/work/${f.s}/`;
    tools.textContent = f.k;
    const label = `Showreel 16:9 — frame ${i + 1}`;
    bigLabel.textContent = label;
    big.setAttribute('aria-label', `${label}, placeholder`);
    thumbs.forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
    if (scrub.valueAsNumber !== i + 1) scrub.value = String(i + 1);
  }

  scrub.addEventListener('input', () => show(scrub.valueAsNumber - 1));
  thumbs.forEach((b, j) => b.addEventListener('click', () => { show(j); scrub.focus(); }));
  show(0);
})();
