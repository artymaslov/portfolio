/* A · Index — two behaviours, both about the index↔evidence relation. */
(() => {
  'use strict';

  /* 1. Filter the work by how it was made. The toggle is the argument. */
  const seg = document.querySelector('.seg');
  if (seg) {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-filter]');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      document.body.dataset.filter = b.dataset.filter;
    });
  }

  /* 2. Hovering an index entry marks its figure, and the other way round. */
  const link = (slug, on) => {
    document.querySelectorAll(`[data-slug="${slug}"]`).forEach((el) => el.classList.toggle('is-linked', on));
  };
  document.querySelectorAll('[data-slug]').forEach((el) => {
    const slug = el.dataset.slug;
    el.addEventListener('pointerenter', () => link(slug, true));
    el.addEventListener('pointerleave', () => link(slug, false));
    el.addEventListener('focusin', () => link(slug, true));
    el.addEventListener('focusout', () => link(slug, false));
  });
})();
