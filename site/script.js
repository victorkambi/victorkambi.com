const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Stagger indexes for the entrance animation (see [data-stagger] in
// styles.css). A numeric attribute value offsets the first index.
function setupStagger(scope) {
  const containers = [...scope.querySelectorAll('[data-stagger]')];
  if (scope.matches?.('[data-stagger]')) containers.unshift(scope);
  containers.forEach((container) => {
    let i = Number(container.dataset.stagger) || 0;
    [...container.children].forEach((child) => child.style.setProperty('--i', i++));
  });
}

// Hover highlight: one shared pill that glides between rows.
function setupHoverList(container) {
  const highlight = document.createElement('div');
  highlight.className = 'hover-highlight';
  container.prepend(highlight);

  container.querySelectorAll('.row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      highlight.style.width = row.offsetWidth + 'px';
      highlight.style.height = row.offsetHeight + 'px';
      highlight.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
      highlight.style.opacity = '1';
    });
  });

  container.addEventListener('mouseleave', () => {
    highlight.style.opacity = '0';
  });
}

setupStagger(document);
document.querySelectorAll('.hover-list').forEach(setupHoverList);
// The first-load entrance (rail + first panel) runs once.
setTimeout(() => root.classList.remove('is-loading'), 1400);

// <div data-include="#work"> pulls that section from the homepage, so the
// 404 page shows the real Work list without a second copy to keep in sync.
document.querySelectorAll('[data-include]').forEach(async (slot) => {
  try {
    const res = await fetch('/');
    if (!res.ok) return;
    const page = new DOMParser().parseFromString(await res.text(), 'text/html');
    const source = page.querySelector(slot.dataset.include);
    if (!source) return;
    const section = document.importNode(source, true);
    section.classList.remove('hidden-panel');
    section.classList.add('focus-in');
    // Continue the entrance after whatever precedes the slot.
    section.dataset.stagger = String(slot.previousElementSibling?.children.length ?? 0);
    slot.replaceWith(section);
    setupStagger(section);
    if (section.matches('.hover-list')) setupHoverList(section);
  } catch {
    // Offline or blocked: the page still has its own "Back to work" link.
  }
});

// Tabs: the URL hash (#work / #about) picks the panel, so sections can
// be linked to and the back button works.
const navLinks = document.querySelectorAll('nav.site a[data-tab]');
const panels = document.querySelectorAll('.tab-panel');
const themeColor = document.querySelector('meta[name="theme-color"]');
const THEME_COLORS = { work: '#D9D9D9', about: '#F9D2D4' };
const EXIT_MS = 260;
let switching = false;

function tabFromHash() {
  const id = location.hash.slice(1);
  return [...navLinks].some((l) => l.dataset.tab === id) ? id : 'work';
}

function setActive(targetId) {
  root.dataset.experience = targetId;
  themeColor?.setAttribute('content', THEME_COLORS[targetId]);
  navLinks.forEach((l) => {
    const active = l.dataset.tab === targetId;
    l.classList.toggle('active', active);
    if (active) l.setAttribute('aria-current', 'true');
    else l.removeAttribute('aria-current');
  });
}

function showPanel(targetId, animate) {
  panels.forEach((panel) => {
    panel.classList.remove('focus-out', 'focus-in');
    if (panel.id === targetId) {
      panel.classList.remove('hidden-panel');
      if (animate) {
        void panel.offsetWidth;
        panel.classList.add('focus-in');
      }
    } else {
      panel.classList.add('hidden-panel');
    }
  });
}

// Tabs further down the nav count as "down", so motion follows the list.
function tabIndex(id) {
  return [...navLinks].findIndex((l) => l.dataset.tab === id);
}

function switchTo(targetId) {
  if (switching || root.dataset.experience === targetId) return;
  const current = document.querySelector('.tab-panel:not(.hidden-panel)');
  root.classList.remove('is-loading');
  root.dataset.direction = tabIndex(targetId) > tabIndex(root.dataset.experience) ? 'down' : 'up';
  switching = true;
  setActive(targetId);
  if (current && !reducedMotion.matches) {
    current.classList.add('focus-out');
    setTimeout(() => {
      showPanel(targetId, true);
      switching = false;
    }, EXIT_MS);
  } else {
    showPanel(targetId, true);
    switching = false;
  }
}

if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Update the URL without the browser jumping to the section.
      e.preventDefault();
      const targetId = link.dataset.tab;
      if (switching || root.dataset.experience === targetId) return;
      history.pushState(null, '', `#${targetId}`);
      switchTo(targetId);
    });
  });

  window.addEventListener('popstate', () => switchTo(tabFromHash()));

  const initial = tabFromHash();
  if (initial !== 'work') {
    setActive(initial);
    showPanel(initial, true);
    window.scrollTo(0, 0);
  }
}

// Footer clock in Nairobi time.
const timeEl = document.getElementById('local-time');
const clockFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Africa/Nairobi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
function updateClock() {
  if (timeEl) timeEl.textContent = `${clockFormatter.format(new Date())} UTC+3`;
}
updateClock();
setInterval(updateClock, 30000);
