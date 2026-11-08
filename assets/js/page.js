// The home page's small motions: app cards that rise in as they arrive, and
// lean toward the pointer with a soft light following it.

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cards rise in once, as they come into view.
const reveals = document.querySelectorAll('.reveal');
if (!still && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// With a mouse, a card tilts toward the pointer and lights up under it.
if (!still) {
  for (const card of document.querySelectorAll('.app')) {
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`);
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  }
}
