/* ============================================================
   Rust — Beginner course
   Same lesson schema as lessons-python.js.

   Runnable examples and exercises compile remotely, so each Run
   takes a second or two. Examples are written as complete
   programs (`fn main`); exercises are free functions that the
   harness calls, exactly like the Rust challenges.
   ============================================================ */

export const rustLessonTopics = [
  { id: 'getting-started', name: 'Getting Started', blurb: 'Why Rust exists, your first program, Cargo, and the toolchain.' },
  { id: 'functions-and-flow', name: 'Functions & Flow', blurb: 'Expressions, branching, loops, pattern matching, closures, and iterators.' },
  { id: 'ownership-and-borrowing', name: 'Ownership & Borrowing', blurb: 'Moves, references, lifetimes — the ideas that make Rust uniquely safe.' },
  { id: 'structs-and-enums', name: 'Modelling Data', blurb: 'Structs, enums, Option, Result, and making illegal states unrepresentable.' },
  { id: 'traits-and-generics', name: 'Traits & Generics', blurb: 'Abstraction, polymorphism, and code that works across types.' },
  { id: 'collections-and-iterators', name: 'Collections & Iterators', blurb: 'Vec, HashMap, and the iterator chain that does everything in one pass.' },
  { id: 'concurrency', name: 'Concurrency', blurb: 'Threads, channels, Arc, Mutex — fearless parallelism.' },
];

