const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrance: masthead, nav and the first cards arrive in order.
['.mh-left', '.statement', '.bar', '#work .section-head', '.track > .card'].forEach((sel) =>
  document.querySelectorAll(sel).forEach((el) => el.setAttribute('data-enter', '')),
);
document.querySelectorAll('[data-enter]').forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));

// Clock: the visitor's own time, and Nairobi's when they differ.
const clock = document.querySelector('[data-clock]');
const here = Intl.DateTimeFormat().resolvedOptions().timeZone;
const city = (tz) => tz.split('/').pop().replace(/_/g, ' ');
const fmt = (tz) => new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
const tick = () => {
  const now = new Date();
  const nbo = `Nairobi · ${fmt('Africa/Nairobi').format(now)}`;
  clock.textContent = here === 'Africa/Nairobi' ? nbo : `${city(here)} · ${fmt(here).format(now)} — mine: ${nbo}`;
};
tick();
setInterval(tick, 30000);

// Track arrows scroll one card at a time.
const track = document.querySelector('.track');
document.querySelectorAll('[data-scroll]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const card = track.querySelector('.card');
    const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: step * Number(btn.dataset.scroll), behavior: reduced ? 'auto' : 'smooth' });
  }),
);

// Details + / −
document.querySelectorAll('[data-details]').forEach((btn) => {
  const panel = btn.closest('.card').querySelector('.details');
  btn.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Details −' : 'Details +';
  });
});

// 04 deck tilts toward the pointer.
document.querySelectorAll('[data-tilt]').forEach((stage) => {
  const deck = stage.firstElementChild;
  if (reduced) return;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    deck.style.setProperty('--ry', `${x * 18}deg`);
    deck.style.setProperty('--rx', `${-y * 14}deg`);
  });
  stage.addEventListener('pointerleave', () => {
    deck.style.setProperty('--ry', '0deg');
    deck.style.setProperty('--rx', '0deg');
  });
});

// 06 terminal types its command once it scrolls into view.
document.querySelectorAll('[data-type]').forEach((el) => {
  const text = el.dataset.type;
  if (reduced) return void (el.textContent = text);
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    let i = 0;
    const id = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(id);
        el.insertAdjacentHTML('afterend', "\n<span class='muted'>Cloning into 'Walenje'… done.</span>\n<span class='muted'>$</span> ");
      }
    }, 45);
  }).observe(el);
});

// Playground 01: a damped spring, integrated per frame.
(() => {
  const box = document.querySelector('.spring-box');
  const puck = box.querySelector('.puck');
  const path = document.querySelector('.spring-plot path');
  const kIn = document.querySelector('[data-k]');
  const cIn = document.querySelector('[data-c]');
  let x = 0, y = 0, vx = 0, vy = 0, dragging = false, raf = 0, ox = 0, oy = 0;
  const place = () => {
    puck.style.setProperty('--x', `${x}px`);
    puck.style.setProperty('--y', `${y}px`);
  };
  // The plot shows how far a 1-unit pull overshoots and settles.
  const plot = () => {
    const k = +kIn.value, c = +cIn.value;
    let p = 1, v = 0;
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const a = -k * p - c * v;
      v += a / 120;
      p += v / 120;
      pts.push(`${(i / 120) * 200},${30 - p * 24}`);
    }
    path.setAttribute('d', `M${pts.join(' L')}`);
  };
  const step = () => {
    const k = +kIn.value, c = +cIn.value, dt = 1 / 60;
    vx += (-k * x - c * vx) * dt;
    vy += (-k * y - c * vy) * dt;
    x += vx * dt;
    y += vy * dt;
    place();
    if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > 0.05) raf = requestAnimationFrame(step);
    else { x = y = vx = vy = 0; place(); }
  };
  const release = () => {
    if (reduced) { x = y = 0; place(); return; }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
  };
  puck.addEventListener('pointerdown', (e) => {
    dragging = true;
    cancelAnimationFrame(raf);
    ox = e.clientX - x;
    oy = e.clientY - y;
    puck.setPointerCapture(e.pointerId);
  });
  puck.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = box.getBoundingClientRect();
    x = Math.max(-r.width / 2 + 22, Math.min(r.width / 2 - 22, e.clientX - ox));
    y = Math.max(-r.height / 2 + 22, Math.min(r.height / 2 - 22, e.clientY - oy));
    place();
  });
  puck.addEventListener('pointerup', () => { dragging = false; vx = vy = 0; release(); });
  puck.addEventListener('keydown', (e) => {
    const d = { ArrowLeft: [-60, 0], ArrowRight: [60, 0], ArrowUp: [0, -40], ArrowDown: [0, 40] }[e.key];
    if (!d) return;
    e.preventDefault();
    x += d[0]; y += d[1]; place(); release();
  });
  [kIn, cIn].forEach((input) => input.addEventListener('input', plot));
  plot();
})();

