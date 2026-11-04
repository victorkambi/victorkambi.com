// Rooms: #/ , #/work , #/systems(/<entry>) , #/about. Each room has its
// own palette (styles.css); switching blends the palette, swaps the
// shared header title and settles the new room's cells in order.
const root = document.documentElement;
const rooms = [...document.querySelectorAll('.room')];
const title = document.querySelector('h1[data-title]');
const links = document.querySelectorAll('[data-room-link]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = null;

function parse() {
  const [, room = 'home', anchor] = location.hash.match(/^#\/(\w*)\/?(\w*)/) || [];
  return { room: rooms.some((r) => r.dataset.room === room) ? room : 'home', anchor };
}

function indexCells(room) {
  let i = 0;
  room.querySelectorAll(':scope > *').forEach((el) => {
    if (el.classList.contains('entry')) el.querySelectorAll(':scope > *').forEach((c) => c.style.setProperty('--i', i++));
    else el.style.setProperty('--i', i++);
  });
}

function show(name, anchor, animate) {
  const next = rooms.find((r) => r.dataset.room === name);
  const prev = rooms.find((r) => !r.hidden);
  links.forEach((l) => (l.dataset.roomLink === name ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current')));
  root.dataset.room = name;
  document.title = `${next.dataset.title} — Victor Kambi — Concept: Raster`;

  const enter = () => {
    rooms.forEach((r) => (r.hidden = r !== next));
    title.textContent = next.dataset.title;
    if (animate && !reduced.matches) {
      title.classList.remove('is-swapping');
      next.classList.remove('is-entering');
      void next.offsetWidth;
      title.classList.add('is-swapping');
      next.classList.add('is-entering');
    }
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    else if (animate) window.scrollTo({ top: 0 });
    if (!overlay.hidden) sizeOverlay();
  };

  if (prev && prev !== next && animate && !reduced.matches) {
    prev.classList.add('is-leaving');
    setTimeout(() => {
      prev.classList.remove('is-leaving');
      enter();
    }, 180);
  } else {
    enter();
  }
  current = name;
}

rooms.forEach(indexCells);
window.addEventListener('hashchange', () => {
  const { room, anchor } = parse();
  show(room, anchor, room !== current);
});

// Grid overlay (G)
const overlay = document.querySelector('.overlay');
const toggle = document.querySelector('.grid-toggle');
function sizeOverlay() {
  overlay.style.height = `${document.documentElement.scrollHeight}px`;
}
function setGrid(on) {
  overlay.hidden = !on;
  if (on) sizeOverlay();
  toggle.setAttribute('aria-pressed', String(on));
}
toggle.addEventListener('click', () => setGrid(overlay.hidden));
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest('input, textarea')) return;
  setGrid(overlay.hidden);
});

// Nairobi clock
const clock = document.querySelector('[data-clock]');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' });
const tick = () => (clock.textContent = `Nairobi ${fmt.format(new Date())}`);
tick();
setInterval(tick, 30000);

const initial = parse();
show(initial.room, initial.anchor, true);
