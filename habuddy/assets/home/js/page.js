// The page's small motions: notifications arriving over the hero, the week to
// try out, sections rising in, phones leaning as they pass. Without scripts
// every part of the page is already there.

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FACES = 'assets/home/img/faces/';

// What a crew's phones light up with during a week.
const EVENTS = [
  ['jessi', 'Jessi checked in', '5K before coffee. Worth it.'],
  ['mia', 'Mia nudged you 👋', 'Move 30 minutes'],
  ['zoe', 'Zoe: Race day with 4,000 people', 'Move 30 minutes'],
  ['noah', 'Noah commented', 'Okay, I’m going tomorrow. Promise.'],
  ['ava', 'Ava checked in', 'Weekend energy ☀️'],
  ['liam', 'Liam checked in', 'Leg day, no excuses'],
];

const toast = document.querySelector('.toast');
if (toast && !still) {
  const face = toast.querySelector('[data-toast-face]');
  const title = toast.querySelector('[data-toast-title]');
  const body = toast.querySelector('[data-toast-body]');
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    toast.classList.add('out');
    setTimeout(() => {
      i = (i + 1) % EVENTS.length;
      const [who, head, text] = EVENTS[i];
      face.src = `${FACES}${who}.webp`;
      title.textContent = head;
      body.textContent = text;
      toast.classList.remove('out');
    }, 450);
  }, 3400);
}

// The week to try: your square for today, and a bell for Liam.
const demo = document.querySelector('[data-demo]');
if (demo) {
  const status = demo.querySelector('[data-status]');
  const slot = demo.querySelector('[data-checkin]');
  const bell = demo.querySelector('[data-nudge]');
  let checked = false;
  let nudged = false;
  const say = () => {
    status.textContent =
      checked && nudged
        ? 'You’re in, and Liam got his nudge. Now it’s on him.'
        : checked
          ? 'You’re in. Liam is the only one left.'
          : nudged
            ? 'Liam got “Mia nudged you 👋”. Your square is still empty.'
            : 'Two of you are still out.';
  };
  slot.addEventListener('click', () => {
    if (checked) return;
    checked = true;
    slot.classList.add('done');
    slot.setAttribute('aria-label', 'Checked in today');
    say();
  });
  bell.addEventListener('click', () => {
    if (nudged) return;
    nudged = true;
    bell.classList.add('sent');
    bell.setAttribute('aria-label', 'Liam nudged');
    say();
  });
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

// Phones lean a little as the page scrolls past them.
const phones = document.querySelectorAll('.phone.tilt');
if (!still && phones.length) {
  let ticking = false;
  const lean = () => {
    ticking = false;
    for (const phone of phones) {
      const r = phone.getBoundingClientRect();
      const mid = (r.top + r.height / 2) / innerHeight - 0.5;
      const flip = phone.closest('.flip') ? 1 : -1;
      phone.style.setProperty('--ry', `${flip * (8 + mid * 10)}deg`);
      phone.style.setProperty('--rx', `${4 - mid * 8}deg`);
    }
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(lean);
    }
  }, { passive: true });
  lean();
}
