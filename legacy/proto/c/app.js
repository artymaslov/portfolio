/* C · Statement — the phrases in the statement drive the viewfinder.
   Pointer and keyboard both work; the link still navigates. */
(() => {
  'use strict';

  const finder = document.querySelector('.finder');
  if (!finder) return;

  const box = finder.querySelector('.ph');
  const label = finder.querySelector('.ph__l');
  const cap = finder.querySelector('[data-cap]');
  const restCap = cap.textContent;
  const pins = [...document.querySelectorAll('.pin')];
  if (!pins.length) return;

  const titles = {};
  document.querySelectorAll('.ledger__list a').forEach((a) => {
    const slug = a.getAttribute('href').replace(/\/$/, '').split('/').pop();
    titles[slug] = a.querySelector('.ledger__t').textContent;
  });

  let held = null;
  function set(slug) {
    held = slug;
    if (!slug) {
      label.textContent = 'Showreel 16:9';
      box.setAttribute('aria-label', 'Showreel 16:9, placeholder');
      cap.textContent = restCap;
      return;
    }
    label.textContent = 'Project cover 16:9';
    box.setAttribute('aria-label', `Project cover 16:9 for ${titles[slug] || slug}, placeholder`);
    cap.textContent = titles[slug] || slug;
  }

  pins.forEach((a) => {
    const slug = a.dataset.slug;
    const on = () => { pins.forEach((p) => p.classList.toggle('is-on', p === a)); set(slug); };
    const off = () => { a.classList.remove('is-on'); if (held === slug) set(null); };
    a.addEventListener('pointerenter', on);
    a.addEventListener('pointerleave', off);
    a.addEventListener('focus', on);
    a.addEventListener('blur', off);
  });
})();
