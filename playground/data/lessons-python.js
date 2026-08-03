/* ============================================================
   Python — Beginner course
   ------------------------------------------------------------
   LESSON SCHEMA (shared by every course)

   {
     id        unique slug
     level     tier id within the course
     title     display name
     minutes   rough reading + doing time
     summary   one line, shown in the course list
     objectives []  "after this you can ..."
     blocks    []   the lesson body, rendered in order
   }

   BLOCK TYPES

   { t:'text',  md }                        prose (markdown subset)
   { t:'note',  tone, title, md }           tone: tip | warn | why | analogy
   { t:'code',  md?, code, run?, output? }  example; run:true adds a Run button
   { t:'try',   prompt, starter, cases,     graded mini-exercise; pass/fail only,
                solution, hints? }          no rubric, no pressure
    { t:'quiz',  q, options, answer, why }   answer = index into options
    { t:'case',  title, md, code?, run? }    worked case study
    { t:'debug',   prompt, starter, cases,    find-and-fix exercise; broken
                   solution, hints? }         starter — the user debugs it
    { t:'complete', prompt, starter, cases,   code-completion exercise;
                    solution, hints? }        gaps to fill in the starter
    { t:'refactor', prompt, starter, cases,   legacy-code improvement
                    solution, hints? }        exercise; working but messy

   `cases` in a try-block use the same {name, call, expect} shape as
   challenges, so the existing runner grades them unchanged.
   ============================================================ */

export const pythonLessonTopics = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    blurb: 'What a program is, your first line of code, and how to read errors calmly.',
  },
  {
    id: 'variables-and-types',
    name: 'Variables & Types',
    blurb: 'Values, names, numbers, arithmetic, and text — the nouns of the language.',
  },
  {
    id: 'control-flow',
    name: 'Control Flow',
    blurb: 'Decisions and repetition — programs that choose a path and programs that repeat a task.',
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    blurb: 'Holding many things at once — lists, dictionaries, and how to work through them.',
  },
  {
    id: 'functions',
    name: 'Functions',
    blurb: 'Packaging work under a name — parameters, return values, scope, and closures.',
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    blurb: 'Reading tracebacks, catching exceptions, and failing usefully instead of crashing.',
  },
  {
    id: 'file-io',
    name: 'File I/O',
    blurb: 'Reading from and writing to files — the bridge between your program and permanent storage.',
  },
  {
    id: 'comprehensions',
    name: 'Comprehensions & Generators',
    blurb: 'Building collections in one line, and working with data that is too large to hold at once.',
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    blurb: 'Classes, instances, inheritance, and designing types that enforce their own rules.',
  },
  {
    id: 'modules',
    name: 'Modules & Packages',
    blurb: 'Splitting code across files, importing, and using the standard library.',
  },
  {
    id: 'testing',
    name: 'Testing & Debugging',
    blurb: 'Writing tests that prove your code works, and debugging it when it does not.',
  },
  {
    id: 'async',
    name: 'Async Python',
    blurb: 'Writing concurrent code with async/await — doing many things at once without threads.',
  },
];

