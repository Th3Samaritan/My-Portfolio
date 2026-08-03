// add-exercises.mjs — Adds supplementary exercises to all lessons
// Run: node tools/add-exercises.mjs

import { TRACKS } from '../data/curriculum.js';
import fs from 'fs';
import path from 'path';

// ==================================================================
// EXERCISE TEMPLATES: keyed by [trackId][topicId]
// Each template is a function returning a complete try/tryweb block.
// ==================================================================

const TEMPLATES = {};

// ---- PYTHON ----

TEMPLATES.python = {
  'getting-started': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`shout(text)\` that returns the text in uppercase followed by three exclamation marks.\n\n\`shout("hello")\` → \`"HELLO!!!"\`\n\nUse \`.upper()\` and string concatenation or an f-string.`,
      starter: `def shout(text):\n    pass\n`,
      solution: `def shout(text):\n    return text.upper() + "!!!"\n`,
      hints: ['Call text.upper() to capitalise.', 'Add "!!!" with + or an f-string.', 'Return the result directly.'],
      cases: [
        { name: 'hello', call: 'shout("hello")', expect: '"HELLO!!!"' },
        { name: 'already uppercase', call: 'shout("WOW")', expect: '"WOW!!!"' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`repeat(text, n)\` returning \`text\` repeated \`n\` times with a space between each repetition.\n\n\`repeat("hi", 3)\` → \`"hi hi hi"\`\n\nUse multiplication on the string with a space and then \`.strip()\` the trailing space. Or use \`.join()\`.`,
      starter: `def repeat(text, n):\n    pass\n`,
      solution: `def repeat(text, n):\n    return ((text + " ") * n).strip()\n`,
      hints: ['(text + " ") * n creates n copies with trailing spaces.', '.strip() removes the final trailing space.', 'Alternatively: " ".join([text] * n).'],
      cases: [
        { name: 'repeat 3', call: 'repeat("hi", 3)', expect: '"hi hi hi"' },
        { name: 'repeat 0', call: 'repeat("x", 0)', expect: '""' },
      ],
    }),
  ],

  'variables-and-types': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`describe_value(value)\` that returns \`"<value> is a <type>"\` — using \`type()\` and an f-string.\n\n\`describe_value(42)\` → \`"42 is a <class 'int'>"\``,
      starter: `def describe_value(value):\n    pass\n`,
      solution: `def describe_value(value):\n    return f"{value} is a {type(value)}"\n`,
      hints: ['type(value) gives the type object.', 'Use an f-string: f"{value} is a {type(value)}".', 'No conversion needed — f-strings handle it.'],
      cases: [
        { name: 'int', call: 'describe_value(42)', expect: '"42 is a <class \'int\'>"' },
        { name: 'str', call: 'describe_value("hello")', expect: '"hello is a <class \'str\'>"' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`swap(a, b)\` that returns a tuple with the two values swapped.\n\n\`swap(1, "a")\` → \`("a", 1)\`\n\nPython makes this one line — (b, a) is a tuple.`,
      starter: `def swap(a, b):\n    pass\n`,
      solution: `def swap(a, b):\n    return (b, a)\n`,
      hints: ['Return a tuple: (b, a).', 'That is genuinely all — no temp variable needed.', 'Works with any types.'],
      cases: [
        { name: 'numbers', call: 'swap(1, 2)', expect: '(2, 1)' },
        { name: 'mixed types', call: 'swap("x", 5)', expect: '(5, "x")' },
      ],
    }),
  ],

  'control-flow': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`can_vote(age)\` returning \`True\` if age is 18 or over, \`False\` otherwise. Use a single return with a comparison — no if statement needed.\n\n\`can_vote(20)\` → \`True\``,
      starter: `def can_vote(age):\n    pass\n`,
      solution: `def can_vote(age):\n    return age >= 18\n`,
      hints: ['The comparison age >= 18 already evaluates to True/False.', 'Return the comparison directly.', 'No if statement required.'],
      cases: [
        { name: 'adult', call: 'can_vote(20)', expect: 'True' },
        { name: 'minor', call: 'can_vote(16)', expect: 'False' },
        { name: 'exactly 18', call: 'can_vote(18)', expect: 'True' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`categorise(score)\` returning \`"pass"\` if score >= 50, else \`"fail"\`. Use a **conditional expression** (ternary): \`"pass" if condition else "fail"\`.\n\nDo NOT use a full if/else block.`,
      starter: `def categorise(score):\n    pass\n`,
      solution: `def categorise(score):\n    return "pass" if score >= 50 else "fail"\n`,
      hints: ['The syntax: value_if_true if condition else value_if_false.', 'Return the expression directly.', 'No colon, no indented block.'],
      cases: [
        { name: 'pass', call: 'categorise(75)', expect: '"pass"' },
        { name: 'fail', call: 'categorise(30)', expect: '"fail"' },
        { name: 'boundary', call: 'categorise(50)', expect: '"pass"' },
      ],
    }),
  ],

  'data-structures': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`middle_element(items)\` returning the middle element of a non-empty list. If the list has even length, return the element just left of centre.\n\n\`middle_element([1,2,3,4,5])\` → \`3\`\n\`middle_element([1,2,3,4])\` → \`2\`\n\nUse integer division \`//\` to find the index.`,
      starter: `def middle_element(items):\n    pass\n`,
      solution: `def middle_element(items):\n    return items[(len(items) - 1) // 2]\n`,
      hints: ['The middle index is (len(items) - 1) // 2.', 'Integer division // gives a whole number.', 'Index into items with square brackets.'],
      cases: [
        { name: 'odd length', call: 'middle_element([1, 2, 3, 4, 5])', expect: '3' },
        { name: 'even length', call: 'middle_element([1, 2, 3, 4])', expect: '2' },
        { name: 'single element', call: 'middle_element([99])', expect: '99' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`invert_dict(d)\` that swaps keys and values. Assume values are unique.\n\n\`invert_dict({"a": 1, "b": 2})\` → \`{1: "a", 2: "b"}\`\n\nUse a dictionary comprehension or a loop.`,
      starter: `def invert_dict(d):\n    pass\n`,
      solution: `def invert_dict(d):\n    return {value: key for key, value in d.items()}\n`,
      hints: ['Iterate with d.items() to get (key, value) pairs.', 'Build a dict comprehension: {value: key for key, value in d.items()}.', 'Return the comprehension directly.'],
      cases: [
        { name: 'two pairs', call: 'invert_dict({"a": 1, "b": 2})', expect: '{1: "a", 2: "b"}' },
        { name: 'empty', call: 'invert_dict({})', expect: '{}' },
      ],
    }),
  ],

  'functions': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`is_even(n)\` returning \`True\` if n is even. Include a docstring with at least one doctest-style example.\n\nTwo approaches: \`n % 2 == 0\` or \`n & 1 == 0\` (bitwise). Either passes.`,
      starter: `def is_even(n):\n    """Return True if n is even.\n\n    >>> is_even(4)\n    True\n    """\n    pass\n`,
      solution: `def is_even(n):\n    """Return True if n is even.\n\n    >>> is_even(4)\n    True\n    """\n    return n % 2 == 0\n`,
      hints: ['n % 2 == 0 checks divisibility by 2.', 'Keep the docstring — the starter includes it.', 'Return the comparison directly.'],
      cases: [
        { name: 'even', call: 'is_even(4)', expect: 'True' },
        { name: 'odd', call: 'is_even(7)', expect: 'False' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`apply_twice(fn, value)\` that calls \`fn\` on \`value\` twice and returns the result.\n\n\`apply_twice(lambda x: x * 2, 5)\` → 5 * 2 * 2 = \`20\`\n\nThis is a higher-order function — it takes a function as an argument.`,
      starter: `def apply_twice(fn, value):\n    pass\n`,
      solution: `def apply_twice(fn, value):\n    return fn(fn(value))\n`,
      hints: ['Call fn(value) first, then fn on the result.', 'One line: return fn(fn(value)).', 'fn can be any callable — the function does not care.'],
      cases: [
        { name: 'double twice', call: 'apply_twice(lambda x: x * 2, 5)', expect: '20' },
        { name: 'add one twice', call: 'apply_twice(lambda x: x + 1, 0)', expect: '2' },
      ],
    }),
  ],

  'error-handling': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`get_first(items)\` returning the first element of a list, or \`None\` if the list is empty. Do NOT use try/except — check the length or truthiness of the list directly.\n\nThis teaches that some errors are better prevented than caught.`,
      starter: `def get_first(items):\n    pass\n`,
      solution: `def get_first(items):\n    if not items:\n        return None\n    return items[0]\n`,
      hints: ['if not items: checks for an empty list.', 'Return None for the empty case.', 'Return items[0] otherwise.'],
      cases: [
        { name: 'normal list', call: 'get_first([10, 20, 30])', expect: '10' },
        { name: 'empty list', call: 'get_first([])', expect: 'None' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`parse_int_safely(text)\` that converts \`text\` to an integer. If it fails, return a tuple \`(False, error_message)\`. If it succeeds, return \`(True, number)\`.\n\nUse try/except ValueError. This is the "either pattern" — returning a success/failure wrapper instead of crashing.`,
      starter: `def parse_int_safely(text):\n    pass\n`,
      solution: `def parse_int_safely(text):\n    try:\n        return (True, int(text))\n    except ValueError:\n        return (False, f"Cannot convert '{text}' to int")\n`,
      hints: ['Try int(text) in a try block.', 'On success return (True, int(text)).', 'On ValueError return (False, "Cannot convert ...").'],
      cases: [
        { name: 'valid number', call: 'parse_int_safely("42")', expect: '(True, 42)' },
        { name: 'invalid', call: 'parse_int_safely("abc")', expect: '(False, "Cannot convert \'abc\' to int")' },
      ],
    }),
  ],

  'file-io': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`write_and_read(filename, content)\` that writes \`content\` to a file with \`"w"\` mode, then reads and returns its contents. Use two \`with\` blocks — one for writing, one for reading.\n\nThis verifies the round-trip: what you wrote is what you get back.`,
      starter: `def write_and_read(filename, content):\n    pass\n`,
      solution: `def write_and_read(filename, content):\n    with open(filename, "w") as f:\n        f.write(content)\n    with open(filename) as f:\n        return f.read()\n`,
      hints: ['First with open(filename, "w") as f: f.write(content).', 'Then with open(filename) as f: return f.read().', 'The file is auto-closed after each with block.'],
      cases: [
        { name: 'roundtrip', call: '__create_tmp_file("test", lambda f: write_and_read(f, "hello"))', expect: '"hello"' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`append_line(filename, text)\` that appends a line (text + newline) to a file. If the file does not exist, create it. Use mode \`"a"\`.\n\nReturn the number of characters written (including the newline).`,
      starter: `def append_line(filename, text):\n    pass\n`,
      solution: `def append_line(filename, text):\n    line = text + "\\n"\n    with open(filename, "a") as f:\n        return f.write(line)\n`,
      hints: ['Mode "a" creates the file if it does not exist.', 'Add a newline: text + "\\n".', 'f.write returns the number of characters written.'],
      cases: [
        { name: 'writes and returns count', call: '__create_tmp_file("test", lambda f: append_line(f, "hello"))', expect: '6' },
      ],
    }),
  ],

  'comprehensions': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`filter_positive(numbers)\` returning a list of only the positive numbers, using a list comprehension with an \`if\` filter.\n\n\`filter_positive([-3, 0, 5, -1, 9])\` → \`[5, 9]\``,
      starter: `def filter_positive(numbers):\n    pass\n`,
      solution: `def filter_positive(numbers):\n    return [n for n in numbers if n > 0]\n`,
      hints: ['Use a list comprehension: [n for n in numbers if n > 0].', 'The if clause filters after the for.', 'Return the comprehension directly.'],
      cases: [
        { name: 'mixed', call: 'filter_positive([-3, 0, 5, -1, 9])', expect: '[5, 9]' },
        { name: 'all negative', call: 'filter_positive([-1, -2])', expect: '[]' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`flatten(matrix)\` that takes a list of lists and returns a single flat list using a nested comprehension.\n\n\`flatten([[1, 2], [3, 4], [5]])\` → \`[1, 2, 3, 4, 5]\`\n\nUse \`[item for row in matrix for item in row]\`. Read it: "for each row in matrix, for each item in row, give me item".`,
      starter: `def flatten(matrix):\n    pass\n`,
      solution: `def flatten(matrix):\n    return [item for row in matrix for item in row]\n`,
      hints: ['The order: for row in matrix, then for item in row.', 'The expression at the front is just item.', 'One line — return the comprehension directly.'],
      cases: [
        { name: '3x2', call: 'flatten([[1, 2], [3, 4], [5, 6]])', expect: '[1, 2, 3, 4, 5, 6]' },
        { name: 'empty', call: 'flatten([])', expect: '[]' },
      ],
    }),
  ],

  'oop': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Create a \`Temperature\` class. The constructor takes \`celsius\`. Add a method \`fahrenheit()\` that returns the Fahrenheit equivalent (c * 9/5 + 32), and a method \`kelvin()\` that returns Kelvin (c + 273.15). Both should round to 2 decimal places.`,
      starter: `class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    def fahrenheit(self):\n        pass\n\n    def kelvin(self):\n        pass\n`,
      solution: `class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    def fahrenheit(self):\n        return round(self.celsius * 9 / 5 + 32, 2)\n\n    def kelvin(self):\n        return round(self.celsius + 273.15, 2)\n`,
      hints: ['Fahrenheit formula: celsius * 9 / 5 + 32.', 'Kelvin formula: celsius + 273.15.', 'Wrap each in round(..., 2).'],
      cases: [
        { name: 'freezing fahrenheit', call: 'Temperature(0).fahrenheit()', expect: '32.0' },
        { name: 'freezing kelvin', call: 'Temperature(0).kelvin()', expect: '273.15' },
        { name: 'boiling', call: 'Temperature(100).fahrenheit()', expect: '212.0' },
      ],
    }),
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Create a \`Playlist\` class. Constructor takes a \`name\`. Add \`add_song(title)\` to append to an internal list, \`remove_song(title)\` to remove the first occurrence, and a \`count\` property (using @property) that returns the number of songs.`,
      starter: `class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        pass\n\n    def remove_song(self, title):\n        pass\n\n    @property\n    def count(self):\n        pass\n`,
      solution: `class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        self._songs.append(title)\n\n    def remove_song(self, title):\n        if title in self._songs:\n            self._songs.remove(title)\n\n    @property\n    def count(self):\n        return len(self._songs)\n`,
      hints: ['add_song: self._songs.append(title).', 'remove_song: check with "if title in self._songs" first.', '@property count returns len(self._songs).'],
      cases: [
        { name: 'add and count', call: '(lambda p: (p.add_song("a"), p.add_song("b"), p.count)[-1])(Playlist("test"))', expect: '2' },
        { name: 'remove', call: '(lambda p: (p.add_song("a"), p.add_song("b"), p.remove_song("a"), p.count)[-1])(Playlist("test"))', expect: '1' },
      ],
    }),
  ],

  'modules': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Import \`math\` and write \`circle_circumference(radius)\` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse \`math.pi\` for the constant.`,
      starter: `import math\n\ndef circle_circumference(radius):\n    pass\n`,
      solution: `import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n`,
      hints: ['math.pi gives the constant.', 'Formula: 2 * math.pi * radius.', 'Wrap in round(..., 2).'],
      cases: [
        { name: 'radius 1', call: 'circle_circumference(1)', expect: '6.28' },
        { name: 'radius 2', call: 'circle_circumference(2)', expect: '12.57' },
      ],
    }),
  ],

  'testing': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`is_palindrome(text)\` returning \`True\` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n\`is_palindrome("Racecar")\` → \`True\``,
      starter: `def is_palindrome(text):\n    """Check if text is a palindrome.\n\n    >>> is_palindrome("racecar")\n    True\n    >>> is_palindrome("hello")\n    False\n    >>> is_palindrome("Racecar")\n    True\n    """\n    pass\n`,
      solution: `def is_palindrome(text):\n    """Check if text is a palindrome.\n\n    >>> is_palindrome("racecar")\n    True\n    >>> is_palindrome("hello")\n    False\n    >>> is_palindrome("Racecar")\n    True\n    """\n    t = text.lower()\n    return t == t[::-1]\n`,
      hints: ['Lowercase first: text.lower().', 'Compare with its reverse: text[::-1].', 'Return the comparison directly.'],
      cases: [
        { name: 'palindrome', call: 'is_palindrome("Racecar")', expect: 'True' },
        { name: 'not palindrome', call: 'is_palindrome("hello")', expect: 'False' },
      ],
    }),
  ],

  'async': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`delayed_greeting(name, seconds)\` as an async function that awaits \`asyncio.sleep(seconds)\` and then returns \`"Hello, {name}!"\`.\n\nImport asyncio at the top.`,
      starter: `import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n`,
      solution: `import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f"Hello, {name}!"\n`,
      hints: ['await asyncio.sleep(seconds) pauses the coroutine.', 'Return an f-string after the sleep.', 'The function must be async def.'],
      cases: [
        { name: 'returns greeting', call: '__run_async(delayed_greeting("Ada", 0.01))', expect: '"Hello, Ada!"' },
      ],
      preamble: `async def __run_async(coro):\n    return await coro\n`,
    }),
  ],
};

