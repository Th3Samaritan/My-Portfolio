/* ============================================================
   coach.js — character-driven motivation engine.

   A collapsible chat panel in the bottom-right corner. Six
   characters from Silicon Valley deliver quotes from Mastery,
   Deep Work, Outliers, Atomic Habits, Show Your Work and
   Elon Musk — triggered by your progress through the GYM.

   Frequency: always on major milestones (level up, lesson
   complete). Otherwise at most once per week.
   ============================================================ */

import * as store from './store.js';
import { escapeHtml, md } from './ui.js';

/* ================================================================ QUOTES ==== */

const QUOTES = {
  consistency: [
    { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', source: 'Atomic Habits — James Clear' },
    { text: 'Habits are the compound interest of self-improvement.', source: 'Atomic Habits — James Clear' },
    { text: 'Every action you take is a vote for the type of person you wish to become.', source: 'Atomic Habits — James Clear' },
    { text: 'Success is the product of daily habits — not once-in-a-lifetime transformations.', source: 'Atomic Habits — James Clear' },
  ],
  struggle: [
    { text: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that must be trained.', source: 'Deep Work — Cal Newport' },
    { text: 'If you do not produce, you will not thrive — no matter how skilled or talented you are.', source: 'Deep Work — Cal Newport' },
    { text: 'Clarity about what matters provides clarity about what does not.', source: 'Deep Work — Cal Newport' },
    { text: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.', source: 'Deep Work — Cal Newport' },
  ],
  breakthrough: [
    { text: 'When something is important enough, you do it even if the odds are not in your favor.', source: 'Elon Musk' },
    { text: 'The first step is to establish that something is possible; then probability will occur.', source: 'Elon Musk' },
    { text: 'Persistence is very important. You should not give up unless you are forced to give up.', source: 'Elon Musk' },
    { text: "Some people don't like change, but you need to embrace change if the alternative is disaster.", source: 'Elon Musk' },
  ],
  start: [
    { text: 'The master is the one who has stayed on the path long after others wandered off.', source: 'Mastery — Robert Greene' },
    { text: 'The future belongs to those who learn more skills and combine them in creative ways.', source: 'Mastery — Robert Greene' },
    { text: 'You must choose something that you are deeply interested in — something that connects to your deepest sense of who you are.', source: 'Mastery — Robert Greene' },
  ],
  complete: [
    { text: 'Teaching people does not subtract value from what you do — it adds to it. When you teach someone how to do your work, you are, in effect, generating more interest in your work.', source: 'Show Your Work — Austin Kleon' },
    { text: 'You can not find your voice if you do not use it.', source: 'Show Your Work — Austin Kleon' },
    { text: "The best way to get started on the path to sharing your work is to think about what you want to learn, and make a commitment to learning it in front of others.", source: 'Show Your Work — Austin Kleon' },
  ],
  idle: [
    { text: 'The best way to predict the future is to invent it.', source: 'Elon Musk' },
    { text: 'Motivation is what gets you started. Habit is what keeps you going.', source: 'Atomic Habits — James Clear' },
    { text: 'Practice is not the thing you do once you are good. It is the thing you do that makes you good.', source: 'Outliers — Malcolm Gladwell' },
  ],
  level_up: [
    { text: 'I think it is possible for ordinary people to choose to be extraordinary.', source: 'Elon Musk' },
    { text: 'The people who are crazy enough to think they can change the world are the ones who do.', source: 'Elon Musk' },
    { text: 'Great companies are built on great products. Great products are built by people who never stop learning.', source: 'Elon Musk' },
  ],
  milestone: [
    { text: "It's very important to like the people you work with. Otherwise, your job is going to be quite miserable.", source: 'Elon Musk' },
    { text: 'In the middle of difficulty lies opportunity.', source: 'Albert Einstein' },
    { text: 'The only way to do great work is to love what you do. If you have not found it yet, keep looking.', source: 'Steve Jobs' },
  ],
};

/* ============================================================== CHARACTERS == */

const CHARS = {
  jared: {
    name: 'Jared',
    color: '#22c55e',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="36" r="16" fill="#fcd9b8"/>
  <rect x="26" y="56" width="28" height="18" rx="4" fill="#1e293b"/>
  <rect x="32" y="28" width="16" height="4" rx="2" fill="#1e293b"/>
  <rect x="28" y="18" width="24" height="6" rx="3" fill="#4a3728"/>
  <circle cx="35" cy="36" r="2" fill="#1e293b"/>
  <circle cx="45" cy="36" r="2" fill="#1e293b"/>
  <path d="M34 42 Q40 46 46 42" stroke="#1e293b" stroke-width="1.5" fill="none"/>
  <line x1="30" y1="24" x2="30" y2="7" stroke="#4a3728" stroke-width="1.5"/>
  <ellipse cx="40" cy="36" rx="4" ry="3" fill="none" stroke="#fcd9b8" stroke-width="6"/>
</svg>`,
  },
  gilfoyle: {
    name: 'Gilfoyle',
    color: '#ef4444',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="36" r="14" fill="#f5d6b8"/>
  <rect x="24" y="55" width="32" height="18" rx="4" fill="#111827"/>
  <path d="M22 16 Q40 8 58 16" stroke="#111" stroke-width="5" fill="none"/>
  <path d="M20 14 Q28 6 36 14 Q44 22 52 14 Q60 6 64 14" stroke="#111" stroke-width="5" fill="none"/>
  <rect x="30" y="30" width="20" height="9" rx="3" fill="#111"/>
  <line x1="31" y1="34.5" x2="49" y2="34.5" stroke="#333" stroke-width="1"/>
  <circle cx="34" cy="35" r="1.5" fill="#fff"/>
  <circle cx="46" cy="35" r="1.5" fill="#fff"/>
  <path d="M34 40 Q40 43 46 39" stroke="#111" stroke-width="1.2" fill="none"/>
</svg>`,
  },
  dinesh: {
    name: 'Dinesh',
    color: '#f59e0b',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="36" r="15" fill="#e8b88a"/>
  <rect x="27" y="55" width="26" height="17" rx="4" fill="#1e293b"/>
  <ellipse cx="40" cy="22" rx="14" ry="8" fill="#111"/>
  <ellipse cx="28" cy="35" rx="3" ry="3.5" fill="#fff"/>
  <circle cx="28" cy="36" r="1.5" fill="#333"/>
  <ellipse cx="52" cy="35" rx="3" ry="3.5" fill="#fff"/>
  <circle cx="52" cy="36" r="1.5" fill="#333"/>
  <path d="M30 40 Q40 44 50 40" stroke="#111" stroke-width="1.2" fill="none"/>
  <line x1="33" y1="27" x2="27" y2="30" stroke="#7a5a3a" stroke-width="1.5"/>
  <line x1="47" y1="27" x2="53" y2="30" stroke="#7a5a3a" stroke-width="1.5"/>
</svg>`,
  },
  richard: {
    name: 'Richard',
    color: '#3b82f6',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="36" r="14" fill="#fcd9b8"/>
  <rect x="26" y="54" width="28" height="19" rx="4" fill="#1e293b"/>
  <circle cx="27" cy="20" r="4" fill="#5a3a1a"/>
  <circle cx="36" cy="16" r="4.5" fill="#5a3a1a"/>
  <circle cx="46" cy="16" r="4.5" fill="#5a3a1a"/>
  <circle cx="53" cy="20" r="4" fill="#5a3a1a"/>
  <circle cx="31" cy="23" r="3" fill="#5a3a1a"/>
  <circle cx="49" cy="23" r="3" fill="#5a3a1a"/>
  <ellipse cx="34" cy="35" rx="5" ry="5" fill="none" stroke="#333" stroke-width="1.5"/>
  <ellipse cx="46" cy="35" rx="5" ry="5" fill="none" stroke="#333" stroke-width="1.5"/>
  <circle cx="34" cy="35" r="1.5" fill="#333"/>
  <circle cx="46" cy="35" r="1.5" fill="#333"/>
  <ellipse cx="40" cy="42" rx="4" ry="2" fill="none" stroke="#333" stroke-width="1"/>
</svg>`,
  },
  erlich: {
    name: 'Erlich',
    color: '#a855f7',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="32" r="16" fill="#fcd9b8"/>
  <rect x="26" y="52" width="28" height="20" rx="4" fill="#1e293b"/>
  <path d="M28 34 Q40 28 52 34 Q54 40 52 44 Q44 52 40 54 Q36 52 28 44 Q26 40 28 34Z" fill="#5a3a1a"/>
  <ellipse cx="33" cy="32" rx="3" ry="4" fill="#fff"/>
  <circle cx="33" cy="33" r="1.5" fill="#333"/>
  <ellipse cx="47" cy="32" rx="3" ry="4" fill="#fff"/>
  <circle cx="47" cy="33" r="1.5" fill="#333"/>
  <path d="M35 28 Q33 24 30 26" stroke="#5a3a1a" stroke-width="2" fill="none"/>
  <path d="M45 28 Q47 24 50 26" stroke="#5a3a1a" stroke-width="2" fill="none"/>
  <ellipse cx="40" cy="26" rx="4" ry="2" fill="#fcd9b8"/>
</svg>`,
  },
  monica: {
    name: 'Monica',
    color: '#ec4899',
    avatar: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="36" rx="13" ry="16" fill="#fcd9b8"/>
  <rect x="29" y="56" width="22" height="16" rx="4" fill="#1e293b"/>
  <path d="M16 24 Q30 8 40 10 Q50 8 64 24 Q44 12 16 24Z" fill="#eab308"/>
  <path d="M16 24 Q40 28 64 24" fill="#eab308"/>
  <ellipse cx="33" cy="35" rx="3" ry="4" fill="#fff"/>
  <circle cx="33" cy="36" r="1.5" fill="#333"/>
  <ellipse cx="47" cy="35" rx="3" ry="4" fill="#fff"/>
  <circle cx="47" cy="36" r="1.5" fill="#333"/>
  <path d="M36 42 Q40 46 44 42" stroke="#333" stroke-width="1.2" fill="none"/>
  <line x1="31" y1="44" x2="25" y2="30" stroke="#fcd9b8" stroke-width="5"/>
  <line x1="49" y1="44" x2="55" y2="30" stroke="#fcd9b8" stroke-width="5"/>
</svg>`,
  },
};

/* Character-to-context mapping — each character has distinct opening lines. */
const CONTEXT = {
  streak:       { char: 'erlich',   opening: 'Avato would have IPO\'d by now with that kind of consistency.' },
  struggle:     { char: 'dinesh',   opening: 'I once got stuck on a regex for fourteen hours. You will get through this.' },
  breakthrough: { char: 'gilfoyle', opening: 'Efficient. I would have done it in fewer lines, but this is acceptable.' },
  start:        { char: 'jared',    opening: 'Every legend started with Hello World. Larry Page did. You are on the right path.' },
  complete:     { char: 'richard',  opening: 'Shipping is a feature. You just shipped.' },
  idle:         { char: 'monica',   opening: 'Your next session is queued. Momentum is the real asset — protect it.' },
  level_up:     { char: 'erlich',   opening: 'I am incubating that kind of growth right now. Level up.' },
  milestone:    { char: 'richard',  opening: 'The journey from zero to mastery is a million tiny decisions. This was one of the right ones.' },
};

/* ============================================================= FREQUENCY ==== */

const MAJOR = new Set(['level_up', 'complete', 'milestone', 'streak_7', 'streak_30']);

function shouldShow(context) {
  if (MAJOR.has(context)) return true;
  const last = store.lastQuoteShown();
  if (!last) return true;
  const week = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - last >= week;
}

/* ================================================================ COACH UI == */

let _panel = null;
let _timer = null;

function buildPanel(char, quote, contextEntry) {
  if (_panel) _panel.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'coach-panel coach-enter';
  wrapper.setAttribute('role', 'complementary');
  wrapper.setAttribute('aria-label', 'Coach tip');
  wrapper.innerHTML = `
    <button class="coach-close" aria-label="Dismiss">&times;</button>
    <div class="coach-header">
      <div class="coach-avatar" style="--coach-color:${char.color}">
        ${char.avatar}
      </div>
      <div>
        <div class="coach-name">${escapeHtml(char.name)}</div>
        <div class="coach-tone">${escapeHtml(contextEntry.opening)}</div>
      </div>
    </div>
    <div class="coach-body">
      <div class="coach-quote">
        <span class="coach-quote-mark">"</span>
        ${escapeHtml(quote.text)}
        <span class="coach-quote-mark">"</span>
      </div>
      <div class="coach-source">— ${escapeHtml(quote.source)}</div>
    </div>
  `;

  document.body.appendChild(wrapper);
  _panel = wrapper;

  wrapper.querySelector('.coach-close').addEventListener('click', hideCoach);

  clearTimeout(_timer);
  _timer = setTimeout(hideCoach, 12000);
}

function hideCoach() {
  if (!_panel) return;
  _panel.classList.add('coach-exit');
  _panel.addEventListener('animationend', () => {
    if (_panel) {
      _panel.remove();
      _panel = null;
    }
  }, { once: true });
  clearTimeout(_timer);
}

/* ================================================================= EXPORTS == */

export function showCoach(context) {
  if (!shouldShow(context)) return;
  store.markQuoteShown();

  const entry = CONTEXT[context];
  if (!entry) return;

  const char = CHARS[entry.char];
  const pool = QUOTES[context];
  if (!pool) return;

  const quote = pool[Math.floor(Math.random() * pool.length)];
  buildPanel(char, quote, entry);
}

export { hideCoach };
