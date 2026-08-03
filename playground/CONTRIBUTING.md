# Contributing to The GYM

The most valuable thing you can add is **content** — a lesson that explains
something clearly, or a challenge that exposes a real mistake.

No build step, no dependencies. Edit a file, refresh the page.

---

## Before you write

Two principles run through everything here.

**1. Assume nothing.** If a beginner would ask "but what does that word mean?",
answer it. Never write "don't worry about this for now" — either explain it or
leave it out. Lesson one of the Python course explains what a program is; that is
the level we start from.

**2. Explain *why*, not just *how*.** Anyone can look up syntax. The value is in
knowing why `==` is a trap in Java, why counting starts at zero, why Rust moves a
`String` but copies an `i32`. Reach for an analogy when the idea is abstract, and
show the failure mode when there is one.

Tone: plain, direct, warm. British spelling. No hype, no exclamation marks, no
"awesome". Treat the reader as a capable adult who happens not to know this yet.

---

## Adding a lesson

Lessons live in `data/lessons-<language>.js`. Append to the exported array.

```js
{
  id: 'py-l12',                    // unique across the whole app
  topic: 'functions-and-errors',   // must match a topic id in the same file
  difficulty: 'beginner',          // beginner | intermediate | advanced
  title: 'Reading Files',
  minutes: 12,
  summary: 'One line, shown in the course list.',
  objectives: ['Open a file safely', 'Read it line by line'],
  blocks: [ /* see below */ ],
}
```

### Block types

```js
{ t: 'text', md: 'Markdown-ish prose.' }

{ t: 'note', tone: 'tip' | 'warn' | 'why' | 'analogy',
  title: 'Short heading', md: 'The point.' }

{ t: 'code', md: 'Optional lead-in.', code: 'print("hi")',
  run: true,          // adds a Run button; omit for a static snippet
  lang: 'python' }    // defaults to the track's language

{ t: 'web', md: 'Optional lead-in.',
  files: { html: '...', css: '...', js: '...' } }   // live editable preview

{ t: 'case', title: 'Case study — an expense tracker',
  md: 'What we are building and why.',
  code: '...', run: true }        // or files: {...} for a web case study

{ t: 'try',                        // graded exercise, pass/fail
  prompt: 'What to do, in markdown.',
  starter: 'def solve():\n    pass\n',
  solution: 'def solve():\n    return 1\n',
  hints: ['Nudge.', 'Bigger nudge.', 'Almost the answer.'],
  cases: [{ name: 'basic', call: 'solve()', expect: '1' }],
  preamble: '...' }                // optional fixtures, spliced before the tests

{ t: 'debug',                      // bug-fixing exercise
  prompt: 'Find and fix the bug.',
  starter: 'def double(n):\n    return n * 3  # bug: multiplies by 3, should be 2\n',
  solution: 'def double(n):\n    return n * 2\n',
  bug_description: 'The function claims to double but actually triples.',
  hints: [...],
  cases: [{ name: 'basic', call: 'double(5)', expect: '10' }] }

{ t: 'complete',                   // code-completion exercise
  prompt: 'Fill in the missing pieces.',
  starter: 'def greet(name):\n    return "Hello, " + ____\n',
  solution: 'def greet(name):\n    return "Hello, " + name\n',
  gap_description: 'The function needs to append the name parameter.',
  hints: [...],
  cases: [{ name: 'greets', call: 'greet("Ada")', expect: '"Hello, Ada"' }] }

{ t: 'refactor',                   // legacy-code improvement exercise
  prompt: 'Rewrite this function to be clearer and more efficient.',
  starter: 'def process(data):\n    result = []\n    for i in range(len(data)):\n        if data[i] > 0:\n            result.append(data[i] * 2)\n    return result\n',
  solution: 'def process(data):\n    return [x * 2 for x in data if x > 0]\n',
  hints: ['A list comprehension can filter and transform in one line.', 'Avoid indexing when you can iterate directly.'],
  cases: [{ name: 'same behaviour', call: 'process([1, -2, 3, 0])', expect: '[2, 6]' }] }

{ t: 'tryweb',                     // graded exercise against a real DOM
  prompt: '...',
  files: { html, css, js },
  solution: { html, css, js },
  hints: [...],
  checks: [{ name: 'has a heading', code: `return !!doc.querySelector('h1');` }] }

{ t: 'quiz',
  q: 'Why does X happen?',
  options: ['wrong', 'right', 'wrong', 'wrong'],
  answer: 1,                       // index into options
  why: 'The explanation shown after answering.' }
```