// ---- RUST ----

TEMPLATES.rust = {
  'getting-started': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`shout(text: &str) -> String\` returning text in uppercase with three exclamation marks.\n\n\`shout("hello")\` → \`"HELLO!!!"\``,
      lang: 'rust',
      starter: `fn shout(text: &str) -> String {\n    todo!()\n}\n`,
      solution: `fn shout(text: &str) -> String {\n    let mut result = text.to_uppercase();\n    result.push_str("!!!");\n    result\n}\n`,
      hints: ['Use .to_uppercase() on text.', 'Declare result as mut String.', 'push_str("!!!") appends. No semicolon on the final line.'],
      cases: [
        { name: 'shouts', call: 'shout("hello")', expect: 'String::from("HELLO!!!")' },
      ],
    }),
  ],
  'functions-and-flow': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`can_vote(age: u32) -> bool\` returning true if age >= 18. Return the comparison directly — no if statement needed.`,
      lang: 'rust',
      starter: `fn can_vote(age: u32) -> bool {\n    todo!()\n}\n`,
      solution: `fn can_vote(age: u32) -> bool {\n    age >= 18\n}\n`,
      hints: ['The comparison age >= 18 evaluates to a bool.', 'Return it directly — no semicolon.', 'No if statement needed.'],
      cases: [
        { name: 'adult', call: 'can_vote(20)', expect: 'true' },
        { name: 'minor', call: 'can_vote(16)', expect: 'false' },
      ],
    }),
  ],
  'ownership-and-borrowing': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`clone_uppercase(text: &str) -> String\` that returns an uppercase clone — without taking ownership of the original.\n\nUse \`.to_uppercase()\` which already returns a new String. Taking a \`&str\` means the caller keeps their data.`,
      lang: 'rust',
      starter: `fn clone_uppercase(text: &str) -> String {\n    todo!()\n}\n`,
      solution: `fn clone_uppercase(text: &str) -> String {\n    text.to_uppercase()\n}\n`,
      hints: ['.to_uppercase() takes &str and returns a new String.', 'No cloning needed — the method does it for you.', 'No semicolon on the final line.'],
      cases: [
        { name: 'uppercase', call: 'clone_uppercase("hello")', expect: 'String::from("HELLO")' },
      ],
    }),
  ],
  'structs-and-enums': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Define an enum \`TrafficLight\` with variants \`Red\`, \`Yellow\`, \`Green\`. Write \`next(light: &TrafficLight) -> TrafficLight\` that cycles Red→Green→Yellow→Red. Use match.`,
      lang: 'rust',
      starter: `#[derive(Debug, PartialEq)]\nenum TrafficLight { Red, Yellow, Green }\n\nfn next(light: &TrafficLight) -> TrafficLight {\n    todo!()\n}\n`,
      solution: `#[derive(Debug, PartialEq)]\nenum TrafficLight { Red, Yellow, Green }\n\nfn next(light: &TrafficLight) -> TrafficLight {\n    match light {\n        TrafficLight::Red => TrafficLight::Green,\n        TrafficLight::Yellow => TrafficLight::Red,\n        TrafficLight::Green => TrafficLight::Yellow,\n    }\n}\n`,
      hints: ['Match on light — the compiler checks exhaustiveness.', 'Each arm returns the next variant.', 'No semicolons on the match arms.'],
      cases: [
        { name: 'red to green', call: 'next(&TrafficLight::Red)', expect: 'TrafficLight::Green' },
        { name: 'green to yellow', call: 'next(&TrafficLight::Green)', expect: 'TrafficLight::Yellow' },
      ],
    }),
  ],
};

