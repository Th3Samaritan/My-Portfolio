/* ============================================================
   sweep.mjs — compile and RUN every reference solution.

     node tools/sweep.mjs rust
     node tools/sweep.mjs java

   Uses the same harness builder the app uses, so it catches
   broken templates, bad `expect` values and type mismatches
   before you ever see them in the UI.

   Python and Web cannot run under Node (Pyodide and the DOM
   sandbox both need a browser). Sweep those from the app's
   console at /playground/ with:

     const v = '?b=' + Date.now();
     const { TRACKS } = await import('./data/curriculum.js' + v);
     const runner = await import('./js/runner.js' + v);
     for (const id of ['python', 'web']) {
       const track = TRACKS.find(t => t.id === id);
       for (const ch of track.challenges) {
         const r = id === 'web'
           ? await runner.runWebChallenge(ch, ch.solution, {})
           : await runner.runCodeChallenge(track, ch, ch.solution, {});
         const pass = r.results.filter(x => x.passed).length;
         console.log(ch.id, pass + '/' + r.results.length,
           r.results.filter(x => !x.passed).map(x => x.name).join('; '));
       }
     }
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import { buildSource } from '../js/runner.js';

const API = 'https://godbolt.org/api';
const ARGS = { rust: '-O', java: '', python: '' };
const ID_PATTERN = { rust: /^r(\d+)$/, java: /^java(\d+)$/, python: /^python(\d+)$/ };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newestCompiler(lang) {
  const response = await fetch(`${API}/compilers/${lang}?fields=id,semver`, {
    headers: { Accept: 'application/json' },
  });
  const all = await response.json();
  const pattern = ID_PATTERN[lang];

  const best = all
    .map((entry) => ({ entry, match: pattern.exec(entry.id) }))
    .filter((row) => row.match)
    .sort((a, b) => Number(b.match[1]) - Number(a.match[1]))[0];

  if (!best) throw new Error('no compiler found for ' + lang);
  return best.entry.id;
}

const wanted = process.argv[2];
if (!wanted) {
  console.error('usage: node tools/sweep.mjs <rust|java>');
  process.exit(2);
}

const track = TRACKS.find((t) => t.id === wanted);
if (!track || track.kind !== 'code') {
  console.error(`"${wanted}" is not a compiled track. Sweep python/web from the browser — see the header.`);
  process.exit(2);
}

const compilerId = await newestCompiler(track.lang);
console.log(`--- ${track.lang} via ${compilerId} ---`);

let problems = 0;

for (const challenge of track.challenges) {
  const source = buildSource(track.lang, challenge, challenge.solution);
  await sleep(700); // be a good citizen on a free shared service

  const response = await fetch(`${API}/compiler/${compilerId}/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source,
      lang: track.lang,
      options: {
        userArguments: ARGS[track.lang] || '',
        filters: { execute: true },
        executeParameters: { args: [], stdin: '' },
        compilerOptions: { executorRequest: true },
      },
    }),
  });

  const payload = await response.json();
  const textOf = (lines) => (lines || []).map((l) => l.text).join('\n');

  const reported = textOf(payload.stdout)
    .split('\n')
    .filter((line) => line.startsWith('__T__~|~'))
    .map((line) => line.split('~|~'));

  const failed = reported.filter((r) => r[2] !== 'PASS');
  const expected = (challenge.cases || []).length;

  if (payload.didExecute === false || failed.length || reported.length !== expected) {
    problems += 1;
    console.log(`\n[${challenge.id}] ${challenge.title}  (${reported.length}/${expected} reported)`);
    if (payload.didExecute === false) {
      console.log('  BUILD FAILED:\n    ' + textOf((payload.buildResult || {}).stderr).split('\n').slice(0, 12).join('\n    '));
    }
    failed.forEach((f) => console.log(`  FAIL ${f[1]} :: got ${f[3]} | want ${f[4]}`));
  } else {
    console.log(`[${challenge.id}] ok ${reported.length}/${expected}`);
  }
}

console.log(`\n${track.challenges.length} run, ${problems} with problems`);
process.exit(problems ? 1 : 0);
