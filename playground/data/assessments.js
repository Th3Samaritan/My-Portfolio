/* ============================================================
   Timed assessments — the test ground.

   An assessment is an ordered set of existing challenges run
   against a clock. Nothing is revealed until you submit: no
   hints, no reference solution, no per-case detail while the
   timer runs.
   ============================================================ */

export const ASSESSMENTS = [
  {
    id: 'py-core',
    title: 'Python Core Competency',
    track: 'python',
    level: 'Junior → Mid',
    minutes: 45,
    blurb: 'Control flow, collections and a sliding window under time pressure. The baseline for calling yourself fluent.',
    challengeIds: ['py-f3', 'py-d1', 'py-a4'],
  },
  {
    id: 'py-advanced',
    title: 'Python Advanced',
    track: 'python',
    level: 'Mid → Senior',
    minutes: 70,
    blurb: 'Decorators, object protocols, dynamic programming and bounded concurrency. This one is meant to hurt.',
    challengeIds: ['py-fn2', 'py-o1', 'py-a3', 'py-m1'],
  },
  {
    id: 'rs-core',
    title: 'Rust Ownership & Errors',
    track: 'rust',
    level: 'Junior → Mid',
    minutes: 60,
    blurb: 'Lifetimes, generic containers and Result plumbing. Passing this means the borrow checker is no longer your adversary.',
    challengeIds: ['rs-o1', 'rs-o2', 'rs-e1'],
  },
  {
    id: 'rs-systems',
    title: 'Rust Systems',
    track: 'rust',
    level: 'Senior',
    minutes: 75,
    blurb: 'Traits, hash-based algorithms and shared-state concurrency across threads and channels.',
    challengeIds: ['rs-t1', 'rs-c2', 'rs-x1', 'rs-x2'],
  },
  {
    id: 'jv-core',
    title: 'Java Collections & Design',
    track: 'java',
    level: 'Junior → Mid',
    minutes: 60,
    blurb: 'Comparators, an immutable value type with correct equality, and interface polymorphism.',
    challengeIds: ['jv-c2', 'jv-o1', 'jv-o2'],
  },
  {
    id: 'jv-advanced',
    title: 'Java Advanced',
    track: 'java',
    level: 'Mid → Senior',
    minutes: 75,
    blurb: 'Bounded generics, checked exception design, stream pipelines and the executor framework.',
    challengeIds: ['jv-g1', 'jv-e1', 'jv-s1', 'jv-x1'],
  },
  {
    id: 'web-core',
    title: 'Front-End Fundamentals',
    track: 'web',
    level: 'Junior → Mid',
    minutes: 55,
    blurb: 'Semantics, modern layout and DOM state handling — graded against a live document.',
    challengeIds: ['web-m1', 'web-l2', 'web-d1'],
  },
  {
    id: 'web-senior',
    title: 'Front-End Craft',
    track: 'web',
    level: 'Mid → Senior',
    minutes: 70,
    blurb: 'Event delegation, async state machines, debouncing and an accessible form with real focus management.',
    challengeIds: ['web-d2', 'web-a1', 'web-a2', 'web-y1'],
  },
  {
    id: 'polyglot',
    title: 'The Polyglot Gauntlet',
    track: 'mixed',
    level: 'Senior',
    minutes: 100,
    blurb: 'One problem from each language, back to back. Context-switching is the skill being measured as much as the code.',
    challengeIds: ['py-a2', 'rs-e1', 'jv-s1', 'web-d2'],
  },
];

/* ---------- Rubric definition ---------- */

/** Default weighting. A challenge may override any slice via `challenge.rubric`. */
export const RUBRIC_WEIGHTS = {
  correctness: 60,
  efficiency: 15,
  quality: 15,
  style: 10,
};

export const RUBRIC_DIMENSIONS = [
  {
    id: 'correctness',
    name: 'Correctness',
    blurb: 'Share of visible and hidden test cases passed. Hidden cases probe the edges you did not think about.',
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
    blurb: 'Measured runtime against the challenge budget, plus complexity checks for the anti-patterns the task is designed to expose.',
  },
  {
    id: 'quality',
    name: 'Code Quality',
    blurb: 'Idiom, documentation, error handling and use of the right tool from the standard library.',
  },
  {
    id: 'style',
    name: 'Style & Concision',
    blurb: 'Length relative to the reference solution. Rewards clarity — punishes both sprawl and unreadable golf.',
  },
];

/* ---------- Grade bands ---------- */
export const GRADE_BANDS = [
  { min: 95, grade: 'S',  label: 'Mastery',       color: '#a855f7' },
  { min: 88, grade: 'A',  label: 'Excellent',     color: '#22c55e' },
  { min: 80, grade: 'B+', label: 'Strong',        color: '#65a30d' },
  { min: 72, grade: 'B',  label: 'Solid',         color: '#84cc16' },
  { min: 64, grade: 'C+', label: 'Competent',     color: '#eab308' },
  { min: 55, grade: 'C',  label: 'Passing',       color: '#f59e0b' },
  { min: 40, grade: 'D',  label: 'Shaky',         color: '#f97316' },
  { min: 0,  grade: 'F',  label: 'Not yet',       color: '#ef4444' },
];

export function gradeFor(score) {
  return GRADE_BANDS.find((band) => score >= band.min) || GRADE_BANDS[GRADE_BANDS.length - 1];
}

export function getAssessment(id) {
  return ASSESSMENTS.find((a) => a.id === id) || null;
}
