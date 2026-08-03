# The GYM

**Train your programming.** A free, open-source gym for learning to code — from
"I have never written a line" to graded, timed assessments.

Four courses (Python, Rust, Java, Web), **28 from-scratch lessons**, **47 graded
challenges** and **9 timed assessments**. Everything runs in your browser.

No account required. No server to deploy. No build step. Plain ES modules served
straight from GitHub Pages.

Live at `/playground/`.

---

## What is in it

| Layer | What it is | How it is marked |
|---|---|---|
| **Learn** | 28 lessons with explanations, analogies, live runnable examples, worked case studies | 28 exercises + 27 quizzes, pass/fail, hints and answers always available |
| **Challenges** | 47 graded problems across 6 tiers per language | A four-part rubric, scored 0–100 |
| **Assessments** | 9 timed, multi-problem exams | Rubric scorecard with a radar profile |
| **Hall of Fame** | A leaderboard | Ranked by XP, then challenges cleared, then streak |

The lessons assume **nothing**. Lesson one of the Python course explains what a
program is. Nobody is told to "just ignore" a piece of boilerplate — if it is on
screen, it gets explained.

---

## Getting started

Just open it. Nothing to install.

To run it locally:

```bash
python -m http.server 8741
```

Then visit `http://localhost:8741/playground/`.

On first visit you are asked for a username and display name — **no password, no
email** — and which courses you want. You can skip it entirely and still use
everything; the profile only exists so the Hall of Fame has something to call you.

---

## How code actually runs

| Track | Engine | Network needed |
|---|---|---|
| Python | **Pyodide** — CPython compiled to WebAssembly, in your browser | Only the first load (~10 MB, then cached) |
| Web | **Sandboxed iframe** — a real DOM, real assertions | No |
| JavaScript | Sandboxed iframe | No |
| Rust, Java | **Compiler Explorer** (`godbolt.org`) — free, CORS-enabled, no API key | Yes |

Things worth knowing about the shared remote compiler:

- Its **Java sandbox permits only one live worker thread**, which is why the Java
  concurrency material uses a single worker with high iteration counts. The
  contention is real; the thread count is polite.
- Rust is compiled with `-O`, or the runtime budgets would be meaningless.
- One Python challenge (`py-m1`) is `remoteOnly` — Pyodide runs inside the
  browser's event loop and cannot offer `asyncio.run()`. Everything else is local.

> The old public Piston API (`emkc.org`) went **whitelist-only in February 2026**
> and is no longer usable. If you run your own Piston instance, paste its base URL
> into **Profile → Code runner** and it takes priority over Compiler Explorer.

---

## The rubric

Lessons are pass/fail — learning should not be graded. **Challenges** are scored
0–100 across four weighted dimensions:

| Dimension | Weight | What it measures |
|---|---|---|
| Correctness | 60% | Share of visible **and hidden** cases passed |
| Efficiency | 15% | Per-challenge anti-pattern checks + wall-clock time against a budget |
| Quality | 15% | Idiom, documentation, error handling, right-tool-for-the-job |
| Style | 10% | Concision against the reference solution, plus readability penalties |

Rules the grader plays by:

- A challenge is only **cleared** at 100% correctness. You can score well without
  clearing it — the tracker distinguishes the two.
- Hidden cases carry equal weight and probe edges: empty input, boundaries,
  duplicates, ties, contention.
- XP is paid **on improvement**, not repetition.

---

## The Hall of Fame

Two modes, chosen automatically.

**Local (default).** Your record lives in this browser. Zero setup, works offline,
nothing leaves your device.

**Shared.** Create a free [Supabase](https://supabase.com) project, run the SQL in
[`config.js`](config.js), and paste the project URL and **anon** key into that
file. The board then shows everyone training on your copy.

The anon key is designed to be public and is safe in a public repo — Row Level
Security protects the table. Never put the `service_role` key there.

Because there are no passwords, a determined person could overwrite someone
else's row. That is an accepted trade for zero-friction sign-up on a learning
site, and it is stated plainly in the UI. Do not put anything sensitive in it.

---

## Layout

```
playground/
  index.html              app shell
  config.js               branding + optional Supabase credentials
  css/app.css             design system (dark + light)
  data/
    curriculum.js         course index + lookups
    lessons-python.js     11 lessons     track-python.js   17 challenges
    lessons-rust.js        6 lessons     track-rust.js     12
    lessons-java.js        5 lessons     track-java.js     10
    lessons-web.js         6 lessons     track-web.js       8
    assessments.js        exams, rubric weights, grade bands
  js/
    app.js                hash router + shell
    store.js              localStorage: profile, XP, scores, lessons, drafts, mastery
    runner.js             harness builders, Pyodide, Compiler Explorer, iframe, JS cases
    grader.js             the rubric
    editor.js             Monaco via CDN, textarea fallback
    ui.js                 markdown, tables, radar, rings, heatmap, toasts, modals
    identity.js           username sign-up, course picking
    leaderboard.js        Hall of Fame, local + Supabase
    view-learn.js         course list and the lesson reader
    view-challenge.js     the three-pane workspace
    view-assessment.js    exam runner + report
    view-hall.js          the board
    views-core.js         dashboard, track, rubric, scratch, profile
  tools/                  content verification scripts
```

All progress lives in `localStorage` under `the-gym-v1` and never leaves the
machine unless you enable a shared board. Profile → Data exports it as JSON.

---

## Contributing

New lessons and challenges are the most valuable contribution. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the schemas and the verification workflow.

Short version:

```bash
node tools/audit-lessons.mjs   # lesson structure
node tools/audit.mjs           # challenge rubric self-check
node tools/sweep.mjs rust      # actually compile + run every Rust solution
node tools/sweep.mjs java
```

Then run the browser sweep (see below) for Python, Web and lesson exercises.

---

## Verifying content

Three guards, because content bugs are worse than code bugs — a wrong expected
value teaches someone the wrong thing.

**1. Structure** — `node tools/audit-lessons.mjs`
Missing fields, quiz answers out of range, exercises with no cases, checks that
never return.

**2. Rubric self-consistency** — `node tools/audit.mjs`
Runs every challenge's *own reference solution* through its quality, efficiency
and style checks. A failure means the challenge definition is wrong — a regex
that mis-fires on prose, or a stale `refLines`.

**3. Real execution** — `node tools/sweep.mjs rust|java`
Compiles and runs every reference solution on Compiler Explorer and asserts all
cases pass.

**4. Browser sweep** — Python, Web and every lesson exercise need a browser.
Open `/playground/`, then in the console:

```js
const v = '?b=' + Date.now();
const { TRACKS } = await import('./data/curriculum.js' + v);
const R = await import('./js/runner.js' + v);

for (const track of TRACKS) {
  for (const lesson of track.lessons || []) {
    for (const b of lesson.blocks.filter(b => b.t === 'try' || b.t === 'tryweb')) {
      const lang = b.lang || track.lang;
      const run = b.t === 'tryweb'
        ? await R.runWebChallenge({ checks: b.checks }, b.solution, {})
        : lang === 'javascript'
          ? await R.runJsCases({ cases: b.cases }, b.solution)
          : await R.runCodeChallenge({ lang, kind: 'code' },
              { id: lesson.id, cases: b.cases, preamble: b.preamble }, b.solution, {});
      const pass = run.results.filter(r => r.passed).length;
      console.log(lesson.id, pass + '/' + run.results.length,
        run.results.filter(r => !r.passed).map(r => r.name).join('; '));
    }
  }
}
```

---

## Licence

MIT — see [LICENSE](LICENSE). Fork it, rename it in `config.js`, teach whoever
you like.