// ---- JAVA ----

TEMPLATES.java = {
  'getting-started': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`static String shout(String text)\` returning text uppercased with three exclamation marks.\n\n\`shout("hello")\` → \`"HELLO!!!"\``,
      lang: 'java',
      starter: `static String shout(String text) {\n    return null;\n}\n`,
      solution: `static String shout(String text) {\n    return text.toUpperCase() + "!!!";\n}\n`,
      hints: ['Call text.toUpperCase().', 'Concatenate with "!!!" using +.', 'Return the result.'],
      cases: [
        { name: 'shouts', call: 'shout("hello")', expect: '"HELLO!!!"' },
      ],
    }),
  ],
  'control-flow': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`static boolean canVote(int age)\` returning true if age >= 18. Return the comparison directly.`,
      lang: 'java',
      starter: `static boolean canVote(int age) {\n    return false;\n}\n`,
      solution: `static boolean canVote(int age) {\n    return age >= 18;\n}\n`,
      hints: ['The comparison age >= 18 is already a boolean.', 'Return it directly — no if needed.', 'One line.'],
      cases: [
        { name: 'adult', call: 'canVote(20)', expect: 'true' },
        { name: 'minor', call: 'canVote(16)', expect: 'false' },
      ],
    }),
  ],
  'classes-and-objects': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Create a \`static class Rectangle\` with private fields \`width\` and \`height\` (both double). Add a constructor, a method \`area()\` returning width * height, and a method \`perimeter()\` returning 2 * (width + height).`,
      lang: 'java',
      starter: `static class Rectangle {\n    private double width;\n    private double height;\n\n    Rectangle(double w, double h) { width = w; height = h; }\n\n    double area() { return 0; }\n    double perimeter() { return 0; }\n}\n`,
      solution: `static class Rectangle {\n    private double width;\n    private double height;\n\n    Rectangle(double w, double h) { width = w; height = h; }\n\n    double area() { return width * height; }\n    double perimeter() { return 2 * (width + height); }\n}\n`,
      hints: ['area: return width * height;', 'perimeter: return 2 * (width + height);', 'Use a capital R — Rectangle, not rectangle.'],
      cases: [
        { name: 'area', call: 'new Rectangle(3, 4).area()', expect: '12.0' },
        { name: 'perimeter', call: 'new Rectangle(3, 4).perimeter()', expect: '14.0' },
      ],
    }),
  ],
  'collections': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`static int sumEven(List<Integer> numbers)\` returning the sum of even numbers using a for-each loop.\n\n\`sumEven(Arrays.asList(1, 2, 3, 4))\` → \`6\``,
      lang: 'java',
      starter: `static int sumEven(List<Integer> numbers) {\n    return 0;\n}\n`,
      solution: `static int sumEven(List<Integer> numbers) {\n    int total = 0;\n    for (int n : numbers) {\n        if (n % 2 == 0) total += n;\n    }\n    return total;\n}\n`,
      hints: ['Start with int total = 0;', 'Use enhanced for: for (int n : numbers).', 'Check n % 2 == 0 and add to total.'],
      cases: [
        { name: 'sum evens', call: 'sumEven(Arrays.asList(1, 2, 3, 4))', expect: '6' },
        { name: 'no evens', call: 'sumEven(Arrays.asList(1, 3))', expect: '0' },
      ],
    }),
  ],
};

