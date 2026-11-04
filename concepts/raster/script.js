// Systems list drives the "In use" devices; G toggles the grid overlay.
const phone = document.querySelector('[data-device="phone"]');
const browser = document.querySelector('[data-device="browser"]');
const captions = {
  phone: document.querySelector('[data-caption="phone"]'),
  browser: document.querySelector('[data-caption="browser"]'),
};
const systemButtons = document.querySelectorAll('.systems button');

function select(button) {
  systemButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
  const name = button.querySelector('b').textContent;
  if (button.dataset.phone) {
    window.TajjiScreens.show(phone, button.dataset.phone);
    captions.phone.textContent = name;
  }
  if (button.dataset.browser) {
    window.TajjiScreens.show(browser, button.dataset.browser);
    captions.browser.textContent = name;
  }
}

systemButtons.forEach((button) => {
  button.addEventListener('click', () => select(button));
  button.addEventListener('mouseenter', () => select(button));
  button.addEventListener('focus', () => select(button));
});

// Tapping through a device updates its caption to match.
const LABELS = {
  'bomaos-overview': 'BomaOS · portfolio overview',
  'bomaos-record': 'BomaOS · record a payment',
  'bomaos-receipt': 'BomaOS · receipt and ledger entry',
  'jirani-pay': 'Jirani · pay rent',
  'identity-verify': 'Identity verification · ID scan',
  'console-agreement': 'BomaOS Console · commissioning, agreement',
  'console-plan': 'BomaOS Console · commissioning, plan',
  'console-payment': 'BomaOS Console · commissioning, payment',
  'console-welcome': 'BomaOS Console · commissioned',
  'sceptre-tokens': 'Sceptre · tokens and type scale',
};
document.addEventListener('screenchange', (e) => {
  const which = e.target === phone ? 'phone' : 'browser';
  captions[which].textContent = LABELS[e.detail] ?? '';
});

// Stagger the entrance in reading order.
document.querySelectorAll('.grid > .cell, .in-use > .cell').forEach((cell, i) => cell.style.setProperty('--i', i));

// Grid overlay
const overlay = document.querySelector('.overlay');
const toggle = document.querySelector('.grid-toggle');
function setGrid(on) {
  overlay.hidden = !on;
  overlay.style.height = `${document.documentElement.scrollHeight}px`;
  toggle.setAttribute('aria-pressed', String(on));
}
toggle.addEventListener('click', () => setGrid(overlay.hidden));
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest('input, textarea')) return;
  setGrid(overlay.hidden);
});

// Nairobi clock
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' });
const tick = () => (clock.textContent = `Nairobi ${fmt.format(new Date())}`);
tick();
setInterval(tick, 30000);
