/* ============================================================
   audit.mjs — offline sanity check for challenge definitions.

     node tools/audit.mjs

   Every challenge's own reference solution is pushed through the
   rubric's quality, efficiency and style checks. A failure here
   means the CHALLENGE is wrong, not the solution: usually a regex
   that mis-fires on prose, or a stale `refLines`.

   This does not execute anything — see sweep.mjs for that.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import { grade } from '../js/grader.js';

let problems = 0;
let checked = 0;

for (const track of TRACKS) {
  for (const challenge of track.challenges) {
    const solution =
      track.kind === 'web'
        ? [challenge.solution.html, challenge.solution.css, challenge.solution.js].join('\n')
        : challenge.solution;

    // Assume every case passed and the run was instant, so only the
    // static dimensions are under test.
    const cases = challenge.cases || challenge.checks || [];
    const fakeRun = {
      results: cases.map((c) => ({ name: c.name, passed: true, got: '', want: '', hidden: !!c.hidden })),
      timeMs: 1,
      logs: '',
      stderr: '',
      compileError: '',
    };

    const card = grade(challenge, solution, fakeRun);
    checked += 1;

    const failures = [];
    for (const dimension of ['efficiency', 'quality']) {
      for (const check of card.dimensions[dimension].detail.checks || []) {
        if (!check.ok) failures.push(`${dimension}/${check.id}: ${check.label}`);
      }
    }

    const style = card.dimensions.style.detail;
    if (card.dimensions.style.score < 100) {
      failures.push(`style: ${style.lines} lines vs refLines ${style.reference} (${style.ratio}x)`);
    }

    if (failures.length) {
      problems += 1;
      console.log(`\n[${challenge.id}] ${challenge.title}  total=${card.total}`);
      failures.forEach((f) => console.log('   - ' + f));
    }
  }
}

console.log(`\n${checked} challenges audited, ${problems} with issues.`);
process.exit(problems ? 1 : 0);
