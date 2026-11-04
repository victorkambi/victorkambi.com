// Rebuilt, generic product screens for BomaOS, Jirani, BomaOS Console
// and Sceptre, drawn with brand.css. Mount a device with:
//   <div data-device="phone" data-screens="bomaos-overview,bomaos-record"></div>
// Buttons inside a screen with data-go="<screen>" move between screens.
// Figures and names are illustrative, not real customer data.

const steps = (current) => {
  const names = ['Agreement', 'Plan', 'Payment', 'Welcome'];
  const ids = ['console-agreement', 'console-plan', 'console-payment', 'console-welcome'];
  return `<ol class="ui-steps">${names
    .map((n, i) => {
      const state = i === current ? ' aria-current="step"' : '';
      const done = i < current ? ' class="is-done"' : '';
      return `<li><button type="button" data-go="${ids[i]}"${state}${done}><i>${i < current ? '✓' : i + 1}</i>${n}</button></li>`;
    })
    .join('')}</ol>`;
};

const consoleShell = (current, body) => `
  <div class="ui-split">
    <div class="ui-side"><b>BomaOS Console</b><span aria-current="page">Commissioning</span><span>Billing</span><span>Members</span><span>Settings</span></div>
    <div style="display:flex;flex-direction:column;gap:1.4em;min-width:0">${steps(current)}${body}</div>
  </div>`;

