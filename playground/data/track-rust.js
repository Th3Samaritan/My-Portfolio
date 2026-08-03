/* ============================================================
   Rust Track — zero to mastery
   Same challenge schema as track-python.js.
   `call` / `expect` are Rust expressions of the SAME type; the
   harness compares them with == and prints both with {:?}.
   User code is spliced in at module scope (free fns, structs,
   traits, impls — anything but `fn main`).
   ============================================================ */

export const rustTiers = [
  { id: 'fundamentals', name: 'Fundamentals',   blurb: 'Bindings, slices, iterators, pattern matching.' },
  { id: 'ownership',    name: 'Ownership',      blurb: 'Moves, borrows, lifetimes — the part that makes Rust Rust.' },
  { id: 'traits',       name: 'Traits & Generics', blurb: 'Abstraction without a garbage collector.' },
  { id: 'errors',       name: 'Error Handling', blurb: 'Option, Result, ?, and error types that compose.' },
  { id: 'collections',  name: 'Collections & Algorithms', blurb: 'HashMap, Vec, and idiomatic transformation pipelines.' },
  { id: 'concurrency',  name: 'Concurrency',    blurb: 'Threads, Arc, Mutex, channels — fearlessly.' },
];

export const rustChallenges = [
  /* -------------------------------------------------------- Fundamentals */
  {
    id: 'rs-f1',
    title: 'Iterator Warm-Up',
    tier: 'fundamentals',
    difficulty: 1,
    xp: 45,
    concepts: ['iterators', 'closures', 'slices'],
    brief: `Two functions over a \`&[i32]\`:

- \`sum_of_evens(xs: &[i32]) -> i32\`
- \`squared_odds(xs: &[i32]) -> Vec<i32>\` — squares of the odd values, in order

Write them as **iterator chains**. An index-based \`for\` loop passes correctness but loses style marks.`,
    starter: `fn sum_of_evens(xs: &[i32]) -> i32 {\n    todo!()\n}\n\nfn squared_odds(xs: &[i32]) -> Vec<i32> {\n    todo!()\n}\n`,
    solution: `fn sum_of_evens(xs: &[i32]) -> i32 {\n    xs.iter().filter(|x| *x % 2 == 0).sum()\n}\n\nfn squared_odds(xs: &[i32]) -> Vec<i32> {\n    xs.iter().filter(|x| *x % 2 != 0).map(|x| x * x).collect()\n}\n`,
    hints: [
      '`xs.iter()` yields `&i32`, so your closure parameter is a `&&i32` — deref with `*x`.',
      '`.sum()` needs a type it can infer; the return type gives it that.',
      'Negative odd numbers: `% 2 != 0` is safer than `% 2 == 1`.',
    ],
    cases: [
      { name: 'sum of evens', call: 'sum_of_evens(&[1, 2, 3, 4, 5, 6])', expect: '12' },
      { name: 'no evens', call: 'sum_of_evens(&[1, 3, 5])', expect: '0' },
      { name: 'squared odds', call: 'squared_odds(&[1, 2, 3, 4])', expect: 'vec![1, 9]' },
      { name: 'empty slice', call: 'squared_odds(&[])', expect: 'Vec::<i32>::new()' },
      { name: 'negatives count as odd', call: 'squared_odds(&[-3, -2, 7])', expect: 'vec![9, 49]', hidden: true },
    ],
    budgetMs: 40,
    refLines: 6,
    quality: [
      { id: 'iter', label: 'Uses an iterator chain', weight: 50, re: /\.iter\s*\(\s*\)|\.into_iter\s*\(\s*\)/ },
      { id: 'no-index', label: 'No manual index arithmetic', weight: 30, re: /xs\s*\[\s*i\s*\]/, negative: true },
      { id: 'no-mut', label: 'No mutable accumulator needed', weight: 20, re: /let\s+mut\s+\w+\s*=\s*0/, negative: true },
    ],
    efficiency: [
      { id: 'single-pass', label: 'One pass per function', weight: 100, re: /\.collect[\s\S]{0,40}\.iter\s*\(\s*\)[\s\S]{0,40}\.collect/, negative: true },
    ],
  },

  {
    id: 'rs-f2',
    title: 'Pattern Matching Grades',
    tier: 'fundamentals',
    difficulty: 2,
    xp: 55,
    concepts: ['pattern-matching', 'enums', 'control-flow'],
    brief: `Model a grade as an enum and classify scores.

\`\`\`rust
#[derive(Debug, PartialEq)]
enum Grade { A, B, C, D, F }
\`\`\`

Implement \`classify(score: u32) -> Grade\` using **match with range patterns**:
90+ → A, 80–89 → B, 70–79 → C, 60–69 → D, below 60 → F. Scores above 100 are still A.

Also \`describe(g: &Grade) -> &'static str\` returning \`"excellent"\`, \`"good"\`, \`"fair"\`, \`"weak"\`, \`"failing"\`.`,
    starter: `#[derive(Debug, PartialEq)]\nenum Grade { A, B, C, D, F }\n\nfn classify(score: u32) -> Grade {\n    todo!()\n}\n\nfn describe(g: &Grade) -> &'static str {\n    todo!()\n}\n`,
    solution: `#[derive(Debug, PartialEq)]\nenum Grade { A, B, C, D, F }\n\nfn classify(score: u32) -> Grade {\n    match score {\n        90..=u32::MAX => Grade::A,\n        80..=89 => Grade::B,\n        70..=79 => Grade::C,\n        60..=69 => Grade::D,\n        _ => Grade::F,\n    }\n}\n\nfn describe(g: &Grade) -> &'static str {\n    match g {\n        Grade::A => "excellent",\n        Grade::B => "good",\n        Grade::C => "fair",\n        Grade::D => "weak",\n        Grade::F => "failing",\n    }\n}\n`,
    hints: [
      'Range patterns are inclusive with `..=`, e.g. `80..=89`.',
      'Order matters — put the open-ended arm first or use `_` last.',
      'Matching on `&Grade` lets you write `Grade::A` arms directly thanks to match ergonomics.',
    ],
    cases: [
      { name: 'A grade', call: 'classify(95)', expect: 'Grade::A' },
      { name: 'B grade', call: 'classify(85)', expect: 'Grade::B' },
      { name: 'boundary 80', call: 'classify(80)', expect: 'Grade::B' },
      { name: 'F grade', call: 'classify(12)', expect: 'Grade::F' },
      { name: 'describe', call: 'describe(&Grade::C)', expect: '"fair"' },
      { name: 'over 100 is still A', call: 'classify(140)', expect: 'Grade::A', hidden: true },
      { name: 'boundary 59', call: 'classify(59)', expect: 'Grade::F', hidden: true },
    ],
    budgetMs: 40,
    refLines: 19,
    quality: [
      { id: 'match', label: 'Uses `match`, not an if/else ladder', weight: 50, re: /match\s+score/ },
      { id: 'ranges', label: 'Uses inclusive range patterns', weight: 30, re: /\d+\s*\.\.=/ },
      { id: 'exhaustive', label: 'describe covers every variant', weight: 20, re: /Grade::F\s*=>/ },
    ],
    efficiency: [
      { id: 'no-string-alloc', label: 'Returns &str, no needless String allocation', weight: 100, re: /String::from|\.to_string\s*\(\s*\)/, negative: true },
    ],
  },

  /* ------------------------------------------------------------ Ownership */
  {
    id: 'rs-o1',
    title: 'Lifetimes & The Longest Word',
    tier: 'ownership',
    difficulty: 3,
    xp: 85,
    concepts: ['lifetimes', 'borrowing', 'slices'],
    brief: `\`longest_word(text: &str) -> &str\` returns the longest whitespace-separated word, **borrowed from the input** — no allocation.

- ties go to the word that appears first
- empty input returns \`""\`

This is a lifetime exercise: the returned slice must be tied to the input's lifetime. If you find yourself calling \`.to_string()\`, you have side-stepped the lesson.`,
    starter: `fn longest_word(text: &str) -> &str {\n    todo!()\n}\n`,
    solution: `fn longest_word(text: &str) -> &str {\n    text.split_whitespace()\n        .fold("", |best, word| if word.len() > best.len() { word } else { best })\n}\n`,
    hints: [
      '`split_whitespace()` yields `&str` slices that already borrow from `text`.',
      'Careful: `max_by_key` returns the LAST maximum on ties, and the spec wants the first. A `fold` that only replaces on a strictly greater length gives you the right tiebreak — and handles the empty case for free.',
      'A single elided lifetime on the input propagates to the output automatically.',
    ],
    cases: [
      { name: 'picks longest', call: 'longest_word("the quick brownest fox")', expect: '"brownest"' },
      { name: 'first on tie', call: 'longest_word("aaa bbb")', expect: '"aaa"' },
      { name: 'single word', call: 'longest_word("solo")', expect: '"solo"' },
      { name: 'empty', call: 'longest_word("")', expect: '""' },
      { name: 'extra whitespace', call: 'longest_word("  a   bcd  ")', expect: '"bcd"', hidden: true },
    ],
    budgetMs: 40,
    refLines: 4,
    quality: [
      { id: 'borrows', label: 'Returns a borrowed slice, not a String', weight: 50, re: /\.to_string\s*\(\s*\)|String::from/, negative: true },
      { id: 'split-ws', label: 'Uses split_whitespace', weight: 30, re: /split_whitespace/ },
      { id: 'no-unwrap-panic', label: 'Handles the empty case without panicking', weight: 20, re: /\.unwrap\s*\(\s*\)|\.expect\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-collect', label: 'No intermediate Vec allocation', weight: 100, re: /\.collect::<Vec/, negative: true },
    ],
  },

  {
    id: 'rs-o2',
    title: 'Build a Stack<T>',
    tier: 'ownership',
    difficulty: 3,
    xp: 90,
    concepts: ['generics', 'ownership', 'structs'],
    brief: `A generic LIFO \`Stack<T>\` over a \`Vec<T>\`:

- \`Stack::new()\`
- \`push(&mut self, item: T)\`
- \`pop(&mut self) -> Option<T>\` — moves the value out
- \`peek(&self) -> Option<&T>\` — **borrows** it
- \`len(&self) -> usize\`, \`is_empty(&self) -> bool\`

Note the deliberate asymmetry: \`pop\` transfers ownership, \`peek\` lends.`,
    starter: `struct Stack<T> {\n    items: Vec<T>,\n}\n\nimpl<T> Stack<T> {\n    fn new() -> Self {\n        todo!()\n    }\n}\n`,
    solution: `struct Stack<T> {\n    items: Vec<T>,\n}\n\nimpl<T> Stack<T> {\n    fn new() -> Self {\n        Stack { items: Vec::new() }\n    }\n\n    fn push(&mut self, item: T) {\n        self.items.push(item);\n    }\n\n    fn pop(&mut self) -> Option<T> {\n        self.items.pop()\n    }\n\n    fn peek(&self) -> Option<&T> {\n        self.items.last()\n    }\n\n    fn len(&self) -> usize {\n        self.items.len()\n    }\n\n    fn is_empty(&self) -> bool {\n        self.items.is_empty()\n    }\n}\n`,
    hints: [
      '`Vec::pop` already returns `Option<T>` — just forward it.',
      '`Vec::last` returns `Option<&T>`, exactly what `peek` needs.',
      '`Self` inside the impl block saves you repeating `Stack<T>`.',
    ],
    cases: [
      { name: 'push then pop', call: '{ let mut s = Stack::new(); s.push(1); s.push(2); s.pop() }', expect: 'Some(2)' },
      { name: 'pop empty', call: '{ let mut s: Stack<i32> = Stack::new(); s.pop() }', expect: 'None' },
      { name: 'peek borrows', call: '{ let mut s = Stack::new(); s.push(9); s.peek().copied() }', expect: 'Some(9)' },
      { name: 'len tracks', call: '{ let mut s = Stack::new(); s.push("a"); s.push("b"); s.len() }', expect: '2' },
      { name: 'is_empty', call: '{ let s: Stack<u8> = Stack::new(); s.is_empty() }', expect: 'true' },
      { name: 'works with Strings', call: '{ let mut s = Stack::new(); s.push(String::from("x")); s.pop() }', expect: 'Some(String::from("x"))', hidden: true },
      { name: 'LIFO order', call: '{ let mut s = Stack::new(); for i in 0..3 { s.push(i); } vec![s.pop(), s.pop(), s.pop()] }', expect: 'vec![Some(2), Some(1), Some(0)]', hidden: true },
    ],
    budgetMs: 40,
    refLines: 23,
    quality: [
      { id: 'generic', label: 'Genuinely generic over T', weight: 40, re: /impl\s*<\s*T\s*>/ },
      { id: 'peek-ref', label: 'peek returns Option<&T>', weight: 35, re: /fn\s+peek\s*\(\s*&self\s*\)\s*->\s*Option\s*<\s*&/ },
      { id: 'self-type', label: 'Uses `Self` in the constructor', weight: 25, re: /->\s*Self/ },
    ],
    efficiency: [
      { id: 'no-clone', label: 'No cloning to work around the borrow checker', weight: 100, re: /\.clone\s*\(\s*\)/, negative: true },
    ],
  },

  /* --------------------------------------------------------- Traits & Generics */
  {
    id: 'rs-t1',
    title: 'Traits with Default Methods',
    tier: 'traits',
    difficulty: 3,
    xp: 95,
    concepts: ['traits', 'polymorphism', 'default-methods'],
    brief: `Define a \`Shape\` trait:

- required: \`area(&self) -> f64\` and \`name(&self) -> &'static str\`
- **default method**: \`summary(&self) -> String\` → \`"circle has area 12.57"\` (area rounded to 2 decimals)

Implement it for \`Circle { radius: f64 }\` and \`Rect { w: f64, h: f64 }\`.

Then \`total_area(shapes: &[Box<dyn Shape>]) -> f64\` — dynamic dispatch over a heterogeneous collection.`,
    starter: `trait Shape {\n    fn area(&self) -> f64;\n    fn name(&self) -> &'static str;\n}\n\nstruct Circle { radius: f64 }\nstruct Rect { w: f64, h: f64 }\n`,
    solution: `trait Shape {\n    fn area(&self) -> f64;\n    fn name(&self) -> &'static str;\n\n    fn summary(&self) -> String {\n        format!("{} has area {:.2}", self.name(), self.area())\n    }\n}\n\nstruct Circle { radius: f64 }\nstruct Rect { w: f64, h: f64 }\n\nimpl Shape for Circle {\n    fn area(&self) -> f64 {\n        std::f64::consts::PI * self.radius * self.radius\n    }\n    fn name(&self) -> &'static str { "circle" }\n}\n\nimpl Shape for Rect {\n    fn area(&self) -> f64 {\n        self.w * self.h\n    }\n    fn name(&self) -> &'static str { "rect" }\n}\n\nfn total_area(shapes: &[Box<dyn Shape>]) -> f64 {\n    shapes.iter().map(|s| s.area()).sum()\n}\n`,
    hints: [
      'A default method body lives in the trait itself and can call the required methods.',
      '`format!("{:.2}", x)` rounds to two decimals.',
      '`Box<dyn Shape>` is the trait object; iterate and call `.area()` — the vtable does the rest.',
    ],
    cases: [
      { name: 'circle area', call: '(Circle { radius: 2.0 }.area() * 100.0).round() as i64', expect: '1257' },
      { name: 'rect area', call: 'Rect { w: 3.0, h: 4.0 }.area()', expect: '12.0' },
      { name: 'default summary', call: 'Circle { radius: 2.0 }.summary()', expect: 'String::from("circle has area 12.57")' },
      { name: 'rect summary', call: 'Rect { w: 2.0, h: 5.0 }.summary()', expect: 'String::from("rect has area 10.00")' },
      { name: 'dynamic dispatch', call: 'total_area(&vec![Box::new(Rect { w: 2.0, h: 2.0 }) as Box<dyn Shape>, Box::new(Rect { w: 1.0, h: 3.0 })])', expect: '7.0' },
      { name: 'empty collection', call: 'total_area(&Vec::<Box<dyn Shape>>::new())', expect: '0.0', hidden: true },
    ],
    budgetMs: 60,
    refLines: 24,
    quality: [
      { id: 'default-method', label: 'summary is a trait default method', weight: 45, re: /trait\s+Shape[\s\S]{0,400}fn\s+summary[\s\S]{0,200}\{[\s\S]{0,200}format!/ },
      { id: 'no-dup', label: 'summary not copy-pasted into each impl', weight: 30, re: /impl\s+Shape\s+for\s+Circle[\s\S]{0,400}fn\s+summary/, negative: true },
      { id: 'consts-pi', label: 'Uses std::f64::consts::PI, not a literal', weight: 25, re: /consts::PI/ },
    ],
    efficiency: [
      { id: 'iter-sum', label: 'total_area uses an iterator sum', weight: 100, re: /\.sum\s*\(\s*\)|fold/ },
    ],
  },

  {
    id: 'rs-t2',
    title: 'Generic Bounds',
    tier: 'traits',
    difficulty: 3,
    xp: 85,
    concepts: ['generics', 'trait-bounds', 'iterators'],
    brief: `Two generic functions:

- \`largest<T: PartialOrd + Copy>(xs: &[T]) -> Option<T>\`
- \`count_matching<T, F>(xs: &[T], pred: F) -> usize where F: Fn(&T) -> bool\`

The point is the **bounds**: state the minimum you need, no more.`,
    starter: `fn largest<T: PartialOrd + Copy>(xs: &[T]) -> Option<T> {\n    todo!()\n}\n\nfn count_matching<T, F>(xs: &[T], pred: F) -> usize\nwhere\n    F: Fn(&T) -> bool,\n{\n    todo!()\n}\n`,
    solution: `fn largest<T: PartialOrd + Copy>(xs: &[T]) -> Option<T> {\n    let mut iter = xs.iter();\n    let first = *iter.next()?;\n    Some(iter.fold(first, |acc, &x| if x > acc { x } else { acc }))\n}\n\nfn count_matching<T, F>(xs: &[T], pred: F) -> usize\nwhere\n    F: Fn(&T) -> bool,\n{\n    xs.iter().filter(|x| pred(x)).count()\n}\n`,
    hints: [
      '`?` on an Option inside a function returning Option handles the empty slice in one character.',
      '`fold` with the first element as the seed avoids needing `T: Ord`.',
      'PartialOrd (not Ord) is enough for `>` and lets the function work with floats.',
    ],
    cases: [
      { name: 'largest int', call: 'largest(&[3, 9, 2])', expect: 'Some(9)' },
      { name: 'largest float', call: 'largest(&[1.5, 0.2, 7.25])', expect: 'Some(7.25)' },
      { name: 'empty is None', call: 'largest::<i32>(&[])', expect: 'None' },
      { name: 'count with closure', call: 'count_matching(&[1, 2, 3, 4], |x| x % 2 == 0)', expect: '2' },
      { name: 'count none', call: 'count_matching(&[1, 3], |x| *x > 10)', expect: '0' },
      { name: 'works on chars', call: 'largest(&[\'a\', \'z\', \'m\'])', expect: "Some('z')", hidden: true },
    ],
    budgetMs: 40,
    refLines: 11,
    quality: [
      { id: 'where-clause', label: 'Closure bound expressed with a where clause', weight: 35, re: /where\s*[\s\S]{0,60}Fn\s*\(/ },
      { id: 'question-mark', label: 'Uses `?` or a match for the empty case', weight: 35, re: /\?\s*;|match\s+|unwrap_or|if\s+xs\.is_empty/ },
      { id: 'no-unwrap', label: 'No naked .unwrap() that could panic', weight: 30, re: /\.unwrap\s*\(\s*\)/, negative: true },
    ],
    efficiency: [
      { id: 'no-sort', label: 'Does not sort just to find the max', weight: 100, re: /\.sort/, negative: true },
    ],
  },

  /* --------------------------------------------------------- Error Handling */
  {
    id: 'rs-e1',
    title: 'Result, ? and a Custom Error',
    tier: 'errors',
    difficulty: 4,
    xp: 110,
    concepts: ['result', 'error-handling', 'enums', 'from-trait'],
    brief: `Parse \`"key=value"\` config lines into an \`(String, i32)\` pair.

\`\`\`rust
#[derive(Debug, PartialEq)]
enum ConfigError { Malformed, BadNumber, EmptyKey }
\`\`\`

\`parse_entry(line: &str) -> Result<(String, i32), ConfigError>\`
- no \`=\` → \`Malformed\`
- empty key → \`EmptyKey\`
- value not an integer → \`BadNumber\`
- trim whitespace around both sides

Then \`parse_all(lines: &[&str]) -> Result<Vec<(String, i32)>, ConfigError>\` — fails on the **first** bad line. Use \`?\` and let \`collect()\` do the heavy lifting.`,
    starter: `#[derive(Debug, PartialEq)]\nenum ConfigError { Malformed, BadNumber, EmptyKey }\n\nfn parse_entry(line: &str) -> Result<(String, i32), ConfigError> {\n    todo!()\n}\n\nfn parse_all(lines: &[&str]) -> Result<Vec<(String, i32)>, ConfigError> {\n    todo!()\n}\n`,
    solution: `#[derive(Debug, PartialEq)]\nenum ConfigError { Malformed, BadNumber, EmptyKey }\n\nfn parse_entry(line: &str) -> Result<(String, i32), ConfigError> {\n    let (raw_key, raw_value) = line.split_once('=').ok_or(ConfigError::Malformed)?;\n    let key = raw_key.trim();\n    if key.is_empty() {\n        return Err(ConfigError::EmptyKey);\n    }\n    let value = raw_value\n        .trim()\n        .parse::<i32>()\n        .map_err(|_| ConfigError::BadNumber)?;\n    Ok((key.to_string(), value))\n}\n\nfn parse_all(lines: &[&str]) -> Result<Vec<(String, i32)>, ConfigError> {\n    lines.iter().map(|line| parse_entry(line)).collect()\n}\n`,
    hints: [
      '`split_once(\'=\')` gives you `Option<(&str, &str)>` — pair it with `ok_or`.',
      '`map_err` converts the parse error into your domain error before `?` propagates it.',
      '`Iterator<Item = Result<T, E>>` collects straight into `Result<Vec<T>, E>` — that is the whole of parse_all.',
    ],
    cases: [
      { name: 'simple entry', call: 'parse_entry("port=8080")', expect: 'Ok((String::from("port"), 8080))' },
      { name: 'trims whitespace', call: 'parse_entry("  size = 42 ")', expect: 'Ok((String::from("size"), 42))' },
      { name: 'no equals', call: 'parse_entry("oops")', expect: 'Err(ConfigError::Malformed)' },
      { name: 'bad number', call: 'parse_entry("n=abc")', expect: 'Err(ConfigError::BadNumber)' },
      { name: 'empty key', call: 'parse_entry("=5")', expect: 'Err(ConfigError::EmptyKey)' },
      { name: 'parse_all happy', call: 'parse_all(&["a=1", "b=2"])', expect: 'Ok(vec![(String::from("a"), 1), (String::from("b"), 2)])' },
      { name: 'parse_all short-circuits', call: 'parse_all(&["a=1", "nope", "c=3"])', expect: 'Err(ConfigError::Malformed)', hidden: true },
      { name: 'negative values', call: 'parse_entry("delta=-17")', expect: 'Ok((String::from("delta"), -17))', hidden: true },
    ],
    budgetMs: 60,
    refLines: 16,
    quality: [
      { id: 'question-mark', label: 'Propagates with `?` rather than nested matches', weight: 40, re: /\?\s*;|\?\s*\)/ },
      { id: 'map-err', label: 'Converts foreign errors with map_err / From', weight: 30, re: /map_err|impl\s+From</ },
      { id: 'no-unwrap', label: 'No .unwrap() / .expect() in the parse path', weight: 30, re: /\.unwrap\s*\(\s*\)|\.expect\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'collect-result', label: 'parse_all collects into Result, no manual loop+push', weight: 100, re: /\.collect\s*\(\s*\)/ },
    ],
  },

  {
    id: 'rs-e2',
    title: 'Option Combinators',
    tier: 'errors',
    difficulty: 2,
    xp: 70,
    concepts: ['option', 'combinators', 'error-handling'],
    brief: `Chain \`Option\` without a single \`match\`:

- \`first_even(xs: &[i32]) -> Option<i32>\`
- \`double_if_positive(x: Option<i32>) -> Option<i32>\` — \`Some(2x)\` when x > 0, else \`None\`
- \`name_length(names: &[&str], index: usize) -> Option<usize>\` — length of the name at \`index\`, \`None\` if out of range

The rubric rewards \`map\`, \`and_then\`, \`filter\`, \`copied\`, \`get\` over explicit matching.`,
    starter: `fn first_even(xs: &[i32]) -> Option<i32> {\n    todo!()\n}\n\nfn double_if_positive(x: Option<i32>) -> Option<i32> {\n    todo!()\n}\n\nfn name_length(names: &[&str], index: usize) -> Option<usize> {\n    todo!()\n}\n`,
    solution: `fn first_even(xs: &[i32]) -> Option<i32> {\n    xs.iter().find(|x| *x % 2 == 0).copied()\n}\n\nfn double_if_positive(x: Option<i32>) -> Option<i32> {\n    x.filter(|v| *v > 0).map(|v| v * 2)\n}\n\nfn name_length(names: &[&str], index: usize) -> Option<usize> {\n    names.get(index).map(|name| name.len())\n}\n`,
    hints: [
      '`slice::get(i)` is the non-panicking index — it hands you an Option.',
      '`filter` on an Option keeps `Some` only when the predicate holds.',
      '`.copied()` turns `Option<&i32>` into `Option<i32>`.',
    ],
    cases: [
      { name: 'first even', call: 'first_even(&[1, 3, 6, 8])', expect: 'Some(6)' },
      { name: 'no evens', call: 'first_even(&[1, 3])', expect: 'None' },
      { name: 'doubles positive', call: 'double_if_positive(Some(5))', expect: 'Some(10)' },
      { name: 'rejects negative', call: 'double_if_positive(Some(-1))', expect: 'None' },
      { name: 'None passes through', call: 'double_if_positive(None)', expect: 'None' },
      { name: 'name length', call: 'name_length(&["ada", "hopper"], 1)', expect: 'Some(6)' },
      { name: 'index out of range', call: 'name_length(&["ada"], 9)', expect: 'None', hidden: true },
      { name: 'zero is not positive', call: 'double_if_positive(Some(0))', expect: 'None', hidden: true },
    ],
    budgetMs: 40,
    refLines: 9,
    quality: [
      { id: 'combinators', label: 'Uses Option combinators', weight: 50, re: /\.map\s*\(|\.and_then\s*\(|\.filter\s*\(/ },
      { id: 'no-match', label: 'No explicit match on Option', weight: 30, re: /match\s+[\s\S]{0,40}Some\s*\(/, negative: true },
      { id: 'safe-index', label: 'Uses .get() instead of indexing', weight: 20, re: /\.get\s*\(/ },
    ],
    efficiency: [
      { id: 'no-panic', label: 'No unwrap that could panic', weight: 100, re: /\.unwrap\s*\(\s*\)/, negative: true },
    ],
  },

  /* ------------------------------------------------- Collections & Algorithms */
  {
    id: 'rs-c1',
    title: 'Run-Length Encoding',
    tier: 'collections',
    difficulty: 3,
    xp: 90,
    concepts: ['strings', 'iterators', 'algorithms'],
    brief: `- \`encode(s: &str) -> String\` — \`"aaabbc"\` → \`"a3b2c1"\`
- \`decode(s: &str) -> String\` — the exact inverse

Assume the input to \`encode\` is lowercase ASCII letters only, and that \`decode\` receives well-formed output from \`encode\` (counts may be multi-digit).`,
    starter: `fn encode(s: &str) -> String {\n    todo!()\n}\n\nfn decode(s: &str) -> String {\n    todo!()\n}\n`,
    solution: `fn encode(s: &str) -> String {\n    let mut out = String::new();\n    let mut chars = s.chars().peekable();\n    while let Some(current) = chars.next() {\n        let mut run = 1;\n        while chars.peek() == Some(&current) {\n            chars.next();\n            run += 1;\n        }\n        out.push(current);\n        out.push_str(&run.to_string());\n    }\n    out\n}\n\nfn decode(s: &str) -> String {\n    let mut out = String::new();\n    let mut chars = s.chars().peekable();\n    while let Some(letter) = chars.next() {\n        let mut digits = String::new();\n        while let Some(d) = chars.peek() {\n            if d.is_ascii_digit() {\n                digits.push(*d);\n                chars.next();\n            } else {\n                break;\n            }\n        }\n        let count: usize = digits.parse().unwrap_or(0);\n        for _ in 0..count {\n            out.push(letter);\n        }\n    }\n    out\n}\n`,
    hints: [
      '`.peekable()` lets you look at the next char without consuming it — exactly what run detection needs.',
      'For decode, accumulate consecutive digits into a String before parsing; counts can exceed 9.',
      '`"x".repeat(n)` is a shortcut for the inner push loop.',
    ],
    cases: [
      { name: 'basic encode', call: 'encode("aaabbc")', expect: 'String::from("a3b2c1")' },
      { name: 'single char', call: 'encode("z")', expect: 'String::from("z1")' },
      { name: 'empty encode', call: 'encode("")', expect: 'String::from("")' },
      { name: 'basic decode', call: 'decode("a3b2c1")', expect: 'String::from("aaabbc")' },
      { name: 'round trip', call: 'decode(&encode("mississippi"))', expect: 'String::from("mississippi")' },
      { name: 'multi-digit counts', call: 'encode("aaaaaaaaaaaa")', expect: 'String::from("a12")', hidden: true },
      { name: 'multi-digit decode', call: 'decode("a12b3")', expect: 'String::from("aaaaaaaaaaaabbb")', hidden: true },
      { name: 'alternating', call: 'encode("ababab")', expect: 'String::from("a1b1a1b1a1b1")', hidden: true },
    ],
    budgetMs: 80,
    refLines: 34,
    quality: [
      { id: 'peekable', label: 'Uses a peekable iterator', weight: 40, re: /peekable/ },
      { id: 'chars', label: 'Iterates chars(), not raw byte indices', weight: 30, re: /\.chars\s*\(\s*\)/ },
      { id: 'no-unwrap', label: 'No panicking unwrap on parse', weight: 30, re: /parse[\s\S]{0,30}\.unwrap\s*\(\s*\)/, negative: true },
    ],
    efficiency: [
      { id: 'no-quadratic', label: 'No repeated string concatenation with +', weight: 100, re: /out\s*=\s*out\s*\+/, negative: true },
    ],
  },

  {
    id: 'rs-c2',
    title: 'Two Sum with HashMap',
    tier: 'collections',
    difficulty: 3,
    xp: 90,
    concepts: ['hashmap', 'algorithms', 'collections'],
    brief: `\`two_sum(xs: &[i32], target: i32) -> Option<(usize, usize)>\` — indices of the two values summing to \`target\`.

- return the pair with the **smallest second index**; within that, the smallest first index
- indices must be distinct
- \`None\` when no pair exists

One pass with a \`HashMap<i32, usize>\` of value → index. The nested-loop version fails the efficiency rubric and the large hidden test.`,
    starter: `use std::collections::HashMap;\n\nfn two_sum(xs: &[i32], target: i32) -> Option<(usize, usize)> {\n    todo!()\n}\n`,
    solution: `use std::collections::HashMap;\n\nfn two_sum(xs: &[i32], target: i32) -> Option<(usize, usize)> {\n    let mut seen: HashMap<i32, usize> = HashMap::new();\n    for (index, &value) in xs.iter().enumerate() {\n        if let Some(&previous) = seen.get(&(target - value)) {\n            return Some((previous, index));\n        }\n        seen.entry(value).or_insert(index);\n    }\n    None\n}\n`,
    hints: [
      'As you walk the slice, ask whether the complement `target - value` has already been seen.',
      '`entry(value).or_insert(index)` keeps the FIRST index for duplicate values.',
      'Returning as soon as you find a complement naturally gives the smallest second index.',
    ],
    cases: [
      { name: 'classic', call: 'two_sum(&[2, 7, 11, 15], 9)', expect: 'Some((0, 1))' },
      { name: 'later pair', call: 'two_sum(&[3, 2, 4], 6)', expect: 'Some((1, 2))' },
      { name: 'duplicates', call: 'two_sum(&[3, 3], 6)', expect: 'Some((0, 1))' },
      { name: 'no pair', call: 'two_sum(&[1, 2], 99)', expect: 'None' },
      { name: 'negatives', call: 'two_sum(&[-3, 4, 3, 90], 0)', expect: 'Some((0, 2))', hidden: true },
      { name: 'empty', call: 'two_sum(&[], 0)', expect: 'None', hidden: true },
      { name: 'large input stays fast', call: '{ let v: Vec<i32> = (0..20000).collect(); two_sum(&v, 39997) }', expect: 'Some((19998, 19999))', hidden: true },
    ],
    budgetMs: 300,
    refLines: 11,
    quality: [
      { id: 'hashmap', label: 'Uses a HashMap for lookups', weight: 45, re: /HashMap/ },
      { id: 'enumerate', label: 'Uses .enumerate() rather than index arithmetic', weight: 30, re: /\.enumerate\s*\(\s*\)/ },
      { id: 'entry-api', label: 'Uses the entry API', weight: 25, re: /\.entry\s*\(/ },
    ],
    efficiency: [
      { id: 'no-nested', label: 'Single pass — no nested loop over the slice', weight: 100, re: /for[\s\S]{0,200}for[\s\S]{0,120}xs/, negative: true },
    ],
  },

  /* -------------------------------------------------------------- Concurrency */
  {
    id: 'rs-x1',
    title: 'Shared Counter Across Threads',
    tier: 'concurrency',
    difficulty: 4,
    xp: 120,
    concepts: ['threads', 'arc', 'mutex', 'concurrency'],
    brief: `\`parallel_count(n_threads: usize, per_thread: usize) -> usize\`

Spawn \`n_threads\` threads; each increments a **shared** counter \`per_thread\` times. Join them all and return the final value — which must always equal \`n_threads * per_thread\`.

\`Arc<Mutex<usize>>\` is the shape. Clone the \`Arc\` before each \`spawn\`, lock inside the loop, and remember that a \`MutexGuard\` releases at end of scope.`,
    starter: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn parallel_count(n_threads: usize, per_thread: usize) -> usize {\n    todo!()\n}\n`,
    solution: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn parallel_count(n_threads: usize, per_thread: usize) -> usize {\n    let counter = Arc::new(Mutex::new(0usize));\n    let mut handles = Vec::with_capacity(n_threads);\n\n    for _ in 0..n_threads {\n        let counter = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            for _ in 0..per_thread {\n                let mut guard = counter.lock().unwrap();\n                *guard += 1;\n            }\n        }));\n    }\n\n    for handle in handles {\n        handle.join().unwrap();\n    }\n\n    let total = *counter.lock().unwrap();\n    total\n}\n`,
    hints: [
      '`Arc::clone(&counter)` inside the loop, then `move` the clone into the closure.',
      'Collect the JoinHandles into a Vec and join them all *after* the spawn loop — joining inside makes it serial.',
      'Deref the guard to mutate: `*guard += 1`.',
    ],
    cases: [
      { name: 'four threads', call: 'parallel_count(4, 1000)', expect: '4000' },
      { name: 'single thread', call: 'parallel_count(1, 50)', expect: '50' },
      { name: 'zero threads', call: 'parallel_count(0, 100)', expect: '0' },
      { name: 'no lost updates under contention', call: 'parallel_count(8, 5000)', expect: '40000', hidden: true },
      { name: 'zero work per thread', call: 'parallel_count(4, 0)', expect: '0', hidden: true },
    ],
    budgetMs: 1500,
    refLines: 19,
    quality: [
      { id: 'arc-mutex', label: 'Uses Arc<Mutex<_>> for shared state', weight: 40, re: /Arc\s*<\s*Mutex|Arc::new\s*\(\s*Mutex::new/ },
      { id: 'arc-clone', label: 'Clones the Arc per thread', weight: 30, re: /Arc::clone|\.clone\s*\(\s*\)/ },
      { id: 'joins', label: 'Joins every handle', weight: 30, re: /\.join\s*\(\s*\)/ },
    ],
    efficiency: [
      { id: 'parallel', label: 'Spawns first, joins after — genuinely parallel', weight: 100, re: /spawn[\s\S]{0,200}\.join\s*\(\s*\)\s*\.unwrap\s*\(\s*\)\s*;\s*\n\s*\}/, negative: true },
    ],
  },

  {
    id: 'rs-x2',
    title: 'Channel Fan-In',
    tier: 'concurrency',
    difficulty: 5,
    xp: 135,
    concepts: ['channels', 'threads', 'concurrency', 'mpsc'],
    brief: `\`sum_via_channel(chunks: Vec<Vec<i64>>) -> i64\`

Give each chunk to its own thread. Each thread sums its chunk and sends the partial through an \`mpsc\` channel. The main thread collects every partial and returns the grand total.

The subtlety: the receiver only stops when **all** senders are dropped. Clone the sender per thread and drop the original before draining, or collect exactly \`chunks.len()\` messages.`,
    starter: `use std::sync::mpsc;\nuse std::thread;\n\nfn sum_via_channel(chunks: Vec<Vec<i64>>) -> i64 {\n    todo!()\n}\n`,
    solution: `use std::sync::mpsc;\nuse std::thread;\n\nfn sum_via_channel(chunks: Vec<Vec<i64>>) -> i64 {\n    let (tx, rx) = mpsc::channel();\n\n    for chunk in chunks {\n        let tx = tx.clone();\n        thread::spawn(move || {\n            let partial: i64 = chunk.iter().sum();\n            let _ = tx.send(partial);\n        });\n    }\n    drop(tx);\n\n    rx.iter().sum()\n}\n`,
    hints: [
      'Clone `tx` for each thread so every thread owns a sender.',
      '`drop(tx)` on the original is what lets `rx.iter()` terminate.',
      '`rx.iter()` yields until the channel closes — `.sum()` finishes the job.',
    ],
    cases: [
      { name: 'two chunks', call: 'sum_via_channel(vec![vec![1, 2, 3], vec![4, 5]])', expect: '15' },
      { name: 'single chunk', call: 'sum_via_channel(vec![vec![10]])', expect: '10' },
      { name: 'no chunks', call: 'sum_via_channel(vec![])', expect: '0' },
      { name: 'empty chunks', call: 'sum_via_channel(vec![vec![], vec![7]])', expect: '7' },
      { name: 'ten chunks in parallel', call: 'sum_via_channel((0..10).map(|i| vec![i as i64; 20]).collect())', expect: '900', hidden: true },
      { name: 'negatives', call: 'sum_via_channel(vec![vec![-5, 5], vec![-3]])', expect: '-3', hidden: true },
    ],
    budgetMs: 2000,
    refLines: 14,
    quality: [
      { id: 'mpsc', label: 'Uses an mpsc channel', weight: 40, re: /mpsc::channel/ },
      { id: 'clone-tx', label: 'Clones the sender per thread', weight: 30, re: /tx\.clone\s*\(\s*\)/ },
      { id: 'drop-tx', label: 'Drops the original sender (or bounds the receive count)', weight: 30, re: /drop\s*\(\s*tx\s*\)|\.take\s*\(/ },
    ],
    efficiency: [
      { id: 'no-join-inside', label: 'Threads run concurrently, not joined inside the spawn loop', weight: 100, re: /spawn\s*\([\s\S]{0,200}\)\s*\.join\s*\(/, negative: true },
    ],
  },
];
