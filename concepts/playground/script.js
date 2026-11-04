const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrance: masthead, nav and the first cards arrive in order.
['.mh-left', '.statement', '.bar', '#work .section-head', '.track > .card'].forEach((sel) =>
  document.querySelectorAll(sel).forEach((el) => el.setAttribute('data-enter', '')),
);
document.querySelectorAll('[data-enter]').forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));

// Nairobi clock
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: true });
const tick = () => (clock.textContent = fmt.format(new Date()));
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
