/* ============================================================
   grader.js — the rubric.

   Four dimensions, each scored 0-100, then weighted:

     Correctness  share of test cases passed (visible + hidden)
     Efficiency   anti-pattern regex checks + measured runtime
                  against the challenge's budget
     Quality      idiom / documentation / error-handling checks
     Style        concision against the reference solution,
                  plus readability penalties

   Everything the grader decides is reported back with a reason,
   so the score is arguable rather than magic.
   ============================================================ */

import { RUBRIC_WEIGHTS, gradeFor } from '../data/assessments.js';
import { clearStreakMultiplier } from './store.js';

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

/* --------------------------------------------------------- source measuring */

const COMMENT_PREFIX = /^\s*(#|\/\/|\/\*|\*|<!--)/;

function significantLines(code) {
  return String(code || '')
    .split('\n')
    .filter((line) => line.trim().length > 0 && !COMMENT_PREFIX.test(line));
}

/* ------------------------------------------------------------ check scoring */

/**
 * Score a list of checks against the source.
 *
 * A check is either:
 *   { re }                  passes when the pattern is PRESENT
 *   { re, negative: true }  passes when the pattern is ABSENT
 *   { fn }                  passes when fn(source) is truthy
 *
 * `fn` wins when both are given, and ignores `negative` — write the
 * predicate so that true means "the code did the right thing".
 */
function scoreChecks(code, checks) {
  if (!checks || checks.length === 0) {
    return { score: null, detail: [] };
  }

  const source = String(code || '');
  let earned = 0;
  let available = 0;
  const detail = [];

  for (const check of checks) {
    const weight = check.weight || 1;
    available += weight;

    let ok;
    if (typeof check.fn === 'function') {
      try {
        ok = Boolean(check.fn(source));
      } catch {
        ok = false;
      }
    } else {
      // Regexes may carry /g, which makes .test stateful — reset before use.
      if (check.re) check.re.lastIndex = 0;
      const matched = check.re ? check.re.test(source) : false;
      ok = check.negative ? !matched : matched;
    }

    if (ok) earned += weight;
    detail.push({ id: check.id, label: check.label, ok, weight });
  }

  return {
    score: available === 0 ? null : (earned / available) * 100,
    detail,
  };
}

/* -------------------------------------------------------------- dimensions */

function scoreCorrectness(results) {
  if (!results || results.length === 0) {
    return { score: 0, detail: { passed: 0, total: 0, hiddenFailed: 0 } };
  }
  const passed = results.filter((r) => r.passed).length;
  const hiddenFailed = results.filter((r) => r.hidden && !r.passed).length;
  return {
    score: (passed / results.length) * 100,
    detail: { passed, total: results.length, hiddenFailed },
  };
}

function scoreSpeed(timeMs, budgetMs) {
  if (!budgetMs || timeMs === null || timeMs === undefined || Number.isNaN(timeMs)) {
    return null;
  }
  const ratio = timeMs / budgetMs;
  if (ratio <= 1) return 100;
  if (ratio >= 6) return 0;
  // Linear decay from full marks at the budget to zero at 6x the budget.
  return clamp(100 * (1 - (ratio - 1) / 5), 0, 100);
}

function scoreEfficiency(code, challenge, timeMs) {
  const checks = scoreChecks(code, challenge.efficiency);
  const speed = scoreSpeed(timeMs, challenge.budgetMs);

  let score;
  if (checks.score === null && speed === null) score = 100;
  else if (checks.score === null) score = speed;
  else if (speed === null) score = checks.score;
  else score = checks.score * 0.65 + speed * 0.35;

  return {
    score,
    detail: {
      checks: checks.detail,
      speed,
      timeMs,
      budgetMs: challenge.budgetMs || null,
    },
  };
}

function scoreQuality(code, challenge) {
  const checks = scoreChecks(code, challenge.quality);
  return {
    score: checks.score === null ? 100 : checks.score,
    detail: { checks: checks.detail },
  };
}

function scoreStyle(code, challenge) {
  const lines = significantLines(code);
  const count = lines.length;
  const reference = challenge.refLines || Math.max(count, 1);
  const ratio = count / reference;

  // Full marks in a generous band around the reference; penalties either side.
  let concision;
  if (ratio <= 0.55) {
    // Suspiciously short — either brilliant or the task is not really done.
    concision = 70;
  } else if (ratio <= 1.7) {
    concision = 100;
  } else if (ratio >= 4) {
    concision = 20;
  } else {
    concision = clamp(100 - ((ratio - 1.7) / 2.3) * 80, 20, 100);
  }

  const penalties = [];
  const longLines = lines.filter((line) => line.length > 120).length;
  if (longLines > 0) penalties.push({ label: longLines + ' line(s) over 120 characters', cost: Math.min(15, longLines * 5) });

  const leftovers = (String(code).match(/TODO|FIXME|todo!\(\)|XXX/g) || []).length;
  if (leftovers > 0) penalties.push({ label: leftovers + ' unfinished marker(s) left in the code', cost: Math.min(25, leftovers * 12) });

  const bigGaps = (String(code).match(/\n[ \t]*\n[ \t]*\n[ \t]*\n/g) || []).length;
  if (bigGaps > 0) penalties.push({ label: 'Large blank-line gaps', cost: Math.min(10, bigGaps * 5) });

  const totalPenalty = penalties.reduce((sum, p) => sum + p.cost, 0);
  const score = clamp(concision * 0.75 + 25 - totalPenalty, 0, 100);

  return {
    score,
    detail: { lines: count, reference, ratio: Number(ratio.toFixed(2)), concision, penalties },
  };
}

/* ------------------------------------------------------------------ feedback */

function buildFeedback(dimensions, run, challenge) {
  const notes = [];
  const { correctness, efficiency, quality, style } = dimensions;

  if (run.compileError) {
    notes.push({ tone: 'bad', text: 'The code did not compile. Fix the compiler output before anything else is measured.' });
  }

  const failedVisible = (run.results || []).filter((r) => !r.passed && !r.hidden);
  const failedHidden = (run.results || []).filter((r) => !r.passed && r.hidden);

  if (correctness.score === 100) {
    notes.push({ tone: 'good', text: 'Every case passed, including the hidden ones.' });
  } else {
    if (failedVisible.length) {
      notes.push({ tone: 'bad', text: failedVisible.length + ' visible case(s) failing — start with "' + failedVisible[0].name + '".' });
    }
    if (failedHidden.length) {
      notes.push({
        tone: 'warn',
        text:
          failedHidden.length +
          ' hidden case(s) failing. These are edge cases: empty input, boundaries, duplicates, and the states you did not plan for.',
      });
    }
  }

  for (const check of efficiency.detail.checks || []) {
    if (!check.ok) notes.push({ tone: 'warn', text: 'Efficiency: ' + check.label + '.' });
  }
  if (efficiency.detail.speed !== null && efficiency.detail.speed < 60) {
    notes.push({
      tone: 'warn',
      text:
        'Ran in ' +
        Math.round(efficiency.detail.timeMs) +
        ' ms against a ' +
        efficiency.detail.budgetMs +
        ' ms budget — the approach is likely a complexity class too slow.',
    });
  }

  for (const check of quality.detail.checks || []) {
    if (!check.ok) notes.push({ tone: 'warn', text: 'Quality: ' + check.label + '.' });
  }

  for (const penalty of style.detail.penalties || []) {
    notes.push({ tone: 'warn', text: 'Style: ' + penalty.label + '.' });
  }
  if (style.detail.ratio > 2.2) {
    notes.push({
      tone: 'warn',
      text:
        'At ' +
        style.detail.lines +
        ' lines against a ' +
        style.detail.reference +
        '-line reference, there is probably a simpler shape hiding in there.',
    });
  }

  if (!notes.some((n) => n.tone === 'bad' || n.tone === 'warn')) {
    notes.push({ tone: 'good', text: 'Clean across every dimension. Nothing to pick at.' });
  }

  return notes;
}

/* ------------------------------------------------------------------- grading */

/**
 * Grade one attempt.
 * @param {object} challenge
 * @param {string} code      the user's source (for web: html+css+js joined)
 * @param {object} run       result from runner.js
 * @returns {object} full scorecard
 */
export function grade(challenge, code, run) {
  const weights = { ...RUBRIC_WEIGHTS, ...(challenge.rubric || {}) };

  const correctness = scoreCorrectness(run.results);
  const efficiency = scoreEfficiency(code, challenge, run.timeMs);
  const quality = scoreQuality(code, challenge);
  const style = scoreStyle(code, challenge);

  const dimensions = { correctness, efficiency, quality, style };

  const weightTotal = weights.correctness + weights.efficiency + weights.quality + weights.style;
  const total =
    (correctness.score * weights.correctness +
      efficiency.score * weights.efficiency +
      quality.score * weights.quality +
      style.score * weights.style) /
    weightTotal;

  const rounded = Math.round(total);

  return {
    challengeId: challenge.id,
    total: rounded,
    grade: gradeFor(rounded),
    weights,
    dimensions: {
      correctness: { ...correctness, score: Math.round(correctness.score), weight: weights.correctness },
      efficiency: { ...efficiency, score: Math.round(efficiency.score), weight: weights.efficiency },
      quality: { ...quality, score: Math.round(quality.score), weight: weights.quality },
      style: { ...style, score: Math.round(style.score), weight: weights.style },
    },
    feedback: buildFeedback(dimensions, run, challenge),
    passed: rounded >= 55 && correctness.score === 100,
    cleared: correctness.score === 100,
    timestamp: Date.now(),
  };
}

/** XP for a scorecard, given what the challenge has already paid out. */
export function xpFor(challenge, scorecard, alreadyAwarded = 0) {
  const base = Math.round((challenge.xp || 0) * (scorecard.total / 100));
  const bonus = scorecard.total >= 95 ? Math.round((challenge.xp || 0) * 0.15) : 0;
  const streakMult = clearStreakMultiplier();
  const earned = Math.round((base + bonus) * streakMult);
  return Math.max(0, earned - alreadyAwarded);
}

/** Aggregate several scorecards into one assessment result. */
export function aggregate(scorecards) {
  if (!scorecards.length) {
    return { total: 0, grade: gradeFor(0), dimensions: {} };
  }

  const dimensionIds = ['correctness', 'efficiency', 'quality', 'style'];
  const dimensions = {};
  for (const id of dimensionIds) {
    const mean =
      scorecards.reduce((sum, card) => sum + card.dimensions[id].score, 0) / scorecards.length;
    dimensions[id] = Math.round(mean);
  }

  const total = Math.round(
    scorecards.reduce((sum, card) => sum + card.total, 0) / scorecards.length
  );

  return {
    total,
    grade: gradeFor(total),
    dimensions,
    cleared: scorecards.filter((c) => c.cleared).length,
    count: scorecards.length,
  };
}