const SCREENS = {
  'bomaos-overview': `
    <div class="ui-top"><div><div class="ui-eyebrow">Kilimani Heights · 50 units</div><h3 class="ui-title">Good morning</h3></div><span class="ui-chip is-gold">Nov</span></div>
    <div class="ui-card"><div class="ui-eyebrow">Collected this month</div><div class="ui-big">KES 1.28M</div>
      <div class="ui-bar" style="margin:.7em 0 .4em"><b style="width:84%"></b></div><div class="ui-eyebrow">84% of KES 1.52M · 46/50 occupied</div></div>
    <div class="ui-card ui-grow"><div class="ui-eyebrow">Due this week</div>
      <div class="ui-row"><div>Unit A4<small>Due Friday</small></div><b>32,000</b></div>
      <div class="ui-row"><div>Unit B2<small>5 days late</small></div><span class="ui-chip is-red">Overdue</span></div>
      <div class="ui-row"><div>Unit C7<small>Due Saturday</small></div><b>28,500</b></div></div>
    <button class="ui-btn" type="button" data-go="bomaos-record">＋ Record payment</button>`,

  'bomaos-record': `
    <div class="ui-top"><button class="ui-chip" type="button" data-go="bomaos-overview">← Back</button><span class="ui-eyebrow">Record payment</span></div>
    <h3 class="ui-title">Unit A4</h3>
    <div class="ui-field"><small>Amount</small><b>KES 32,000</b></div>
    <div class="ui-seg" data-seg><button class="ui-chip" type="button" aria-pressed="true">M-Pesa</button><button class="ui-chip" type="button" aria-pressed="false">Bank</button><button class="ui-chip" type="button" aria-pressed="false">Cash</button></div>
    <div class="ui-field"><small>Reference</small><b>QJK7H2LP9X</b></div>
    <div class="ui-field"><small>Period</small><b>November rent</b></div>
    <div class="ui-grow"></div>
    <button class="ui-btn is-navy" type="button" data-go="bomaos-receipt">Record payment</button>`,

  'bomaos-receipt': `
    <div class="ui-check">✓</div>
    <h3 class="ui-title ui-center">Payment recorded</h3>
    <p class="ui-muted ui-center" style="margin:0">KES 32,000 · M-Pesa · QJK7H2LP9X</p>
    <div class="ui-card"><div class="ui-row"><span>Dr Cash · M-Pesa</span><b>32,000</b></div><div class="ui-row"><span>Cr Rent receivable · A4</span><b>32,000</b></div></div>
    <div class="ui-grow"></div>
    <button class="ui-btn" type="button" data-go="bomaos-overview">Done</button>`,

  'jirani-pay': `
    <div class="ui-top"><div><div class="ui-eyebrow">Unit A4 · Kilimani Heights</div><h3 class="ui-title">November rent</h3></div><span class="ui-chip">Due 5 Nov</span></div>
    <div class="ui-card"><div class="ui-big">KES 32,000</div>
      <div class="ui-row"><span>Rent</span><span>30,000</span></div><div class="ui-row"><span>Service charge</span><span>2,000</span></div></div>
    <div class="ui-card"><div class="ui-row"><div>Pay with M-Pesa<small>07•• ••• 214</small></div><span class="ui-chip is-green">Default</span></div></div>
    <div class="ui-grow"></div>
    <div class="ui-swipe" data-swipe><span>Swipe to pay →</span><button type="button" aria-label="Pay KES 32,000 (or drag)">→</button></div>`,

  'identity-verify': `
    <div class="ui-top"><span class="ui-eyebrow">Verify your identity</span><span class="ui-chip">2 of 3</span></div>
    <h3 class="ui-title">Scan your national ID</h3>
    <div class="ui-card ui-grow" style="display:grid;place-items:center;background:var(--tj-navy);color:#fff">
      <div style="width:78%;aspect-ratio:1.58;border:2px dashed var(--tj-gold);border-radius:.8em;display:grid;place-items:center" class="ui-eyebrow">Align the front of your ID</div></div>
    <div class="ui-row"><span>Selfie check</span><span class="ui-chip is-green">Passed</span></div>
    <button class="ui-btn" type="button">Capture</button>`,

  'console-agreement': consoleShell(0, `
    <h3 class="ui-title">Platform agreement</h3>
    <div class="ui-card ui-doc ui-grow"><i style="width:60%"></i><i></i><i></i><i style="width:85%"></i><i></i><i style="width:70%"></i><i></i><i style="width:40%"></i></div>
    <button class="ui-btn is-navy" type="button" data-go="console-plan" style="width:auto;align-self:flex-end">Accept and continue →</button>`),

  'console-plan': consoleShell(1, `
    <h3 class="ui-title">Choose a plan</h3>
    <div class="ui-tiers" data-seg>
      <button class="ui-tier" type="button" aria-pressed="false"><b>Essential</b><span class="ui-muted">Up to 20 units</span></button>
      <button class="ui-tier" type="button" aria-pressed="true"><b>Growth</b><span class="ui-muted">Up to 200 units</span></button>
      <button class="ui-tier" type="button" aria-pressed="false"><b>Enterprise</b><span class="ui-muted">Portfolios at scale</span></button>
    </div>
    <div class="ui-grow"></div>
    <button class="ui-btn is-navy" type="button" data-go="console-payment" style="width:auto;align-self:flex-end">Continue →</button>`),

  'console-payment': consoleShell(2, `
    <h3 class="ui-title">Payment</h3>
    <div class="ui-card"><div class="ui-row"><span>Growth · monthly</span><b>KES 9,900</b></div><div class="ui-row"><span>Coupon LAUNCH</span><span class="ui-chip is-green">−20%</span></div><div class="ui-row"><b>Due today</b><b>KES 7,920</b></div></div>
    <div class="ui-seg" data-seg><button class="ui-chip" type="button" aria-pressed="true">Card · Paystack</button><button class="ui-chip" type="button" aria-pressed="false">M-Pesa</button></div>
    <div class="ui-grow"></div>
    <button class="ui-btn" type="button" data-go="console-welcome" style="width:auto;align-self:flex-end">Pay KES 7,920</button>`),

  'console-welcome': consoleShell(3, `
    <div class="ui-card ui-grow" style="display:grid;align-content:center;gap:.6em;background:var(--tj-navy);color:#fff">
      <span class="ui-chip is-gold" style="justify-self:start">Commissioned</span>
      <div class="ui-big">Welcome to BomaOS</div>
      <p style="margin:0;color:var(--tj-navy-30)">Kilimani Heights is live. Invite your managers and tenants next.</p></div>
    <button class="ui-btn is-ghost" type="button" data-go="console-agreement" style="width:auto;align-self:flex-end">↺ Start over</button>`),

  'sceptre-tokens': `
    <div class="ui-top"><h3 class="ui-title">Sceptre · design tokens</h3><span class="ui-chip">Compose Multiplatform</span></div>
    <div class="ui-swatches"><i style="background:var(--tj-navy)"></i><i style="background:var(--tj-navy-30)"></i><i style="background:var(--tj-gold)"></i><i style="background:var(--tj-gold-10)"></i><i style="background:var(--tj-charcoal)"></i><i style="background:var(--tj-green)"></i></div>
    <div class="ui-card ui-grow" style="display:grid;gap:.2em">
      <div style="font-size:2.2em;font-weight:700;letter-spacing:-.02em">Display 32</div><div style="font-size:1.6em;font-weight:700">Title 24</div><div style="font-size:1.2em;font-weight:500">Subtitle 18</div><div>Body 16 · the quick brown fox</div><div class="ui-muted" style="font-size:.85em">Caption 12 · spacing 4 · 8 · 16 · 32 · 64</div></div>
    <div class="ui-seg"><span class="ui-chip">r4</span><span class="ui-chip">r8</span><span class="ui-chip" aria-pressed="true">r12</span><span class="ui-chip">r16</span><span class="ui-chip">r24</span></div>`,
};