// ---- WEB ----

TEMPLATES.web = {
  'html-fundamentals': [
    (n) => ({
      t: 'tryweb',
      prompt: `Exercise ${n}: Build a page with an \`<h2>\` heading, a \`<p>\` paragraph, and an ordered list (\`<ol>\`) with three items. Content is up to you.`,
      files: { html: `<!-- Build your page here -->\n`, css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }`, js: `` },
      solution: { html: `<h2>My Favourites</h2>\n<p>Here are my top three programming languages:</p>\n<ol>\n  <li>Python</li>\n  <li>Rust</li>\n  <li>Java</li>\n</ol>`, css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }`, js: `` },
      hints: ['Start with an <h2> heading.', 'Add a <p> paragraph after it.', 'Use <ol> with three <li> elements inside.'],
      checks: [
        { name: 'has heading', code: `return !!doc.querySelector('h2');` },
        { name: 'has paragraph', code: `return !!doc.querySelector('p');` },
        { name: 'has ordered list with 3 items', code: `const ol = doc.querySelector('ol'); return !!ol && ol.querySelectorAll('li').length === 3;` },
      ],
    }),
  ],
  'css-styling': [
    (n) => ({
      t: 'tryweb',
      prompt: `Exercise ${n}: Style the \`.box\` element with: padding of at least 1rem, a border (at least 1px solid), and a background colour that is not white.`,
      files: { html: `<div class="box">Styled box</div>`, css: `.box {\n  /* your styles here */\n}`, js: `` },
      solution: { html: `<div class="box">Styled box</div>`, css: `.box {\n  padding: 1.25rem;\n  border: 2px solid #3b82f6;\n  background: #eff6ff;\n  border-radius: 8px;\n}`, js: `` },
      hints: ['Add padding: 1.25rem; inside .box {}.', 'Add border: 2px solid #3b82f6;', 'Add background: #eff6ff;'],
      checks: [
        { name: 'has padding', code: `return parseFloat(win.getComputedStyle(doc.querySelector('.box')).paddingTop) >= 16;` },
        { name: 'has border', code: `const s = win.getComputedStyle(doc.querySelector('.box')); return s.borderWidth !== '0px';` },
        { name: 'has background', code: `const bg = win.getComputedStyle(doc.querySelector('.box')).backgroundColor; return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';` },
      ],
    }),
  ],
  'css-layout': [
    (n) => ({
      t: 'tryweb',
      prompt: `Exercise ${n}: Make \`.row\` a flex container with its three items spaced evenly across the row. Use \`display: flex\`, \`justify-content: space-evenly\`, and \`gap: 1rem\`.`,
      files: { html: `<div class="row">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>`, css: `.row {\n  /* your flex styles here */\n}`, js: `` },
      solution: { html: `<div class="row">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>`, css: `.row {\n  display: flex;\n  justify-content: space-evenly;\n  gap: 1rem;\n}`, js: `` },
      hints: ['display: flex; turns on flexbox.', 'justify-content: space-evenly; distributes items evenly.', 'gap: 1rem; adds space between them.'],
      checks: [
        { name: 'is flex', code: `return win.getComputedStyle(doc.querySelector('.row')).display === 'flex';` },
        { name: 'items spaced', code: `return win.getComputedStyle(doc.querySelector('.row')).justifyContent === 'space-evenly';` },
      ],
    }),
  ],
  'javascript-basics': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`reverseWords(sentence)\` that reverses the order of words in a sentence.\n\n\`reverseWords("hello world")\` → \`"world hello"\`\n\nUse \`.split(" ")\`, \`.reverse()\`, and \`.join(" ")\`. Chain them.`,
      lang: 'javascript',
      starter: `function reverseWords(sentence) {\n  \n}\n`,
      solution: `function reverseWords(sentence) {\n  return sentence.split(" ").reverse().join(" ");\n}\n`,
      hints: ['.split(" ") turns the sentence into an array of words.', '.reverse() reverses the array.', '.join(" ") glues them back with spaces.'],
      cases: [
        { name: 'two words', call: 'reverseWords("hello world")', expect: '"world hello"' },
        { name: 'three words', call: 'reverseWords("a b c")', expect: '"c b a"' },
      ],
    }),
  ],
  'javascript-dom': [
    (n) => ({
      t: 'tryweb',
      prompt: `Exercise ${n}: Make the button show/hide the box. When clicked, toggle the \`hidden\` class on \`#box\`. Use \`classList.toggle("hidden")\`. The CSS for \`.hidden\` is already written — you only write the JavaScript.`,
      files: { html: `<button id="toggle">Show/Hide</button>\n<div id="box">Content</div>`, css: `.hidden { display: none; }`, js: `const toggle = document.querySelector("#toggle");\nconst box = document.querySelector("#box");\n\n// Add your click listener here\n` },
      solution: { html: `<button id="toggle">Show/Hide</button>\n<div id="box">Content</div>`, css: `.hidden { display: none; }`, js: `const toggle = document.querySelector("#toggle");\nconst box = document.querySelector("#box");\n\ntoggle.addEventListener("click", () => {\n  box.classList.toggle("hidden");\n});\n` },
      hints: ['toggle.addEventListener("click", () => { ... });', 'Inside the arrow function: box.classList.toggle("hidden");', 'No if statement needed — toggle does it.'],
      checks: [
        { name: 'box starts visible', code: `return !doc.querySelector('#box').classList.contains('hidden');` },
        { name: 'click hides it', code: `doc.querySelector('#toggle').click(); await sleep(30); return doc.querySelector('#box').classList.contains('hidden');` },
      ],
    }),
  ],
  'javascript-async': [
    (n) => ({
      t: 'try',
      prompt: `Exercise ${n}: Write \`fetchPostTitle(id)\` that fetches from \`https://jsonplaceholder.typicode.com/posts/{id}\` and returns the \`title\` field. Use async/await.\n\n\`await fetchPostTitle(1)\` → \`"sunt aut facere..."\` (or whatever the API returns)`,
      lang: 'javascript',
      starter: `async function fetchPostTitle(id) {\n  \n}\n`,
      solution: `async function fetchPostTitle(id) {\n  const res = await fetch("https://jsonplaceholder.typicode.com/posts/" + id);\n  const data = await res.json();\n  return data.title;\n}\n`,
      hints: ['await fetch(url) to get the response.', 'await res.json() to parse the body.', 'Return data.title.'],
      cases: [
        { name: 'fetches title', call: '__run_async(fetchPostTitle(1))', expect: '"sunt aut facere repellat provident occaecati excepturi optio reprehenderit"' },
      ],
      preamble: `async function __run_async(promise) {\n    return await promise;\n}\n`,
    }),
  ],
  'accessibility': [
    (n) => ({
      t: 'tryweb',
      prompt: `Exercise ${n}: Add an \`alt\` attribute to the image describing what it shows, and wrap the input in a \`<label>\` with a matching \`for\`/ \`id\` pair. The label text should be "Email".`,
      files: { html: `<img src="cat.jpg">\n<input type="email" id="email-input">`, css: '', js: `` },
      solution: { html: `<img src="cat.jpg" alt="A ginger cat sleeping on a keyboard">\n<label for="email-input">Email</label>\n<input type="email" id="email-input">`, css: '', js: `` },
      hints: ['Add alt="description" to the img tag.', 'Add <label for="email-input">Email</label> before the input.', 'The for of the label must match the id of the input.'],
      checks: [
        { name: 'img has alt', code: `return doc.querySelector('img').hasAttribute('alt') && doc.querySelector('img').getAttribute('alt').length > 0;` },
        { name: 'has label for input', code: `return !!doc.querySelector('label[for="email-input"]');` },
      ],
    }),
  ],
};

