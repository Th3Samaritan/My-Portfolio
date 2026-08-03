/* ============================================================
   Python Track — zero to mastery
   ------------------------------------------------------------
   CHALLENGE SCHEMA (shared by every non-web track)

   id         unique slug
   title      display name
   tier       tier id within the track
   difficulty 1..5
   xp         base XP awarded at a perfect score
   concepts   [] concept ids -> feed the mastery radar
   brief      markdown-ish task description
   starter    code prefilled into the editor
   solution   reference implementation (revealed on demand)
   hints      [] progressive hints
   cases      [] { name, call, expect, hidden? }
                 `call` and `expect` are LANGUAGE EXPRESSIONS spliced
                 into the generated harness, compared with ==.
   budgetMs   runtime budget; grading scores efficiency against it
   refLines   reference solution length, used for conciseness scoring
   quality    [] { id, label, weight, re, negative? }  regex over user code
   efficiency [] { id, label, weight, re, negative? }
   ============================================================ */

/**
 * Count real loop headers — `for x in y` in statements and comprehensions.
 * Prose in docstrings ("...strings for 1..n") never matches, which a bare
 * /for/ regex would.
 */
const countLoops = (code) => (String(code).match(/\bfor\s+[\w(),\s]+?\s+in\s/g) || []).length;

export const pythonTiers = [
  { id: 'foundations',  name: 'Foundations',        blurb: 'Control flow, strings, numbers — the muscle memory layer.' },
  { id: 'structures',   name: 'Data Structures',    blurb: 'Dicts, sets, lists and the idioms that make them fast.' },
  { id: 'functional',   name: 'Functions & FP',     blurb: 'Closures, decorators, generators, laziness.' },
  { id: 'oop',          name: 'Object Design',      blurb: 'Dunder methods, properties, protocols, inheritance.' },
  { id: 'algorithms',   name: 'Algorithms',         blurb: 'Search, graphs, DP, two pointers — under a time budget.' },
  { id: 'mastery',      name: 'Mastery',            blurb: 'Async, context managers, and real-world design.' },
];

