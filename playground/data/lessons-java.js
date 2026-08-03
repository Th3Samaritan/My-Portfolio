/* ============================================================
   Java — Beginner course
   Same lesson schema as lessons-python.js.

   Runnable examples compile remotely, so each Run takes a moment.
   Examples are complete programs (`class Main` with a `main`
   method); exercises are static members spliced into that class,
   exactly like the Java challenges.
   ============================================================ */

export const javaLessonTopics = [
  { id: 'getting-started', name: 'Getting Started', blurb: 'Your first program, the JVM, and why Java looks the way it does.' },
  { id: 'control-flow', name: 'Flow & Methods', blurb: 'Branching, looping, and packaging work into reusable methods.' },
  { id: 'classes-and-objects', name: 'Classes & Objects', blurb: 'Encapsulation, constructors, and the object model Java is built around.' },
  { id: 'collections', name: 'Collections', blurb: 'List, Map, Set — the data structures that cover most real work.' },
  { id: 'inheritance', name: 'Inheritance & Polymorphism', blurb: 'Extending classes, overriding methods, and designing for extension.' },
  { id: 'generics', name: 'Generics & Interfaces', blurb: 'Type parameters, bounded types, and coding to interfaces.' },
  { id: 'streams', name: 'Streams & Lambdas', blurb: 'Functional pipelines, method references, and the Stream API.' },
  { id: 'exceptions', name: 'Exceptions & I/O', blurb: 'Checked vs unchecked, try-with-resources, and file handling.' },
  { id: 'concurrency', name: 'Concurrency', blurb: 'Threads, ExecutorService, CompletableFuture, and thread safety.' },
];

