// add-block-types.mjs — injects debug/complete/refactor example exercises
// Run: node tools/add-block-types.mjs

import fs from 'fs';

const EXAMPLES = {
  python: [
    {
      lesson: 'py-l3',
      block: {
        t: 'complete',
        prompt: 'Complete the `hypotenuse(a, b)` function. The formula for the hypotenuse of a right-angled triangle is `sqrt(a² + b²)`. Use `math.sqrt` and fill in the blank.\n\nThe starter has the import and the return statement — only the expression is missing.',
        starter: `import math\n\ndef hypotenuse(a, b):\n    """Return the length of the hypotenuse."""\n    return ____\n`,
        solution: `import math\n\ndef hypotenuse(a, b):\n    """Return the length of the hypotenuse."""\n    return math.sqrt(a ** 2 + b ** 2)\n`,
        gap_description: 'Replace `____` with the correct expression: `math.sqrt(a ** 2 + b ** 2)`.',
        hints: ['math.sqrt(x) computes the square root.', 'a ** 2 is a squared. b ** 2 is b squared.', 'Sum them inside math.sqrt().'],
        cases: [
          { name: '3-4-5 triangle', call: 'hypotenuse(3, 4)', expect: '5.0' },
          { name: 'zero sides', call: 'hypotenuse(0, 0)', expect: '0.0' },
        ],
      },
    },
    {
      lesson: 'py-l10',
      block: {
        t: 'debug',
        prompt: 'The `safe_int` function below has a bug — it crashes instead of returning the fallback when given certain inputs. Find and fix it.\n\nHint: there is a line of code that runs BEFORE the error can be caught.',
        starter: `def safe_int(text, fallback=0):\n    """Convert text to an integer safely."""\n    print("converting", text)   # bug: print before validation\n    try:\n        return int(text)\n    except ValueError:\n        return fallback\n`,
        solution: `def safe_int(text, fallback=0):\n    """Convert text to an integer safely."""\n    try:\n        return int(text)\n    except (ValueError, TypeError):\n        return fallback\n`,
        bug_description: 'The code prints the text before the try block. More critically, it does not catch `TypeError` — passing `None` or a list will crash. The fix: remove the print (it was debug leftover) and add `TypeError` to the except clause.',
        hints: ['The print() is a red herring — remove it.', 'int(None) raises TypeError, not ValueError.', 'Change `except ValueError` to `except (ValueError, TypeError)`.'],
        cases: [
          { name: 'valid number', call: 'safe_int("42")', expect: '42' },
          { name: 'bad text', call: 'safe_int("banana")', expect: '0' },
          { name: 'None input', call: 'safe_int(None, -1)', expect: '-1' },
        ],
      },
    },
    {
      lesson: 'py-l7',
      block: {
        t: 'refactor',
        prompt: 'The `filter_positives` function below works correctly but is awkward — it uses an index-based loop when Python has a cleaner way. Rewrite it using a **list comprehension** that is both shorter and more readable. The function must produce the same output for the same input.',
        starter: `def filter_positives(numbers):\n    """Return only the positive numbers."""\n    result = []\n    i = 0\n    while i < len(numbers):\n        if numbers[i] > 0:\n            result.append(numbers[i])\n        i = i + 1\n    return result\n`,
        solution: `def filter_positives(numbers):\n    """Return only the positive numbers."""\n    return [n for n in numbers if n > 0]\n`,
        hints: ['A list comprehension has the form [expr for item in iterable if condition].', 'Iterate numbers directly — no index needed.', 'The condition is n > 0; the expression is just n.'],
        cases: [
          { name: 'mixed', call: 'filter_positives([-3, 0, 5, -1, 9])', expect: '[5, 9]' },
          { name: 'all negative', call: 'filter_positives([-1, -2])', expect: '[]' },
          { name: 'empty', call: 'filter_positives([])', expect: '[]' },
        ],
      },
    },
  ],
  rust: [
    {
      lesson: 'rs-l2',
      block: {
        t: 'complete',
        prompt: 'Complete the `absolute(n: i32) -> i32` function. Replace `todo!()` with an expression that returns the absolute value of `n`. Remember: the final expression in a block is the return value (no semicolon needed).\n\nYou can use an `if` expression: `if n >= 0 { n } else { -n }`.',
        lang: 'rust',
        starter: `fn absolute(n: i32) -> i32 {\n    todo!()\n}\n`,
        solution: `fn absolute(n: i32) -> i32 {\n    if n >= 0 { n } else { -n }\n}\n`,
        gap_description: 'Replace `todo!()` with the if expression that returns the absolute value.',
        hints: ['Use an if expression: if n >= 0 { n } else { -n }.', 'No semicolons on the branch values — they are the return value.', 'No return keyword needed.'],
        cases: [
          { name: 'positive', call: 'absolute(5)', expect: '5' },
          { name: 'negative', call: 'absolute(-7)', expect: '7' },
          { name: 'zero', call: 'absolute(0)', expect: '0' },
        ],
      },
    },
    {
      lesson: 'rs-l4',
      block: {
        t: 'debug',
        prompt: 'The `first_char` function below has a borrow-checker bug. It should return the first character of a `&str`, but it does not compile. Fix it.\n\nClue: `.chars().next()` returns an `Option<char>`, not a `&str`. The return type is wrong, and the function body needs adjustment.',
        lang: 'rust',
        starter: `fn first_char(text: &str) -> &str {\n    // BUG: this returns Option<char>, not &str\n    text.chars().next().unwrap()\n}\n`,
        solution: `fn first_char(text: &str) -> Option<char> {\n    text.chars().next()\n}\n`,
        bug_description: '`.chars().next()` returns `Option<char>`, not `&str`. The return type and the function body disagree. Fix: change the return type to `Option<char>` and remove the `.unwrap()` — let the caller decide how to handle the None case.',
        hints: ['Change the return type from &str to Option<char>.', 'Remove .unwrap() — it would panic on empty strings.', 'Return text.chars().next() directly.'],
        cases: [
          { name: 'has first char', call: 'first_char("hello")', expect: 'Some(\'h\')' },
          { name: 'empty string', call: 'first_char("")', expect: 'None' },
        ],
      },
    },
  ],
  java: [
    {
      lesson: 'jv-l3',
      block: {
        t: 'debug',
        prompt: 'The `isWeekend` method has a subtle bug. January has 31 days, not 32. But the real bug is worse: it uses `==` on Strings. Fix both issues.\n\n`day.equals("Saturday")` is correct; `day == "Saturday"` is not.',
        lang: 'java',
        starter: `static boolean isWeekend(String day) {\n    // BUG: == compares references, not content\n    if (day == "Saturday" || day == "Sunday") {\n        return true;\n    }\n    return false;\n}\n`,
        solution: `static boolean isWeekend(String day) {\n    return "Saturday".equals(day) || "Sunday".equals(day);\n}\n`,
        bug_description: '`==` on Strings compares object identity, not content. Two Strings with the same text can be different objects. Use `.equals()` instead. The null-safe form is `"Saturday".equals(day)`.',
        hints: ['Replace == with .equals().', 'Call .equals() on the literal: "Saturday".equals(day) — this is null-safe.', 'The whole method can be a single return statement.'],
        cases: [
          { name: 'Saturday', call: 'isWeekend("Saturday")', expect: 'true' },
          { name: 'Wednesday', call: 'isWeekend("Wednesday")', expect: 'false' },
          { name: 'null is safe', call: 'isWeekend(null)', expect: 'false' },
        ],
      },
    },
    {
      lesson: 'jv-l18',
      block: {
        t: 'refactor',
        prompt: 'The `sumOfSquares` method works but uses a traditional for-loop. Refactor it to use a **stream pipeline** with `.map()` and `.sum()`. The behaviour must stay identical.',
        lang: 'java',
        starter: `static int sumOfSquares(List<Integer> numbers) {\n    int total = 0;\n    for (int i = 0; i < numbers.size(); i++) {\n        total += numbers.get(i) * numbers.get(i);\n    }\n    return total;\n}\n`,
        solution: `static int sumOfSquares(List<Integer> numbers) {\n    return numbers.stream().mapToInt(n -> n * n).sum();\n}\n`,
        hints: ['Use numbers.stream() as the source.', '.mapToInt(n -> n * n) transforms each element.', '.sum() is the terminal operation — it returns the total.'],
        cases: [
          { name: 'basic', call: 'sumOfSquares(Arrays.asList(1, 2, 3))', expect: '14' },
          { name: 'empty', call: 'sumOfSquares(List.of())', expect: '0' },
        ],
      },
    },
  ],
  web: [
    {
      lesson: 'web-l5',
      block: {
        t: 'debug',
        prompt: 'The `addNumbers` function below should add two numbers. But it has a classic JavaScript bug. Find and fix it.\n\nClue: what does `+` do when one side is a string?',
        lang: 'javascript',
        starter: `function addNumbers(a, b) {\n  // BUG: input values from a form are strings!\n  return a + b;\n}\n`,
        solution: `function addNumbers(a, b) {\n  return Number(a) + Number(b);\n}\n`,
        bug_description: 'When `a` or `b` comes from user input (e.g. a form field), it is a string. `"2" + "3"` gives `"23"`, not `5`. The fix: explicitly convert both to numbers with `Number()`.',
        hints: ['Use Number(a) to convert a string to a number.', 'Number(b) does the same for b.', 'Return Number(a) + Number(b).'],
        cases: [
          { name: 'two numbers', call: 'addNumbers("2", "3")', expect: '5' },
          { name: 'floats', call: 'addNumbers("1.5", "2.5")', expect: '4' },
        ],
      },
    },
    {
      lesson: 'web-l14',
      block: {
        t: 'refactor',
        prompt: 'The `renderList` function below updates the DOM by building an HTML string and setting `innerHTML`. Refactor it to use `document.createElement` and `textContent` instead — this is safer (prevents XSS) and avoids re-parsing the entire list on every update.',
        lang: 'javascript',
        starter: `function renderList(items, listElement) {\n  // Works but uses innerHTML — refactor to use createElement\n  listElement.innerHTML = items.map((t, i) =>\n    '<li>' + t + '<button data-index="' + i + '">x</button></li>'\n  ).join('');\n}\n`,
        solution: `function renderList(items, listElement) {\n  listElement.innerHTML = '';\n  items.forEach((text, i) => {\n    const li = document.createElement('li');\n    const span = document.createElement('span');\n    span.textContent = text;\n    const btn = document.createElement('button');\n    btn.textContent = 'x';\n    btn.dataset.index = i;\n    li.append(span, btn);\n    listElement.appendChild(li);\n  });\n}\n`,
        hints: ['Clear the list: listElement.innerHTML = "";.', 'For each item, create li, span, and button with createElement.', 'Use textContent (not innerHTML) to set text — it prevents XSS.', 'Use dataset.index = i to store the index on the button.'],
        cases: [
          { name: 'renders items', call: '__renderTest(["a","b"])', expect: '2' },
        ],
        preamble: `function __renderTest(items) {\n    const ul = { innerHTML: '' };\n    const mock = {\n      innerHTML: '',\n      appendChild: function(el) { this._children = this._children || []; this._children.push(el); },\n      querySelectorAll: function() { return []; },\n    };\n    try { renderList(items, mock); return items.length; } catch(e) { return -1; }\n}\n`,
      },
    },
  ],
};

// Process each track
for (const [trackId, examples] of Object.entries(EXAMPLES)) {
  const filePath = `data/lessons-${trackId}.js`;
  let content = fs.readFileSync(filePath, 'utf8');

  for (const { lesson, block } of examples) {
    const lessonMarker = `id: '${lesson}'`;
    const lessonStart = content.indexOf(lessonMarker);
    if (lessonStart === -1) continue;

    const blocksStart = content.indexOf('blocks:', lessonStart);
    if (blocksStart === -1) continue;

    // Find the closing of the blocks array
    const blocksEnd = content.indexOf('\n    ],\n', blocksStart);
    if (blocksEnd === -1) continue;

    // Insert the new block before the blocks closing
    const blockJSON = JSON.stringify(block, null, 6);
    const blockStr = '\n      ' + blockJSON.replace(/\n/g, '\n      ') + ',\n';
    const before = content.substring(0, blocksEnd);
    const after = content.substring(blocksEnd);
    content = before + blockStr + after;
  }

  fs.writeFileSync(filePath, content);
  console.log(`Added ${examples.length} new block type(s) to ${trackId}`);
}
