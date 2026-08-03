/* ============================================================
   store.js — all persistent state, in localStorage.

   Nothing leaves the machine. Progress, drafts, mastery and
   assessment history are yours and are exportable as JSON.
   ============================================================ */

const KEY = 'the-gym-v1';
const LEGACY_KEYS = ['prism-playground-v1'];

const EMPTY = {
  version: 2,
  xp: 0,
  // Who you are. No password — this is a training log, not a bank.
  profile: { username: '', name: '', courses: [], joinedAt: null },
  attempts: {},     // challengeId -> { attempts, bestScore, awardedXp, cleared, lastAt, history[] }
  lessons: {},      // lessonId  -> { exercises:{}, quizzes:{}, done, completedAt }
  drafts: {},       // challengeId -> string | { html, css, js }
  mastery: {},      // concept -> 0..100 exponential moving average
  activity: {},     // 'YYYY-MM-DD' -> attempts that day
  streak: { current: 0, longest: 0, lastDay: null },
  clearStreak: { current: 0, longest: 0, lastClearedAt: null },
  assessments: [],  // finished exam runs
  quoteState: { lastShown: 0 },  // throttle for coach quotes (ms timestamp)
  // runnerUrl: optional self-hosted Piston endpoint; blank uses Compiler Explorer.
  settings: { engine: 'auto', fontSize: 14, showHints: true, runnerUrl: '' },
};

/* ------------------------------------------------------------------ helpers */

export function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function daysBetween(a, b) {
  const toDate = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toDate(b) - toDate(a)) / 86400000);
}

function deepMerge(base, saved) {
  const out = { ...base };
  for (const [key, value] of Object.entries(saved || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      out[key] = { ...base[key], ...value };
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

/* -------------------------------------------------------------- load / save */

let state = null;
const listeners = new Set();

export function load() {
  if (state) return state;
  try {
    let raw = localStorage.getItem(KEY);

    // Carry over progress from the pre-rename storage key, once.
    if (!raw) {
      for (const legacy of LEGACY_KEYS) {
        const old = localStorage.getItem(legacy);
        if (old) {
          raw = old;
          localStorage.setItem(KEY, old);
          break;
        }
      }
    }

    state = raw ? deepMerge(structuredClone(EMPTY), JSON.parse(raw)) : structuredClone(EMPTY);
  } catch {
    state = structuredClone(EMPTY);
  }
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not persist progress:', error);
  }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return load();
}

export function resetAll() {
  state = structuredClone(EMPTY);
  save();
}

export function exportJson() {
  return JSON.stringify(load(), null, 2);
}

export function importJson(text) {
  const parsed = JSON.parse(text);
  state = deepMerge(structuredClone(EMPTY), parsed);
  save();
}

/* --------------------------------------------------------------- levelling */

const TITLES = [
  'Initiate', 'Novice', 'Apprentice', 'Practitioner', 'Journeyman',
  'Engineer', 'Senior', 'Principal', 'Architect', 'Master', 'Grandmaster',
];

export function xpForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(180 * Math.pow(level - 1, 1.5));
}

export function levelInfo(xp) {
  let level = 1;
  while (level < 40 && xp >= xpForLevel(level + 1)) level += 1;

  const floorXp = xpForLevel(level);
  const ceilXp = xpForLevel(level + 1);
  const span = Math.max(1, ceilXp - floorXp);

  return {
    level,
    title: TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 2))],
    floorXp,
    ceilXp,
    intoLevel: xp - floorXp,
    needed: ceilXp - xp,
    progress: Math.max(0, Math.min(1, (xp - floorXp) / span)),
  };
}

/* ------------------------------------------------------------------ streaks */

function touchActivity() {
  const day = today();
  state.activity[day] = (state.activity[day] || 0) + 1;

  const { lastDay } = state.streak;
  if (lastDay === day) return;

  if (!lastDay) {
    state.streak.current = 1;
  } else {
    const gap = daysBetween(lastDay, day);
    state.streak.current = gap === 1 ? state.streak.current + 1 : 1;
  }
  state.streak.lastDay = day;
  state.streak.longest = Math.max(state.streak.longest, state.streak.current);
}