export const rustLessons = [
  /* ==================================================== 1 */
  {
    id: 'rs-l1',
    topic: 'getting-started',
    title: 'Why Rust, and Your First Program',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'What problem Rust solves, and the anatomy of a program that prints something.',
    objectives: ['Explain what Rust is for', 'Write and run a Rust program', 'Read a compiler error'],
    blocks: [
      {
        t: 'text',
        md: `Most languages make you choose between two bad options.

**Languages with a garbage collector** (Python, Java, JavaScript) manage memory for you. Safe and comfortable — but the collector pauses your program at unpredictable moments, and you pay in memory and speed.

**Languages without one** (C, C++) are fast and predictable, but you manage memory by hand. Get it wrong and you get crashes, corruption and security holes. Decades of catastrophic bugs have come from exactly this.

Rust takes a third path: it proves your memory use is correct **at compile time**. No collector, no manual freeing, no crashes. The cost is that the compiler is strict — it refuses to build code it cannot prove is safe.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'The compiler is not your enemy',
        md: `You are going to fight the Rust compiler. Everyone does, for the first few weeks.

Reframe it: **every error is a bug you would otherwise have shipped.** In Python that bug shows up in production at 2am. In Rust it shows up now, with an explanation and often a suggested fix.

Rust's error messages are genuinely the best of any mainstream language. Read them fully — they usually tell you exactly what to write.`,
      },
      {
        t: 'text',
        md: `## The smallest program

Every Rust program starts at a function called \`main\`. Press Run — the first one takes a moment while it compiles.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    println!("Hello, world!");\n}`,
      },
      {
        t: 'text',
        md: `Taking it apart:

- \`fn\` declares a function
- \`main\` is the special name the program starts from
- \`()\` is the (empty) parameter list
- \`{ }\` wraps the body — Rust uses braces, not indentation
- \`println!\` prints a line
- the statement ends with a **semicolon**

That \`!\` is not excitement. It marks a **macro** — code that writes code at compile time. \`println!\` needs to be a macro because it checks your format string against your arguments *while compiling*. Pass the wrong number of values and it will not build.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let name = "Ada";\n    let year = 1815;\n\n    println!("{} was born in {}", name, year);\n    println!("{name} was born in {year}");   // shorter, same result\n    println!("{:?}", (name, year));          // debug formatting\n}`,
      },
      {
        t: 'text',
        md: `\`{}\` is a placeholder filled in order by the arguments. If a variable of that exact name is in scope you can put it straight inside the braces.

\`{:?}\` is **debug formatting** — it prints a developer-facing representation and works on tuples, vectors and anything marked \`#[derive(Debug)]\`. You will use it constantly while learning.`,
      },
      {
        t: 'text',
        md: `## Meeting the compiler

This program is wrong. Run it and read what comes back.`,
        },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let x = 5;\n    x = 6;\n    println!("{x}");\n}`,
      },
      {
        t: 'text',
        md: `The error says roughly:

\`\`\`
error[E0384]: cannot assign twice to immutable variable \`x\`
help: consider making this binding mutable: \`mut x\`
\`\`\`

Note what you were given: the error code, the exact line, the reason, **and the fix**. That is the pattern for essentially every Rust error. The next lesson explains why \`x\` was immutable in the first place.`,
      },
      {
        t: 'try',
        prompt: `Write a function \`greeting(name: &str) -> String\` that returns \`Hello, <name>!\`

\`greeting("Ada")\` → \`"Hello, Ada!"\`

Use \`format!\` — it works exactly like \`println!\` but hands you a \`String\` instead of printing it:

\`\`\`rust
format!("Hello, {}!", name)
\`\`\`

Note there is **no semicolon** on that last line. In Rust, the final expression of a function without a semicolon is its return value.`,
        lang: 'rust',
        starter: `fn greeting(name: &str) -> String {\n    todo!()\n}\n`,
        solution: `fn greeting(name: &str) -> String {\n    format!("Hello, {}!", name)\n}\n`,
        hints: [
          'Replace todo!() with the format! call.',
          'format!("Hello, {}!", name) — mind the comma and the exclamation mark inside the quotes.',
          'Leave the semicolon off so it becomes the return value.',
        ],
        cases: [
          { name: 'greets Ada', call: 'greeting("Ada")', expect: 'String::from("Hello, Ada!")' },
          { name: 'greets someone else', call: 'greeting("Grace")', expect: 'String::from("Hello, Grace!")' },
          { name: 'handles an empty name', call: 'greeting("")', expect: 'String::from("Hello, !")', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'What does the `!` in `println!` mean?',
        options: [
          'The output is urgent',
          'It is a macro, not a normal function — it can check its arguments at compile time',
          'It negates the value',
          'It means the function can fail',
        ],
        answer: 1,
        why: 'A trailing ! marks a macro invocation. println! is a macro so it can validate the format string against the arguments while compiling, rather than failing at runtime.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `shout(text: &str) -> String` returning text in uppercase with three exclamation marks.\n\n`shout(\"hello\")` → `\"HELLO!!!\"`",
            "lang": "rust",
            "starter": "fn shout(text: &str) -> String {\n    todo!()\n}\n",
            "solution": "fn shout(text: &str) -> String {\n    let mut result = text.to_uppercase();\n    result.push_str(\"!!!\");\n    result\n}\n",
            "hints": [
                  "Use .to_uppercase() on text.",
                  "Declare result as mut String.",
                  "push_str(\"!!!\") appends. No semicolon on the final line."
            ],
            "cases": [
                  {
                        "name": "shouts",
                        "call": "shout(\"hello\")",
                        "expect": "String::from(\"HELLO!!!\")"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 2 */
  {
    id: 'rs-l2',
    topic: 'getting-started',
    title: 'Values, Types and Mutability',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'Why everything is immutable by default, and the types you will meet first.',
    objectives: ['Declare values with let and let mut', 'Name the core scalar types', 'Tell String and &str apart'],
    blocks: [
      {
        t: 'text',
        md: `\`let\` binds a name to a value. By default that binding is **immutable** — it cannot be changed.

That is the opposite of most languages, and it is deliberate. Most values in most programs never need to change, and code where nothing moves behind your back is far easier to reason about — especially once several threads are involved.

When you do need to change something, say so with \`mut\`.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let fixed = 5;\n    println!("fixed = {fixed}");\n\n    let mut counter = 0;\n    counter += 1;\n    counter += 1;\n    println!("counter = {counter}");\n}`,
      },
      {
        t: 'text',
        md: `## Types

Rust is **statically typed** — every value's type is known at compile time. Usually it works the type out for you, but you can always say it explicitly:

\`\`\`rust
let x = 5;              // inferred as i32
let y: i64 = 5;         // stated
\`\`\`

The types you will meet first:

| Type | What it holds |
|---|---|
| \`i32\` \`i64\` | signed integers (can be negative) |
| \`u32\` \`u64\` | unsigned integers (zero or above) |
| \`usize\` | an integer big enough to index memory — used for lengths and indexes |
| \`f64\` | decimals |
| \`bool\` | \`true\` / \`false\` |
| \`char\` | a single character, in single quotes |

Rust will **not** silently convert between them. Adding an \`i32\` to an \`i64\` is a compile error — you must convert deliberately with \`as\`. This feels fussy and prevents a whole family of overflow bugs.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let count: i32 = 10;\n    let big: i64 = 100;\n\n    // let wrong = count + big;      // error: mismatched types\n    let right = count as i64 + big;  // explicit conversion\n    println!("{right}");\n\n    let ratio = 7.0 / 2.0;\n    let whole = 7 / 2;               // integer division truncates\n    println!("{ratio} vs {whole}");\n}`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'The two string types',
        md: `This confuses every newcomer, so meet it head on.

- **\`String\`** — owned, growable, lives on the heap. *You* are responsible for it.
- **\`&str\`** — a *borrowed view* into text someone else owns. Cheap to pass around.

A literal like \`"hello"\` is a \`&str\` baked into your program.

**The rule of thumb:** take \`&str\` as a function parameter (it accepts both), return \`String\` when you have made something new.

\`\`\`rust
fn shout(text: &str) -> String {
    text.to_uppercase()
}
\`\`\`

Convert with \`.to_string()\` or \`String::from("...")\` one way, and \`&my_string\` the other.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn shout(text: &str) -> String {\n    text.to_uppercase()\n}\n\nfn main() {\n    let borrowed: &str = "hello";\n    let owned: String = String::from("world");\n\n    println!("{}", shout(borrowed));\n    println!("{}", shout(&owned));   // &String works where &str is wanted\n\n    let mut building = String::new();\n    building.push_str("Rust");\n    building.push('!');\n    println!("{building} has {} chars", building.len());\n}`,
      },
      {
        t: 'text',
        md: `## Shadowing

You can reuse a name with a fresh \`let\`. This is **shadowing**, and it is not the same as mutation — you are creating a new value, and it may even have a different type.

\`\`\`rust
let spaces = "   ";           // &str
let spaces = spaces.len();    // now usize
\`\`\`

It is idiomatic for exactly this: converting a value through stages without inventing names like \`spaces_str\` and \`spaces_len\`.`,
      },
      {
        t: 'try',
        prompt: `Write \`describe(n: i32) -> String\` returning:

- \`"negative"\` when n is below zero
- \`"zero"\` when n is exactly zero
- \`"positive"\` when n is above zero

An \`if\` in Rust is an **expression** — it produces a value — so you can return its result directly:

\`\`\`rust
if n < 0 {
    String::from("negative")
} else if n == 0 {
    String::from("zero")
} else {
    String::from("positive")
}
\`\`\`

Note there are no semicolons on the branch values, and no \`return\` keyword needed.`,
        lang: 'rust',
        starter: `fn describe(n: i32) -> String {\n    todo!()\n}\n`,
        solution: `fn describe(n: i32) -> String {\n    if n < 0 {\n        String::from("negative")\n    } else if n == 0 {\n        String::from("zero")\n    } else {\n        String::from("positive")\n    }\n}\n`,
        hints: [
          'Every branch must produce a String, so use String::from("...") in each.',
          'No semicolons after the branch values — they are the value of the if-expression.',
          'Check n < 0 first, then n == 0, then else.',
        ],
        cases: [
          { name: 'negative', call: 'describe(-4)', expect: 'String::from("negative")' },
          { name: 'zero', call: 'describe(0)', expect: 'String::from("zero")' },
          { name: 'positive', call: 'describe(9)', expect: 'String::from("positive")' },
          { name: 'minus one', call: 'describe(-1)', expect: 'String::from("negative")', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Which should a function take as a parameter when it only needs to read some text?',
        options: ['`String`, always', '`&str` — it is a borrowed view and accepts both literals and Strings', 'Either, they are identical', '`char`'],
        answer: 1,
        why: 'Taking &str means callers can pass a literal or a reference to a String without allocating. Taking String would force the caller to give up ownership or clone.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `shout(text: &str) -> String` returning text in uppercase with three exclamation marks.\n\n`shout(\"hello\")` → `\"HELLO!!!\"`",
            "lang": "rust",
            "starter": "fn shout(text: &str) -> String {\n    todo!()\n}\n",
            "solution": "fn shout(text: &str) -> String {\n    let mut result = text.to_uppercase();\n    result.push_str(\"!!!\");\n    result\n}\n",
            "hints": [
                  "Use .to_uppercase() on text.",
                  "Declare result as mut String.",
                  "push_str(\"!!!\") appends. No semicolon on the final line."
            ],
            "cases": [
                  {
                        "name": "shouts",
                        "call": "shout(\"hello\")",
                        "expect": "String::from(\"HELLO!!!\")"
                  }
            ]
      },

      {
            "t": "complete",
            "prompt": "Complete the `absolute(n: i32) -> i32` function. Replace `todo!()` with an expression that returns the absolute value of `n`. Remember: the final expression in a block is the return value (no semicolon needed).\n\nYou can use an `if` expression: `if n >= 0 { n } else { -n }`.",
            "lang": "rust",
            "starter": "fn absolute(n: i32) -> i32 {\n    todo!()\n}\n",
            "solution": "fn absolute(n: i32) -> i32 {\n    if n >= 0 { n } else { -n }\n}\n",
            "gap_description": "Replace `todo!()` with the if expression that returns the absolute value.",
            "hints": [
                  "Use an if expression: if n >= 0 { n } else { -n }.",
                  "No semicolons on the branch values — they are the return value.",
                  "No return keyword needed."
            ],
            "cases": [
                  {
                        "name": "positive",
                        "call": "absolute(5)",
                        "expect": "5"
                  },
                  {
                        "name": "negative",
                        "call": "absolute(-7)",
                        "expect": "7"
                  },
                  {
                        "name": "zero",
                        "call": "absolute(0)",
                        "expect": "0"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 3 */
  {
    id: 'rs-l3',
    topic: 'functions-and-flow',
    title: 'Functions, Expressions and match',
    difficulty: 'beginner',
    minutes: 13,
    summary: 'Almost everything in Rust is an expression. Plus loops and the match statement.',
    objectives: ['Write functions with return values', 'Use if and match as expressions', 'Loop three different ways'],
    blocks: [
      {
        t: 'text',
        md: `A function states its parameter types and its return type. The \`->\` gives the return type.

The key Rust idea: **the last expression in a block, without a semicolon, is the value of that block.**`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn double(n: i32) -> i32 {\n    n * 2          // no semicolon = this is the return value\n}\n\nfn triple(n: i32) -> i32 {\n    return n * 3;  // explicit return also works\n}\n\nfn main() {\n    println!("{} {}", double(5), triple(5));\n\n    // Blocks are expressions too\n    let bigger = {\n        let a = 3;\n        let b = 4;\n        a * b\n    };\n    println!("{bigger}");\n}`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'A stray semicolon changes the meaning',
        md: `\`\`\`rust
fn double(n: i32) -> i32 {
    n * 2;    // <- semicolon!
}
\`\`\`

This fails to compile with *"expected \`i32\`, found \`()\`"*.

The semicolon turns the expression into a **statement**, which produces nothing — written \`()\` and called the *unit type*. The function promised an \`i32\` and delivered nothing.

When you see "expected X, found \`()\`", look for a semicolon you did not mean to type.`,
      },
      {
        t: 'text',
        md: `## Three loops

- \`loop\` — forever, until you \`break\`
- \`while\` — while a condition holds
- \`for\` — over a range or collection (the one you will use most)`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    for i in 1..4 {\n        println!("for: {i}");        // 1, 2, 3 — end excluded\n    }\n\n    for i in 1..=3 {\n        println!("inclusive: {i}");  // 1, 2, 3 — end included\n    }\n\n    let mut n = 3;\n    while n > 0 {\n        println!("while: {n}");\n        n -= 1;\n    }\n\n    // loop can return a value through break\n    let mut attempts = 0;\n    let result = loop {\n        attempts += 1;\n        if attempts == 3 {\n            break attempts * 10;\n        }\n    };\n    println!("loop returned {result}");\n}`,
      },
      {
        t: 'text',
        md: `## match

\`match\` compares a value against patterns and takes the first that fits. It is \`switch\` from other languages, except vastly more capable — and **exhaustive**: you must cover every possible case, or it will not compile.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn grade(score: u32) -> char {\n    match score {\n        90..=u32::MAX => 'A',\n        80..=89 => 'B',\n        70..=79 => 'C',\n        _ => 'F',                 // _ means "anything else"\n    }\n}\n\nfn main() {\n    for s in [95, 83, 71, 40] {\n        println!("{s} -> {}", grade(s));\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Exhaustiveness is a safety net',
        md: `Delete the \`_ => 'F'\` line above and the compiler refuses to build, telling you which values are unhandled.

This matters enormously later. When you add a new variant to an enum — a new order status, a new payment method — the compiler immediately lists **every \`match\` in your codebase that now has a gap**. In most languages that is a silent bug found in production.`,
      },
      {
        t: 'try',
        prompt: `Write \`fizzbuzz(n: u32) -> String\` for a single number:

- divisible by 3 and 5 → \`"FizzBuzz"\`
- divisible by 3 → \`"Fizz"\`
- divisible by 5 → \`"Buzz"\`
- otherwise → the number as text

Two neat ways: an \`if/else if\` chain, or a \`match\` on the tuple \`(n % 3, n % 5)\`:

\`\`\`rust
match (n % 3, n % 5) {
    (0, 0) => String::from("FizzBuzz"),
    (0, _) => String::from("Fizz"),
    (_, 0) => String::from("Buzz"),
    _ => n.to_string(),
}
\`\`\`

Try the match version — it shows off what patterns can do.`,
        lang: 'rust',
        starter: `fn fizzbuzz(n: u32) -> String {\n    todo!()\n}\n`,
        solution: `fn fizzbuzz(n: u32) -> String {\n    match (n % 3, n % 5) {\n        (0, 0) => String::from("FizzBuzz"),\n        (0, _) => String::from("Fizz"),\n        (_, 0) => String::from("Buzz"),\n        _ => n.to_string(),\n    }\n}\n`,
        hints: [
          'The tuple (n % 3, n % 5) is zero in both slots when divisible by 15.',
          'Order matters: (0, 0) must come before (0, _).',
          'n.to_string() turns the number into a String for the final arm.',
        ],
        cases: [
          { name: 'fizz', call: 'fizzbuzz(9)', expect: 'String::from("Fizz")' },
          { name: 'buzz', call: 'fizzbuzz(10)', expect: 'String::from("Buzz")' },
          { name: 'fizzbuzz', call: 'fizzbuzz(15)', expect: 'String::from("FizzBuzz")' },
          { name: 'plain number', call: 'fizzbuzz(7)', expect: 'String::from("7")' },
          { name: 'zero is divisible by both', call: 'fizzbuzz(0)', expect: 'String::from("FizzBuzz")', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Why does `fn double(n: i32) -> i32 { n * 2; }` fail to compile?',
        options: [
          'Multiplication needs brackets',
          'The semicolon turns the expression into a statement, so the function returns `()` instead of an i32',
          '`return` is always required',
          'i32 cannot be multiplied',
        ],
        answer: 1,
        why: 'A trailing semicolon discards the value, leaving the block producing the unit type (). The declared return type i32 is then unsatisfied.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `can_vote(age: u32) -> bool` returning true if age >= 18. Return the comparison directly — no if statement needed.",
            "lang": "rust",
            "starter": "fn can_vote(age: u32) -> bool {\n    todo!()\n}\n",
            "solution": "fn can_vote(age: u32) -> bool {\n    age >= 18\n}\n",
            "hints": [
                  "The comparison age >= 18 evaluates to a bool.",
                  "Return it directly — no semicolon.",
                  "No if statement needed."
            ],
            "cases": [
                  {
                        "name": "adult",
                        "call": "can_vote(20)",
                        "expect": "true"
                  },
                  {
                        "name": "minor",
                        "call": "can_vote(16)",
                        "expect": "false"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 4 */
  {
    id: 'rs-l4',
    topic: 'ownership-and-borrowing',
    title: 'Ownership',
    difficulty: 'intermediate',
    minutes: 16,
    summary: 'The single idea that makes Rust different. Three rules, and what they buy you.',
    objectives: ['State the three ownership rules', 'Predict when a value moves', 'Explain why this removes whole bug classes'],
    blocks: [
      {
        t: 'text',
        md: `This is the lesson that makes Rust *Rust*. Take it slowly.

Every program must reclaim memory it no longer needs. There are only three known strategies:

1. **Ask the programmer** (C, C++) — fast, and humans forget
2. **Employ a garbage collector** (Python, Java, Go) — safe, and costs pauses and memory
3. **Work it out at compile time** — Rust

Rust's answer is **ownership**: rules the compiler checks, so that exactly one place is responsible for freeing each value, and the compiler knows precisely when.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'The three rules',
        md: `1. Each value has exactly one **owner**.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is **dropped** (freed).

That is the entire system. Everything else follows.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    {\n        let message = String::from("I exist briefly");\n        println!("{message}");\n    }   // <- message goes out of scope here and is freed automatically\n\n    println!("The inner scope has ended");\n}`,
      },
      {
        t: 'text',
        md: `No \`free\`, no \`delete\`, no garbage collector. The closing brace *is* the deallocation, and the compiler put it there.

## Moving

Here is where it gets interesting. What happens when you assign one variable to another?`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let a = String::from("hello");\n    let b = a;              // a is MOVED into b\n\n    println!("{b}");        // fine\n    // println!("{a}");     // error: value borrowed here after move\n\n    // Simple, fixed-size types are COPIED instead\n    let x = 5;\n    let y = x;\n    println!("x is still {x}, y is {y}");\n}`,
      },
      {
        t: 'text',
        md: `\`let b = a;\` did not copy the string. It **moved** it — \`b\` is now the owner, and \`a\` is no longer usable.

Why? Because if both owned it, both would try to free it when they went out of scope. Freeing the same memory twice is a *double free* — a classic, exploitable bug. Rust makes it impossible by making \`a\` invalid.

Uncomment that middle \`println!\` and the compiler will tell you exactly this.`,
      },
      {
        t: 'note',
        tone: 'analogy',
        title: 'Move vs copy',
        md: `Think of a \`String\` as a **house deed**. Handing the deed to someone means *you* no longer own the house. There is only one deed.

Think of an \`i32\` as a **phone number** written on a card. Copying it costs nothing and both copies are equally valid.

The dividing line is the \`Copy\` trait: small, fixed-size, stack-only values (numbers, \`bool\`, \`char\`, and tuples of those) are copied. Anything managing heap memory — \`String\`, \`Vec\`, your own structs — is moved.`,
      },
      {
        t: 'text',
        md: `## Functions take ownership too

Passing a value to a function moves it, unless the type is \`Copy\`.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn consume(text: String) {\n    println!("I now own: {text}");\n}   // text is dropped here\n\nfn consume_and_return(text: String) -> String {\n    println!("Borrowing by giving it back: {text}");\n    text\n}\n\nfn main() {\n    let a = String::from("first");\n    consume(a);\n    // a is gone now\n\n    let b = String::from("second");\n    let b = consume_and_return(b);   // handed back\n    println!("Still have: {b}");\n}`,
      },
      {
        t: 'text',
        md: `Giving a value away and getting it back works, but it is tedious. There is a much better way — **borrowing** — which is the whole of the next lesson.

If you need a genuinely independent duplicate, ask for one explicitly with \`.clone()\`. It is not forbidden, just visible: cloning copies heap data and costs real time, so Rust makes you write it down rather than doing it silently.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let original = String::from("data");\n    let copy = original.clone();     // deliberate deep copy\n\n    println!("{original} and {copy}");   // both still valid\n}`,
      },
      {
        t: 'try',
        prompt: `Write \`combine(first: String, second: String) -> String\` that joins two strings with a space between them.

\`combine(String::from("Hello"), String::from("world"))\` → \`"Hello world"\`

The function **takes ownership** of both, which means it is free to consume them. The simplest approach:

\`\`\`rust
format!("{} {}", first, second)
\`\`\`

Try it, then note something: because the function owns \`first\`, you could also have used \`first.push_str(...)\` and returned it, with no extra allocation.`,
        lang: 'rust',
        starter: `fn combine(first: String, second: String) -> String {\n    todo!()\n}\n`,
        solution: `fn combine(first: String, second: String) -> String {\n    format!("{} {}", first, second)\n}\n`,
        hints: [
          'format! builds a new String from a template.',
          'The template needs a space between the two placeholders: "{} {}"',
          'No semicolon on the last line.',
        ],
        cases: [
          { name: 'joins two words', call: 'combine(String::from("Hello"), String::from("world"))', expect: 'String::from("Hello world")' },
          { name: 'handles an empty second', call: 'combine(String::from("Solo"), String::from(""))', expect: 'String::from("Solo ")' },
          { name: 'both empty', call: 'combine(String::from(""), String::from(""))', expect: 'String::from(" ")', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'After `let a = String::from("hi"); let b = a;`, why can you no longer use `a`?',
        options: [
          'Rust deleted the string',
          'Ownership moved to `b`; allowing both would risk the memory being freed twice',
          '`a` is now empty',
          'You can use it — this compiles fine',
        ],
        answer: 1,
        why: 'A String owns heap memory. If both a and b owned it, both would free it when going out of scope — a double free. Rust prevents this by invalidating the original binding.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `clone_uppercase(text: &str) -> String` that returns an uppercase clone — without taking ownership of the original.\n\nUse `.to_uppercase()` which already returns a new String. Taking a `&str` means the caller keeps their data.",
            "lang": "rust",
            "starter": "fn clone_uppercase(text: &str) -> String {\n    todo!()\n}\n",
            "solution": "fn clone_uppercase(text: &str) -> String {\n    text.to_uppercase()\n}\n",
            "hints": [
                  ".to_uppercase() takes &str and returns a new String.",
                  "No cloning needed — the method does it for you.",
                  "No semicolon on the final line."
            ],
            "cases": [
                  {
                        "name": "uppercase",
                        "call": "clone_uppercase(\"hello\")",
                        "expect": "String::from(\"HELLO\")"
                  }
            ]
      },

      {
            "t": "debug",
            "prompt": "The `first_char` function below has a borrow-checker bug. It should return the first character of a `&str`, but it does not compile. Fix it.\n\nClue: `.chars().next()` returns an `Option<char>`, not a `&str`. The return type is wrong, and the function body needs adjustment.",
            "lang": "rust",
            "starter": "fn first_char(text: &str) -> &str {\n    // BUG: this returns Option<char>, not &str\n    text.chars().next().unwrap()\n}\n",
            "solution": "fn first_char(text: &str) -> Option<char> {\n    text.chars().next()\n}\n",
            "bug_description": "`.chars().next()` returns `Option<char>`, not `&str`. The return type and the function body disagree. Fix: change the return type to `Option<char>` and remove the `.unwrap()` — let the caller decide how to handle the None case.",
            "hints": [
                  "Change the return type from &str to Option<char>.",
                  "Remove .unwrap() — it would panic on empty strings.",
                  "Return text.chars().next() directly."
            ],
            "cases": [
                  {
                        "name": "has first char",
                        "call": "first_char(\"hello\")",
                        "expect": "Some('h')"
                  },
                  {
                        "name": "empty string",
                        "call": "first_char(\"\")",
                        "expect": "None"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 5 */
  {
    id: 'rs-l5',
    topic: 'ownership-and-borrowing',
    title: 'References and Borrowing',
    difficulty: 'intermediate',
    minutes: 14,
    summary: 'Using a value without taking it — and the one rule that eliminates data races.',
    objectives: ['Borrow immutably and mutably', 'State the borrowing rules', 'Fix the errors the borrow checker gives you'],
    blocks: [
      {
        t: 'text',
        md: `Handing ownership back and forth is exhausting. Instead, **borrow**: let a function look at a value without taking it.

An \`&\` makes a **reference** — a pointer that does not own what it points to.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn length_of(text: &String) -> usize {\n    text.len()\n}   // text goes out of scope, but it never owned anything — nothing is dropped\n\nfn main() {\n    let message = String::from("borrow me");\n\n    println!("length: {}", length_of(&message));\n    println!("still mine: {message}");     // still valid!\n}`,
      },
      {
        t: 'text',
        md: `## Mutable borrows

A plain \`&\` is read-only. To change something through a reference you need \`&mut\`, and the original must itself be \`mut\`.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn add_excitement(text: &mut String) {\n    text.push('!');\n}\n\nfn main() {\n    let mut message = String::from("Wow");\n\n    add_excitement(&mut message);\n    add_excitement(&mut message);\n\n    println!("{message}");\n}`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'The borrowing rules',
        md: `At any given moment, you may have **either**:

- any number of immutable references (\`&T\`), **or**
- exactly one mutable reference (\`&mut T\`)

Never both at once.

Read it as: *many readers, or one writer — never both.*

This is the rule that makes data races **impossible at compile time**. A data race needs two accesses to the same memory, at least one writing, unsynchronised. The rule above forbids that shape by construction. Rust's famous "fearless concurrency" is entirely this rule, applied across threads.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let mut data = String::from("hello");\n\n    // Many readers — fine\n    let r1 = &data;\n    let r2 = &data;\n    println!("{r1} and {r2}");\n    // r1 and r2 are no longer used after this point\n\n    // One writer — also fine, now that the readers are done\n    let w = &mut data;\n    w.push_str(" world");\n    println!("{w}");\n}`,
      },
      {
        t: 'text',
        md: `The compiler is cleverer than the rule sounds: a borrow lasts only until its **last use**, not to the end of the block. That is why the reader and writer above coexist peacefully in one function.

Try moving \`println!("{r1}")\` to *after* the \`w.push_str\` line and it will refuse — now the reader and writer genuinely overlap.`,
      },
      {
        t: 'text',
        md: `## Slices

A **slice** borrows part of a collection. \`&str\` — which you have used since lesson one — is exactly this: a slice of string data.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn first_word(text: &str) -> &str {\n    match text.find(' ') {\n        Some(index) => &text[..index],\n        None => text,\n    }\n}\n\nfn main() {\n    println!("{:?}", first_word("hello there world"));\n    println!("{:?}", first_word("single"));\n\n    let numbers = vec![1, 2, 3, 4, 5];\n    let middle = &numbers[1..4];\n    println!("{:?}", middle);\n}`,
      },
      {
        t: 'try',
        prompt: `Write \`total(numbers: &[i32]) -> i32\` that adds up a slice of numbers.

Taking \`&[i32]\` — a slice — rather than \`Vec<i32>\` means the caller keeps their data and you can accept arrays, vectors or parts of either.

The idiomatic body is one line:

\`\`\`rust
numbers.iter().sum()
\`\`\`

A \`for\` loop with a \`mut\` accumulator also works if you would rather see it spelled out.`,
        lang: 'rust',
        starter: `fn total(numbers: &[i32]) -> i32 {\n    todo!()\n}\n`,
        solution: `fn total(numbers: &[i32]) -> i32 {\n    numbers.iter().sum()\n}\n`,
        hints: [
          '.iter() walks the slice without consuming it.',
          '.sum() adds everything up; the return type tells it what to produce.',
          'No semicolon on the final line.',
        ],
        cases: [
          { name: 'adds a few numbers', call: 'total(&[1, 2, 3, 4])', expect: '10' },
          { name: 'empty slice is zero', call: 'total(&[])', expect: '0' },
          { name: 'handles negatives', call: 'total(&[-5, 5, -2])', expect: '-2' },
          { name: 'single value', call: 'total(&[42])', expect: '42', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'How many mutable references to the same value may exist at once?',
        options: ['As many as you like', 'Exactly one, and no immutable ones at the same time', 'Two', 'None — mutation always needs ownership'],
        answer: 1,
        why: 'Many readers or one writer, never both. This is precisely the condition needed to make data races impossible, and the compiler enforces it.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `clone_uppercase(text: &str) -> String` that returns an uppercase clone — without taking ownership of the original.\n\nUse `.to_uppercase()` which already returns a new String. Taking a `&str` means the caller keeps their data.",
            "lang": "rust",
            "starter": "fn clone_uppercase(text: &str) -> String {\n    todo!()\n}\n",
            "solution": "fn clone_uppercase(text: &str) -> String {\n    text.to_uppercase()\n}\n",
            "hints": [
                  ".to_uppercase() takes &str and returns a new String.",
                  "No cloning needed — the method does it for you.",
                  "No semicolon on the final line."
            ],
            "cases": [
                  {
                        "name": "uppercase",
                        "call": "clone_uppercase(\"hello\")",
                        "expect": "String::from(\"HELLO\")"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 6 */
  {
    id: 'rs-l6',
    topic: 'structs-and-enums',
    title: 'Structs, Enums and Option',
    difficulty: 'intermediate',
    minutes: 15,
    summary: 'Modelling your problem so that invalid states cannot be represented — and life without null.',
    objectives: ['Define structs with methods', 'Model choices with enums', 'Handle absence with Option instead of null'],
    blocks: [
      {
        t: 'text',
        md: `A **struct** groups related values under one name.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `#[derive(Debug)]\nstruct Book {\n    title: String,\n    pages: u32,\n}\n\nimpl Book {\n    // An "associated function" — like a constructor\n    fn new(title: &str, pages: u32) -> Self {\n        Book { title: title.to_string(), pages }\n    }\n\n    // A method — takes &self, so it borrows\n    fn is_long(&self) -> bool {\n        self.pages > 300\n    }\n}\n\nfn main() {\n    let book = Book::new("Dune", 412);\n\n    println!("{:?}", book);\n    println!("{} is long? {}", book.title, book.is_long());\n}`,
      },
      {
        t: 'text',
        md: `- \`impl\` is where a type's functions live
- \`fn new(...) -> Self\` takes no \`self\`, so you call it as \`Book::new(...)\`
- \`fn is_long(&self)\` takes \`&self\`, so you call it as \`book.is_long()\`
- \`#[derive(Debug)]\` auto-generates the code that makes \`{:?}\` work

Use \`&self\` to read, \`&mut self\` to modify, and plain \`self\` when the method consumes the value.`,
      },
      {
        t: 'text',
        md: `## Enums: one of several possibilities

A struct says "all of these at once". An **enum** says "exactly one of these". And Rust enums can carry data, which makes them far more useful than the enums you may have met elsewhere.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `#[derive(Debug)]\nenum Shape {\n    Circle { radius: f64 },\n    Rectangle { width: f64, height: f64 },\n    Triangle { base: f64, height: f64 },\n}\n\nfn area(shape: &Shape) -> f64 {\n    match shape {\n        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,\n        Shape::Rectangle { width, height } => width * height,\n        Shape::Triangle { base, height } => 0.5 * base * height,\n    }\n}\n\nfn main() {\n    let shapes = vec![\n        Shape::Circle { radius: 1.0 },\n        Shape::Rectangle { width: 3.0, height: 4.0 },\n        Shape::Triangle { base: 6.0, height: 2.0 },\n    ];\n\n    for shape in &shapes {\n        println!("{:?} has area {:.2}", shape, area(shape));\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Make illegal states unrepresentable',
        md: `A \`Shape\` is a circle *or* a rectangle *or* a triangle. It can never be a circle with a width, or a rectangle missing its height.

Compare the alternative — a struct with optional fields for every shape, where nothing stops you creating a circle with a base and no radius. You would then need runtime checks everywhere, forever.

**Design your types so wrong states cannot be written down.** Then the compiler enforces your rules for free. This is the highest-value habit in Rust.`,
      },
      {
        t: 'text',
        md: `## Option: no more null

Rust has no \`null\`. The inventor of the null reference called it his "billion-dollar mistake" — every language with it has a category of crash where something was empty and nobody checked.

Rust replaces it with an enum:

\`\`\`rust
enum Option<T> {
    Some(T),
    None,
}
\`\`\`

A value that might be absent has type \`Option<T>\`. You **cannot** use the inner value without handling the \`None\` case — the compiler will not let you forget.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'rust',
        code: `fn find_user(id: u32) -> Option<String> {\n    if id == 1 {\n        Some(String::from("Ada"))\n    } else {\n        None\n    }\n}\n\nfn main() {\n    match find_user(1) {\n        Some(name) => println!("Found {name}"),\n        None => println!("No such user"),\n    }\n\n    // Common shortcuts\n    println!("{}", find_user(2).unwrap_or(String::from("anonymous")));\n    println!("{:?}", find_user(1).map(|n| n.to_uppercase()));\n\n    if let Some(name) = find_user(1) {\n        println!("if-let is neat when you only care about one case: {name}");\n    }\n}`,
      },
      {
        t: 'try',
        prompt: `Model a task list item.

Define a struct \`Task\` with:
- \`title: String\`
- \`done: bool\`

and an \`impl\` block with:
- \`fn new(title: &str) -> Self\` — creates a task that is **not** done
- \`fn complete(&mut self)\` — marks it done
- \`fn status(&self) -> String\` — returns \`"[x] <title>"\` when done, \`"[ ] <title>"\` when not

Remember: \`&mut self\` to change, \`&self\` to read.`,
        lang: 'rust',
        starter: `struct Task {\n    title: String,\n    done: bool,\n}\n\nimpl Task {\n    fn new(title: &str) -> Self {\n        todo!()\n    }\n}\n`,
        solution: `struct Task {\n    title: String,\n    done: bool,\n}\n\nimpl Task {\n    fn new(title: &str) -> Self {\n        Task { title: title.to_string(), done: false }\n    }\n\n    fn complete(&mut self) {\n        self.done = true;\n    }\n\n    fn status(&self) -> String {\n        if self.done {\n            format!("[x] {}", self.title)\n        } else {\n            format!("[ ] {}", self.title)\n        }\n    }\n}\n`,
        hints: [
          'new must convert the &str into a String: title.to_string()',
          'complete takes &mut self and sets self.done = true;',
          'status takes &self and returns a format! with either [x] or [ ].',
        ],
        cases: [
          { name: 'new task is not done', call: 'Task::new("write tests").status()', expect: 'String::from("[ ] write tests")' },
          {
            name: 'completing changes the status',
            call: '{ let mut t = Task::new("ship it"); t.complete(); t.status() }',
            expect: 'String::from("[x] ship it")',
          },
          { name: 'title is stored', call: 'Task::new("read").title', expect: 'String::from("read")', hidden: true },
          {
            name: 'completing twice is harmless',
            call: '{ let mut t = Task::new("x"); t.complete(); t.complete(); t.status() }',
            expect: 'String::from("[x] x")',
            hidden: true,
          },
        ],
      },
      {
        t: 'text',
        md: `## Where you are now

You can write functions, model data with structs and enums, and — most importantly — you understand ownership and borrowing well enough to read the compiler's complaints.

That is the hard part. Genuinely. Everything after this (traits, generics, error handling with \`Result\`, iterators, concurrency) builds on these five ideas.

Head to the **Challenges** for this track when you are ready. The Fundamentals and Ownership tiers pick up exactly where this leaves off.`,
      },
      {
        t: 'quiz',
        q: 'Why does Rust use `Option<T>` instead of allowing null?',
        options: [
          'It is faster',
          'The type system forces you to handle the empty case, so "forgot to check for null" cannot compile',
          'Null is impossible to implement in Rust',
          'It saves memory',
        ],
        answer: 1,
        why: 'Option<T> makes absence part of the type. You cannot reach the inner value without dealing with None, which removes an entire class of runtime crash at compile time.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Define an enum `TrafficLight` with variants `Red`, `Yellow`, `Green`. Write `next(light: &TrafficLight) -> TrafficLight` that cycles Red→Green→Yellow→Red. Use match.",
            "lang": "rust",
            "starter": "#[derive(Debug, PartialEq)]\nenum TrafficLight { Red, Yellow, Green }\n\nfn next(light: &TrafficLight) -> TrafficLight {\n    todo!()\n}\n",
            "solution": "#[derive(Debug, PartialEq)]\nenum TrafficLight { Red, Yellow, Green }\n\nfn next(light: &TrafficLight) -> TrafficLight {\n    match light {\n        TrafficLight::Red => TrafficLight::Green,\n        TrafficLight::Yellow => TrafficLight::Red,\n        TrafficLight::Green => TrafficLight::Yellow,\n    }\n}\n",
            "hints": [
                  "Match on light — the compiler checks exhaustiveness.",
                  "Each arm returns the next variant.",
                  "No semicolons on the match arms."
            ],
            "cases": [
                  {
                        "name": "red to green",
                        "call": "next(&TrafficLight::Red)",
                        "expect": "TrafficLight::Green"
                  },
                  {
                        "name": "green to yellow",
                        "call": "next(&TrafficLight::Green)",
                        "expect": "TrafficLight::Yellow"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 7 */
  {
    id: 'rs-l7',
    topic: 'getting-started',
    difficulty: 'intermediate',
    title: 'Cargo and Project Structure',
    minutes: 12,
    summary: 'Creating projects with Cargo, managing dependencies, and the anatomy of Cargo.toml.',
    objectives: ['Create a project with cargo new', 'Add a dependency to Cargo.toml', 'Run tests with cargo test'],
    blocks: [
      { t: 'text', md: 'Rust ships with **Cargo** — its build system, package manager, test runner and documentation generator. Every real Rust project starts with `cargo new`.\n\n```bash\ncargo new my_project\ncd my_project\ncargo build    # compile\ncargo run      # build + run\ncargo test     # run tests\n```\n\nThe generated `Cargo.toml` is the project manifest — name, version, dependencies and build settings.' },
      { t: 'code', run: true, lang: 'rust', code: `// A typical Cargo-generated main.rs\nfn main() {\n    println!("Hello from Cargo!");\n}\n\n/// Adds two numbers together.\n///\n/// # Examples\n///\n/// \`\`\`\n/// assert_eq!(add(2, 3), 5);\n/// \`\`\`\nfn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_add() {\n        assert_eq!(add(2, 3), 5);\n        assert_eq!(add(-1, 1), 0);\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a command-line word-count tool',
        md: 'A Cargo project that takes a filename from the command line and counts words, lines and characters.',
        run: true,
        lang: 'rust',
        code: `use std::env;\nuse std::fs;\n\nstruct Counts {\n    lines: usize,\n    words: usize,\n    chars: usize,\n}\n\nfn count(text: &str) -> Counts {\n    Counts {\n        lines: text.lines().count(),\n        words: text.split_whitespace().count(),\n        chars: text.chars().count(),\n    }\n}\n\nfn main() {\n    let path = env::args().nth(1).unwrap_or_else(|| {\n        eprintln!("Usage: wc <file>");\n        std::process::exit(1);\n    });\n\n    let text = fs::read_to_string(&path).unwrap_or_else(|e| {\n        eprintln!("Error reading {}: {}", path, e);\n        std::process::exit(1);\n    });\n\n    let c = count(&text);\n    println!("{} {} {} {}", c.lines, c.words, c.chars, path);\n}`,
      },
      {
        t: 'try',
        prompt: 'Write a function `word_count(text: &str) -> usize` that returns the number of whitespace-separated words. Use `split_whitespace().count()`.',
        lang: 'rust',
        starter: `fn word_count(text: &str) -> usize {\n    todo!()\n}\n`,
        solution: `fn word_count(text: &str) -> usize {\n    text.split_whitespace().count()\n}\n`,
        hints: ['split_whitespace() yields an iterator over words.', '.count() gives the number of items.', 'No semicolon — make it the return value.'],
        cases: [
          { name: 'three words', call: 'word_count("hello world rust")', expect: '3' },
          { name: 'empty string', call: 'word_count("")', expect: '0' },
        ],
      },
      { t: 'quiz', q: 'What does `cargo new my_project` create?', options: ['Just a Cargo.toml file', 'A directory with Cargo.toml, src/main.rs, and a git repository initialised', 'A single .rs file', 'A binary executable'], answer: 1, why: 'cargo new scaffolds a complete project: Cargo.toml manifest, src/ directory with main.rs, and initialises a git repo.' },
      {
        t: 'try',
        prompt: `Write \`char_count(text: &str) -> usize\` that returns the number of characters (not bytes) in the text.

\`char_count("hello")\` → \`5\`

Use \`.chars().count()\` — this counts Unicode characters correctly, not raw bytes.`,
        lang: 'rust',
        starter: `fn char_count(text: &str) -> usize {\n    todo!()\n}\n`,
        solution: `fn char_count(text: &str) -> usize {\n    text.chars().count()\n}\n`,
        hints: [
          'text.chars() yields an iterator of char values.',
          '.count() gives the number of items.',
          'No semicolon — make it the return value.',
        ],
        cases: [
          { name: 'simple', call: 'char_count("hello")', expect: '5' },
          { name: 'empty', call: 'char_count("")', expect: '0' },
        ],
      },

    ],
  },

  /* ==================================================== 8 */
  {
    id: 'rs-l8',
    topic: 'getting-started',
    difficulty: 'advanced',
    title: 'Testing, Docs and Clippy',
    minutes: 14,
    summary: 'Writing tests, generating documentation with doc comments, and using Clippy for linting.',
    objectives: ['Write unit and integration tests', 'Use /// doc comments for documentation', 'Run clippy for style and correctness'],
    blocks: [
      { t: 'text', md: 'Rust ships with a testing framework built into the language. `#[test]` marks a test function. `assert_eq!` and `assert!` are the workhorses. Documentation tests — code examples in `///` comments — are compiled and run by `cargo test`.\n\nIntegration tests live in a `tests/` directory at the project root. Each file is compiled as a separate crate.' },
      { t: 'code', run: true, lang: 'rust', code: `/// Returns the factorial of n.\n///\n/// # Examples\n///\n/// \`\`\`\n/// assert_eq!(factorial(5), 120);\n/// assert_eq!(factorial(0), 1);\n/// \`\`\`\npub fn factorial(n: u64) -> u64 {\n    (1..=n).product()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn factorial_of_five() {\n        assert_eq!(factorial(5), 120);\n    }\n\n    #[test]\n    #[should_panic(expected = "overflow")]\n    fn overflow_panics() {\n        factorial(21); // u64 overflows at 21!\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a library crate with full test coverage',
        md: 'A library that provides text statistics (characters, words, sentences). It demonstrates doc-tests, unit tests, and the pattern of encoding invalid states in the type system (returning Option instead of panicking).',
        run: true,
        lang: 'rust',
        code: `/// Text statistics.\npub struct Stats {\n    pub chars: usize,\n    pub words: usize,\n    pub sentences: usize,\n}\n\n/// Analyse a piece of text, returning None if the text is empty.\n///\n/// # Examples\n///\n/// \`\`\`\n/// let stats = stats_for("Hello world. How are you?").unwrap();\n/// assert_eq!(stats.words, 5);\n/// \`\`\`\npub fn stats_for(text: &str) -> Option<Stats> {\n    if text.trim().is_empty() {\n        return None;\n    }\n    Some(Stats {\n        chars: text.chars().count(),\n        words: text.split_whitespace().count(),\n        sentences: text.split(&['.', '!', '?'][..])\n            .filter(|s| !s.trim().is_empty())\n            .count(),\n    })\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn empty_returns_none() {\n        assert_eq!(stats_for(""), None);\n    }\n\n    #[test]\n    fn basic_stats() {\n        let s = stats_for("Hi there. Bye!").unwrap();\n        assert_eq!(s.chars, 15);\n        assert_eq!(s.words, 3);\n        assert_eq!(s.sentences, 2);\n    }\n}`,
      },
      { t: 'quiz', q: 'What happens to code examples inside `///` doc comments?', options: ['They are ignored', 'They are compiled and run by `cargo test` — serving as both documentation and tests', 'They become comments', 'They are only formatted'], answer: 1, why: 'Doc-tests are a Rust superpower: the code in your documentation IS your test suite. cargo test compiles and runs them, guaranteeing your examples never go stale.' },
      {
        t: 'try',
        prompt: `Write \`is_blank(text: &str) -> bool\` that returns \`true\` if the text is empty or contains only whitespace.

\`is_blank("")\` → \`true\`\n\`is_blank("   ")\` → \`true\`\n\`is_blank("hello")\` → \`false\`

Use \`.trim().is_empty()\`. Include a \`///\` doc comment with an example — this platform rewards documentation.`,
        lang: 'rust',
        starter: `fn is_blank(text: &str) -> bool {\n    todo!()\n}\n`,
        solution: `/// Returns true if text is empty or only whitespace.\n///\n/// \`\`\`\n/// assert!(is_blank("   "));\n/// assert!(!is_blank("hi"));\n/// \`\`\`\nfn is_blank(text: &str) -> bool {\n    text.trim().is_empty()\n}\n`,
        hints: [
          '.trim() strips leading and trailing whitespace.',
          '.is_empty() returns true for zero-length strings.',
          'Chain them and return the result.',
        ],
        cases: [
          { name: 'empty', call: 'is_blank("")', expect: 'true' },
          { name: 'spaces', call: 'is_blank("   ")', expect: 'true' },
          { name: 'has text', call: 'is_blank("hello")', expect: 'false' },
        ],
      },

    ],
  },

  /* ==================================================== 9 */
  {
    id: 'rs-l9',
    topic: 'functions-and-flow',
    difficulty: 'intermediate',
    title: 'Closures and Iterators in Depth',
    minutes: 14,
    summary: 'Closures and the Iterator trait chain — map, filter, fold, collect, and how they compose.',
    objectives: ['Write closures that capture their environment', 'Chain iterator adaptors', 'Choose fold over a loop accumulator'],
    blocks: [
      { t: 'text', md: 'A **closure** is an anonymous function that can capture variables from its enclosing scope. Rust infers the types of closure arguments from usage.\n\n```rust\nlet add = |a, b| a + b;\nlet multiply = |x| x * 2;\n```\n\nClosures are the engine behind Rust\'s iterator chains. `.iter()` gives you an iterator; `.map()`, `.filter()`, `.fold()` and `.collect()` transform it.' },
      { t: 'code', run: true, lang: 'rust', code: `fn main() {\n    let numbers = vec![1, 2, 3, 4, 5, 6];\n\n    // Chain of iterator adaptors\n    let result: Vec<i32> = numbers\n        .iter()\n        .filter(|&&n| n % 2 == 0)   // keep evens\n        .map(|&n| n * n)             // square them\n        .collect();                   // gather into a Vec\n\n    println!("{:?}", result);\n\n    // fold: the Swiss Army knife\n    let sum_of_squares: i32 = numbers.iter().fold(0, |acc, &n| acc + n * n);\n    println!("sum of squares: {}", sum_of_squares);\n\n    // Capturing from the environment\n    let threshold = 3;\n    let big_enough: Vec<&i32> = numbers.iter().filter(|&n| *n > threshold).collect();\n    println!("big enough: {:?}", big_enough);\n}` },
      {
        t: 'case',
        title: 'Case study — a configurable filter pipeline',
        md: 'Build a data pipeline where each stage is a closure stored in a Vec. The user configures which filters to apply (even numbers, above threshold, convert to string), and the pipeline applies them in order. The key Rust insight: closures stored together must have the same type — achieved here by making them all `fn(&i32) -> bool`.',
        run: true,
        lang: 'rust',
        code: `fn main() {\n    let data = vec![3, 8, 1, 12, 5, 9];\n\n    // Each filter is a function with the same signature\n    type Filter = fn(&i32) -> bool;\n\n    let filters: Vec<(&str, Filter)> = vec![\n        ("even", |n| n % 2 == 0),\n        ("above 5", |n| *n > 5),\n    ];\n\n    for (name, filter) in &filters {\n        let result: Vec<i32> = data.iter().filter(|n| filter(n)).copied().collect();\n        println!("{}: {:?}", name, result);\n    }\n\n    // Compose: all filters at once\n    let filtered: Vec<i32> = data.iter()\n        .filter(|n| filters.iter().all(|(_, f)| f(n)))\n        .copied()\n        .collect();\n    println!("all filters: {:?}", filtered);\n}`,
      },
      {
        t: 'try',
        prompt: 'Write `sum_of_positives(xs: &[i32]) -> i32` using `filter` and `sum()`. Skip negative numbers and zero.',
        lang: 'rust',
        starter: `fn sum_of_positives(xs: &[i32]) -> i32 {\n    todo!()\n}\n`,
        solution: `fn sum_of_positives(xs: &[i32]) -> i32 {\n    xs.iter().filter(|&&x| x > 0).sum()\n}\n`,
        hints: ['Use xs.iter().filter(|&&x| x > 0)', 'Then chain .sum()', 'No semicolon on the final line.'],
        cases: [
          { name: 'mixed', call: 'sum_of_positives(&[1, -2, 3, 0, 5])', expect: '9' },
          { name: 'all negative', call: 'sum_of_positives(&[-1, -2])', expect: '0' },
        ],
      },
      { t: 'quiz', q: 'What does `fold` do that `sum` cannot?', options: ['Nothing — they are identical', 'fold lets you accumulate any type from any seed value — sum only adds numbers. fold is the general-purpose reduction', 'fold is faster', 'sum is deprecated'], answer: 1, why: 'sum() is a convenience for adding numbers. fold(seed, |acc, x| ...) works on any accumulator type and any operation — building strings, hash maps, custom structs.' },
      {
        t: 'try',
        prompt: `Write \`double_positives(xs: &[i32]) -> Vec<i32>\` that returns a new Vec containing only the positive numbers, each doubled.

\`double_positives(&[1, -2, 3])\` → \`[2, 6]\`

Use \`.iter().filter(|&&x| x > 0).map(|&x| x * 2).collect()\`.`,
        lang: 'rust',
        starter: `fn double_positives(xs: &[i32]) -> Vec<i32> {\n    todo!()\n}\n`,
        solution: `fn double_positives(xs: &[i32]) -> Vec<i32> {\n    xs.iter().filter(|&&x| x > 0).map(|&x| x * 2).collect()\n}\n`,
        hints: [
          'Chain .iter(), .filter(), .map(), .collect().',
          'filter(|&&x| x > 0) needs the double reference pattern for i32.',
          'collect() infers the return type from the function signature.',
        ],
        cases: [
          { name: 'mixed', call: 'double_positives(&[1, -2, 3])', expect: 'vec![2, 6]' },
          { name: 'all negative', call: 'double_positives(&[-5, -1])', expect: 'vec![]' },
        ],
      },

    ],
  },

  /* ==================================================== 10 */
  {
    id: 'rs-l10',
    topic: 'functions-and-flow',
    difficulty: 'advanced',
    title: 'Advanced Pattern Matching and Error Handling',
    minutes: 15,
    summary: 'match guards, destructuring nested structs, if-let and while-let, and the full Result toolkit.',
    objectives: ['Use match guards with if conditions', 'Destructure deeply nested types', 'Chain Results with ? and combinator methods'],
    blocks: [
      { t: 'text', md: '`match` can bind variables AND test them with **guards**. `if let` handles the case where you only care about one variant. `while let` loops while a pattern matches.\n\nFor `Result`, the combinator methods — `map`, `and_then`, `or_else`, `unwrap_or` — eliminate the need for explicit `match` in most cases.' },
      { t: 'code', run: true, lang: 'rust', code: `fn main() {\n    // match with guards\n    let pair = (4, -2);\n    match pair {\n        (x, y) if x == y => println!("equal: {x}"),\n        (x, y) if x + y == 0 => println!("zero sum: {x} + {y}\"),\n        (x, _) if x > 0 => println!("positive first: {x}\"),\n        _ => println!("something else"),\n    }\n\n    // if let: only care about Some\n    let maybe = Some(42);\n    if let Some(value) = maybe {\n        println!("got: {value}\");\n    }\n\n    // while let: iterate until None\n    let mut stack = vec![1, 2, 3];\n    while let Some(top) = stack.pop() {\n        println!("popped: {top}\");\n    }\n}` },
      { t: 'text', md: '## The Result combinator toolkit\n\nInstead of nested `match` blocks, chain methods that transform the success value or recover from the error.' },
      { t: 'code', run: true, lang: 'rust', code: `fn parse_and_double(s: &str) -> Result<i32, String> {\n    s.trim()\n        .parse::<i32>()\n        .map_err(|e| format!("not a number: {e}"))\n        .map(|n| n * 2)\n}\n\nfn main() {\n    println!("{:?}", parse_and_double("21\"));\n    println!("{:?}", parse_and_double("abc"));\n\n    // Chaining Option and Result\n    let config = std::env::var("PORT\")\n        .ok()\n        .and_then(|s| s.parse::<u16>().ok())\n        .unwrap_or(8080);\n    println!("port: {config}");\n}` },
      {
        t: 'case',
        title: 'Case study — parsing a simple config file format',
        md: 'A parser for `key: value` lines that uses the full Result toolkit. `split_once` returns an Option, `ok_or` converts it to a Result, and `?` propagates errors. A single pass through the iterator with `collect()` builds the HashMap or returns the first error.',
        run: true,
        lang: 'rust',
        code: `use std::collections::HashMap;\n\nfn parse_config(lines: &[&str]) -> Result<HashMap<String, String>, String> {\n    lines.iter()\n        .map(|line| {\n            let (key, value) = line\n                .split_once('=')\n                .ok_or_else(|| format!("missing '=' in: {line}"))?;\n            Ok((key.trim().to_string(), value.trim().to_string()))\n        })\n        .collect()\n}\n\nfn main() {\n    let input = vec!["host=localhost", "port=8080", "debug=true"];\n    match parse_config(&input) {\n        Ok(config) => {\n            for (k, v) in &config {\n                println!("{k} = {v}");\n            }\n        }\n        Err(e) => println!("Parse error: {e}"),\n    }\n}`,
      },
      { t: 'quiz', q: 'Why does `.collect()` work with `Result<Vec<HashMap<...>>>` in the example?', options: ['It does not — collect() only builds Vecs', 'Iterator of Results can collect into a Result of a collection — short-circuiting on the first Err. collect() auto-implements this for any FromIterator impl', 'collect() ignores errors', 'You must use a for loop'], answer: 1, why: 'collect() has a generic FromIterator implementation for Result<C, E> where C: FromIterator. It gathers Ok values or short-circuits on the first Err.' },
      {
        t: 'try',
        prompt: `Write \`parse_or_zero(s: &str) -> i32\` that parses a string to an integer, returning \`0\` if parsing fails.

\`parse_or_zero("42")\` → \`42\`\n\`parse_or_zero("banana")\` → \`0\`

Use \`.parse::<i32>()\` and \`.unwrap_or(0)\` on the Result.`,
        lang: 'rust',
        starter: `fn parse_or_zero(s: &str) -> i32 {\n    todo!()\n}\n`,
        solution: `fn parse_or_zero(s: &str) -> i32 {\n    s.parse::<i32>().unwrap_or(0)\n}\n`,
        hints: [
          's.parse::<i32>() returns a Result<i32, ParseIntError>.',
          '.unwrap_or(0) gives 0 if parsing failed.',
          'Return the result — no semicolon.',
        ],
        cases: [
          { name: 'valid', call: 'parse_or_zero("42")', expect: '42' },
          { name: 'invalid', call: 'parse_or_zero("banana")', expect: '0' },
          { name: 'negative', call: 'parse_or_zero("-5")', expect: '-5' },
        ],
      },

    ],
  },

  /* ==================================================== 11 */
  {
    id: 'rs-l11',
    topic: 'ownership-and-borrowing',
    difficulty: 'intermediate',
    title: 'Lifetimes in Practice',
    minutes: 14,
    summary: 'Explicit lifetime annotations, the rules the compiler uses to elide them, and the common patterns.',
    objectives: ['Annotate lifetimes on functions and structs', 'Explain the three elision rules', 'Fix common lifetime errors'],
    blocks: [
      { t: 'text', md: 'Every reference in Rust has a **lifetime** — the scope for which it is valid. Most of the time the compiler infers them (lifetime elision). When it cannot, you annotate with `\'a`.\n\nThe three elision rules:\n1. Each reference parameter gets its own lifetime.\n2. If there is exactly one input lifetime, it is assigned to all output lifetimes.\n3. If there is `&self` or `&mut self`, its lifetime is assigned to all outputs.' },
      { t: 'code', run: true, lang: 'rust', code: `// Rule 2: one input lifetime → assigned to output\nfn first_word(s: &str) -> &str {\n    // compiler infers: fn first_word<'a>(s: &'a str) -> &'a str\n    s.split_whitespace().next().unwrap_or("")\n}\n\n// Need explicit: two input lifetimes, ambiguous output\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nfn main() {\n    let a = String::from("hello\");\n    let b = String::from("world!\");\n    println!("{}", longest(&a, &b));\n}` },
      { t: 'text', md: '## Lifetimes in structs\n\nWhen a struct holds a reference, you must annotate the lifetime. "This struct cannot outlive the thing it points at."' },
      { t: 'code', run: true, lang: 'rust', code: `#[derive(Debug)]\nstruct Excerpt<'a> {\n    text: &'a str,\n}\n\nimpl<'a> Excerpt<'a> {\n    fn first_line(&self) -> &str {\n        // rule 3 applies: &self lifetime assigned to output\n        self.text.lines().next().unwrap_or("")\n    }\n}\n\nfn main() {\n    let document = String::from("Line 1\\nLine 2\\nLine 3\");\n    let excerpt = Excerpt { text: &document };\n    println!("{:?}", excerpt);\n    println!("first: {}", excerpt.first_line());\n}` },
      {
        t: 'case',
        title: 'Case study — a search result with a highlight snippet',
        md: 'A struct that borrows from the original text to avoid copying. `SearchResult` holds a reference to the matching line. The lifetime `\'a` guarantees the result is used only while the original document exists — the compiler prevents use-after-free at compile time.',
        run: true,
        lang: 'rust',
        code: `#[derive(Debug)]\nstruct SearchResult<'a> {\n    line: &'a str,\n    line_number: usize,\n    snippet: String,\n}\n\nfn search<'a>(text: &'a str, query: &str) -> Vec<SearchResult<'a>> {\n    text.lines()\n        .enumerate()\n        .filter(|(_, line)| line.contains(query))\n        .map(|(i, line)| {\n            let start = line.find(query).unwrap_or(0);\n            let snippet = line[start..].to_string();\n            SearchResult { line, line_number: i + 1, snippet }\n        })\n        .collect()\n}\n\nfn main() {\n    let text = \"Rust is fast\\nMemory safe\\nNo garbage collector\\n\";\n    let results = search(text, \"safe\");\n    for r in &results {\n        println!("line {}: {}", r.line_number, r.snippet);\n    }\n}`,
      },
      { t: 'quiz', q: 'Why does `fn first_word(s: &str) -> &str` compile without lifetime annotations?', options: ['It does not — lifetimes are always required', 'The compiler applies elision rule 2: exactly one input lifetime, assigned to the output', '&str has no lifetime', 'The Rust team added special handling'], answer: 1, why: 'With exactly one reference input, the compiler assigns its lifetime to every reference output. This covers the vast majority of functions.' },
      {
        t: 'try',
        prompt: `Write \`shorter<'a>(x: &'a str, y: &'a str) -> &'a str\` that returns the shorter of two string slices.

\`shorter("hello", "hi")\` → \`"hi"\`

Both references share the same lifetime \`'a\`, and the return borrows for the same duration.`,
        lang: 'rust',
        starter: `fn shorter<'a>(x: &'a str, y: &'a str) -> &'a str {\n    todo!()\n}\n`,
        solution: `fn shorter<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() < y.len() { x } else { y }\n}\n`,
        hints: [
          'Compare lengths with x.len() and y.len().',
          'Return whichever is shorter — ties go to y.',
          'The lifetime annotation is given — focus on the body.',
        ],
        cases: [
          { name: 'first is shorter', call: 'shorter("hi", "hello")', expect: 'String::from("hi")' },
          { name: 'second is shorter', call: 'shorter("hello", "hi")', expect: 'String::from("hi")' },
        ],
      },

    ],
  },

  /* ==================================================== 12 */
  {
    id: 'rs-l12',
    topic: 'ownership-and-borrowing',
    difficulty: 'advanced',
    title: 'Rc, RefCell and Interior Mutability',
    minutes: 15,
    summary: 'Shared ownership with Rc, runtime borrow checking with RefCell, and when to use them over compile-time checks.',
    objectives: ['Share data with Rc (reference counting)', 'Mutate through a shared reference with RefCell', 'Explain interior mutability'],
    blocks: [
      { t: 'text', md: 'The borrow checker enforces rules at compile time — one mutable reference OR many immutable ones. But some patterns (graphs, caches, GUI trees) genuinely need multiple owners or mutation through a shared reference.\n\n`Rc<T>` gives shared ownership via reference counting. `RefCell<T>` moves borrow checking to **runtime** — it panics if you break the rules, but lets you mutate through a shared `&` reference.' },
      { t: 'code', run: true, lang: 'rust', code: `use std::rc::Rc;\nuse std::cell::RefCell;\n\nfn main() {\n    // Rc: shared ownership\n    let a = Rc::new(String::from("shared\"));\n    let b = Rc::clone(&a);\n    let c = Rc::clone(&a);\n    println!("count: {} (value: {})\", Rc::strong_count(&a), a);\n\n    // RefCell: mutate through & reference\n    let data = RefCell::new(42);\n    *data.borrow_mut() = 100;\n    println!(\"{}\", data.borrow());\n\n    // Rc<RefCell<T>> is the standard shared mutable pattern\n    let shared = Rc::new(RefCell::new(vec![1, 2, 3]));\n    let handle1 = Rc::clone(&shared);\n    let handle2 = Rc::clone(&shared);\n    handle1.borrow_mut().push(4);\n    handle2.borrow_mut().push(5);\n    println!(\"{:?}\", shared.borrow());\n}` },
      {
        t: 'case',
        title: 'Case study — a simple event bus with multiple listeners',
        md: 'An event system where multiple listeners share the same event log. Each listener gets an `Rc<RefCell<Vec<String>>>` — they can read the history and append new events. The reference count tracks how many listeners are still alive.',
        run: true,
        lang: 'rust',
        code: `use std::rc::Rc;\nuse std::cell::RefCell;\n\n#[derive(Clone)]\nstruct EventBus {\n    events: Rc<RefCell<Vec<String>>>,\n}\n\nimpl EventBus {\n    fn new() -> Self {\n        EventBus { events: Rc::new(RefCell::new(Vec::new())) }\n    }\n\n    fn emit(&self, event: &str) {\n        self.events.borrow_mut().push(event.to_string());\n        println!(\"event: {event}\");\n    }\n\n    fn history(&self) -> Vec<String> {\n        self.events.borrow().clone()\n    }\n\n    fn listener_count(&self) -> usize {\n        Rc::strong_count(&self.events)\n    }\n}\n\nfn main() {\n    let bus = EventBus::new();\n    let listener1 = bus.clone();\n    let listener2 = bus.clone();\n\n    println!(\"listeners: {}\", bus.listener_count());\n\n    bus.emit(\"user_logged_in\");\n    listener1.emit(\"file_saved\");\n\n    println!(\"history: {:?}\", listener2.history());\n}`,
      },
      { t: 'quiz', q: 'When should you use `RefCell` instead of a regular `&mut`?', options: ['Never — RefCell is deprecated', 'When the compiler cannot prove the borrow rules statically but you can guarantee them at runtime — e.g. when sharing data through Rc or when mutation needs to happen through a & reference', 'RefCell is always preferred', 'Only in tests'], answer: 1, why: 'RefCell trades compile-time guarantees for runtime checks. Use it when the ownership structure (multiple owners, self-referential types) cannot be expressed to the borrow checker.' },
      {
        t: 'try',
        prompt: `Write \`count_refs(rc: &Rc<String>) -> usize\` that returns how many strong references point to the Rc's value.

Use \`Rc::strong_count()\` — this is how Rust tracks shared ownership at runtime.`,
        lang: 'rust',
        starter: `use std::rc::Rc;\n\nfn count_refs(rc: &Rc<String>) -> usize {\n    todo!()\n}\n`,
        solution: `use std::rc::Rc;\n\nfn count_refs(rc: &Rc<String>) -> usize {\n    Rc::strong_count(rc)\n}\n`,
        hints: [
          'Rc::strong_count takes a reference to the Rc.',
          'It returns the number of active strong references.',
          'Return the count — no semicolon.',
        ],
        cases: [
          { name: 'single owner', call: 'count_refs(&Rc::new(String::from("data")))', expect: '1' },
          {
            name: 'two owners',
            call: '{ let a = Rc::new(String::from("shared")); let b = Rc::clone(&a); count_refs(&a) }',
            expect: '2',
          },
        ],
      },

    ],
  },

];
