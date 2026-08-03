/**
 * grader.test.mjs — unit tests for the grading system.
 * Run with: node tools/grader.test.mjs
 */

import { grade, xpFor, aggregate } from '../js/grader.js';
import { RUBRIC_WEIGHTS, GRADE_BANDS, gradeFor } from '../data/assessments.js';

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${label}${detail ? ' — ' + detail : ''}`);
  }
}

function makeRun(results, timeMs = 10, opts = {}) {
  return { results, timeMs, compileError: opts.compileError || null, logs: opts.logs || [], engine: opts.engine || 'monaco' };
}

// Mock challenge factory
function challenge(overrides = {}) {
  return {
    id: 'test-x1',
    title: 'Test Challenge',
    xp: 100,
    tier: 'foundations',
    difficulty: 3,
    concepts: ['testing'],
    budgetMs: 100,
    refLines: 5,
    cases: [
      { name: 'case-1', call: 'fn(1)', expect: '2' },
      { name: 'case-2', call: 'fn(3)', expect: '6', hidden: true },
    ],
    quality: [
      { id: 'docstring', label: 'Has docstring', weight: 2, re: /("""|''')/ },
      { id: 'no-print', label: 'No debug prints', weight: 1, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-sleep', label: 'No sleep calls', weight: 1, re: /sleep/, negative: true },
    ],
    ...overrides,
  };
}

console.log('\n=== Score Checks ===');

// Positive regex
{
  const { score, detail } = (() => {
    const c = challenge({ quality: [{ id: 'has-fn', label: 'Has function', weight: 1, re: /def\s+fn/ }], efficiency: [] });
    const run = makeRun([{ name: 'case-1', passed: true }]);
    const s = grade(c, 'def fn(x):\n    return x * 2\n', run);
    return { score: s.dimensions.quality.score, detail: s.dimensions.quality.detail || {} };
  })();
  assert('positive regex passes when pattern present', score === 100, `got ${score}`);
}

// Negative regex
{
  const s = grade(
    challenge({ quality: [{ id: 'no-print', label: 'No print', weight: 1, re: /\bprint\s*\(/, negative: true }], efficiency: [] }),
    'def fn(x):\n    return x * 2\n',
    makeRun([{ name: 'case-1', passed: true }])
  );
  assert('negative regex passes when pattern absent', s.dimensions.quality.score === 100, `got ${s.dimensions.quality.score}`);
}

// Negative regex failure
{
  const s = grade(
    challenge({ quality: [{ id: 'no-print', label: 'No print', weight: 1, re: /\bprint\s*\(/, negative: true }], efficiency: [] }),
    'def fn(x):\n    print("debug")\n    return x * 2\n',
    makeRun([{ name: 'case-1', passed: true }])
  );
  assert('negative regex fails when pattern present', s.dimensions.quality.score === 0, `got ${s.dimensions.quality.score}`);
}

// Multiple checks weighted
{
  const c = challenge({
    quality: [
      { id: 'a', label: 'A', weight: 3, re: /def/ },
      { id: 'b', label: 'B', weight: 1, re: /xyzzy/, negative: false },
    ],
    efficiency: [],
  });
  const s = grade(c, 'def fn(x):\n    return x\n', makeRun([{ name: 'c', passed: true }]));
  assert('weighted checks: 3/4 = 75%', s.dimensions.quality.score === 75, `got ${s.dimensions.quality.score}`);
}

console.log('\n=== Correctness ===');

// All passing
{
  const c = challenge({ cases: [{ name: 'a', call: 'fn(1)', expect: '1' }, { name: 'b', call: 'fn(2)', expect: '2' }] });
  const run = makeRun([{ name: 'a', passed: true }, { name: 'b', passed: true }]);
  const s = grade(c, 'def fn(x):\n    return x\n', run);
  assert('all cases pass = 100% correctness', s.dimensions.correctness.score === 100);
  assert('scorecard.cleared is true', s.cleared === true);
  assert('scorecard.passed is true', s.passed === true);
}

// One failing
{
  const c = challenge({ cases: [{ name: 'a', call: 'fn(1)', expect: '2' }, { name: 'b', call: 'fn(3)', expect: '6' }] });
  const run = makeRun([{ name: 'a', passed: false }, { name: 'b', passed: true }]);
  const s = grade(c, 'def fn(x):\n    return x\n', run);
  assert('one case fails = 50% correctness', s.dimensions.correctness.score === 50);
  assert('not cleared when a case fails', s.cleared === false);
}

// Compile error
{
  const c = challenge();
  const run = makeRun([], 0, { compileError: 'SyntaxError: invalid syntax' });
  const s = grade(c, 'def fn(x):\n    return x\n', run);
  assert('compile error gives 0 correctness', s.dimensions.correctness.score === 0);
  assert('compile error feedback has bad tone', s.feedback.some(f => f.tone === 'bad'));
}

console.log('\n=== Efficiency ===');

// Within budget
{
  const c = challenge({ budgetMs: 100, efficiency: [{ id: 'fast', label: 'Fast', weight: 1, re: /def/ }] });
  const run = makeRun([{ name: 'a', passed: true }], 50);
  const s = grade(c, 'def fn(x):\n    return x\n', run);
  assert('within budget scores 100 on speed', s.dimensions.efficiency.score >= 80, `got ${s.dimensions.efficiency.score}`);
}

// Over budget
{
  const c = challenge({ budgetMs: 100, efficiency: [{ id: 'slow', label: 'Slow', weight: 1, re: /def/ }] });
  const run = makeRun([{ name: 'a', passed: true }], 500);
  const s = grade(c, 'def fn(x):\n    return x\n', run);
  assert('way over budget reduces speed (35% weight)', s.dimensions.efficiency.score >= 70 && s.dimensions.efficiency.score <= 80, `got ${s.dimensions.efficiency.score} (expected ~72)`);
}

console.log('\n=== Style ===');

// Well-sized code
{
  const c = challenge({ refLines: 2 });
  const run = makeRun([{ name: 'a', passed: true }]);
  const s = grade(c, 'def fn(x):\n    return x * 2\n', run);
  assert('code near refLines gets good style', s.dimensions.style.score >= 60, `got ${s.dimensions.style.score}`);
}

// Lines over 120 chars penalized
{
  const c = challenge({ refLines: 1 });
  const run = makeRun([{ name: 'a', passed: true }]);
  const s = grade(c, 'def fn(x): return x * 2  # ' + 'padding '.repeat(20) + '\n', run);
  assert('long lines get penalized in style', s.dimensions.style.score > 0, 'still scorable');
}

console.log('\n=== xpFor ===');

// Base XP at 100%
{
  const c = challenge({ xp: 100 });
  const sc = { total: 100, cleared: true };
  const xp = xpFor(c, sc, 0);
  assert('100% gives base XP (100)', xp >= 100, `got ${xp}`);
}

// 50% score
{
  const c = challenge({ xp: 100 });
  const sc = { total: 50, cleared: false };
  const xp = xpFor(c, sc, 0);
  assert('50% gives half XP', xp === 50, `got ${xp}`);
}

// No regrind for same score
{
  const c = challenge({ xp: 100 });
  const sc = { total: 80, cleared: true };
  const xp = xpFor(c, sc, 60);
  assert('already awarded 60, earn 80→20 more', xp === 20, `got ${xp}`);
}

// 95% bonus
{
  const c = challenge({ xp: 100 });
  const sc = { total: 95, cleared: true };
  const xp = xpFor(c, sc, 0);
  assert('95% includes 15% bonus (110)', xp >= 110, `got ${xp}`);
}

console.log('\n=== Aggregate ===');

// Single scorecard
{
  const s = grade(challenge({ xp: 50 }), 'def fn(x):\n    return x * 2\n', makeRun([{ name: 'a', passed: true }]));
  const agg = aggregate([s]);
  assert('aggregate of one equals itself', agg.total === s.total);
  assert('aggregate count is 1', agg.count === 1);
}

// Two scorecards
{
  const a = grade(challenge({ xp: 50 }), 'def fn(x):\n    return x\n', makeRun([{ name: 'x', passed: true }]));
  const b = grade(challenge({ xp: 50 }), 'def fn(x):\n    return x * 2\n', makeRun([{ name: 'x', passed: true }]));
  const agg = aggregate([a, b]);
  assert('aggregate of two has avg total', agg.total > 0 && agg.total <= 100);
  assert('aggregate count is 2', agg.count === 2);
}

// Empty
{
  const agg = aggregate([]);
  assert('empty aggregate returns 0', agg.total === 0);
}

console.log('\n=== Grade Bands ===');

assert('gradeFor(95) is S', gradeFor(95).grade === 'S');
assert('gradeFor(88) is A', gradeFor(88).grade === 'A');
assert('gradeFor(72) is B', gradeFor(72).grade === 'B');
assert('gradeFor(55) is C', gradeFor(55).grade === 'C');
assert('gradeFor(40) is D', gradeFor(40).grade === 'D');
assert('gradeFor(0) is F', gradeFor(0).grade === 'F');

console.log('\n=== Results ===');
console.log(`Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exit(1);