/** The streak is only "live" if you practised today or yesterday. */
export function liveStreak() {
  const s = load().streak;
  if (!s.lastDay) return 0;
  const gap = daysBetween(s.lastDay, today());
  return gap <= 1 ? s.current : 0;
}

/**
 * Clear streak: consecutive challenges cleared.
 * Resets if more than 24 hours pass between clears.
 */
function bumpClearStreak() {
  load();
  const now = Date.now();
  const cs = state.clearStreak;
  if (cs.lastClearedAt && (now - cs.lastClearedAt) > 24 * 60 * 60 * 1000) {
    cs.current = 0;
  }
  cs.current += 1;
  cs.lastClearedAt = now;
  cs.longest = Math.max(cs.longest, cs.current);
  save();
}

/**
 * XP multiplier based on clear streak.
 * 0 clears = 1.0x, 1 = 1.05x, 2 = 1.1x, 3 = 1.15x, 5+ = 1.25x
 */
export function clearStreakMultiplier() {
  const cs = load().clearStreak;
  if (cs.current >= 5) return 1.25;
  if (cs.current >= 3) return 1.15;
  if (cs.current >= 2) return 1.10;
  if (cs.current >= 1) return 1.05;
  return 1.0;
}

export function clearStreakCount() {
  return load().clearStreak.current;
}

/* ------------------------------------------------------------------ mastery */

const MASTERY_ALPHA = 0.45;

function updateMastery(concepts, score) {
  for (const concept of concepts || []) {
    const previous = state.mastery[concept];
    state.mastery[concept] =
      previous === undefined ? score : Math.round(previous * (1 - MASTERY_ALPHA) + score * MASTERY_ALPHA);
  }
}

export function masteryFor(concept) {
  return load().mastery[concept] ?? null;
}

export function masteryTable() {
  return Object.entries(load().mastery)
    .map(([concept, score]) => ({ concept, score }))
    .sort((a, b) => b.score - a.score);
}

/* ---------------------------------------------------------------- attempts */

export function attemptFor(challengeId) {
  return load().attempts[challengeId] || null;
}

/**
 * Record a graded attempt.
 * @returns {{ xpAwarded:number, isBest:boolean, firstClear:boolean }}
 */
export function recordAttempt(challenge, scorecard, xpEarned) {
  load();
  const existing = state.attempts[challenge.id] || {
    attempts: 0,
    bestScore: 0,
    awardedXp: 0,
    cleared: false,
    history: [],
  };

  const isBest = scorecard.total > existing.bestScore;
  const firstClear = scorecard.cleared && !existing.cleared;

  existing.attempts += 1;
  existing.bestScore = Math.max(existing.bestScore, scorecard.total);
  existing.cleared = existing.cleared || scorecard.cleared;
  existing.awardedXp += xpEarned;
  existing.lastAt = Date.now();
  existing.lastGrade = scorecard.grade.grade;
  existing.history = [...(existing.history || []), { score: scorecard.total, at: Date.now() }].slice(-25);

  state.attempts[challenge.id] = existing;
  state.xp += xpEarned;

  updateMastery(challenge.concepts, scorecard.total);
  touchActivity();
  if (firstClear) bumpClearStreak();
  save();

  return { xpAwarded: xpEarned, isBest, firstClear };
}

/* ----------------------------------------------------------------- profile */

export function profile() {
  return load().profile;
}

export function hasProfile() {
  return Boolean(load().profile.username);
}

export function saveProfile({ username, name, courses }) {
  load();
  state.profile = {
    ...state.profile,
    username: String(username || '').trim(),
    name: String(name || '').trim(),
    courses: Array.isArray(courses) ? courses : state.profile.courses,
    joinedAt: state.profile.joinedAt || Date.now(),
  };
  save();
  return state.profile;
}