// Playground 02: tokens drive the listing card through custom properties.
(() => {
  const stage = document.querySelector('.stage-tokens');
  const card = stage.querySelector('.listing');
  const PALETTES = {
    tajji: { bg: '#f1f1f1', card: '#fff', fg: '#1f1f1f', accent: '#04054d', btn: '#e88c00', btnFg: '#02032e' },
    mono: { bg: '#e7e7e7', card: '#fafafa', fg: '#111', accent: '#2a2a2a', btn: '#111', btnFg: '#fff' },
    garden: { bg: '#e6efe6', card: '#fbfdf9', fg: '#183018', accent: '#24a148', btn: '#183018', btnFg: '#e6efe6' },
  };
  const apply = (token, v) => {
    if (token === 'radius') card.style.setProperty('--r', `${v}px`);
    if (token === 'space') card.style.setProperty('--s', `${v}px`);
    if (token === 'palette') {
      const p = PALETTES[v];
      stage.style.setProperty('--t-bg', p.bg);
      card.style.setProperty('--t-card', p.card);
      card.style.setProperty('--t-fg', p.fg);
      card.style.setProperty('--t-accent', p.accent);
      card.style.setProperty('--t-btn', p.btn);
      card.style.setProperty('--t-btn-fg', p.btnFg);
    }
  };
  document.querySelectorAll('[data-tokens] .seg').forEach((seg) => {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply(seg.dataset.token, b.dataset.v);
    });
  });
})();

// Playground 03: bill + payment as double-entry lines that must balance.
(() => {
  const rentIn = document.querySelector('[data-rent]');
  const svcIn = document.querySelector('[data-service]');
  const paidIn = document.querySelector('[data-paid]');
  const body = document.querySelector('.ledger tbody');
  const foot = document.querySelector('.ledger tfoot');
  const n = (v) => Math.max(0, Math.round(+v || 0));
  const f = (v) => (v ? v.toLocaleString('en-KE') : '');
  const render = () => {
    const rent = n(rentIn.value), svc = n(svcIn.value), paid = n(paidIn.value);
    const billed = rent + svc;
    const groups = [
      ['Invoice · November', [['Rent receivable · A4', billed, 0], ['Rental income', 0, rent], ['Service charge income', 0, svc]]],
      ['Payment · M-Pesa', [['M-Pesa clearing', paid, 0], ['Rent receivable · A4', 0, paid]]],
    ];
    let dr = 0, cr = 0, i = 0;
    body.innerHTML = groups
      .map(([title, lines]) =>
        `<tr class="group"><td colspan="3">${title}</td></tr>` +
        lines.map(([acct, d, c]) => { dr += d; cr += c; return `<tr class="line" style="--i:${i++}"><td>${acct}</td><td>${f(d)}</td><td>${f(c)}</td></tr>`; }).join(''),
      )
      .join('');
    const due = billed - paid;
    foot.innerHTML = `<tr><td>${due > 0 ? `Tenant owes ${f(due)}` : due < 0 ? `Credit ${f(-due)}` : 'Settled'}</td><td>${f(dr)}</td><td>${f(cr)}</td></tr>
      <tr><td colspan="3" class="${dr === cr ? 'ok' : ''}">${dr === cr ? 'Balanced ✓ Dr = Cr' : 'Out of balance'}</td></tr>`;
  };
  [rentIn, svcIn, paidIn].forEach((el) => el.addEventListener('input', render));
  render();
})();


// ---------- v2 ----------
const root = document.documentElement;
const views = [...document.querySelectorAll('.view')];
const viewLinks = document.querySelectorAll('[data-view-link]');

