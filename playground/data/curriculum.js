/* ============================================================
   Curriculum index — the single place the app asks about content.
   ============================================================ */

import { pythonTiers, pythonChallenges } from './track-python.js';
import { rustTiers, rustChallenges } from './track-rust.js';
import { javaTiers, javaChallenges } from './track-java.js';
import { webTiers, webChallenges } from './track-web.js';

import { pythonLessonTopics, pythonLessons } from './lessons-python.js';
import { rustLessonTopics, rustLessons } from './lessons-rust.js';
import { javaLessonTopics, javaLessons } from './lessons-java.js';
import { webLessonTopics, webLessons } from './lessons-web.js';

export const TRACKS = [
  {
    id: 'python',
    name: 'Python',
    lang: 'python',
    kind: 'code',
    accent: '#3b82f6',
    glyph: 'PY',
    tagline: 'Readable, expressive, everywhere.',
    blurb: 'The best first language there is. Start from "what is a program" and finish writing async code.',
    forBeginners: 'Never written code before? Start here. This course assumes nothing at all.',
    tiers: pythonTiers,
    challenges: pythonChallenges,
    lessonTopics: pythonLessonTopics,
    lessons: pythonLessons,
  },
  {
    id: 'rust',
    name: 'Rust',
    lang: 'rust',
    kind: 'code',
    accent: '#f97316',
    glyph: 'RS',
    tagline: 'Memory safety without a garbage collector.',
    blurb: 'Ownership, borrowing, traits, fearless concurrency. The compiler is the marker before we are.',
    forBeginners: 'Gentler than its reputation. We take ownership slowly, because it is the whole point.',
    tiers: rustTiers,
    challenges: rustChallenges,
    lessonTopics: rustLessonTopics,
    lessons: rustLessons,
  },
  {
    id: 'java',
    name: 'Java',
    lang: 'java',
    kind: 'code',
    accent: '#ef4444',
    glyph: 'JV',
    tagline: 'The language that runs the enterprise.',
    blurb: 'Collections, object design, generics, streams and the concurrency toolkit.',
    forBeginners: 'Verbose on purpose. We explain every word of the boilerplate rather than telling you to ignore it.',
    tiers: javaTiers,
    challenges: javaChallenges,
    lessonTopics: javaLessonTopics,
    lessons: javaLessons,
  },
  {
    id: 'web',
    name: 'Web Dev',
    lang: 'web',
    kind: 'web',
    accent: '#10b981',
    glyph: 'WB',
    tagline: 'Semantics, layout, state, accessibility.',
    blurb: 'Graded against a live DOM. No framework — the fundamentals every framework is built on.',
    forBeginners: 'The most visual place to start. Every example is a live page you can edit and watch change.',
    tiers: webTiers,
    challenges: webChallenges,
    lessonTopics: webLessonTopics,
    lessons: webLessons,
  },
];

/* ---------- Difficulty labels ---------- */
export const DIFFICULTY = {
  1: { label: 'Warm-up',  color: '#22c55e' },
  2: { label: 'Easy',     color: '#84cc16' },
  3: { label: 'Moderate', color: '#eab308' },
  4: { label: 'Hard',     color: '#f97316' },
  5: { label: 'Brutal',   color: '#ef4444' },
};

/* ---------- Lookups ---------- */
const trackById = new Map(TRACKS.map((t) => [t.id, t]));
const challengeIndex = new Map();
const trackOfChallenge = new Map();
const lessonIndex = new Map();
const trackOfLesson = new Map();

for (const track of TRACKS) {
  for (const challenge of track.challenges) {
    challengeIndex.set(challenge.id, challenge);
    trackOfChallenge.set(challenge.id, track);
  }
  for (const lesson of track.lessons || []) {
    lessonIndex.set(lesson.id, lesson);
    trackOfLesson.set(lesson.id, track);
  }
}

export function getTrack(trackId) {
  return trackById.get(trackId) || null;
}

export function getChallenge(challengeId) {
  return challengeIndex.get(challengeId) || null;
}

export function getTrackOf(challengeId) {
  return trackOfChallenge.get(challengeId) || null;
}

export function allChallenges() {
  return [...challengeIndex.values()];
}

/** Challenges of a track grouped in tier order. */
export function challengesByTier(track) {
  return track.tiers.map((tier) => ({
    tier,
    challenges: track.challenges.filter((c) => c.tier === tier.id),
  }));
}

/* ---------- Lessons ---------- */

export function getLesson(lessonId) {
  return lessonIndex.get(lessonId) || null;
}

export function getTrackOfLesson(lessonId) {
  return trackOfLesson.get(lessonId) || null;
}

/** Lessons of a track grouped in topic order. */
export function lessonsByTopic(track) {
  return (track.lessonTopics || []).map((topic) => ({
    topic,
    lessons: (track.lessons || []).filter((l) => l.topic === topic.id),
  }));
}

/** Lessons within a topic, grouped by difficulty (beginner | intermediate | advanced). */
export function lessonsByDifficulty(topicLessons) {
  const order = { beginner: 0, intermediate: 1, advanced: 2 };
  const groups = { beginner: [], intermediate: [], advanced: [] };
  for (const lesson of topicLessons) {
    (groups[lesson.difficulty] || groups.beginner).push(lesson);
  }
  return Object.entries(groups)
    .filter(([, v]) => v.length > 0)
    .sort(([a], [b]) => order[a] - order[b])
    .map(([difficulty, lessons]) => ({
      difficulty,
      label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      lessons,
    }));
}

/** @deprecated — kept for compatibility; prefer lessonsByTopic */
export function lessonsByTier(track) {
  return lessonsByTopic(track);
}

/** The lesson after this one, within the same track. Null at the end. */
export function nextLesson(lessonId) {
  const track = trackOfLesson.get(lessonId);
  if (!track) return null;
  const index = track.lessons.findIndex((l) => l.id === lessonId);
  return index >= 0 && index < track.lessons.length - 1 ? track.lessons[index + 1] : null;
}

export function previousLesson(lessonId) {
  const track = trackOfLesson.get(lessonId);
  if (!track) return null;
  const index = track.lessons.findIndex((l) => l.id === lessonId);
  return index > 0 ? track.lessons[index - 1] : null;
}

/** Graded exercises and quizzes inside a lesson — what "completing" it means. */
export function lessonTasks(lesson) {
  const exercises = lesson.blocks.filter((b) => b.t === 'try' || b.t === 'tryweb');
  const quizzes = lesson.blocks.filter((b) => b.t === 'quiz');
  return { exercises, quizzes, total: exercises.length + quizzes.length };
}

export function allLessons() {
  return [...lessonIndex.values()];
}

/** Every distinct concept id across the curriculum. */
export function allConcepts() {
  const set = new Set();
  for (const challenge of challengeIndex.values()) {
    (challenge.concepts || []).forEach((c) => set.add(c));
  }
  return [...set].sort();
}

/** Total XP obtainable, used for the global progress readout. */
export function totalObtainableXp() {
  let total = 0;
  for (const challenge of challengeIndex.values()) {
    total += challenge.xp || 0;
  }
  return total;
}

/** How many test cases a challenge exposes (web challenges call them checks). */
export function caseCount(challenge) {
  return (challenge.cases || challenge.checks || []).length;
}
