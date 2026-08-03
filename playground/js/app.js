/* ============================================================
   app.js — shell, hash router, wiring.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import { BRAND } from '../config.js';
import * as store from './store.js';
import { escapeHtml, toast } from './ui.js';
import { renderDashboard, renderTrack, renderRubric, renderScratch, renderProfile } from './views-core.js';
import { renderChallenge, disposeChallenge } from './view-challenge.js';
import { renderAssessmentList, renderExam, renderReport, disposeAssessment } from './view-assessment.js';
import { renderLearnHome, renderCourse, renderLesson, disposeLearn } from './view-learn.js';
import { renderHall } from './view-hall.js';
import { renderRoadmap } from './roadmap.js';
import { ensureProfile, openProfileDialog } from './identity.js';
import { publish } from './leaderboard.js';

const THEME_KEY = 'the-gym-theme';

/* ------------------------------------------------------------------- shell */

const BRAND_MARK = `
  <svg class="brand-mark" viewBox="0 0 32 36" width="26" height="30" aria-hidden="true">
    <defs>
      <linearGradient id="pgTop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#E0AA50"/><stop offset="100%" stop-color="#C9903A"/>
      </linearGradient>
      <linearGradient id="pgRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2E7EB4"/><stop offset="100%" stop-color="#1A5C8A"/>
      </linearGradient>
      <linearGradient id="pgLeft" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1A4060"/><stop offset="100%" stop-color="#0D2238"/>
      </linearGradient>
    </defs>
    <polygon points="16,2 28,9 16,16 4,9" fill="url(#pgTop)"/>
    <polygon points="28,9 28,23 16,30 16,16" fill="url(#pgRight)"/>
    <polygon points="4,9 16,16 16,30 4,23" fill="url(#pgLeft)"/>
  </svg>`;

function sidebarHtml() {
  return `
    <a class="brand" href="#/">
      ${BRAND_MARK}
      <span class="brand-text">The GYM<span>.</span>
        <span class="brand-sub">${escapeHtml(BRAND.tagline)}</span>
      </span>
    </a>

    <a class="nav-item" data-route="/" href="#/">
      <span class="nav-glyph">◆</span> Dashboard
    </a>
    <a class="nav-item" data-route="/learn" href="#/learn">
      <span class="nav-glyph">✦</span> Learn
    </a>
    <a class="nav-item" data-route="/assess" href="#/assess">
      <span class="nav-glyph">▲</span> Assessments
    </a>
    <a class="nav-item" data-route="/hall" href="#/hall">
      <span class="nav-glyph">★</span> Hall of Fame
    </a>

    <div class="nav-group-label">Courses</div>
    ${TRACKS.map((track) => {
      const lessons = store.lessonStats(track);
      const stats = store.trackStats(track);
      return `
        <a class="nav-item" data-route="/course/${track.id}" href="#/course/${track.id}">
          <span class="nav-glyph" style="background:${track.accent};color:#fff">${track.glyph}</span>
          ${escapeHtml(track.name)}
          <span class="nav-meter">${lessons.done + stats.cleared}/${lessons.total + stats.total}</span>
        </a>`;
    }).join('')}

    <div class="nav-group-label">More</div>
    <a class="nav-item" data-route="/roadmap" href="#/roadmap">
      <span class="nav-glyph">🗺</span> Roadmap
    </a>
    <a class="nav-item" data-route="/scratch" href="#/scratch">
      <span class="nav-glyph">&gt;_</span> Scratch pad
    </a>
    <a class="nav-item" data-route="/rubric" href="#/rubric">
      <span class="nav-glyph">%</span> The rubric
    </a>
    <a class="nav-item" data-route="/profile" href="#/profile">
      <span class="nav-glyph">◉</span> Profile
    </a>

    <div class="sidebar-foot">
      <a class="nav-item" href="../index.html">
        <span class="nav-glyph">←</span> Back to portfolio
      </a>
    </div>`;
}

function topbarHtml() {
  return `
    <button class="icon-btn mobile-toggle" id="menu-toggle" aria-label="Toggle navigation">☰</button>
    <span class="topbar-title" id="topbar-title">Dashboard</span>
    <div class="topbar-spacer"></div>
    <span class="stat-chip" id="streak-chip" title="Consecutive days practised">
      <span class="label">streak</span><span class="value">0</span>
    </span>
    <span class="stat-chip" id="xp-chip" title="Total experience">
      <span class="label">XP</span><span class="value">0</span>
    </span>
    <button class="stat-chip" id="level-chip" title="Your profile">
      <span class="level-orb"><span>1</span></span>
      <span class="value">Initiate</span>
    </button>
    <button class="icon-btn" id="theme-toggle" aria-label="Toggle colour theme">◐</button>`;
}

/* -------------------------------------------------------------- shell state */

function refreshShellStats() {
  const state = store.getState();
  const level = store.levelInfo(state.xp);

  const xpChip = document.querySelector('#xp-chip .value');
  if (xpChip) xpChip.textContent = state.xp.toLocaleString();

  const streakChip = document.querySelector('#streak-chip .value');
  if (streakChip) streakChip.textContent = String(store.liveStreak());

  const levelChip = document.querySelector('#level-chip');
  if (levelChip) {
    const profile = store.profile();
    levelChip.querySelector('.level-orb span').textContent = String(level.level);
    levelChip.querySelector('.value').textContent = profile.username || level.title;
    levelChip.querySelector('.level-orb').style.setProperty('--p', (level.progress * 100).toFixed(0) + '%');
  }

  // Sidebar per-course counters: lessons done + challenges cleared.
  for (const track of TRACKS) {
    const item = document.querySelector(`.nav-item[data-route="/course/${track.id}"] .nav-meter`);
    if (item) {
      const lessons = store.lessonStats(track);
      const stats = store.trackStats(track);
      item.textContent = `${lessons.done + stats.cleared}/${lessons.total + stats.total}`;
    }
  }
}