### Rules for exercises

- `call` and `expect` are **language expressions**, spliced into a generated test
  harness and compared with `==`. They must be the same type.
- Hints should be a ladder: a nudge, then a bigger nudge, then nearly the answer.
  Somebody stuck at 11pm should be able to get unstuck.
- `checks` in a `tryweb` block are **function bodies** run inside the preview
  iframe, with `doc`, `win` and `sleep` in scope. They must `return` something.
  Each check gets a fresh frame, so state never leaks between them.

### Rules for quizzes

A quiz is a teaching device, not a gate. The `why` should be worth reading even
when the answer was obvious. Wrong options should be *plausible* — real
misconceptions, not filler.

---

## Adding a challenge

Challenges live in `data/track-<language>.js`. They are graded on the four-part
rubric rather than pass/fail.

```js
{
  id: 'py-x9',
  title: 'Your Challenge',
  tier: 'algorithms',              // must match a tier id in the same file
  difficulty: 3,                   // 1..5
  xp: 90,
  concepts: ['graphs', 'bfs'],     // feeds the mastery radar
  brief: `Markdown description.`,
  starter: `def solve(n):\n    pass\n`,
  solution: `def solve(n):\n    return n\n`,
  hints: ['...'],

  cases: [
    { name: 'basic', call: 'solve(2)', expect: '2' },
    { name: 'empty', call: 'solve(0)', expect: '0', hidden: true },
  ],

  budgetMs: 150,
  refLines: 4,                     // significant lines in YOUR solution
  quality:    [{ id: 'doc',  label: 'Documented',  weight: 100, re: /"""/ }],
  efficiency: [{ id: 'fast', label: 'Single pass', weight: 100,
                 fn: (code) => (code.match(/\bfor\b/g) || []).length <= 1 }],
}
```

A check is one of:

- `{ re }` — must match
- `{ re, negative: true }` — must **not** match
- `{ fn }` — a predicate returning true when the code did the right thing

**Prefer `fn` whenever a naive regex could mis-fire.** A real bug caught during
development: `/for[\s\S]*for/` matched the word "for" inside a docstring and
failed every correct solution. Counting actual loop headers with a predicate
fixed it.

Aim for roughly half your cases to be `hidden` — that is where the teaching is.
Empty input, boundaries, duplicates, ties, negative numbers, off-by-one.

---

## Verifying your work

Content bugs are worse than code bugs: a wrong expected value teaches somebody
the wrong thing. Run all of these.

```bash
node tools/audit-lessons.mjs
```

```bash
node tools/audit.mjs
```

```bash
node tools/sweep.mjs rust
```

`audit.mjs` is the sharp one: it pushes every challenge's own reference solution
through its own rubric checks. If your reference solution does not score 100 on
quality, efficiency and style, your **challenge definition** is wrong.

For Python, Web and lesson exercises, run the browser sweep from the README —
they need Pyodide and a DOM, so Node cannot do it.

---

## Code style

Match what is already there.

- Plain ES modules, no framework, no bundler, no dependencies.
- Comments explain **why**, not what. If a line needs a comment to say what it
  does, rename something instead.
- Two-space indent in JS, four in Python examples.
- British spelling in user-facing text.

---

## What not to add

- A build step, a framework, or an npm dependency for the site itself.
- Anything requiring a server, beyond the optional Supabase board.
- Tracking, analytics or advertising.
- Content that assumes prior knowledge without explaining it.
