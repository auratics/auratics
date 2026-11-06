// The page's small motions: the live timer card, the cycling goal, sections
// that rise in as they arrive and phones that lean as they pass.

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The card ticks on from the screenshot's time, toward a 16-hour goal.
const card = document.querySelector('.live-card');
if (card) {
  const GOAL = 16 * 3600;
  let elapsed = 14 * 3600 + 22 * 60 + 4;
  const clock = (s) =>
    [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
  const show = () => {
    card.querySelector('[data-elapsed]').textContent = clock(elapsed);
    card.querySelector('[data-remaining]').textContent = clock(Math.max(GOAL - elapsed, 0));
    card.style.setProperty('--progress', Math.min(elapsed / GOAL, 1));
  };
  show();
  if (!still) {
    setInterval(() => {
      elapsed += 1;
      show();
    }, 1000);
  }
}

// The goal in the hero scrambles from one fasting schedule to the next.
const cycle = document.querySelector('[data-cycle]');
if (cycle && !still) {
  const words = cycle.dataset.cycle.split('|');
  const glyphs = '0123456789:hD';
  let index = 0;
  setInterval(() => {
    index = (index + 1) % words.length;
    const word = words[index];
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      cycle.textContent = [...word]
        .map((ch, i) => (i < frame / 2 ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join('');
      if (frame / 2 >= word.length) {
        clearInterval(timer);
        cycle.textContent = word;
      }
    }, 40);
  }, 2600);
}

// Sections rise in once, as they come into view.
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
    { rootMargin: '0px 0px -12% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Feature phones lean back as they rise past the middle of the screen.
const phones = [...document.querySelectorAll('.feature .phone')];
if (!still && phones.length) {
  let queued = false;
  const lean = () => {
    queued = false;
    const mid = innerHeight / 2;
    for (const phone of phones) {
      const r = phone.getBoundingClientRect();
      const offset = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / innerHeight));
      const side = phone.closest('.feature').matches(':nth-of-type(odd)') ? -1 : 1;
      phone.style.setProperty('--rx', `${offset * 10}deg`);
      phone.style.setProperty('--ry', `${side * (8 - Math.abs(offset) * 4)}deg`);
    }
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(lean);
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  lean();
}