export function setCourses(courses) {
  load();
  state.profile.courses = courses;
  save();
}

/* ------------------------------------------------------------- lesson state */

export function lessonProgress(lessonId) {
  return load().lessons[lessonId] || { exercises: {}, quizzes: {}, done: false };
}

function ensureLesson(lessonId) {
  load();
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = { exercises: {}, quizzes: {}, done: false };
  }
  return state.lessons[lessonId];
}

/** Record a passed (or failed) lesson exercise. Only successes stick. */
export function markExercise(lessonId, key, passed) {
  const record = ensureLesson(lessonId);
  if (passed) record.exercises[key] = true;
  touchActivity();
  save();
}

export function markQuiz(lessonId, key, correct) {
  const record = ensureLesson(lessonId);
  if (correct) record.quizzes[key] = true;
  save();
}

/**
 * Mark a lesson finished. Awards XP once, the first time only.
 * @returns {number} XP awarded (0 if it was already complete)
 */
export function completeLesson(lessonId, xp) {
  const record = ensureLesson(lessonId);
  if (record.done) return 0;

  record.done = true;
  record.completedAt = Date.now();
  state.xp += xp;
  touchActivity();
  save();
  return xp;
}

export function isLessonDone(lessonId) {
  return Boolean(load().lessons[lessonId] && state.lessons[lessonId].done);
}

/** Lesson completion for a track. */
export function lessonStats(track) {
  const lessons = track.lessons || [];
  const done = lessons.filter((l) => isLessonDone(l.id)).length;
  return {
    total: lessons.length,
    done,
    completion: lessons.length ? done / lessons.length : 0,
  };
}

/* ------------------------------------------------------------------ drafts */

export function saveDraft(challengeId, code) {
  load();
  state.drafts[challengeId] = code;
  save();
}

export function getDraft(challengeId) {
  return load().drafts[challengeId] ?? null;
}

export function clearDraft(challengeId) {
  load();
  delete state.drafts[challengeId];
  save();
}

/* -------------------------------------------------------------- assessments */

export function recordAssessment(record) {
  load();
  state.assessments = [record, ...state.assessments].slice(0, 50);
  touchActivity();
  save();
  return record;
}

export function assessmentHistory(assessmentId = null) {
  const all = load().assessments;
  return assessmentId ? all.filter((a) => a.id === assessmentId) : all;
}

export function bestAssessment(assessmentId) {
  const runs = assessmentHistory(assessmentId);
  if (!runs.length) return null;
  return runs.reduce((best, run) => (run.total > best.total ? run : best), runs[0]);
}

/* ------------------------------------------------------------------ stats */

export function trackStats(track) {
  const attempts = load().attempts;
  const total = track.challenges.length;
  let cleared = 0;
  let scoreSum = 0;
  let scored = 0;

  for (const challenge of track.challenges) {
    const record = attempts[challenge.id];
    if (!record) continue;
    if (record.cleared) cleared += 1;
    scoreSum += record.bestScore;
    scored += 1;
  }

  return {
    total,
    cleared,
    attempted: scored,
    completion: total ? cleared / total : 0,
    averageBest: scored ? Math.round(scoreSum / scored) : null,
  };
}

export function settings() {
  return load().settings;
}

export function updateSettings(patch) {
  load();
  state.settings = { ...state.settings, ...patch };
  save();
}

/** Last 26 weeks of activity, oldest first, for the heatmap. */
export function activityGrid(weeks = 26) {
  const activity = load().activity;
  const cells = [];
  const now = new Date();
  const days = weeks * 7;

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    cells.push({ date: key, count: activity[key] || 0 });
  }
  return cells;
}

/* ------------------------------------------------------------ coach quotes */

export function lastQuoteShown() {
  return load().quoteState.lastShown || 0;
}

export function markQuoteShown() {
  load();
  state.quoteState.lastShown = Date.now();
  save();
}