export const pythonLessons = [
  /* ==================================================== 1 */
  {
    id: 'py-l1',
    topic: 'getting-started',
    title: 'Your First Line of Code',
    difficulty: 'beginner',
    minutes: 10,
    summary: 'What a program is, how to make the computer say something, and how to read your first error.',
    objectives: [
      'Explain what a program actually is',
      'Print text to the screen',
      'Read an error message without panicking',
    ],
    blocks: [
      {
        t: 'text',
        md: `A program is a **list of instructions**, carried out in order, top to bottom.

That is genuinely all it is. A recipe is a program. "Boil water. Add pasta. Wait ten minutes. Drain." The computer is a very fast, very literal cook — it will do exactly what you wrote, in exactly the order you wrote it, and it will never guess what you meant.

Python is one way of writing those instructions down. It was designed to look close to English, which is why it is where most people start.`,
      },
      {
        t: 'text',
        md: `The first instruction everyone learns is \`print\`. It means "show this on the screen".

Press **Run** on the box below and watch what happens.`,
      },
      {
        t: 'code',
        run: true,
        code: `print("Hello, world!")`,
      },
      {
        t: 'text',
        md: `Let's take that apart, because every piece matters.

- \`print\` is the **name of the instruction**. Python already knows this one.
- The **brackets** \`( )\` mean "here is what I want you to work on".
- The **quote marks** \`" "\` mean "this is text, not code". Everything between them is taken literally.

The text between quotes is called a **string** — as in, a string of characters threaded together.`,
      },
      {
        t: 'note',
        tone: 'analogy',
        title: 'Why the quotes matter',
        md: `Quotes are how you tell Python the difference between *a word* and *an instruction*.

\`print(hello)\` means "print the thing called hello" — and Python will say it has never heard of anything called hello.

\`print("hello")\` means "print these five letters". No confusion.`,
      },
      {
        t: 'text',
        md: `You can print more than one thing at once by separating with commas. Python puts a space between them for you.`,
      },
      {
        t: 'code',
        run: true,
        code: `print("Hello,", "world!")\nprint("I am", 25, "years old")`,
      },
      {
        t: 'text',
        md: `Notice \`25\` has no quotes. That is because it is a **number**, not text. Python treats those differently — and that difference becomes important in the next lesson.

Now break something on purpose. Run this: it is wrong, and that is the point.`,
      },
      {
        t: 'code',
        run: true,
        code: `print("This line is fine")\nprint(Hello)`,
      },
      {
        t: 'text',
        md: `You should see something like:

\`\`\`
NameError: name 'Hello' is not defined
\`\`\`

Read it backwards, it is easier:
- \`'Hello' is not defined\` — you used a name Python does not know.
- \`NameError\` — the *category* of mistake: a problem with a name.

Also notice the first line still printed. Python ran your instructions in order and only stopped when it hit the broken one.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Errors are not failure',
        md: `Every programmer, at every level, sees errors constantly. An error is not the computer telling you off — it is the computer telling you **exactly which line it got stuck on and why**.

Learning to read them calmly is one of the highest-value skills in this whole course. Beginners see red text and freeze. Experienced developers read the last line first.`,
      },
      {
        t: 'try',
        prompt: `Your turn. Write a function called \`greet\` that **returns** the text \`Hello, World!\`

You will see \`return\` properly in a later lesson — for now, just know that \`return\` hands a value back so we can check it, where \`print\` only shows it on screen.

Replace the word \`pass\` with your \`return\` line.`,
        starter: `def greet():\n    pass\n`,
        solution: `def greet():\n    return "Hello, World!"\n`,
        hints: [
          'The line inside the function must start with `return`, then the text in quotes.',
          'It must be indented — four spaces in from the left, like `pass` was.',
          'Exactly: `return "Hello, World!"` — capital H, capital W, comma, exclamation mark.',
        ],
        cases: [{ name: 'greet() returns the greeting', call: 'greet()', expect: '"Hello, World!"' }],
      },
      {
        t: 'quiz',
        q: 'Why does `print(Hello)` fail while `print("Hello")` works?',
        options: [
          'Python requires all text to be capitalised differently',
          'Without quotes, Python thinks `Hello` is the name of something, and no such thing exists',
          '`print` can only handle one word at a time',
          'It does not fail — both work identically',
        ],
        answer: 1,
        why: 'Quotes mark text as a literal string. Without them Python looks for a name — a variable or function called Hello — finds nothing, and raises a NameError.',
      },
      {
        t: 'try',
        prompt: `Now write \`goodbye()\` that returns \`Goodbye!\`

Same pattern as \`greet\` — replace \`pass\` with a \`return\` line.`,
        starter: `def goodbye():\n    pass\n`,
        solution: `def goodbye():\n    return "Goodbye!"\n`,
        hints: [
          'The line inside the function must start with `return`, then the text in quotes.',
          'Exactly: `return "Goodbye!"` — no comma, just the word and the exclamation mark.',
        ],
        cases: [{ name: 'goodbye() returns the farewell', call: 'goodbye()', expect: '"Goodbye!"' }],
      },

    ],
  },

  /* ==================================================== 2 */
  {
    id: 'py-l2',
    topic: 'variables-and-types',
    title: 'Boxes With Names',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'Variables: storing a value so you can use it again. Plus the four basic types of value.',
    objectives: [
      'Store values in variables and reuse them',
      'Name things clearly',
      'Tell apart text, whole numbers, decimals and true/false',
    ],
    blocks: [
      {
        t: 'text',
        md: `So far every value we made vanished the moment it was printed. To keep one, give it a **name**.`,
      },
      {
        t: 'code',
        run: true,
        code: `name = "Ada"\nprint(name)\nprint("Hello,", name)`,
      },
      {
        t: 'text',
        md: `The \`=\` sign does **not** mean "equals" the way it does in maths. It means **"put the thing on the right into the name on the left"**. Right to left, always.

Read \`name = "Ada"\` as *"name gets Ada"*.`,
      },
      {
        t: 'note',
        tone: 'analogy',
        title: 'A label, not a box',
        md: `Most tutorials say a variable is a box you put a value in. A slightly better picture: it is a **luggage label** you tie onto a value.

That matters later, because two labels can be tied to the same thing. For now, "a name pointing at a value" is the mental model to keep.`,
      },
      {
        t: 'text',
        md: `You can change what a name points at, any time. The old value is simply forgotten.`,
      },
      {
        t: 'code',
        run: true,
        code: `score = 10\nprint(score)\n\nscore = 25\nprint(score)\n\nscore = score + 5\nprint(score)`,
      },
      {
        t: 'text',
        md: `That last line trips up everyone at first: \`score = score + 5\`.

As maths it is nonsense. As an instruction it is obvious: *"work out \`score + 5\`, then put the answer back into \`score\`"*. Right side first, then the label moves.`,
      },
      {
        t: 'text',
        md: `## The four values you will use constantly

Python has many types of value. Four cover most of what you write:

| Type | Name in Python | Example | What it is |
|---|---|---|---|
| Text | \`str\` | \`"Ada"\` | a *string* of characters |
| Whole number | \`int\` | \`42\` | an *integer* |
| Decimal | \`float\` | \`3.14\` | a number with a point in it |
| Yes/no | \`bool\` | \`True\` | a *boolean* — only \`True\` or \`False\` |

You can ask Python what something is with \`type()\`.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(type("Ada"))\nprint(type(42))\nprint(type(3.14))\nprint(type(True))`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Note the capital letters',
        md: `It is \`True\` and \`False\`, not \`true\` and \`false\`. Python is **case-sensitive** — \`Name\`, \`name\` and \`NAME\` are three different names, and \`true\` is not a thing.`,
      },
      {
        t: 'text',
        md: `## Naming things well

Python is relaxed about names: letters, numbers and underscores, not starting with a number. But *good* names are a discipline, not a rule.

\`\`\`python
x = 4.99          # what is x?
price = 4.99      # oh, a price
item_price = 4.99 # even better
\`\`\`

The convention in Python is \`lower_case_with_underscores\`. Use it. You are writing for the next person to read this — and that person is usually you, three weeks from now, with no memory of what \`x\` meant.`,
      },
      {
        t: 'try',
        prompt: `Create a function \`describe_item\` that builds a description from two variables.

Inside the function:
1. store the text \`Coffee\` in a variable called \`item\`
2. store the number \`4.5\` in a variable called \`price\`
3. return the text \`Coffee costs 4.5\`

To glue text and numbers together, use commas inside \`print\` — but here we need to *return* one piece of text. The easiest way is an **f-string**: put \`f\` before the quotes and wrap any variable in curly braces.

\`\`\`python
f"{item} costs {price}"
\`\`\``,
        starter: `def describe_item():\n    pass\n`,
        solution: `def describe_item():\n    item = "Coffee"\n    price = 4.5\n    return f"{item} costs {price}"\n`,
        hints: [
          'Three lines inside the function: two assignments, then a return.',
          'The f goes immediately before the opening quote: f"..."',
          'Inside the braces goes the variable name, not the value: {item}, not {Coffee}.',
        ],
        cases: [{ name: 'builds the description', call: 'describe_item()', expect: '"Coffee costs 4.5"' }],
      },
      {
        t: 'quiz',
        q: 'After running `total = 5` then `total = total * 2`, what is `total`?',
        options: ['5', '10', 'An error — you cannot use a name in its own assignment', '52'],
        answer: 1,
        why: 'The right-hand side is worked out first using the current value (5 * 2 = 10), and only then is the name pointed at the new value.',
      },
      {
        t: 'try',
        prompt: `Write \`add_tax(price)\` that adds 20% tax and returns the new total.

\`add_tax(100)\` → \`120.0\`

Multiply \`price\` by 1.2 — that is it.`,
        starter: `def add_tax(price):\n    pass\n`,
        solution: `def add_tax(price):\n    return price * 1.2\n`,
        hints: [
          'Multiply the price by 1.2 to add 20%%.',
          'return price * 1.2 — one line.',
        ],
        cases: [
          { name: '£100', call: 'add_tax(100)', expect: '120.0' },
          { name: '£0', call: 'add_tax(0)', expect: '0.0' },
        ],
      },

    ],
  },

  /* ==================================================== 3 */
  {
    id: 'py-l3',
    topic: 'variables-and-types',
    title: 'Numbers and Arithmetic',
    difficulty: 'beginner',
    minutes: 10,
    summary: 'Doing maths, the difference between whole and decimal division, and why 0.1 + 0.2 is weird.',
    objectives: [
      'Use all the arithmetic operators',
      'Choose between / and //',
      'Use % to test divisibility',
    ],
    blocks: [
      {
        t: 'text',
        md: `Python is a perfectly good calculator.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(7 + 3)\nprint(7 - 3)\nprint(7 * 3)\nprint(7 / 3)`,
      },
      {
        t: 'text',
        md: `Look closely at the last one: \`7 / 3\` gave \`2.3333333333333335\`, not \`2\`.

In Python, a single \`/\` **always** gives a decimal, even when it divides evenly. \`6 / 3\` is \`2.0\`, not \`2\`. That trailing \`.0\` is Python telling you "this is a float now".

When you want the whole-number answer, use \`//\`.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(7 / 3)    # true division  -> 2.333...\nprint(7 // 3)   # floor division -> 2\nprint(7 % 3)    # remainder      -> 1\nprint(7 ** 3)   # power          -> 343`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'The % operator is more useful than it looks',
        md: `\`%\` (called *modulo*) gives you the remainder after division. It sounds like a maths-class curiosity, but it is everywhere in real code:

- \`n % 2 == 0\` → is n even?
- \`n % 5 == 0\` → is n a multiple of 5?
- \`index % length\` → wrap around to the start of a list
- \`seconds % 60\` → the seconds part of a duration

Any time you need "every Nth thing" or "wrap around", \`%\` is the tool.`,
      },
      {
        t: 'text',
        md: `## Order of operations

Python follows normal maths precedence: powers first, then multiply/divide, then add/subtract. Brackets override everything.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(2 + 3 * 4)     # 14, not 20\nprint((2 + 3) * 4)   # 20\n\n# When in doubt, add brackets. They cost nothing and save arguments.\nprint(2 + (3 * 4))`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'The floating-point surprise',
        md: `Run \`print(0.1 + 0.2)\` and you get \`0.30000000000000004\`.

This is not a Python bug — it happens in almost every language. Computers store decimals in binary, and some decimals (like 0.1) have no exact binary form, exactly as 1/3 has no exact decimal form.

**The practical rule:** never compare floats with \`==\`. And never store money as a float — store it as a whole number of pence or cents, and divide only when displaying.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)        # False!\nprint(round(0.1 + 0.2, 2) == 0.3)  # True`,
      },
      {
        t: 'try',
        prompt: `Write \`seconds_to_clock(total)\` that turns a number of seconds into minutes and seconds.

\`seconds_to_clock(90)\` should return the text \`1m 30s\`.

You need two pieces:
- how many whole minutes fit into \`total\` → use \`//\`
- how many seconds are left over → use \`%\`

Then build the text with an f-string.`,
        starter: `def seconds_to_clock(total):\n    pass\n`,
        solution: `def seconds_to_clock(total):\n    minutes = total // 60\n    seconds = total % 60\n    return f"{minutes}m {seconds}s"\n`,
        hints: [
          'minutes = total // 60 gives the whole minutes.',
          'seconds = total % 60 gives what is left over.',
          'Return f"{minutes}m {seconds}s" — mind the space between them.',
        ],
        cases: [
          { name: '90 seconds', call: 'seconds_to_clock(90)', expect: '"1m 30s"' },
          { name: 'exactly 2 minutes', call: 'seconds_to_clock(120)', expect: '"2m 0s"' },
          { name: 'under a minute', call: 'seconds_to_clock(45)', expect: '"0m 45s"' },
        ],
      },
      {
        t: 'quiz',
        q: 'Which expression checks whether `n` is an even number?',
        options: ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n ** 2 == 0'],
        answer: 1,
        why: 'Even numbers divide by 2 with no remainder, and % gives the remainder. n / 2 == 0 is only true when n is 0.',
      },
      {
        t: 'try',
        prompt: `Write \`is_even(n)\` that returns \`True\` when \`n\` is an even number, \`False\` otherwise.

\`is_even(10)\` → \`True\`\n\`is_even(7)\` → \`False\`

Use \`n % 2 == 0\` — that expression is already a Boolean, so return it directly.`,
        starter: `def is_even(n):\n    pass\n`,
        solution: `def is_even(n):\n    return n % 2 == 0\n`,
        hints: [
          'n % 2 gives the remainder when dividing by 2.',
          'If the remainder is 0, the number is even.',
          'Return the comparison directly: return n % 2 == 0',
        ],
        cases: [
          { name: 'even', call: 'is_even(10)', expect: 'True' },
          { name: 'odd', call: 'is_even(7)', expect: 'False' },
          { name: 'zero is even', call: 'is_even(0)', expect: 'True' },
        ],
      },

    ],
  },

  /* ==================================================== 4 */
  {
    id: 'py-l4',
    topic: 'variables-and-types',
    title: 'Working With Text',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'f-strings, string methods, indexing and slicing — the tools you reach for every single day.',
    objectives: [
      'Build text from values with f-strings',
      'Clean and transform text with string methods',
      'Pull out parts of a string by position',
    ],
    blocks: [
      {
        t: 'text',
        md: `You met f-strings briefly. They deserve a proper look, because you will write thousands of them.

Put \`f\` before the opening quote, and anything in \`{ }\` gets worked out and dropped into the text.`,
      },
      {
        t: 'code',
        run: true,
        code: `name = "Ada"\nage = 36\n\nprint(f"{name} is {age} years old")\nprint(f"Next year she will be {age + 1}")\nprint(f"Her name has {len(name)} letters")`,
      },
      {
        t: 'text',
        md: `Anything can go inside the braces — a variable, a sum, a function call. Python works it out and turns the result into text.

\`len(...)\` there is a built-in that gives the **length** of something. On a string, that is the number of characters.`,
      },
      {
        t: 'text',
        md: `## Methods: things a string can do

A **method** is an instruction that belongs to a value. You call one by writing a dot after the value, then the method name.`,
      },
      {
        t: 'code',
        run: true,
        code: `messy = "  Ada LOVELACE  "\n\nprint(messy.strip())        # remove surrounding whitespace\nprint(messy.strip().lower())  # ...then make it lowercase\nprint(messy.strip().upper())\nprint(messy.strip().title())  # Capitalise Each Word\nprint("-" * 20)\nprint("a,b,c".split(","))   # cut into a list\nprint("ada".replace("a", "A"))\nprint("ada@example.com".endswith(".com"))`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Methods chain, and originals never change',
        md: `\`messy.strip().lower()\` reads left to right: strip it, *then* lowercase the result.

Crucially, \`messy\` itself is **unchanged** — strings in Python are *immutable*. Methods hand you a brand-new string. If you want to keep it, assign it:

\`\`\`python
clean = messy.strip().lower()
\`\`\``,
      },
      {
        t: 'text',
        md: `## Getting at individual characters

Every character has a position, counted **from zero**.

\`\`\`
 P  y  t  h  o  n
 0  1  2  3  4  5
-6 -5 -4 -3 -2 -1
\`\`\`

Square brackets pull out a position. Negative numbers count back from the end.`,
      },
      {
        t: 'code',
        run: true,
        code: `word = "Python"\n\nprint(word[0])    # first\nprint(word[3])    # fourth\nprint(word[-1])   # last\nprint(word[0:3])  # from 0 up to (not including) 3\nprint(word[:3])   # same — start is assumed\nprint(word[3:])   # from 3 to the end`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Why counting starts at zero',
        md: `It feels wrong for about a week, then never again.

The payoff is that \`word[0:3]\` gives exactly 3 characters, \`word[3:7]\` gives exactly 4, and \`word[:n]\` always gives the first \`n\`. The end position is *excluded*, so slices sit neatly next to each other with no off-by-one arithmetic: \`word[:3]\` and \`word[3:]\` together rebuild the whole word with no gap and no overlap.`,
      },
      {
        t: 'try',
        prompt: `Write \`initials(full_name)\` that turns a full name into uppercase initials joined by dots.

\`initials("ada lovelace")\` → \`"A.L."\`

Steps:
1. \`full_name.split()\` cuts the name into a list of words
2. take the first letter of each word — that is \`word[0]\`
3. uppercase it, and put a dot after each

A loop is the clean way. If you have not met one yet, this shape works:

\`\`\`python
result = ""
for word in full_name.split():
    result = result + word[0].upper() + "."
return result
\`\`\`

Try writing it yourself before reading that too closely.`,
        starter: `def initials(full_name):\n    pass\n`,
        solution: `def initials(full_name):\n    result = ""\n    for word in full_name.split():\n        result = result + word[0].upper() + "."\n    return result\n`,
        hints: [
          'Start with an empty string: result = ""',
          'word[0] is the first letter; .upper() makes it a capital.',
          'Add the dot each time round the loop, not at the end.',
        ],
        cases: [
          { name: 'two names', call: 'initials("ada lovelace")', expect: '"A.L."' },
          { name: 'three names', call: 'initials("grace brewster hopper")', expect: '"G.B.H."' },
          { name: 'single name', call: 'initials("plato")', expect: '"P."' },
        ],
      },
      {
        t: 'quiz',
        q: 'What does `"hello"[1:4]` give?',
        options: ['"hell"', '"ell"', '"ello"', '"hel"'],
        answer: 1,
        why: 'It starts at position 1 (the second character, "e") and stops just before position 4 — so characters 1, 2 and 3: "ell".',
      },
      {
        t: 'try',
        prompt: `Write \`first_and_last(word)\` that returns the first and last characters joined together.

\`first_and_last("Python")\` → \`"Pn"\`

Use \`word[0]\` for the first and \`word[-1]\` for the last. Join them with \`+\`.`,
        starter: `def first_and_last(word):\n    pass\n`,
        solution: `def first_and_last(word):\n    return word[0] + word[-1]\n`,
        hints: [
          'word[0] is the first character, word[-1] is the last.',
          'Concatenate them with +.',
          'Work on any length except empty — we will handle that later.',
        ],
        cases: [
          { name: 'Python', call: 'first_and_last("Python")', expect: '"Pn"' },
          { name: 'a single letter repeats', call: 'first_and_last("X")', expect: '"XX"' },
        ],
      },

    ],
  },

  /* ==================================================== 5 */
  {
    id: 'py-l5',
    topic: 'control-flow',
    title: 'Making Decisions',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'if, elif and else — teaching your program to take different paths.',
    objectives: [
      'Branch with if / elif / else',
      'Compare values correctly',
      'Combine conditions with and / or / not',
    ],
    blocks: [
      {
        t: 'text',
        md: `Everything so far has run straight through, top to bottom. Real programs need to **choose**.`,
      },
      {
        t: 'code',
        run: true,
        code: `temperature = 30\n\nif temperature > 25:\n    print("It is hot")\nelse:\n    print("It is not hot")`,
      },
      {
        t: 'text',
        md: `Three things to notice, and the third is the one that catches people out.

1. The condition (\`temperature > 25\`) is a question with a \`True\`/\`False\` answer.
2. The line ends with a **colon** \`:\`.
3. The lines underneath are **indented** — pushed in by four spaces.

That indentation is not decoration. In Python, indentation is *how you show what belongs inside what*. Other languages use curly braces; Python uses whitespace.`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'The most common beginner error',
        md: `\`IndentationError\` and \`SyntaxError: expected ':'\` will be your two most frequent errors this week.

Forget the colon, or line things up carelessly, and Python stops. Be consistent: **four spaces**, every time, and let your editor insert them.`,
      },
      {
        t: 'text',
        md: `## Comparisons

| Operator | Means |
|---|---|
| \`==\` | is equal to |
| \`!=\` | is not equal to |
| \`>\` \`<\` | greater / less than |
| \`>=\` \`<=\` | greater / less than or equal |

**\`=\` assigns. \`==\` compares.** One equals sign puts a value into a name; two ask a question. Mixing them up is a rite of passage.`,
      },
      {
        t: 'code',
        run: true,
        code: `print(5 == 5)\nprint(5 != 5)\nprint("cat" == "Cat")   # case matters\nprint(3 <= 3)`,
      },
      {
        t: 'text',
        md: `## More than two paths

\`elif\` (short for "else if") lets you test several possibilities in order. Python takes the **first** branch that is true and skips the rest.`,
      },
      {
        t: 'code',
        run: true,
        code: `score = 73\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\n\nprint(f"Score {score} earns a {grade}")`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Order matters enormously',
        md: `Because Python stops at the first true branch, \`score >= 70\` sitting at the top would catch a score of 95 and wrongly award a C.

Rule of thumb: for overlapping ranges, go from **most specific to least specific** — highest threshold first.`,
      },
      {
        t: 'text',
        md: `## Combining conditions

- \`and\` — both must be true
- \`or\` — at least one must be true
- \`not\` — flips it`,
      },
      {
        t: 'code',
        run: true,
        code: `age = 20\nhas_ticket = True\n\nif age >= 18 and has_ticket:\n    print("Come in")\n\nif not has_ticket:\n    print("You need a ticket")\n\nday = "Sunday"\nif day == "Saturday" or day == "Sunday":\n    print("Weekend")`,
      },
      {
        t: 'try',
        prompt: `Write \`ticket_price(age)\` returning how much someone pays:

- under 5 → \`0\` (free)
- under 18 → \`8\`
- 65 and over → \`10\`
- everyone else → \`15\`

Watch the order of your branches.`,
        starter: `def ticket_price(age):\n    pass\n`,
        solution: `def ticket_price(age):\n    if age < 5:\n        return 0\n    elif age < 18:\n        return 8\n    elif age >= 65:\n        return 10\n    else:\n        return 15\n`,
        hints: [
          'Check the youngest case first, or under-5s will be caught by the under-18 branch.',
          'You can return directly from inside each branch — no need for a variable.',
          'The order that works: < 5, then < 18, then >= 65, then else.',
        ],
        cases: [
          { name: 'toddler is free', call: 'ticket_price(3)', expect: '0' },
          { name: 'child', call: 'ticket_price(12)', expect: '8' },
          { name: 'adult', call: 'ticket_price(30)', expect: '15' },
          { name: 'pensioner', call: 'ticket_price(70)', expect: '10' },
          { name: 'exactly 18 is an adult', call: 'ticket_price(18)', expect: '15' },
          { name: 'exactly 5 is a child', call: 'ticket_price(5)', expect: '8' },
        ],
      },
      {
        t: 'quiz',
        q: 'Why does putting `elif score >= 70` before `elif score >= 90` break the grading?',
        options: [
          'Python requires conditions in ascending order',
          'A score of 95 satisfies `>= 70` first, so it takes that branch and never reaches the 90 check',
          '`elif` can only be used once per if-statement',
          'It does not break anything',
        ],
        answer: 1,
        why: 'Python takes the first branch that is true and skips the rest entirely, so a broader condition placed earlier will swallow cases meant for a later, narrower one.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `categorise(score)` returning `\"pass\"` if score >= 50, else `\"fail\"`. Use a **conditional expression** (ternary): `\"pass\" if condition else \"fail\"`.\n\nDo NOT use a full if/else block.",
            "starter": "def categorise(score):\n    pass\n",
            "solution": "def categorise(score):\n    return \"pass\" if score >= 50 else \"fail\"\n",
            "hints": [
                  "The syntax: value_if_true if condition else value_if_false.",
                  "Return the expression directly.",
                  "No colon, no indented block."
            ],
            "cases": [
                  {
                        "name": "pass",
                        "call": "categorise(75)",
                        "expect": "\"pass\""
                  },
                  {
                        "name": "fail",
                        "call": "categorise(30)",
                        "expect": "\"fail\""
                  },
                  {
                        "name": "boundary",
                        "call": "categorise(50)",
                        "expect": "\"pass\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 6 */
  {
    id: 'py-l6',
    topic: 'control-flow',
    title: 'Doing Things Repeatedly',
    difficulty: 'beginner',
    minutes: 14,
    summary: 'for loops, while loops, range, and how to stop early without getting stuck.',
    objectives: [
      'Repeat work with a for loop',
      'Use range to count',
      'Use a while loop and avoid infinite ones',
    ],
    blocks: [
      {
        t: 'text',
        md: `Computers are extraordinarily good at doing the same thing many times without getting bored. A **loop** is how you ask.

The \`for\` loop means: *"for each item in this collection, do the following"*.`,
      },
      {
        t: 'code',
        run: true,
        code: `for fruit in ["apple", "banana", "cherry"]:\n    print(f"I like {fruit}")\n\nprint("Done")`,
      },
      {
        t: 'text',
        md: `\`fruit\` is a name **you** choose. On the first pass it points at \`"apple"\`, then \`"banana"\`, then \`"cherry"\`. Then the loop ends and \`print("Done")\` runs once — because it is not indented, so it is not part of the loop.

Strings are collections of characters, so you can loop over one directly.`,
      },
      {
        t: 'code',
        run: true,
        code: `for letter in "cat":\n    print(letter)`,
      },
      {
        t: 'text',
        md: `## Counting with range

To repeat a fixed number of times, use \`range\`.

- \`range(5)\` → 0, 1, 2, 3, 4 *(five numbers, starting at zero)*
- \`range(2, 6)\` → 2, 3, 4, 5 *(from 2, up to but not including 6)*
- \`range(0, 10, 2)\` → 0, 2, 4, 6, 8 *(in steps of 2)*

Same rule as slicing: the end is **excluded**.`,
      },
      {
        t: 'code',
        run: true,
        code: `for i in range(5):\n    print(i)\n\nprint("---")\n\ntotal = 0\nfor n in range(1, 101):\n    total = total + n\nprint("1 to 100 adds up to", total)`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'The accumulator pattern',
        md: `That second example is a pattern you will use forever:

1. set up an empty result **before** the loop (\`total = 0\`)
2. update it **inside** the loop
3. use it **after** the loop

Get the setup line in the wrong place — inside the loop — and it resets every pass. That is a classic bug worth recognising early.`,
      },
      {
        t: 'text',
        md: `## while: repeat until something changes

A \`for\` loop runs a known number of times. A \`while\` loop runs **as long as a condition stays true**.`,
      },
      {
        t: 'code',
        run: true,
        code: `countdown = 3\n\nwhile countdown > 0:\n    print(countdown)\n    countdown = countdown - 1\n\nprint("Lift off!")`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'The infinite loop',
        md: `If nothing inside the loop ever makes the condition false, it runs forever and your program hangs.

Delete the \`countdown = countdown - 1\` line above and it prints \`3\` until the end of time.

**Whenever you write \`while\`, immediately ask: what makes this stop?**`,
      },
      {
        t: 'text',
        md: `## Stopping early

- \`break\` — leave the loop right now
- \`continue\` — skip to the next pass`,
      },
      {
        t: 'code',
        run: true,
        code: `for n in range(1, 20):\n    if n % 7 == 0:\n        print(f"{n} is the first multiple of 7")\n        break\n\nfor n in range(1, 11):\n    if n % 2 == 0:\n        continue      # skip evens\n    print(n, end=" ")`,
      },
      {
        t: 'try',
        prompt: `Write \`count_vowels(text)\` that returns how many vowels are in a piece of text.

Count \`a e i o u\` in either case. \`count_vowels("Hello World")\` → \`3\`.

The shape: start a counter at zero, loop over each character, and add one when it is a vowel. Checking \`if letter.lower() in "aeiou"\` handles both cases at once — \`in\` asks "does this appear inside that?".`,
        starter: `def count_vowels(text):\n    pass\n`,
        solution: `def count_vowels(text):\n    count = 0\n    for letter in text:\n        if letter.lower() in "aeiou":\n            count = count + 1\n    return count\n`,
        hints: [
          'count = 0 goes before the loop, not inside it.',
          'Loop with: for letter in text:',
          'Inside the if, use count = count + 1 (or the shorthand count += 1).',
        ],
        cases: [
          { name: 'Hello World', call: 'count_vowels("Hello World")', expect: '3' },
          { name: 'handles capitals', call: 'count_vowels("AEIOU")', expect: '5' },
          { name: 'no vowels', call: 'count_vowels("rhythm")', expect: '0' },
          { name: 'empty text', call: 'count_vowels("")', expect: '0' },
        ],
      },
      {
        t: 'quiz',
        q: 'How many numbers does `range(2, 8)` produce?',
        options: ['8', '7', '6', '5'],
        answer: 2,
        why: 'It runs from 2 up to but not including 8 — that is 2, 3, 4, 5, 6, 7: six numbers. A quick trick: end minus start.',
      },
      {
        t: 'try',
        prompt: `Write \`sum_to(n)\` that returns the sum of every number from 1 up to and including \`n\`.

\`sum_to(5)\` → \`15\` (because 1 + 2 + 3 + 4 + 5)

Use a \`for\` loop with \`range\` and the accumulator pattern: start a total at 0, add each number, return the total.`,
        starter: `def sum_to(n):\n    pass\n`,
        solution: `def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n`,
        hints: [
          'Start total = 0 before the loop.',
          'Use range(1, n + 1) — remember the end is excluded.',
          'total = total + i inside the loop.',
        ],
        cases: [
          { name: 'sum to 5', call: 'sum_to(5)', expect: '15' },
          { name: 'sum to 1', call: 'sum_to(1)', expect: '1' },
          { name: 'sum to 0', call: 'sum_to(0)', expect: '0' },
        ],
      },

    ],
  },

  /* ==================================================== 7 */
  {
    id: 'py-l7',
    topic: 'data-structures',
    title: 'Lists',
    difficulty: 'beginner',
    minutes: 13,
    summary: 'Holding many values in order — adding, removing, slicing and looping.',
    objectives: [
      'Create and change lists',
      'Add and remove items',
      'Loop over a list with its positions',
    ],
    blocks: [
      {
        t: 'text',
        md: `A **list** holds many values in order, in one name. Square brackets, comma separated.`,
      },
      {
        t: 'code',
        run: true,
        code: `scores = [72, 88, 91, 65]\n\nprint(scores)\nprint(len(scores))\nprint(scores[0])\nprint(scores[-1])\nprint(scores[1:3])`,
      },
      {
        t: 'text',
        md: `Positions and slicing work exactly as they did for strings — counting from zero, end excluded.

Unlike strings, lists are **mutable**: you can change them in place.`,
      },
      {
        t: 'code',
        run: true,
        code: `scores = [72, 88, 91, 65]\n\nscores[0] = 100         # replace\nscores.append(55)       # add to the end\nscores.insert(1, 77)    # add at a position\nprint(scores)\n\nscores.remove(91)       # remove by value\nlast = scores.pop()     # remove and return the last\nprint(scores, "| popped:", last)`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Methods that change vs methods that return',
        md: `\`scores.append(5)\` changes the list and returns **nothing**.

So \`scores = scores.append(5)\` is a trap — it sets \`scores\` to \`None\` and loses your list. Call it on its own line:

\`\`\`python
scores.append(5)      # correct
\`\`\`

Contrast with \`sorted(scores)\`, which leaves the original alone and hands back a new sorted list. \`scores.sort()\` sorts in place and returns nothing. Both exist; know which you are using.`,
      },
      {
        t: 'code',
        run: true,
        code: `scores = [72, 88, 91, 65]\n\nprint(sorted(scores))   # new list, sorted\nprint(scores)           # original untouched\n\nscores.sort()           # in place\nprint(scores)\n\nprint(sum(scores), max(scores), min(scores))`,
      },
      {
        t: 'text',
        md: `## Looping with positions

Sometimes you need the position as well as the value. \`enumerate\` gives you both.`,
      },
      {
        t: 'code',
        run: true,
        code: `names = ["Ada", "Grace", "Alan"]\n\nfor name in names:\n    print(name)\n\nprint("---")\n\nfor position, name in enumerate(names):\n    print(f"{position + 1}. {name}")`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Building a list in a loop',
        md: `The accumulator pattern again, with a list instead of a number:

\`\`\`python
doubled = []
for n in [1, 2, 3]:
    doubled.append(n * 2)
\`\`\`

Python has a shorter way of writing exactly this, called a **list comprehension**:

\`\`\`python
doubled = [n * 2 for n in [1, 2, 3]]
\`\`\`

Both are fine. Write the loop version until it is second nature, then enjoy the short one.`,
      },
      {
        t: 'try',
        prompt: `Write \`above_average(scores)\` that returns a list of only the scores above the average.

\`above_average([50, 60, 70, 80])\` → average is 65 → \`[70, 80]\`

Steps:
1. work out the average: \`sum(scores) / len(scores)\`
2. build a new list of the ones that beat it
3. return an empty list if the input is empty — dividing by zero would crash

Keep the original order.`,
        starter: `def above_average(scores):\n    pass\n`,
        solution: `def above_average(scores):\n    if not scores:\n        return []\n    average = sum(scores) / len(scores)\n    result = []\n    for score in scores:\n        if score > average:\n            result.append(score)\n    return result\n`,
        hints: [
          'Guard the empty case first: if not scores: return []',
          'average = sum(scores) / len(scores)',
          'Build result = [] before the loop, then append the ones that pass.',
        ],
        cases: [
          { name: 'simple', call: 'above_average([50, 60, 70, 80])', expect: '[70, 80]' },
          { name: 'all equal keeps none', call: 'above_average([5, 5, 5])', expect: '[]' },
          { name: 'empty input', call: 'above_average([])', expect: '[]' },
          { name: 'preserves order', call: 'above_average([90, 10, 80])', expect: '[90, 80]' },
        ],
      },
      {
        t: 'quiz',
        q: 'What is `scores` after `scores = [3, 1]` then `scores = scores.append(2)`?',
        options: ['[3, 1, 2]', '[2, 3, 1]', 'None', '[3, 1]'],
        answer: 2,
        why: 'append changes the list in place and returns nothing (None). Assigning its result throws the list away and leaves the name pointing at None.',
      },

      {
            "t": "refactor",
            "prompt": "The `filter_positives` function below works correctly but is awkward — it uses an index-based loop when Python has a cleaner way. Rewrite it using a **list comprehension** that is both shorter and more readable. The function must produce the same output for the same input.",
            "starter": "def filter_positives(numbers):\n    \"\"\"Return only the positive numbers.\"\"\"\n    result = []\n    i = 0\n    while i < len(numbers):\n        if numbers[i] > 0:\n            result.append(numbers[i])\n        i = i + 1\n    return result\n",
            "solution": "def filter_positives(numbers):\n    \"\"\"Return only the positive numbers.\"\"\"\n    return [n for n in numbers if n > 0]\n",
            "hints": [
                  "A list comprehension has the form [expr for item in iterable if condition].",
                  "Iterate numbers directly — no index needed.",
                  "The condition is n > 0; the expression is just n."
            ],
            "cases": [
                  {
                        "name": "mixed",
                        "call": "filter_positives([-3, 0, 5, -1, 9])",
                        "expect": "[5, 9]"
                  },
                  {
                        "name": "all negative",
                        "call": "filter_positives([-1, -2])",
                        "expect": "[]"
                  },
                  {
                        "name": "empty",
                        "call": "filter_positives([])",
                        "expect": "[]"
                  }
            ]
      },

      {
        t: 'try',
        prompt: `Write \`safe_first(items)\` that returns the first item in a list, or \`None\` if the list is empty.

\`safe_first(["a", "b", "c"])\` → \`"a"\`\n\`safe_first([])\` → \`None\`

Check \`if not items:\` to handle the empty case, then return \`items[0]\`.`,
        starter: `def safe_first(items):\n    pass\n`,
        solution: `def safe_first(items):\n    if not items:\n        return None\n    return items[0]\n`,
        hints: [
          'Empty lists are falsy: if not items: deals with the empty case.',
          'Return items[0] after the guard — zero-indexed, first position.',
          'There is no built-in for this — and writing it teaches you guard clauses.',
        ],
        cases: [
          { name: 'has items', call: 'safe_first(["a", "b", "c"])', expect: '"a"' },
          { name: 'empty list', call: 'safe_first([])', expect: 'None' },
          { name: 'single item', call: 'safe_first([42])', expect: '42' },
        ],
      },

    ],
  },

  /* ==================================================== 8 */
  {
    id: 'py-l8',
    topic: 'data-structures',
    title: 'Dictionaries',
    difficulty: 'beginner',
    minutes: 13,
    summary: 'Looking things up by name instead of by position — the container that powers most real programs.',
    objectives: [
      'Store and retrieve key/value pairs',
      'Loop over a dictionary safely',
      'Count things with a dictionary',
    ],
    blocks: [
      {
        t: 'text',
        md: `A list finds things by **position**. A **dictionary** finds them by **name**.

If a list is a numbered row of lockers, a dictionary is a wall of labelled pigeonholes.`,
      },
      {
        t: 'code',
        run: true,
        code: `person = {\n    "name": "Ada",\n    "job": "mathematician",\n    "born": 1815,\n}\n\nprint(person["name"])\nprint(person["born"])\nprint(len(person))`,
      },
      {
        t: 'text',
        md: `Curly braces, and each entry is \`key: value\`. The **key** is what you look things up by — usually text. The **value** can be anything.

Adding and changing use the same syntax.`,
      },
      {
        t: 'code',
        run: true,
        code: `person = {"name": "Ada"}\n\nperson["job"] = "mathematician"   # add\nperson["name"] = "Ada Lovelace"   # change\nprint(person)\n\ndel person["job"]                 # remove\nprint(person)`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Asking for a key that is not there',
        md: `\`person["height"]\` on a dictionary with no \`height\` raises \`KeyError\`.

Two safe ways to ask:

\`\`\`python
if "height" in person:      # check first
    print(person["height"])

person.get("height")          # returns None instead of crashing
person.get("height", 0)       # ...or a default you choose
\`\`\`

\`.get\` with a default is the one you will reach for most.`,
      },
      {
        t: 'code',
        run: true,
        code: `person = {"name": "Ada"}\n\nprint(person.get("height"))       # None\nprint(person.get("height", 0))    # 0\nprint("name" in person)           # True`,
      },
      {
        t: 'text',
        md: `## Looping over a dictionary

\`.items()\` gives you the key and the value together — that is almost always what you want.`,
      },
      {
        t: 'code',
        run: true,
        code: `stock = {"apples": 12, "pears": 3, "plums": 0}\n\nfor item, count in stock.items():\n    print(f"{item}: {count}")\n\nprint("---")\nprint(list(stock.keys()))\nprint(list(stock.values()))`,
      },
      {
        t: 'case',
        title: 'Case study — counting words',
        md: `Counting how often each thing appears is the single most common use of a dictionary. The pattern:

- key = the thing being counted
- value = how many times it has been seen
- \`.get(word, 0) + 1\` handles "first time seen" without a special case

Read it, run it, then change the sentence and run it again.`,
        run: true,
        code: `sentence = "the cat sat on the mat the end"\n\ncounts = {}\nfor word in sentence.split():\n    counts[word] = counts.get(word, 0) + 1\n\nprint(counts)\n\n# Which word won?\nbest = max(counts, key=counts.get)\nprint(f"Most common: {best} ({counts[best]} times)")`,
      },
      {
        t: 'try',
        prompt: `Write \`tally(items)\` that counts how many times each item appears, returning a dictionary.

\`tally(["a", "b", "a"])\` → \`{"a": 2, "b": 1}\`

Use exactly the pattern from the case study above.`,
        starter: `def tally(items):\n    pass\n`,
        solution: `def tally(items):\n    counts = {}\n    for item in items:\n        counts[item] = counts.get(item, 0) + 1\n    return counts\n`,
        hints: [
          'Start with an empty dictionary: counts = {}',
          'counts.get(item, 0) gives the count so far, or 0 if this is the first time.',
          'Add one and store it back: counts[item] = counts.get(item, 0) + 1',
        ],
        cases: [
          { name: 'repeats counted', call: 'tally(["a", "b", "a"])', expect: '{"a": 2, "b": 1}' },
          { name: 'all unique', call: 'tally(["x", "y"])', expect: '{"x": 1, "y": 1}' },
          { name: 'empty list', call: 'tally([])', expect: '{}' },
          { name: 'works with numbers', call: 'tally([1, 1, 1])', expect: '{1: 3}' },
        ],
      },
      {
        t: 'quiz',
        q: 'Why is `counts.get(word, 0) + 1` better than `counts[word] + 1` when counting?',
        options: [
          'It is faster',
          'The first time a word is seen it has no entry, and `counts[word]` would raise a KeyError',
          'They are identical',
          '`.get` sorts the dictionary',
        ],
        answer: 1,
        why: 'On the first sighting there is nothing stored yet. .get supplies a default of 0 so the very first increment works, removing the need for a separate "if this key exists" branch.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `invert_dict(d)` that swaps keys and values. Assume values are unique.\n\n`invert_dict({\"a\": 1, \"b\": 2})` → `{1: \"a\", 2: \"b\"}`\n\nUse a dictionary comprehension or a loop.",
            "starter": "def invert_dict(d):\n    pass\n",
            "solution": "def invert_dict(d):\n    return {value: key for key, value in d.items()}\n",
            "hints": [
                  "Iterate with d.items() to get (key, value) pairs.",
                  "Build a dict comprehension: {value: key for key, value in d.items()}.",
                  "Return the comprehension directly."
            ],
            "cases": [
                  {
                        "name": "two pairs",
                        "call": "invert_dict({\"a\": 1, \"b\": 2})",
                        "expect": "{1: \"a\", 2: \"b\"}"
                  },
                  {
                        "name": "empty",
                        "call": "invert_dict({})",
                        "expect": "{}"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 9 */
  {
    id: 'py-l9',
    topic: 'functions',
    title: 'Functions',
    difficulty: 'intermediate',
    minutes: 14,
    summary: 'Packaging work under a name — parameters, return values, defaults and why globals bite.',
    objectives: [
      'Write functions that take arguments and return values',
      'Understand the difference between print and return',
      'Give parameters sensible defaults',
    ],
    blocks: [
      {
        t: 'text',
        md: `You have been writing functions since lesson one. Time to understand them properly.

A function is **a named piece of work you can run whenever you like**. It stops you repeating yourself, and it lets you name an idea.`,
      },
      {
        t: 'code',
        run: true,
        code: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Ada"))\nprint(greet("Grace"))`,
      },
      {
        t: 'text',
        md: `- \`def\` starts the definition
- \`greet\` is the name you choose
- \`name\` in the brackets is a **parameter** — a placeholder filled in when the function is called
- the indented body is the work
- \`return\` hands a value back

Defining a function runs **nothing**. It is a recipe card. \`greet("Ada")\` is what actually cooks.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'return vs print — the distinction that matters most',
        md: `\`print\` **shows a human** a value. \`return\` **gives your program back** a value.

\`\`\`python
def add_printing(a, b):
    print(a + b)

def add_returning(a, b):
    return a + b

x = add_printing(2, 3)     # prints 5, but x is None
y = add_returning(2, 3)    # prints nothing, but y is 5
total = add_returning(2, 3) * 10   # 50 — you can keep working with it
\`\`\`

A function that only prints is a dead end: nothing else in your program can use its answer. **Return the value; print it at the edge.**`,
      },
      {
        t: 'code',
        run: true,
        code: `def add_printing(a, b):\n    print(a + b)\n\ndef add_returning(a, b):\n    return a + b\n\nx = add_printing(2, 3)\ny = add_returning(2, 3)\n\nprint("x is", x)\nprint("y is", y)\nprint("and y can be reused:", y * 10)`,
      },
      {
        t: 'text',
        md: `## Several parameters, and defaults

Give a parameter a default and callers may leave it out.`,
      },
      {
        t: 'code',
        run: true,
        code: `def introduce(name, greeting="Hello", excited=False):\n    line = f"{greeting}, {name}"\n    if excited:\n        line = line + "!"\n    return line\n\nprint(introduce("Ada"))\nprint(introduce("Ada", "Good evening"))\nprint(introduce("Ada", excited=True))`,
      },
      {
        t: 'text',
        md: `Naming the argument at the call site (\`excited=True\`) lets you skip over the middle one, and makes the call far easier to read. \`introduce("Ada", "Hi", True)\` tells the reader nothing about what \`True\` means.

**Parameters with defaults must come after those without.**`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Docstrings',
        md: `A string on the first line of a function is its **docstring** — the explanation of what it does.

\`\`\`python
def seconds_to_clock(total):
    """Turn a number of seconds into a 'Xm Ys' label."""
    ...
\`\`\`

It is not decoration: \`help(seconds_to_clock)\` prints it, editors show it on hover, and the grader on this platform gives you marks for it. Write one for anything non-obvious.`,
      },
      {
        t: 'text',
        md: `## Variables inside stay inside

A name created inside a function exists only there. This is **scope**, and it is a feature — it means you can name something \`total\` in twenty different functions without them interfering.`,
      },
      {
        t: 'code',
        run: true,
        code: `def calculate():\n    secret = 42\n    return secret\n\nprint(calculate())\n\ntry:\n    print(secret)\nexcept NameError as error:\n    print("Outside the function:", error)`,
      },
      {
        t: 'try',
        prompt: `Write \`apply_discount(price, percent=10)\` that takes money off a price.

- returns the new price, rounded to 2 decimal places with \`round(value, 2)\`
- \`percent\` defaults to 10
- a negative percent, or one over 100, should raise \`ValueError\`

To raise an error deliberately:

\`\`\`python
raise ValueError("percent must be between 0 and 100")
\`\`\`

Give it a docstring too — this platform's grader rewards it.`,
        starter: `def apply_discount(price, percent=10):\n    pass\n`,
        solution: `def apply_discount(price, percent=10):\n    """Return price with percent taken off, rounded to 2dp."""\n    if percent < 0 or percent > 100:\n        raise ValueError("percent must be between 0 and 100")\n    return round(price * (100 - percent) / 100, 2)\n`,
        hints: [
          'Validate first: if percent < 0 or percent > 100: raise ValueError(...)',
          'The remaining fraction is (100 - percent) / 100.',
          'Wrap the whole calculation in round(..., 2).',
        ],
        cases: [
          { name: 'default 10% off', call: 'apply_discount(100)', expect: '90.0' },
          { name: 'explicit 25% off', call: 'apply_discount(80, 25)', expect: '60.0' },
          { name: 'zero percent changes nothing', call: 'apply_discount(19.99, 0)', expect: '19.99' },
          { name: 'rounds to 2dp', call: 'apply_discount(9.99, 33)', expect: '6.69' },
          { name: 'rejects negative', call: '__raises(lambda: apply_discount(10, -5), ValueError)', expect: 'True' },
          { name: 'rejects over 100', call: '__raises(lambda: apply_discount(10, 150), ValueError)', expect: 'True' },
        ],
      },
      {
        t: 'quiz',
        q: 'A function ends with `print(result)` instead of `return result`. What breaks?',
        options: [
          'Nothing, they are equivalent',
          'The value is shown but callers receive None, so the result cannot be stored or reused',
          'The function runs twice',
          'It causes a SyntaxError',
        ],
        answer: 1,
        why: 'print sends text to the screen and hands back None. Any caller trying to store, combine or test the result gets None instead of the answer.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `apply_twice(fn, value)` that calls `fn` on `value` twice and returns the result.\n\n`apply_twice(lambda x: x * 2, 5)` → 5 * 2 * 2 = `20`\n\nThis is a higher-order function — it takes a function as an argument.",
            "starter": "def apply_twice(fn, value):\n    pass\n",
            "solution": "def apply_twice(fn, value):\n    return fn(fn(value))\n",
            "hints": [
                  "Call fn(value) first, then fn on the result.",
                  "One line: return fn(fn(value)).",
                  "fn can be any callable — the function does not care."
            ],
            "cases": [
                  {
                        "name": "double twice",
                        "call": "apply_twice(lambda x: x * 2, 5)",
                        "expect": "20"
                  },
                  {
                        "name": "add one twice",
                        "call": "apply_twice(lambda x: x + 1, 0)",
                        "expect": "2"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 10 */
  {
    id: 'py-l10',
    topic: 'error-handling',
    title: 'When Things Go Wrong',
    difficulty: 'intermediate',
    minutes: 12,
    summary: 'Reading tracebacks, catching exceptions, and failing usefully instead of crashing.',
    objectives: [
      'Read a traceback to find the real problem',
      'Catch specific exceptions with try/except',
      'Decide when to catch and when to let it crash',
    ],
    blocks: [
      {
        t: 'text',
        md: `Things go wrong. Files are missing, users type letters where numbers belong, lists come back empty. Handling that gracefully is what separates a script from a program.

When Python hits something it cannot do, it **raises an exception** and prints a **traceback**.`,
      },
      {
        t: 'code',
        run: true,
        code: `def average(numbers):\n    return sum(numbers) / len(numbers)\n\nprint(average([1, 2, 3]))\nprint(average([]))`,
      },
      {
        t: 'text',
        md: `The traceback reads like a trail of breadcrumbs:

\`\`\`
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    print(average([]))
  File "main.py", line 2, in average
    return sum(numbers) / len(numbers)
ZeroDivisionError: division by zero
\`\`\`

**Read the last line first** — it tells you what went wrong. Then read the trail *upwards* to see how you got there: line 5 called \`average\`, which broke on line 2.

The name of the exception is a real clue:

| Exception | Usually means |
|---|---|
| \`NameError\` | typo, or used before defined |
| \`TypeError\` | wrong kind of value (e.g. \`"3" + 3\`) |
| \`ValueError\` | right kind, impossible value (e.g. \`int("abc")\`) |
| \`IndexError\` | list position that does not exist |
| \`KeyError\` | dictionary key that does not exist |
| \`ZeroDivisionError\` | divided by zero |`,
      },
      {
        t: 'text',
        md: `## Catching it

\`try\` / \`except\` lets you attempt something risky and decide what to do if it fails.`,
      },
      {
        t: 'code',
        run: true,
        code: `def safe_average(numbers):\n    try:\n        return sum(numbers) / len(numbers)\n    except ZeroDivisionError:\n        return 0\n\nprint(safe_average([1, 2, 3]))\nprint(safe_average([]))`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Never catch everything',
        md: `\`\`\`python
try:
    do_something()
except:            # <- catches absolutely everything
    pass           # <- and silently ignores it
\`\`\`

This is the single worst pattern in beginner Python. It hides typos, swallows genuine bugs, and turns a crash you could have fixed in two minutes into a mystery that wastes an afternoon.

**Catch the specific exception you expect, and only that one.** If you did not expect it, you want the crash — it is information.`,
      },
      {
        t: 'text',
        md: `A very common real use: turning user input into a number.`,
      },
      {
        t: 'code',
        run: true,
        code: `def to_int(text, fallback=0):\n    """Convert text to an int, or return fallback if impossible."""\n    try:\n        return int(text)\n    except ValueError:\n        return fallback\n\nprint(to_int("42"))\nprint(to_int("banana"))\nprint(to_int("banana", -1))`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Catch, or let it crash?',
        md: `Ask: **can this code sensibly carry on?**

- A user typed "banana" into an age box → yes, ask again. Catch it.
- The config file your program needs is missing → no. Let it crash loudly, with a clear message. A program that limps on in a broken state does far more damage than one that stops.

Catching an exception is a promise that you can handle it. Do not make that promise lightly.`,
      },
      {
        t: 'try',
        prompt: `Write \`safe_divide(a, b)\`:

- normally returns \`a / b\`
- if \`b\` is zero, return the text \`"undefined"\` instead of crashing
- if either value is not a number, return the text \`"invalid"\`

Dividing a string will raise \`TypeError\`; dividing by zero raises \`ZeroDivisionError\`. Catch each separately — you can stack \`except\` blocks.`,
        starter: `def safe_divide(a, b):\n    pass\n`,
        solution: `def safe_divide(a, b):\n    """Divide a by b, reporting the two failure modes as text."""\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "undefined"\n    except TypeError:\n        return "invalid"\n`,
        hints: [
          'Put the normal case in the try block: return a / b',
          'Add two except blocks, one per exception type.',
          'Order does not matter here — the two exceptions cannot both apply.',
        ],
        cases: [
          { name: 'normal division', call: 'safe_divide(10, 4)', expect: '2.5' },
          { name: 'divide by zero', call: 'safe_divide(1, 0)', expect: '"undefined"' },
          { name: 'text input', call: 'safe_divide("ten", 2)', expect: '"invalid"' },
          { name: 'negative numbers still work', call: 'safe_divide(-9, 3)', expect: '-3.0' },
          { name: 'zero numerator is fine', call: 'safe_divide(0, 5)', expect: '0.0' },
        ],
      },
      {
        t: 'quiz',
        q: 'Which line of a traceback should you read first?',
        options: [
          'The first line, "Traceback (most recent call last)"',
          'The last line, with the exception type and message',
          'The middle, where the file names are',
          'It does not matter',
        ],
        answer: 1,
        why: 'The last line names what actually went wrong. The lines above are the path your program took to get there, useful once you know what you are looking for.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `parse_int_safely(text)` that converts `text` to an integer. If it fails, return a tuple `(False, error_message)`. If it succeeds, return `(True, number)`.\n\nUse try/except ValueError. This is the \"either pattern\" — returning a success/failure wrapper instead of crashing.",
            "starter": "def parse_int_safely(text):\n    pass\n",
            "solution": "def parse_int_safely(text):\n    try:\n        return (True, int(text))\n    except ValueError:\n        return (False, f\"Cannot convert '{text}' to int\")\n",
            "hints": [
                  "Try int(text) in a try block.",
                  "On success return (True, int(text)).",
                  "On ValueError return (False, \"Cannot convert ...\")."
            ],
            "cases": [
                  {
                        "name": "valid number",
                        "call": "parse_int_safely(\"42\")",
                        "expect": "(True, 42)"
                  },
                  {
                        "name": "invalid",
                        "call": "parse_int_safely(\"abc\")",
                        "expect": "(False, \"Cannot convert 'abc' to int\")"
                  }
            ]
      },

      {
            "t": "debug",
            "prompt": "The `safe_int` function below has a bug — it crashes instead of returning the fallback when given certain inputs. Find and fix it.\n\nHint: there is a line of code that runs BEFORE the error can be caught.",
            "starter": "def safe_int(text, fallback=0):\n    \"\"\"Convert text to an integer safely.\"\"\"\n    print(\"converting\", text)   # bug: print before validation\n    try:\n        return int(text)\n    except ValueError:\n        return fallback\n",
            "solution": "def safe_int(text, fallback=0):\n    \"\"\"Convert text to an integer safely.\"\"\"\n    try:\n        return int(text)\n    except (ValueError, TypeError):\n        return fallback\n",
            "bug_description": "The code prints the text before the try block. More critically, it does not catch `TypeError` — passing `None` or a list will crash. The fix: remove the print (it was debug leftover) and add `TypeError` to the except clause.",
            "hints": [
                  "The print() is a red herring — remove it.",
                  "int(None) raises TypeError, not ValueError.",
                  "Change `except ValueError` to `except (ValueError, TypeError)`."
            ],
            "cases": [
                  {
                        "name": "valid number",
                        "call": "safe_int(\"42\")",
                        "expect": "42"
                  },
                  {
                        "name": "bad text",
                        "call": "safe_int(\"banana\")",
                        "expect": "0"
                  },
                  {
                        "name": "None input",
                        "call": "safe_int(None, -1)",
                        "expect": "-1"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 11 */
  {
    id: 'py-l11',
    topic: 'functions',
    title: 'Case Study: Build an Expense Tracker',
    difficulty: 'intermediate',
    minutes: 20,
    summary: 'Everything so far, assembled into one small working program — the way real code gets built.',
    objectives: [
      'Combine lists, dictionaries, loops and functions',
      'Break a problem into small functions',
      'Build up a program in testable pieces',
    ],
    blocks: [
      {
        t: 'text',
        md: `Time to build something. Small, but complete and genuinely useful — the kind of thing you would actually write.

**The brief:** track expenses. Each expense has a description, an amount and a category. We want totals, a breakdown by category, and the biggest single spend.

We will build it the way experienced developers do: **one small function at a time, each tested before moving on**. Not all at once, hoping.`,
      },
      {
        t: 'text',
        md: `## Step 1 — decide on the shape of the data

Before writing any logic, decide how the information will be stored. Get this wrong and everything downstream is painful.

An expense has three pieces that belong together → a **dictionary**. Many expenses in order → a **list of dictionaries**.

This is the single most common data shape in programming. Learn to recognise it.`,
      },
      {
        t: 'code',
        run: true,
        code: `expenses = [\n    {"what": "Coffee",   "amount": 3.50, "category": "food"},\n    {"what": "Bus fare", "amount": 2.40, "category": "transport"},\n    {"what": "Lunch",    "amount": 8.75, "category": "food"},\n    {"what": "Notebook", "amount": 4.20, "category": "supplies"},\n]\n\nprint(f"{len(expenses)} expenses recorded")\nprint(expenses[0])\nprint(expenses[0]["what"])`,
      },
      {
        t: 'text',
        md: `## Step 2 — the total

Accumulator pattern: start at zero, add each amount.`,
      },
      {
        t: 'code',
        run: true,
        code: `expenses = [\n    {"what": "Coffee",   "amount": 3.50, "category": "food"},\n    {"what": "Bus fare", "amount": 2.40, "category": "transport"},\n    {"what": "Lunch",    "amount": 8.75, "category": "food"},\n]\n\ndef total_spent(expenses):\n    """Add up every expense amount."""\n    total = 0\n    for expense in expenses:\n        total = total + expense["amount"]\n    return round(total, 2)\n\nprint(total_spent(expenses))\nprint(total_spent([]))     # always check the empty case`,
      },
      {
        t: 'text',
        md: `## Step 3 — the breakdown by category

A dictionary again, exactly like word counting — except we add the **amount** rather than 1.`,
      },
      {
        t: 'code',
        run: true,
        code: `expenses = [\n    {"what": "Coffee",   "amount": 3.50, "category": "food"},\n    {"what": "Bus fare", "amount": 2.40, "category": "transport"},\n    {"what": "Lunch",    "amount": 8.75, "category": "food"},\n]\n\ndef by_category(expenses):\n    """Total spend per category."""\n    totals = {}\n    for expense in expenses:\n        category = expense["category"]\n        totals[category] = round(totals.get(category, 0) + expense["amount"], 2)\n    return totals\n\nprint(by_category(expenses))`,
      },
      {
        t: 'text',
        md: `## Step 4 — the biggest spend

\`max\` can compare dictionaries if you tell it *what* to compare on, using \`key=\`.`,
      },
      {
        t: 'code',
        run: true,
        code: `expenses = [\n    {"what": "Coffee",   "amount": 3.50, "category": "food"},\n    {"what": "Lunch",    "amount": 8.75, "category": "food"},\n]\n\ndef biggest(expenses):\n    """The single largest expense, or None if there are none."""\n    if not expenses:\n        return None\n    return max(expenses, key=lambda expense: expense["amount"])\n\nprint(biggest(expenses))\nprint(biggest([]))`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'What is that `lambda`?',
        md: `\`lambda expense: expense["amount"]\` is a tiny throwaway function: *"given an expense, hand me its amount"*.

\`max\` calls it on every item and compares the answers. It is the same as writing:

\`\`\`python
def get_amount(expense):
    return expense["amount"]

max(expenses, key=get_amount)
\`\`\`

\`lambda\` just saves naming something you will use once.`,
      },
      {
        t: 'case',
        title: 'Step 5 — the whole thing',
        md: `Four small functions, each doing one job, assembled into a report. Notice that \`build_report\` contains no logic of its own — it just arranges the pieces. That is what good structure looks like.

Change the expense list and run it again.`,
        run: true,
        code: `expenses = [\n    {"what": "Coffee",   "amount": 3.50, "category": "food"},\n    {"what": "Bus fare", "amount": 2.40, "category": "transport"},\n    {"what": "Lunch",    "amount": 8.75, "category": "food"},\n    {"what": "Notebook", "amount": 4.20, "category": "supplies"},\n    {"what": "Taxi",     "amount": 12.00, "category": "transport"},\n]\n\n\ndef total_spent(expenses):\n    """Add up every expense amount."""\n    return round(sum(e["amount"] for e in expenses), 2)\n\n\ndef by_category(expenses):\n    """Total spend per category."""\n    totals = {}\n    for expense in expenses:\n        category = expense["category"]\n        totals[category] = round(totals.get(category, 0) + expense["amount"], 2)\n    return totals\n\n\ndef biggest(expenses):\n    """The single largest expense, or None if there are none."""\n    if not expenses:\n        return None\n    return max(expenses, key=lambda e: e["amount"])\n\n\ndef build_report(expenses):\n    """Arrange the pieces into a printable report."""\n    lines = ["EXPENSE REPORT", "=" * 30]\n\n    for expense in expenses:\n        lines.append(f"{expense['what']:<12} {expense['amount']:>7.2f}  {expense['category']}")\n\n    lines.append("-" * 30)\n    lines.append(f"{'TOTAL':<12} {total_spent(expenses):>7.2f}")\n    lines.append("")\n    lines.append("By category:")\n\n    for category, amount in sorted(by_category(expenses).items()):\n        lines.append(f"  {category:<10} {amount:>7.2f}")\n\n    top = biggest(expenses)\n    if top:\n        lines.append("")\n        lines.append(f"Largest single spend: {top['what']} ({top['amount']:.2f})")\n\n    return "\\n".join(lines)\n\n\nprint(build_report(expenses))`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'What to take from this',
        md: `Look back at what we did — the process matters more than the program:

1. **Decided the data shape first.** Everything else followed from "a list of dictionaries".
2. **Built one small function at a time**, running each immediately.
3. **Checked the empty case every time.** Empty input is where beginner code dies.
4. **Kept each function to one job.** \`total_spent\` totals; it does not print, format or sort.
5. **Assembled at the end.** \`build_report\` is just glue.

This scales. A program with a hundred functions is built exactly the same way — one at a time, each verified.`,
      },
      {
        t: 'try',
        prompt: `Add one more piece to the tracker.

Write \`over_budget(expenses, limit)\` returning a list of the **descriptions** of every expense above \`limit\`, in the order they appear.

\`\`\`python
expenses = [
    {"what": "Coffee", "amount": 3.5,  "category": "food"},
    {"what": "Taxi",   "amount": 12.0, "category": "transport"},
]
over_budget(expenses, 5)   # ["Taxi"]
\`\`\`

Return just the text, not the whole dictionary.`,
        starter: `def over_budget(expenses, limit):\n    pass\n`,
        solution: `def over_budget(expenses, limit):\n    """Descriptions of every expense above limit, in order."""\n    result = []\n    for expense in expenses:\n        if expense["amount"] > limit:\n            result.append(expense["what"])\n    return result\n`,
        hints: [
          'Loop over the expenses and test expense["amount"] > limit.',
          'Append expense["what"], not the whole dictionary.',
          'Strictly greater than — an expense exactly equal to the limit is not over it.',
        ],
        cases: [
          {
            name: 'finds the expensive one',
            call: 'over_budget([{"what": "Coffee", "amount": 3.5, "category": "food"}, {"what": "Taxi", "amount": 12.0, "category": "transport"}], 5)',
            expect: '["Taxi"]',
          },
          {
            name: 'keeps original order',
            call: 'over_budget([{"what": "A", "amount": 9.0, "category": "x"}, {"what": "B", "amount": 1.0, "category": "x"}, {"what": "C", "amount": 8.0, "category": "x"}], 5)',
            expect: '["A", "C"]',
          },
          { name: 'nothing over budget', call: 'over_budget([{"what": "A", "amount": 1.0, "category": "x"}], 5)', expect: '[]' },
          { name: 'empty list', call: 'over_budget([], 5)', expect: '[]' },
          {
            name: 'exactly at the limit is not over',
            call: 'over_budget([{"what": "A", "amount": 5.0, "category": "x"}], 5)',
            expect: '[]',
          },
        ],
      },
      {
        t: 'text',
        md: `## Where you are now

You can store data, transform it, make decisions, repeat work, package it into functions and handle failure. That is the whole foundation — genuinely.

Everything ahead is either a **new tool** (classes, files, modules, async) or a **sharper way** of doing what you can already do.

The **Challenges** for this track are next. They are graded on a four-part rubric rather than pass/fail, and they will push you on efficiency and style as well as correctness. Start with the Foundations tier — you are ready for it.`,
      },
      {
        t: 'try',
        prompt: `Add one more helper to the tracker: \`total_for_category(expenses, category)\` that returns the total spend for just one category.

\`\`\`python
expenses = [
    {"what": "Coffee", "amount": 3.50, "category": "food"},
    {"what": "Taxi",   "amount": 12.0, "category": "transport"},
    {"what": "Lunch",  "amount": 8.75, "category": "food"},
]
total_for_category(expenses, "food")   # 12.25
\`\`\`

Loop over the expenses, check \`expense["category"] == category\`, and add the amount.`,
        starter: `def total_for_category(expenses, category):\n    pass\n`,
        solution: `def total_for_category(expenses, category):\n    total = 0\n    for expense in expenses:\n        if expense["category"] == category:\n            total = total + expense["amount"]\n    return round(total, 2)\n`,
        hints: [
          'Accumulator pattern: total = 0 before the loop.',
          'Compare expense["category"] to the category parameter.',
          'Round the final answer to 2 decimal places — money.',
        ],
        cases: [
          {
            name: 'food spend',
            call: 'total_for_category([{"what": "Coffee", "amount": 3.50, "category": "food"}, {"what": "Taxi", "amount": 12.0, "category": "transport"}, {"what": "Lunch", "amount": 8.75, "category": "food"}], "food")',
            expect: '12.25',
          },
          {
            name: 'category not present',
            call: 'total_for_category([{"what": "Coffee", "amount": 3.50, "category": "food"}], "transport")',
            expect: '0',
          },
          { name: 'empty list', call: 'total_for_category([], "food")', expect: '0' },
        ],
      },

    ],
  },

  /* ==================================================== 12 */
  {
    id: 'py-l12',
    topic: 'getting-started',
    difficulty: 'intermediate',
    title: 'Scripts, Input and the Shell',
    minutes: 12,
    summary: 'Turning your code into a reusable script — command-line arguments, user input, and running from a terminal.',
    objectives: [
      'Accept input from the user with input()',
      'Read command-line arguments with sys.argv',
      'Structure a script with a main() guard',
    ],
    blocks: [
      {
        t: 'text',
        md: `So far every example has been self-contained — values hard-coded at the top. Real scripts take input from the outside: a person typing, or arguments passed on the command line.

\`input()\` pauses your program and waits for the user to type something and press Enter. It always hands you back a string.`,
      },
      { t: 'code', run: true, code: `name = input("What is your name? ")\nprint(f"Hello, {name}!")` },
      {
        t: 'text',
        md: `## Command-line arguments

When you run a script from a terminal — \`python myscript.py hello 42\` — Python stores those extra words in \`sys.argv\`. The first entry is always the script name; the rest are whatever you passed.`,
      },
      { t: 'code', run: true, code: `import sys\n\nprint("Script:", sys.argv[0])\nif len(sys.argv) > 1:\n    print("Arguments:", sys.argv[1:])\nelse:\n    print("No arguments passed")` },
      {
        t: 'text',
        md: `## The \`main\` guard

When you import a file, Python runs it top to bottom. That is a problem if the file contains code you only want to run when it is the **entry point** — not when someone imports it.

The guard is this two-line pattern you will see in almost every Python file:`,
      },
      { t: 'code', run: true, code: `def main():\n    print("This only runs when executed directly")\n\nif __name__ == "__main__":\n    main()` },
      {
        t: 'case',
        title: 'Case study — a temperature converter script',
        md: `Put it together: a command-line tool that takes a temperature and a unit (\`C\` or \`F\`) and converts it.

Usage: \`python convert.py 100 C\` → \`212.0°F\`

Notice the structure: a \`main()\` that parses \`sys.argv\`, a pure function that does the maths, and a guard at the bottom. Separating the logic from the I/O means \`c_to_f\` is testable and reusable.`,
        run: true,
        code: `import sys\n\n\ndef c_to_f(celsius):\n    """Convert Celsius to Fahrenheit."""\n    return celsius * 9 / 5 + 32\n\n\ndef f_to_c(fahrenheit):\n    """Convert Fahrenheit to Celsius."""\n    return (fahrenheit - 32) * 5 / 9\n\n\ndef main():\n    if len(sys.argv) != 3:\n        print("Usage: python convert.py <temperature> <C|F>")\n        return\n    temp = float(sys.argv[1])\n    unit = sys.argv[2].upper()\n    if unit == "C":\n        print(f"{c_to_f(temp):.1f}°F")\n    elif unit == "F":\n        print(f"{f_to_c(temp):.1f}°C")\n    else:\n        print("Unit must be C or F")\n\n\nif __name__ == "__main__":\n    main()`,
      },
      {
        t: 'try',
        prompt: `Write \`greet_user()\` that:
1. asks the user for their name with \`input()\`
2. if the name is empty, returns \`"Hello, stranger!"\`
3. otherwise returns \`"Hello, <name>!"\`

Wrap the logic in the standard guard pattern — but for the exercise, just write the function body.`,
        starter: `def greet_user():\n    pass\n`,
        solution: `def greet_user():\n    name = input("What is your name? ").strip()\n    if not name:\n        return "Hello, stranger!"\n    return f"Hello, {name}!"\n`,
        hints: [
          'Use input("What is your name? ").strip() to get and clean the input.',
          'if not name: covers both empty strings and None.',
          'Return the f-string directly; no need for a variable.',
        ],
        cases: [{ name: 'returns a greeting', call: '__patch_input("Ada", greet_user)', expect: '"Hello, Ada!"' }],
      },
      {
        t: 'quiz',
        q: 'Why does almost every Python script end with `if __name__ == "__main__":`?',
        options: [
          'It is required by the language',
          'So the code only runs when the file is executed directly, not when it is imported as a module',
          'It makes the program faster',
          'It is a debugging tool with no functional effect',
        ],
        answer: 1,
        why: 'When a file is imported, __name__ is the module name, not "__main__". The guard prevents import-time side effects.',
      },
      {
        t: 'try',
        prompt: `Write \`sum_args(args)\` that takes a list of strings (like \`sys.argv[1:]\`) and returns the sum of any that are valid integers. Skip non-numeric ones silently.

\`sum_args(["10", "hello", "5"])\` → \`15\`

Loop over the list, try \`int(arg)\` inside a \`try/except ValueError\`, and add to a total.`,
        starter: `def sum_args(args):\n    pass\n`,
        solution: `def sum_args(args):\n    total = 0\n    for arg in args:\n        try:\n            total = total + int(arg)\n        except ValueError:\n            pass\n    return total\n`,
        hints: [
          'Total starts at 0, loop over args.',
          'Try int(arg) inside try/except ValueError.',
          'On success add to total; on ValueError do nothing (pass).',
        ],
        cases: [
          { name: 'mixed input', call: 'sum_args(["10", "hello", "5"])', expect: '15' },
          { name: 'all numeric', call: 'sum_args(["1", "2", "3"])', expect: '6' },
          { name: 'none numeric', call: 'sum_args(["a", "b"])', expect: '0' },
          { name: 'empty list', call: 'sum_args([])', expect: '0' },
        ],
      },

    ],
  },

  /* ==================================================== 13 */
  {
    id: 'py-l13',
    topic: 'getting-started',
    difficulty: 'advanced',
    title: 'The Python Ecosystem',
    minutes: 14,
    summary: 'Virtual environments, pip, requirements.txt, and how real projects are structured.',
    objectives: [
      'Create and activate a virtual environment',
      'Install and manage packages with pip',
      'Understand a typical project layout',
    ],
    blocks: [
      {
        t: 'text',
        md: `You can write a lot of Python with nothing but the standard library. Eventually you will want a package someone else wrote — a web framework, a data-science toolkit, a library that talks to a particular database.

Python's package manager is **pip**, and the convention for isolating project dependencies is a **virtual environment**.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Why virtual environments exist',
        md: `Without one, every project on your machine shares the same set of installed packages. Install version 2 of a library for project A, and project B — which needs version 1 — breaks.

A virtual environment gives each project its own copy of Python and its own \`site-packages\` directory. They cannot interfere because they cannot see each other.`,
      },
      {
        t: 'text',
        md: `## Creating one

\`\`\`bash
python -m venv .venv          # create it
source .venv/bin/activate      # activate (Linux/Mac)
.venv\\Scripts\\activate         # activate (Windows)
pip install requests            # install a package
pip freeze > requirements.txt   # save the list
\`\`\`

\`requirements.txt\` is the single source of truth for what your project depends on. Anyone cloning your code runs \`pip install -r requirements.txt\` and gets exactly the same set.`,
      },
      {
        t: 'case',
        title: 'Case study — a project that fetches weather data',
        md: `Suppose you want a script that prints the current temperature for a city. The hard part — talking to a weather API, handling HTTP, parsing JSON — is done by the \`requests\` library.

The structure:

\`\`\`
weather/
  .venv/              # virtual environment (never committed)
  requirements.txt    # requests==2.31.0
  weather.py          # the script
\`\`\`

The code reads the API key from an environment variable (never hard-coded — that is how keys leak onto GitHub). The \`sys.exit\` with a non-zero code is how you tell a calling script or CI pipeline that something failed.`,
        run: true,
        code: `import os\nimport sys\n\ntry:\n    import requests\nexcept ImportError:\n    print("Install requests: pip install requests")\n    sys.exit(1)\n\n\ndef get_temperature(city, api_key):\n    """Fetch current temperature for a city from OpenWeatherMap."""\n    url = "https://api.openweathermap.org/data/2.5/weather"\n    params = {"q": city, "appid": api_key, "units": "metric"}\n    response = requests.get(url, params=params, timeout=10)\n    response.raise_for_status()\n    data = response.json()\n    return data["main"]["temp"], data["weather"][0]["description"]\n\n\ndef main():\n    api_key = os.environ.get("OWM_API_KEY")\n    if not api_key:\n        print("Set OWM_API_KEY environment variable")\n        print("  Windows: set OWM_API_KEY=your-key")\n        print("  Mac/Linux: export OWM_API_KEY=your-key")\n        sys.exit(1)\n\n    city = sys.argv[1] if len(sys.argv) > 1 else "London"\n    try:\n        temp, desc = get_temperature(city, api_key)\n        print(f"{city}: {temp}°C, {desc}")\n    except requests.exceptions.RequestException as error:\n        print(f"Request failed: {error}")\n        sys.exit(1)\n\n\nif __name__ == "__main__":\n    main()`,
      },
      {
        t: 'quiz',
        q: 'Why should `requirements.txt` be checked into version control but `.venv/` should not?',
        options: [
          '`.venv/` is too large',
          '`requirements.txt` is the recipe; `.venv/` is the cooked meal — it contains platform-specific binaries and can be rebuilt from the recipe',
          'Git cannot track directories',
          'There is no reason',
        ],
        answer: 1,
        why: 'The virtual environment contains compiled binaries tied to your OS and Python version. The requirements file is a portable, human-readable list that anyone can install from.',
      },
      {
        t: 'try',
        prompt: `Write \`read_config(key, default=None)\` that reads a value from a dictionary of settings, returning \`default\` if the key is missing. Case-insensitive: \`"HOST"\` and \`"host"\` should match.

\`read_config({"host": "localhost", "port": "8080"}, "HOST")\` → \`"localhost"\`\n\`read_config({"host": "localhost"}, "DEBUG", "off")\` → \`"off"\`

The pattern is \`dict.get(key, default)\` but with a case-insensitive twist — lowercase the lookup.`,
        starter: `def read_config(settings, key, default=None):\n    pass\n`,
        solution: `def read_config(settings, key, default=None):\n    return settings.get(key.lower(), default)\n`,
        hints: [
          'Lowercase the key before looking it up: key.lower()',
          'Use .get() with the default value.',
          'One line — return the result of .get directly.',
        ],
        cases: [
          { name: 'exact match', call: 'read_config({"host": "localhost", "port": "8080"}, "host")', expect: '"localhost"' },
          { name: 'case-insensitive', call: 'read_config({"host": "localhost"}, "HOST")', expect: '"localhost"' },
          { name: 'missing returns default', call: 'read_config({"host": "localhost"}, "debug", "off")', expect: '"off"' },
          { name: 'missing returns None by default', call: 'read_config({}, "key")', expect: 'None' },
        ],
      },

    ],
  },

  /* ==================================================== 14 */
  {
    id: 'py-l14',
    topic: 'variables-and-types',
    difficulty: 'intermediate',
    title: 'Type Conversion and Truthiness',
    minutes: 13,
    summary: 'Converting between types deliberately, what counts as true and false, and the bool() built-in.',
    objectives: [
      'Convert between str, int and float safely',
      'Understand what values are truthy and falsy',
      'Use truthiness to write shorter, clearer conditions',
    ],
    blocks: [
      {
        t: 'text',
        md: `Every value in Python has an opinion about whether it is "something" or "nothing". This is called **truthiness**, and it is one of the most-used features in real Python code.`,
      },
      { t: 'code', run: true, code: `# Every value can be tested as a condition\nprint(bool(0))        # False\nprint(bool(42))       # True\nprint(bool(""))       # False\nprint(bool("hello"))  # True\nprint(bool([]))       # False\nprint(bool([1, 2]))   # True\nprint(bool(None))     # False\nprint(bool({}))       # False` },
      {
        t: 'text',
        md: `The values Python considers "empty" — and therefore \`False\` — are:
- \`0\`, \`0.0\`, \`0j\`
- \`""\` (empty string)
- \`[]\` (empty list), \`{}\` (empty dict), \`()\` (empty tuple), \`set()\`
- \`None\`

**Everything else is \`True\`.** That includes the string \`"False"\` and the number \`-1\`.`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'The guard clause pattern',
        md: `Truthiness lets you write conditions that read like English:

\`\`\`python
if not name:          # instead of: if name == "" or name is None
    return "no name"

if items:             # instead of: if len(items) > 0
    process(items)
\`\`\`

This is not a shortcut — it is the idiomatic way. Python programmers expect to see it.`,
      },
      {
        t: 'text',
        md: `## Safe type conversion

Converting between types is common when reading data — files, APIs, user input all hand you strings. \`int()\` and \`float()\` raise \`ValueError\` on bad input; wrapping them in a try/except or a validation function is the safe path.`,
      },
      { t: 'code', run: true, code: `def safe_int(text, fallback=0):\n    """Convert text to int, or return fallback."""\n    try:\n        return int(text)\n    except (ValueError, TypeError):\n        return fallback\n\nprint(safe_int("42"))\nprint(safe_int("banana"))\nprint(safe_int("banana", -1))\nprint(safe_int(None, 99))` },
      {
        t: 'case',
        title: 'Case study — cleaning survey data',
        md: `Real data is messy. A CSV export might have empty cells, stray spaces and human errors. The pattern: define a cleaning function per field, apply them in a pipeline.

This script takes a list of raw rows (list of lists, from a CSV reader) and produces clean dictionaries — stripping whitespace, converting numbers, and providing defaults. Run it, then change the \`raw\` data to include more edge cases.`,
        run: true,
        code: `raw = [\n    ["Name", "Age", "Score"],\n    ["Ada", "36", "95.5"],\n    ["Grace", "", "88.0"],\n    ["  Alan  ", "41", "not taken"],\n]\n\ndef clean_name(text):\n    return text.strip() if text else "unknown"\n\ndef clean_age(text):\n    try:\n        return int(text)\n    except (ValueError, TypeError):\n        return None\n\ndef clean_score(text):\n    try:\n        return float(text)\n    except (ValueError, TypeError):\n        return None\n\nheaders = [h.lower() for h in raw[0]]\nclean = []\nfor row in raw[1:]:\n    clean.append({\n        "name": clean_name(row[0]),\n        "age": clean_age(row[1]),\n        "score": clean_score(row[2]),\n    })\n\nfor record in clean:\n    print(record)`,
      },
      {
        t: 'try',
        prompt: `Write \`parse_line(text)\` that splits a line like \`"item:price:qty"\` into a tuple of \`(str, float, int)\`.

\`parse_line("widget:19.99:5")\` → \`("widget", 19.99, 5)\`

If any field is missing or cannot be converted, return \`None\` instead of the tuple.`,
        starter: `def parse_line(text):\n    pass\n`,
        solution: `def parse_line(text):\n    parts = text.split(":")\n    if len(parts) != 3:\n        return None\n    try:\n        return (parts[0], float(parts[1]), int(parts[2]))\n    except ValueError:\n        return None\n`,
        hints: [
          'First split on ":" and check you have three pieces.',
          'Wrap the conversions in try/except ValueError.',
          'Return None on any failure — the caller can test truthiness of the result.',
        ],
        cases: [
          { name: 'valid input', call: 'parse_line("widget:19.99:5")', expect: '("widget", 19.99, 5)' },
          { name: 'bad number', call: 'parse_line("a:b:c")', expect: 'None' },
          { name: 'too few fields', call: 'parse_line("a:1")', expect: 'None' },
          { name: 'empty string', call: 'parse_line("")', expect: 'None' },
        ],
      },
      {
        t: 'quiz',
        q: 'Why is `if items:` preferred over `if len(items) > 0:`?',
        options: [
          'It is faster',
          'Empty collections are falsy in Python, so the shorter form reads more naturally and handles None gracefully',
          '`len()` can fail',
          'There is no difference — they are identical',
        ],
        answer: 1,
        why: 'Python evaluates empty collections as False. `if items:` is idiomatic, shorter, and handles None (which is also falsy) without an extra check.',
      },
      {
        t: 'try',
        prompt: `Write \`safe_float(text, fallback=0.0)\` that converts \`text\` to a float, returning \`fallback\` if conversion fails.

\`safe_float("12.5")\` → \`12.5\`\n\`safe_float("banana")\` → \`0.0\`\n\`safe_float("banana", -1.0)\` → \`-1.0\`

Use \`try/except ValueError\` — wrap \`float(text)\` and return the fallback on failure.`,
        starter: `def safe_float(text, fallback=0.0):\n    pass\n`,
        solution: `def safe_float(text, fallback=0.0):\n    try:\n        return float(text)\n    except ValueError:\n        return fallback\n`,
        hints: [
          'try: return float(text) gets the happy path.',
          'except ValueError: return fallback handles bad input.',
          'Make sure fallback has a default of 0.0 in the signature.',
        ],
        cases: [
          { name: 'valid float', call: 'safe_float("12.5")', expect: '12.5' },
          { name: 'bad text uses default', call: 'safe_float("banana")', expect: '0.0' },
          { name: 'custom fallback', call: 'safe_float("banana", -1.0)', expect: '-1.0' },
          { name: 'integer string works', call: 'safe_float("42")', expect: '42.0' },
        ],
      },

    ],
  },

  /* ==================================================== 15 */
  {
    id: 'py-l15',
    topic: 'variables-and-types',
    difficulty: 'advanced',
    title: 'Identity, Equality and Mutability',
    minutes: 14,
    summary: '`is` vs `==`, how Python reuses small objects, and why mutability matters when you least expect it.',
    objectives: [
      'Explain the difference between `is` and `==`',
      'Predict when two variables point at the same object',
      'Avoid the mutable-default-argument trap',
    ],
    blocks: [
      {
        t: 'text',
        md: `\`==\` asks: *"do these two things have the same value?"*
\`is\` asks: *"are these two names pointing at the exact same object in memory?"*

They are different questions, and confusing them produces bugs that survive for months because they only trigger under specific conditions.`,
      },
      { t: 'code', run: true, code: `a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint("a == b:", a == b)   # True — same contents\nprint("a is b:", a is b)   # False — different objects\nprint("a is c:", a is c)   # True — same object\n\n# Small integers are cached — this surprises people\nx = 256\ny = 256\nprint("256 is 256:", x is y)   # True (CPython caches -5 to 256)\n\nx = 257\ny = 257\nprint("257 is 257:", x is y)   # Usually False (outside the cache range)` },
      {
        t: 'note',
        tone: 'warn',
        title: 'Never use `is` for value comparison',
        md: `\`is\` is for comparing against singletons: \`x is None\`, \`x is True\`, \`x is False\`. CPython happens to cache small integers and short strings, so \`is\` can appear to work in tests and then fail in production with larger values.

**Rule: \`==\` for values, \`is\` for \`None\` / \`True\` / \`False\`.**`,
      },
      {
        t: 'text',
        md: `## The mutable default argument

This is the single most common "why does my function remember things?" moment in Python.`,
      },
      { t: 'code', run: true, code: `# BUG — the default list is created ONCE, at definition time\ndef add_item(item, target=[]):\n    target.append(item)\n    return target\n\nprint(add_item(1))   # [1]\nprint(add_item(2))   # [1, 2] — the SAME list!\nprint(add_item(3))   # [1, 2, 3]\n\n# FIX — use None and create the list inside\ndef add_item_fixed(item, target=None):\n    if target is None:\n        target = []\n    target.append(item)\n    return target\n\nprint(add_item_fixed(1))    # [1]\nprint(add_item_fixed(2))    # [2] — fresh list each time` },
      {
        t: 'case',
        title: 'Case study — tracking object identity in a cache',
        md: `An in-memory cache stores expensive-to-compute results. The subtlety: when the cache returns a list, the caller might mutate it, corrupting the cached copy for everyone else.

The fix is to return a **copy** from the cache. \`id()\` gives the memory address — use it to prove that the cached original and the returned value are different objects after the fix.`,
        run: true,
        code: `cache = {}\n\ndef compute(key):\n    """Simulate an expensive operation that returns a list."""\n    if key not in cache:\n        cache[key] = [key, key * 2, key * 3]\n        print(f"  (computed {key})")\n    return cache[key]          # BUG: returns the cached list directly\n\ndef compute_safe(key):\n    """Same, but returns a copy so callers cannot corrupt the cache."""\n    if key not in cache:\n        cache[key] = [key, key * 2, key * 3]\n        print(f"  (computed {key})")\n    return list(cache[key])    # safe: returns a shallow copy\n\nprint("--- Unsafe ---")\nresult = compute(5)\nresult[0] = 999                # caller mutates the result\nprint("cache[5]:", cache[5])    # cache is now corrupted!\n\nprint("\\n--- Safe ---")\nresult = compute_safe(10)\nresult[0] = 999\nprint("cache[10]:", cache[10])  # cache is untouched\nprint("id of cached:", id(cache[10]))\nprint("id of result:", id(result))`,
      },
      {
        t: 'try',
        prompt: `Write \`append_unique(items, value)\` that appends \`value\` to \`items\` only if it is not already present. Return the list.

The tricky part: \`items\` has a default of \`None\`, and you must create a fresh list inside the function — not in the signature.`,
        starter: `def append_unique(value, items=None):\n    pass\n`,
        solution: `def append_unique(value, items=None):\n    if items is None:\n        items = []\n    if value not in items:\n        items.append(value)\n    return items\n`,
        hints: [
          'Default must be None, not [].',
          'Create the list inside the function: if items is None: items = []',
          'Check membership with `if value not in items:` before appending.',
        ],
        cases: [
          { name: 'adds new value', call: 'append_unique("a", ["b"])', expect: '["b", "a"]' },
          { name: 'skips duplicate', call: 'append_unique("a", ["a", "b"])', expect: '["a", "b"]' },
          { name: 'creates fresh list when no argument', call: 'append_unique("x")', expect: '["x"]' },
          { name: 'default does not persist', call: '(append_unique("a"), append_unique("b"))[1]', expect: '["b"]' },
        ],
      },
      {
        t: 'quiz',
        q: "Why does `def f(x=[]):` cause bugs that survive code review?",
        options: [
          'Python does not allow list defaults',
          'The default list is evaluated once at definition time, so all calls share the same list object — and mutations accumulate across calls',
          'Lists cannot be used as arguments',
          'It is a syntax error',
        ],
        answer: 1,
        why: 'Default arguments are evaluated when the function is defined, not when it is called. A mutable default is the same object every call — so appending to it persists between calls.',
      },
      {
        t: 'try',
        prompt: `Write \`copy_and_extend(original, extra)\` that returns a **new** list combining \`original\` and \`extra\`, without mutating either input.

\`\`\`python
a = [1, 2]
b = [3]
result = copy_and_extend(a, b)
# a is still [1, 2] — untouched
# result is [1, 2, 3]
\`\`\`

Make a copy of \`original\` first (use \`list(original)\` or slice \`original[:]\`), then extend it with \`extra\`. The key: do NOT mutate the caller's list.`,
        starter: `def copy_and_extend(original, extra):\n    pass\n`,
        solution: `def copy_and_extend(original, extra):\n    result = list(original)\n    result.extend(extra)\n    return result\n`,
        hints: [
          'list(original) or original[:] creates a shallow copy.',
          'Call .extend(extra) on the copy, not the original.',
          'Return the new list.',
        ],
        cases: [
          { name: 'combines without mutation', call: '__test_copy()', expect: 'True' },
          { name: 'empty original', call: 'copy_and_extend([], [4, 5])', expect: '[4, 5]' },
          { name: 'empty extra', call: 'copy_and_extend([1, 2], [])', expect: '[1, 2]' },
        ],
        preamble: `def __test_copy():\n    a = [1, 2]\n    b = [3]\n    result = copy_and_extend(a, b)\n    return a == [1, 2] and result == [1, 2, 3]\n`,
      },

    ],
  },

  /* ==================================================== 16 */
  {
    id: 'py-l16',
    topic: 'control-flow',
    difficulty: 'intermediate',
    title: 'Truthiness, any/all and Nested Logic',
    minutes: 12,
    summary: 'Using truthiness to simplify conditions, the any() and all() built-ins, and structuring complex decision trees.',
    objectives: ['Use any() and all() for multi-condition checks', 'Simplify nested ifs with early returns', 'Apply truthiness in real patterns'],
    blocks: [
      {
        t: 'text',
        md: `The longer a condition grows, the harder it is to read. Python has two built-ins that collapse many checks into one.
\`any(iterable)\` returns \`True\` if at least one item is truthy. \`all(iterable)\` returns \`True\` only if every item is truthy. Both stop early — they are lazy.`,
      },
      { t: 'code', run: true, code: `checks = [True, False, True]\nprint(any(checks))    # True — at least one\nprint(all(checks))    # False — not all are True\n\nscores = [55, 72, 88, 40]\nprint(all(s >= 50 for s in scores))   # everyone passed?\nprint(any(s >= 90 for s in scores))   # anyone got an A?\n\nwords = ["apple", "", "cherry"]\nprint(all(words))     # False — empty string is falsy` },
      {
        t: 'text',
        md: `## Flattening nested conditions with early returns

Deeply nested \`if\` blocks — the "arrow anti-pattern" — are hard to follow. The fix is to **check the failure cases first and return early**, so the main logic sits at the left margin.`,
      },
      { t: 'code', run: true, code: `# Before: arrow pattern\n\ndef process(order):\n    if order is not None:\n        if order.get("paid"):\n            if order.get("in_stock"):\n                return "shipping"\n    return "on hold"\n\n# After: guard clauses\n\ndef process(order):\n    if order is None:\n        return "on hold"\n    if not order.get("paid"):\n        return "on hold"\n    if not order.get("in_stock"):\n        return "on hold"\n    return "shipping"` },
      {
        t: 'case',
        title: 'Case study — validating a sign-up form',
        md: `A registration form has rules: email must contain @, password must be 8+ characters, and the two password fields must match. Each rule is a small predicate. \`all()\` runs them and a helper collects the specific failures.`,
        run: true,
        code: `def validate_form(email, password, confirm):\n    """Return (is_valid, list of problems)."""\n    problems = []\n\n    if "@" not in email:\n        problems.append("Email must contain @")\n    if len(password) < 8:\n        problems.append("Password needs 8+ characters")\n    if password != confirm:\n        problems.append("Passwords do not match")\n\n    return (len(problems) == 0, problems)\n\nfor email, pw, cpw in [\n    ("ada@example.com", "secret12", "secret12"),\n    ("bademail", "short", "different"),\n    ("grace@dev.io", "p@ssw0rd!", "p@ssw0rd!"),\n]:\n    ok, issues = validate_form(email, pw, cpw)\n    print(f"{email}: {'OK' if ok else ', '.join(issues)}")`,
      },
      {
        t: 'try',
        prompt: `Write \`is_valid_password(pw)\` returning \`True\` when the password satisfies ALL of: at least 8 characters, contains a digit, contains an uppercase letter. Use \`all()\` with a list of conditions.`,
        starter: `def is_valid_password(pw):\n    pass\n`,
        solution: `def is_valid_password(pw):\n    return all([\n        len(pw) >= 8,\n        any(c.isdigit() for c in pw),\n        any(c.isupper() for c in pw),\n    ])\n`,
        hints: ['Build a list of three boolean conditions.', 'any(c.isdigit() for c in pw) checks for at least one digit.', 'Pass the list to all(...) and return the result.'],
        cases: [
          { name: 'valid password', call: 'is_valid_password("Secret12")', expect: 'True' },
          { name: 'too short', call: 'is_valid_password("Ab1")', expect: 'False' },
          { name: 'no digit', call: 'is_valid_password("Password")', expect: 'False' },
          { name: 'no uppercase', call: 'is_valid_password("secret12")', expect: 'False' },
        ],
      },
      { t: 'quiz', q: 'Why is `all(s >= 50 for s in scores)` better than `min(scores) >= 50`?', options: ['It is shorter', 'min() fails on empty lists; all() and any() are lazy and stop early', 'They are identical', 'all() sorts the data'], answer: 1, why: 'all() returns True for empty input (vacuously true) and stops checking as soon as it hits a failure, without scanning the whole list.' },
      {
        t: 'try',
        prompt: `Write \`has_vowel(word)\` that returns \`True\` if the word contains at least one vowel (\`a e i o u\`, any case).

\`has_vowel("hello")\` → \`True\`\n\`has_vowel("rhythm")\` → \`False\`

Use \`any()\` with a generator: \`any(letter.lower() in "aeiou" for letter in word)\`.`,
        starter: `def has_vowel(word):\n    pass\n`,
        solution: `def has_vowel(word):\n    return any(letter.lower() in "aeiou" for letter in word)\n`,
        hints: [
          'Loop over each letter in word inside a generator.',
          'letter.lower() in "aeiou" checks whether that letter is a vowel.',
          'any() returns True as soon as a single vowel is found.',
        ],
        cases: [
          { name: 'has vowels', call: 'has_vowel("hello")', expect: 'True' },
          { name: 'no vowels', call: 'has_vowel("rhythm")', expect: 'False' },
          { name: 'capitals', call: 'has_vowel("HELLO")', expect: 'True' },
          { name: 'empty string', call: 'has_vowel("")', expect: 'False' },
        ],
      },

    ],
  },

  /* ==================================================== 17 */
  {
    id: 'py-l17',
    topic: 'control-flow',
    difficulty: 'advanced',
    title: 'Structural Pattern Matching',
    minutes: 14,
    summary: 'Python 3.10+ match/case — destructuring data, guard clauses, and replacing long if/elif chains.',
    objectives: ['Write match/case statements', 'Destructure lists and dicts in patterns', 'Add guard clauses with if'],
    blocks: [
      {
        t: 'text',
        md: `Python 3.10 introduced \`match\` / \`case\` — structural pattern matching. It is not a C-style switch. It **destructures** values and matches against their shape.

Think of it as \`if/elif\` on steroids, capable of unpacking lists, drilling into dictionaries and binding variables — all in the case line.`,
      },
      { t: 'code', run: true, code: `def handle(command):\n    match command:\n        case ["quit"]:\n            return "Goodbye"\n        case ["greet", name]:\n            return f"Hello, {name}!"\n        case ["greet", name, "loud"]:\n            return f"HELLO, {name.upper()}!"\n        case ["add", x, y]:\n            return int(x) + int(y)\n        case _:\n            return "Unknown command"\n\nprint(handle(["greet", "Ada"]))\nprint(handle(["greet", "Ada", "loud"]))\nprint(handle(["add", "3", "4"]))\nprint(handle(["fly"]))` },
      {
        t: 'text',
        md: `Each \`case\` is a **pattern** — a shape the value must fit. \`["greet", name]\` matches a list of exactly two items where the first is the literal string \`"greet"\`, and binds the second to \`name\`.

\`_\` is the wildcard — it matches anything. You can also match dictionaries, add \`if\` guards, and combine patterns with \`|\`.`,
      },
      { t: 'code', run: true, code: `def describe(thing):\n    match thing:\n        case {"type": "point", "x": x, "y": y}:\n            return f"Point at ({x}, {y})"\n        case {"type": "circle", "radius": r} if r > 10:\n            return f"Large circle, r={r}"\n        case {"type": "circle", "radius": r}:\n            return f"Small circle, r={r}"\n        case str() as s:\n            return f"Just a string: {s}"\n        case _:\n            return "Something else"\n\nprint(describe({"type": "point", "x": 3, "y": 5}))\nprint(describe({"type": "circle", "radius": 25}))\nprint(describe({"type": "circle", "radius": 3}))\nprint(describe("hello"))` },
      {
        t: 'case',
        title: 'Case study — a tiny command interpreter for a drawing robot',
        md: `A simple language where commands are lists like \`["move", x, y]\` or \`["pen", "up"|"down"]\`. \`match\` handles every variant in one readable block, and guard \`if 0 <= x <= 100\` validates bounds without nesting.`,
        run: true,
        code: `def execute(program):\n    x = y = 0\n    drawing = False\n    lines = []\n\n    for command in program:\n        match command:\n            case ["pen", "down"]:\n                drawing = True\n            case ["pen", "up"]:\n                drawing = False\n            case ["move", dx, dy] if 0 <= dx <= 100 and 0 <= dy <= 100:\n                x, y = dx, dy\n                if drawing:\n                    lines.append(f"line to ({x}, {y})")\n            case ["move", dx, dy]:\n                lines.append(f"error: ({dx}, {dy}) out of bounds")\n            case _:\n                lines.append(f"unknown: {command}")\n    return lines\n\nprogram = [\n    ["pen", "down"],\n    ["move", 10, 20],\n    ["move", 50, 80],\n    ["pen", "up"],\n    ["move", 90, 10],\n    ["move", 200, 50],\n]\nfor line in execute(program):\n    print(line)`,
      },
      {
        t: 'try',
        prompt: `Write \`classify(value)\` using match/case that returns: \`"number"\` for int or float, \`"text"\` for str, \`"pair"\` for a list of exactly two numbers, \`"empty"\` for an empty list, \`"other"\` for anything else.`,
        starter: `def classify(value):\n    pass\n`,
        solution: `def classify(value):\n    match value:\n        case int() | float():\n            return "number"\n        case str():\n            return "text"\n        case [int() | float(), int() | float()]:\n            return "pair"\n        case []:\n            return "empty"\n        case _:\n            return "other"\n`,
        hints: ['Use int() | float() to match either numeric type.', 'A list pattern [a, b] matches exactly two items.', 'The empty list is matched with [].'],
        cases: [
          { name: 'number', call: 'classify(42)', expect: '"number"' },
          { name: 'text', call: 'classify("hello")', expect: '"text"' },
          { name: 'pair', call: 'classify([1, 2.5])', expect: '"pair"' },
          { name: 'empty list', call: 'classify([])', expect: '"empty"' },
        ],
      },
      { t: 'quiz', q: 'How does match/case differ from a C-style switch?', options: ['It is just syntax sugar', 'It destructures values against patterns — unpacking lists, matching dict shapes, binding variables — not just comparing values', 'It runs in reverse', 'It only works with strings'], answer: 1, why: 'match is structural: a case like ["greet", name] unpacks a list and binds name. A switch only compares a scalar against constants.' },
      {
        t: 'try',
        prompt: `Write \`handle_action(action)\` using match/case. \`action\` is a list where the first element is the verb:

- \`["say", msg]\` → return the message as-is
- \`["repeat", msg, times]\` → return the message repeated \`times\` times separated by spaces
- anything else → return \`"unknown"\`

\`\`\`python
handle_action(["say", "hello"])        # "hello"
handle_action(["repeat", "ha", "3"])   # "ha ha ha"
\`\`\``,
        starter: `def handle_action(action):\n    pass\n`,
        solution: `def handle_action(action):\n    match action:\n        case ["say", msg]:\n            return msg\n        case ["repeat", msg, times]:\n            return f"{msg} " * int(times)\n        case _:\n            return "unknown"\n`,
        hints: [
          'Match action against list patterns like ["say", msg].',
          'For repeat: build the result with string multiplication and a space.',
          'Use int(times) to convert the string argument to a number.',
        ],
        cases: [
          { name: 'say', call: 'handle_action(["say", "hello"])', expect: '"hello"' },
          { name: 'repeat', call: 'handle_action(["repeat", "ha", "3"])', expect: '"ha ha ha "' },
          { name: 'unknown', call: 'handle_action(["jump"])', expect: '"unknown"' },
        ],
      },

    ],
  },

  /* ==================================================== 18 */
  {
    id: 'py-l18',
    topic: 'data-structures',
    difficulty: 'intermediate',
    title: 'Sorting, Slicing and Nested Structures',
    minutes: 13,
    summary: 'Custom sort keys, slicing beyond the basics, and working with lists of dictionaries — the real-world shape.',
    objectives: ['Sort with key functions and reverse', 'Slice with step', 'Process nested list-of-dict structures'],
    blocks: [
      {
        t: 'text',
        md: `\`sorted()\` and \`.sort()\` accept a \`key\` function — a callable that extracts the value to compare by. The function is called once per item, and the results are cached (the Schwartzian transform, done for you).`,
      },
      { t: 'code', run: true, code: `records = [\n    {"name": "Ada", "score": 88},\n    {"name": "Grace", "score": 95},\n    {"name": "Alan", "score": 72},\n]\n\nby_score = sorted(records, key=lambda r: r["score"], reverse=True)\nfor r in by_score:\n    print(r["name"], r["score"])\n\nwords = ["python", "a", "code", "zz"]\nprint(sorted(words, key=len))           # by length\nprint(sorted(words, key=str.lower))     # case-insensitive` },
      {
        t: 'text',
        md: `## Advanced slicing

Slices have a third value: the **step**. \`seq[start:stop:step]\` takes every Nth element. A negative step reverses.`,
      },
      { t: 'code', run: true, code: `nums = list(range(10))\nprint(nums[::2])     # every second: [0, 2, 4, 6, 8]\nprint(nums[1::2])    # odds: [1, 3, 5, 7, 9]\nprint(nums[::-1])    # reversed: [9, 8, ..., 0]\nprint(nums[8:2:-1])  # [8, 7, 6, 5, 4, 3]\n\ntext = "racecar"\nprint(text == text[::-1])  # palindrome check` },
      {
        t: 'case',
        title: 'Case study — a leaderboard',
        md: `A list of player dictionaries, sorted first by score descending, then by name ascending as a tie-breaker. The \`key\` lambda returns a **tuple**: \`(-score, name)\`. Tuples compare element by element, so a negative score gives descending order on the first field.`,
        run: true,
        code: `players = [\n    {"name": "Ada",   "score": 250, "level": 4},\n    {"name": "Grace", "score": 250, "level": 5},\n    {"name": "Alan",  "score": 180, "level": 3},\n    {"name": "Bob",   "score": 310, "level": 6},\n    {"name": "Zoe",   "score": 250, "level": 2},\n]\n\nranked = sorted(players, key=lambda p: (-p["score"], p["name"]))\n\nprint(f"{'Rank':<5} {'Name':<8} {'Score':>5} {'Level':>5}")\nprint("-" * 30)\nfor i, player in enumerate(ranked, 1):\n    print(f"{i:<5} {player['name']:<8} {player['score']:>5} {player['level']:>5}")`,
      },
      {
        t: 'try',
        prompt: `Write \`top_n(records, n)\` returning the top \`n\` records sorted by \`score\` descending. Each record is a dict with \`name\` and \`score\`. Break ties by name ascending. Return at most \`n\` results.`,
        starter: `def top_n(records, n):\n    pass\n`,
        solution: `def top_n(records, n):\n    ranked = sorted(records, key=lambda r: (-r["score"], r["name"]))\n    return ranked[:n]\n`,
        hints: ['key=lambda r: (-r["score"], r["name"]) sorts by score desc, name asc.', 'Slice with [:n] — it handles n larger than the list safely.', 'Return the slice directly.'],
        cases: [
          { name: 'top 2', call: 'top_n([{"name":"a","score":1},{"name":"b","score":3},{"name":"c","score":2}], 2)', expect: '[{"name": "b", "score": 3}, {"name": "c", "score": 2}]' },
          { name: 'tie broken by name', call: 'top_n([{"name":"z","score":10},{"name":"a","score":10}], 2)', expect: '[{"name": "a", "score": 10}, {"name": "z", "score": 10}]' },
          { name: 'n larger than list', call: 'top_n([{"name":"x","score":5}], 10)', expect: '[{"name": "x", "score": 5}]' },
        ],
      },
      { t: 'quiz', q: 'Why does `key=lambda r: (-r["score"], r["name"])` work for sorting?', options: ['It does not — sorting requires a single value', 'Tuples are compared element by element, so negative score gives descending, then name breaks ties ascending', 'Python ignores the tuple', 'lambda always returns a string'], answer: 1, why: 'Python compares tuples lexicographically: first by -score (descending), then by name. This is the standard idiom for multi-key sorts.' },
      {
        t: 'try',
        prompt: `Write \`is_palindrome(text)\` that returns \`True\` if the text reads the same forwards and backwards, ignoring case and spaces.

\`is_palindrome("Race car")\` → \`True\`

Remove spaces with \`.replace(" ", "")\`, lowercase with \`.lower()\`, then compare with \`[::-1]\`.`,
        starter: `def is_palindrome(text):\n    pass\n`,
        solution: `def is_palindrome(text):\n    cleaned = text.replace(" ", "").lower()\n    return cleaned == cleaned[::-1]\n`,
        hints: [
          'Clean the text first: strip spaces and lowercase.',
          'reversed = cleaned[::-1] gives the string backwards.',
          'Compare cleaned == reversed and return the result.',
        ],
        cases: [
          { name: 'palindrome', call: 'is_palindrome("Race car")', expect: 'True' },
          { name: 'not palindrome', call: 'is_palindrome("hello")', expect: 'False' },
          { name: 'single word', call: 'is_palindrome("radar")', expect: 'True' },
          { name: 'empty string', call: 'is_palindrome("")', expect: 'True' },
        ],
      },

    ],
  },

  /* ==================================================== 19 */
  {
    id: 'py-l19',
    topic: 'data-structures',
    difficulty: 'advanced',
    title: 'collections Module and Custom Containers',
    minutes: 14,
    summary: 'defaultdict, Counter, namedtuple, deque — the standard library tools that replace manual boilerplate.',
    objectives: ['Replace manual grouping with defaultdict', 'Count with Counter', 'Model records with namedtuple'],
    blocks: [
      {
        t: 'text',
        md: `The \`collections\` module contains specialised containers that replace the most common manual patterns. Each one removes a branch you would otherwise write by hand.`,
      },
      { t: 'code', run: true, code: `from collections import defaultdict, Counter, namedtuple, deque\n\n# defaultdict — never check "is the key there yet?"\ngroups = defaultdict(list)\nfor word in ["a", "b", "a", "c", "b", "a"]:\n    groups[word].append(word)\nprint(dict(groups))\n\n# Counter — count anything in one go\ncounts = Counter("mississippi")\nprint(counts)\nprint(counts.most_common(2))\n\n# namedtuple — a lightweight record with named fields\nPoint = namedtuple("Point", ["x", "y"])\np = Point(3, 5)\nprint(p.x, p.y, p)` },
      {
        t: 'case',
        title: 'Case study — analysing server logs',
        md: `A web server log records each request as \`(ip, endpoint, status)\`. The task: count hits per endpoint, find the top 3 IPs by request count, and compute status-code distribution — all in a few lines with Counter and defaultdict.`,
        run: true,
        code: `from collections import Counter, defaultdict\n\nlogs = [\n    ("192.168.1.1", "/home", 200),\n    ("10.0.0.5",    "/api",  200),\n    ("192.168.1.1", "/home", 200),\n    ("10.0.0.5",    "/api",  500),\n    ("172.16.0.2",  "/home", 200),\n    ("192.168.1.1", "/login", 404),\n    ("10.0.0.5",    "/home", 200),\n]\n\nendpoint_hits = Counter(ep for _, ep, _ in logs)\nip_hits = Counter(ip for ip, _, _ in logs)\nstatus_codes = Counter(st for _, _, st in logs)\nerrors_by_endpoint = defaultdict(list)\nfor ip, ep, st in logs:\n    if st >= 400:\n        errors_by_endpoint[ep].append((ip, st))\n\nprint("Hits per endpoint:", dict(endpoint_hits))\nprint("Top IPs:", ip_hits.most_common(3))\nprint("Status codes:", dict(status_codes))\nprint("Errors by endpoint:", dict(errors_by_endpoint))`,
      },
      {
        t: 'try',
        prompt: `Write \`most_frequent(items)\` returning the item that appears most often. If there is a tie, return the one that appears first. Use \`Counter\`. Handle empty input by returning \`None\`.`,
        starter: `from collections import Counter\n\ndef most_frequent(items):\n    pass\n`,
        solution: `from collections import Counter\n\ndef most_frequent(items):\n    if not items:\n        return None\n    return Counter(items).most_common(1)[0][0]\n`,
        hints: ['Counter(items).most_common(1) returns [(item, count)].', 'The first element of the first tuple is the answer.', 'Guard the empty case at the top.'],
        cases: [
          { name: 'clear winner', call: 'most_frequent(["a", "b", "a", "c", "a"])', expect: '"a"' },
          { name: 'single item', call: 'most_frequent(["x"])', expect: '"x"' },
          { name: 'empty list', call: 'most_frequent([])', expect: 'None' },
        ],
      },
      { t: 'quiz', q: 'What does `defaultdict(list)` save you from writing?', options: ['Nothing — it is identical to dict', 'The `if key not in dict: dict[key] = []` guard before appending', 'It sorts the keys', 'It prevents duplicates'], answer: 1, why: 'defaultdict calls list() to create a default value automatically when a key is first accessed, removing the manual initialisation branch.' },
      {
        t: 'try',
        prompt: `Write \`group_by_length(words)\` that returns a dict grouping words by their length, using \`defaultdict(list)\`.

\`group_by_length(["a", "it", "cat", "hi", "dog"])\` → \`{1: ["a"], 2: ["it", "hi"], 3: ["cat", "dog"]}\`

Import \`defaultdict\` from \`collections\`. Create \`groups = defaultdict(list)\`, loop and append to \`groups[len(word)]\`, then return \`dict(groups)\`.`,
        starter: `from collections import defaultdict\n\ndef group_by_length(words):\n    pass\n`,
        solution: `from collections import defaultdict\n\ndef group_by_length(words):\n    groups = defaultdict(list)\n    for word in words:\n        groups[len(word)].append(word)\n    return dict(groups)\n`,
        hints: [
          'Create groups = defaultdict(list) at the top.',
          'groups[len(word)].append(word) — defaultdict auto-creates the list.',
          'Return dict(groups) to convert back to a plain dict.',
        ],
        cases: [
          { name: 'groups by length', call: 'group_by_length(["a", "it", "cat", "hi", "dog"])', expect: '{1: ["a"], 2: ["it", "hi"], 3: ["cat", "dog"]}' },
          { name: 'empty returns empty', call: 'group_by_length([])', expect: '{}' },
        ],
      },

    ],
  },

  /* ==================================================== 20 */
  {
    id: 'py-l20',
    topic: 'functions',
    difficulty: 'intermediate',
    title: 'Closures and Higher-Order Functions',
    minutes: 13,
    summary: 'Functions that return functions, closures that remember, and map/filter as alternatives to loops.',
    objectives: ['Write a closure that captures outer state', 'Use map and filter', 'Explain why a closure is useful'],
    blocks: [
      { t: 'text', md: 'A function can **return** another function, and the inner one remembers the variables it was born with. That is a **closure** — the foundation of decorators and the most powerful idea in functional programming.' },
      { t: 'code', run: true, code: `def make_multiplier(factor):\n    def multiply(value):\n        return value * factor\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\n\nprint(double(10))   # 20\nprint(triple(10))   # 30` },
      { t: 'text', md: '## map and filter\n\n`map(fn, iterable)` applies `fn` to every item. `filter(pred, iterable)` keeps items where `pred` returns `True`. Both return **lazy iterators** — they do no work until you consume them.' },
      { t: 'code', run: true, code: `nums = [1, 2, 3, 4, 5]\n\nsquared = list(map(lambda n: n * n, nums))\nprint(squared)\n\nevens = list(filter(lambda n: n % 2 == 0, nums))\nprint(evens)\n\nresult = list(map(str, filter(lambda n: n > 2, nums)))\nprint(result)   # ["3", "4", "5"]` },
      {
        t: 'case',
        title: 'Case study — a configurable data pipeline',
        md: 'A report generator that can apply different transformations (filtering, rounding, formatting) depending on the output mode. Each transformation is a closure that captures its configuration. The pipeline is just a list of functions applied in order.',
        run: true,
        code: `def greater_than(threshold):\n    return lambda v: v > threshold\n\ndef round_to(decimals):\n    return lambda v: round(v, decimals)\n\nvalues = [3.14159, 0.57721, 2.71828, 1.41421]\n\npipeline = [greater_than(1.0), round_to(2)]\nresult = values\nfor step in pipeline:\n    result = filter(step, result)\nprint(list(result))   # [3.14, 2.72, 1.41]`,
      },
      {
        t: 'try',
        prompt: 'Write `make_greeter(greeting)` returning a function that takes a name and returns `"<greeting>, <name>!"`. Example: `hello = make_greeter("Hello"); hello("Ada")` → `"Hello, Ada!"`.',
        starter: `def make_greeter(greeting):\n    pass\n`,
        solution: `def make_greeter(greeting):\n    def greet(name):\n        return f"{greeting}, {name}!"\n    return greet\n`,
        hints: ['Define an inner function that takes name.', 'The inner function uses greeting from the outer scope.', 'Return the inner function — no parentheses.'],
        cases: [
          { name: 'hello greeter', call: 'make_greeter("Hello")("Ada")', expect: '"Hello, Ada!"' },
          { name: 'bonjour greeter', call: 'make_greeter("Bonjour")("Grace")', expect: '"Bonjour, Grace!"' },
        ],
      },
      { t: 'quiz', q: 'What does a closure capture?', options: ['A copy of variables at definition time', 'A reference to the variables in the enclosing scope — the inner function sees live values', 'Only global variables', 'Nothing — closures are just regular functions'], answer: 1, why: 'The inner function holds a reference to the enclosing scope, so if the outer variable changes before the inner is called, the inner sees the new value.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `apply_twice(fn, value)` that calls `fn` on `value` twice and returns the result.\n\n`apply_twice(lambda x: x * 2, 5)` → 5 * 2 * 2 = `20`\n\nThis is a higher-order function — it takes a function as an argument.",
            "starter": "def apply_twice(fn, value):\n    pass\n",
            "solution": "def apply_twice(fn, value):\n    return fn(fn(value))\n",
            "hints": [
                  "Call fn(value) first, then fn on the result.",
                  "One line: return fn(fn(value)).",
                  "fn can be any callable — the function does not care."
            ],
            "cases": [
                  {
                        "name": "double twice",
                        "call": "apply_twice(lambda x: x * 2, 5)",
                        "expect": "20"
                  },
                  {
                        "name": "add one twice",
                        "call": "apply_twice(lambda x: x + 1, 0)",
                        "expect": "2"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 21 */
  {
    id: 'py-l21',
    topic: 'functions',
    difficulty: 'advanced',
    title: 'Decorators and functools',
    minutes: 15,
    summary: 'Wrapping functions with @decorator syntax, preserving metadata with wraps, and building decorators that take arguments.',
    objectives: ['Write a simple decorator', 'Use @wraps to preserve metadata', 'Build a decorator factory with arguments'],
    blocks: [
      { t: 'text', md: 'A **decorator** is a function that takes a function and returns a (usually modified) function. The `@` syntax is sugar: `@log` above `def foo(): ...` means `foo = log(foo)`. Decorators let you add behaviour — logging, timing, caching, access control — without touching the function body.' },
      { t: 'code', run: true, code: `import functools\nimport time\n\n\ndef timer(fn):\n    """Print how long a function took."""\n    @functools.wraps(fn)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{fn.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_sum(n):\n    return sum(range(n))\n\nprint(slow_sum(1_000_000))` },
      { t: 'note', tone: 'warn', title: 'Always use @wraps', md: 'Without `@functools.wraps`, the wrapper function replaces the original\'s `__name__`, `__doc__` and signature. Tools that rely on introspection — debuggers, documentation generators — get confused.' },
      { t: 'text', md: '## Decorators that take arguments\n\nWhen a decorator needs its own parameters — `@retry(times=3)` — you need a **decorator factory**: a function that returns the actual decorator. Three layers of nesting.' },
      { t: 'code', run: true, code: `import functools\n\ndef retry(times):\n    def decorator(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            last_error = None\n            for _ in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception as exc:\n                    last_error = exc\n            raise last_error\n        return wrapper\n    return decorator\n\nattempts = 0\n\n@retry(times=3)\ndef flaky():\n    global attempts\n    attempts += 1\n    if attempts < 3:\n        raise RuntimeError("failed")\n    return "success"\n\nprint(flaky())` },
      {
        t: 'case',
        title: 'Case study — an API rate-limiter decorator',
        md: 'A decorator that enforces a minimum delay between calls — useful when an external API limits how fast you can hit it. The closure stores `last_called` across invocations.',
        run: true,
        code: `import functools\nimport time\n\ndef rate_limit(min_interval):\n    """Ensure at least \`min_interval\` seconds between calls."""\n    def decorator(fn):\n        state = {"last_called": 0.0}\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            now = time.perf_counter()\n            wait = min_interval - (now - state["last_called"])\n            if wait > 0:\n                print(f"  (rate-limited: waiting {wait:.2f}s)")\n                time.sleep(wait)\n            result = fn(*args, **kwargs)\n            state["last_called"] = time.perf_counter()\n            return result\n        return wrapper\n    return decorator\n\n@rate_limit(0.3)\ndef fetch(url):\n    print(f"  fetching {url}...")\n    return f"<{url}>"\n\nfor url in ["/a", "/b", "/c"]:\n    fetch(url)`,
      },
      { t: 'quiz', q: 'Why does a decorator with arguments require three nested functions?', options: ['It does not', 'Outer: receives decorator args. Middle: receives the function. Inner: receives the call arguments', 'Python requires three', 'Decorators cannot take arguments'], answer: 1, why: '@retry(times=3) first calls retry(times=3) → returns decorator. Then @ applies that decorator to the function. That requires an outer factory.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `is_even(n)` returning `True` if n is even. Include a docstring with at least one doctest-style example.\n\nTwo approaches: `n % 2 == 0` or `n & 1 == 0` (bitwise). Either passes.",
            "starter": "def is_even(n):\n    \"\"\"Return True if n is even.\n\n    >>> is_even(4)\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_even(n):\n    \"\"\"Return True if n is even.\n\n    >>> is_even(4)\n    True\n    \"\"\"\n    return n % 2 == 0\n",
            "hints": [
                  "n % 2 == 0 checks divisibility by 2.",
                  "Keep the docstring — the starter includes it.",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "even",
                        "call": "is_even(4)",
                        "expect": "True"
                  },
                  {
                        "name": "odd",
                        "call": "is_even(7)",
                        "expect": "False"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `apply_twice(fn, value)` that calls `fn` on `value` twice and returns the result.\n\n`apply_twice(lambda x: x * 2, 5)` → 5 * 2 * 2 = `20`\n\nThis is a higher-order function — it takes a function as an argument.",
            "starter": "def apply_twice(fn, value):\n    pass\n",
            "solution": "def apply_twice(fn, value):\n    return fn(fn(value))\n",
            "hints": [
                  "Call fn(value) first, then fn on the result.",
                  "One line: return fn(fn(value)).",
                  "fn can be any callable — the function does not care."
            ],
            "cases": [
                  {
                        "name": "double twice",
                        "call": "apply_twice(lambda x: x * 2, 5)",
                        "expect": "20"
                  },
                  {
                        "name": "add one twice",
                        "call": "apply_twice(lambda x: x + 1, 0)",
                        "expect": "2"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 22 */
  {
    id: 'py-l22',
    topic: 'error-handling',
    difficulty: 'beginner',
    title: 'Exceptions Without Fear',
    minutes: 11,
    summary: 'What an exception is, the common types, and the try/except pattern in its simplest form.',
    objectives: ['Name the most common exception types', 'Write a try/except block', 'Decide when to catch and when to let it crash'],
    blocks: [
      { t: 'text', md: 'Programs encounter problems. A file is missing, a user typed letters where a number belongs, a network call timed out. Python signals these with **exceptions** — objects that interrupt normal flow and carry information about what went wrong.\n\nThe mechanism is `try` / `except`: attempt something, and if a particular kind of problem occurs, run a recovery block instead of crashing.' },
      { t: 'code', run: true, code: `try:\n    number = int("banana")\nexcept ValueError:\n    number = 0\n    print("That was not a number — using 0 instead")\n\nprint("Continuing with", number)` },
      { t: 'text', md: 'The most common built-in exceptions:\n\n| Exception | When |\n|---|---|\n| `ValueError` | right type, wrong value |\n| `TypeError` | wrong type |\n| `KeyError` | dict key does not exist |\n| `IndexError` | list index out of range |\n| `FileNotFoundError` | file does not exist |\n| `ZeroDivisionError` | divided by zero |' },
      {
        t: 'case',
        title: 'Case study — a robust number-guessing game',
        md: 'A game that asks the player to guess a number. The loop must handle non-numeric input without crashing and without counting it as a guess. `try/except ValueError` catches bad input; `continue` skips the rest of the loop body.',
        run: true,
        code: `import random\n\ntarget = random.randint(1, 20)\nguesses = 0\n\nprint("Guess a number between 1 and 20")\n\nwhile True:\n    raw = input("Your guess: ").strip()\n    try:\n        guess = int(raw)\n    except ValueError:\n        print("Please type a whole number.")\n        continue\n\n    guesses += 1\n    if guess < target:\n        print("Higher!")\n    elif guess > target:\n        print("Lower!")\n    else:\n        print(f"Correct! {guesses} guess(es).")\n        break`,
      },
      {
        t: 'try',
        prompt: 'Write `safe_divide(a, b)` that returns `a / b`, or the string `"cannot divide by zero"` if `b` is `0`.',
        starter: `def safe_divide(a, b):\n    pass\n`,
        solution: `def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "cannot divide by zero"\n`,
        hints: ['Put the division in a try block.', 'Catch ZeroDivisionError specifically.', 'Return the error message from the except block.'],
        cases: [
          { name: 'normal division', call: 'safe_divide(10, 2)', expect: '5.0' },
          { name: 'divide by zero', call: 'safe_divide(5, 0)', expect: '"cannot divide by zero"' },
        ],
      },
      { t: 'quiz', q: 'Why should you avoid a bare `except:` with no exception type?', options: ['It is slower', 'It catches everything including system exits and keyboard interrupts, hiding bugs', 'Python forbids it', 'It only works in Python 2'], answer: 1, why: 'A bare except catches SystemExit, KeyboardInterrupt and all bugs — not just the errors you intended to handle.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `parse_int_safely(text)` that converts `text` to an integer. If it fails, return a tuple `(False, error_message)`. If it succeeds, return `(True, number)`.\n\nUse try/except ValueError. This is the \"either pattern\" — returning a success/failure wrapper instead of crashing.",
            "starter": "def parse_int_safely(text):\n    pass\n",
            "solution": "def parse_int_safely(text):\n    try:\n        return (True, int(text))\n    except ValueError:\n        return (False, f\"Cannot convert '{text}' to int\")\n",
            "hints": [
                  "Try int(text) in a try block.",
                  "On success return (True, int(text)).",
                  "On ValueError return (False, \"Cannot convert ...\")."
            ],
            "cases": [
                  {
                        "name": "valid number",
                        "call": "parse_int_safely(\"42\")",
                        "expect": "(True, 42)"
                  },
                  {
                        "name": "invalid",
                        "call": "parse_int_safely(\"abc\")",
                        "expect": "(False, \"Cannot convert 'abc' to int\")"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 23 */
  {
    id: 'py-l23',
    topic: 'error-handling',
    difficulty: 'advanced',
    title: 'Custom Exceptions and finally',
    minutes: 13,
    summary: 'Defining your own exception hierarchy, the else clause in try, and using finally for guaranteed cleanup.',
    objectives: ['Define custom exception classes', 'Use try/except/else/finally', 'Chain exceptions with raise ... from'],
    blocks: [
      { t: 'text', md: 'When the built-in exceptions do not describe your problem well enough, **define your own**. A custom exception is just a class that inherits from `Exception` (or a more specific one). The name is the documentation.' },
      { t: 'code', run: true, code: `class InsufficientFunds(Exception):\n    """Raised when a withdrawal exceeds the available balance."""\n    def __init__(self, balance, requested):\n        super().__init__(f"Balance {balance}, tried to withdraw {requested}")\n        self.balance = balance\n        self.requested = requested\n\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFunds(balance, amount)\n    return balance - amount\n\ntry:\n    withdraw(100, 250)\nexcept InsufficientFunds as e:\n    print(f"Denied: {e}")\n    print(f"Shortfall: {e.requested - e.balance}")` },
      { t: 'text', md: '## The full try statement\n\n`try` has four parts: `try` (risky code), `except` (on matching exception), `else` (only if no exception), `finally` (no matter what — even after a return or uncaught exception).' },
      { t: 'code', run: true, code: `def read_config(path):\n    file = None\n    try:\n        file = open(path)\n        data = file.read()\n    except FileNotFoundError:\n        return {}\n    else:\n        return eval(data)\n    finally:\n        if file:\n            file.close()\n            print(f"Closed {path}")` },
      {
        t: 'case',
        title: 'Case study — a payment processor with rollback',
        md: 'Transferring money between two accounts: debit one, credit the other. If the credit fails, the debit must be **rolled back**. The pattern: a try block with compensating actions in the except, then re-raise so the caller knows it failed.',
        run: true,
        code: `class PaymentError(Exception):\n    pass\n\n\ndef transfer(sender, receiver, amount):\n    if sender["balance"] < amount:\n        raise PaymentError(f"{sender['name']} has insufficient funds")\n\n    sender["balance"] -= amount\n    print(f"Debited {amount} from {sender['name']}")\n\n    try:\n        if receiver.get("frozen"):\n            raise PaymentError(f"{receiver['name']} is frozen")\n        receiver["balance"] += amount\n        print(f"Credited {amount} to {receiver['name']}")\n    except PaymentError:\n        sender["balance"] += amount   # roll back\n        print(f"ROLLED BACK {amount} to {sender['name']}")\n        raise\n\nalice = {"name": "Alice", "balance": 500}\nbob = {"name": "Bob", "balance": 100, "frozen": True}\n\ntry:\n    transfer(alice, bob, 50)\nexcept PaymentError as e:\n    print(f"Transfer failed: {e}")\n\nprint(f"Alice: {alice['balance']}, Bob: {bob['balance']}")`,
      },
      { t: 'quiz', q: 'When does a `finally` block NOT execute?', options: ['When an exception is caught', 'When the try block returns normally', 'If the process is killed (os._exit, SIGKILL) or the interpreter crashes', 'When there is no except block'], answer: 2, why: 'finally always runs after try/except/else/return/break/continue. Only a hard process kill or interpreter abort skips it.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `get_first(items)` returning the first element of a list, or `None` if the list is empty. Do NOT use try/except — check the length or truthiness of the list directly.\n\nThis teaches that some errors are better prevented than caught.",
            "starter": "def get_first(items):\n    pass\n",
            "solution": "def get_first(items):\n    if not items:\n        return None\n    return items[0]\n",
            "hints": [
                  "if not items: checks for an empty list.",
                  "Return None for the empty case.",
                  "Return items[0] otherwise."
            ],
            "cases": [
                  {
                        "name": "normal list",
                        "call": "get_first([10, 20, 30])",
                        "expect": "10"
                  },
                  {
                        "name": "empty list",
                        "call": "get_first([])",
                        "expect": "None"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `parse_int_safely(text)` that converts `text` to an integer. If it fails, return a tuple `(False, error_message)`. If it succeeds, return `(True, number)`.\n\nUse try/except ValueError. This is the \"either pattern\" — returning a success/failure wrapper instead of crashing.",
            "starter": "def parse_int_safely(text):\n    pass\n",
            "solution": "def parse_int_safely(text):\n    try:\n        return (True, int(text))\n    except ValueError:\n        return (False, f\"Cannot convert '{text}' to int\")\n",
            "hints": [
                  "Try int(text) in a try block.",
                  "On success return (True, int(text)).",
                  "On ValueError return (False, \"Cannot convert ...\")."
            ],
            "cases": [
                  {
                        "name": "valid number",
                        "call": "parse_int_safely(\"42\")",
                        "expect": "(True, 42)"
                  },
                  {
                        "name": "invalid",
                        "call": "parse_int_safely(\"abc\")",
                        "expect": "(False, \"Cannot convert 'abc' to int\")"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 24 */
  {
    id: 'py-l24',
    topic: 'file-io',
    difficulty: 'beginner',
    title: 'Reading and Writing Files',
    minutes: 12,
    summary: 'Opening files safely with `with`, reading lines, and writing text to disk.',
    objectives: ['Open a file for reading with `with`', 'Iterate over lines', 'Write text to a file'],
    blocks: [
      { t: 'text', md: 'Files let your program talk to permanent storage. The pattern Python encourages is the **context manager** — `with open(...) as f:` — which guarantees the file is closed even if something goes wrong inside the block.' },
      { t: 'code', run: true, code: `# Write a file\nwith open("greeting.txt", "w") as f:\n    f.write("Hello, world!\\n")\n    f.write("This is line two.\\n")\n\n# Read it back\nwith open("greeting.txt") as f:\n    for line in f:\n        print(repr(line))` },
      { t: 'text', md: 'The second argument is the **mode**: `"r"` (read, default), `"w"` (write — overwrites), `"a"` (append). `f.read()` grabs everything as one string. `f.readlines()` gives a list of lines. Iterating `for line in f` reads one line at a time — the memory-friendly way.' },
      {
        t: 'case',
        title: 'Case study — a simple note-taking app',
        md: 'A script that appends timestamped notes to a file. Each call adds one line with the current time. The `"a"` mode creates the file if it does not exist and writes to the end.',
        run: true,
        code: `from datetime import datetime\n\nNOTES_FILE = "notes.txt"\n\ndef add_note(text):\n    now = datetime.now().strftime("%Y-%m-%d %H:%M")\n    with open(NOTES_FILE, "a") as f:\n        f.write(f"[{now}] {text}\\n")\n    print("Note saved.")\n\ndef read_notes():\n    try:\n        with open(NOTES_FILE) as f:\n            content = f.read()\n            print(content if content else "(no notes yet)")\n    except FileNotFoundError:\n        print("(no notes yet)")\n\nadd_note("Learned about file I/O")\nadd_note("This is my second note")\nread_notes()`,
      },
      {
        t: 'try',
        prompt: 'Write `count_lines(path)` that returns the number of lines in a text file. If the file does not exist, return `-1`.',
        starter: `def count_lines(path):\n    pass\n`,
        solution: `def count_lines(path):\n    try:\n        with open(path) as f:\n            return sum(1 for _ in f)\n    except FileNotFoundError:\n        return -1\n`,
        hints: ['Use sum(1 for _ in f) to count lines efficiently.', 'Wrap in try/except FileNotFoundError.', 'Return -1 from the except block.'],
        cases: [{ name: 'counts file', call: '__create_tmp_file("a\\nb\\nc", count_lines)', expect: '3' }],
      },
      { t: 'quiz', q: 'Why use `with open(...) as f:` instead of `f = open(...)`?', options: ['It is shorter', '`with` guarantees the file is closed even if an exception occurs inside the block', '`open()` is deprecated', 'There is no difference'], answer: 1, why: 'The context manager calls f.close() automatically when the block exits — even on an exception. Manual close() can be skipped if an error occurs before it.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `append_line(filename, text)` that appends a line (text + newline) to a file. If the file does not exist, create it. Use mode `\"a\"`.\n\nReturn the number of characters written (including the newline).",
            "starter": "def append_line(filename, text):\n    pass\n",
            "solution": "def append_line(filename, text):\n    line = text + \"\\n\"\n    with open(filename, \"a\") as f:\n        return f.write(line)\n",
            "hints": [
                  "Mode \"a\" creates the file if it does not exist.",
                  "Add a newline: text + \"\\n\".",
                  "f.write returns the number of characters written."
            ],
            "cases": [
                  {
                        "name": "writes and returns count",
                        "call": "__create_tmp_file(\"test\", lambda f: append_line(f, \"hello\"))",
                        "expect": "6"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 25 */
  {
    id: 'py-l25',
    topic: 'file-io',
    difficulty: 'intermediate',
    title: 'CSV, JSON and Structured Data',
    minutes: 13,
    summary: 'Reading tabular data with the csv module, serialising with json, and choosing the right format.',
    objectives: ['Parse CSV files with csv.DictReader', 'Serialise and deserialise JSON', 'Write structured data to a file'],
    blocks: [
      { t: 'text', md: 'Plain text is fine for notes. For structured data — tables, configuration, API responses — use a standard format. Python\'s standard library has `csv` and `json`.' },
      { t: 'code', run: true, code: `import csv\nimport io\n\ncsv_data = "name,score,level\\nAda,250,4\\nGrace,310,5\\nAlan,180,3"\n\nreader = csv.DictReader(io.StringIO(csv_data))\nfor row in reader:\n    print(f"{row['name']}: score {row['score']}, level {row['level']}")` },
      { t: 'code', run: true, code: `import json\n\ndata = {\n    "users": [{"name": "Ada", "active": True}, {"name": "Grace", "active": False}],\n    "count": 2,\n}\n\ntext = json.dumps(data, indent=2)\nprint("Serialised:")\nprint(text)\n\nparsed = json.loads(text)\nprint("\\nRound-trip:", parsed == data)` },
      {
        t: 'case',
        title: 'Case study — a gradebook that persists to JSON',
        md: 'A program that tracks student grades across sessions. On start, it loads existing data from a JSON file. Each run adds or updates entries, then writes the whole structure back.',
        run: true,
        code: `import json\nimport os\n\nGRADES_FILE = "grades.json"\n\ndef load_grades():\n    if not os.path.exists(GRADES_FILE):\n        return {}\n    with open(GRADES_FILE) as f:\n        return json.load(f)\n\ndef save_grades(grades):\n    with open(GRADES_FILE, "w") as f:\n        json.dump(grades, f, indent=2)\n\ndef add_grade(grades, student, subject, score):\n    if student not in grades:\n        grades[student] = {}\n    grades[student][subject] = score\n\ngrades = load_grades()\nadd_grade(grades, "Ada", "maths", 88)\nadd_grade(grades, "Ada", "physics", 92)\nadd_grade(grades, "Alan", "maths", 74)\nsave_grades(grades)\nprint(json.dumps(grades, indent=2))`,
      },
      {
        t: 'try',
        prompt: 'Write `load_scores(path)` that reads a JSON file containing `{"scores": [10, 20, 30]}` and returns the list of scores. If the file does not exist or is invalid JSON, return an empty list.',
        starter: `import json\n\ndef load_scores(path):\n    pass\n`,
        solution: `import json\n\ndef load_scores(path):\n    try:\n        with open(path) as f:\n            data = json.load(f)\n        return data.get("scores", [])\n    except (FileNotFoundError, json.JSONDecodeError):\n        return []\n`,
        hints: ['Use json.load(f) to read and parse.', 'Access with .get("scores", []) for a safe default.', 'Catch both FileNotFoundError and json.JSONDecodeError.'],
        cases: [{ name: 'reads file', call: '__create_tmp_file(\'{"scores":[1,2]}\', load_scores)', expect: '[1, 2]' }],
      },
      { t: 'quiz', q: 'Why use `csv.DictReader` over `csv.reader`?', options: ['It is faster', 'Fields are accessed by column name rather than index — code survives column reordering', 'It sorts the data', 'reader() does not exist'], answer: 1, why: 'DictReader uses the header row to create dictionaries, so you write row["name"] rather than row[0]. Column reordering does not break the code.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `append_line(filename, text)` that appends a line (text + newline) to a file. If the file does not exist, create it. Use mode `\"a\"`.\n\nReturn the number of characters written (including the newline).",
            "starter": "def append_line(filename, text):\n    pass\n",
            "solution": "def append_line(filename, text):\n    line = text + \"\\n\"\n    with open(filename, \"a\") as f:\n        return f.write(line)\n",
            "hints": [
                  "Mode \"a\" creates the file if it does not exist.",
                  "Add a newline: text + \"\\n\".",
                  "f.write returns the number of characters written."
            ],
            "cases": [
                  {
                        "name": "writes and returns count",
                        "call": "__create_tmp_file(\"test\", lambda f: append_line(f, \"hello\"))",
                        "expect": "6"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 26 */
  {
    id: 'py-l26',
    topic: 'file-io',
    difficulty: 'advanced',
    title: 'Pathlib and File System Operations',
    minutes: 13,
    summary: 'Modern file handling with pathlib — joining paths, walking directories, and why it replaces os.path.',
    objectives: ['Create and join paths with pathlib', 'Walk a directory tree', 'Read and write with Path objects directly'],
    blocks: [
      { t: 'text', md: '`os.path` is the old way. `pathlib` is the modern, object-oriented replacement. A `Path` object represents a file-system path, and its methods read, write, glob and walk without importing three different modules.' },
      { t: 'code', run: true, code: `from pathlib import Path\n\nbase = Path("projects") / "python" / "main.py"\nprint(base)               # projects/python/main.py\nprint(base.name)          # main.py\nprint(base.suffix)        # .py\nprint(base.parent)        # projects/python\n\nlog = Path("output.log")\nlog.write_text("line one\\nline two\\n")\nprint(log.read_text())` },
      { t: 'text', md: '## Walking a directory tree\n\n`Path.rglob("*.py")` recursively finds every Python file. `Path.iterdir()` lists immediate children. Combined with `.stat()` you can filter by size or modification time.' },
      { t: 'code', run: true, code: `from pathlib import Path\n\nroot = Path("demo_project")\n(root / "src").mkdir(parents=True, exist_ok=True)\n(root / "tests").mkdir(parents=True, exist_ok=True)\n(root / "src" / "app.py").write_text("# main app")\n(root / "tests" / "test_app.py").write_text("# tests")\n(root / "README.md").write_text("# Demo")\n\nprint("All Python files:")\nfor py_file in sorted(root.rglob("*.py")):\n    print(f"  {py_file.relative_to(root)}")\n\nprint("\\nFiles over 10 bytes:")\nfor path in root.rglob("*"):\n    if path.is_file() and path.stat().st_size > 10:\n        print(f"  {path.relative_to(root)} ({path.stat().st_size} bytes)")` },
      {
        t: 'case',
        title: 'Case study — a project scaffolder',
        md: 'A script that creates a standard Python project layout — source directory, tests directory, a README — from a template in one call. pathlib makes directory creation and file writing a single chain of method calls.',
        run: true,
        code: `from pathlib import Path\n\nTEMPLATE = {\n    "src/app.py": '"""Main application."""\\n\\ndef main():\\n    print("Hello from {name}")\\n\\nif __name__ == "__main__":\\n    main()\\n',\n    "tests/test_app.py": "def test_import():\\n    from src.app import main\\n    assert main is not None\\n",\n    "README.md": "# {name}\\n\\nA Python project.\\n",\n}\n\ndef scaffold(project_name):\n    root = Path(project_name)\n    if root.exists():\n        print(f"{project_name} already exists")\n        return\n    for rel_path, content in TEMPLATE.items():\n        target = root / rel_path\n        target.parent.mkdir(parents=True, exist_ok=True)\n        target.write_text(content.format(name=project_name))\n        print(f"  created {target}")\n    print(f"\\nScaffolded {project_name}/")\n\nscaffold("my_new_project")\nprint("\\nResult:")\nfor path in sorted(Path("my_new_project").rglob("*")):\n    if path.is_file():\n        print(f"  {path.relative_to(Path.cwd())}")`,
      },
      { t: 'quiz', q: 'What advantage does `Path` have over `os.path`?', options: ['It is the only way to read files', 'Path objects carry methods for reading, writing, globbing and walking; `/` operator joins paths naturally', '`os.path` is removed', 'No difference'], answer: 1, why: 'Path combines path manipulation, I/O, directory listing and globbing into a single chainable API. `Path("a") / "b"` is clearer than `os.path.join("a", "b")`.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `write_and_read(filename, content)` that writes `content` to a file with `\"w\"` mode, then reads and returns its contents. Use two `with` blocks — one for writing, one for reading.\n\nThis verifies the round-trip: what you wrote is what you get back.",
            "starter": "def write_and_read(filename, content):\n    pass\n",
            "solution": "def write_and_read(filename, content):\n    with open(filename, \"w\") as f:\n        f.write(content)\n    with open(filename) as f:\n        return f.read()\n",
            "hints": [
                  "First with open(filename, \"w\") as f: f.write(content).",
                  "Then with open(filename) as f: return f.read().",
                  "The file is auto-closed after each with block."
            ],
            "cases": [
                  {
                        "name": "roundtrip",
                        "call": "__create_tmp_file(\"test\", lambda f: write_and_read(f, \"hello\"))",
                        "expect": "\"hello\""
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `append_line(filename, text)` that appends a line (text + newline) to a file. If the file does not exist, create it. Use mode `\"a\"`.\n\nReturn the number of characters written (including the newline).",
            "starter": "def append_line(filename, text):\n    pass\n",
            "solution": "def append_line(filename, text):\n    line = text + \"\\n\"\n    with open(filename, \"a\") as f:\n        return f.write(line)\n",
            "hints": [
                  "Mode \"a\" creates the file if it does not exist.",
                  "Add a newline: text + \"\\n\".",
                  "f.write returns the number of characters written."
            ],
            "cases": [
                  {
                        "name": "writes and returns count",
                        "call": "__create_tmp_file(\"test\", lambda f: append_line(f, \"hello\"))",
                        "expect": "6"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 27 */
  {
    id: 'py-l27',
    topic: 'comprehensions',
    difficulty: 'beginner',
    title: 'List Comprehensions',
    minutes: 11,
    summary: 'Building lists in one readable line — the Pythonic alternative to for-loop accumulation.',
    objectives: ['Write a list comprehension', 'Add a filter with if', 'Read a comprehension aloud'],
    blocks: [
      { t: 'text', md: 'A **list comprehension** builds a list by describing what you want, rather than how to build it. It is a loop, a condition and a transformation — all on one line.\n\n```python\n[expression for variable in iterable if condition]\n```\n\nRead it right-to-left: *"for each thing in this collection, if this condition holds, give me this expression"*.' },
      { t: 'code', run: true, code: `# Traditional loop\nsquares = []\nfor n in range(10):\n    squares.append(n * n)\nprint(squares)\n\n# Comprehension — same result, one line\nsquares = [n * n for n in range(10)]\nprint(squares)\n\n# With a filter\neven_squares = [n * n for n in range(10) if n % 2 == 0]\nprint(even_squares)\n\n# Any expression works\nnames = ["ada", "grace", "alan"]\nshout = [name.upper() for name in names]\nprint(shout)` },
      {
        t: 'case',
        title: 'Case study — filtering and transforming a dataset',
        md: 'Given a list of product prices, produce a list of formatted strings for only the items that are on sale (price under 20). The comprehension does the filter and the format in one pass.',
        run: true,
        code: `prices = [45.00, 12.99, 8.50, 60.00, 19.99, 3.25]\n\nbargains = [\n    f"\\u00a3{price:.2f} — great deal!"\n    for price in prices\n    if price < 20\n]\n\nfor item in bargains:\n    print(item)\nprint(f"\\n{len(bargains)} bargains out of {len(prices)} items")`,
      },
      {
        t: 'try',
        prompt: 'Write a list comprehension that produces `[1, 4, 9, 16, 25]` — the squares of 1 through 5.',
        starter: `def first_five_squares():\n    pass\n`,
        solution: `def first_five_squares():\n    return [n * n for n in range(1, 6)]\n`,
        hints: ['range(1, 6) gives 1, 2, 3, 4, 5.', 'The expression is n * n.', 'Return the comprehension directly.'],
        cases: [
          { name: 'returns squares', call: 'first_five_squares()', expect: '[1, 4, 9, 16, 25]' },
        ],
      },
      { t: 'quiz', q: 'What does `[n for n in range(10) if n % 2 == 0]` produce?', options: ['[1, 3, 5, 7, 9]', '[0, 2, 4, 6, 8]', '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]', 'An error'], answer: 1, why: 'n % 2 == 0 keeps only even numbers from 0 through 9: [0, 2, 4, 6, 8].' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `flatten(matrix)` that takes a list of lists and returns a single flat list using a nested comprehension.\n\n`flatten([[1, 2], [3, 4], [5]])` → `[1, 2, 3, 4, 5]`\n\nUse `[item for row in matrix for item in row]`. Read it: \"for each row in matrix, for each item in row, give me item\".",
            "starter": "def flatten(matrix):\n    pass\n",
            "solution": "def flatten(matrix):\n    return [item for row in matrix for item in row]\n",
            "hints": [
                  "The order: for row in matrix, then for item in row.",
                  "The expression at the front is just item.",
                  "One line — return the comprehension directly."
            ],
            "cases": [
                  {
                        "name": "3x2",
                        "call": "flatten([[1, 2], [3, 4], [5, 6]])",
                        "expect": "[1, 2, 3, 4, 5, 6]"
                  },
                  {
                        "name": "empty",
                        "call": "flatten([])",
                        "expect": "[]"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 28 */
  {
    id: 'py-l28',
    topic: 'comprehensions',
    difficulty: 'intermediate',
    title: 'Dict, Set and Nested Comprehensions',
    minutes: 12,
    summary: 'Building dictionaries and sets with comprehension syntax, plus nesting for multi-dimensional structures.',
    objectives: ['Write dict and set comprehensions', 'Build nested structures', 'Choose comprehension vs loop based on readability'],
    blocks: [
      { t: 'text', md: 'The same syntax works for dictionaries and sets. Wrap the expression in curly braces instead of square brackets.\n\n- Dict: `{key_expr: value_expr for item in iterable}`\n- Set: `{expression for item in iterable}`' },
      { t: 'code', run: true, code: `# Dict comprehension\nnames = ["ada", "grace", "alan"]\nlengths = {name: len(name) for name in names}\nprint(lengths)   # {"ada": 3, "grace": 5, "alan": 4}\n\n# Inverting a dictionary\noriginal = {"a": 1, "b": 2, "c": 3}\nflipped = {value: key for key, value in original.items()}\nprint(flipped)   # {1: "a", 2: "b", 3: "c"}\n\n# Set comprehension — unique first letters\nwords = ["apple", "apricot", "banana", "blueberry"]\ninitials = {w[0] for w in words}\nprint(initials)   # {"a", "b"}` },
      { t: 'text', md: '## Nested comprehensions\n\nA comprehension inside a comprehension builds a 2D structure. Read the outer comprehension first — it is the "rows".' },
      { t: 'code', run: true, code: `# Multiplication table as a list of lists\ntable = [[row * col for col in range(1, 4)] for row in range(1, 4)]\nfor r in table:\n    print(r)\n# [1, 2, 3]\n# [2, 4, 6]\n# [3, 6, 9]\n\n# Flattening a nested list\nnested = [[1, 2], [3, 4], [5, 6]]\nflat = [num for row in nested for num in row]\nprint(flat)   # [1, 2, 3, 4, 5, 6]` },
      {
        t: 'case',
        title: 'Case study — building a word index',
        md: 'Given a list of sentences, build a dictionary mapping each word to the set of sentence indices where it appears. A dict comprehension with a nested set comprehension and enumerate makes this almost trivial.',
        run: true,
        code: `sentences = [\n    "the cat sat on the mat",\n    "the dog sat on the log",\n    "the cat chased the dog",\n]\n\n# Build the index manually to show the shape\nindex = {}\nfor i, sentence in enumerate(sentences):\n    for word in sentence.split():\n        if word not in index:\n            index[word] = set()\n        index[word].add(i)\n\nfor word, locations in sorted(index.items()):\n    print(f"{word}: appears in sentences {sorted(locations)}")\n\n# The compact version with defaultdict\nfrom collections import defaultdict\nindex2 = defaultdict(set)\nfor i, sentence in enumerate(sentences):\n    for word in sentence.split():\n        index2[word].add(i)\nprint("\\nCompact:", dict(index2))`,
      },
      {
        t: 'try',
        prompt: 'Write `word_lengths(words)` that returns a dict mapping each word to its length using a dict comprehension. Example: `word_lengths(["hi", "hello"])` → `{"hi": 2, "hello": 5}`.',
        starter: `def word_lengths(words):\n    pass\n`,
        solution: `def word_lengths(words):\n    return {word: len(word) for word in words}\n`,
        hints: ['The key is word, the value is len(word).', 'Use a dict comprehension: {word: len(word) for word in words}.', 'Return the comprehension directly.'],
        cases: [
          { name: 'maps lengths', call: 'word_lengths(["hi", "hello"])', expect: '{"hi": 2, "hello": 5}' },
          { name: 'empty list', call: 'word_lengths([])', expect: '{}' },
        ],
      },
      { t: 'quiz', q: 'When should you use a loop instead of a comprehension?', options: ['Never — comprehensions are always better', 'When the logic spans more than one or two lines or has side effects — readability matters more than brevity', 'Comprehensions are always slower', 'Only for lists'], answer: 1, why: 'A comprehension that wraps across three lines with nested ifs is harder to read than a well-named loop. Use the clearer form.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `flatten(matrix)` that takes a list of lists and returns a single flat list using a nested comprehension.\n\n`flatten([[1, 2], [3, 4], [5]])` → `[1, 2, 3, 4, 5]`\n\nUse `[item for row in matrix for item in row]`. Read it: \"for each row in matrix, for each item in row, give me item\".",
            "starter": "def flatten(matrix):\n    pass\n",
            "solution": "def flatten(matrix):\n    return [item for row in matrix for item in row]\n",
            "hints": [
                  "The order: for row in matrix, then for item in row.",
                  "The expression at the front is just item.",
                  "One line — return the comprehension directly."
            ],
            "cases": [
                  {
                        "name": "3x2",
                        "call": "flatten([[1, 2], [3, 4], [5, 6]])",
                        "expect": "[1, 2, 3, 4, 5, 6]"
                  },
                  {
                        "name": "empty",
                        "call": "flatten([])",
                        "expect": "[]"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 29 */
  {
    id: 'py-l29',
    topic: 'comprehensions',
    difficulty: 'advanced',
    title: 'Generator Expressions and Memory Efficiency',
    minutes: 13,
    summary: 'Generator expressions — comprehensions that do not build the whole result in memory. Plus yield and yield from.',
    objectives: ['Write a generator expression', 'Use sum/min/max with generators', 'Write a generator function with yield'],
    blocks: [
      { t: 'text', md: 'A list comprehension builds the entire list in memory. For large inputs — millions of rows, infinite sequences — that is impossible. **Generator expressions** are identical in syntax but use parentheses instead of brackets. They produce items **one at a time, on demand**.' },
      { t: 'code', run: true, code: `# List — builds everything in memory\nsquares_list = [n * n for n in range(10)]\nprint(squares_list, type(squares_list))\n\n# Generator — yields items lazily\nsquares_gen = (n * n for n in range(10))\nprint(squares_gen, type(squares_gen))\nprint(list(squares_gen))   # materialise when needed\n\n# Built-ins consume generators directly\nprint(sum(n * n for n in range(1_000_000)))   # no 1M-item list created` },
      { t: 'text', md: '## Generator functions with yield\n\nA function that uses `yield` instead of `return` becomes a **generator function**. It pauses after each yield and resumes on the next request — like a function that can be paused and unpaused.' },
      { t: 'code', run: true, code: `def fibonacci(limit):\n    """Generate Fibonacci numbers up to \`limit\`."""\n    a, b = 0, 1\n    while a <= limit:\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(100):\n    print(num, end=" ")\nprint()\n\n# yield from delegates to another generator\ndef all_fibs():\n    yield from fibonacci(10)\n    yield from fibonacci(50)\n\nprint(list(all_fibs()))` },
      {
        t: 'case',
        title: 'Case study — processing a large log file line by line',
        md: 'A server log file that is too large to fit in memory. The generator reads one line at a time, parses it, and yields only the matching entries. The caller can take the first 5 results without ever loading the full file.',
        run: true,
        code: `# Simulate a large log file with a generator\nLOG_LINES = [\n    "INFO  user login",\n    "DEBUG cache hit",\n    "ERROR disk full",\n    "INFO  user logout",\n    "ERROR timeout",\n    "DEBUG gc run",\n    "ERROR connection refused",\n]\n\ndef error_lines(lines):\n    """Yield only ERROR lines, stripped of the prefix."""\n    for line in lines:\n        if line.startswith("ERROR"):\n            yield line[6:]   # strip "ERROR "\n\n# Process without materialising a filtered list\nerrors = error_lines(LOG_LINES)\nprint("First 2 errors:")\nfor i, error in enumerate(errors):\n    if i >= 2:\n        break\n    print(f"  {error}")`,
      },
      {
        t: 'try',
        prompt: 'Write `evens_up_to(n)` as a generator function that yields even numbers from 2 up to `n` inclusive. Example: `list(evens_up_to(6))` → `[2, 4, 6]`.',
        starter: `def evens_up_to(n):\n    pass\n`,
        solution: `def evens_up_to(n):\n    for i in range(2, n + 1, 2):\n        yield i\n`,
        hints: ['Use range(2, n+1, 2) to step by twos.', 'yield each value instead of returning a list.', 'No square brackets — this is a generator function, not a comprehension.'],
        cases: [
          { name: 'up to 6', call: 'list(evens_up_to(6))', expect: '[2, 4, 6]' },
          { name: 'up to 3', call: 'list(evens_up_to(3))', expect: '[2]' },
          { name: 'empty range', call: 'list(evens_up_to(1))', expect: '[]' },
        ],
      },
      { t: 'quiz', q: 'Why use a generator expression instead of a list comprehension when summing?', options: ['It is faster', 'The generator does not build an intermediate list in memory — sum() consumes items one at a time, so it works on enormous inputs', 'Generators sort the data', 'There is no difference'], answer: 1, why: '`sum(n*n for n in range(1_000_000))` creates no list. The equivalent list comprehension would allocate a million integers first.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `flatten(matrix)` that takes a list of lists and returns a single flat list using a nested comprehension.\n\n`flatten([[1, 2], [3, 4], [5]])` → `[1, 2, 3, 4, 5]`\n\nUse `[item for row in matrix for item in row]`. Read it: \"for each row in matrix, for each item in row, give me item\".",
            "starter": "def flatten(matrix):\n    pass\n",
            "solution": "def flatten(matrix):\n    return [item for row in matrix for item in row]\n",
            "hints": [
                  "The order: for row in matrix, then for item in row.",
                  "The expression at the front is just item.",
                  "One line — return the comprehension directly."
            ],
            "cases": [
                  {
                        "name": "3x2",
                        "call": "flatten([[1, 2], [3, 4], [5, 6]])",
                        "expect": "[1, 2, 3, 4, 5, 6]"
                  },
                  {
                        "name": "empty",
                        "call": "flatten([])",
                        "expect": "[]"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 30 */
  {
    id: 'py-l30',
    topic: 'oop',
    difficulty: 'beginner',
    title: 'Classes and Instances',
    minutes: 13,
    summary: 'Bundling data with the functions that operate on it — the idea object-oriented programming is built around.',
    objectives: ['Define a class with __init__', 'Create instances', 'Call methods on self'],
    blocks: [
      { t: 'text', md: 'A **class** is a blueprint. An **instance** is one thing built from it. Blueprint: `Dog`. Instances: `rex`, `bella` — same shape, different data.\n\nClasses bundle data (attributes) with the functions that work on that data (methods). The first parameter of every method is `self` — the specific instance being operated on.' },
      { t: 'code', run: true, code: `class Dog:\n    """A dog with a name and an age."""\n\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def speak(self):\n        return f"{self.name} says woof!"\n\n    def human_years(self):\n        return self.age * 7\n\nrex = Dog("Rex", 3)\nbella = Dog("Bella", 5)\n\nprint(rex.speak())\nprint(bella.speak())\nprint(f"Rex is {rex.human_years()} in human years")` },
      { t: 'text', md: '`__init__` is the **constructor** — it runs automatically when you call `Dog(...)`. `self.name = name` stores the argument on the instance. Each instance gets its own copy of the data.' },
      {
        t: 'case',
        title: 'Case study — a BankAccount class',
        md: 'A class that models a real bank account: it stores a balance, enforces that you cannot withdraw more than you have, and returns a formatted statement. The data is private (`_balance`) and accessed through methods — the class controls its own rules.',
        run: true,
        code: `class BankAccount:\n    """A simple bank account."""\n\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n        self._transactions = []\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("deposit must be positive")\n        self._balance += amount\n        self._transactions.append(amount)\n        return self._balance\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("withdrawal must be positive")\n        if amount > self._balance:\n            raise ValueError("insufficient funds")\n        self._balance -= amount\n        self._transactions.append(-amount)\n        return self._balance\n\n    def statement(self):\n        return f"{self.owner}: balance {self._balance}, {len(self._transactions)} transactions"\n\naccount = BankAccount("Ada", 100)\naccount.deposit(50)\naccount.withdraw(30)\nprint(account.statement())`,
      },
      {
        t: 'try',
        prompt: 'Define a `Counter` class with: a `count` attribute starting at 0, an `increment()` method that adds 1, and a `reset()` method that sets count back to 0.',
        starter: `class Counter:\n    pass\n`,
        solution: `class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def increment(self):\n        self.count += 1\n\n    def reset(self):\n        self.count = 0\n`,
        hints: ['__init__ sets self.count = 0.', 'increment does self.count += 1.', 'reset does self.count = 0.'],
        cases: [
          { name: 'starts at zero', call: 'Counter().count', expect: '0' },
          { name: 'increments', call: '(lambda c: (c.increment(), c.increment(), c.count)[-1])(Counter())', expect: '2' },
        ],
      },
      { t: 'quiz', q: 'What does `self` refer to inside a method?', options: ['The class blueprint', 'The specific instance the method was called on', 'The global namespace', 'The parent class'], answer: 1, why: '`self` is a convention (not a keyword) for the first parameter, which receives the instance. `rex.speak()` passes `rex` as `self`.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Create a `Playlist` class. Constructor takes a `name`. Add `add_song(title)` to append to an internal list, `remove_song(title)` to remove the first occurrence, and a `count` property (using @property) that returns the number of songs.",
            "starter": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        pass\n\n    def remove_song(self, title):\n        pass\n\n    @property\n    def count(self):\n        pass\n",
            "solution": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        self._songs.append(title)\n\n    def remove_song(self, title):\n        if title in self._songs:\n            self._songs.remove(title)\n\n    @property\n    def count(self):\n        return len(self._songs)\n",
            "hints": [
                  "add_song: self._songs.append(title).",
                  "remove_song: check with \"if title in self._songs\" first.",
                  "@property count returns len(self._songs)."
            ],
            "cases": [
                  {
                        "name": "add and count",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "2"
                  },
                  {
                        "name": "remove",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.remove_song(\"a\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "1"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 31 */
  {
    id: 'py-l31',
    topic: 'oop',
    difficulty: 'intermediate',
    title: 'Inheritance and Properties',
    minutes: 14,
    summary: 'Subclassing to share behaviour, @property for controlled attribute access, and the Liskov principle.',
    objectives: ['Subclass to reuse code', 'Use @property for computed attributes', 'Override methods in children'],
    blocks: [
      { t: 'text', md: '**Inheritance** lets a class borrow everything from a parent class and then extend or override what it needs. The child **is-a** parent — a `SavingsAccount` is a `BankAccount` with extra rules.\n\n```python\nclass Child(Parent):\n    ...\n```' },
      { t: 'code', run: true, code: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "???"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says meow"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says woof"\n\npets = [Cat("Whiskers"), Dog("Rex"), Cat("Mittens")]\nfor pet in pets:\n    print(pet.speak())` },
      { t: 'text', md: '## Properties\n\n`@property` turns a method into something that looks like an attribute. Use it when getting a value needs computation (like a full name from first + last), but setting it should be controlled.' },
      { t: 'code', run: true, code: `class Person:\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n\n    @property\n    def full_name(self):\n        """Computed, read-only."""\n        return f"{self.first} {self.last}"\n\n    @property\n    def email(self):\n        return f"{self.first.lower()}.{self.last.lower()}@example.com"\n\np = Person("Ada", "Lovelace")\nprint(p.full_name)    # no parentheses — looks like an attribute\nprint(p.email)\n# p.full_name = "x"   # AttributeError — no setter defined` },
      {
        t: 'case',
        title: 'Case study — a shape hierarchy with polymorphism',
        md: 'Different shapes (circle, rectangle, triangle) each know how to compute their own area. A single `total_area` function works with any shape because it only depends on the `area()` method — not on the specific type. That is **polymorphism**.',
        run: true,
        code: `import math\n\n\nclass Shape:\n    """Abstract base — not meant to be instantiated directly."""\n    def area(self):\n        raise NotImplementedError\n\n    def describe(self):\n        return f"{type(self).__name__} has area {self.area():.2f}"\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\nshapes = [Circle(2), Rectangle(3, 4), Circle(1.5)]\nfor shape in shapes:\n    print(shape.describe())\nprint(f"\\nTotal: {sum(s.area() for s in shapes):.2f}")`,
      },
      {
        t: 'try',
        prompt: 'Create a `Vehicle` base class with a `describe()` method returning `"A vehicle"`. Then create a `Car(Vehicle)` subclass overriding `describe()` to return `"A car"`.',
        starter: `class Vehicle:\n    pass\n\nclass Car(Vehicle):\n    pass\n`,
        solution: `class Vehicle:\n    def describe(self):\n        return "A vehicle"\n\nclass Car(Vehicle):\n    def describe(self):\n        return "A car"\n`,
        hints: ['Vehicle.describe returns "A vehicle".', 'Car inherits from Vehicle: class Car(Vehicle).', 'Car.describe overrides the parent method.'],
        cases: [
          { name: 'vehicle describes itself', call: 'Vehicle().describe()', expect: '"A vehicle"' },
          { name: 'car overrides', call: 'Car().describe()', expect: '"A car"' },
        ],
      },
      { t: 'quiz', q: 'What is the advantage of `@property` over a plain method like `get_full_name()`?', options: ['It is faster', 'It lets you access `obj.full_name` like an attribute while still running code — callers do not need to change if you later switch from a stored attribute to a computed one', 'Properties are required by Python', 'There is no advantage'], answer: 1, why: 'Properties let you evolve a public API: start with a plain attribute, then swap in a @property with computation behind it without changing any caller code.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Create a `Playlist` class. Constructor takes a `name`. Add `add_song(title)` to append to an internal list, `remove_song(title)` to remove the first occurrence, and a `count` property (using @property) that returns the number of songs.",
            "starter": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        pass\n\n    def remove_song(self, title):\n        pass\n\n    @property\n    def count(self):\n        pass\n",
            "solution": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        self._songs.append(title)\n\n    def remove_song(self, title):\n        if title in self._songs:\n            self._songs.remove(title)\n\n    @property\n    def count(self):\n        return len(self._songs)\n",
            "hints": [
                  "add_song: self._songs.append(title).",
                  "remove_song: check with \"if title in self._songs\" first.",
                  "@property count returns len(self._songs)."
            ],
            "cases": [
                  {
                        "name": "add and count",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "2"
                  },
                  {
                        "name": "remove",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.remove_song(\"a\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "1"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 32 */
  {
    id: 'py-l32',
    topic: 'oop',
    difficulty: 'advanced',
    title: 'Dunder Methods and Protocols',
    minutes: 15,
    summary: '__str__, __repr__, __eq__, __hash__, __len__, __iter__ — the methods that make your objects behave like built-ins.',
    objectives: ['Implement __str__ and __repr__', 'Make objects comparable with __eq__ and __lt__', 'Make a class iterable and hashable'],
    blocks: [
      { t: 'text', md: '**Dunder methods** (double underscore) are how your objects plug into Python\'s syntax. Define `__add__` and `+` works. Define `__len__` and `len()` works. Define `__eq__` and `==` compares your way. They are not magic — they are a contract.' },
      { t: 'code', run: true, code: `class Vector:\n    """An immutable 2D vector."""\n\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __eq__(self, other):\n        return isinstance(other, Vector) and (self.x, self.y) == (other.x, other.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\n    def __abs__(self):\n        return (self.x ** 2 + self.y ** 2) ** 0.5\n\n    def __iter__(self):\n        yield self.x\n        yield self.y\n\nv1 = Vector(3, 4)\nv2 = Vector(1, 2)\n\nprint(v1)                   # Vector(3, 4) — uses __repr__\nprint(v1 + v2)              # Vector(4, 6) — uses __add__\nprint(v1 == Vector(3, 4))   # True — uses __eq__\nprint(abs(v1))              # 5.0 — uses __abs__\nx, y = v1                   # unpacking — uses __iter__\nprint(x, y)\nprint({v1, v2})             # uses __hash__` },
      {
        t: 'case',
        title: 'Case study — a Money value type',
        md: 'A value type for money that prevents floating-point drift by storing pence as an integer. The dunder methods let you add, compare, format and use Money objects in sets and as dict keys — indistinguishable from a built-in type.',
        run: true,
        code: `class Money:\n    """An amount of money, stored as whole pence to avoid float drift."""\n\n    def __init__(self, pounds=0, pence=0):\n        total_pence = pounds * 100 + pence\n        self._pence = total_pence\n\n    @property\n    def pounds(self):\n        return self._pence / 100\n\n    def __add__(self, other):\n        return Money(pence=self._pence + other._pence)\n\n    def __sub__(self, other):\n        return Money(pence=self._pence - other._pence)\n\n    def __eq__(self, other):\n        return isinstance(other, Money) and self._pence == other._pence\n\n    def __hash__(self):\n        return hash(self._pence)\n\n    def __lt__(self, other):\n        return self._pence < other._pence\n\n    def __repr__(self):\n        return f"Money(\\u00a3{self.pounds:.2f})"\n\n\nprice = Money(9, 99)\ntax = Money(2, 50)\ntotal = price + tax\nprint(f"{price} + {tax} = {total}")\nprint(f"price < tax? {price < tax}")\nprint(f"price == Money(9, 99)? {price == Money(9, 99)}")`,
      },
      { t: 'quiz', q: 'Why must you define `__hash__` when you define `__eq__`?', options: ['It is a style convention', 'Python automatically sets __hash__ to None when __eq__ is defined, making the object unhashable — you must explicitly restore it if your objects are immutable and you want them in sets or as dict keys', '`__eq__` requires it syntactically', 'It does not matter'], answer: 1, why: 'The rule: if two objects are equal they must have the same hash. Python cannot guarantee that for your custom __eq__, so it disables hashing until you opt back in.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Create a `Temperature` class. The constructor takes `celsius`. Add a method `fahrenheit()` that returns the Fahrenheit equivalent (c * 9/5 + 32), and a method `kelvin()` that returns Kelvin (c + 273.15). Both should round to 2 decimal places.",
            "starter": "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    def fahrenheit(self):\n        pass\n\n    def kelvin(self):\n        pass\n",
            "solution": "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    def fahrenheit(self):\n        return round(self.celsius * 9 / 5 + 32, 2)\n\n    def kelvin(self):\n        return round(self.celsius + 273.15, 2)\n",
            "hints": [
                  "Fahrenheit formula: celsius * 9 / 5 + 32.",
                  "Kelvin formula: celsius + 273.15.",
                  "Wrap each in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "freezing fahrenheit",
                        "call": "Temperature(0).fahrenheit()",
                        "expect": "32.0"
                  },
                  {
                        "name": "freezing kelvin",
                        "call": "Temperature(0).kelvin()",
                        "expect": "273.15"
                  },
                  {
                        "name": "boiling",
                        "call": "Temperature(100).fahrenheit()",
                        "expect": "212.0"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Create a `Playlist` class. Constructor takes a `name`. Add `add_song(title)` to append to an internal list, `remove_song(title)` to remove the first occurrence, and a `count` property (using @property) that returns the number of songs.",
            "starter": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        pass\n\n    def remove_song(self, title):\n        pass\n\n    @property\n    def count(self):\n        pass\n",
            "solution": "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._songs = []\n\n    def add_song(self, title):\n        self._songs.append(title)\n\n    def remove_song(self, title):\n        if title in self._songs:\n            self._songs.remove(title)\n\n    @property\n    def count(self):\n        return len(self._songs)\n",
            "hints": [
                  "add_song: self._songs.append(title).",
                  "remove_song: check with \"if title in self._songs\" first.",
                  "@property count returns len(self._songs)."
            ],
            "cases": [
                  {
                        "name": "add and count",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "2"
                  },
                  {
                        "name": "remove",
                        "call": "(lambda p: (p.add_song(\"a\"), p.add_song(\"b\"), p.remove_song(\"a\"), p.count)[-1])(Playlist(\"test\"))",
                        "expect": "1"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 33 */
  {
    id: 'py-l33',
    topic: 'modules',
    difficulty: 'beginner',
    title: 'Importing and the Standard Library',
    minutes: 11,
    summary: 'import, from ... import, and a tour of the modules Python ships with.',
    objectives: ['Import a module', 'Use from ... import', 'Find your way around the standard library'],
    blocks: [
      { t: 'text', md: 'Python comes with **batteries included** — a standard library of modules for files, maths, dates, networking, compression, testing and much more. You access them with `import`.\n\n```python\nimport math\nprint(math.sqrt(25))    # 5.0\n\nfrom datetime import datetime\nprint(datetime.now())   # current date and time\n```' },
      { t: 'code', run: true, code: `import math\nimport random\nfrom datetime import datetime, timedelta\nfrom collections import Counter\n\nprint("sqrt(2):", math.sqrt(2))\nprint("pi:", math.pi)\nprint("random choice:", random.choice(["a", "b", "c"]))\nprint("now:", datetime.now())\nprint("tomorrow:", datetime.now() + timedelta(days=1))\nprint("counter:", Counter("abracadabra"))` },
      { t: 'text', md: 'The modules you will reach for most often:\n\n| Module | For |\n|---|---|\n| `math` | trigonometry, logs, constants |\n| `random` | shuffling, random picks |\n| `datetime` | dates, times, durations |\n| `collections` | Counter, defaultdict, deque |\n| `json` | reading and writing JSON |\n| `csv` | tabular data |\n| `pathlib` | file paths |\n| `re` | regular expressions |\n| `itertools` | advanced iteration |\n| `functools` | higher-order function tools |' },
      {
        t: 'case',
        title: 'Case study — a random password generator',
        md: 'Combine `random`, `string` and a list comprehension to generate a secure password of a given length. Each call produces a different result — `random.SystemRandom` uses OS-level entropy.',
        run: true,
        code: `import random\nimport string\n\n\ndef generate_password(length=16):\n    """Generate a random password of \`length\` characters."""\n    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"\n    rng = random.SystemRandom()\n    return "".join(rng.choice(alphabet) for _ in range(length))\n\nfor _ in range(3):\n    print(generate_password(12))`,
      },
      {
        t: 'try',
        prompt: 'Import `math` and write `circle_area(radius)` that returns the area (π × r²) rounded to 2 decimal places.',
        starter: `import math\n\ndef circle_area(radius):\n    pass\n`,
        solution: `import math\n\ndef circle_area(radius):\n    return round(math.pi * radius ** 2, 2)\n`,
        hints: ['math.pi gives the constant.', 'The formula is pi * r ** 2.', 'Wrap the result in round(..., 2).'],
        cases: [
          { name: 'radius 1', call: 'circle_area(1)', expect: '3.14' },
          { name: 'radius 2', call: 'circle_area(2)', expect: '12.57' },
        ],
      },
      { t: 'quiz', q: 'What is the difference between `import math` and `from math import sqrt`?', options: ['No difference', '`import math` brings the whole module; you call `math.sqrt()`. `from math import sqrt` brings only sqrt into your namespace; you call `sqrt()` directly', '`from` is deprecated', '`import` is faster'], answer: 1, why: '`import math` namespaces everything behind `math.`. `from math import sqrt` pulls one name into your scope. Both are fine; the first is clearer in large files.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Import `math` and write `circle_circumference(radius)` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse `math.pi` for the constant.",
            "starter": "import math\n\ndef circle_circumference(radius):\n    pass\n",
            "solution": "import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n",
            "hints": [
                  "math.pi gives the constant.",
                  "Formula: 2 * math.pi * radius.",
                  "Wrap in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "radius 1",
                        "call": "circle_circumference(1)",
                        "expect": "6.28"
                  },
                  {
                        "name": "radius 2",
                        "call": "circle_circumference(2)",
                        "expect": "12.57"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 34 */
  {
    id: 'py-l34',
    topic: 'modules',
    difficulty: 'intermediate',
    title: 'Creating Your Own Modules',
    minutes: 12,
    summary: 'Splitting your code across multiple .py files, relative imports, and the __init__.py file.',
    objectives: ['Split code into multiple files', 'Use relative imports within a package', 'Structure a package with __init__.py'],
    blocks: [
      { t: 'text', md: 'When a single `.py` file grows unwieldy, split it into **modules** — separate files that `import` each other. A directory containing an `__init__.py` (which may be empty) is a **package**.\n\n```\nmyproject/\n  __init__.py\n  models.py      # class User, class Order\n  utils.py       # helper functions\n  main.py        # entry point\n```\n\nFrom `main.py`: `from myproject.models import User`.\nFrom `models.py` (inside the package): `from .utils import format_name` — the dot means "in the same package".' },
      { t: 'code', run: true, code: `# This is what a package structure looks like conceptually.\n# The actual files would be on disk — here we simulate the idea.\n\n# --- utils.py ---\ndef slugify(text):\n    """Turn a title into a URL-friendly slug."""\n    return text.lower().replace(" ", "-")\n\n# --- models.py ---\nclass Article:\n    def __init__(self, title, body):\n        self.title = title\n        self.body = body\n\n    @property\n    def slug(self):\n        return slugify(self.title)   # imported from utils\n\n# --- main.py ---\narticle = Article("My First Post", "Hello, world!")\nprint(article.title)\nprint(article.slug)` },
      {
        t: 'case',
        title: 'Case study — a CLI tool split into modules',
        md: 'A command-line to-do app split across three files: `storage.py` handles JSON persistence, `models.py` defines the Task class, and `main.py` wires everything together. Each file has a single responsibility.',
        run: true,
        code: `# The conceptual layout — a real project would have these as separate files\n\n# --- storage.py ---\nimport json\n\ndef load(path):\n    """Load tasks from a JSON file."""\n    try:\n        with open(path) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return []\n\ndef save(path, tasks):\n    """Save tasks to a JSON file."""\n    with open(path, "w") as f:\n        json.dump(tasks, f, indent=2)\n\n# --- models.py ---\nfrom datetime import datetime\n\nclass Task:\n    def __init__(self, title, done=False):\n        self.title = title\n        self.done = done\n        self.created = datetime.now().isoformat()\n\n    def to_dict(self):\n        return {"title": self.title, "done": self.done, "created": self.created}\n\n# --- main.py ---\nDB = "tasks.json"\n\ndef add_task(title):\n    tasks = load(DB)\n    tasks.append(Task(title).to_dict())\n    save(DB, tasks)\n    print(f"Added: {title}")\n\ndef list_tasks():\n    for i, task in enumerate(load(DB), 1):\n        mark = "x" if task["done"] else " "\n        print(f"  [{mark}] {i}. {task['title']}")\n\nadd_task("Write module lesson")\nadd_task("Add tests")\nlist_tasks()`,
      },
      { t: 'quiz', q: 'What does `from . import helper` mean?', options: ['Import from the parent directory', 'Import from the same package (relative import)', 'Import from the standard library', 'It is a syntax error'], answer: 1, why: 'A leading dot is a **relative import**: `.` means the current package, `..` means the parent package. They only work inside a package.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Import `math` and write `circle_circumference(radius)` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse `math.pi` for the constant.",
            "starter": "import math\n\ndef circle_circumference(radius):\n    pass\n",
            "solution": "import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n",
            "hints": [
                  "math.pi gives the constant.",
                  "Formula: 2 * math.pi * radius.",
                  "Wrap in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "radius 1",
                        "call": "circle_circumference(1)",
                        "expect": "6.28"
                  },
                  {
                        "name": "radius 2",
                        "call": "circle_circumference(2)",
                        "expect": "12.57"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Import `math` and write `circle_circumference(radius)` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse `math.pi` for the constant.",
            "starter": "import math\n\ndef circle_circumference(radius):\n    pass\n",
            "solution": "import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n",
            "hints": [
                  "math.pi gives the constant.",
                  "Formula: 2 * math.pi * radius.",
                  "Wrap in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "radius 1",
                        "call": "circle_circumference(1)",
                        "expect": "6.28"
                  },
                  {
                        "name": "radius 2",
                        "call": "circle_circumference(2)",
                        "expect": "12.57"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 35 */
  {
    id: 'py-l35',
    topic: 'modules',
    difficulty: 'advanced',
    title: 'Publishing a Package',
    minutes: 13,
    summary: 'pyproject.toml, setuptools, and how to make your code `pip install`-able.',
    objectives: ['Write a pyproject.toml', 'Structure a publishable package', 'Understand semantic versioning'],
    blocks: [
      { t: 'text', md: 'Making your code installable with `pip` turns it from a script into a **package** — something others can depend on, and something you can deploy reliably.\n\nThe modern standard is `pyproject.toml` at the project root. A minimal one:\n\n```toml\n[build-system]\nrequires = ["setuptools>=68"]\nbuild-backend = "setuptools.backends._legacy:_Backend"\n\n[project]\nname = "my-package"\nversion = "0.1.0"\ndependencies = ["requests>=2"]\n```' },
      { t: 'text', md: '## Project structure\n\n```\nmy_package/\n  pyproject.toml\n  src/\n    my_package/\n      __init__.py\n      core.py\n  tests/\n    test_core.py\n```\n\nThe `src` layout prevents accidentally importing the package from the project root during development — forcing you to install it first, which catches packaging bugs early.\n\nSemantic versioning (`MAJOR.MINOR.PATCH`) communicates the nature of changes: breaking changes bump MAJOR, new features bump MINOR, fixes bump PATCH.' },
      {
        t: 'case',
        title: 'Case study — building a tiny pip-installable library',
        md: 'A minimal package called `texttools` with one function — `word_count(text)` — that you could publish to PyPI. The key files are shown; `pip install -e .` would install it in development mode so changes are reflected immediately.',
        run: true,
        code: `# Project structure:\n#   texttools/\n#     pyproject.toml\n#     src/texttools/__init__.py\n\n# --- pyproject.toml ---\n# [build-system]\n# requires = ["setuptools>=68"]\n# build-backend = "setuptools.backends._legacy:_Backend"\n# [project]\n# name = "texttools"\n# version = "0.1.0"\n\n# --- src/texttools/__init__.py ---\n\ndef word_count(text):\n    """Count words in a string, handling multiple spaces."""\n    return len(text.split())\n\ndef char_counts(text):\n    """Return counts of letters, digits and spaces."""\n    return {\n        "letters": sum(1 for c in text if c.isalpha()),\n        "digits": sum(1 for c in text if c.isdigit()),\n        "spaces": sum(1 for c in text if c.isspace()),\n    }\n\n# Usage (after pip install -e . or pip install texttools):\n# from texttools import word_count, char_counts\n\nsample = "Hello world 2024"\nprint(f"Words: {word_count(sample)}")\nprint(f"Chars: {char_counts(sample)}")`,
      },
      { t: 'quiz', q: 'Why does the `src` layout (putting code under `src/mypackage/`) exist?', options: ['It is required by PyPI', 'It prevents importing the package directly from the project root without installing it first — catching packaging bugs early', 'It is faster to import', 'Python requires `src/`'], answer: 1, why: 'If your code lives at the root, `import mypackage` works during development even if setup is broken. The src layout forces you to install it, making packaging errors visible immediately.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Import `math` and write `circle_circumference(radius)` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse `math.pi` for the constant.",
            "starter": "import math\n\ndef circle_circumference(radius):\n    pass\n",
            "solution": "import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n",
            "hints": [
                  "math.pi gives the constant.",
                  "Formula: 2 * math.pi * radius.",
                  "Wrap in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "radius 1",
                        "call": "circle_circumference(1)",
                        "expect": "6.28"
                  },
                  {
                        "name": "radius 2",
                        "call": "circle_circumference(2)",
                        "expect": "12.57"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Import `math` and write `circle_circumference(radius)` returning the circumference (2 × π × r), rounded to 2 decimal places.\n\nUse `math.pi` for the constant.",
            "starter": "import math\n\ndef circle_circumference(radius):\n    pass\n",
            "solution": "import math\n\ndef circle_circumference(radius):\n    return round(2 * math.pi * radius, 2)\n",
            "hints": [
                  "math.pi gives the constant.",
                  "Formula: 2 * math.pi * radius.",
                  "Wrap in round(..., 2)."
            ],
            "cases": [
                  {
                        "name": "radius 1",
                        "call": "circle_circumference(1)",
                        "expect": "6.28"
                  },
                  {
                        "name": "radius 2",
                        "call": "circle_circumference(2)",
                        "expect": "12.57"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 36 */
  {
    id: 'py-l36',
    topic: 'testing',
    difficulty: 'beginner',
    title: 'Assertions and doctests',
    minutes: 11,
    summary: 'Using `assert` to check assumptions, and embedding tests in docstrings with doctest.',
    objectives: ['Write assert statements', 'Run doctests', 'Understand the limits of assert'],
    blocks: [
      { t: 'text', md: 'The simplest test is `assert`. It checks that something is True, and raises `AssertionError` if it is not. Use it to document assumptions and catch regressions early.\n\n```python\nassert 2 + 2 == 4       # passes silently\nassert len([1,2]) == 3  # raises AssertionError\n```' },
      { t: 'code', run: true, code: `def double(n):\n    """Return n * 2.\n\n    >>> double(2)\n    4\n    >>> double(0)\n    0\n    >>> double(-3)\n    -6\n    """\n    return n * 2\n\n# doctest runs the examples in the docstring\nimport doctest\nresults = doctest.testmod(verbose=False)\nprint(f"Tests: {results.attempted} attempted, {results.failed} failed")\n\n# Manual asserts\nassert double(5) == 10\nassert double(0) == 0\nprint("All manual asserts passed")` },
      { t: 'text', md: '## When to use assert\n\n`assert` is for **debugging and testing** — checking things that should never happen if the code is correct. It is not for validating user input (use `raise ValueError`), and it can be disabled globally with the `-O` flag.' },
      {
        t: 'case',
        title: 'Case study — testing a utility module with doctest',
        md: 'A small set of string utilities, each with doctests embedded in their docstrings. Run the file directly and it self-tests. This pattern is ideal for small, pure functions with clear examples.',
        run: true,
        code: `def truncate(text, max_len, suffix="..."):\n    """Cut text to max_len, appending suffix if truncated.\n\n    >>> truncate("hello world", 5)\n    \'he...\'\n    >>> truncate("hi", 10)\n    \'hi\'\n    >>> truncate("abcde", 5, "!")\n    \'abcd!\'\n    """\n    if len(text) <= max_len:\n        return text\n    return text[:max_len - len(suffix)] + suffix\n\n\ndef is_palindrome(text):\n    """Check if text reads the same forwards and backwards.\n\n    >>> is_palindrome("racecar")\n    True\n    >>> is_palindrome("hello")\n    False\n    >>> is_palindrome("")\n    True\n    """\n    return text == text[::-1]\n\n\nimport doctest\nfailed, total = doctest.testmod(verbose=False)\nprint(f"Doctests: {total} run, {failed} failed")`,
      },
      {
        t: 'try',
        prompt: 'Write `is_even(n)` returning True for even numbers, with a docstring containing at least two doctest examples.',
        starter: `def is_even(n):\n    """Check if n is even.\n\n    >>> is_even(4)\n    True\n    >>> is_even(7)\n    False\n    """\n    pass\n`,
        solution: `def is_even(n):\n    """Check if n is even.\n\n    >>> is_even(4)\n    True\n    >>> is_even(7)\n    False\n    """\n    return n % 2 == 0\n`,
        hints: ['The docstring already has the tests — just implement the body.', 'n % 2 == 0 is True for even numbers.', 'Return the comparison directly.'],
        cases: [
          { name: 'even returns True', call: 'is_even(4)', expect: 'True' },
          { name: 'odd returns False', call: 'is_even(7)', expect: 'False' },
        ],
      },
      { t: 'quiz', q: 'Why not use `assert` for validating user input in production code?', options: ['It is too slow', 'assert can be globally disabled with `python -O`, silently removing all checks — use `raise ValueError` for runtime validation', 'assert only works in tests', 'It prints an ugly message'], answer: 1, why: 'The -O (optimise) flag strips all assert statements. They are a development and testing tool, not a runtime validation mechanism.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `is_palindrome(text)` returning `True` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n`is_palindrome(\"Racecar\")` → `True`",
            "starter": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    t = text.lower()\n    return t == t[::-1]\n",
            "hints": [
                  "Lowercase first: text.lower().",
                  "Compare with its reverse: text[::-1].",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "palindrome",
                        "call": "is_palindrome(\"Racecar\")",
                        "expect": "True"
                  },
                  {
                        "name": "not palindrome",
                        "call": "is_palindrome(\"hello\")",
                        "expect": "False"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 37 */
  {
    id: 'py-l37',
    topic: 'testing',
    difficulty: 'intermediate',
    title: 'Unit Testing with pytest',
    minutes: 13,
    summary: 'Writing test functions, fixtures, parametrised tests, and why pytest is the community standard.',
    objectives: ['Write a test function with pytest', 'Use fixtures for setup', 'Parametrise a test over multiple inputs'],
    blocks: [
      { t: 'text', md: '`pytest` is the de-facto testing framework for Python. Tests are functions whose names start with `test_`. Assertions use plain `assert` — pytest rewrites them to produce detailed failure messages automatically.\n\n```bash\npip install pytest\npytest test_module.py\n```' },
      { t: 'code', run: true, code: `# pytest-style tests (conceptual — would normally be in a separate file)\n# Run with: pytest test_example.py\n\n# --- The code under test ---\ndef add(a, b):\n    return a + b\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("cannot divide by zero")\n    return a / b\n\n# --- The tests ---\ndef test_add_basic():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n    assert add(0, 0) == 0\n\ndef test_add_floats():\n    assert add(0.1, 0.2) == 0.30000000000000004   # float reality\n\ndef test_divide_by_zero():\n    try:\n        divide(1, 0)\n        assert False, "should have raised"\n    except ValueError:\n        pass    # expected\n\n# Simulate running tests\nimport sys\npassed = failed = 0\nfor name, fn in [("test_add_basic", test_add_basic), ("test_add_floats", test_add_floats), ("test_divide_by_zero", test_divide_by_zero)]:\n    try:\n        fn()\n        print(f"  PASS {name}")\n        passed += 1\n    except AssertionError as e:\n        print(f"  FAIL {name}: {e}")\n        failed += 1\nprint(f"\\n{passed} passed, {failed} failed")` },
      { t: 'text', md: '## Fixtures and parametrisation\n\nA **fixture** is a reusable piece of setup — a database connection, a temporary file, a configured object. **Parametrisation** runs the same test with multiple inputs, giving a separate pass/fail for each.' },
      { t: 'code', run: true, code: `# Parametrised test pattern (conceptual — pytest uses @pytest.mark.parametrize)\n\ndef is_palindrome(s):\n    return s == s[::-1]\n\n# Manually parametrise\ncases = [\n    ("racecar", True),\n    ("hello", False),\n    ("", True),\n    ("a", True),\n    ("ab", False),\n]\n\nfor text, expected in cases:\n    result = is_palindrome(text)\n    assert result == expected, f'is_palindrome("{text}") = {result}, expected {expected}'\nprint(f"All {len(cases)} parametrised checks passed")` },
      {
        t: 'case',
        title: 'Case study — testing a shopping cart',
        md: 'A `Cart` class with add, remove, total and clear methods. The test covers normal usage, edge cases (removing a missing item), and the property that clearing the cart leaves a zero total. Each behaviour gets its own test function.',
        run: true,
        code: `class Cart:\n    def __init__(self):\n        self._items = {}\n\n    def add(self, item, price, qty=1):\n        self._items[item] = self._items.get(item, 0) + qty\n\n    def remove(self, item):\n        self._items.pop(item, None)\n\n    def total(self):\n        return sum(self._items.values())\n\n    def clear(self):\n        self._items.clear()\n\n# --- Tests ---\ndef test_add_increases_count():\n    cart = Cart()\n    cart.add("apple", 0.50)\n    cart.add("apple", 0.50)\n    assert cart.total() == 2, f"expected 2, got {cart.total()}"\n\ndef test_remove_missing_is_safe():\n    cart = Cart()\n    cart.remove("ghost")    # should not crash\n    assert cart.total() == 0\n\ndef test_clear_resets():\n    cart = Cart()\n    cart.add("apple", 0.50)\n    cart.clear()\n    assert cart.total() == 0\n\nfor name, test_fn in [\n    ("test_add_increases_count", test_add_increases_count),\n    ("test_remove_missing_is_safe", test_remove_missing_is_safe),\n    ("test_clear_resets", test_clear_resets),\n]:\n    try:\n        test_fn()\n        print(f"  PASS {name}")\n    except AssertionError as e:\n        print(f"  FAIL {name}: {e}")`,
      },
      { t: 'quiz', q: 'What is the main advantage of pytest over the built-in `unittest` module?', options: ['It runs faster', 'Tests are plain functions with assert — no TestCase subclassing, no self.assertEqual boilerplate. Fixtures and parametrisation are simpler', 'It is required by Python', 'unittest does not exist'], answer: 1, why: 'pytest removes the ceremony: no class wrapping, plain `assert`, powerful fixture/parametrise decorators, and rich failure output with no extra work.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `is_palindrome(text)` returning `True` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n`is_palindrome(\"Racecar\")` → `True`",
            "starter": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    t = text.lower()\n    return t == t[::-1]\n",
            "hints": [
                  "Lowercase first: text.lower().",
                  "Compare with its reverse: text[::-1].",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "palindrome",
                        "call": "is_palindrome(\"Racecar\")",
                        "expect": "True"
                  },
                  {
                        "name": "not palindrome",
                        "call": "is_palindrome(\"hello\")",
                        "expect": "False"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `is_palindrome(text)` returning `True` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n`is_palindrome(\"Racecar\")` → `True`",
            "starter": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    t = text.lower()\n    return t == t[::-1]\n",
            "hints": [
                  "Lowercase first: text.lower().",
                  "Compare with its reverse: text[::-1].",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "palindrome",
                        "call": "is_palindrome(\"Racecar\")",
                        "expect": "True"
                  },
                  {
                        "name": "not palindrome",
                        "call": "is_palindrome(\"hello\")",
                        "expect": "False"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 38 */
  {
    id: 'py-l38',
    topic: 'testing',
    difficulty: 'advanced',
    title: 'Mocking and Test Coverage',
    minutes: 14,
    summary: 'Replacing dependencies with mocks, patching, and measuring what your tests actually exercise.',
    objectives: ['Mock an external dependency', 'Use unittest.mock.patch', 'Interpret a coverage report'],
    blocks: [
      { t: 'text', md: 'Real code talks to databases, APIs, the file system. Tests must be **fast and isolated** — no network, no real disk writes. **Mocking** replaces a real object with a fake one that you control.\n\nThe standard library\'s `unittest.mock` (often used with pytest) provides `Mock`, `patch` and `MagicMock`.' },
      { t: 'code', run: true, code: `from unittest.mock import Mock, patch\n\ndef fetch_user_data(user_id):\n    """Pretend to call an external API — would actually do HTTP."""\n    import requests\n    response = requests.get(f"https://api.example.com/users/{user_id}")\n    return response.json()\n\n# We never want to hit real network in tests. Instead, mock requests.get.\nwith patch("__main__.requests.get") as mock_get:\n    mock_get.return_value.json.return_value = {"name": "Ada", "id": 1}\n    result = fetch_user_data(1)\n    print(result)\n    # No actual HTTP request was made` },
      { t: 'text', md: '## Test coverage\n\nCoverage measures which lines of your code were executed during tests. It does not tell you if the tests are good — only that the lines ran. Aim for high coverage on critical paths, but do not worship the percentage.\n\n```bash\npip install coverage\ncoverage run -m pytest\ncoverage report    # terminal summary\ncoverage html      # open htmlcov/index.html\n```' },
      {
        t: 'case',
        title: 'Case study — testing code that sends emails',
        md: 'A `notify_user` function that calls a hypothetical email service. In production, `send_email` connects to an SMTP server. In tests, we replace it with a Mock that records what it was called with — no real emails are sent. The test verifies the function was called exactly once with the right arguments.',
        run: true,
        code: `from unittest.mock import Mock\n\n# --- The real code (would normally be in a separate module) ---\nclass EmailService:\n    def send(self, to, subject, body):\n        """Send an email. In production this connects to SMTP."""\n        print(f"  (really sending to {to})")\n        return True\n\n\ndef notify_user(user_email, message, mailer=None):\n    """Send a notification email. mailer is injected for testability."""\n    if mailer is None:\n        mailer = EmailService()\n    mailer.send(to=user_email, subject="Notification", body=message)\n    return "sent"\n\n# --- The test (replaces EmailService with a Mock) ---\nmock_mailer = Mock()\nmock_mailer.send.return_value = True\n\nresult = notify_user("ada@example.com", "Your report is ready", mailer=mock_mailer)\n\n# Verify behaviour\nassert result == "sent"\nassert mock_mailer.send.called\nassert mock_mailer.send.call_count == 1\ncall_args = mock_mailer.send.call_args.kwargs\nassert call_args["to"] == "ada@example.com"\nassert call_args["subject"] == "Notification"\nprint("All mock assertions passed — no real emails were sent")`,
      },
      { t: 'quiz', q: 'Why is dependency injection (passing `mailer=None` as a parameter) useful for testing?', options: ['It makes the code slower', 'It lets tests swap in a mock without touching the real dependency, keeping tests fast and isolated', 'It is required by Python', 'There is no benefit'], answer: 1, why: 'Injecting dependencies means the function does not hard-code its dependencies. Tests pass in a Mock; production passes the real implementation. The code itself becomes more flexible.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `is_palindrome(text)` returning `True` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n`is_palindrome(\"Racecar\")` → `True`",
            "starter": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    t = text.lower()\n    return t == t[::-1]\n",
            "hints": [
                  "Lowercase first: text.lower().",
                  "Compare with its reverse: text[::-1].",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "palindrome",
                        "call": "is_palindrome(\"Racecar\")",
                        "expect": "True"
                  },
                  {
                        "name": "not palindrome",
                        "call": "is_palindrome(\"hello\")",
                        "expect": "False"
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `is_palindrome(text)` returning `True` if text reads the same forwards and backwards (ignoring case). Include a docstring with three doctest examples.\n\n`is_palindrome(\"Racecar\")` → `True`",
            "starter": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    pass\n",
            "solution": "def is_palindrome(text):\n    \"\"\"Check if text is a palindrome.\n\n    >>> is_palindrome(\"racecar\")\n    True\n    >>> is_palindrome(\"hello\")\n    False\n    >>> is_palindrome(\"Racecar\")\n    True\n    \"\"\"\n    t = text.lower()\n    return t == t[::-1]\n",
            "hints": [
                  "Lowercase first: text.lower().",
                  "Compare with its reverse: text[::-1].",
                  "Return the comparison directly."
            ],
            "cases": [
                  {
                        "name": "palindrome",
                        "call": "is_palindrome(\"Racecar\")",
                        "expect": "True"
                  },
                  {
                        "name": "not palindrome",
                        "call": "is_palindrome(\"hello\")",
                        "expect": "False"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 39 */
  {
    id: 'py-l39',
    topic: 'async',
    difficulty: 'beginner',
    title: 'Why Async and Your First Coroutine',
    minutes: 12,
    summary: 'The problem async solves (waiting without blocking), async/await syntax, and asyncio.run().',
    objectives: ['Explain why async exists', 'Define an async function', 'Run a coroutine with asyncio.run()'],
    blocks: [
      { t: 'text', md: 'Most programs spend most of their time **waiting** — for a network response, a file read, a database query. A normal function blocks: while it waits, nothing else runs.\n\n**Async** lets you write code that **pauses** during a wait, letting other work proceed, then **resumes** when the answer arrives. The keywords are `async def` and `await`. The runtime is `asyncio`.' },
      { t: 'code', run: true, code: `import asyncio\n\nasync def greet(name):\n    """An async function — it can pause and resume."""\n    await asyncio.sleep(0.5)   # simulate waiting for something\n    return f"Hello, {name}!"\n\nasync def main():\n    result = await greet("Ada")\n    print(result)\n\nasyncio.run(main())` },
      { t: 'text', md: '`async def` marks a **coroutine** — a function that can be paused. `await` says "pause here until this other coroutine finishes". `asyncio.run()` is the entry point — call it once at the top level.\n\nThe rule: you can only `await` inside an `async def` function. And you can only call `await` on something "awaitable" — another coroutine, or an asyncio primitive.' },
      {
        t: 'case',
        title: 'Case study — fetching two web pages concurrently',
        md: 'Fetching two URLs one after the other takes the sum of their times. Fetching them **concurrently** takes the time of the slowest one. `asyncio.gather()` runs coroutines at the same time — not in parallel (no threads), but cooperatively: while one waits for the network, the other runs.',
        run: true,
        code: `import asyncio\nimport time\n\n\nasync def pretend_fetch(url, delay):\n    """Simulate an HTTP request taking \`delay\` seconds."""\n    print(f"  Starting {url}...")\n    await asyncio.sleep(delay)\n    print(f"  Finished {url}")\n    return f"<content of {url}>"\n\n\nasync def main():\n    # Sequential — slow\n    t0 = time.perf_counter()\n    await pretend_fetch("/a", 0.5)\n    await pretend_fetch("/b", 0.5)\n    print(f"Sequential: {time.perf_counter() - t0:.2f}s\\n")\n\n    # Concurrent — fast\n    t0 = time.perf_counter()\n    results = await asyncio.gather(\n        pretend_fetch("/a", 0.5),\n        pretend_fetch("/b", 0.5),\n    )\n    print(f"Concurrent: {time.perf_counter() - t0:.2f}s")\n    print("Results:", results)\n\nasyncio.run(main())`,
      },
      {
        t: 'try',
        prompt: 'Write an async function `delayed_message(text, seconds)` that awaits `asyncio.sleep(seconds)` and then returns `text`.',
        starter: `import asyncio\n\nasync def delayed_message(text, seconds):\n    pass\n`,
        solution: `import asyncio\n\nasync def delayed_message(text, seconds):\n    await asyncio.sleep(seconds)\n    return text\n`,
        hints: ['Use await asyncio.sleep(seconds) to pause.', 'Return text after the sleep.', 'The function must be async def.'],
        cases: [
          { name: 'returns text after delay', call: '__run_async(delayed_message("done", 0.01))', expect: '"done"' },
        ],
        preamble: `async def __run_async(coro):\n    return await coro\n`,
      },
      { t: 'quiz', q: 'What does `await` do?', options: ['It makes the function run faster', 'It pauses the current coroutine until the awaited thing completes, letting other coroutines run in the meantime', 'It converts a coroutine to a thread', 'It cancels the function'], answer: 1, why: 'await yields control back to the event loop, which can run other coroutines. When the awaited thing finishes, the coroutine resumes where it left off.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `delayed_greeting(name, seconds)` as an async function that awaits `asyncio.sleep(seconds)` and then returns `\"Hello, {name}!\"`.\n\nImport asyncio at the top.",
            "starter": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n",
            "solution": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f\"Hello, {name}!\"\n",
            "hints": [
                  "await asyncio.sleep(seconds) pauses the coroutine.",
                  "Return an f-string after the sleep.",
                  "The function must be async def."
            ],
            "cases": [
                  {
                        "name": "returns greeting",
                        "call": "__run_async(delayed_greeting(\"Ada\", 0.01))",
                        "expect": "\"Hello, Ada!\""
                  }
            ],
            "preamble": "async def __run_async(coro):\n    return await coro\n"
      },

    ],
  },

  /* ==================================================== 40 */
  {
    id: 'py-l40',
    topic: 'async',
    difficulty: 'intermediate',
    title: 'Tasks, gather and Error Handling',
    minutes: 13,
    summary: 'Creating Tasks for fire-and-forget work, gathering results, and handling exceptions in async code.',
    objectives: ['Create and await asyncio.Tasks', 'Use asyncio.gather with return_exceptions', 'Handle async timeouts'],
    blocks: [
      { t: 'text', md: '`asyncio.create_task()` schedules a coroutine to run **in the background** — it returns immediately and the coroutine runs whenever it gets a chance. Tasks are the async equivalent of starting a thread, but they are lightweight and share one OS thread.\n\n`asyncio.gather()` waits for multiple awaitables and returns their results in order. Pass `return_exceptions=True` to collect errors as values instead of crashing.' },
      { t: 'code', run: true, code: `import asyncio\n\nasync def worker(name, seconds):\n    print(f"  {name} starting")\n    await asyncio.sleep(seconds)\n    print(f"  {name} done")\n    return f"{name} result"\n\nasync def main():\n    # Launch both at once\n    task_a = asyncio.create_task(worker("A", 0.3))\n    task_b = asyncio.create_task(worker("B", 0.1))\n\n    # Do other work while they run...\n    print("  main: tasks launched, doing other things...")\n    await asyncio.sleep(0.05)\n\n    # Now wait for them\n    results = await asyncio.gather(task_a, task_b)\n    print("Results:", results)\n\nasyncio.run(main())` },
      { t: 'text', md: '## Handling errors\n\nIf one task in a `gather()` raises, the default behaviour is to cancel the others and re-raise. With `return_exceptions=True`, exceptions are returned as values — you can inspect them afterward.' },
      { t: 'code', run: true, code: `import asyncio\n\nasync def risky(name, should_fail):\n    await asyncio.sleep(0.05)\n    if should_fail:\n        raise ValueError(f"{name} failed!")\n    return f"{name} ok"\n\nasync def main():\n    results = await asyncio.gather(\n        risky("A", False),\n        risky("B", True),\n        risky("C", False),\n        return_exceptions=True,\n    )\n    for i, result in enumerate(results):\n        if isinstance(result, Exception):\n            print(f"  Task {i} errored: {result}")\n        else:\n            print(f"  Task {i} returned: {result}")\n\nasyncio.run(main())` },
      {
        t: 'case',
        title: 'Case study — a concurrent link checker',
        md: 'Check a list of URLs for broken links — but do it concurrently so 20 URLs take roughly the time of the slowest one, not 20× the time. Each URL gets its own task. `gather` with `return_exceptions` prevents one broken URL from aborting the whole batch.',
        run: true,
        code: `import asyncio\n\n\nasync def check_url(url, session_id):\n    """Simulate an HTTP HEAD request."""\n    # In real code: aiohttp, httpx or similar\n    await asyncio.sleep(0.1)   # network latency\n    # Simulate some failures\n    if "/broken" in url:\n        return (url, 404, f"Not Found (session {session_id})")\n    if "/timeout" in url:\n        raise asyncio.TimeoutError(f"{url} timed out")\n    return (url, 200, "OK")\n\n\nasync def check_all(urls):\n    tasks = [asyncio.create_task(check_url(url, i)) for i, url in enumerate(urls)]\n    results = await asyncio.gather(*tasks, return_exceptions=True)\n\n    for i, result in enumerate(results):\n        if isinstance(result, Exception):\n            print(f"  {urls[i]}: ERROR — {result}")\n        else:\n            url, code, msg = result\n            print(f"  {url}: {code} {msg}")\n\n\nurls = [\n    "https://example.com/home",\n    "https://example.com/about",\n    "https://example.com/broken",\n    "https://example.com/contact",\n    "https://example.com/timeout",\n]\nasyncio.run(check_all(urls))`,
      },
      { t: 'quiz', q: 'Why use `asyncio.create_task()` instead of just `await`?', options: ['create_task is faster', 'create_task schedules the coroutine to run immediately in the background, allowing you to launch several concurrent operations and await them later', 'Tasks can be cancelled', 'There is no difference'], answer: 1, why: '`await coro` runs it now and blocks until done. `create_task(coro)` schedules it to run as soon as possible and returns a handle you can await later, enabling concurrency.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `delayed_greeting(name, seconds)` as an async function that awaits `asyncio.sleep(seconds)` and then returns `\"Hello, {name}!\"`.\n\nImport asyncio at the top.",
            "starter": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n",
            "solution": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f\"Hello, {name}!\"\n",
            "hints": [
                  "await asyncio.sleep(seconds) pauses the coroutine.",
                  "Return an f-string after the sleep.",
                  "The function must be async def."
            ],
            "cases": [
                  {
                        "name": "returns greeting",
                        "call": "__run_async(delayed_greeting(\"Ada\", 0.01))",
                        "expect": "\"Hello, Ada!\""
                  }
            ],
            "preamble": "async def __run_async(coro):\n    return await coro\n"
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `delayed_greeting(name, seconds)` as an async function that awaits `asyncio.sleep(seconds)` and then returns `\"Hello, {name}!\"`.\n\nImport asyncio at the top.",
            "starter": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n",
            "solution": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f\"Hello, {name}!\"\n",
            "hints": [
                  "await asyncio.sleep(seconds) pauses the coroutine.",
                  "Return an f-string after the sleep.",
                  "The function must be async def."
            ],
            "cases": [
                  {
                        "name": "returns greeting",
                        "call": "__run_async(delayed_greeting(\"Ada\", 0.01))",
                        "expect": "\"Hello, Ada!\""
                  }
            ],
            "preamble": "async def __run_async(coro):\n    return await coro\n"
      },

    ],
  },

  /* ==================================================== 41 */
  {
    id: 'py-l41',
    topic: 'async',
    difficulty: 'advanced',
    title: 'Async Context Managers, Queues and Real-World Patterns',
    minutes: 15,
    summary: 'Async with, async for, asyncio.Queue for producer-consumer, and the patterns that power production async services.',
    objectives: ['Write an async context manager', 'Use asyncio.Queue for work distribution', 'Structure a long-running async service'],
    blocks: [
      { t: 'text', md: 'Real async applications go beyond `gather`. They use **queues** for work distribution, **async context managers** for resource lifecycle, and **async iterators** for streaming data.\n\n`asyncio.Queue` is a bounded buffer — producers put items in, consumers take them out. It is the building block of worker pools and pipelines.' },
      { t: 'code', run: true, code: `import asyncio\n\nasync def producer(queue, items):\n    """Put items into the queue."""\n    for item in items:\n        await queue.put(item)\n        print(f"  produced {item}")\n        await asyncio.sleep(0.05)\n    await queue.put(None)   # sentinel: no more items\n\nasync def consumer(queue, name):\n    """Take items and process them."""\n    while True:\n        item = await queue.get()\n        if item is None:\n            queue.task_done()\n            break\n        print(f"  {name} processing {item}")\n        await asyncio.sleep(0.1)   # simulate work\n        queue.task_done()\n\nasync def main():\n    queue = asyncio.Queue(maxsize=3)\n    prod = asyncio.create_task(producer(queue, [1, 2, 3, 4, 5]))\n    cons = [asyncio.create_task(consumer(queue, f"C{i}")) for i in range(2)]\n    await prod\n    await asyncio.gather(*cons)\n    print("All done")\n\nasyncio.run(main())` },
      { t: 'text', md: '## Async context managers\n\nUse `async with` for resources that need async setup or teardown — database connections, HTTP sessions, lock acquisition.' },
      { t: 'code', run: true, code: `import asyncio\n\nclass AsyncConnection:\n    """Simulate an async database connection."""\n    def __init__(self, name):\n        self.name = name\n\n    async def __aenter__(self):\n        print(f"  Connecting to {self.name}...")\n        await asyncio.sleep(0.1)\n        return self\n\n    async def __aexit__(self, *args):\n        print(f"  Closing {self.name}...")\n        await asyncio.sleep(0.05)\n\n    async def query(self, sql):\n        print(f"  {self.name} executing: {sql}")\n        await asyncio.sleep(0.05)\n        return f"result of {sql}"\n\nasync def main():\n    async with AsyncConnection("main-db") as db:\n        result = await db.query("SELECT 1")\n        print(f"  Got: {result}")\n    print("Connection closed automatically")\n\nasyncio.run(main())` },
      {
        t: 'case',
        title: 'Case study — a rate-limited web scraper',
        md: 'A concurrent scraper that respects a rate limit (max 3 requests per 0.5 seconds) using `asyncio.Semaphore`. The semaphore acts like a bouncer — only N coroutines can hold it at once. Combined with a tiny sleep, this throttles throughput without blocking the event loop.',
        run: true,
        code: `import asyncio\n\n\nclass RateLimiter:\n    """Allow at most \`max_rate\` operations per \`period\` seconds."""\n\n    def __init__(self, max_rate, period=1.0):\n        self.semaphore = asyncio.Semaphore(max_rate)\n        self.period = period\n        self.max_rate = max_rate\n\n    async def __aenter__(self):\n        await self.semaphore.acquire()\n        return self\n\n    async def __aexit__(self, *args):\n        # Refill one permit after the period\n        asyncio.create_task(self._refill())\n\n    async def _refill(self):\n        await asyncio.sleep(self.period)\n        self.semaphore.release()\n\n\nasync def scrape(url, limiter):\n    async with limiter:\n        # Real code would use aiohttp here\n        await asyncio.sleep(0.15)\n        return f"<data from {url}>"\n\n\nasync def main():\n    limiter = RateLimiter(max_rate=3, period=0.5)\n    urls = [f"/page/{i}" for i in range(8)]\n    tasks = [scrape(url, limiter) for url in urls]\n    results = await asyncio.gather(*tasks)\n    for result in results:\n        print(f"  {result}")\n\nasyncio.run(main())`,
      },
      { t: 'quiz', q: 'What problem does `asyncio.Semaphore` solve in concurrent code?', options: ['It speeds up coroutines', 'It limits how many coroutines can access a resource simultaneously — preventing overload of APIs, databases or file handles', 'It sorts tasks by priority', 'It replaces locks'], answer: 1, why: 'A semaphore with value N allows at most N coroutines to hold it at once. This is the standard pattern for rate-limiting concurrent operations.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `delayed_greeting(name, seconds)` as an async function that awaits `asyncio.sleep(seconds)` and then returns `\"Hello, {name}!\"`.\n\nImport asyncio at the top.",
            "starter": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n",
            "solution": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f\"Hello, {name}!\"\n",
            "hints": [
                  "await asyncio.sleep(seconds) pauses the coroutine.",
                  "Return an f-string after the sleep.",
                  "The function must be async def."
            ],
            "cases": [
                  {
                        "name": "returns greeting",
                        "call": "__run_async(delayed_greeting(\"Ada\", 0.01))",
                        "expect": "\"Hello, Ada!\""
                  }
            ],
            "preamble": "async def __run_async(coro):\n    return await coro\n"
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `delayed_greeting(name, seconds)` as an async function that awaits `asyncio.sleep(seconds)` and then returns `\"Hello, {name}!\"`.\n\nImport asyncio at the top.",
            "starter": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    pass\n",
            "solution": "import asyncio\n\nasync def delayed_greeting(name, seconds):\n    await asyncio.sleep(seconds)\n    return f\"Hello, {name}!\"\n",
            "hints": [
                  "await asyncio.sleep(seconds) pauses the coroutine.",
                  "Return an f-string after the sleep.",
                  "The function must be async def."
            ],
            "cases": [
                  {
                        "name": "returns greeting",
                        "call": "__run_async(delayed_greeting(\"Ada\", 0.01))",
                        "expect": "\"Hello, Ada!\""
                  }
            ],
            "preamble": "async def __run_async(coro):\n    return await coro\n"
      },

    ],
  },

];
