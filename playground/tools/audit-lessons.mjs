/* ============================================================
   audit-lessons.mjs — structural checks on course content.

     node tools/audit-lessons.mjs

   Catches the mistakes that are easy to make when authoring:
   missing fields, quiz answers out of range, exercises with no
   test cases, solutions identical to their starter, and lessons
   whose ids collide.

   It does NOT execute anything — for that, run the browser sweep
   printed at the end of this file's output.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';

const problems = [];
const seenIds = new Set();
let lessonCount = 0;
let exerciseCount = 0;
let quizCount = 0;

const complain = (where, message) => problems.push(`[${where}] ${message}`);

for (const track of TRACKS) {
  const lessons = track.lessons || [];
  if (!lessons.length) {
    complain(track.id, 'track has no lessons — beginners have nowhere to start');
    continue;
  }

  const topicIds = new Set((track.lessonTopics || []).map((t) => t.id));

  for (const lesson of lessons) {
    lessonCount += 1;
    const where = lesson.id;

    if (seenIds.has(lesson.id)) complain(where, 'duplicate lesson id');
    seenIds.add(lesson.id);

    for (const field of ['title', 'summary', 'minutes', 'topic', 'difficulty']) {
      if (!lesson[field]) complain(where, `missing "${field}"`);
    }
    if (!topicIds.has(lesson.topic)) complain(where, `topic "${lesson.topic}" is not a topic of ${track.id}`);
    const validDifficulty = ['beginner', 'intermediate', 'advanced'];
    if (lesson.difficulty && !validDifficulty.includes(lesson.difficulty)) {
      complain(where, `difficulty "${lesson.difficulty}" must be one of: ${validDifficulty.join(', ')}`);
    }
    if (!Array.isArray(lesson.objectives) || !lesson.objectives.length) {
      complain(where, 'no objectives listed');
    }
    if (!Array.isArray(lesson.blocks) || !lesson.blocks.length) {
      complain(where, 'no blocks');
      continue;
    }

    lesson.blocks.forEach((block, index) => {
      const at = `${where} block ${index} (${block.t})`;

      switch (block.t) {
        case 'text':
        case 'note':
          if (!block.md) complain(at, 'empty md');
          break;

        case 'code':
          if (!block.code) complain(at, 'empty code');
          break;

        case 'web':
          if (!block.files || typeof block.files.html !== 'string') complain(at, 'web block needs files.html');
          break;

        case 'case':
          if (!block.title) complain(at, 'case study has no title');
          break;

        case 'try':
        case 'debug':
        case 'complete':
        case 'refactor': {
          exerciseCount += 1;
          if (!block.prompt) complain(at, 'no prompt');
          if (!block.starter) complain(at, 'no starter code');
          if (!block.solution) complain(at, 'no solution');
          if (block.starter === block.solution) complain(at, 'starter and solution are identical');
          if (!Array.isArray(block.cases) || !block.cases.length) complain(at, 'no test cases');
          (block.cases || []).forEach((testCase, ci) => {
            if (!testCase.name) complain(at, `case ${ci} has no name`);
            if (!testCase.call) complain(at, `case ${ci} has no call`);
            if (testCase.expect === undefined) complain(at, `case ${ci} has no expect`);
          });
          break;
        }

        case 'tryweb': {
          exerciseCount += 1;
          if (!block.prompt) complain(at, 'no prompt');
          if (!block.files) complain(at, 'no starter files');
          if (!block.solution) complain(at, 'no solution');
          if (!Array.isArray(block.checks) || !block.checks.length) complain(at, 'no checks');
          (block.checks || []).forEach((check, ci) => {
            if (!check.name) complain(at, `check ${ci} has no name`);
            if (!check.code) complain(at, `check ${ci} has no code`);
            if (check.code && !/\breturn\b/.test(check.code)) {
              complain(at, `check ${ci} never returns — it will always fail`);
            }
          });
          break;
        }

        case 'quiz': {
          quizCount += 1;
          if (!block.q) complain(at, 'no question');
          if (!Array.isArray(block.options) || block.options.length < 2) complain(at, 'needs at least two options');
          if (typeof block.answer !== 'number' || block.answer < 0 || block.answer >= (block.options || []).length) {
            complain(at, `answer index ${block.answer} is out of range`);
          }
          if (!block.why) complain(at, 'no explanation — a quiz that does not teach is just a gate');
          break;
        }

        default:
          complain(at, `unknown block type "${block.t}"`);
      }
    });
  }
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}

console.log(`${lessonCount} lessons, ${exerciseCount} exercises, ${quizCount} quizzes — all structurally sound.`);
console.log('\nTo verify exercises actually pass, open /playground/ and run the sweep in the browser console:');
console.log('  see the snippet in tools/sweep.mjs, or README "Verifying content".');