// ==================================================================
// PROCESSING LOGIC
// ==================================================================

for (const track of TRACKS) {
  const templates = TEMPLATES[track.id];
  if (!templates) continue;

  const filePath = path.join('data', `lessons-${track.id}.js`);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  for (const lesson of track.lessons || []) {
    const topicTemplates = templates[lesson.topic];
    if (!topicTemplates || !topicTemplates.length) continue;

    const exercises = lesson.blocks.filter(b => b.t === 'try' || b.t === 'tryweb');
    const needed = Math.max(0, 2 - exercises.length);
    if (needed === 0) continue;

    // Build replacement — insert new exercise blocks before quizzes at the end
    // Strategy: find the position of the first non-exercise block at the end
    // and insert before it

    // Find the blocks array in the file for this lesson
    const lessonMarker = `id: '${lesson.id}'`;
    const lessonStart = content.indexOf(lessonMarker);
    if (lessonStart === -1) continue;

    // Find the closing of this lesson's blocks array
    // The blocks array ends with a line like: "    ],\n  },\n"
    // We need to insert before the closing "];" of blocks

    // Simple approach: use regex to find blocks end and inject
    let blockContent = '';
    for (let i = 0; i < needed; i++) {
      const templateIdx = (exercises.length + i) % topicTemplates.length;
      const ex = topicTemplates[templateIdx](exercises.length + i + 1);
      blockContent += `\n      ${JSON.stringify(ex, null, 6).replace(/\n/g, '\n      ')},\n`;
    }

    // Find the closing of the blocks array — the pattern is "    ],\n  },\n"
    // Search from lessonStart
    const searchFrom = content.indexOf('blocks:', lessonStart);
    if (searchFrom === -1) continue;

    // Find the next "  }," after the blocks array (end of this lesson)
    // The blocks array is "blocks: [\n      ...\n    ],\n  },\n"
    const blocksEnd = content.indexOf('\n    ],\n', searchFrom);
    if (blocksEnd === -1) continue;

    // See if there are quizzes after the block insert point
    const lessonEnd = content.indexOf('\n  },\n', blocksEnd);
    if (lessonEnd === -1) continue;

    // Insert before the blocks closing
    const before = content.substring(0, blocksEnd);
    const after = content.substring(blocksEnd);
    content = before + blockContent + after;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}