export const pythonChallenges = [
  /* ---------------------------------------------------------- Foundations */
  {
    id: 'py-f1',
    title: 'FizzBuzz, Properly',
    tier: 'foundations',
    difficulty: 1,
    xp: 40,
    concepts: ['control-flow', 'loops', 'strings'],
    brief: `Return a **list of strings** for \`1..n\`.

- multiples of 3 → \`"Fizz"\`
- multiples of 5 → \`"Buzz"\`
- multiples of both → \`"FizzBuzz"\`
- otherwise → the number as a string

The classic filter. Graded on whether you reach for the concise construction rather than four branches.`,
    starter: `def fizzbuzz(n):\n    """Return a list of FizzBuzz strings for 1..n."""\n    pass\n`,
    solution: `def fizzbuzz(n):\n    """Return a list of FizzBuzz strings for 1..n."""\n    out = []\n    for i in range(1, n + 1):\n        s = ("Fizz" if i % 3 == 0 else "") + ("Buzz" if i % 5 == 0 else "")\n        out.append(s or str(i))\n    return out\n`,
    hints: [
      'Build the word by concatenating two conditional pieces, then fall back to str(i).',
      'An empty string is falsy — `s or str(i)` collapses the fourth branch.',
    ],
    cases: [
      { name: 'n=1',  call: 'fizzbuzz(1)',  expect: `["1"]` },
      { name: 'n=5',  call: 'fizzbuzz(5)',  expect: `["1", "2", "Fizz", "4", "Buzz"]` },
      { name: 'n=15', call: 'fizzbuzz(15)', expect: `["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]` },
      { name: 'n=0 → empty', call: 'fizzbuzz(0)', expect: '[]', hidden: true },
      { name: 'type is list of str', call: 'all(isinstance(x, str) for x in fizzbuzz(20))', expect: 'True', hidden: true },
    ],
    budgetMs: 60,
    refLines: 7,
    quality: [
      { id: 'docstring', label: 'Function documented', weight: 30, re: /def\s+fizzbuzz[^\n]*\n\s+("""|''')/ },
      { id: 'no-print',  label: 'Returns instead of printing', weight: 40, re: /\bprint\s*\(/, negative: true },
      { id: 'named',     label: 'No single-letter accumulators', weight: 30, re: /^\s{4,}[a-z]\s*=\s*\[\]/m, negative: true },
    ],
    efficiency: [
      { id: 'single-pass', label: 'Single pass over the range', weight: 100, fn: (code) => countLoops(code) <= 1 },
    ],
  },

  {
    id: 'py-f2',
    title: 'Number Cruncher',
    tier: 'foundations',
    difficulty: 1,
    xp: 45,
    concepts: ['loops', 'numbers', 'while'],
    brief: `Implement two helpers:

1. \`digit_sum(n)\` — sum the decimal digits of a non-negative int.
2. \`digital_root(n)\` — repeatedly digit-sum until a single digit remains.

\`digital_root(9875)\` → \`9+8+7+5 = 29\` → \`2+9 = 11\` → \`1+1 = 2\`.

Do the digit extraction arithmetically (\`%\` and \`//\`), not by casting to a string.`,
    starter: `def digit_sum(n):\n    """Sum the decimal digits of n."""\n    pass\n\n\ndef digital_root(n):\n    """Repeatedly digit-sum n until one digit remains."""\n    pass\n`,
    solution: `def digit_sum(n):\n    """Sum the decimal digits of n."""\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total\n\n\ndef digital_root(n):\n    """Repeatedly digit-sum n until one digit remains."""\n    while n >= 10:\n        n = digit_sum(n)\n    return n\n`,
    hints: [
      '`n % 10` peels the last digit, `n //= 10` drops it.',
      'digital_root is just a while loop around digit_sum.',
    ],
    cases: [
      { name: 'digit_sum(0)', call: 'digit_sum(0)', expect: '0' },
      { name: 'digit_sum(9875)', call: 'digit_sum(9875)', expect: '29' },
      { name: 'digital_root(9875)', call: 'digital_root(9875)', expect: '2' },
      { name: 'digital_root(7)', call: 'digital_root(7)', expect: '7' },
      { name: 'digital_root(999999999)', call: 'digital_root(999999999)', expect: '9', hidden: true },
    ],
    budgetMs: 60,
    refLines: 12,
    quality: [
      { id: 'docstring', label: 'Both functions documented', weight: 40, re: /("""|''')[\s\S]*("""|''')[\s\S]*("""|''')/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 30, re: /\bprint\s*\(/, negative: true },
      { id: 'reuse',    label: 'digital_root reuses digit_sum', weight: 30, re: /def\s+digital_root[\s\S]*digit_sum\s*\(/ },
    ],
    efficiency: [
      { id: 'no-str-cast', label: 'Arithmetic digit extraction, no str()', weight: 100, re: /str\s*\(\s*n\s*\)/, negative: true },
    ],
  },

  {
    id: 'py-f3',
    title: 'Report Formatter',
    tier: 'foundations',
    difficulty: 2,
    xp: 55,
    concepts: ['strings', 'formatting', 'loops'],
    brief: `Build \`format_table(rows)\` where \`rows\` is a list of \`(name, score)\` tuples.

Return a single string:
- one line per row
- name **left-padded to the width of the longest name**
- score right-aligned in 5 columns, one decimal place
- lines joined by \`"\\n"\`, no trailing newline

\`[("ada", 99.5), ("hopper", 100.0)]\` →
\`"ada     99.5\\nhopper 100.0"\``,
    starter: `def format_table(rows):\n    """Render (name, score) rows as an aligned text table."""\n    pass\n`,
    solution: `def format_table(rows):\n    """Render (name, score) rows as an aligned text table."""\n    if not rows:\n        return ""\n    width = max(len(name) for name, _ in rows)\n    return "\\n".join(\n        f"{name:<{width}} {score:>5.1f}" for name, score in rows\n    )\n`,
    hints: [
      'f-strings support nested width specifiers: f"{name:<{width}}".',
      'Guard the empty-rows case before calling max().',
      '`:>5.1f` right-aligns in 5 columns with one decimal.',
    ],
    cases: [
      { name: 'two rows', call: 'format_table([("ada", 99.5), ("hopper", 100.0)])', expect: `"ada     99.5\\nhopper 100.0"` },
      { name: 'single row', call: 'format_table([("bob", 7.0)])', expect: `"bob   7.0"` },
      { name: 'empty', call: 'format_table([])', expect: '""', hidden: true },
      { name: 'no trailing newline', call: 'format_table([("a", 1.0), ("b", 2.0)]).endswith("\\n")', expect: 'False', hidden: true },
    ],
    budgetMs: 60,
    refLines: 8,
    quality: [
      { id: 'fstring', label: 'Uses f-strings, not % or .format()', weight: 40, re: /f["']/ },
      { id: 'guard',   label: 'Handles the empty input case', weight: 30, re: /if\s+not\s+rows|len\s*\(\s*rows\s*\)\s*==\s*0/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 30, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'join', label: 'Builds output with join(), not += in a loop', weight: 100, re: /\.join\s*\(/ },
    ],
  },

  {
    id: 'py-d1',
    title: 'Top-K Word Frequency',
    tier: 'structures',
    difficulty: 2,
    xp: 65,
    concepts: ['dicts', 'sorting', 'strings'],
    brief: `\`top_words(text, k)\` → list of \`(word, count)\` for the \`k\` most frequent words.

Rules:
- case-insensitive, split on whitespace
- strip surrounding punctuation \`.,!?;:'"\` from each token
- skip empty tokens
- sort by **count descending, then word ascending**
- return at most \`k\` pairs`,
    starter: `def top_words(text, k):\n    """Return the k most frequent words as (word, count) pairs."""\n    pass\n`,
    solution: `from collections import Counter\n\n\ndef top_words(text, k):\n    """Return the k most frequent words as (word, count) pairs."""\n    counts = Counter()\n    for raw in text.lower().split():\n        word = raw.strip(".,!?;:'\\"")\n        if word:\n            counts[word] += 1\n    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))\n    return ranked[:k]\n`,
    hints: [
      '`collections.Counter` gives you counting for free.',
      '`str.strip(chars)` removes any of those characters from both ends.',
      'Sort key `(-count, word)` gives descending count, ascending word.',
    ],
    cases: [
      { name: 'simple', call: `top_words("the cat the dog the bird", 2)`, expect: `[("the", 3), ("bird", 1)]` },
      { name: 'punctuation + case', call: `top_words("Hi, hi! HI? bye.", 2)`, expect: `[("hi", 3), ("bye", 1)]` },
      { name: 'tie broken alphabetically', call: `top_words("b a b a c", 3)`, expect: `[("a", 2), ("b", 2), ("c", 1)]` },
      { name: 'k larger than vocabulary', call: `top_words("solo", 10)`, expect: `[("solo", 1)]`, hidden: true },
      { name: 'empty text', call: `top_words("", 3)`, expect: '[]', hidden: true },
    ],
    budgetMs: 120,
    refLines: 10,
    quality: [
      { id: 'counter', label: 'Uses Counter or defaultdict', weight: 40, re: /Counter|defaultdict/ },
      { id: 'lambda-key', label: 'Sorts with an explicit key function', weight: 30, re: /key\s*=/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 30, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-count-in-loop', label: 'No O(n²) list.count() inside a loop', weight: 100, re: /for[\s\S]{0,200}\.count\s*\(/, negative: true },
    ],
  },

  {
    id: 'py-d2',
    title: 'Group Anagrams',
    tier: 'structures',
    difficulty: 2,
    xp: 70,
    concepts: ['dicts', 'hashing', 'sorting'],
    brief: `\`group_anagrams(words)\` → list of groups, where each group holds words that are anagrams of one another.

- each group sorted alphabetically
- groups sorted by their first element
- an O(n·k log k) solution is expected; grouping by pairwise comparison is not`,
    starter: `def group_anagrams(words):\n    """Group words that are anagrams of each other."""\n    pass\n`,
    solution: `from collections import defaultdict\n\n\ndef group_anagrams(words):\n    """Group words that are anagrams of each other."""\n    buckets = defaultdict(list)\n    for word in words:\n        key = "".join(sorted(word))\n        buckets[key].append(word)\n    groups = [sorted(group) for group in buckets.values()]\n    return sorted(groups)\n`,
    hints: [
      'The sorted letters of a word are a canonical key shared by all its anagrams.',
      '`defaultdict(list)` removes the "is the key there yet" branch.',
    ],
    cases: [
      { name: 'classic', call: `group_anagrams(["eat","tea","tan","ate","nat","bat"])`, expect: `[["ate","eat","tea"], ["bat"], ["nat","tan"]]` },
      { name: 'single word', call: `group_anagrams(["hello"])`, expect: `[["hello"]]` },
      { name: 'empty', call: 'group_anagrams([])', expect: '[]' },
      { name: 'duplicates preserved', call: `group_anagrams(["ab","ba","ab"])`, expect: `[["ab","ab","ba"]]`, hidden: true },
    ],
    budgetMs: 120,
    refLines: 9,
    quality: [
      { id: 'dict-group', label: 'Groups via a dict keyed on a canonical form', weight: 50, re: /defaultdict|setdefault|\bdict\s*\(|\{\s*\}/ },
      { id: 'comprehension', label: 'Uses a comprehension for the final shaping', weight: 25, re: /\[[^\]]*for[^\]]*\]/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 25, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-pairwise', label: 'No nested loop over words × words', weight: 100, fn: (code) => countLoops(code) <= 2 },
    ],
  },

  {
    id: 'py-fn1',
    title: 'Compose & Pipe',
    tier: 'functional',
    difficulty: 2,
    xp: 70,
    concepts: ['closures', 'higher-order', 'functional'],
    brief: `Two higher-order functions over a variable number of callables:

- \`compose(*fns)\` — right-to-left. \`compose(f, g)(x) == f(g(x))\`
- \`pipe(*fns)\` — left-to-right. \`pipe(f, g)(x) == g(f(x))\`

With no arguments, both return the identity function.`,
    starter: `def compose(*fns):\n    """Compose functions right-to-left."""\n    pass\n\n\ndef pipe(*fns):\n    """Compose functions left-to-right."""\n    pass\n`,
    solution: `from functools import reduce\n\n\ndef compose(*fns):\n    """Compose functions right-to-left."""\n    def composed(value):\n        for fn in reversed(fns):\n            value = fn(value)\n        return value\n    return composed\n\n\ndef pipe(*fns):\n    """Compose functions left-to-right."""\n    def piped(value):\n        for fn in fns:\n            value = fn(value)\n        return value\n    return piped\n`,
    hints: [
      'Return a closure that loops over the captured functions.',
      'compose walks `reversed(fns)`; pipe walks them in order.',
      'The no-arg case falls out for free — an empty loop returns the input unchanged.',
    ],
    cases: [
      { name: 'compose order', call: 'compose(lambda x: x + 1, lambda x: x * 2)(5)', expect: '11' },
      { name: 'pipe order', call: 'pipe(lambda x: x + 1, lambda x: x * 2)(5)', expect: '12' },
      { name: 'three functions', call: 'pipe(lambda x: x + 1, lambda x: x * 2, str)(3)', expect: '"8"' },
      { name: 'identity when empty', call: 'compose()(42)', expect: '42', hidden: true },
      { name: 'pipe identity when empty', call: 'pipe()("x")', expect: '"x"', hidden: true },
    ],
    budgetMs: 60,
    refLines: 15,
    quality: [
      { id: 'closure', label: 'Returns a closure (nested def or lambda)', weight: 40, re: /def\s+\w+\([\s\S]{0,400}?\n\s+(def|return\s+lambda)/ },
      { id: 'varargs', label: 'Accepts *fns rather than a list', weight: 30, re: /def\s+compose\s*\(\s*\*/ },
      { id: 'docstring', label: 'Both functions documented', weight: 30, re: /("""|''')[\s\S]*("""|''')[\s\S]*("""|''')/ },
    ],
    efficiency: [
      { id: 'no-rebuild', label: 'Does not rebuild the chain on every call', weight: 100, re: /return\s+lambda[\s\S]{0,60}for\s/, negative: true },
    ],
  },

  {
    id: 'py-fn2',
    title: 'Write Your Own @memoize',
    tier: 'functional',
    difficulty: 3,
    xp: 90,
    concepts: ['decorators', 'closures', 'caching'],
    brief: `Implement a \`memoize\` decorator.

- caches on the positional args
- exposes \`.cache_info()\` returning a \`(hits, misses)\` tuple
- exposes \`.clear_cache()\` which empties the cache and resets counters
- preserves \`__name__\` and \`__doc__\` of the wrapped function

You may not use \`functools.lru_cache\` — but \`functools.wraps\` is encouraged.`,
    starter: `def memoize(fn):\n    """Cache a function's results by its positional arguments."""\n    pass\n`,
    solution: `from functools import wraps\n\n\ndef memoize(fn):\n    """Cache a function's results by its positional arguments."""\n    cache = {}\n    stats = {"hits": 0, "misses": 0}\n\n    @wraps(fn)\n    def wrapper(*args):\n        if args in cache:\n            stats["hits"] += 1\n            return cache[args]\n        stats["misses"] += 1\n        cache[args] = fn(*args)\n        return cache[args]\n\n    def cache_info():\n        return (stats["hits"], stats["misses"])\n\n    def clear_cache():\n        cache.clear()\n        stats["hits"] = stats["misses"] = 0\n\n    wrapper.cache_info = cache_info\n    wrapper.clear_cache = clear_cache\n    return wrapper\n`,
    hints: [
      'The args tuple is already hashable when the arguments are — use it as the dict key directly.',
      'Counters live in the enclosing scope; mutate a dict to avoid `nonlocal` bookkeeping.',
      'Attach cache_info/clear_cache as attributes on the wrapper function object.',
    ],
    cases: [
      { name: 'caches repeats', call: '(lambda f: (f(10), f(10), f.cache_info())[-1])(memoize(lambda n: n * 2))', expect: '(1, 1)' },
      { name: 'distinct args miss', call: '(lambda f: (f(1), f(2), f(3), f.cache_info())[-1])(memoize(lambda n: n))', expect: '(0, 3)' },
      { name: 'clear resets', call: '(lambda f: (f(1), f(1), f.clear_cache(), f.cache_info())[-1])(memoize(lambda n: n))', expect: '(0, 0)' },
      { name: 'returns correct values', call: '(lambda f: [f(3), f(3), f(4)])(memoize(lambda n: n * n))', expect: '[9, 9, 16]', hidden: true },
      { name: 'preserves __name__', call: '(lambda: memoize(lambda n: n).__name__)()', expect: '"<lambda>"', hidden: true },
    ],
    budgetMs: 80,
    refLines: 21,
    quality: [
      { id: 'wraps', label: 'Uses functools.wraps to preserve metadata', weight: 40, re: /@wraps|functools\.wraps/ },
      { id: 'no-lru', label: 'Does not delegate to lru_cache', weight: 30, re: /lru_cache/, negative: true },
      { id: 'docstring', label: 'Decorator documented', weight: 30, re: /def\s+memoize[^\n]*\n\s+("""|''')/ },
    ],
    efficiency: [
      { id: 'dict-lookup', label: 'Cache is a dict lookup, not a list scan', weight: 100, re: /cache\s*=\s*\[\]/, negative: true },
    ],
  },

  {
    id: 'py-fn3',
    title: 'Lazy Windows',
    tier: 'functional',
    difficulty: 3,
    xp: 85,
    concepts: ['generators', 'iterators', 'laziness'],
    brief: `Two **generators** that must not materialise their input:

- \`chunked(iterable, size)\` — yields lists of length \`size\`; the final chunk may be shorter.
- \`sliding(iterable, size)\` — yields tuples of every contiguous window of length \`size\`. Yields nothing if the input is shorter than the window.

Both must work on an infinite iterator when consumed lazily.`,
    starter: `def chunked(iterable, size):\n    """Yield consecutive lists of at most \`size\` items."""\n    pass\n\n\ndef sliding(iterable, size):\n    """Yield every contiguous window of exactly \`size\` items."""\n    pass\n`,
    solution: `from collections import deque\n\n\ndef chunked(iterable, size):\n    """Yield consecutive lists of at most \`size\` items."""\n    batch = []\n    for item in iterable:\n        batch.append(item)\n        if len(batch) == size:\n            yield batch\n            batch = []\n    if batch:\n        yield batch\n\n\ndef sliding(iterable, size):\n    """Yield every contiguous window of exactly \`size\` items."""\n    window = deque(maxlen=size)\n    for item in iterable:\n        window.append(item)\n        if len(window) == size:\n            yield tuple(window)\n`,
    hints: [
      'Accumulate into a buffer and `yield` when it is full — never index the input.',
      '`deque(maxlen=size)` drops the oldest element automatically as you append.',
      'Remember to flush the partial final chunk after the loop.',
    ],
    cases: [
      { name: 'chunked exact', call: 'list(chunked([1,2,3,4], 2))', expect: '[[1, 2], [3, 4]]' },
      { name: 'chunked ragged', call: 'list(chunked([1,2,3,4,5], 2))', expect: '[[1, 2], [3, 4], [5]]' },
      { name: 'sliding windows', call: 'list(sliding([1,2,3,4], 2))', expect: '[(1, 2), (2, 3), (3, 4)]' },
      { name: 'sliding too short', call: 'list(sliding([1], 3))', expect: '[]' },
      { name: 'is lazy on infinite input', call: '[next(sliding(__import__("itertools").count(), 3))]', expect: '[(0, 1, 2)]', hidden: true },
      { name: 'chunked lazy too', call: 'next(chunked(__import__("itertools").count(), 3))', expect: '[0, 1, 2]', hidden: true },
    ],
    budgetMs: 100,
    refLines: 18,
    quality: [
      { id: 'yields', label: 'Both are real generators (use yield)', weight: 50, re: /yield[\s\S]*yield/ },
      { id: 'docstring', label: 'Both documented', weight: 25, re: /("""|''')[\s\S]*("""|''')[\s\S]*("""|''')/ },
      { id: 'deque', label: 'Uses deque for the sliding window', weight: 25, re: /deque/ },
    ],
    efficiency: [
      { id: 'no-list-cast', label: 'Does not call list() on the input', weight: 100, re: /list\s*\(\s*iterable\s*\)/, negative: true },
    ],
  },

  {
    id: 'py-o1',
    title: 'Vector2D with Dunders',
    tier: 'oop',
    difficulty: 3,
    xp: 90,
    concepts: ['oop', 'dunder', 'operators'],
    brief: `A \`Vector2D\` value type supporting:

- \`v + w\`, \`v - w\`, \`v * scalar\` (and \`scalar * v\`)
- \`==\` by value, and usable as a **dict key** (hashable)
- \`abs(v)\` → magnitude
- \`repr(v)\` → \`"Vector2D(3, 4)"\`
- \`len(v)\` → \`2\`, and unpacking via iteration

Immutability is part of the grade — a value type should not be mutated in place.`,
    starter: `class Vector2D:\n    """An immutable 2D vector."""\n\n    def __init__(self, x, y):\n        pass\n`,
    solution: `import math\n\n\nclass Vector2D:\n    """An immutable 2D vector."""\n\n    __slots__ = ("x", "y")\n\n    def __init__(self, x, y):\n        object.__setattr__(self, "x", x)\n        object.__setattr__(self, "y", y)\n\n    def __add__(self, other):\n        return Vector2D(self.x + other.x, self.y + other.y)\n\n    def __sub__(self, other):\n        return Vector2D(self.x - other.x, self.y - other.y)\n\n    def __mul__(self, scalar):\n        return Vector2D(self.x * scalar, self.y * scalar)\n\n    __rmul__ = __mul__\n\n    def __eq__(self, other):\n        return isinstance(other, Vector2D) and (self.x, self.y) == (other.x, other.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\n    def __abs__(self):\n        return math.hypot(self.x, self.y)\n\n    def __len__(self):\n        return 2\n\n    def __iter__(self):\n        yield self.x\n        yield self.y\n\n    def __repr__(self):\n        return f"Vector2D({self.x}, {self.y})"\n`,
    hints: [
      '`__rmul__ = __mul__` handles `3 * v` in one line.',
      'Defining `__eq__` sets `__hash__` to None — you must define `__hash__` explicitly.',
      '`__iter__` yielding x then y makes `x, y = v` work.',
    ],
    cases: [
      { name: 'addition', call: 'repr(Vector2D(1, 2) + Vector2D(3, 4))', expect: '"Vector2D(4, 6)"' },
      { name: 'subtraction', call: 'repr(Vector2D(5, 5) - Vector2D(1, 2))', expect: '"Vector2D(4, 3)"' },
      { name: 'scalar both sides', call: 'repr(3 * Vector2D(1, 2)) == repr(Vector2D(1, 2) * 3)', expect: 'True' },
      { name: 'magnitude', call: 'abs(Vector2D(3, 4))', expect: '5.0' },
      { name: 'equality by value', call: 'Vector2D(1, 2) == Vector2D(1, 2)', expect: 'True' },
      { name: 'hashable', call: 'len({Vector2D(1, 2), Vector2D(1, 2), Vector2D(9, 9)})', expect: '2', hidden: true },
      { name: 'unpacks', call: '(lambda v: [*v])(Vector2D(7, 8))', expect: '[7, 8]', hidden: true },
      { name: 'len is 2', call: 'len(Vector2D(0, 0))', expect: '2', hidden: true },
    ],
    budgetMs: 100,
    refLines: 27,
    quality: [
      { id: 'repr', label: 'Implements __repr__', weight: 25, re: /def\s+__repr__/ },
      { id: 'hash', label: 'Implements __hash__ alongside __eq__', weight: 30, re: /def\s+__hash__/ },
      { id: 'rmul', label: 'Supports reflected multiplication', weight: 25, re: /__rmul__/ },
      { id: 'docstring', label: 'Class documented', weight: 20, re: /class\s+Vector2D[^\n]*\n\s+("""|''')/ },
    ],
    efficiency: [
      { id: 'returns-new', label: 'Operators return new vectors (immutable)', weight: 100, re: /def\s+__add__[\s\S]{0,200}self\.x\s*\+=/, negative: true },
    ],
  },

  {
    id: 'py-o2',
    title: 'Guarded Account',
    tier: 'oop',
    difficulty: 3,
    xp: 85,
    concepts: ['oop', 'properties', 'exceptions'],
    brief: `A \`BankAccount\` that refuses to enter an invalid state.

- \`BankAccount(owner, balance=0)\`; a negative opening balance raises \`ValueError\`
- \`balance\` is a **read-only property** — assigning to it raises \`AttributeError\`
- \`deposit(amount)\` — non-positive amount raises \`ValueError\`
- \`withdraw(amount)\` — overdraft raises \`InsufficientFunds\` (your own subclass of \`ValueError\`)
- \`history\` property → tuple of applied deltas, e.g. \`(100, -30)\``,
    starter: `class InsufficientFunds(ValueError):\n    """Raised when a withdrawal exceeds the available balance."""\n\n\nclass BankAccount:\n    """An account that validates every state transition."""\n\n    def __init__(self, owner, balance=0):\n        pass\n`,
    solution: `class InsufficientFunds(ValueError):\n    """Raised when a withdrawal exceeds the available balance."""\n\n\nclass BankAccount:\n    """An account that validates every state transition."""\n\n    def __init__(self, owner, balance=0):\n        if balance < 0:\n            raise ValueError("opening balance cannot be negative")\n        self.owner = owner\n        self._balance = balance\n        self._history = []\n\n    @property\n    def balance(self):\n        return self._balance\n\n    @property\n    def history(self):\n        return tuple(self._history)\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("deposit must be positive")\n        self._balance += amount\n        self._history.append(amount)\n        return self._balance\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("withdrawal must be positive")\n        if amount > self._balance:\n            raise InsufficientFunds("balance too low")\n        self._balance -= amount\n        self._history.append(-amount)\n        return self._balance\n`,
    hints: [
      'A `@property` with no setter is read-only — assignment raises AttributeError automatically.',
      'Store the real number in `self._balance` and expose it through the property.',
      'Return `tuple(self._history)` so callers cannot mutate your internals.',
    ],
    cases: [
      { name: 'deposit updates balance', call: '(lambda a: (a.deposit(100), a.balance)[-1])(BankAccount("ada"))', expect: '100' },
      { name: 'withdraw updates balance', call: '(lambda a: (a.deposit(100), a.withdraw(30), a.balance)[-1])(BankAccount("ada"))', expect: '70' },
      { name: 'history recorded', call: '(lambda a: (a.deposit(100), a.withdraw(30), a.history)[-1])(BankAccount("ada"))', expect: '(100, -30)' },
      { name: 'overdraft raises InsufficientFunds', call: '__raises(lambda: BankAccount("ada").withdraw(1), InsufficientFunds)', expect: 'True' },
      { name: 'negative opening raises ValueError', call: '__raises(lambda: BankAccount("ada", -5), ValueError)', expect: 'True' },
      { name: 'balance is read-only', call: '__raises(lambda: setattr(BankAccount("ada"), "balance", 999), AttributeError)', expect: 'True', hidden: true },
      { name: 'zero deposit rejected', call: '__raises(lambda: BankAccount("ada").deposit(0), ValueError)', expect: 'True', hidden: true },
      { name: 'InsufficientFunds is a ValueError', call: 'issubclass(InsufficientFunds, ValueError)', expect: 'True', hidden: true },
    ],
    budgetMs: 100,
    refLines: 30,
    quality: [
      { id: 'property', label: 'Uses @property rather than get_balance()', weight: 35, re: /@property/ },
      { id: 'custom-exc', label: 'Defines a domain-specific exception', weight: 30, re: /class\s+InsufficientFunds\s*\(\s*ValueError\s*\)/ },
      { id: 'messages', label: 'Raised errors carry a message', weight: 20, re: /raise\s+\w+\s*\(\s*["']/ },
      { id: 'docstring', label: 'Class documented', weight: 15, re: /class\s+BankAccount[^\n]*\n\s+("""|''')/ },
    ],
    efficiency: [
      { id: 'defensive-copy', label: 'history returns a copy, not the live list', weight: 100, re: /return\s+tuple\s*\(|return\s+list\s*\(|\[\s*:\s*\]/ },
    ],
  },

  {
    id: 'py-a1',
    title: 'Bounded Binary Search',
    tier: 'algorithms',
    difficulty: 3,
    xp: 95,
    concepts: ['binary-search', 'algorithms', 'edge-cases'],
    brief: `On a **sorted** list that may contain duplicates:

- \`first_index(arr, target)\` → lowest index of \`target\`, else \`-1\`
- \`last_index(arr, target)\` → highest index of \`target\`, else \`-1\`

Both must be O(log n). A linear scan will pass the correctness tests and fail the efficiency rubric.`,
    starter: `def first_index(arr, target):\n    """Lowest index of target in sorted arr, or -1."""\n    pass\n\n\ndef last_index(arr, target):\n    """Highest index of target in sorted arr, or -1."""\n    pass\n`,
    solution: `def first_index(arr, target):\n    """Lowest index of target in sorted arr, or -1."""\n    lo, hi, found = 0, len(arr) - 1, -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            found = mid\n            hi = mid - 1\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return found\n\n\ndef last_index(arr, target):\n    """Highest index of target in sorted arr, or -1."""\n    lo, hi, found = 0, len(arr) - 1, -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            found = mid\n            lo = mid + 1\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return found\n`,
    hints: [
      'On a match, record the index but keep searching the half that could hold a better one.',
      'first_index shrinks `hi` after a match; last_index grows `lo`.',
      'Check the empty-list and not-found paths — both should return -1.',
    ],
    cases: [
      { name: 'first of duplicates', call: 'first_index([1,2,2,2,3], 2)', expect: '1' },
      { name: 'last of duplicates', call: 'last_index([1,2,2,2,3], 2)', expect: '3' },
      { name: 'absent', call: 'first_index([1,3,5], 4)', expect: '-1' },
      { name: 'empty list', call: 'last_index([], 1)', expect: '-1' },
      { name: 'single element hit', call: 'first_index([7], 7)', expect: '0', hidden: true },
      { name: 'all identical', call: 'last_index([5,5,5,5], 5)', expect: '3', hidden: true },
      { name: 'boundary low', call: 'first_index([2,4,6], 2)', expect: '0', hidden: true },
      { name: 'boundary high', call: 'last_index([2,4,6], 6)', expect: '2', hidden: true },
    ],
    budgetMs: 80,
    refLines: 26,
    quality: [
      { id: 'docstring', label: 'Both documented', weight: 30, re: /("""|''')[\s\S]*("""|''')[\s\S]*("""|''')/ },
      { id: 'midpoint', label: 'Computes a midpoint (real binary search)', weight: 40, re: /\/\/\s*2|>>\s*1/ },
      { id: 'no-print', label: 'No debug prints', weight: 30, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-index', label: 'No list.index() / in / count() shortcut', weight: 60, re: /arr\.index\s*\(|arr\.count\s*\(|target\s+in\s+arr/, negative: true },
      { id: 'while-halving', label: 'Uses a halving while-loop, not a full scan', weight: 40, re: /while\s+lo\s*<=?\s*hi|while\s+\w+\s*<=?\s*\w+/ },
    ],
  },

  {
    id: 'py-a4',
    title: 'Longest Unique Run',
    tier: 'algorithms',
    difficulty: 3,
    xp: 100,
    concepts: ['two-pointers', 'sliding-window', 'strings'],
    brief: `\`longest_unique(s)\` → length of the longest substring with no repeated character.

\`"abcabcbb"\` → \`3\` (\`"abc"\`). \`"bbbbb"\` → \`1\`. \`""\` → \`0\`.

Sliding window with a last-seen map. O(n) — one pass, no nested scan.`,
    starter: `def longest_unique(s):\n    """Length of the longest substring without repeating characters."""\n    pass\n`,
    solution: `def longest_unique(s):\n    """Length of the longest substring without repeating characters."""\n    last_seen = {}\n    best = 0\n    start = 0\n    for index, char in enumerate(s):\n        if char in last_seen and last_seen[char] >= start:\n            start = last_seen[char] + 1\n        last_seen[char] = index\n        best = max(best, index - start + 1)\n    return best\n`,
    hints: [
      'Keep `start` as the left edge of the current window.',
      'On a repeat inside the window, jump `start` past the previous occurrence — never step it one at a time.',
      'The `last_seen[char] >= start` guard is what stops stale positions from shrinking the window.',
    ],
    cases: [
      { name: 'abcabcbb', call: 'longest_unique("abcabcbb")', expect: '3' },
      { name: 'all same', call: 'longest_unique("bbbbb")', expect: '1' },
      { name: 'pwwkew', call: 'longest_unique("pwwkew")', expect: '3' },
      { name: 'empty', call: 'longest_unique("")', expect: '0' },
      { name: 'all unique', call: 'longest_unique("abcdef")', expect: '6', hidden: true },
      { name: 'stale index guard', call: 'longest_unique("abba")', expect: '2', hidden: true },
      { name: 'long input stays fast', call: 'longest_unique("abcdefghij" * 400)', expect: '10', hidden: true },
    ],
    budgetMs: 300,
    refLines: 11,
    quality: [
      { id: 'docstring', label: 'Function documented', weight: 35, re: /def\s+longest_unique[^\n]*\n\s+("""|''')/ },
      { id: 'enumerate', label: 'Uses enumerate rather than range(len(s))', weight: 35, re: /enumerate\s*\(/ },
      { id: 'no-print', label: 'No debug prints', weight: 30, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-nested', label: 'Single pass — no nested loop over the string', weight: 60, fn: (code) => countLoops(code) <= 1 },
      { id: 'no-slicing', label: 'No repeated substring slicing', weight: 40, re: /s\s*\[\s*\w+\s*:\s*\w+\s*\]/, negative: true },
    ],
  },

  {
    id: 'py-d3',
    title: 'LRU Cache',
    tier: 'structures',
    difficulty: 4,
    xp: 110,
    concepts: ['dicts', 'ordering', 'oop', 'caching'],
    brief: `Build an \`LRUCache\` class with O(1) \`get\` and \`put\`.

- \`LRUCache(capacity)\`
- \`get(key)\` → value, or \`-1\` if absent. **A hit counts as a use.**
- \`put(key, value)\` → insert/update; evict the least-recently-used entry when over capacity.

\`collections.OrderedDict\` gives you the ordering primitive; \`move_to_end\` and \`popitem(last=False)\` are the two moves you need.`,
    starter: `class LRUCache:\n    """Fixed-capacity cache that evicts the least recently used entry."""\n\n    def __init__(self, capacity):\n        pass\n\n    def get(self, key):\n        pass\n\n    def put(self, key, value):\n        pass\n`,
    solution: `from collections import OrderedDict\n\n\nclass LRUCache:\n    """Fixed-capacity cache that evicts the least recently used entry."""\n\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self._items = OrderedDict()\n\n    def get(self, key):\n        if key not in self._items:\n            return -1\n        self._items.move_to_end(key)\n        return self._items[key]\n\n    def put(self, key, value):\n        if key in self._items:\n            self._items.move_to_end(key)\n        self._items[key] = value\n        if len(self._items) > self.capacity:\n            self._items.popitem(last=False)\n`,
    hints: [
      'OrderedDict keeps insertion order and lets you cheaply move a key to the end.',
      'Treat "end" as most-recently-used; evict from the front with popitem(last=False).',
      'A successful get() must also refresh recency — that is the case most people miss.',
    ],
    cases: [
      { name: 'basic get/put', call: '(lambda c: (c.put(1, 1), c.put(2, 2), c.get(1))[-1])(LRUCache(2))', expect: '1' },
      { name: 'evicts LRU', call: '(lambda c: (c.put(1,1), c.put(2,2), c.put(3,3), c.get(1))[-1])(LRUCache(2))', expect: '-1' },
      { name: 'get refreshes recency', call: '(lambda c: (c.put(1,1), c.put(2,2), c.get(1), c.put(3,3), c.get(2))[-1])(LRUCache(2))', expect: '-1' },
      { name: 'survivor after refresh', call: '(lambda c: (c.put(1,1), c.put(2,2), c.get(1), c.put(3,3), c.get(1))[-1])(LRUCache(2))', expect: '1', hidden: true },
      { name: 'update does not grow', call: '(lambda c: (c.put(1,1), c.put(1,9), c.put(2,2), c.get(1))[-1])(LRUCache(2))', expect: '9', hidden: true },
    ],
    budgetMs: 150,
    refLines: 17,
    quality: [
      { id: 'docstring', label: 'Class documented', weight: 25, re: /class\s+LRUCache[^\n]*\n\s+("""|''')/ },
      { id: 'private',   label: 'Internal storage marked private (_name)', weight: 25, re: /self\._\w+/ },
      { id: 'no-print',  label: 'No debug prints left behind', weight: 25, re: /\bprint\s*\(/, negative: true },
      { id: 'capacity',  label: 'Capacity stored and enforced', weight: 25, re: /self\.\w*capacity/ },
    ],
    efficiency: [
      { id: 'ordered', label: 'O(1) recency via OrderedDict / dict ordering', weight: 60, re: /OrderedDict|move_to_end|popitem/ },
      { id: 'no-scan', label: 'No linear scan to find the LRU entry', weight: 40, re: /min\s*\([\s\S]{0,80}key\s*=/, negative: true },
    ],
  },

  {
    id: 'py-a2',
    title: 'Shortest Path (BFS)',
    tier: 'algorithms',
    difficulty: 4,
    xp: 110,
    concepts: ['graphs', 'bfs', 'queues'],
    brief: `\`shortest_path(graph, start, goal)\` on an unweighted graph given as \`{node: [neighbours]}\`.

- return the node list from \`start\` to \`goal\` inclusive
- return \`[]\` when no path exists
- \`start == goal\` → \`[start]\`
- when several shortest paths exist, prefer the one that visits neighbours **in adjacency-list order**

BFS with a \`deque\` and a parent map. DFS will produce wrong-length paths.`,
    starter: `def shortest_path(graph, start, goal):\n    """Return the shortest node path from start to goal, or []."""\n    pass\n`,
    solution: `from collections import deque\n\n\ndef shortest_path(graph, start, goal):\n    """Return the shortest node path from start to goal, or []."""\n    if start not in graph or goal not in graph:\n        return []\n    if start == goal:\n        return [start]\n\n    parents = {start: None}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbour in graph.get(node, ()):\n            if neighbour in parents:\n                continue\n            parents[neighbour] = node\n            if neighbour == goal:\n                path = [goal]\n                while parents[path[-1]] is not None:\n                    path.append(parents[path[-1]])\n                return path[::-1]\n            queue.append(neighbour)\n    return []\n`,
    hints: [
      'Record a parent for every node the first time you reach it — that also serves as "visited".',
      'Use `deque.popleft()`; a list `pop(0)` is O(n) and will cost you efficiency points.',
      'Rebuild the path by walking parents backwards from the goal, then reverse.',
    ],
    cases: [
      { name: 'simple chain', call: 'shortest_path({"a":["b"],"b":["c"],"c":[]}, "a", "c")', expect: '["a", "b", "c"]' },
      { name: 'picks shorter branch', call: 'shortest_path({"a":["b","d"],"b":["c"],"c":["e"],"d":["e"],"e":[]}, "a", "e")', expect: '["a", "d", "e"]' },
      { name: 'no path', call: 'shortest_path({"a":["b"],"b":[],"z":[]}, "a", "z")', expect: '[]' },
      { name: 'start is goal', call: 'shortest_path({"a":[]}, "a", "a")', expect: '["a"]' },
      { name: 'handles cycles', call: 'shortest_path({"a":["b"],"b":["a","c"],"c":[]}, "a", "c")', expect: '["a", "b", "c"]', hidden: true },
      { name: 'unknown node', call: 'shortest_path({"a":[]}, "a", "q")', expect: '[]', hidden: true },
    ],
    budgetMs: 150,
    refLines: 22,
    quality: [
      { id: 'deque', label: 'Uses collections.deque as the queue', weight: 40, re: /deque/ },
      { id: 'docstring', label: 'Function documented', weight: 30, re: /def\s+shortest_path[^\n]*\n\s+("""|''')/ },
      { id: 'no-print', label: 'No debug prints', weight: 30, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'no-pop-zero', label: 'No O(n) list.pop(0)', weight: 50, re: /\.pop\s*\(\s*0\s*\)/, negative: true },
      { id: 'visited', label: 'Tracks visited nodes to avoid re-expansion', weight: 50, re: /visited|parents|seen/ },
    ],
  },

  {
    id: 'py-a3',
    title: 'Coin Change (DP)',
    tier: 'algorithms',
    difficulty: 4,
    xp: 115,
    concepts: ['dynamic-programming', 'algorithms', 'optimisation'],
    brief: `\`min_coins(coins, amount)\` → the fewest coins summing to \`amount\`, or \`-1\` if impossible.

- \`amount == 0\` → \`0\`
- coins may be used unlimited times
- must run in O(amount × len(coins)); the naive recursion will time out on the hidden test`,
    starter: `def min_coins(coins, amount):\n    """Fewest coins that sum to amount, or -1 if impossible."""\n    pass\n`,
    solution: `def min_coins(coins, amount):\n    """Fewest coins that sum to amount, or -1 if impossible."""\n    unreachable = amount + 1\n    best = [0] + [unreachable] * amount\n    for value in range(1, amount + 1):\n        for coin in coins:\n            if coin <= value and best[value - coin] + 1 < best[value]:\n                best[value] = best[value - coin] + 1\n    return best[amount] if best[amount] <= amount else -1\n`,
    hints: [
      'Bottom-up: `best[v]` = fewest coins for value v, built from 0 upward.',
      'Seed the table with a sentinel larger than any real answer (amount + 1).',
      'A memoised recursion also works — but watch Python\'s recursion limit on large amounts.',
    ],
    cases: [
      { name: 'classic', call: 'min_coins([1, 5, 10, 25], 30)', expect: '2' },
      { name: 'needs the awkward coin', call: 'min_coins([1, 3, 4], 6)', expect: '2' },
      { name: 'impossible', call: 'min_coins([5], 3)', expect: '-1' },
      { name: 'zero amount', call: 'min_coins([1], 0)', expect: '0' },
      { name: 'no coins', call: 'min_coins([], 5)', expect: '-1', hidden: true },
      { name: 'large amount stays fast', call: 'min_coins([1, 7, 12, 31], 987)', expect: '34', hidden: true },
    ],
    budgetMs: 400,
    refLines: 9,
    quality: [
      { id: 'docstring', label: 'Function documented', weight: 35, re: /def\s+min_coins[^\n]*\n\s+("""|''')/ },
      { id: 'named-sentinel', label: 'Sentinel value is named, not magic', weight: 30, re: /=\s*(amount\s*\+\s*1|float\s*\(\s*["']inf)/ },
      { id: 'no-print', label: 'No debug prints', weight: 35, re: /\bprint\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'tabulated', label: 'Bottom-up table or memoised recursion', weight: 60, re: /\[\s*0\s*\]\s*\+|lru_cache|memo|cache/ },
      { id: 'no-naive-rec', label: 'No unmemoised exponential recursion', weight: 40, re: /def\s+min_coins[\s\S]{0,300}min_coins\s*\([\s\S]{0,200}min_coins\s*\(/, negative: true },
    ],
  },

  {
    id: 'py-m2',
    title: 'Retry Context Manager',
    tier: 'mastery',
    difficulty: 4,
    xp: 125,
    concepts: ['context-managers', 'exceptions', 'decorators'],
    brief: `\`retry(times, exceptions=(Exception,))\` — a **decorator** that retries a failing call.

- calls the function up to \`times\` total attempts
- only retries the listed exception types; anything else propagates immediately
- re-raises the last exception when all attempts fail
- exposes \`.attempts\` on the wrapper: how many calls the last invocation took

Also provide \`suppress_and_log(bucket)\` — a **context manager** that swallows any exception raised inside its block and appends \`type(exc).__name__\` to \`bucket\`.`,
    starter: `from functools import wraps\nfrom contextlib import contextmanager\n\n\ndef retry(times, exceptions=(Exception,)):\n    """Decorator that retries a call on the given exception types."""\n    pass\n\n\n@contextmanager\ndef suppress_and_log(bucket):\n    """Swallow any exception and record its class name in bucket."""\n    pass\n`,
    solution: `from functools import wraps\nfrom contextlib import contextmanager\n\n\ndef retry(times, exceptions=(Exception,)):\n    """Decorator that retries a call on the given exception types."""\n    def decorator(fn):\n        @wraps(fn)\n        def wrapper(*args, **kwargs):\n            last = None\n            for attempt in range(1, times + 1):\n                wrapper.attempts = attempt\n                try:\n                    return fn(*args, **kwargs)\n                except exceptions as exc:\n                    last = exc\n            raise last\n        wrapper.attempts = 0\n        return wrapper\n    return decorator\n\n\n@contextmanager\ndef suppress_and_log(bucket):\n    """Swallow any exception and record its class name in bucket."""\n    try:\n        yield bucket\n    except Exception as exc:\n        bucket.append(type(exc).__name__)\n`,
    hints: [
      'retry takes arguments, so it is a decorator *factory*: three nested functions deep.',
      'Catching `exceptions` (a tuple) means unlisted types propagate naturally — no re-raise logic needed.',
      '@contextmanager: everything before `yield` is __enter__, the except block is __exit__ swallowing the error.',
    ],
    cases: [
      { name: 'succeeds first try', call: '__retry_case(0, 3)', expect: '(True, 1)' },
      { name: 'succeeds on third', call: '__retry_case(2, 3)', expect: '(True, 3)' },
      { name: 'exhausts and raises', call: '__retry_case(5, 3)', expect: '(False, 3)' },
      { name: 'context manager swallows', call: '__ctx_case()', expect: '["ValueError"]' },
      { name: 'unlisted exception propagates', call: '__retry_unlisted()', expect: 'True', hidden: true },
      { name: 'no exception logs nothing', call: '__ctx_clean()', expect: '[]', hidden: true },
    ],
    budgetMs: 200,
    refLines: 25,
    quality: [
      { id: 'wraps', label: 'Preserves metadata with functools.wraps', weight: 30, re: /@wraps|functools\.wraps/ },
      { id: 'ctxmanager', label: 'Uses @contextmanager or __enter__/__exit__', weight: 30, re: /@contextmanager|def\s+__enter__/ },
      { id: 'tuple-catch', label: 'Catches the configured exception tuple', weight: 25, re: /except\s+exceptions/ },
      { id: 'docstring', label: 'Both documented', weight: 15, re: /("""|''')[\s\S]*("""|''')[\s\S]*("""|''')/ },
    ],
    efficiency: [
      { id: 'no-bare-except', label: 'No bare `except:` swallowing everything blindly', weight: 100, re: /except\s*:/, negative: true },
    ],
    preamble: `def __retry_case(fail_times, allowed):\n    state = {"n": 0}\n\n    @retry(allowed, (RuntimeError,))\n    def flaky():\n        state["n"] += 1\n        if state["n"] <= fail_times:\n            raise RuntimeError("boom")\n        return "ok"\n\n    try:\n        flaky()\n        return (True, flaky.attempts)\n    except RuntimeError:\n        return (False, flaky.attempts)\n\n\ndef __retry_unlisted():\n    @retry(3, (KeyError,))\n    def bad():\n        raise TypeError("nope")\n    try:\n        bad()\n        return False\n    except TypeError:\n        return True\n\n\ndef __ctx_case():\n    log = []\n    with suppress_and_log(log):\n        raise ValueError("x")\n    return log\n\n\ndef __ctx_clean():\n    log = []\n    with suppress_and_log(log):\n        pass\n    return log\n`,
  },

  {
    id: 'py-m1',
    title: 'Bounded Concurrency',
    tier: 'mastery',
    difficulty: 5,
    xp: 140,
    concepts: ['async', 'concurrency', 'asyncio'],
    brief: `\`gather_limited(coro_factories, limit)\` — an async function that runs at most \`limit\` coroutines at once.

- \`coro_factories\` is a list of **zero-arg callables**, each returning a fresh coroutine
- results come back **in input order**, regardless of completion order
- concurrency must never exceed \`limit\`

Use \`asyncio.Semaphore\` plus \`asyncio.gather\`. The hidden test instruments the live-task count and will fail an unbounded \`gather\`.`,
    starter: `import asyncio\n\n\nasync def gather_limited(coro_factories, limit):\n    """Run coroutine factories with at most \`limit\` running concurrently."""\n    pass\n`,
    solution: `import asyncio\n\n\nasync def gather_limited(coro_factories, limit):\n    """Run coroutine factories with at most \`limit\` running concurrently."""\n    semaphore = asyncio.Semaphore(limit)\n\n    async def run(factory):\n        async with semaphore:\n            return await factory()\n\n    return await asyncio.gather(*(run(f) for f in coro_factories))\n`,
    hints: [
      'Wrap each factory call in `async with semaphore:` so the permit is held only while it runs.',
      '`asyncio.gather` already preserves input order — do not sort results yourself.',
      'Call each factory *inside* the semaphore, not when building the list.',
    ],
    cases: [
      { name: 'preserves order', call: '__run_async(gather_limited([__mk(3, 0.02), __mk(1, 0.001), __mk(2, 0.01)], 3))', expect: '[3, 1, 2]' },
      { name: 'runs everything', call: '__run_async(gather_limited([__mk(i, 0.001) for i in range(8)], 2))', expect: '[0, 1, 2, 3, 4, 5, 6, 7]' },
      { name: 'empty input', call: '__run_async(gather_limited([], 4))', expect: '[]' },
      { name: 'respects the limit', call: '__peak_concurrency(gather_limited, 10, 3)', expect: '3', hidden: true },
      { name: 'limit of 1 is serial', call: '__peak_concurrency(gather_limited, 5, 1)', expect: '1', hidden: true },
    ],
    budgetMs: 2000,
    refLines: 8,
    // Pyodide runs inside the browser's own event loop, so asyncio.run() is
    // unavailable. This one always goes to the remote interpreter.
    remoteOnly: true,
    quality: [
      { id: 'semaphore', label: 'Uses asyncio.Semaphore', weight: 45, re: /Semaphore/ },
      { id: 'async-with', label: 'Acquires the permit with `async with`', weight: 30, re: /async\s+with/ },
      { id: 'docstring', label: 'Function documented', weight: 25, re: /async\s+def\s+gather_limited[^\n]*\n\s+("""|''')/ },
    ],
    efficiency: [
      { id: 'concurrent', label: 'Actually concurrent — not a sequential await loop', weight: 100, re: /gather|as_completed|create_task|TaskGroup/ },
    ],
    // Extra fixtures injected into the harness before the user's code.
    preamble: `import asyncio\n\ndef __run_async(coro):\n    return asyncio.run(coro)\n\ndef __mk(value, delay):\n    async def _factory():\n        await asyncio.sleep(delay)\n        return value\n    return _factory\n\ndef __peak_concurrency(fn, count, limit):\n    state = {"live": 0, "peak": 0}\n    def make():\n        async def _f():\n            state["live"] += 1\n            state["peak"] = max(state["peak"], state["live"])\n            await asyncio.sleep(0.005)\n            state["live"] -= 1\n            return None\n        return _f\n    asyncio.run(fn([make() for _ in range(count)], limit))\n    return state["peak"]\n`,
  },
];