export const javaLessons = [
  /* ==================================================== 1 */
  {
    id: 'jv-l1',
    topic: 'getting-started',
    title: 'Your First Java Program',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'Why Java looks so verbose, what every word in the boilerplate means, and printing your first line.',
    objectives: ['Write and run a Java program', 'Explain each part of the main method', 'Read a compiler error'],
    blocks: [
      {
        t: 'text',
        md: `Java's reputation is "verbose". That is fair — and it is a deliberate trade.

Java is **statically typed and compiled**: you declare what everything is, and a compiler checks it all before the program runs. You type more; in exchange, a large class of mistakes is caught before your code ever executes, and tools can navigate and refactor a million-line codebase reliably.

That trade is why Java runs so much of the world's banking, Android and enterprise software.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
      },
      {
        t: 'text',
        md: `That is a lot of words to print one line. Every one has a job:

| Word | Meaning |
|---|---|
| \`class Main\` | Java code lives inside classes. This one is called Main. |
| \`public\` | anyone may call this method |
| \`static\` | belongs to the class itself, not to an instance of it |
| \`void\` | returns nothing |
| \`main\` | the special name the program starts from |
| \`String[] args\` | command-line arguments, as an array of text |
| \`System.out.println\` | print a line to standard output |

Braces \`{ }\` group code — Java ignores indentation entirely, but you must still indent for humans. Statements end with a **semicolon**.

You will type \`public static void main(String[] args)\` many times. Soon it will be muscle memory and you will stop seeing it.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'What `static` actually means',
        md: `This is the word beginners find most mysterious, so here it is early.

Most Java methods belong to an **object** — you make a \`Dog\` and call \`myDog.bark()\`. A \`static\` method belongs to the **class itself**: you call it as \`Main.helper()\` without making anything.

\`main\` has to be static because when your program starts, no objects exist yet. Something has to run first, and it cannot belong to an object.

On this platform your exercises are static methods for the same reason — they can be called directly, without constructing anything.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Line one");\n        System.out.print("No newline... ");\n        System.out.println("...continues here");\n\n        String name = "Ada";\n        int year = 1815;\n\n        System.out.println(name + " was born in " + year);\n        System.out.printf("%s was born in %d%n", name, year);\n    }\n}`,
      },
      {
        t: 'text',
        md: `Three ways to build output:

- \`+\` **concatenates**. Mixing a String with a number converts the number to text automatically.
- \`printf\` uses placeholders: \`%s\` for text, \`%d\` for whole numbers, \`%.2f\` for two decimals, \`%n\` for a newline.
- \`println\` adds a newline; \`print\` does not.`,
      },
      {
        t: 'text',
        md: `## Meeting the compiler

This one is broken. Run it and read what comes back.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        int count = "five";\n        System.out.println(count);\n    }\n}`,
      },
      {
        t: 'text',
        md: `\`\`\`
error: incompatible types: String cannot be converted to int
\`\`\`

The program never ran. Java refused to build it because \`"five"\` is text and \`count\` was declared to hold a whole number.

In Python this same mistake would run happily until something downstream tried arithmetic and exploded — possibly in production. **This is the trade Java is making for you.**`,
      },
      {
        t: 'try',
        prompt: `Write a method \`greeting(String name)\` that returns \`Hello, <name>!\`

\`greeting("Ada")\` → \`"Hello, Ada!"\`

Because your code is spliced into the Main class, write it as a **static** method:

\`\`\`java
static String greeting(String name) {
    return ...;
}
\`\`\`

Build the text with \`+\`.`,
        lang: 'java',
        starter: `static String greeting(String name) {\n    return null;\n}\n`,
        solution: `static String greeting(String name) {\n    return "Hello, " + name + "!";\n}\n`,
        hints: [
          'Concatenate three pieces: the opening text, the name, and the "!".',
          'Mind the comma and space inside the first string: "Hello, "',
          'return "Hello, " + name + "!";',
        ],
        cases: [
          { name: 'greets Ada', call: 'greeting("Ada")', expect: '"Hello, Ada!"' },
          { name: 'greets someone else', call: 'greeting("Grace")', expect: '"Hello, Grace!"' },
          { name: 'handles an empty name', call: 'greeting("")', expect: '"Hello, !"', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Why must `main` be declared `static`?',
        options: [
          'For speed',
          'Because no objects exist when the program starts, so the entry point cannot belong to one',
          'Because it returns void',
          'It does not have to be',
        ],
        answer: 1,
        why: 'static means the method belongs to the class rather than to an instance. Since nothing has been constructed at launch, the entry point must be callable without an object.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `static String shout(String text)` returning text uppercased with three exclamation marks.\n\n`shout(\"hello\")` → `\"HELLO!!!\"`",
            "lang": "java",
            "starter": "static String shout(String text) {\n    return null;\n}\n",
            "solution": "static String shout(String text) {\n    return text.toUpperCase() + \"!!!\";\n}\n",
            "hints": [
                  "Call text.toUpperCase().",
                  "Concatenate with \"!!!\" using +.",
                  "Return the result."
            ],
            "cases": [
                  {
                        "name": "shouts",
                        "call": "shout(\"hello\")",
                        "expect": "\"HELLO!!!\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 2 */
  {
    id: 'jv-l2',
    topic: 'getting-started',
    title: 'Types and Variables',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'Declaring values, primitives vs objects, and the equality trap that catches everyone.',
    objectives: ['Declare variables with explicit types', 'Distinguish primitives from objects', 'Compare strings correctly'],
    blocks: [
      {
        t: 'text',
        md: `Every variable in Java declares its type first:

\`\`\`java
int count = 10;
String name = "Ada";
\`\`\`

Once declared, that type never changes. \`count\` will hold whole numbers for its entire life.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        int count = 42;\n        long big = 9000000000L;      // L suffix for long literals\n        double price = 19.99;\n        boolean ready = true;\n        char initial = 'A';          // single quotes for char\n        String label = "text";       // double quotes for String\n\n        System.out.println(count + " " + big + " " + price);\n        System.out.println(ready + " " + initial + " " + label);\n\n        final int MAX = 100;         // final = cannot be reassigned\n        System.out.println("MAX is " + MAX);\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Primitives vs objects',
        md: `Java has two kinds of value, and the distinction matters.

**Primitives** — \`int\`, \`double\`, \`boolean\`, \`char\`, \`long\` — are raw values. Lowercase names. Fast, cannot be null.

**Objects** — \`String\`, \`Integer\`, \`ArrayList\` — are references to things. Uppercase names. Can be \`null\`.

Each primitive has an object twin (\`int\`/\`Integer\`, \`double\`/\`Double\`). Java converts between them automatically — *autoboxing* — which is convenient right up until an \`Integer\` that is \`null\` gets unboxed and throws a \`NullPointerException\`.

**Prefer primitives** unless you need an object (collections require objects).`,
      },
      {
        t: 'text',
        md: `## Integer division bites

Dividing two integers gives an integer. The remainder is discarded, not rounded.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        System.out.println(7 / 2);        // 3   <- not 3.5\n        System.out.println(7 / 2.0);      // 3.5 <- one double is enough\n        System.out.println((double) 7 / 2); // 3.5 <- explicit cast\n        System.out.println(7 % 2);        // 1   <- remainder\n\n        int total = 7;\n        int people = 2;\n        double each = (double) total / people;\n        System.out.println("Each gets " + each);\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Never compare strings with ==',
        md: `This is the single most common Java bug for beginners.

\`\`\`java
String a = "hello";
String b = "hel" + "lo";
a == b            // might be true, might be false — do not rely on it
a.equals(b)       // true — correct
\`\`\`

\`==\` on objects asks *"are these the same object in memory?"* — not *"do they hold the same text?"*. Java sometimes reuses identical literals, which makes \`==\` appear to work in simple tests and then fail on strings built at runtime. That is the worst kind of bug: intermittent.

**Rule: \`==\` for primitives, \`.equals()\` for objects. Always.**`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = new String("hello");   // forced into a separate object\n\n        System.out.println("a == b      : " + (a == b));\n        System.out.println("a.equals(b) : " + a.equals(b));\n\n        int x = 5, y = 5;\n        System.out.println("primitives with == : " + (x == y));\n    }\n}`,
      },
      {
        t: 'try',
        prompt: `Write \`isSameWord(String a, String b)\` returning \`true\` when two words are the same, **ignoring case and surrounding whitespace**.

\`isSameWord("  Hello ", "hello")\` → \`true\`

Useful methods:
- \`text.trim()\` removes surrounding whitespace
- \`text.equalsIgnoreCase(other)\` compares without caring about case

Chain them: trim both, then compare.`,
        lang: 'java',
        starter: `static boolean isSameWord(String a, String b) {\n    return false;\n}\n`,
        solution: `static boolean isSameWord(String a, String b) {\n    return a.trim().equalsIgnoreCase(b.trim());\n}\n`,
        hints: [
          'Call .trim() on each string first.',
          'Then compare with .equalsIgnoreCase(...) rather than ==.',
          'return a.trim().equalsIgnoreCase(b.trim());',
        ],
        cases: [
          { name: 'ignores case and spaces', call: 'isSameWord("  Hello ", "hello")', expect: 'true' },
          { name: 'different words', call: 'isSameWord("cat", "dog")', expect: 'false' },
          { name: 'exact match', call: 'isSameWord("java", "java")', expect: 'true' },
          { name: 'both blank', call: 'isSameWord("   ", "")', expect: 'true', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Why can `firstName == secondName` be false even when both hold "Ada"?',
        options: [
          'Because Strings are case sensitive',
          'Because == compares object identity, not contents — use .equals() instead',
          'Because one is null',
          'It cannot be false',
        ],
        answer: 1,
        why: '== asks whether two references point at the same object. Two Strings can hold identical text in separate objects, so contents must be compared with .equals().',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `static String shout(String text)` returning text uppercased with three exclamation marks.\n\n`shout(\"hello\")` → `\"HELLO!!!\"`",
            "lang": "java",
            "starter": "static String shout(String text) {\n    return null;\n}\n",
            "solution": "static String shout(String text) {\n    return text.toUpperCase() + \"!!!\";\n}\n",
            "hints": [
                  "Call text.toUpperCase().",
                  "Concatenate with \"!!!\" using +.",
                  "Return the result."
            ],
            "cases": [
                  {
                        "name": "shouts",
                        "call": "shout(\"hello\")",
                        "expect": "\"HELLO!!!\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 3 */
  {
    id: 'jv-l3',
    topic: 'control-flow',
    title: 'Decisions, Loops and Methods',
    difficulty: 'beginner',
    minutes: 14,
    summary: 'if, switch, the three loops, and packaging work into reusable methods.',
    objectives: ['Branch with if and switch', 'Loop over ranges and arrays', 'Write methods with parameters and return types'],
    blocks: [
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        int score = 73;\n\n        if (score >= 90) {\n            System.out.println("A");\n        } else if (score >= 80) {\n            System.out.println("B");\n        } else if (score >= 70) {\n            System.out.println("C");\n        } else {\n            System.out.println("F");\n        }\n\n        // Conditions go in brackets; blocks go in braces.\n        boolean canVote = score > 0 && score < 200;\n        System.out.println("Sensible score? " + canVote);\n    }\n}`,
      },
      {
        t: 'text',
        md: `Conditions live in \`( )\` and the body in \`{ }\`. The comparison operators are the same as everywhere else: \`==\` \`!=\` \`>\` \`<\` \`>=\` \`<=\`, combined with \`&&\` (and), \`||\` (or), \`!\` (not).

Java's \`&&\` and \`||\` **short-circuit** — if the left side settles the answer, the right side is never evaluated. That is what makes this safe:

\`\`\`java
if (name != null && name.length() > 0) { ... }
\`\`\`

Reverse those two tests and you get a \`NullPointerException\`.`,
      },
      {
        t: 'text',
        md: `## Loops

Three shapes, each with a job:

- \`for\` — when you know the count
- **enhanced for** — over every item in a collection or array
- \`while\` — until a condition changes`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 3; i++) {\n            System.out.println("for: " + i);\n        }\n\n        String[] names = {"Ada", "Grace", "Alan"};\n        for (String name : names) {\n            System.out.println("each: " + name);\n        }\n\n        int countdown = 3;\n        while (countdown > 0) {\n            System.out.println("while: " + countdown);\n            countdown--;\n        }\n\n        int total = 0;\n        for (int i = 1; i <= 100; i++) {\n            total += i;\n        }\n        System.out.println("1..100 = " + total);\n    }\n}`,
      },
      {
        t: 'text',
        md: `The classic \`for\` header has three parts separated by semicolons:

\`\`\`java
for (int i = 0; i < 3; i++)
//   ^start     ^keep going  ^after each pass
\`\`\`

\`i++\` adds one. \`i--\` subtracts one. \`total += i\` is shorthand for \`total = total + i\`.

Use the **enhanced for** (\`for (String name : names)\`) whenever you do not need the index — it is clearer and cannot run off the end.`,
      },
      {
        t: 'text',
        md: `## Methods

A method is a named block of work. Declare the return type, the name, and the parameters with their types.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n\n    static int square(int n) {\n        return n * n;\n    }\n\n    static double average(int[] numbers) {\n        if (numbers.length == 0) {\n            return 0;\n        }\n        int total = 0;\n        for (int n : numbers) {\n            total += n;\n        }\n        return (double) total / numbers.length;\n    }\n\n    static void announce(String message) {   // void returns nothing\n        System.out.println(">> " + message);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(square(7));\n        System.out.println(average(new int[]{4, 8, 15}));\n        announce("methods are just named work");\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Overloading',
        md: `Java lets several methods share a name as long as their parameters differ:

\`\`\`java
static int add(int a, int b)        { return a + b; }
static double add(double a, double b) { return a + b; }
\`\`\`

The compiler picks by the argument types. This is why \`System.out.println\` accepts a String, an int, a boolean or an object — there are many overloads of it.`,
      },
      {
        t: 'try',
        prompt: `Write \`countVowels(String text)\` returning how many vowels (\`a e i o u\`, either case) the text contains.

\`countVowels("Hello World")\` → \`3\`

Useful pieces:
- \`text.length()\` is the number of characters
- \`text.charAt(i)\` gives the character at position \`i\`
- \`"aeiou".indexOf(c)\` returns \`-1\` when \`c\` is not a vowel
- \`Character.toLowerCase(c)\` handles capitals

Loop over the characters, count the matches, return the count.`,
        lang: 'java',
        starter: `static int countVowels(String text) {\n    return 0;\n}\n`,
        solution: `static int countVowels(String text) {\n    int count = 0;\n    for (int i = 0; i < text.length(); i++) {\n        char c = Character.toLowerCase(text.charAt(i));\n        if ("aeiou".indexOf(c) >= 0) {\n            count++;\n        }\n    }\n    return count;\n}\n`,
        hints: [
          'Declare int count = 0; before the loop.',
          'Loop with for (int i = 0; i < text.length(); i++)',
          'Test with "aeiou".indexOf(c) >= 0 after lowercasing c.',
        ],
        cases: [
          { name: 'Hello World', call: 'countVowels("Hello World")', expect: '3' },
          { name: 'handles capitals', call: 'countVowels("AEIOU")', expect: '5' },
          { name: 'no vowels', call: 'countVowels("rhythm")', expect: '0' },
          { name: 'empty string', call: 'countVowels("")', expect: '0', hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Why is `if (name != null && name.length() > 0)` safe, but the reverse order is not?',
        options: [
          'It is not safe either way',
          '`&&` short-circuits: if the null check fails, the right side is never evaluated',
          'Java checks null automatically',
          'Because length() cannot throw',
        ],
        answer: 1,
        why: '&& stops as soon as the answer is settled. With the null check first, length() is never called on null. Reversed, it would be called immediately and throw a NullPointerException.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `static boolean canVote(int age)` returning true if age >= 18. Return the comparison directly.",
            "lang": "java",
            "starter": "static boolean canVote(int age) {\n    return false;\n}\n",
            "solution": "static boolean canVote(int age) {\n    return age >= 18;\n}\n",
            "hints": [
                  "The comparison age >= 18 is already a boolean.",
                  "Return it directly — no if needed.",
                  "One line."
            ],
            "cases": [
                  {
                        "name": "adult",
                        "call": "canVote(20)",
                        "expect": "true"
                  },
                  {
                        "name": "minor",
                        "call": "canVote(16)",
                        "expect": "false"
                  }
            ]
      },

      {
            "t": "debug",
            "prompt": "The `isWeekend` method has a subtle bug. January has 31 days, not 32. But the real bug is worse: it uses `==` on Strings. Fix both issues.\n\n`day.equals(\"Saturday\")` is correct; `day == \"Saturday\"` is not.",
            "lang": "java",
            "starter": "static boolean isWeekend(String day) {\n    // BUG: == compares references, not content\n    if (day == \"Saturday\" || day == \"Sunday\") {\n        return true;\n    }\n    return false;\n}\n",
            "solution": "static boolean isWeekend(String day) {\n    return \"Saturday\".equals(day) || \"Sunday\".equals(day);\n}\n",
            "bug_description": "`==` on Strings compares object identity, not content. Two Strings with the same text can be different objects. Use `.equals()` instead. The null-safe form is `\"Saturday\".equals(day)`.",
            "hints": [
                  "Replace == with .equals().",
                  "Call .equals() on the literal: \"Saturday\".equals(day) — this is null-safe.",
                  "The whole method can be a single return statement."
            ],
            "cases": [
                  {
                        "name": "Saturday",
                        "call": "isWeekend(\"Saturday\")",
                        "expect": "true"
                  },
                  {
                        "name": "Wednesday",
                        "call": "isWeekend(\"Wednesday\")",
                        "expect": "false"
                  },
                  {
                        "name": "null is safe",
                        "call": "isWeekend(null)",
                        "expect": "false"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 4 */
  {
    id: 'jv-l4',
    topic: 'classes-and-objects',
    title: 'Classes and Objects',
    difficulty: 'beginner',
    minutes: 15,
    summary: 'Bundling data with the behaviour that operates on it — the idea Java is built around.',
    objectives: ['Define a class with fields and methods', 'Use a constructor', 'Explain why fields are private'],
    blocks: [
      {
        t: 'text',
        md: `So far everything has been \`static\` — functions with no home. Java's real model is **objects**: data and the behaviour that belongs to it, bundled together.

A **class** is the blueprint. An **object** is one thing built from it.

Blueprint: \`BankAccount\`. Objects: your account, my account — same shape, different balances.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n\n    static class Dog {\n        private String name;      // field: the data\n        private int age;\n\n        Dog(String name, int age) {   // constructor: how one is made\n            this.name = name;\n            this.age = age;\n        }\n\n        String speak() {              // method: the behaviour\n            return name + " says woof";\n        }\n\n        int humanYears() {\n            return age * 7;\n        }\n    }\n\n    public static void main(String[] args) {\n        Dog rex = new Dog("Rex", 3);\n        Dog bella = new Dog("Bella", 5);\n\n        System.out.println(rex.speak());\n        System.out.println(bella.speak());\n        System.out.println("Rex is " + rex.humanYears() + " in human years");\n    }\n}`,
      },
      {
        t: 'text',
        md: `Reading it:

- **fields** hold each object's own data
- the **constructor** shares the class's name and has no return type; it runs on \`new\`
- \`this.name\` means *this object's* name, distinguishing it from the parameter of the same name
- **methods** are not \`static\` here, so they belong to an object and can see its fields
- \`new Dog("Rex", 3)\` builds one

\`rex\` and \`bella\` each have their own \`name\` and \`age\`. Same blueprint, separate data.`,
      },
      {
        t: 'note',
        tone: 'why',
        title: 'Why are the fields private?',
        md: `\`private\` means "only code inside this class may touch this". It is not paranoia — it is what lets a class **guarantee** things.

If \`age\` were public, anyone could write \`rex.age = -40\`. Now every method that reads it must defend against nonsense.

Keep fields private and expose methods, and the class controls its own rules:

\`\`\`java
void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("age cannot be negative");
    }
    this.age = age;
}
\`\`\`

Now a negative age is impossible, everywhere, forever. This is **encapsulation**, and it is the whole point of the object model.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `class Main {\n\n    static class BankAccount {\n        private final String owner;   // final = set once, never changed\n        private int balanceInPence;\n\n        BankAccount(String owner) {\n            this.owner = owner;\n            this.balanceInPence = 0;\n        }\n\n        void deposit(int pence) {\n            if (pence <= 0) {\n                throw new IllegalArgumentException("deposit must be positive");\n            }\n            balanceInPence += pence;\n        }\n\n        boolean withdraw(int pence) {\n            if (pence <= 0 || pence > balanceInPence) {\n                return false;          // refuse, do not corrupt the balance\n            }\n            balanceInPence -= pence;\n            return true;\n        }\n\n        String statement() {\n            return String.format("%s: %d.%02d", owner, balanceInPence / 100, balanceInPence % 100);\n        }\n    }\n\n    public static void main(String[] args) {\n        BankAccount account = new BankAccount("Ada");\n\n        account.deposit(5000);\n        System.out.println(account.statement());\n\n        System.out.println("Withdraw 2000: " + account.withdraw(2000));\n        System.out.println("Withdraw 99999: " + account.withdraw(99999));\n        System.out.println(account.statement());\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Money is stored as whole pence',
        md: `Notice \`balanceInPence\` is an \`int\`, not a \`double\`.

Decimals cannot represent every money value exactly, so \`double\` arithmetic drifts — fractions of a penny that accumulate into real discrepancies. Storing the smallest unit as a whole number and formatting only for display sidesteps the problem entirely.

The variable name says the unit. That is deliberate too: \`balance\` alone would be ambiguous, and unit confusion has crashed actual spacecraft.`,
      },
      {
        t: 'try',
        prompt: `Build a \`Counter\` class.

It needs:
- a \`private int count\` field starting at \`0\`
- \`void increment()\` — adds one
- \`void reset()\` — back to zero
- \`int getCount()\` — returns the current value

Write it as a \`static class\` inside Main (that is how this platform splices your code in):

\`\`\`java
static class Counter {
    private int count = 0;
    ...
}
\`\`\``,
        lang: 'java',
        starter: `static class Counter {\n    private int count = 0;\n\n}\n`,
        solution: `static class Counter {\n    private int count = 0;\n\n    void increment() {\n        count++;\n    }\n\n    void reset() {\n        count = 0;\n    }\n\n    int getCount() {\n        return count;\n    }\n}\n`,
        hints: [
          'increment() returns nothing, so its return type is void.',
          'Inside increment, count++ adds one.',
          'getCount() returns int, so its body is: return count;',
        ],
        cases: [
          { name: 'starts at zero', call: 'new Counter().getCount()', expect: '0' },
          {
            name: 'increments',
            call: '__countAfter(2)',
            expect: '2',
          },
          {
            name: 'reset returns to zero',
            call: '__countAfterReset()',
            expect: '0',
          },
          { name: 'counts to ten', call: '__countAfter(10)', expect: '10', hidden: true },
        ],
        preamble: `static int __countAfter(int times) {\n    Counter c = new Counter();\n    for (int i = 0; i < times; i++) {\n        c.increment();\n    }\n    return c.getCount();\n}\n\nstatic int __countAfterReset() {\n    Counter c = new Counter();\n    c.increment();\n    c.increment();\n    c.reset();\n    return c.getCount();\n}\n`,
      },
      {
        t: 'quiz',
        q: 'What does making a field `private` buy you?',
        options: [
          'Faster access',
          'Only the class itself can change it, so the class can enforce its own rules and stay in a valid state',
          'It uses less memory',
          'It makes the field final',
        ],
        answer: 1,
        why: 'Private fields mean all changes go through the class\'s own methods, which can validate. Public fields let any code put the object into a nonsensical state.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Create a `static class Rectangle` with private fields `width` and `height` (both double). Add a constructor, a method `area()` returning width * height, and a method `perimeter()` returning 2 * (width + height).",
            "lang": "java",
            "starter": "static class Rectangle {\n    private double width;\n    private double height;\n\n    Rectangle(double w, double h) { width = w; height = h; }\n\n    double area() { return 0; }\n    double perimeter() { return 0; }\n}\n",
            "solution": "static class Rectangle {\n    private double width;\n    private double height;\n\n    Rectangle(double w, double h) { width = w; height = h; }\n\n    double area() { return width * height; }\n    double perimeter() { return 2 * (width + height); }\n}\n",
            "hints": [
                  "area: return width * height;",
                  "perimeter: return 2 * (width + height);",
                  "Use a capital R — Rectangle, not rectangle."
            ],
            "cases": [
                  {
                        "name": "area",
                        "call": "new Rectangle(3, 4).area()",
                        "expect": "12.0"
                  },
                  {
                        "name": "perimeter",
                        "call": "new Rectangle(3, 4).perimeter()",
                        "expect": "14.0"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 5 */
  {
    id: 'jv-l5',
    topic: 'collections',
    title: 'Lists and Maps',
    difficulty: 'beginner',
    minutes: 14,
    summary: 'ArrayList and HashMap — the two collections that cover most real work.',
    objectives: ['Store many values in a List', 'Look values up by key with a Map', 'Loop over both safely'],
    blocks: [
      {
        t: 'text',
        md: `Arrays in Java are fixed size — awkward when you do not know how many items you will have. \`ArrayList\` grows as needed.

The declaration looks odd at first:

\`\`\`java
List<String> names = new ArrayList<>();
\`\`\`

- \`List<String>\` is the **type**: a list that holds Strings
- \`<String>\` is a *generic* — it tells the compiler what is inside, so it can catch mistakes
- \`new ArrayList<>()\` builds one; the empty \`<>\` is inferred

Declaring the variable as \`List\` but building an \`ArrayList\` is deliberate — code depends on the general interface, not the specific implementation.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> names = new ArrayList<>();\n\n        names.add("Ada");\n        names.add("Grace");\n        names.add("Alan");\n\n        System.out.println(names);\n        System.out.println("size: " + names.size());\n        System.out.println("first: " + names.get(0));\n        System.out.println("has Grace? " + names.contains("Grace"));\n\n        names.remove("Grace");\n        System.out.println("after remove: " + names);\n\n        for (String name : names) {\n            System.out.println("  - " + name);\n        }\n\n        Collections.sort(names);\n        System.out.println("sorted: " + names);\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Lists hold objects, not primitives',
        md: `\`List<int>\` does not compile. You must use the object twin: \`List<Integer>\`.

Java autoboxes for you, so \`numbers.add(5)\` works. Two things to watch:

- an \`Integer\` can be \`null\`, and unboxing a null throws \`NullPointerException\`
- \`list.remove(2)\` removes the item **at index 2**, while \`list.remove(Integer.valueOf(2))\` removes the **value** 2

That second one has caught a great many people.`,
      },
      {
        t: 'text',
        md: `## Maps: look up by key

A \`Map\` stores key/value pairs — Java's dictionary.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> stock = new HashMap<>();\n\n        stock.put("apples", 12);\n        stock.put("pears", 3);\n        stock.put("plums", 0);\n\n        System.out.println(stock.get("apples"));\n        System.out.println(stock.get("bananas"));            // null, not an error\n        System.out.println(stock.getOrDefault("bananas", 0)); // safer\n        System.out.println("has pears? " + stock.containsKey("pears"));\n\n        for (Map.Entry<String, Integer> entry : stock.entrySet()) {\n            System.out.println(entry.getKey() + " -> " + entry.getValue());\n        }\n    }\n}`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Counting with merge',
        md: `Counting occurrences is the most common Map task. The clean way:

\`\`\`java
counts.merge(word, 1, Integer::sum);
\`\`\`

Read it as: *"put 1 under this key; if something is already there, combine them with sum"*. It replaces the whole "check if the key exists, get it, add one, put it back" dance.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        String sentence = "the cat sat on the mat the end";\n\n        Map<String, Integer> counts = new HashMap<>();\n        for (String word : sentence.split(" ")) {\n            counts.merge(word, 1, Integer::sum);\n        }\n\n        System.out.println(counts);\n\n        String best = null;\n        for (Map.Entry<String, Integer> e : counts.entrySet()) {\n            if (best == null || e.getValue() > counts.get(best)) {\n                best = e.getKey();\n            }\n        }\n        System.out.println("Most common: " + best + " (" + counts.get(best) + ")");\n    }\n}`,
      },
      {
        t: 'try',
        prompt: `Write \`tally(List<String> items)\` returning a \`Map<String, Integer>\` of how many times each item appears.

\`tally(Arrays.asList("a", "b", "a"))\` → \`{a=2, b=1}\`

Use the \`merge\` pattern from above. Remember to create the map before the loop and return it after.`,
        lang: 'java',
        starter: `static Map<String, Integer> tally(List<String> items) {\n    return null;\n}\n`,
        solution: `static Map<String, Integer> tally(List<String> items) {\n    Map<String, Integer> counts = new HashMap<>();\n    for (String item : items) {\n        counts.merge(item, 1, Integer::sum);\n    }\n    return counts;\n}\n`,
        hints: [
          'Start with Map<String, Integer> counts = new HashMap<>();',
          'Loop with the enhanced for: for (String item : items)',
          'counts.merge(item, 1, Integer::sum); then return counts;',
        ],
        cases: [
          { name: 'counts repeats', call: 'tally(Arrays.asList("a", "b", "a"))', expect: 'Map.of("a", 2, "b", 1)' },
          { name: 'all unique', call: 'tally(Arrays.asList("x", "y"))', expect: 'Map.of("x", 1, "y", 1)' },
          { name: 'empty list', call: 'tally(new ArrayList<String>())', expect: 'new HashMap<String, Integer>()' },
          { name: 'single item repeated', call: 'tally(Arrays.asList("z", "z", "z"))', expect: 'Map.of("z", 3)', hidden: true },
        ],
      },
      {
        t: 'text',
        md: `## Where you are now

You can declare typed variables, branch and loop, write methods, design classes that protect their own state, and use the two collections that most Java code is built from.

That is a working foundation. The **Challenges** for this track go from here into comparators, immutable value types, generics, streams and concurrency.

If a compiler error stops you, remember what it is doing: refusing to let a whole category of bug reach your users.`,
      },
      {
        t: 'quiz',
        q: 'Why is `List<String> names = new ArrayList<>();` preferred over `ArrayList<String> names = new ArrayList<>();`?',
        options: [
          'It is faster',
          'The variable depends on the general List interface, so the implementation can change without touching the surrounding code',
          'ArrayList cannot be assigned to a variable',
          'There is no difference at all',
        ],
        answer: 1,
        why: 'Declaring the broadest useful type means the rest of your code only relies on List behaviour. Swapping in a LinkedList later becomes a one-line change.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `static int sumEven(List<Integer> numbers)` returning the sum of even numbers using a for-each loop.\n\n`sumEven(Arrays.asList(1, 2, 3, 4))` → `6`",
            "lang": "java",
            "starter": "static int sumEven(List<Integer> numbers) {\n    return 0;\n}\n",
            "solution": "static int sumEven(List<Integer> numbers) {\n    int total = 0;\n    for (int n : numbers) {\n        if (n % 2 == 0) total += n;\n    }\n    return total;\n}\n",
            "hints": [
                  "Start with int total = 0;",
                  "Use enhanced for: for (int n : numbers).",
                  "Check n % 2 == 0 and add to total."
            ],
            "cases": [
                  {
                        "name": "sum evens",
                        "call": "sumEven(Arrays.asList(1, 2, 3, 4))",
                        "expect": "6"
                  },
                  {
                        "name": "no evens",
                        "call": "sumEven(Arrays.asList(1, 3))",
                        "expect": "0"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 6 */
  {
    id: 'jv-l6',
    topic: 'getting-started',
    difficulty: 'intermediate',
    title: 'The JVM, javac and the Classpath',
    minutes: 12,
    summary: 'What happens when you compile and run Java — bytecode, the JVM, and how the classpath works.',
    objectives: ['Explain bytecode and the JVM', 'Compile and run from the command line', 'Understand the classpath'],
    blocks: [
      { t: 'text', md: 'Java compiles to **bytecode** — instructions for the Java Virtual Machine (JVM), not for your CPU. That is what makes Java portable: compile once, run anywhere there is a JVM.\n\n```bash\njavac Main.java     # produces Main.class (bytecode)\njava Main           # JVM loads and runs Main.class\n```\n\nThe **classpath** is how the JVM finds `.class` files. It is a list of directories and JAR files. Without it, `java` cannot find your code or its dependencies.' },
      { t: 'code', run: true, lang: 'java', code: `class Main {\n    public static void main(String[] args) {\n        // These system properties reveal the runtime environment\n        System.out.println("Java version: " + System.getProperty("java.version"));\n        System.out.println("OS: " + System.getProperty("os.name"));\n\n        // Classpath is where the JVM looks for classes\n        System.out.println("Classpath: " + System.getProperty("java.class.path"));\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — building and running a two-class program',
        md: 'A program split across two files: `Main.java` calls `Calculator.java`. They are compiled together and run with the classpath set to the current directory. This is the pattern behind every Java project — IDEs just automate it.',
        run: true,
        lang: 'java',
        code: `// --- Calculator.java ---\nclass Calculator {\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    static double average(int[] numbers) {\n        if (numbers.length == 0) return 0;\n        int total = 0;\n        for (int n : numbers) total += n;\n        return (double) total / numbers.length;\n    }\n}\n\n// --- Main.java ---\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("4 + 7 = " + Calculator.add(4, 7));\n\n        int[] scores = {85, 92, 78, 90};\n        System.out.println("Average: " + Calculator.average(scores));\n\n        // Check that the JVM loaded both classes\n        System.out.println("Classes loaded from classpath");\n    }\n}`,
      },
      { t: 'try', prompt: 'Write a static method `square(int n)` in the `Main` class that returns `n * n`.', lang: 'java', starter: `static int square(int n) {\n    return 0;\n}\n`, solution: `static int square(int n) {\n    return n * n;\n}\n`, hints: ['Multiply n by itself.', 'Return the result directly.', 'Mind the semicolon.'], cases: [{ name: 'square of 5', call: 'square(5)', expect: '25' }, { name: 'square of 0', call: 'square(0)', expect: '0' }] },
      { t: 'quiz', q: 'What is Java bytecode?', options: ['Machine code for Intel CPUs', 'Platform-independent instructions for the JVM — compiled once, run anywhere', 'The same as source code', 'A compression format'], answer: 1, why: 'javac compiles .java to .class files containing JVM instructions. The JVM on each platform interprets or JIT-compiles them to native code.' },

    ],
  },

  /* ==================================================== 7 */
  {
    id: 'jv-l7',
    topic: 'getting-started',
    difficulty: 'advanced',
    title: 'JAR Files, Build Tools and Packages',
    minutes: 14,
    summary: 'Packaging code into JARs, declaring packages, and why Maven/Gradle exist.',
    objectives: ['Create and run a JAR file', 'Declare a package', 'Understand build tool basics'],
    blocks: [
      { t: 'text', md: 'Real Java projects use **packages** (namespaces for classes) and are distributed as **JAR files** (zip archives of compiled classes). Build tools like Maven and Gradle manage dependencies, compilation and packaging — replacing manual `javac` and `java -cp` commands.\n\n```bash\njavac -d out/ src/com/example/*.java\njar cf myapp.jar -C out/ .\njava -cp myapp.jar com.example.Main\n```' },
      { t: 'code', run: true, lang: 'java', code: `// Packages prevent name collisions and organise code\n// Files live in directories matching the package: com/example/StringUtils.java\n\npackage com.example;\n\npublic class StringUtils {\n    public static String reverse(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n\n    public static boolean isPalindrome(String s) {\n        String cleaned = s.replaceAll("[^a-zA-Z]", "").toLowerCase();\n        return cleaned.equals(reverse(cleaned));\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(com.example.StringUtils.reverse("hello"));\n        System.out.println(com.example.StringUtils.isPalindrome("Race car"));\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a mini utility library packaged as a JAR',
        md: 'A small library of math utilities organised in a proper package structure. In a real project, Maven/Gradle would produce the JAR automatically — but seeing the manual steps demystifies what they do.',
        run: true,
        lang: 'java',
        code: `package com.mathlib;\n\npublic class Maths {\n    /** Greatest common divisor (Euclid). */\n    public static int gcd(int a, int b) {\n        while (b != 0) {\n            int t = b;\n            b = a % b;\n            a = t;\n        }\n        return Math.abs(a);\n    }\n\n    /** Least common multiple. */\n    public static int lcm(int a, int b) {\n        return a / gcd(a, b) * b;\n    }\n\n    /** Is n prime? */\n    public static boolean isPrime(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("gcd(48, 18) = " + com.mathlib.Maths.gcd(48, 18));\n        System.out.println("lcm(12, 18) = " + com.mathlib.Maths.lcm(12, 18));\n        System.out.println("isPrime(17): " + com.mathlib.Maths.isPrime(17));\n        System.out.println("isPrime(100): " + com.mathlib.Maths.isPrime(100));\n    }\n}`,
      },
      { t: 'quiz', q: 'Why do Java packages follow a reverse-domain convention like `com.example`?', options: ['It is required by the compiler', 'It guarantees globally unique package names — two companies with different domains will never collide', 'It makes code faster', 'It is just tradition'], answer: 1, why: 'Using a reversed domain name (com.google, org.apache) ensures no two organisations accidentally use the same package name, even if their class names are identical.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `static String shout(String text)` returning text uppercased with three exclamation marks.\n\n`shout(\"hello\")` → `\"HELLO!!!\"`",
            "lang": "java",
            "starter": "static String shout(String text) {\n    return null;\n}\n",
            "solution": "static String shout(String text) {\n    return text.toUpperCase() + \"!!!\";\n}\n",
            "hints": [
                  "Call text.toUpperCase().",
                  "Concatenate with \"!!!\" using +.",
                  "Return the result."
            ],
            "cases": [
                  {
                        "name": "shouts",
                        "call": "shout(\"hello\")",
                        "expect": "\"HELLO!!!\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 8 */
  {
    id: 'jv-l8',
    topic: 'control-flow',
    difficulty: 'intermediate',
    title: 'Switch Expressions and Enums',
    minutes: 12,
    summary: 'Modern switch expressions (Java 14+), enum types, and using them together for exhaustive branching.',
    objectives: ['Write a switch expression with yield', 'Define and use an enum', 'Let the compiler enforce exhaustiveness'],
    blocks: [
      { t: 'text', md: 'Java 14+ introduced **switch expressions** — switch as a value-producing expression, not just a statement. Combined with **enums**, the compiler enforces that every case is covered.\n\n```java\nenum Day { MON, TUE, WED, THU, FRI, SAT, SUN }\n\nString mood = switch (day) {\n    case SAT, SUN -> "weekend!";\n    case FRI -> "almost there";\n    default -> "work day";\n};\n```' },
      { t: 'code', run: true, lang: 'java', code: `enum Operation { ADD, SUBTRACT, MULTIPLY, DIVIDE }\n\nclass Main {\n    static double calculate(Operation op, double a, double b) {\n        return switch (op) {\n            case ADD -> a + b;\n            case SUBTRACT -> a - b;\n            case MULTIPLY -> a * b;\n            case DIVIDE -> {\n                if (b == 0) throw new IllegalArgumentException("div by zero");\n                yield a / b;\n            }\n        };\n    }\n\n    public static void main(String[] args) {\n        System.out.println(calculate(Operation.ADD, 10, 5));\n        System.out.println(calculate(Operation.MULTIPLY, 3, 4));\n        System.out.println(calculate(Operation.DIVIDE, 10, 3));\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a state machine for an order',
        md: 'Model an e-commerce order with an enum of states (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED). A switch expression returns the valid next states for each. The compiler guarantees every state is handled.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nenum OrderState {\n    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED;\n\n    List<OrderState> nextStates() {\n        return switch (this) {\n            case PENDING -> List.of(CONFIRMED, CANCELLED);\n            case CONFIRMED -> List.of(SHIPPED, CANCELLED);\n            case SHIPPED -> List.of(DELIVERED);\n            case DELIVERED, CANCELLED -> List.of();\n        };\n    }\n\n    boolean canTransitionTo(OrderState target) {\n        return nextStates().contains(target);\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        for (OrderState state : OrderState.values()) {\n            System.out.println(state + " -> " + state.nextStates());\n        }\n        System.out.println();\n        System.out.println("PENDING -> SHIPPED? " +\n            OrderState.PENDING.canTransitionTo(OrderState.SHIPPED));\n        System.out.println("CONFIRMED -> SHIPPED? " +\n            OrderState.CONFIRMED.canTransitionTo(OrderState.SHIPPED));\n    }\n}`,
      },
      { t: 'quiz', q: 'What happens if you add a new enum constant but forget to update a switch expression?', options: ['Runtime error', 'The compiler refuses to compile — switch expressions over enums must be exhaustive', 'It silently uses the default', 'Nothing — enums are not checked'], answer: 1, why: 'Switch expressions are checked for exhaustiveness at compile time. A new enum value without a corresponding case is a compile error — the earliest safety net possible.' },

    ],
  },

  /* ==================================================== 9 */
  {
    id: 'jv-l9',
    topic: 'control-flow',
    difficulty: 'advanced',
    title: 'Sealed Classes and Pattern Matching',
    minutes: 14,
    summary: 'Sealed classes (Java 17+), pattern matching for instanceof, and designing closed type hierarchies.',
    objectives: ['Define a sealed class hierarchy', 'Use pattern matching in instanceof', 'Design types where all variants are known'],
    blocks: [
      { t: 'text', md: '**Sealed classes** (Java 17+) restrict which classes may extend or implement them. Combined with **pattern matching** for `instanceof`, the compiler can verify exhaustiveness — no more forgotten `else` branches.\n\n```java\nsealed interface Shape permits Circle, Rectangle, Triangle {}\n```' },
      { t: 'code', run: true, lang: 'java', code: `sealed interface Shape permits Circle, Rectangle {}\n\nrecord Circle(double radius) implements Shape {}\nrecord Rectangle(double width, double height) implements Shape {}\n\nclass Main {\n    static double area(Shape shape) {\n        return switch (shape) {\n            case Circle c -> Math.PI * c.radius() * c.radius();\n            case Rectangle r -> r.width() * r.height();\n        };\n    }\n\n    static String describe(Shape shape) {\n        if (shape instanceof Circle(var r)) {\n            return "Circle with radius " + r;\n        } else if (shape instanceof Rectangle(var w, var h)) {\n            return "Rectangle " + w + " x " + h;\n        }\n        return "Unknown shape";\n    }\n\n    public static void main(String[] args) {\n        Shape[] shapes = {new Circle(2), new Rectangle(3, 4)};\n        for (Shape s : shapes) {\n            System.out.println(describe(s) + " — area: " + area(s));\n        }\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a JSON value type with sealed interface',
        md: 'Model JSON\'s value types (string, number, boolean, null, array, object) as a sealed interface. Every consumer of `JsonValue` can use pattern-matching switch and the compiler ensures no type is forgotten.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nsealed interface JsonValue permits\n    JsonString, JsonNumber, JsonBool, JsonNull {}\n\nrecord JsonString(String value) implements JsonValue {}\nrecord JsonNumber(double value) implements JsonValue {}\nrecord JsonBool(boolean value) implements JsonValue {}\nfinal class JsonNull implements JsonValue {\n    static final JsonNull INSTANCE = new JsonNull();\n    private JsonNull() {}\n}\n\nclass Main {\n    static String stringify(JsonValue v) {\n        return switch (v) {\n            case JsonString s -> "\\"" + s.value() + "\\"";\n            case JsonNumber n -> String.valueOf(n.value());\n            case JsonBool b -> String.valueOf(b.value());\n            case JsonNull ignored -> "null";\n        };\n    }\n\n    public static void main(String[] args) {\n        JsonValue[] values = {\n            new JsonString("hello"),\n            new JsonNumber(42.5),\n            new JsonBool(true),\n            JsonNull.INSTANCE,\n        };\n        for (JsonValue v : values) {\n            System.out.println(stringify(v));\n        }\n    }\n}`,
      },
      { t: 'quiz', q: 'How do sealed classes help with correctness?', options: ['They make code faster', 'The compiler knows all permitted subtypes, so switch expressions can verify exhaustiveness — adding a new subtype forces you to handle it everywhere', 'They reduce memory usage', 'They are just a naming convention'], answer: 1, why: 'Sealed types list all permitted subtypes. The compiler uses this list to check switch exhaustiveness — adding a new variant breaks compilation at every switch, making "forgot to handle the new case" impossible.' },

    ],
  },

  /* ==================================================== 10 */
  {
    id: 'jv-l10',
    topic: 'classes-and-objects',
    difficulty: 'intermediate',
    title: 'equals, hashCode and toString',
    minutes: 13,
    summary: 'The three methods every Java class should override — and the contract between equals and hashCode.',
    objectives: ['Override equals correctly', 'Implement hashCode consistently', 'Write useful toString methods'],
    blocks: [
      { t: 'text', md: 'Every class inherits `equals`, `hashCode` and `toString` from `Object`. The defaults compare object identity (==), which is rarely what you want for value types.\n\nThe **contract**: if `a.equals(b)` then `a.hashCode() == b.hashCode()` MUST be true. Break this and HashMap, HashSet and every other hash-based collection will silently malfunction.' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\nclass Main {\n    static class Person {\n        private final String name;\n        private final int age;\n\n        Person(String name, int age) { this.name = name; this.age = age; }\n\n        @Override\n        public boolean equals(Object o) {\n            if (this == o) return true;\n            if (!(o instanceof Person p)) return false;\n            return age == p.age && Objects.equals(name, p.name);\n        }\n\n        @Override\n        public int hashCode() {\n            return Objects.hash(name, age);\n        }\n\n        @Override\n        public String toString() {\n            return "Person{name='" + name + "', age=" + age + "}";\n        }\n    }\n\n    public static void main(String[] args) {\n        Person a = new Person("Ada", 36);\n        Person b = new Person("Ada", 36);\n\n        System.out.println("a.equals(b): " + a.equals(b));  // true\n        System.out.println("Same hash: " + (a.hashCode() == b.hashCode()));\n        System.out.println(a);\n\n        Set<Person> set = new HashSet<>();\n        set.add(a);\n        set.add(b);\n        System.out.println("Set size: " + set.size());  // 1, because equals\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a cache keyed on value objects',
        md: 'A simple in-memory cache that uses a HashMap with a custom key type. Without correct equals/hashCode, two logically identical keys would occupy separate slots — the cache would never hit. The `record` keyword (Java 14+) auto-generates equals, hashCode and toString.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nrecord CacheKey(String userId, String resource) {}\n\nclass Main {\n    static class Cache {\n        private final Map<CacheKey, String> store = new HashMap<>();\n\n        void put(String userId, String resource, String data) {\n            store.put(new CacheKey(userId, resource), data);\n        }\n\n        Optional<String> get(String userId, String resource) {\n            return Optional.ofNullable(store.get(new CacheKey(userId, resource)));\n        }\n    }\n\n    public static void main(String[] args) {\n        Cache cache = new Cache();\n        cache.put("ada", "profile", "{\\"name\\": \\"Ada\\"}" );\n        cache.put("ada", "settings", "{\\"theme\\": \\"dark\\"}" );\n\n        System.out.println("Profile: " + cache.get("ada", "profile").orElse("miss"));\n        System.out.println("Settings: " + cache.get("ada", "settings").orElse("miss"));\n        System.out.println("Missing: " + cache.get("bob", "profile").orElse("miss"));\n    }\n}`,
      },
      { t: 'try', prompt: 'Create a `record Point(int x, int y)` and a static method `distance` that computes Euclidean distance between two Points. Records auto-generate constructor, equals, hashCode and toString.', lang: 'java', starter: `record Point(int x, int y) {}\n\nstatic double distance(Point a, Point b) {\n    return 0;\n}\n`, solution: `record Point(int x, int y) {}\n\nstatic double distance(Point a, Point b) {\n    int dx = a.x() - b.x();\n    int dy = a.y() - b.y();\n    return Math.sqrt(dx * dx + dy * dy);\n}\n`, hints: ['Use a.x() and b.x() to access record components.', 'Formula: sqrt(dx*dx + dy*dy).', 'Return the double directly.'], cases: [{ name: 'distance', call: 'Math.round(distance(new Point(0, 0), new Point(3, 4)))', expect: '5' }] },
      { t: 'quiz', q: 'What happens if you override equals but NOT hashCode?', options: ['Nothing — they are independent', 'HashMap, HashSet and friends will break: two equal objects may land in different buckets and the collection will behave as if they are not present', 'Compile error', 'hashCode is called automatically'], answer: 1, why: 'Hash-based collections use hashCode to find the bucket, then equals to confirm. If two equal objects have different hashes, they end up in different buckets and the collection thinks they are different.' },

    ],
  },

  /* ==================================================== 11 */
  {
    id: 'jv-l11',
    topic: 'classes-and-objects',
    difficulty: 'advanced',
    title: 'Immutability and Builder Pattern',
    minutes: 14,
    summary: 'Designing immutable classes, the builder pattern for complex construction, and defensive copies.',
    objectives: ['Design a truly immutable class', 'Implement a builder', 'Make defensive copies of mutable fields'],
    blocks: [
      { t: 'text', md: 'An **immutable** object cannot be changed after construction. Immutable objects are inherently thread-safe, can be freely shared, and never need defensive copying. The rules: make fields `final` and `private`, do not provide setters, and if a field holds a mutable object (like a List), return a copy — not the original.' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\nclass Main {\n    static final class Order {\n        private final String id;\n        private final List<String> items;\n        private final boolean expedited;\n\n        private Order(Builder builder) {\n            this.id = builder.id;\n            this.items = List.copyOf(builder.items);  // defensive copy\n            this.expedited = builder.expedited;\n        }\n\n        public String id() { return id; }\n        public List<String> items() { return items; }  // already immutable\n        public boolean expedited() { return expedited; }\n\n        static class Builder {\n            private String id = UUID.randomUUID().toString();\n            private final List<String> items = new ArrayList<>();\n            private boolean expedited = false;\n\n            Builder id(String id) { this.id = id; return this; }\n            Builder addItem(String item) { items.add(item); return this; }\n            Builder expedited(boolean e) { this.expedited = e; return this; }\n            Order build() { return new Order(this); }\n        }\n    }\n\n    public static void main(String[] args) {\n        Order order = new Order.Builder()\n            .id("ORD-001")\n            .addItem("Widget")\n            .addItem("Gadget")\n            .expedited(true)\n            .build();\n\n        System.out.println(order.id() + " — items: " + order.items() +\n            " — expedited: " + order.expedited());\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — configuration object with defaults and validation',
        md: 'A database connection config with sensible defaults, immutable once built, with validation at build time. This pattern (used by every major Java library) prevents half-configured objects from ever existing.',
        run: true,
        lang: 'java',
        code: `final class DatabaseConfig {\n    private final String host;\n    private final int port;\n    private final String database;\n    private final int maxConnections;\n\n    private DatabaseConfig(Builder b) {\n        this.host = b.host;\n        this.port = b.port;\n        this.database = b.database;\n        this.maxConnections = b.maxConnections;\n    }\n\n    static class Builder {\n        private String host = "localhost";\n        private int port = 5432;\n        private String database;\n        private int maxConnections = 10;\n\n        Builder host(String h) { host = h; return this; }\n        Builder port(int p) { port = p; return this; }\n        Builder database(String db) { database = db; return this; }\n        Builder maxConnections(int m) { maxConnections = m; return this; }\n\n        DatabaseConfig build() {\n            if (database == null || database.isBlank()) {\n                throw new IllegalStateException("database is required");\n            }\n            if (maxConnections < 1) {\n                throw new IllegalStateException("maxConnections must be >= 1");\n            }\n            return new DatabaseConfig(this);\n        }\n    }\n\n    @Override\n    public String toString() {\n        return String.format("jdbc:postgresql://%s:%d/%s (max=%d)",\n            host, port, database, maxConnections);\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        var config = new DatabaseConfig.Builder()\n            .database("mydb")\n            .maxConnections(20)\n            .build();\n        System.out.println(config);\n    }\n}`,
      },
      { t: 'quiz', q: 'Why return `List.copyOf(items)` instead of `items` directly in a constructor?', options: ['It is faster', 'If the caller still holds a reference to the list they passed to the builder, they could mutate it — breaking immutability. copyOf creates a snapshot', 'The compiler requires it', 'Lists must always be copied'], answer: 1, why: 'Even though the field is final, the list CONTENTS can change if the caller retained a reference. Defensive copying guarantees the immutable object truly never changes.' },

    ],
  },

  /* ==================================================== 12 */
  {
    id: 'jv-l12',
    topic: 'collections',
    difficulty: 'intermediate',
    title: 'Comparators and Sorting',
    minutes: 12,
    summary: 'Custom sort orders with Comparator, chaining comparators, and the Comparable interface.',
    objectives: ['Sort with a custom Comparator', 'Chain comparators with thenComparing', 'Implement Comparable for natural order'],
    blocks: [
      { t: 'text', md: '`Comparator<T>` defines a custom sort order. `Comparable<T>` defines the **natural** order of a type. `Comparator.comparing()` and `.thenComparing()` build multi-field sorts declaratively.\n\n```java\nrecord Player(String name, int score) {}\n\nplayers.sort(Comparator\n    .comparing(Player::score).reversed()\n    .thenComparing(Player::name));\n```' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\nclass Main {\n    record Player(String name, int score, int level) {}\n\n    public static void main(String[] args) {\n        List<Player> players = new ArrayList<>(List.of(\n            new Player("Ada",   250, 4),\n            new Player("Grace", 310, 5),\n            new Player("Alan",  180, 3),\n            new Player("Zoe",   250, 2),\n            new Player("Bob",   310, 6)\n        ));\n\n        // Score desc, then name asc, then level desc\n        players.sort(Comparator\n            .comparing(Player::score).reversed()\n            .thenComparing(Player::name)\n            .thenComparing(Comparator.comparing(Player::level).reversed()));\n\n        for (var p : players) {\n            System.out.printf("%-6s %4d  L%d%n", p.name(), p.score(), p.level());\n        }\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a leaderboard with multiple ranking criteria',
        md: 'Rank players by: highest score first, fewest games played as tie-breaker (efficiency), then alphabetical. The `Comparator` chain reads like English: "compare by score reversed, then by games, then by name".',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Main {\n    record Rank(String player, int score, int gamesPlayed) {}\n\n    public static void main(String[] args) {\n        List<Rank> board = List.of(\n            new Rank("Ada",   500, 10),\n            new Rank("Grace", 500, 8),\n            new Rank("Alan",  450, 5),\n            new Rank("Zoe",   500, 10),\n            new Rank("Bob",   450, 6)\n        );\n\n        List<Rank> sorted = new ArrayList<>(board);\n        sorted.sort(Comparator\n            .comparing(Rank::score).reversed()\n            .thenComparing(Rank::gamesPlayed)\n            .thenComparing(Rank::player));\n\n        System.out.println("Rank  Player  Score  Games");\n        int rank = 1;\n        for (var r : sorted) {\n            System.out.printf("%3d.  %-6s %5d  %5d%n",\n                rank++, r.player(), r.score(), r.gamesPlayed());\n        }\n    }\n}`,
      },
      { t: 'try', prompt: 'Write a static method `byLength(List<String> words)` that returns a new list sorted by string length, then alphabetically for ties. Use `Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder())`.', lang: 'java', starter: `static List<String> byLength(List<String> words) {\n    return null;\n}\n`, solution: `static List<String> byLength(List<String> words) {\n    List<String> sorted = new ArrayList<>(words);\n    sorted.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));\n    return sorted;\n}\n`, hints: ['Copy the list first: new ArrayList<>(words).', 'Use Comparator.comparing(String::length).', 'Chain .thenComparing(Comparator.naturalOrder()) for tie-breaking.'], cases: [{ name: 'sorts by length', call: 'byLength(Arrays.asList("aaa", "b", "cc"))', expect: '[b, cc, aaa]' }] },
      { t: 'quiz', q: 'What is the difference between `Comparable` and `Comparator`?', options: ['They are identical', 'Comparable defines a class\'s natural order (compareTo). Comparator is an external, possibly ad-hoc ordering — you can have many Comparators for one type', 'Comparator is deprecated', 'Comparable is for sorting, Comparator is for maps'], answer: 1, why: 'Comparable is implemented ONCE per class (like String\'s alphabetical order). Comparator is a separate object — you can sort by name, by date, by score, all using different Comparators on the same type.' },

    ],
  },

  /* ==================================================== 13 */
  {
    id: 'jv-l13',
    topic: 'collections',
    difficulty: 'advanced',
    title: 'Set Operations and the Collections Framework',
    minutes: 13,
    summary: 'Union, intersection, difference with Sets. TreeSet ordering, and choosing the right collection.',
    objectives: ['Perform set operations with retainAll/removeAll/addAll', 'Use TreeSet for sorted unique elements', 'Choose List/Set/Map/Queue for a task'],
    blocks: [
      { t: 'text', md: 'Beyond List and Map, the Collections Framework provides `Set` (unique elements), `Queue`/`Deque` (FIFO/LIFO), and their implementations. `HashSet` is O(1) unordered; `TreeSet` keeps elements sorted.\n\nSet operations are done in-place:\n- Union: `a.addAll(b)`\n- Intersection: `a.retainAll(b)`\n- Difference: `a.removeAll(b)`' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Set<String> groupA = new HashSet<>(Set.of("Ada", "Grace", "Alan"));\n        Set<String> groupB = new HashSet<>(Set.of("Grace", "Bob", "Alan"));\n\n        Set<String> union = new HashSet<>(groupA);\n        union.addAll(groupB);\n\n        Set<String> intersection = new HashSet<>(groupA);\n        intersection.retainAll(groupB);\n\n        Set<String> onlyA = new HashSet<>(groupA);\n        onlyA.removeAll(groupB);\n\n        System.out.println("A: " + groupA);\n        System.out.println("B: " + groupB);\n        System.out.println("Union: " + union);\n        System.out.println("Intersection: " + intersection);\n        System.out.println("Only in A: " + onlyA);\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a tagging system with set operations',
        md: 'Articles are tagged with keywords. Finding related articles means computing set intersections. A TreeSet would keep tags sorted for display; HashSet is faster for lookups. The choice depends on the access pattern.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Main {\n    record Article(String title, Set<String> tags) {\n        double similarity(Article other) {\n            Set<String> common = new HashSet<>(tags);\n            common.retainAll(other.tags);\n            Set<String> all = new HashSet<>(tags);\n            all.addAll(other.tags);\n            return all.isEmpty() ? 0 : (double) common.size() / all.size();\n        }\n    }\n\n    public static void main(String[] args) {\n        Article a1 = new Article("Rust Guide", Set.of("rust", "systems", "memory"));\n        Article a2 = new Article("Java GC", Set.of("java", "memory", "jvm"));\n        Article a3 = new Article("Cooking Tips", Set.of("food", "kitchen"));\n\n        System.out.printf("Similarity: %.2f%n", a1.similarity(a2));\n        System.out.printf("Similarity: %.2f%n", a1.similarity(a3));\n        System.out.printf("Similarity: %.2f%n", a2.similarity(a3));\n    }\n}`,
      },
      { t: 'quiz', q: 'When would you choose `TreeSet` over `HashSet`?', options: ['TreeSet is always faster', 'When you need elements in sorted order — TreeSet maintains natural or Comparator order. HashSet is unordered but offers O(1) operations', 'HashSet is deprecated', 'There is no difference'], answer: 1, why: 'TreeSet is implemented as a red-black tree — O(log n) operations but always sorted. HashSet is a hash table — O(1) operations but unordered. Pick based on whether you need ordering.' },

    ],
  },

  /* ==================================================== 14 */
  {
    id: 'jv-l14',
    topic: 'inheritance',
    difficulty: 'beginner',
    title: 'Extending Classes',
    minutes: 12,
    summary: 'Inheritance with extends, calling super, and overriding methods — the core of Java\'s object model.',
    objectives: ['Extend a class with extends', 'Call the parent constructor with super', 'Override and call parent methods'],
    blocks: [
      { t: 'text', md: '**Inheritance** lets a class reuse and extend another. The child gets everything the parent has, and can add or override behaviour.\n\n```java\nclass Animal {\n    String name;\n    Animal(String name) { this.name = name; }\n    String speak() { return "???"; }\n}\n\nclass Dog extends Animal {\n    Dog(String name) { super(name); }  // call parent constructor\n    @Override\n    String speak() { return name + " says woof"; }\n}\n```' },
      { t: 'code', run: true, lang: 'java', code: `class Main {\n    static class Animal {\n        protected final String name;\n        Animal(String name) { this.name = name; }\n        String speak() { return name + " makes a sound"; }\n    }\n\n    static class Dog extends Animal {\n        Dog(String name) { super(name); }\n        @Override\n        String speak() { return name + " says woof!"; }\n    }\n\n    static class Cat extends Animal {\n        Cat(String name) { super(name); }\n        @Override\n        String speak() { return name + " says meow!"; }\n    }\n\n    public static void main(String[] args) {\n        Animal[] pets = {new Dog("Rex"), new Cat("Whiskers"), new Dog("Bella")};\n        for (Animal pet : pets) {\n            System.out.println(pet.speak());  // polymorphism\n        }\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a notification system with subclasses',
        md: 'A base `Notification` class with email and SMS subclasses. Each knows how to format and deliver itself. The `notifyAll` method works with the base type — it never needs to know the specific subclass. That is **polymorphism**.',
        run: true,
        lang: 'java',
        code: `abstract class Notification {\n    protected final String recipient;\n    protected final String message;\n\n    Notification(String recipient, String message) {\n        this.recipient = recipient;\n        this.message = message;\n    }\n\n    abstract String deliver();\n}\n\nclass EmailNotification extends Notification {\n    EmailNotification(String to, String msg) { super(to, msg); }\n\n    @Override\n    String deliver() {\n        return "EMAIL to " + recipient + ": " + message;\n    }\n}\n\nclass SmsNotification extends Notification {\n    SmsNotification(String to, String msg) { super(to, msg); }\n\n    @Override\n    String deliver() {\n        return "SMS to " + recipient + ": " + message.substring(0, Math.min(30, message.length()));\n    }\n}\n\nclass Main {\n    static void notifyAll(Notification[] notifications) {\n        for (Notification n : notifications) {\n            System.out.println(n.deliver());\n        }\n    }\n\n    public static void main(String[] args) {\n        Notification[] alerts = {\n            new EmailNotification("ada@example.com", "Your report is ready"),\n            new SmsNotification("+1234567890", "Your package has shipped"),\n        };\n        notifyAll(alerts);\n    }\n}`,
      },
      { t: 'try', prompt: 'Create a `Vehicle` class with a `describe()` method returning `"A vehicle"`. Then create `Car extends Vehicle` overriding `describe()` to return `"A car"`. Use static classes inside Main.', lang: 'java', starter: `static class Vehicle {\n    String describe() { return "A vehicle"; }\n}\n\nstatic class Car extends Vehicle {\n}\n`, solution: `static class Vehicle {\n    String describe() { return "A vehicle"; }\n}\n\nstatic class Car extends Vehicle {\n    @Override\n    String describe() { return "A car"; }\n}\n`, hints: ['Add @Override annotation.', 'Return "A car" from Car.describe.', 'No constructor needed for this simple case.'], cases: [{ name: 'vehicle', call: 'new Vehicle().describe()', expect: '"A vehicle"' }, { name: 'car overrides', call: 'new Car().describe()', expect: '"A car"' }] },
      { t: 'quiz', q: 'What does `super(name)` do in a constructor?', options: ['Creates a new object', 'Calls the parent class constructor with `name` — required if the parent has no no-arg constructor', 'It is a comment', 'super is only for methods'], answer: 1, why: 'super(args) invokes the parent constructor. Every constructor must start with either super() or this() — if the parent has no default constructor, you must call super explicitly with arguments.' },
    ],
  },

  /* ==================================================== 15 */
  {
    id: 'jv-l15',
    topic: 'inheritance',
    difficulty: 'intermediate',
    title: 'Abstract Classes and Interfaces',
    minutes: 13,
    summary: 'When to use abstract classes vs interfaces, default methods, and coding to interfaces.',
    objectives: ['Define an abstract class with abstract methods', 'Implement multiple interfaces', 'Use default methods'],
    blocks: [
      { t: 'text', md: '**Abstract classes** provide a partial implementation — some methods are concrete, some are left for subclasses. **Interfaces** define a contract with no state. Java 8+ interfaces can have `default` methods with implementations.\n\nRule of thumb: use interfaces for "what something can do" (Comparable, Runnable, Serializable). Use abstract classes for "what something is" when subclasses share state or constructor logic.' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\ninterface Printable {\n    String asString();\n\n    default void print() {\n        System.out.println(asString());\n    }\n}\n\nabstract class Shape {\n    abstract double area();\n\n    double circumference() {\n        return 0;  // default for shapes without a perimeter\n    }\n}\n\nclass Circle extends Shape implements Printable {\n    private final double radius;\n    Circle(double r) { radius = r; }\n\n    @Override double area() { return Math.PI * radius * radius; }\n    @Override double circumference() { return 2 * Math.PI * radius; }\n    @Override public String asString() { return String.format("Circle(r=%.2f)", radius); }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Circle c = new Circle(2.5);\n        c.print();\n        System.out.println("Area: " + c.area());\n        System.out.println("Circumference: " + c.circumference());\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a pluggable payment system',
        md: 'A checkout system that accepts any payment method — credit card, PayPal, crypto — as long as it implements the `PaymentMethod` interface. Adding a new payment type means writing one new class; the checkout code never changes.',
        run: true,
        lang: 'java',
        code: `interface PaymentMethod {\n    String name();\n    boolean charge(double amount);\n}\n\nclass CreditCard implements PaymentMethod {\n    private final String number;\n    CreditCard(String number) { this.number = number; }\n    @Override public String name() { return "Card ending in " + number.substring(number.length() - 4); }\n    @Override public boolean charge(double amount) {\n        System.out.printf("Charging $%.2f to %s%n", amount, name());\n        return true;\n    }\n}\n\nclass PayPal implements PaymentMethod {\n    private final String email;\n    PayPal(String email) { this.email = email; }\n    @Override public String name() { return "PayPal (" + email + ")"; }\n    @Override public boolean charge(double amount) {\n        System.out.printf("Charging $%.2f via %s%n", amount, name());\n        return amount < 1000;  // PayPal limit\n    }\n}\n\nclass Main {\n    static boolean checkout(PaymentMethod method, double total) {\n        System.out.println("Attempting " + method.name() + "...");\n        return method.charge(total);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(checkout(new CreditCard("1234-5678-9012-3456"), 49.99) ? "OK" : "FAILED");\n        System.out.println(checkout(new PayPal("ada@example.com"), 50.0) ? "OK" : "FAILED");\n    }\n}`,
      },
      { t: 'quiz', q: 'When would you use an abstract class over an interface?', options: ['Always — interfaces are obsolete', 'When subclasses share state (fields), constructor logic, or a partial implementation. Interfaces define pure contracts', 'Interfaces cannot have methods', 'There is no difference'], answer: 1, why: 'Abstract classes can hold state (fields) and provide constructor logic shared by subclasses. Interfaces define what something can DO — they carry no instance state.' },
    ],
  },

  /* ==================================================== 16 */
  {
    id: 'jv-l16',
    topic: 'inheritance',
    difficulty: 'advanced',
    title: 'Generics Deep Dive',
    minutes: 15,
    summary: 'Type parameters, bounded types, wildcards (? extends / ? super), and the PECS principle.',
    objectives: ['Write a generic class and method', 'Use wildcards for flexibility', 'Apply Producer-Extends-Consumer-Super'],
    blocks: [
      { t: 'text', md: 'Generics let you write code that works on any type while keeping compile-time type safety. The `<T>` syntax declares a type parameter.\n\n**Wildcards** add flexibility:\n- `? extends T` — accepts T or any subtype (you can READ from it)\n- `? super T` — accepts T or any supertype (you can WRITE to it)\n\n**PECS**: Producer-Extends, Consumer-Super. If you are reading items from a structure, use `? extends`. If you are writing items to it, use `? super`.' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\n\nclass Main {\n    // Generic method: works on any List of numbers\n    static double sum(List<? extends Number> numbers) {\n        double total = 0;\n        for (Number n : numbers) total += n.doubleValue();\n        return total;\n    }\n\n    // Consumer: write integers into any list that can hold integers or their supertypes\n    static void fillWithOnes(List<? super Integer> list, int count) {\n        for (int i = 0; i < count; i++) list.add(1);\n    }\n\n    public static void main(String[] args) {\n        List<Integer> ints = Arrays.asList(1, 2, 3);\n        List<Double> doubles = Arrays.asList(1.5, 2.5);\n\n        System.out.println("Sum ints: " + sum(ints));\n        System.out.println("Sum doubles: " + sum(doubles));\n\n        List<Number> numbers = new ArrayList<>();\n        fillWithOnes(numbers, 3);\n        System.out.println("Filled: " + numbers);\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a generic result type for API responses',
        md: 'A `Result<T>` type that wraps either a success value of type T or an error message. This pattern (also known as Either) avoids null returns and forces callers to handle both outcomes. The generic parameter ties the success type to the consumer.',
        run: true,
        lang: 'java',
        code: `import java.util.Optional;\nimport java.util.function.Function;\n\nfinal class Result<T> {\n    private final T value;\n    private final String error;\n\n    private Result(T value, String error) {\n        this.value = value;\n        this.error = error;\n    }\n\n    static <T> Result<T> ok(T value) { return new Result<>(value, null); }\n    static <T> Result<T> err(String error) { return new Result<>(null, error); }\n\n    boolean isOk() { return error == null; }\n    Optional<T> value() { return Optional.ofNullable(value); }\n    Optional<String> error() { return Optional.ofNullable(error); }\n\n    <U> Result<U> map(Function<T, U> fn) {\n        return isOk() ? Result.ok(fn.apply(value)) : Result.err(error);\n    }\n\n    @Override public String toString() {\n        return isOk() ? "Ok(" + value + ")" : "Err(" + error + ")";\n    }\n}\n\nclass Main {\n    static Result<Integer> parse(String s) {\n        try { return Result.ok(Integer.parseInt(s)); }\n        catch (NumberFormatException e) { return Result.err("Not a number: " + s); }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(parse("42"));\n        System.out.println(parse("abc"));\n        System.out.println(parse("42").map(n -> n * 2));\n    }\n}`,
      },
      { t: 'quiz', q: 'What does `List<? extends Number>` mean?', options: ['A list containing only Numbers', 'A list of Number or any subclass (Integer, Double, etc.) — you can read Numbers from it but cannot add (except null)', 'A list that extends List', 'An unmodifiable list'], answer: 1, why: '? extends Number means "some type that is Number or a subtype". You can read elements as Number, but you cannot add because the compiler does not know the exact subtype.' },
    ],
  },

  /* ==================================================== 17 */
  {
    id: 'jv-l17',
    topic: 'generics',
    difficulty: 'beginner',
    title: 'Type Parameters and Generic Methods',
    minutes: 11,
    summary: 'Writing your first generic class and method — type safety without duplication.',
    objectives: ['Write a generic class', 'Write a generic method', 'Understand type inference'],
    blocks: [
      { t: 'text', md: 'A **generic class** is written once and works with any reference type. The compiler inserts casts automatically and guarantees type safety — no more `ClassCastException` from raw types.\n\n```java\nclass Box<T> {\n    private T value;\n    void put(T value) { this.value = value; }\n    T get() { return value; }\n}\n```' },
      { t: 'code', run: true, lang: 'java', code: `class Pair<A, B> {\n    private final A first;\n    private final B second;\n\n    Pair(A first, B second) { this.first = first; this.second = second; }\n\n    A first() { return first; }\n    B second() { return second; }\n\n    @Override\n    public String toString() { return "(" + first + ", " + second + ")"; }\n}\n\nclass Main {\n    // Generic method: the <T> before the return type declares the type parameter\n    static <T> T lastElement(List<T> list) {\n        if (list.isEmpty()) return null;\n        return list.get(list.size() - 1);\n    }\n\n    public static void main(String[] args) {\n        Pair<String, Integer> person = new Pair<>("Ada", 36);\n        System.out.println(person);\n\n        System.out.println(lastElement(List.of("a", "b", "c")));\n        System.out.println(lastElement(List.of(1, 2, 3)));\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a simple generic cache',
        md: 'A typed key-value store that is generic over both the key and value types. Unlike HashMap which takes any Object, this cache enforces that `get` returns the same type that `put` stored — eliminating the cast at every call site.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\n\nclass Cache<K, V> {\n    private final Map<K, V> store = new HashMap<>();\n    private final int maxSize;\n\n    Cache(int maxSize) { this.maxSize = maxSize; }\n\n    Optional<V> get(K key) {\n        return Optional.ofNullable(store.get(key));\n    }\n\n    void put(K key, V value) {\n        if (store.size() >= maxSize) {\n            K first = store.keySet().iterator().next();\n            store.remove(first);\n        }\n        store.put(key, value);\n    }\n\n    int size() { return store.size(); }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Cache<String, Integer> scores = new Cache<>(3);\n        scores.put("Ada", 100);\n        scores.put("Grace", 95);\n        scores.put("Alan", 80);\n        scores.put("Bob", 70);  // evicts Ada\n\n        System.out.println("Cache size: " + scores.size());\n        System.out.println("Ada: " + scores.get("Ada").orElse(-1));\n        System.out.println("Grace: " + scores.get("Grace").orElse(-1));\n    }\n}`,
      },
      { t: 'try', prompt: 'Write a generic static method `firstOrNull(List<T> list)` returning the first element or null if empty.', lang: 'java', starter: `static <T> T firstOrNull(List<T> list) {\n    return null;\n}\n`, solution: `static <T> T firstOrNull(List<T> list) {\n    return list.isEmpty() ? null : list.get(0);\n}\n`, hints: ['The <T> declares the type parameter.', 'Check if list.isEmpty() first.', 'Return list.get(0) or null.'], cases: [{ name: 'first', call: 'firstOrNull(List.of("a", "b"))', expect: '"a"' }, { name: 'empty', call: 'firstOrNull(List.of())', expect: 'null' }] },
      { t: 'quiz', q: 'What does the `<T>` before a method\'s return type do?', options: ['It is a return type', 'It declares a type parameter T for this method — independent of any class-level generics. The compiler infers T from the arguments', 'It creates a new class', 'It is syntactic sugar'], answer: 1, why: 'In `static <T> T identity(T value)`, the `<T>` declares a type parameter scoped to that method. The compiler infers T from the argument type at the call site.' },
    ],
  },

  /* ==================================================== 18 */
  {
    id: 'jv-l18',
    topic: 'streams',
    difficulty: 'beginner',
    title: 'Streams: Map, Filter, Collect',
    minutes: 12,
    summary: 'The Stream API — transforming collections declaratively with map, filter and collect.',
    objectives: ['Transform with map and filter', 'Collect results into a List', 'Read a stream pipeline aloud'],
    blocks: [
      { t: 'text', md: 'The **Stream API** (Java 8+) lets you describe WHAT you want, not HOW to build it. A stream pipeline has three parts:\n1. **Source** — a collection, array, or generator\n2. **Intermediate operations** — map, filter, sorted (lazy — they do nothing until a terminal op runs)\n3. **Terminal operation** — collect, forEach, reduce (triggers computation)\n\n```java\nnames.stream()\n    .filter(n -> n.startsWith("A"))\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());\n```' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\nimport java.util.stream.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> names = List.of("Ada", "Grace", "Alan", "Bob", "Alice\");\n\n        // Names starting with A, uppercased, sorted\n        List<String> result = names.stream()\n            .filter(n -> n.startsWith("A"))\n            .map(String::toUpperCase)\n            .sorted()\n            .collect(Collectors.toList());\n\n        System.out.println(result);\n\n        // Reduction: total length of all names\n        int totalLength = names.stream()\n            .mapToInt(String::length)\n            .sum();\n        System.out.println("Total chars: " + totalLength);\n\n        // Grouping: names by their first letter\n        Map<Character, List<String>> byLetter = names.stream()\n            .collect(Collectors.groupingBy(n -> n.charAt(0)));\n        System.out.println("By letter: " + byLetter);\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — processing sales data',
        md: 'A list of sales records — find the top 3 customers by total spend, applying a discount filter (only count sales over $10). Stream operations replace nested for-loops and temporary maps, reducing a 20-line method to a pipeline you can read from left to right.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\nimport java.util.stream.*;\n\nrecord Sale(String customer, double amount) {}\n\nclass Main {\n    public static void main(String[] args) {\n        List<Sale> sales = List.of(\n            new Sale("Ada", 25.0), new Sale("Grace", 15.0),\n            new Sale("Ada", 5.0),  new Sale("Alan", 30.0),\n            new Sale("Grace", 20.0), new Sale("Ada", 45.0),\n        );\n\n        var topCustomers = sales.stream()\n            .filter(s -> s.amount() > 10)\n            .collect(Collectors.groupingBy(Sale::customer,\n                     Collectors.summingDouble(Sale::amount)))\n            .entrySet().stream()\n            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())\n            .limit(3)\n            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,\n                (a, b) -> a, LinkedHashMap::new));\n\n        topCustomers.forEach((name, total) ->\n            System.out.printf("%s: $%.2f%n", name, total));\n    }\n}`,
      },
      { t: 'try', prompt: 'Write `doubleEvens(List<Integer> numbers)` returning a list of even numbers doubled. Use stream, filter and map.', lang: 'java', starter: `static List<Integer> doubleEvens(List<Integer> numbers) {\n    return null;\n}\n`, solution: `static List<Integer> doubleEvens(List<Integer> numbers) {\n    return numbers.stream()\n        .filter(n -> n % 2 == 0)\n        .map(n -> n * 2)\n        .collect(Collectors.toList());\n}\n`, hints: ['Start with numbers.stream().', 'filter(n -> n % 2 == 0) to keep evens.', 'map(n -> n * 2) then collect(Collectors.toList()).'], cases: [{ name: 'doubles evens', call: 'doubleEvens(Arrays.asList(1, 2, 3, 4))', expect: '[4, 8]' }] },
      { t: 'quiz', q: 'When does a stream pipeline actually execute?', options: ['Immediately when map/filter are called', 'Only when a terminal operation (collect, forEach, reduce) is invoked — intermediate operations are lazy', 'At compile time', 'Streams are always eager'], answer: 1, why: 'Intermediate operations (filter, map) build a plan. Nothing runs until a terminal operation (collect, count, forEach) triggers execution. This enables optimisation and short-circuiting.' },
      {
            "t": "refactor",
            "prompt": "The `sumOfSquares` method works but uses a traditional for-loop. Refactor it to use a **stream pipeline** with `.map()` and `.sum()`. The behaviour must stay identical.",
            "lang": "java",
            "starter": "static int sumOfSquares(List<Integer> numbers) {\n    int total = 0;\n    for (int i = 0; i < numbers.size(); i++) {\n        total += numbers.get(i) * numbers.get(i);\n    }\n    return total;\n}\n",
            "solution": "static int sumOfSquares(List<Integer> numbers) {\n    return numbers.stream().mapToInt(n -> n * n).sum();\n}\n",
            "hints": [
                  "Use numbers.stream() as the source.",
                  ".mapToInt(n -> n * n) transforms each element.",
                  ".sum() is the terminal operation — it returns the total."
            ],
            "cases": [
                  {
                        "name": "basic",
                        "call": "sumOfSquares(Arrays.asList(1, 2, 3))",
                        "expect": "14"
                  },
                  {
                        "name": "empty",
                        "call": "sumOfSquares(List.of())",
                        "expect": "0"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 19 */
  {
    id: 'jv-l19',
    topic: 'streams',
    difficulty: 'intermediate',
    title: 'Reduction, Grouping and FlatMap',
    minutes: 13,
    summary: 'reduce for custom aggregation, Collectors.groupingBy for partitioning, and flatMap for nested structures.',
    objectives: ['Reduce a stream to a single value', 'Group and partition with Collectors', 'Flatten nested collections with flatMap'],
    blocks: [
      { t: 'text', md: '`reduce` is the general-purpose terminal operation — it combines stream elements into a single result. `Collectors.groupingBy` partitions into a Map. `flatMap` turns each element into a stream of zero or more elements, then flattens them into one stream.' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\nimport java.util.stream.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> nums = List.of(1, 2, 3, 4, 5);\n\n        // reduce: sum with an identity\n        int sum = nums.stream().reduce(0, Integer::sum);\n        System.out.println("Sum: " + sum);\n\n        // reduce without identity: returns Optional\n        Optional<Integer> max = nums.stream().reduce(Integer::max);\n        max.ifPresent(m -> System.out.println("Max: " + m));\n\n        // flatMap: get all characters from a list of words\n        List<String> words = List.of("cat", "dog\");\n        List<Character> chars = words.stream()\n            .flatMap(w -> w.chars().mapToObj(c -> (char) c))\n            .collect(Collectors.toList());\n        System.out.println("Chars: " + chars);\n\n        // Partition: even vs odd\n        Map<Boolean, List<Integer>> parity = nums.stream()\n            .collect(Collectors.partitioningBy(n -> n % 2 == 0));\n        System.out.println("Even: " + parity.get(true));\n        System.out.println("Odd:  " + parity.get(false));\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — analysing a library catalogue',
        md: 'A library has authors, each with a list of books. flatMap flattens author→books into one stream of all books. Then groupingBy collects them by genre, and counting() tallies each category. What would be nested loops and manual map-building becomes a single pipeline.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\nimport java.util.stream.*;\n\nrecord Book(String title, String genre) {}\nrecord Author(String name, List<Book> books) {}\n\nclass Main {\n    public static void main(String[] args) {\n        List<Author> authors = List.of(\n            new Author("Asimov", List.of(\n                new Book("Foundation", "SciFi"), new Book("I, Robot", "SciFi\"))),\n            new Author("Christie", List.of(\n                new Book("Orient Express", "Mystery\"))),\n            new Author("Clarke", List.of(\n                new Book("2001", "SciFi\"), new Book("Rama", "SciFi\"))),\n        );\n\n        Map<String, Long> byGenre = authors.stream()\n            .flatMap(a -> a.books().stream())\n            .collect(Collectors.groupingBy(Book::genre, Collectors.counting()));\n\n        System.out.println("Books by genre:");\n        byGenre.forEach((genre, count) ->\n            System.out.printf("  %s: %d%n\", genre, count));\n\n        long scifiCount = authors.stream()\n            .flatMap(a -> a.books().stream())\n            .filter(b -> b.genre().equals("SciFi\"))\n            .count();\n        System.out.println("SciFi books: " + scifiCount);\n    }\n}`,
      },
      { t: 'quiz', q: 'What is the difference between `map` and `flatMap`?', options: ['They are identical', 'map transforms one element to one element. flatMap transforms one element to zero-or-more elements and flattens the results into a single stream — use it to unwrap nested collections', 'flatMap is deprecated', 'map works on streams; flatMap works on collections'], answer: 1, why: 'map: T→U. flatMap: T→Stream<U>, then flattens all the streams into one. Essential for working with nested structures like List<List<String>> or Optional<Optional<T>>.' },
    ],
  },

  /* ==================================================== 20 */
  {
    id: 'jv-l20',
    topic: 'exceptions',
    difficulty: 'beginner',
    title: 'Checked Exceptions and Try-With-Resources',
    minutes: 12,
    summary: 'Java\'s checked vs unchecked exception model, and the try-with-resources statement for automatic cleanup.',
    objectives: ['Distinguish checked from unchecked exceptions', 'Use try-with-resources', 'Read the IOException hierarchy'],
    blocks: [
      { t: 'text', md: 'Java divides exceptions into two categories:\n- **Checked** — the compiler forces you to handle or declare them (IOException, SQLException). They represent recoverable conditions.\n- **Unchecked** — RuntimeException and its subclasses (NullPointerException, IllegalArgumentException). They represent programming bugs.\n\n`try-with-resources` guarantees that anything implementing `AutoCloseable` (files, sockets, DB connections) is closed — even on exception.' },
      { t: 'code', run: true, lang: 'java', code: `import java.io.*;\nimport java.nio.file.*;\n\nclass Main {\n    // Declaring that this method might throw\n    static String readFirstLine(String path) throws IOException {\n        // try-with-resources: BufferedReader is auto-closed\n        try (BufferedReader reader = Files.newBufferedReader(Path.of(path))) {\n            return reader.readLine();\n        }\n        // No finally block needed — reader.close() is guaranteed\n    }\n\n    static void safeExample() {\n        try {\n            String line = readFirstLine("nonexistent.txt\");\n            System.out.println(line);\n        } catch (IOException e) {\n            System.out.println("Could not read file: " + e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        safeExample();\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a CSV reader with proper resource management',
        md: 'Reading a CSV file line by line: the file handle must be closed even if parsing fails. try-with-resources handles this perfectly. The reader is closed after the try block regardless of how it exits.',
        run: true,
        lang: 'java',
        code: `import java.io.*;\nimport java.util.*;\n\nclass Main {\n    record Row(String name, int score) {}\n\n    static List<Row> readScores(String path) throws IOException {\n        List<Row> rows = new ArrayList<>();\n        try (BufferedReader r = new BufferedReader(new StringReader(\n                "Ada,95\\nGrace,88\\nAlan,72\\n\"))) {\n            String line;\n            while ((line = r.readLine()) != null) {\n                String[] parts = line.split(",");\n                rows.add(new Row(parts[0], Integer.parseInt(parts[1])));\n            }\n        }\n        return rows;\n    }\n\n    public static void main(String[] args) throws IOException {\n        for (Row row : readScores("scores.csv\")) {\n            System.out.printf("%-8s %3d%n\", row.name(), row.score());\n        }\n    }\n}`,
      },
      { t: 'quiz', q: 'Why does Java have checked exceptions?', options: ['They are faster', 'The compiler forces the caller to acknowledge recoverable error conditions — you must catch or declare them. This makes failure modes explicit in the API', 'All languages have them', 'They are optional'], answer: 1, why: 'Checked exceptions make it impossible to forget about a recoverable failure path. The method signature documents "this can fail with IOException" and the compiler enforces handling.' },
    ],
  },

  /* ==================================================== 21 */
  {
    id: 'jv-l21',
    topic: 'exceptions',
    difficulty: 'intermediate',
    title: 'Custom Exceptions and Error Design',
    minutes: 13,
    summary: 'Creating domain-specific exception hierarchies and deciding between checked and unchecked.',
    objectives: ['Define custom exception classes', 'Choose between checked and unchecked', 'Add context to error messages'],
    blocks: [
      { t: 'text', md: 'When built-in exceptions do not describe your problem, define your own. Extend `Exception` for checked (caller MUST handle), extend `RuntimeException` for unchecked (programming error).\n\nA good custom exception carries **context**: what was being attempted, what values were involved, and a human-readable message.' },
      { t: 'code', run: true, lang: 'java', code: `class InsufficientFundsException extends Exception {\n    private final double balance;\n    private final double requested;\n\n    InsufficientFundsException(double balance, double requested) {\n        super(String.format("Balance %.2f, tried to withdraw %.2f\",\n            balance, requested));\n        this.balance = balance;\n        this.requested = requested;\n    }\n\n    double shortfall() { return requested - balance; }\n}\n\nclass Main {\n    static double withdraw(double balance, double amount)\n            throws InsufficientFundsException {\n        if (amount > balance) {\n            throw new InsufficientFundsException(balance, amount);\n        }\n        return balance - amount;\n    }\n\n    public static void main(String[] args) {\n        try {\n            System.out.println("New balance: " + withdraw(100, 250));\n        } catch (InsufficientFundsException e) {\n            System.out.println("Denied: " + e.getMessage());\n            System.out.println("You need " + e.shortfall() + " more\");\n        }\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a service layer with domain exceptions',
        md: 'A user service that validates input and throws typed exceptions for each failure mode. The controller catches them and maps to HTTP status codes. The exception hierarchy IS the documentation of what can go wrong.',
        run: true,
        lang: 'java',
        code: `class ValidationException extends RuntimeException {\n    ValidationException(String msg) { super(msg); }\n}\n\nclass NotFoundException extends RuntimeException {\n    NotFoundException(String msg) { super(msg); }\n}\n\nclass UserService {\n    record User(String name, String email) {}\n\n    static User createUser(String name, String email) {\n        if (name == null || name.isBlank()) {\n            throw new ValidationException("Name is required\");\n        }\n        if (email == null || !email.contains("@\")) {\n            throw new ValidationException("Invalid email\");\n        }\n        if (email.endsWith("@test.com\")) {\n            throw new ValidationException("Test emails not allowed\");\n        }\n        return new User(name, email);\n    }\n}\n\nclass Main {\n    static void register(String name, String email) {\n        try {\n            var user = UserService.createUser(name, email);\n            System.out.println("Created: " + user);\n        } catch (ValidationException e) {\n            System.out.println("Validation failed: " + e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        register("Ada\", "ada@example.com\");\n        register("\"", \"invalid\");\n        register("Test\", \"test@test.com\");\n    }\n}`,
      },
      { t: 'quiz', q: 'When should a custom exception extend RuntimeException vs Exception?', options: ['Always RuntimeException', 'RuntimeException for programming errors/bugs (caller cannot reasonably recover). Exception for recoverable conditions the caller SHOULD handle', 'Always Exception', 'There is no difference'], answer: 1, why: 'RuntimeException (unchecked) means "this is a bug — fix the code". Exception (checked) means "this is expected sometimes — handle it". The distinction guides API design.' },
    ],
  },

  /* ==================================================== 22 */
  {
    id: 'jv-l22',
    topic: 'concurrency',
    difficulty: 'beginner',
    title: 'Threads and Runnable',
    minutes: 12,
    summary: 'Creating and running threads, the Runnable interface, and why concurrency is hard.',
    objectives: ['Create a thread with Runnable', 'Start and join a thread', 'Explain a race condition'],
    blocks: [
      { t: 'text', md: 'A **thread** is an independent path of execution. Java threads map to OS threads — they truly run in parallel on multi-core machines.\n\n```java\nThread t = new Thread(() -> {\n    System.out.println("Running in another thread");\n});\nt.start();       // begin execution\nt.join();        // wait for it to finish\n```\n\nThe challenge: when multiple threads read and write shared data without coordination, **race conditions** produce incorrect, non-deterministic results.' },
      { t: 'code', run: true, lang: 'java', code: `class Main {\n    public static void main(String[] args) throws InterruptedException {\n        // Two tasks running concurrently\n        Thread counter = new Thread(() -> {\n            for (int i = 1; i <= 5; i++) {\n                System.out.println("Counter: " + i);\n                try { Thread.sleep(50); }\n                catch (InterruptedException e) { return; }\n            }\n        });\n\n        Thread printer = new Thread(() -> {\n            for (char c = 'A'; c <= 'E'; c++) {\n                System.out.println("Printer: " + c);\n                try { Thread.sleep(70); }\n                catch (InterruptedException e) { return; }\n            }\n        });\n\n        counter.start();\n        printer.start();\n\n        counter.join();\n        printer.join();\n        System.out.println("Both threads done\");\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a simple download simulator',
        md: 'Simulating three concurrent downloads, each in its own thread. The main thread waits for all to complete with join() before printing a summary. This pattern (fork-join) is the simplest concurrent model.',
        run: true,
        lang: 'java',
        code: `class Main {\n    static class DownloadTask implements Runnable {\n        private final String file;\n        private final int size;\n        private long bytesDownloaded = 0;\n\n        DownloadTask(String file, int size) {\n            this.file = file;\n            this.size = size;\n        }\n\n        @Override\n        public void run() {\n            System.out.println("Starting: " + file);\n            for (int i = 0; i < size; i += 10) {\n                bytesDownloaded = Math.min(i + 10, size);\n                System.out.printf("  %s: %d/%d KB%n\", file, bytesDownloaded, size);\n                try { Thread.sleep(100); }\n                catch (InterruptedException e) { Thread.currentThread().interrupt(); return; }\n            }\n            System.out.println("Finished: " + file);\n        }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread[] threads = {\n            new Thread(new DownloadTask("file-a.zip\", 30)),\n            new Thread(new DownloadTask("file-b.zip\", 20)),\n            new Thread(new DownloadTask("file-c.zip\", 40)),\n        };\n\n        for (Thread t : threads) t.start();\n        for (Thread t : threads) t.join();\n\n        System.out.println("\\nAll downloads complete.\");\n    }\n}`,
      },
      { t: 'quiz', q: 'What is a race condition?', options: ['When threads compete for speed', 'When two or more threads access shared data concurrently and the result depends on the timing of their execution — producing non-deterministic, incorrect results', 'When a thread finishes too fast', 'A type of compiler error'], answer: 1, why: 'Race conditions occur when the correctness of a program depends on the relative timing of threads. Without synchronisation, operations interleave unpredictably.' },
    ],
  },

  /* ==================================================== 23 */
  {
    id: 'jv-l23',
    topic: 'concurrency',
    difficulty: 'intermediate',
    title: 'ExecutorService and Futures',
    minutes: 14,
    summary: 'Thread pools with ExecutorService, returning results with Callable and Future, and coordinating tasks.',
    objectives: ['Submit tasks to an ExecutorService', 'Get results from Futures', 'Gracefully shut down a thread pool'],
    blocks: [
      { t: 'text', md: 'Creating raw Threads does not scale. **ExecutorService** manages a pool of reusable threads — submit tasks, get Futures back, and shut down cleanly.\n\n`Callable<V>` is like Runnable but returns a value. `Future<V>` is a handle to a result that will be available later.\n\n```java\nExecutorService executor = Executors.newFixedThreadPool(4);\nFuture<Integer> result = executor.submit(() -> 2 + 2);\nInteger answer = result.get();  // blocks until ready\nexecutor.shutdown();\n```' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.*;\nimport java.util.concurrent.*;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        ExecutorService exec = Executors.newFixedThreadPool(3);\n\n        List<Future<Integer>> futures = new ArrayList<>();\n        for (int i = 1; i <= 5; i++) {\n            final int taskId = i;\n            futures.add(exec.submit(() -> {\n                Thread.sleep(ThreadLocalRandom.current().nextInt(100, 300));\n                return taskId * taskId;\n            }));\n        }\n\n        for (int i = 0; i < futures.size(); i++) {\n            System.out.printf("Task %d result: %d%n\", i + 1, futures.get(i).get());\n        }\n\n        exec.shutdown();\n        exec.awaitTermination(5, TimeUnit.SECONDS);\n        System.out.println("Executor shut down\");\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — a concurrent price checker',
        md: 'Query multiple vendor APIs for the price of a product. Each call goes to a separate thread. `invokeAll` submits all tasks and returns when every Future is complete. Then find the best price.',
        run: true,
        lang: 'java',
        code: `import java.util.*;\nimport java.util.concurrent.*;\n\nclass Main {\n    record VendorQuote(String vendor, double price) {}\n\n    static Callable<VendorQuote> quoteFrom(String vendor, double basePrice, long delay) {\n        return () -> {\n            Thread.sleep(delay);  // simulate network\n            double variation = ThreadLocalRandom.current().nextDouble(0.9, 1.1);\n            return new VendorQuote(vendor, Math.round(basePrice * variation * 100.0) / 100.0);\n        };\n    }\n\n    public static void main(String[] args) throws Exception {\n        ExecutorService exec = Executors.newFixedThreadPool(3);\n\n        List<Callable<VendorQuote>> tasks = List.of(\n            quoteFrom("VendorA\", 99.99, 200),\n            quoteFrom("VendorB\", 99.99, 150),\n            quoteFrom("VendorC\", 99.99, 100),\n        );\n\n        List<Future<VendorQuote>> futures = exec.invokeAll(tasks, 5, TimeUnit.SECONDS);\n\n        VendorQuote best = null;\n        for (Future<VendorQuote> f : futures) {\n            if (f.isCancelled()) { System.out.println("  (timed out)\"); continue; }\n            VendorQuote quote = f.get();\n            System.out.printf("  %s: $%.2f%n\", quote.vendor(), quote.price());\n            if (best == null || quote.price() < best.price()) best = quote;\n        }\n\n        System.out.printf(\"\\nBest: %s at $%.2f%n\",\n            best != null ? best.vendor() : "none\", best != null ? best.price() : 0);\n\n        exec.shutdown();\n    }\n}`,
      },
      { t: 'quiz', q: 'Why use a thread pool (ExecutorService) instead of creating new Threads?', options: ['Threads are deprecated', 'Thread creation is expensive. A pool reuses threads, limits concurrency, and provides lifecycle management — submit, shutdown, await termination', 'Thread pools are faster for single tasks', 'There is no difference'], answer: 1, why: 'Creating OS threads is costly (memory, scheduling). A pool amortises that cost by reusing a fixed number of worker threads. ExecutorService also provides structured lifecycle management.' },
    ],
  },

  /* ==================================================== 24 */
  {
    id: 'jv-l24',
    topic: 'concurrency',
    difficulty: 'advanced',
    title: 'CompletableFuture and Async Pipelines',
    minutes: 15,
    summary: 'Composing async operations with CompletableFuture — thenApply, thenCombine, and error recovery.',
    objectives: ['Chain async operations with thenApply/thenCompose', 'Combine independent futures', 'Handle errors in async pipelines'],
    blocks: [
      { t: 'text', md: '`CompletableFuture<T>` is a Future you can explicitly complete, and a framework for composing async operations without blocking. It is the foundation of reactive and non-blocking Java.\n\n```java\nCompletableFuture.supplyAsync(() -> fetchUser(id))\n    .thenApply(user -> user.name())\n    .thenAccept(name -> System.out.println("Got: " + name));\n```' },
      { t: 'code', run: true, lang: 'java', code: `import java.util.concurrent.*;\n\nclass Main {\n    static CompletableFuture<String> fetchUser(int id) {\n        return CompletableFuture.supplyAsync(() -> {\n            sleep(100);\n            return "User#" + id;\n        });\n    }\n\n    static CompletableFuture<Integer> fetchScore(String user) {\n        return CompletableFuture.supplyAsync(() -> {\n            sleep(150);\n            return user.hashCode() % 100 + 50;\n        });\n    }\n\n    public static void main(String[] args) throws Exception {\n        // Chain: fetch user, then fetch their score\n        CompletableFuture<String> result = fetchUser(42)\n            .thenCompose(Main::fetchScore)\n            .thenApply(score -> "Score: " + score)\n            .exceptionally(ex -> "Error: " + ex.getMessage());\n\n        // Combine two independent futures\n        CompletableFuture<String> user1 = fetchUser(1);\n        CompletableFuture<String> user2 = fetchUser(2);\n\n        CompletableFuture<String> combined = user1.thenCombine(user2,\n            (u1, u2) -> u1 + " and " + u2);\n\n        System.out.println(result.get());\n        System.out.println(combined.get());\n    }\n\n    static void sleep(long ms) {\n        try { Thread.sleep(ms); } catch (InterruptedException e) { }\n    }\n}` },
      {
        t: 'case',
        title: 'Case study — an async order processing pipeline',
        md: 'Processing an order: validate inventory, charge payment, and schedule shipping — all async. Each step depends on the previous one. CompletableFuture chains them declaratively. If any step fails, exceptionally() recovers with a meaningful error.',
        run: true,
        lang: 'java',
        code: `import java.util.concurrent.*;\n\nclass Main {\n    record Order(String id, String item, double amount) {}\n    record Receipt(String orderId, String status, String details) {}\n\n    static CompletableFuture<Boolean> checkInventory(Order order) {\n        return CompletableFuture.supplyAsync(() -> {\n            sleep(100);\n            boolean inStock = !order.item().equals("widget\");\n            System.out.println("  Inventory check: \" + (inStock ? \"OK\" : \"OUT\"));\n            return inStock;\n        });\n    }\n\n    static CompletableFuture<String> processPayment(Order order) {\n        return CompletableFuture.supplyAsync(() -> {\n            sleep(200);\n            System.out.println("  Payment processed\");\n            return "TXN-\" + ThreadLocalRandom.current().nextInt(1000, 9999);\n        });\n    }\n\n    static CompletableFuture<Receipt> process(Order order) {\n        return checkInventory(order).thenCompose(inStock -> {\n            if (!inStock) {\n                throw new RuntimeException("Out of stock: \" + order.item());\n            }\n            return processPayment(order)\n                .thenApply(txn -> new Receipt(order.id(), "CONFIRMED\",\n                    order.amount() + \" paid, ref: \" + txn));\n        }).exceptionally(ex ->\n            new Receipt(order.id(), "FAILED\", ex.getMessage()));\n    }\n\n    public static void main(String[] args) throws Exception {\n        CompletableFuture<Receipt> ok = process(\n            new Order("ORD-1\", "book\", 29.99));\n        CompletableFuture<Receipt> fail = process(\n            new Order("ORD-2\", "widget\", 9.99));\n\n        System.out.println("\\nResult 1: \" + ok.get());\n        System.out.println("Result 2: \" + fail.get());\n    }\n\n    static void sleep(long ms) {\n        try { Thread.sleep(ms); } catch (InterruptedException e) { }\n    }\n}`,
      },
      { t: 'quiz', q: 'What is the difference between `thenApply` and `thenCompose`?', options: ['They are identical', 'thenApply maps T→U (like map). thenCompose maps T→CompletableFuture<U> and flattens (like flatMap) — use it when the next step is itself async', 'thenApply is for synchronous only', 'thenCompose is deprecated'], answer: 1, why: 'thenApply: synchronous transformation T→U. thenCompose: async chaining T→CompletableFuture<U>, preventing nested CompletableFuture<CompletableFuture<U>>. Same as map vs flatMap.' },
    ],
  },

];