function viewFromHash() {
  const m = location.hash.match(/^#\/(about|case)/);
  return m ? m[1] : 'home';
}
function applyView(name) {
  views.forEach((v) => (v.hidden = v.dataset.view !== name));
  root.dataset.view = name;
  viewLinks.forEach((l) => (l.dataset.viewLink === name ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current')));
}
function go(name, scrollTarget) {
  const update = () => {
    applyView(name);
    if (scrollTarget) document.getElementById(scrollTarget)?.scrollIntoView();
    else window.scrollTo(0, 0);
  };
  // Same-document view transition where supported; plain swap otherwise.
  if (!document.startViewTransition || reduced) update();
  else {
    const vt = document.startViewTransition(update);
    // A skipped transition (e.g. a hidden tab) still runs update(); ignore the rejection.
    vt.ready.catch(() => {});
    vt.finished.catch(() => {});
  }
}
window.addEventListener('hashchange', () => {
  // In-page anchors (#cs-…) are handled by the browser; only routes switch views.
  if (!location.hash.startsWith('#/') && location.hash !== '') return;
  go(viewFromHash());
});
applyView(viewFromHash());

// "Ledger toy" link in the case study jumps back to the Playground.
document.querySelectorAll('[data-goto]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState(null, '', '#/');
    go('home', a.dataset.goto);
  }),
);

// Theme toggle
const themeBtn = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('[data-theme-label]');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  themeLabel.textContent = t === 'dark' ? 'Light' : 'Dark';
  try { localStorage.setItem('pg-theme', t); } catch {}
}
setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// Intro: once per visit, skippable, never under reduced motion.
(() => {
  const intro = document.querySelector('.intro');
  let seen = false;
  try { seen = sessionStorage.getItem('pg-intro') === '1'; } catch {}
  if (seen || reduced || location.hash.length > 2) return;
  const text = intro.querySelector('[data-intro-text]');
  text.innerHTML = [...text.textContent]
    .map((ch, i) => {
      const r = () => (Math.random() - 0.5);
      return ch === ' ' ? ' ' : `<span style="--i:${i};--dx:${r() * 60}vw;--dy:${r() * 60}vh;--rot:${r() * 140}deg">${ch}</span>`;
    })
    .join('');
  intro.hidden = false;
  const done = () => {
    intro.classList.add('is-done');
    try { sessionStorage.setItem('pg-intro', '1'); } catch {}
  };
  intro.querySelector('.intro-skip').addEventListener('click', done);
  document.addEventListener('keydown', done, { once: true });
  setTimeout(done, 2400);
})();

// Case study scrollspy
(() => {
  const links = new Map([...document.querySelectorAll('.case-index a')].map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        links.get(e.target.id)?.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  document.querySelectorAll('[data-spy]').forEach((s) => spy.observe(s));
  links.forEach((a, id) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }),
  );
  links.values().next().value?.setAttribute('aria-current', 'true');
})();

// Ticker: duplicate the run so the loop is seamless.
document.querySelectorAll('.ticker-track').forEach((t) => (t.innerHTML += t.innerHTML));

// Equator day: drag through a day in Nairobi.
(() => {
  const sky = document.querySelector('[data-sky]');
  const range = document.querySelector('[data-sky-range]');
  const label = document.querySelector('[data-sky-time]');
  if (!sky) return;
  const RISE = 6.5 * 60, SET = 18.67 * 60;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c) => `rgb(${c.join(',')})`;
  const NIGHT = [12, 16, 48], DAWN = [244, 160, 110], DAY = [140, 196, 236];
  const render = () => {
    const m = +range.value;
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    label.textContent = `${h}:${String(m % 60).padStart(2, '0')}`;
    const day = (m - RISE) / (SET - RISE);
    const edge = Math.min(Math.abs(m - RISE), Math.abs(m - SET)) / 60;
    let c;
    if (day < 0 || day > 1) c = edge < 1 ? mix(DAWN, NIGHT, edge) : NIGHT;
    else c = edge < 1 ? mix(DAWN, DAY, edge) : DAY;
    sky.style.setProperty('--sky', rgb(c));
    sky.style.setProperty('--ground', rgb(mix([20, 24, 20], [47, 59, 42], day < 0 || day > 1 ? 0 : 1 - Math.max(0, 1 - edge))));
    const t = Math.min(Math.max(day, 0), 1);
    sky.style.setProperty('--sun-x', 0.1 + t * 0.8);
    sky.style.setProperty('--sun-y', 0.72 - Math.sin(t * Math.PI) * 0.55);
    sky.style.setProperty('--sun-o', day < -0.02 || day > 1.02 ? 0 : 1);
    sky.style.setProperty('--sun', edge < 1 ? '#ffb15c' : '#ffe08a');
  };
  const nbo = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  range.value = +nbo.find((p) => p.type === 'hour').value * 60 + +nbo.find((p) => p.type === 'minute').value;
  range.addEventListener('input', render);
  render();
})();

// Swahili word of the day
(() => {
  const WORDS = [
    ['boma', 'homestead, enclosure · the Boma in BomaOS'],
    ['jirani', 'neighbour · the tenant app'],
    ['nyumba', 'house, home'],
    ['kodi', 'rent; also tax'],
    ['mtaa', 'neighbourhood, street'],
    ['ufunguo', 'key'],
    ['karibu', 'welcome; also near'],
    ['mpangaji', 'tenant'],
  ];
  const term = document.querySelector('[data-word]');
  const gloss = document.querySelector('[data-word-gloss]');
  const start = new Date(new Date().getFullYear(), 0, 0);
  let i = Math.floor((Date.now() - start) / 864e5) % WORDS.length;
  const show = () => {
    term.textContent = WORDS[i][0];
    gloss.textContent = WORDS[i][1];
  };
  document.querySelector('[data-word-next]').addEventListener('click', () => {
    i = (i + 1) % WORDS.length;
    show();
  });
  show();
})();
