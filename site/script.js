const root = document.documentElement;

// Hover highlight: one shared pill that glides between rows.
document.querySelectorAll('.hover-list').forEach((container) => {
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
});

// Tabs: the URL hash (#work / #about) picks the panel, so sections can
// be linked to and the back button works.
const navLinks = document.querySelectorAll('nav.site a[data-tab]');
const panels = document.querySelectorAll('.tab-panel');
const themeColor = document.querySelector('meta[name="theme-color"]');
const THEME_COLORS = { work: '#D9D9D9', about: '#F9D2D4' };
const EXIT_MS = 380;
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

function switchTo(targetId) {
  if (switching || root.dataset.experience === targetId) return;
  const current = document.querySelector('.tab-panel:not(.hidden-panel)');
  switching = true;
  setActive(targetId);
  if (current) {
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
    showPanel(initial, false);
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
