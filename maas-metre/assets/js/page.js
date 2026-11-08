// The page's small motions: the hero card's figures counting up, the raise
// to try out, sections that rise in as they arrive and phones that lean as
// they pass. Without scripts every figure is already written in the page.

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

const number = (value, decimals = 0) =>
  new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

// The hero card counts up to what the salary buys this month.
const counters = document.querySelectorAll('[data-count]');
if (!still && counters.length) {
  const DURATION = 1600;
  const DELAY = 700;
  const begin = performance.now() + DELAY;
  const step = (time) => {
    const progress = Math.min(Math.max((time - begin) / DURATION, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    for (const el of counters) {
      el.textContent = number(Number(el.dataset.count) * eased, Number(el.dataset.decimals || 0));
    }
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// The raise to try: the same sum the app's raise screen does, on the salary
// in the screenshots. Its dollar value has fallen since it began, and a raise
// of NEEDED in lira is what brings it back.
const demo = document.querySelector('[data-demo]');
if (demo) {
  const SALARY = Number(demo.dataset.salary);
  const NEEDED = Number(demo.dataset.needed);
  const input = demo.querySelector('input[type="range"]');
  const out = (name) => demo.querySelector(`[data-${name}]`);

  const show = () => {
    const percent = Number(input.value);
    const raise = percent / 100;
    const change = (1 + raise) / (1 + NEEDED) - 1;
    out('raise').textContent = `%${number(percent, percent % 1 ? 1 : 0)}`;
    out('salary').textContent = `₺${number(Math.round(SALARY * (1 + raise)))}`;

    const usd = out('usd');
    const level = Math.abs(change) < 0.001;
    usd.textContent = level
      ? 'Korunuyor'
      : `%${number(Math.abs(change) * 100, 1)} ${change < 0 ? 'eriyor' : 'artıyor'}`;
    usd.className = level ? '' : change < 0 ? 'loss' : 'gain';

    out('verdict').textContent = level
      ? 'Başa baş: dolar karşılığın korunuyor.'
      : change < 0
        ? `Kurun gerisinde: en az %${number(NEEDED * 100, 1)} gerekiyor.`
        : 'Kurun önünde: dolar karşılığın artıyor.';
    demo.style.setProperty('--fill', `${(Number(input.value) / Number(input.max)) * 100}%`);
  };
  input.addEventListener('input', show);
  show();
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