function setActiveNav(route) {
  document.querySelectorAll('.nav-item[data-route]').forEach((item) => {
    const target = item.dataset.route;
    const active = target === '/' ? route === '/' : route.startsWith(target);
    item.classList.toggle('active', active);
  });
}

/* ------------------------------------------------------------------ theming */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
}

function initTheme() {
  let saved = 'dark';
  try {
    saved = localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    /* ignore */
  }
  applyTheme(saved);
}

/* ------------------------------------------------------------------- router */

const view = () => document.getElementById('view');

function parseRoute() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const path = raw.startsWith('/') ? raw : '/' + raw;
  const parts = path.split('/').filter(Boolean);
  return { path, parts };
}

async function route() {
  disposeChallenge();
  disposeAssessment();
  disposeLearn();

  const { path, parts } = parseRoute();
  const host = view();
  host.className = 'view';
  window.scrollTo(0, 0);

  const setTitle = (text) => {
    const node = document.getElementById('topbar-title');
    if (node) node.textContent = text;
    document.title = text + ' · ' + BRAND.name;
  };

  setActiveNav(path);

  try {
    if (parts.length === 0) {
      setTitle('Dashboard');
      renderDashboard(host);
    } else if (parts[0] === 'learn') {
      setTitle('Learn');
      renderLearnHome(host);
    } else if (parts[0] === 'course' && parts[1]) {
      const track = TRACKS.find((t) => t.id === parts[1]);
      setTitle(track ? track.name + ' course' : 'Course');
      renderCourse(host, parts[1]);
    } else if (parts[0] === 'lesson' && parts[1]) {
      setTitle('Lesson');
      await renderLesson(host, parts[1]);
    } else if (parts[0] === 'hall') {
      setTitle('Hall of Fame');
      await renderHall(host);
    } else if (parts[0] === 'track' && parts[1]) {
      const track = TRACKS.find((t) => t.id === parts[1]);
      setTitle(track ? track.name + ' challenges' : 'Track');
      renderTrack(host, parts[1]);
    } else if (parts[0] === 'challenge' && parts[1]) {
      setTitle('Challenge');
      await renderChallenge(host, parts[1]);
    } else if (parts[0] === 'assess') {
      setTitle('Assessments');
      renderAssessmentList(host);
    } else if (parts[0] === 'exam' && parts[1]) {
      setTitle('Assessment in progress');
      await renderExam(host, parts[1]);
    } else if (parts[0] === 'report' && parts[1]) {
      setTitle('Report');
      renderReport(host, parts[1]);
    } else if (parts[0] === 'rubric') {
      setTitle('The rubric');
      renderRubric(host);
    } else if (parts[0] === 'scratch') {
      setTitle('Scratch pad');
      await renderScratch(host);
    } else if (parts[0] === 'roadmap') {
      setTitle('Roadmap');
      renderRoadmap(host);
    } else if (parts[0] === 'profile') {
      setTitle('Profile');
      renderProfile(host);
    } else {
      setTitle('Not found');
      host.innerHTML = `
        <div class="empty-state">
          <h3>Nothing here</h3>
          <p style="font-size:0.86rem">That route does not exist.</p>
          <a class="btn primary" href="#/" style="margin-top:14px">Back to the dashboard</a>
        </div>`;
    }
  } catch (error) {
    console.error(error);
    host.innerHTML = `
      <div class="empty-state">
        <h3>Something broke while rendering that view</h3>
        <p style="font-size:0.86rem;font-family:var(--font-mono)">${escapeHtml((error && error.message) || String(error))}</p>
        <a class="btn primary" href="#/" style="margin-top:14px">Back to the dashboard</a>
      </div>`;
  }

  refreshShellStats();
  document.querySelector('.sidebar').classList.remove('open');

  // Keep the board roughly in step with progress, quietly.
  if (store.hasProfile()) publish().catch(() => {});
}

/* --------------------------------------------------------------------- boot */

function boot() {
  initTheme();

  document.querySelector('.sidebar').innerHTML = sidebarHtml();
  document.querySelector('.topbar').innerHTML = topbarHtml();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    toast('Switched to ' + next + ' theme.', 'info');
  });

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  document.getElementById('level-chip').addEventListener('click', async () => {
    await openProfileDialog({ allowSkip: true });
    refreshShellStats();
  });

  store.subscribe(refreshShellStats);
  window.addEventListener('hashchange', route);

  // Global shortcut: "g" then a key jumps around.
  let pendingGo = false;
  document.addEventListener('keydown', (event) => {
    const tag = (event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || event.target.isContentEditable) return;
    if (event.target.closest && event.target.closest('.monaco-editor')) return;

    if (event.key === 'g') {
      pendingGo = true;
      setTimeout(() => { pendingGo = false; }, 1200);
      return;
    }
    if (!pendingGo) return;
    pendingGo = false;

    const jumps = {
      d: '#/', l: '#/learn', a: '#/assess', h: '#/hall',
      s: '#/scratch', r: '#/rubric', p: '#/profile',
    };
    if (jumps[event.key]) window.location.hash = jumps[event.key];
  });

  route();

  // First visit: offer a profile. Skippable, and never asked twice per session.
  ensureProfile().then(() => refreshShellStats());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
