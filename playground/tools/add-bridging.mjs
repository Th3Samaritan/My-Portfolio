import { readFileSync, writeFileSync } from 'fs';

const pythonBridging = {
  'py-l2': { prev:'You wrote your first line of Python and met the print function. Errors are information, not failure.', why:'Now we give values names so we can reuse them. Variables are the single most fundamental concept in programming.', next:'Variable names are useless without operations. Next: arithmetic.', },
  'py-l3': { prev:'You learned that values have types and that variables are labels you tie to values.', why:'Python is an excellent calculator. Arithmetic transforms numbers — and the modulo operator turns out to be far more useful than it sounds.', next:'Numbers alone rarely tell the whole story. Next: working with text.', },
  'py-l4': { prev:'You can do arithmetic, test divisibility, and work with integer and decimal division.', why:'Most programs spend more time manipulating text than numbers. f-strings, methods, and indexing are tools you will reach for every day.', next:'Every program so far has run straight through. Next: making decisions.', },
  'py-l5': { prev:'You can build text with f-strings, clean it with methods, and pull out characters by position.', why:'Real programs choose paths. Conditionals turn a script into a program that reacts to its inputs.', next:'Decisions are one half of control flow. Next: loops — doing things repeatedly.', },
  'py-l6': { prev:'You can branch with if/elif/else and combine conditions. Your program can now choose a path.', why:'Computers are extraordinarily good at repetition without mistakes. Loops unlock this power.', next:'Loops become far more useful with collections. Next: lists — holding many values together.', },
  'py-l7': { prev:'You can repeat work with for and while loops, count with range, and accumulate results.', why:'Real data arrives in batches. Lists are the most common way to hold many values together. This is a dense lesson — do not feel you must absorb everything in one sitting. Take a break after the sorting section.', next:'Lists find things by position. Next: dictionaries — finding things by name.', },
  'py-l8': { prev:'You can create lists, add and remove items, sort them, and loop with positions.', why:'Dictionaries look things up by name instead of position. Most real-world data is more naturally organised this way.', next:'You can store and retrieve data. Next: functions — packaging work so you never write the same logic twice.', },
  'py-l9': { prev:'You can store key/value pairs, loop over dictionaries, and count with the .get() pattern.', why:'You have been writing functions since lesson one. Now we examine them properly — parameters, return values, defaults, and print-vs-return.', next:'Functions give you power. Next: handling errors gracefully instead of crashing.', },
  'py-l10': { prev:'You can write functions with parameters, defaults, return values, and docstrings. You understand scope.', why:'No program runs perfectly. Files go missing, users type nonsense. Error handling separates fragile scripts from robust programs.', next:'You have all the building blocks. Next: assembling them into a real program.', },
  'py-l11': { prev:'You can catch exceptions, read tracebacks, and decide whether to handle errors or crash informatively.', why:'This lesson is different — it is not about new syntax. It is about how experienced developers actually build: one function at a time, tested incrementally, assembled at the end.', next:'You have built a real program from scratch. Next: turning code into reusable scripts.', },
  'py-l14': { prev:'You learned about the Python ecosystem — venv, pip, and project structure.', why:'Every value in Python can be tested as true or false. This truthiness concept simplifies conditions throughout the language.', next:'Truthiness simplifies code. Next: identity, equality, and the subtle difference between is and ==.', },
  'py-l16': { prev:'You understand is vs ==, mutable defaults, and why identity matters for mutable objects.', why:'Real programs have complex conditions. any() and all() collapse many checks into one readable line — and guard clauses eliminate deeply nested if blocks.', next:'You can simplify complex logic. Next: structural pattern matching — a powerful alternative to if/elif chains.', },
  'py-l18': { prev:'You can destructure values with match/case and write patterns that the compiler checks for exhaustiveness.', why:'Real data needs sorting — by name, by score, by date. Python makes custom sort orders trivial with key functions and lambda.', next:'You can sort by any criterion. Next: the collections module — specialised containers that replace manual boilerplate.', },
};

const javaBridging = {
  'jv-l2': { prev:'You wrote your first Java program and understand the compiler. You know what every word in public static void main means.', why:'Java is statically typed — every variable declares its type. This catches entire categories of bugs before your code runs.', next:'You can declare typed variables. Next: decisions, loops, and methods.', },
  'jv-l3': { prev:'You can declare typed variables and understand primitives vs objects. You know why == lies on Strings.', why:'Control flow makes programs choose paths and repeat work. Java syntax differs from Python but the ideas are identical.', next:'You can branch and loop. Next: classes and objects — the idea Java is built around.', },
  'jv-l4': { prev:'You can use if/else, for loops, while loops, and write methods with parameters and return types.', why:'Java is object-oriented at its core. Classes bundle data with behaviour — this is the mental model Java code is organised around.', next:'You can design classes. Next: ArrayList and HashMap — the collections that cover most real work.', },
  'jv-l5': { prev:'You can define classes with fields, constructors, and methods. You understand encapsulation and why fields are private.', why:'Arrays in Java are fixed-size — awkward for real work. ArrayList and HashMap are the dynamic containers you will use constantly.', next:'You have a working foundation. Next: what happens under the hood — the JVM, bytecode, and how Java actually runs.', },
};