const PHONE_SCREENS = new Set(['bomaos-overview', 'bomaos-record', 'bomaos-receipt', 'jirani-pay', 'identity-verify']);

function show(device, name) {
  device.querySelectorAll('.screen').forEach((s) => {
    s.toggleAttribute('data-active', s.dataset.screen === name);
    s.inert = s.dataset.screen !== name;
  });
  device.dataset.current = name;
  device.dispatchEvent(new CustomEvent('screenchange', { detail: name, bubbles: true }));
}

function setupSwipe(track) {
  const knob = track.querySelector('button');
  const label = track.querySelector('span');
  let startX = 0;
  let max = 0;
  let dragging = false;
  const set = (x) => {
    const p = Math.min(Math.max(x / max, 0), 1);
    track.style.setProperty('--x', `${p * max}px`);
    track.style.setProperty('--p', p);
    return p;
  };
  const finish = () => {
    track.classList.add('is-done');
    track.style.setProperty('--p', 0);
    label.textContent = 'Paid · M-Pesa ✓';
  };
  knob.addEventListener('pointerdown', (e) => {
    dragging = true;
    max = track.clientWidth - knob.offsetWidth - knob.offsetLeft * 2;
    startX = e.clientX;
    knob.setPointerCapture(e.pointerId);
  });
  knob.addEventListener('pointermove', (e) => dragging && set(e.clientX - startX));
  knob.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    if (set(e.clientX - startX) > 0.85) finish();
    else set(0);
  });
  // Keyboard and plain clicks pay straight away.
  knob.addEventListener('click', (e) => e.detail === 0 && finish());
}

function mount(el) {
  const names = el.dataset.screens.split(',').map((s) => s.trim());
  const kind = el.dataset.device;
  el.classList.add('device', `device-${kind}`);
  el.setAttribute('role', 'group');
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Illustrative product screen');
  const bar = kind === 'browser' ? `<div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>${el.dataset.url || 'console.bomaos.com'}</span></div>` : '';
  el.innerHTML = `${bar}<div class="device-body">${names
    .map((n) => `<section class="screen" data-screen="${n}">${SCREENS[n]}</section>`)
    .join('')}</div>`;

  el.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) return show(el, go.dataset.go);
    const option = e.target.closest('[data-seg] > [aria-pressed]');
    if (option) {
      option.parentElement.querySelectorAll('[aria-pressed]').forEach((b) => b.setAttribute('aria-pressed', String(b === option)));
    }
  });
  el.querySelectorAll('[data-swipe]').forEach(setupSwipe);
  show(el, names[0]);
}

document.querySelectorAll('[data-device]').forEach(mount);

window.TajjiScreens = { show, mount, isPhone: (n) => PHONE_SCREENS.has(n) };