const webBridging = {
  'web-l2': { prev:'You learned that HTML is a description of meaning — not appearance. You can write elements, nest them, and build a basic page.', why:'A page of div elements works visually but is invisible to screen readers. Semantic HTML tells machines what each region is.', next:'HTML gives structure. Next: CSS — making it look deliberate.', },
  'web-l3': { prev:'You can structure a page with landmarks and build accessible forms with labelled inputs.', why:'CSS answers one question: how should this look? Selectors and the box model cover 90% of styling.', next:'You can style elements. Next: Flexbox — arranging things without fighting the browser.', },
  'web-l4': { prev:'You can target elements with selectors, control spacing with the box model, and set colours and type.', why:'Flexbox replaced floats and clearfix hacks with properties that actually make sense.', next:'Flexbox handles one-dimensional layouts. Next: Grid — rows AND columns at the same time.', },
  'web-l5': { prev:'You can lay out elements with Flexbox, control spacing with gap, and centre things with three lines of CSS.', why:'HTML is structure, CSS is appearance. JavaScript is behaviour. If you have done the Python track, the ideas are the same.', next:'You can write functions and work with arrays. Next: making the page react — finding elements, listening for events, updating the DOM.', },
  'web-l6': { prev:'You can declare variables, write functions, avoid the loose-equality trap, and use array methods.', why:'The DOM is a live tree of objects. JavaScript reads and changes it — and the page updates instantly. This is where static pages become applications.', next:'You can make the page interactive. Next: fetching data from servers — the bridge to the outside world.', },
};

const rustBridging = {
  'rs-l2': { prev:'You wrote your first Rust program and met the compiler. Rust proves memory safety at compile time — the trade that makes it fast and safe.', why:'Rust types are strict but deliberate. Understanding core types and why everything is immutable by default is the foundation.', next:'You know the basic types. Next: functions, expressions, and match.', },
  'rs-l3': { prev:'You can declare values with let and let mut, distinguish String from &str, and understand explicit type conversion.', why:'In Rust, almost everything is an expression — including if and blocks. This changes how you write functions.', next:'You can write functions and use match. Next: ownership — the system that eliminates memory bugs at compile time.', },
  'rs-l4': { prev:'You can write functions, use if and match as expressions, and loop three ways.', why:'This is the lesson that makes Rust Rust. Ownership replaces garbage collection and manual memory management.', next:'You understand ownership and moves. Next: borrowing — using values without taking them.', },
  'rs-l5': { prev:'You know the three ownership rules and can predict when values move vs copy.', why:'Borrowing lets functions look at values without taking ownership. The borrowing rules enable fearless concurrency.', next:'You can borrow immutably and mutably. Next: modelling data with structs and enums.', },
  'rs-l6': { prev:'You can borrow with & and &mut, and the compiler enforces "many readers OR one writer."', why:'Designing types so invalid states cannot be written down is the highest-value habit in Rust.', next:'You can model data. Next: Cargo — creating projects, managing dependencies, and running tests.', },
};

function addBridging(content, bridgingMap) {
  let result = content;
  
  for (const [lessonId, bridging] of Object.entries(bridgingMap)) {
    const introBlock = `\n      { t:'text', md:\`**Previously:** ${bridging.prev}\n\n${bridging.why}\` },\n      `;
    const outroBlock = `\n      { t:'text', md:\`${bridging.next}\` },\n`;
    
    const lessonStart = new RegExp(
      `(id:\\s*'${lessonId}'[\\s\\S]*?blocks:\\s*\\[)`,
      'm'
    );
    result = result.replace(lessonStart, (match) => match + introBlock);
    
    // Insert outro before the blocks array closing: find the lesson's
    // `\n    ],\n  },` pattern and insert outro text before it
    const outroRegex = new RegExp(
      `(id:\\s*'${lessonId}'[\\s\\S]*?)(\\r?\\n    \\],\\r?\\n  \\},)`,
      'm'
    );
    
    result = result.replace(outroRegex, (match, before, after) => {
      return before + outroBlock + after;
    });
  }
  
  return result;
}

const files = [
  { path: 'data/lessons-python.js', bridging: pythonBridging },
  { path: 'data/lessons-java.js', bridging: javaBridging },
  { path: 'data/lessons-web.js', bridging: webBridging },
  { path: 'data/lessons-rust.js', bridging: rustBridging },
];

for (const { path, bridging } of files) {
  console.log(`Processing ${path}...`);
  const content = readFileSync(path, 'utf-8');
  const modified = addBridging(content, bridging);
  writeFileSync(path, modified);
  console.log('  Done.');
}
