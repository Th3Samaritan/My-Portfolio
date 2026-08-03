/* ============================================================
   Web Development — Beginner course

   Same lesson schema as lessons-python.js, plus two web-only
   block types:

   { t:'web',    md?, files:{html,css,js} }   live preview, editable
   { t:'tryweb', prompt, files, checks,       graded exercise against
                 solution, hints? }           a real DOM

   `checks` use the same {name, code} shape as the web challenges,
   so the existing iframe runner grades them unchanged.
   ============================================================ */

export const webLessonTopics = [
  { id: 'html-fundamentals', name: 'Structure (HTML)', blurb: 'What a page is made of — elements, semantics, forms, and accessibility basics.' },
  { id: 'css-styling', name: 'Styling (CSS)', blurb: 'Selectors, the box model, colour, type, and making it look deliberate.' },
  { id: 'css-layout', name: 'Layout', blurb: 'Flexbox, Grid, responsive design — arranging things without fighting the browser.' },
  { id: 'javascript-basics', name: 'JavaScript Basics', blurb: 'Variables, functions, objects, arrays — the language that runs in every browser.' },
  { id: 'javascript-dom', name: 'DOM & Events', blurb: 'Finding elements, listening for events, and updating the page from data.' },
  { id: 'javascript-async', name: 'Async & APIs', blurb: 'fetch, Promises, async/await, loading states, and talking to servers.' },
  { id: 'accessibility', name: 'Accessibility', blurb: 'ARIA, focus management, keyboard navigation, and designing for everyone.' },
];

export const webLessons = [
  /* ==================================================== 1 */
  {
    id: 'web-l1',
    topic: 'html-fundamentals',
    title: 'What a Web Page Actually Is',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'HTML is a description of meaning, not appearance. Tags, nesting, and your first page.',
    objectives: ['Write valid HTML elements', 'Nest elements correctly', 'Explain what the browser does with your file'],
    blocks: [
      {
        t: 'text',
        md: `A web page is a **text file**. That is the whole secret.

You write a file describing *what the content is* — this is a heading, this is a paragraph, this is a link — and the browser decides how to draw it. That description language is **HTML**: HyperText Markup Language.

Notice what HTML is *not*: it is not a design tool. It says "this is a heading", not "this is 32 pixels and bold". Appearance comes later, in CSS. Keeping those two jobs separate is the single most important idea in front-end work.`,
      },
      {
        t: 'text',
        md: `## Elements and tags

You mark up content by wrapping it in **tags**:

\`\`\`html
<h1>Hello</h1>
\`\`\`

- \`<h1>\` is the **opening tag**
- \`</h1>\` is the **closing tag** — note the slash
- together with the content they form an **element**

Edit the preview below — change the text, add another paragraph — and watch it update.`,
      },
      {
        t: 'web',
        md: 'Your first page. Try changing the words, then add a second `<p>` of your own.',
        files: {
          html: `<h1>My First Page</h1>\n<p>This is a paragraph of text.</p>\n<p>This is another one.</p>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  line-height: 1.6;\n}`,
          js: ``,
        },
      },
      {
        t: 'text',
        md: `## The tags you will use most

| Tag | Meaning |
|---|---|
| \`<h1>\` … \`<h6>\` | headings, most to least important |
| \`<p>\` | a paragraph |
| \`<ul>\` \`<ol>\` \`<li>\` | unordered / ordered lists, and their items |
| \`<a>\` | a link |
| \`<img>\` | an image |
| \`<strong>\` \`<em>\` | important / emphasised text |
| \`<div>\` \`<span>\` | meaningless boxes, for when nothing else fits |

Use **one** \`<h1>\` per page — it is the page's title. Then \`<h2>\` for sections, \`<h3>\` inside those. Do not skip levels to get a smaller font; that is CSS's job.`,
      },
      {
        t: 'text',
        md: `## Attributes

Some elements need extra information, given as **attributes** inside the opening tag:

\`\`\`html
<a href="https://example.com">Visit the site</a>
<img src="cat.jpg" alt="A ginger cat asleep on a keyboard">
\`\`\`

\`<img>\` has no closing tag — it wraps no content, so there is nothing to close. Such elements are called **void elements**.

\`alt\` is not optional in practice: it is what screen-reader users hear and what shows if the image fails to load. Describe the image's *purpose*, not the word "image".`,
      },
      {
        t: 'web',
        md: 'Links, lists and images together.',
        files: {
          html: `<h1>Reading List</h1>\n\n<h2>Currently reading</h2>\n<ul>\n  <li><strong>Structure and Interpretation of Computer Programs</strong></li>\n  <li>The Pragmatic Programmer</li>\n</ul>\n\n<h2>A link</h2>\n<p>Try <a href="https://developer.mozilla.org">MDN Web Docs</a> when you get stuck.</p>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  line-height: 1.6;\n  max-width: 34rem;\n}\n\na { color: #2563eb; }`,
          js: ``,
        },
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Nesting must not cross over',
        md: `Elements go **inside** each other, never overlapping. Like nesting boxes.

\`\`\`html
<p>This is <strong>fine</strong>.</p>     <!-- correct -->
<p>This is <strong>wrong.</p></strong>    <!-- crossed over -->
\`\`\`

Indenting children by two spaces makes mistakes obvious at a glance. Get into the habit now — it costs nothing and saves hours later.`,
      },
      {
        t: 'tryweb',
        prompt: `Build a small "About me" page.

It needs:
- exactly one \`<h1>\`
- at least one \`<p>\`
- a \`<ul>\` containing exactly **three** \`<li>\` items
- a link (\`<a>\`) with an \`href\`

Content is up to you.`,
        files: {
          html: `<!-- Build your page here -->\n`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  line-height: 1.6;\n}`,
          js: ``,
        },
        solution: {
          html: `<h1>About Me</h1>\n\n<p>I am learning to build for the web, starting from nothing.</p>\n\n<h2>Three things about me</h2>\n<ul>\n  <li>I like solving puzzles</li>\n  <li>I drink too much coffee</li>\n  <li>I am new to code</li>\n</ul>\n\n<p>My favourite reference: <a href="https://developer.mozilla.org">MDN</a></p>\n`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  line-height: 1.6;\n}`,
          js: ``,
        },
        hints: [
          'Start with <h1>About Me</h1> on its own line.',
          'A list is a <ul> wrapper with three <li> elements inside it.',
          'A link needs the href attribute: <a href="https://example.com">text</a>',
        ],
        checks: [
          { name: 'has exactly one h1', code: `return doc.querySelectorAll('h1').length === 1;` },
          { name: 'has at least one paragraph', code: `return doc.querySelectorAll('p').length >= 1;` },
          { name: 'has a list with three items', code: `const ul = doc.querySelector('ul'); return !!ul && ul.querySelectorAll('li').length === 3;` },
          { name: 'has a link with an href', code: `const a = doc.querySelector('a[href]'); return !!a && a.getAttribute('href').length > 0;` },
          { name: 'the h1 is not empty', code: `return doc.querySelector('h1').textContent.trim().length > 0;`, hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'Why should you use `<h2>` for a section heading rather than a `<p>` styled to look big and bold?',
        options: [
          'It loads faster',
          'Headings carry meaning — screen readers and search engines use them to understand the page structure',
          'Paragraphs cannot be made bold',
          'There is no real difference',
        ],
        answer: 1,
        why: 'HTML describes meaning. A screen-reader user can jump between headings to navigate a page; a bold paragraph is invisible to that. Styling is CSS\'s job, structure is HTML\'s.',
      },
      {
            "t": "tryweb",
            "prompt": "Exercise 2: Build a page with an `<h2>` heading, a `<p>` paragraph, and an ordered list (`<ol>`) with three items. Content is up to you.",
            "files": {
                  "html": "<!-- Build your page here -->\n",
                  "css": "body { font-family: system-ui, sans-serif; padding: 1.5rem; }",
                  "js": ""
            },
            "solution": {
                  "html": "<h2>My Favourites</h2>\n<p>Here are my top three programming languages:</p>\n<ol>\n  <li>Python</li>\n  <li>Rust</li>\n  <li>Java</li>\n</ol>",
                  "css": "body { font-family: system-ui, sans-serif; padding: 1.5rem; }",
                  "js": ""
            },
            "hints": [
                  "Start with an <h2> heading.",
                  "Add a <p> paragraph after it.",
                  "Use <ol> with three <li> elements inside."
            ],
            "checks": [
                  {
                        "name": "has heading",
                        "code": "return !!doc.querySelector('h2');"
                  },
                  {
                        "name": "has paragraph",
                        "code": "return !!doc.querySelector('p');"
                  },
                  {
                        "name": "has ordered list with 3 items",
                        "code": "const ol = doc.querySelector('ol'); return !!ol && ol.querySelectorAll('li').length === 3;"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 2 */
  {
    id: 'web-l2',
    topic: 'html-fundamentals',
    title: 'Structure and Semantics',
    difficulty: 'beginner',
    minutes: 10,
    summary: 'Landmarks, forms, and why a wall of divs is a problem.',
    objectives: ['Use semantic landmark elements', 'Build a labelled form', 'Explain what a div is actually for'],
    blocks: [
      { t:'text', md:`**Previously:** You learned that HTML is a description of meaning — not appearance. You can write elements, nest them, and build a basic page.

A page of div elements works visually but is invisible to screen readers. Semantic HTML tells machines what each region is.` },
      
      { t:'text', md:`**Previously:** You learned that HTML is a description of meaning — not appearance. You can write elements, nest them, and build a basic page.

A page of div elements works visually but is invisible to screen readers. Semantic HTML tells machines what each region is.` },
      
      {
        t: 'text',
        md: `You can build any page out of \`<div>\` elements. Many people do. It works — and it is a bad idea.

A \`<div>\` means **nothing**. It is a generic box. A page made of divs is, to a screen reader or a search engine, an undifferentiated soup.

HTML gives you **landmark** elements that say what a region *is*:

| Element | The region that... |
|---|---|
| \`<header>\` | introduces the page or a section |
| \`<nav>\` | contains navigation links |
| \`<main>\` | holds the main content — one per page |
| \`<article>\` | stands alone and makes sense on its own |
| \`<section>\` | is a thematic grouping |
| \`<aside>\` | is tangential — sidebars, pull quotes |
| \`<footer>\` | closes the page or section |`,
      },
      {
        t: 'web',
        md: 'A properly structured page. Structurally this is what almost every website looks like underneath.',
        files: {
          html: `<header>\n  <h1>The Daily Loop</h1>\n  <nav>\n    <ul>\n      <li><a href="#home">Home</a></li>\n      <li><a href="#archive">Archive</a></li>\n    </ul>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>Learning to read errors</h2>\n    <p>The last line first, then work upwards.</p>\n  </article>\n</main>\n\n<aside>\n  <h2>Elsewhere</h2>\n  <p>Links and asides live here.</p>\n</aside>\n\n<footer>\n  <p>© 2026 The Daily Loop</p>\n</footer>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.25rem;\n  line-height: 1.6;\n  max-width: 36rem;\n}\n\nnav ul {\n  display: flex;\n  gap: 1rem;\n  list-style: none;\n  padding: 0;\n}\n\nheader, footer { border-block: 1px solid #ddd; padding-block: 0.75rem; }\naside { background: #f6f6f6; padding: 0.75rem 1rem; border-radius: 8px; }`,
          js: ``,
        },
      },
      {
        t: 'note',
        tone: 'why',
        title: 'So when should you use a div?',
        md: `When you need a box **purely for styling** and no existing element carries the right meaning.

That is a real and legitimate need — wrapping three cards so you can lay them out in a grid, for instance. The rule is simply: *reach for the meaningful element first, and fall back to \`<div>\` when there genuinely isn't one.*`,
      },
      {
        t: 'text',
        md: `## Forms

Forms collect input. The critical part — the one that is skipped constantly — is the **label**.

\`\`\`html
<label for="email">Email address</label>
<input id="email" type="email" name="email">
\`\`\`

The \`for\` of the label must match the \`id\` of the input. That pairing does two things: it tells assistive technology what the box is for, and it makes clicking the label focus the input.

A placeholder is **not** a label. It vanishes the moment someone types, and screen readers treat it inconsistently.`,
      },
      {
        t: 'web',
        md: 'Click the *labels*, not the boxes — focus jumps to the right field. That is the `for`/`id` pairing working.',
        files: {
          html: `<form>\n  <div class="field">\n    <label for="name">Your name</label>\n    <input id="name" type="text" name="name">\n  </div>\n\n  <div class="field">\n    <label for="email">Email address</label>\n    <input id="email" type="email" name="email" required>\n  </div>\n\n  <div class="field">\n    <label for="size">T-shirt size</label>\n    <select id="size" name="size">\n      <option>Small</option>\n      <option>Medium</option>\n      <option>Large</option>\n    </select>\n  </div>\n\n  <button type="submit">Sign up</button>\n</form>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 22rem;\n}\n\n.field { margin-bottom: 1rem; }\n\nlabel {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n\ninput, select {\n  width: 100%;\n  padding: 0.5rem;\n  border: 1px solid #ccc;\n  border-radius: 6px;\n  font: inherit;\n}\n\nbutton {\n  padding: 0.55rem 1.1rem;\n  border: 0;\n  border-radius: 6px;\n  background: #111;\n  color: #fff;\n  font-weight: 600;\n  cursor: pointer;\n}`,
          js: ``,
        },
      },
      {
        t: 'tryweb',
        prompt: `Build a contact form inside proper page structure.

Required:
- a \`<main>\` element wrapping the content
- a \`<form>\` containing **two** inputs, each with a \`<label for=...>\` matching its \`id\`
- one input must be \`type="email"\`
- a \`<button type="submit">\` with visible text`,
        files: {
          html: `<main>\n  <h1>Contact</h1>\n  <!-- your form here -->\n</main>\n`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 22rem; }\nlabel { display: block; font-size: 0.85rem; margin-bottom: 0.25rem; }\ninput { width: 100%; padding: 0.5rem; margin-bottom: 0.75rem; }`,
          js: ``,
        },
        solution: {
          html: `<main>\n  <h1>Contact</h1>\n  <form>\n    <label for="name">Your name</label>\n    <input id="name" type="text" name="name">\n\n    <label for="email">Email address</label>\n    <input id="email" type="email" name="email" required>\n\n    <button type="submit">Send message</button>\n  </form>\n</main>\n`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 22rem; }\nlabel { display: block; font-size: 0.85rem; margin-bottom: 0.25rem; }\ninput { width: 100%; padding: 0.5rem; margin-bottom: 0.75rem; }`,
          js: ``,
        },
        hints: [
          'Each label needs for="x" and its input needs the matching id="x".',
          'The email field is <input id="email" type="email">.',
          'The button goes inside the form: <button type="submit">Send</button>',
        ],
        checks: [
          { name: 'wrapped in <main>', code: `return !!doc.querySelector('main');` },
          { name: 'has a form with two inputs', code: `const f = doc.querySelector('form'); return !!f && f.querySelectorAll('input').length >= 2;` },
          {
            name: 'every input has a matching label',
            code: `const inputs = [...doc.querySelectorAll('form input')]; return inputs.length >= 2 && inputs.every(i => i.id && doc.querySelector('label[for="' + i.id + '"]'));`,
          },
          { name: 'one input is type=email', code: `return !!doc.querySelector('form input[type="email"]');` },
          { name: 'submit button has text', code: `const b = doc.querySelector('button[type="submit"]'); return !!b && b.textContent.trim().length > 0;`, hidden: true },
        ],
      },
      {
        t: 'quiz',
        q: 'What does `<label for="email">` need in order to work?',
        options: [
          'An input with `name="email"`',
          'An input with `id="email"`',
          'To be placed directly above the input',
          'Nothing — `for` is decorative',
        ],
        answer: 1,
        why: 'The label\'s `for` attribute matches an input\'s `id` (not its `name`). That pairing is what lets assistive tech announce the field and makes clicking the label focus the input.',
      },
      {
            "t": "tryweb",
            "prompt": "Exercise 2: Build a page with an `<h2>` heading, a `<p>` paragraph, and an ordered list (`<ol>`) with three items. Content is up to you.",
            "files": {
                  "html": "<!-- Build your page here -->\n",
                  "css": "body { font-family: system-ui, sans-serif; padding: 1.5rem; }",
                  "js": ""
            },
            "solution": {
                  "html": "<h2>My Favourites</h2>\n<p>Here are my top three programming languages:</p>\n<ol>\n  <li>Python</li>\n  <li>Rust</li>\n  <li>Java</li>\n</ol>",
                  "css": "body { font-family: system-ui, sans-serif; padding: 1.5rem; }",
                  "js": ""
            },
            "hints": [
                  "Start with an <h2> heading.",
                  "Add a <p> paragraph after it.",
                  "Use <ol> with three <li> elements inside."
            ],
            "checks": [
                  {
                        "name": "has heading",
                        "code": "return !!doc.querySelector('h2');"
                  },
                  {
                        "name": "has paragraph",
                        "code": "return !!doc.querySelector('p');"
                  },
                  {
                        "name": "has ordered list with 3 items",
                        "code": "const ol = doc.querySelector('ol'); return !!ol && ol.querySelectorAll('li').length === 3;"
                  }
            ]
      },

      { t:'text', md:`HTML gives structure. Next: CSS — making it look deliberate.` },

      { t:'text', md:`HTML gives structure. Next: CSS — making it look deliberate.` },

    ],
  },

  /* ==================================================== 3 */
  {
    id: 'web-l3',
    topic: 'css-styling',
    title: 'Making It Look Deliberate',
    difficulty: 'beginner',
    minutes: 14,
    summary: 'Selectors, the box model, and the handful of properties that do most of the work.',
    objectives: ['Target elements with selectors', 'Control spacing with the box model', 'Set colour and type confidently'],
    blocks: [
      { t:'text', md:`**Previously:** You can structure a page with landmarks and build accessible forms with labelled inputs.

CSS answers one question: how should this look? Selectors and the box model cover 90% of styling.` },
      
      { t:'text', md:`**Previously:** You can structure a page with landmarks and build accessible forms with labelled inputs.

CSS answers one question: how should this look? Selectors and the box model cover 90% of styling.` },
      
      {
        t: 'text',
        md: `CSS answers one question: **how should this look?**

A rule has two parts — what to target, and what to change:

\`\`\`css
h1 {
  color: navy;
  font-size: 2rem;
}
\`\`\`

\`h1\` is the **selector**. Inside the braces are **declarations**, each \`property: value;\`.`,
      },
      {
        t: 'text',
        md: `## Selectors

| Selector | Targets |
|---|---|
| \`p\` | every \`<p>\` element |
| \`.card\` | every element with \`class="card"\` |
| \`#total\` | the one element with \`id="total"\` |
| \`.card p\` | every \`<p>\` **inside** a \`.card\` |
| \`a:hover\` | links, while the pointer is over them |

**Classes are the workhorse.** Use them for anything you want to style. Ids are for the one-off — and mostly for JavaScript to grab, as you will see later.`,
      },
      {
        t: 'web',
        md: 'Change `.card` to a different colour, or add `.card h3 { color: crimson; }` and watch it apply to both cards.',
        files: {
          html: `<h1>Selectors</h1>\n\n<div class="card">\n  <h3>First card</h3>\n  <p>Styled by the .card class.</p>\n</div>\n\n<div class="card highlight">\n  <h3>Second card</h3>\n  <p>This one has two classes.</p>\n</div>\n\n<p id="footnote">Styled by its id.</p>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  line-height: 1.6;\n}\n\n.card {\n  background: #f4f4f5;\n  border-radius: 10px;\n  padding: 1rem;\n  margin-bottom: 1rem;\n}\n\n.card h3 {\n  margin: 0 0 0.25rem;\n}\n\n.highlight {\n  background: #fef3c7;\n  border-left: 4px solid #f59e0b;\n}\n\n#footnote {\n  font-size: 0.8rem;\n  color: #71717a;\n}`,
          js: ``,
        },
      },
      {
        t: 'text',
        md: `## The box model

Every element is a rectangle made of four layers, from the inside out:

\`\`\`
        ┌─────────── margin ───────────┐
        │  ┌──────── border ────────┐  │
        │  │  ┌───── padding ────┐  │  │
        │  │  │     content      │  │  │
        │  │  └──────────────────┘  │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
\`\`\`

- **padding** — space *inside*, between content and border
- **border** — the line itself
- **margin** — space *outside*, pushing other elements away

The rule of thumb: **padding to give content room to breathe, margin to separate elements from each other.**`,
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'The one line every stylesheet should start with',
        md: `By default, setting \`width: 200px\` then adding padding makes the element *wider than 200px* — the padding is added on top. This surprises everybody.

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

This makes width mean **the whole visible box, padding and border included**, which is what you actually expect. Put it at the top of every stylesheet and never think about it again.`,
      },
      {
        t: 'web',
        md: 'The three boxes have identical content. Only the padding, border and margin differ.',
        files: {
          html: `<div class="box tight">padding: 0.25rem</div>\n<div class="box roomy">padding: 1.5rem</div>\n<div class="box spaced">margin-top: 2rem</div>`,
          css: `*, *::before, *::after { box-sizing: border-box; }\n\nbody {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n.box {\n  background: #e0f2fe;\n  border: 2px solid #0284c7;\n  border-radius: 8px;\n  margin-bottom: 0.5rem;\n}\n\n.tight  { padding: 0.25rem; }\n.roomy  { padding: 1.5rem; }\n.spaced { padding: 0.5rem; margin-top: 2rem; }`,
          js: ``,
        },
      },
      {
        t: 'text',
        md: `## Units, briefly

- \`px\` — fixed pixels. Fine for borders.
- \`rem\` — relative to the page's base font size. **Use this for spacing and type** — it respects the reader's own font-size setting.
- \`%\` — relative to the parent.
- \`fr\` — a share of leftover space (grid only).

One \`rem\` is 16px by default. So \`1.5rem\` is 24px, but it scales if someone has set a larger default.`,
      },
      {
        t: 'tryweb',
        prompt: `Style the card that is already in the HTML.

Give \`.card\` all of these:
- a \`padding\` of at least \`1rem\`
- a \`border-radius\` of at least \`8px\`
- a \`background\` that is not white or transparent

And make the \`.card h2\` colour something other than black.`,
        files: {
          html: `<div class="card">\n  <h2>Card title</h2>\n  <p>Some content inside the card.</p>\n</div>`,
          css: `*, *::before, *::after { box-sizing: border-box; }\n\nbody {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n.card {\n  /* your styles here */\n}\n\n.card h2 {\n  /* and here */\n}`,
          js: ``,
        },
        solution: {
          html: `<div class="card">\n  <h2>Card title</h2>\n  <p>Some content inside the card.</p>\n</div>`,
          css: `*, *::before, *::after { box-sizing: border-box; }\n\nbody {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n.card {\n  padding: 1.25rem;\n  border-radius: 12px;\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n}\n\n.card h2 {\n  color: #1e40af;\n  margin: 0 0 0.5rem;\n}`,
          js: ``,
        },
        hints: [
          'Write the declarations inside the .card { } braces, each ending with a semicolon.',
          'padding: 1.25rem; border-radius: 12px; background: #f1f5f9;',
          'For the heading: color: #1e40af;',
        ],
        checks: [
          { name: 'card has padding of at least 1rem', code: `const s = win.getComputedStyle(doc.querySelector('.card')); return parseFloat(s.paddingTop) >= 16;` },
          { name: 'card has rounded corners', code: `return parseFloat(win.getComputedStyle(doc.querySelector('.card')).borderTopLeftRadius) >= 8;` },
          {
            name: 'card has a visible background',
            code: `const bg = win.getComputedStyle(doc.querySelector('.card')).backgroundColor; return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)';`,
          },
          {
            name: 'heading is not plain black',
            code: `const c = win.getComputedStyle(doc.querySelector('.card h2')).color; return c !== 'rgb(0, 0, 0)';`,
          },
        ],
      },
      {
        t: 'quiz',
        q: 'You want space between the content and the edge of a bordered box. Which property?',
        options: ['margin', 'padding', 'border-spacing', 'gap'],
        answer: 1,
        why: 'Padding is the space inside the border. Margin sits outside it and pushes neighbouring elements away instead.',
      },
      {
            "t": "tryweb",
            "prompt": "Exercise 2: Style the `.box` element with: padding of at least 1rem, a border (at least 1px solid), and a background colour that is not white.",
            "files": {
                  "html": "<div class=\"box\">Styled box</div>",
                  "css": ".box {\n  /* your styles here */\n}",
                  "js": ""
            },
            "solution": {
                  "html": "<div class=\"box\">Styled box</div>",
                  "css": ".box {\n  padding: 1.25rem;\n  border: 2px solid #3b82f6;\n  background: #eff6ff;\n  border-radius: 8px;\n}",
                  "js": ""
            },
            "hints": [
                  "Add padding: 1.25rem; inside .box {}.",
                  "Add border: 2px solid #3b82f6;",
                  "Add background: #eff6ff;"
            ],
            "checks": [
                  {
                        "name": "has padding",
                        "code": "return parseFloat(win.getComputedStyle(doc.querySelector('.box')).paddingTop) >= 16;"
                  },
                  {
                        "name": "has border",
                        "code": "const s = win.getComputedStyle(doc.querySelector('.box')); return s.borderWidth !== '0px';"
                  },
                  {
                        "name": "has background",
                        "code": "const bg = win.getComputedStyle(doc.querySelector('.box')).backgroundColor; return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';"
                  }
            ]
      },

      { t:'text', md:`You can style elements. Next: Flexbox — arranging things without fighting the browser.` },

      { t:'text', md:`You can style elements. Next: Flexbox — arranging things without fighting the browser.` },

    ],
  },

  /* ==================================================== 4 */
  {
    id: 'web-l4',
    topic: 'css-layout',
    title: 'Layout With Flexbox',
    difficulty: 'beginner',
    minutes: 12,
    summary: 'Arranging things in a row or column without fighting the browser.',
    objectives: ['Lay out elements in a row or column', 'Align and distribute along both axes', 'Space items with gap'],
    blocks: [
      { t:'text', md:`**Previously:** You can target elements with selectors, control spacing with the box model, and set colours and type.

Flexbox replaced floats and clearfix hacks with properties that actually make sense.` },
      
      { t:'text', md:`**Previously:** You can target elements with selectors, control spacing with the box model, and set colours and type.

Flexbox replaced floats and clearfix hacks with properties that actually make sense.` },
      
      {
        t: 'text',
        md: `Laying things out used to be genuinely painful — floats, clearfix hacks, absolute positioning. **Flexbox** replaced all of it.

One line turns an element into a flex container, and its **direct children** become items arranged in a line:

\`\`\`css
.row {
  display: flex;
}
\`\`\``,
      },
      {
        t: 'web',
        md: 'Change `display: flex` to `display: block` and back to see what it is doing.',
        files: {
          html: `<div class="row">\n  <div class="item">One</div>\n  <div class="item">Two</div>\n  <div class="item">Three</div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n.row {\n  display: flex;\n  gap: 0.75rem;\n}\n\n.item {\n  background: #dbeafe;\n  border: 1px solid #60a5fa;\n  border-radius: 8px;\n  padding: 1rem;\n}`,
          js: ``,
        },
      },
      {
        t: 'text',
        md: `## The two axes

Flexbox thinks in terms of a **main axis** (the direction items flow) and a **cross axis** (across it).

With the default \`flex-direction: row\`, the main axis is horizontal.

- \`justify-content\` positions items **along the main axis**
- \`align-items\` positions them **across it**

That is the whole model. The confusion people have with flexbox is almost always forgetting which axis they are on.

| \`justify-content\` | Effect (in a row) |
|---|---|
| \`flex-start\` | bunched left (default) |
| \`center\` | centred |
| \`flex-end\` | bunched right |
| \`space-between\` | first hard left, last hard right, gaps even |
| \`space-around\` | even space around each |`,
      },
      {
        t: 'web',
        md: 'Each row uses a different `justify-content`. Change the values and watch them move.',
        files: {
          html: `<p class="label">flex-start</p>\n<div class="row start"><span>A</span><span>B</span><span>C</span></div>\n\n<p class="label">center</p>\n<div class="row center"><span>A</span><span>B</span><span>C</span></div>\n\n<p class="label">space-between</p>\n<div class="row between"><span>A</span><span>B</span><span>C</span></div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.25rem; }\n\n.label { font-size: 0.75rem; color: #64748b; margin: 0.75rem 0 0.25rem; font-family: monospace; }\n\n.row {\n  display: flex;\n  gap: 0.5rem;\n  background: #f8fafc;\n  border: 1px dashed #cbd5e1;\n  padding: 0.5rem;\n  border-radius: 8px;\n}\n\n.row span {\n  background: #1e293b;\n  color: white;\n  padding: 0.5rem 0.9rem;\n  border-radius: 6px;\n}\n\n.start   { justify-content: flex-start; }\n.center  { justify-content: center; }\n.between { justify-content: space-between; }`,
          js: ``,
        },
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Centring something, finally',
        md: `The old joke was that centring a box vertically was the hardest problem in CSS. Now:

\`\`\`css
.centre {
  display: flex;
  justify-content: center;   /* horizontally */
  align-items: center;       /* vertically */
}
\`\`\`

Three lines. Perfectly centred, at any size.`,
      },
      {
        t: 'text',
        md: `## gap, and flex-direction

Use \`gap\` for space between items — not margins on the children. It only applies *between* items, so you get no stray edge margins.

\`flex-direction: column\` stacks vertically instead. The axes swap with it: \`justify-content\` now works vertically, \`align-items\` horizontally.`,
      },
      {
        t: 'tryweb',
        prompt: `Turn \`.bar\` into a navigation bar.

- \`.bar\` must be a flex container
- its items must be pushed to opposite ends (brand left, links right) — use \`space-between\`
- items must be vertically centred
- \`.links\` must also be flex, with a \`gap\` of at least \`1rem\``,
        files: {
          html: `<div class="bar">\n  <strong class="brand">SiteName</strong>\n  <div class="links">\n    <a href="#">Home</a>\n    <a href="#">About</a>\n    <a href="#">Contact</a>\n  </div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; margin: 0; }\n\n.bar {\n  padding: 1rem 1.25rem;\n  background: #0f172a;\n  color: white;\n  /* make me a flex bar */\n}\n\n.links {\n  /* flex row with a gap */\n}\n\n.links a { color: #cbd5e1; text-decoration: none; }`,
          js: ``,
        },
        solution: {
          html: `<div class="bar">\n  <strong class="brand">SiteName</strong>\n  <div class="links">\n    <a href="#">Home</a>\n    <a href="#">About</a>\n    <a href="#">Contact</a>\n  </div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; margin: 0; }\n\n.bar {\n  padding: 1rem 1.25rem;\n  background: #0f172a;\n  color: white;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.links {\n  display: flex;\n  align-items: center;\n  gap: 1.25rem;\n}\n\n.links a { color: #cbd5e1; text-decoration: none; }`,
          js: ``,
        },
        hints: [
          'Add display: flex; to .bar first, then the alignment properties.',
          'justify-content: space-between; pushes the two children apart.',
          '.links needs its own display: flex; and gap: 1.25rem;',
        ],
        checks: [
          { name: '.bar is a flex container', code: `return win.getComputedStyle(doc.querySelector('.bar')).display === 'flex';` },
          { name: 'items pushed to opposite ends', code: `return win.getComputedStyle(doc.querySelector('.bar')).justifyContent === 'space-between';` },
          { name: 'items vertically centred', code: `return win.getComputedStyle(doc.querySelector('.bar')).alignItems === 'center';` },
          { name: '.links is flex with a gap', code: `const s = win.getComputedStyle(doc.querySelector('.links')); return s.display === 'flex' && parseFloat(s.columnGap || s.gap) >= 16;` },
          {
            name: 'brand really is left of the links',
            code: `const b = doc.querySelector('.brand').getBoundingClientRect(); const l = doc.querySelector('.links').getBoundingClientRect(); return b.right <= l.left + 1;`,
            hidden: true,
          },
        ],
      },
      {
        t: 'quiz',
        q: 'In a `flex-direction: row` container, which property centres items *vertically*?',
        options: ['justify-content: center', 'align-items: center', 'text-align: center', 'vertical-align: middle'],
        answer: 1,
        why: 'In a row, the main axis is horizontal (justify-content) and the cross axis is vertical (align-items). Switch to column and the two swap roles.',
      },
      {
            "t": "tryweb",
            "prompt": "Exercise 2: Make `.row` a flex container with its three items spaced evenly across the row. Use `display: flex`, `justify-content: space-evenly`, and `gap: 1rem`.",
            "files": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  /* your flex styles here */\n}",
                  "js": ""
            },
            "solution": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  display: flex;\n  justify-content: space-evenly;\n  gap: 1rem;\n}",
                  "js": ""
            },
            "hints": [
                  "display: flex; turns on flexbox.",
                  "justify-content: space-evenly; distributes items evenly.",
                  "gap: 1rem; adds space between them."
            ],
            "checks": [
                  {
                        "name": "is flex",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).display === 'flex';"
                  },
                  {
                        "name": "items spaced",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).justifyContent === 'space-evenly';"
                  }
            ]
      },

      { t:'text', md:`Flexbox handles one-dimensional layouts. Next: Grid — rows AND columns at the same time.` },

      { t:'text', md:`Flexbox handles one-dimensional layouts. Next: Grid — rows AND columns at the same time.` },

    ],
  },

  /* ==================================================== 5 */
  {
    id: 'web-l5',
    topic: 'javascript-basics',
    title: 'JavaScript Basics',
    difficulty: 'beginner',
    minutes: 13,
    summary: 'Variables, functions and types in the language that runs in every browser.',
    objectives: ['Declare variables with let and const', 'Write functions', 'Avoid the == trap'],
    blocks: [
      { t:'text', md:`**Previously:** You can lay out elements with Flexbox, control spacing with gap, and centre things with three lines of CSS.

HTML is structure, CSS is appearance. JavaScript is behaviour. If you have done the Python track, the ideas are the same.` },
      
      { t:'text', md:`**Previously:** You can lay out elements with Flexbox, control spacing with gap, and centre things with three lines of CSS.

HTML is structure, CSS is appearance. JavaScript is behaviour. If you have done the Python track, the ideas are the same.` },
      
      {
        t: 'text',
        md: `HTML is structure. CSS is appearance. **JavaScript is behaviour** — it makes a page *do* things.

If you have done the Python lessons, most of this will feel familiar. The ideas are the same; the punctuation differs.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'javascript',
        code: `const name = "Ada";\nlet score = 10;\n\nscore = score + 5;\n\nconsole.log(name);\nconsole.log(score);\nconsole.log(\`Hello, \${name} — you scored \${score}\`);`,
      },
      {
        t: 'text',
        md: `Differences from Python worth noting immediately:

- \`const\` and \`let\` **declare** a variable. \`const\` cannot be reassigned; \`let\` can.
- Statements end with a **semicolon**.
- \`console.log\` is the equivalent of \`print\`.
- Template strings use **backticks** and \`\${ }\` rather than \`f"{ }"\`.

**Default to \`const\`.** Use \`let\` only when you genuinely need to reassign. It makes accidental changes impossible and signals intent to whoever reads it next. (You may see \`var\` in old code — it has confusing scoping rules. Do not use it.)`,
      },
      {
        t: 'text',
        md: `## Functions

Two forms you will see constantly:

\`\`\`javascript
function double(n) {
  return n * 2;
}

const triple = (n) => n * 3;      // arrow function
\`\`\`

An arrow function with no braces returns its expression automatically. With braces you must write \`return\` yourself. Both are ordinary functions — arrows are just shorter, and are what you will use for small callbacks.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'javascript',
        code: `function double(n) {\n  return n * 2;\n}\n\nconst triple = (n) => n * 3;\n\nconsole.log(double(5));\nconsole.log(triple(5));\n\n// Arrays behave much like Python lists\nconst numbers = [1, 2, 3, 4];\nconsole.log(numbers.length);\nconsole.log(numbers.map(double));\nconsole.log(numbers.filter((n) => n % 2 === 0));`,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'Always use === , never ==',
        md: `JavaScript has two equality operators, and one of them is a trap.

\`\`\`javascript
0 == "0"      // true  (!)
0 == ""       // true  (!)
null == undefined  // true

0 === "0"     // false — correct
\`\`\`

\`==\` converts types before comparing, producing results almost nobody wants. \`===\` compares value **and** type.

**Rule: always \`===\` and \`!==\`.** There is no case in modern code where you need \`==\`.`,
      },
      {
        t: 'text',
        md: `## Objects

JavaScript's object is Python's dictionary, with nicer syntax for access:

\`\`\`javascript
const person = { name: "Ada", born: 1815 };

person.name          // "Ada"    — dot notation
person["born"]       // 1815     — bracket notation
person.job = "maths";  // add a key
\`\`\`

Dot notation when you know the key; brackets when the key is in a variable.`,
      },
      {
        t: 'code',
        run: true,
        lang: 'javascript',
        code: `const person = { name: "Ada", born: 1815 };\n\nconsole.log(person.name);\nconsole.log(person["born"]);\n\nperson.job = "mathematician";\nconsole.log(person);\n\n// Looping\nfor (const key of Object.keys(person)) {\n  console.log(key, "=", person[key]);\n}`,
      },
      {
        t: 'try',
        prompt: `Write a function \`initials(fullName)\` that returns uppercase initials joined by dots.

\`initials("ada lovelace")\` → \`"A.L."\`

Useful pieces:
- \`fullName.split(" ")\` gives an array of words
- \`word[0].toUpperCase()\` gives the capitalised first letter
- \`array.map(fn)\` transforms every item; \`array.join("")\` glues them back together

Or use a plain \`for...of\` loop — either is fine.`,
        lang: 'javascript',
        starter: `function initials(fullName) {\n  \n}\n`,
        solution: `function initials(fullName) {\n  return fullName\n    .split(" ")\n    .map((word) => word[0].toUpperCase() + ".")\n    .join("");\n}\n`,
        hints: [
          'Start with fullName.split(" ") to get the words.',
          'Use .map() to turn each word into its capital first letter plus a dot.',
          'Finish with .join("") so there is no separator added between them.',
        ],
        cases: [
          { name: 'two names', call: 'initials("ada lovelace")', expect: '"A.L."' },
          { name: 'three names', call: 'initials("grace brewster hopper")', expect: '"G.B.H."' },
          { name: 'single name', call: 'initials("plato")', expect: '"P."' },
        ],
      },
      {
        t: 'quiz',
        q: 'What does `0 == ""` evaluate to, and what should you use instead?',
        options: [
          'false — and `==` is fine',
          'true — because `==` converts types first; use `===` instead',
          'It throws an error',
          'true — and that is the desired behaviour',
        ],
        answer: 1,
        why: '`==` coerces both sides to a common type before comparing, so 0 and "" are considered equal. `===` compares type and value, and is what you should use everywhere.',
      },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `reverseWords(sentence)` that reverses the order of words in a sentence.\n\n`reverseWords(\"hello world\")` → `\"world hello\"`\n\nUse `.split(\" \")`, `.reverse()`, and `.join(\" \")`. Chain them.",
            "lang": "javascript",
            "starter": "function reverseWords(sentence) {\n  \n}\n",
            "solution": "function reverseWords(sentence) {\n  return sentence.split(\" \").reverse().join(\" \");\n}\n",
            "hints": [
                  ".split(\" \") turns the sentence into an array of words.",
                  ".reverse() reverses the array.",
                  ".join(\" \") glues them back with spaces."
            ],
            "cases": [
                  {
                        "name": "two words",
                        "call": "reverseWords(\"hello world\")",
                        "expect": "\"world hello\""
                  },
                  {
                        "name": "three words",
                        "call": "reverseWords(\"a b c\")",
                        "expect": "\"c b a\""
                  }
            ]
      },

      {
            "t": "debug",
            "prompt": "The `addNumbers` function below should add two numbers. But it has a classic JavaScript bug. Find and fix it.\n\nClue: what does `+` do when one side is a string?",
            "lang": "javascript",
            "starter": "function addNumbers(a, b) {\n  // BUG: input values from a form are strings!\n  return a + b;\n}\n",
            "solution": "function addNumbers(a, b) {\n  return Number(a) + Number(b);\n}\n",
            "bug_description": "When `a` or `b` comes from user input (e.g. a form field), it is a string. `\"2\" + \"3\"` gives `\"23\"`, not `5`. The fix: explicitly convert both to numbers with `Number()`.",
            "hints": [
                  "Use Number(a) to convert a string to a number.",
                  "Number(b) does the same for b.",
                  "Return Number(a) + Number(b)."
            ],
            "cases": [
                  {
                        "name": "two numbers",
                        "call": "addNumbers(\"2\", \"3\")",
                        "expect": "5"
                  },
                  {
                        "name": "floats",
                        "call": "addNumbers(\"1.5\", \"2.5\")",
                        "expect": "4"
                  }
            ]
      },

      { t:'text', md:`You can write functions and work with arrays. Next: making the page react — finding elements, listening for events, updating the DOM.` },

      { t:'text', md:`You can write functions and work with arrays. Next: making the page react — finding elements, listening for events, updating the DOM.` },

    ],
  },

  /* ==================================================== 6 */
  {
    id: 'web-l6',
    topic: 'javascript-dom',
    title: 'Making the Page React',
    difficulty: 'intermediate',
    minutes: 16,
    summary: 'Finding elements, listening for events, and changing the page — then building a working counter and to-do list.',
    objectives: ['Select elements from the page', 'Respond to clicks and typing', 'Update the page safely from data'],
    blocks: [
      { t:'text', md:`**Previously:** You can declare variables, write functions, avoid the loose-equality trap, and use array methods.

The DOM is a live tree of objects. JavaScript reads and changes it — and the page updates instantly. This is where static pages become applications.` },
      
      { t:'text', md:`**Previously:** You can declare variables, write functions, avoid the loose-equality trap, and use array methods.

The DOM is a live tree of objects. JavaScript reads and changes it — and the page updates instantly. This is where static pages become applications.` },
      
      {
        t: 'text',
        md: `The browser turns your HTML into a live tree of objects called the **DOM** (Document Object Model). JavaScript can read and change that tree, and the page updates instantly.

Three verbs cover almost everything:

1. **find** an element
2. **listen** for something happening
3. **change** something`,
      },
      {
        t: 'text',
        md: `## 1. Find

\`\`\`javascript
document.querySelector("#total")     // first match for a CSS selector
document.querySelectorAll(".item")   // all matches
\`\`\`

You already know how to write these — they are the same selectors as CSS.

## 2. Listen

\`\`\`javascript
button.addEventListener("click", () => {
  // runs every time the button is clicked
});
\`\`\`

## 3. Change

\`\`\`javascript
element.textContent = "New text";     // change the text
element.classList.add("active");      // add a class
element.classList.toggle("hidden");   // on/off
\`\`\``,
      },
      {
        t: 'web',
        md: 'A working counter — all three verbs in eight lines. Click the buttons, then try changing the step size in the JS.',
        files: {
          html: `<div class="counter">\n  <button id="down">−</button>\n  <output id="value">0</output>\n  <button id="up">+</button>\n</div>\n<p id="note"></p>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }\n\n.counter { display: flex; align-items: center; justify-content: center; gap: 1rem; }\n\nbutton {\n  width: 2.5rem; height: 2.5rem;\n  font-size: 1.25rem;\n  border: 1px solid #cbd5e1;\n  background: white;\n  border-radius: 8px;\n  cursor: pointer;\n}\n\nbutton:hover { background: #f1f5f9; }\n\noutput { font-size: 2rem; font-variant-numeric: tabular-nums; min-width: 3rem; }\n\n#note { color: #64748b; font-size: 0.85rem; }`,
          js: `let count = 0;\n\nconst value = document.querySelector("#value");\nconst note = document.querySelector("#note");\n\nfunction render() {\n  value.textContent = count;\n  note.textContent = count === 0 ? "" : count > 0 ? "positive" : "negative";\n}\n\ndocument.querySelector("#up").addEventListener("click", () => {\n  count = count + 1;\n  render();\n});\n\ndocument.querySelector("#down").addEventListener("click", () => {\n  count = count - 1;\n  render();\n});\n\nrender();`,
        },
      },
      {
        t: 'note',
        tone: 'why',
        title: 'The pattern that matters: state, then render',
        md: `Look at the structure of that counter:

- \`count\` is the **state** — the single source of truth
- \`render()\` draws the page **from** that state
- the click handlers change the state, then call \`render()\`

They never poke at the page directly. This is the central idea behind React, Vue, Svelte and every other framework you will meet — and it works perfectly well without one.

The alternative — updating the page in six different places — produces bugs where parts of the screen disagree with each other. Change the data, redraw from the data.`,
      },
      {
        t: 'text',
        md: `## Building elements

To add new things, create them, set their content, and attach them:

\`\`\`javascript
const item = document.createElement("li");
item.textContent = userInput;
list.appendChild(item);
\`\`\``,
      },
      {
        t: 'note',
        tone: 'warn',
        title: 'textContent, not innerHTML',
        md: `\`innerHTML\` interprets what you give it as **HTML**. Put user-typed text through it and someone can type in a \`<script>\` tag that your page will happily run. That is a real, extremely common security hole called XSS.

\`textContent\` treats everything as plain text. **Use it for anything a person typed.** Reach for \`innerHTML\` only with markup you wrote yourself.`,
      },
      {
        t: 'case',
        title: 'Case study — a working to-do list',
        md: `Everything together: state in an array, one \`render\` function, event delegation for the delete buttons.

Note the single click listener on the \`<ul>\` rather than one per button. Buttons are created and destroyed constantly as the list re-renders — a listener on each would have to be re-attached every time. One listener on the parent catches clicks from any child, forever. That is **event delegation**.

Add some items, delete a middle one, and watch the numbering stay correct.`,
        files: {
          html: `<h2>To-do</h2>\n\n<form id="form">\n  <input id="input" placeholder="What needs doing?" autocomplete="off">\n  <button type="submit">Add</button>\n</form>\n\n<ul id="list"></ul>\n<p id="count">0 items</p>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 26rem; }\n\nform { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\n\ninput { flex: 1; padding: 0.5rem 0.7rem; border: 1px solid #cbd5e1; border-radius: 6px; font: inherit; }\n\nbutton { padding: 0.5rem 0.9rem; border: 0; border-radius: 6px; background: #0f172a; color: white; cursor: pointer; font: inherit; }\n\nul { list-style: none; padding: 0; }\n\nli { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }\n\nli button { background: none; color: #dc2626; padding: 0.2rem 0.4rem; }\n\n#count { color: #64748b; font-size: 0.85rem; }`,
          js: `const form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\nconst count = document.querySelector("#count");\n\n// THE STATE — the single source of truth\nlet todos = [];\n\nfunction render() {\n  list.innerHTML = "";\n\n  todos.forEach((text, index) => {\n    const item = document.createElement("li");\n\n    const label = document.createElement("span");\n    label.textContent = text;          // safe: plain text\n\n    const remove = document.createElement("button");\n    remove.textContent = "delete";\n    remove.dataset.index = index;\n\n    item.append(label, remove);\n    list.appendChild(item);\n  });\n\n  count.textContent = todos.length + (todos.length === 1 ? " item" : " items");\n}\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();            // stop the page reloading\n  const text = input.value.trim();\n  if (!text) return;                 // ignore empty input\n  todos.push(text);\n  input.value = "";\n  render();\n});\n\n// ONE listener for every delete button, now and in the future\nlist.addEventListener("click", (event) => {\n  const button = event.target.closest("button");\n  if (!button) return;\n  todos.splice(Number(button.dataset.index), 1);\n  render();\n});\n\nrender();`,
        },
      },
      {
        t: 'note',
        tone: 'tip',
        title: 'Why `event.preventDefault()`?',
        md: `A \`<form>\` element's default behaviour is to submit to a server and **reload the page** — wiping out all your JavaScript state.

\`event.preventDefault()\` cancels that so you can handle it yourself. Forget this one line and your to-do list will appear to clear itself the instant you press Add. It is one of the most common "why is my app broken" moments in beginner front-end work.`,
      },
      {
        t: 'tryweb',
        prompt: `Make the button work.

When \`#toggle\` is clicked, the \`#box\` element should gain the class \`active\`. Clicking again should remove it — so it toggles on and off.

\`classList.toggle("active")\` does exactly this in one call.`,
        files: {
          html: `<button id="toggle">Toggle</button>\n<div id="box">Box</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n#box {\n  margin-top: 1rem;\n  padding: 2rem;\n  background: #e2e8f0;\n  border-radius: 10px;\n  transition: background 200ms;\n}\n\n#box.active {\n  background: #86efac;\n}\n\nbutton { padding: 0.5rem 1rem; cursor: pointer; }`,
          js: `const toggle = document.querySelector("#toggle");\nconst box = document.querySelector("#box");\n\n// Add your listener here\n`,
        },
        solution: {
          html: `<button id="toggle">Toggle</button>\n<div id="box">Box</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n#box {\n  margin-top: 1rem;\n  padding: 2rem;\n  background: #e2e8f0;\n  border-radius: 10px;\n  transition: background 200ms;\n}\n\n#box.active {\n  background: #86efac;\n}\n\nbutton { padding: 0.5rem 1rem; cursor: pointer; }`,
          js: `const toggle = document.querySelector("#toggle");\nconst box = document.querySelector("#box");\n\ntoggle.addEventListener("click", () => {\n  box.classList.toggle("active");\n});\n`,
        },
        hints: [
          'Use toggle.addEventListener("click", () => { ... });',
          'Inside the arrow function, call box.classList.toggle("active");',
          'Do not add the class in CSS — the JavaScript must add it at click time.',
        ],
        checks: [
          { name: 'box starts without the class', code: `return !doc.querySelector('#box').classList.contains('active');` },
          { name: 'one click adds the class', code: `doc.querySelector('#toggle').click(); await sleep(30); return doc.querySelector('#box').classList.contains('active');` },
          {
            name: 'a second click removes it again',
            code: `const t = doc.querySelector('#toggle'); t.click(); await sleep(20); t.click(); await sleep(30); return !doc.querySelector('#box').classList.contains('active');`,
          },
          {
            name: 'the background actually changes',
            code: `const before = win.getComputedStyle(doc.querySelector('#box')).backgroundColor; doc.querySelector('#toggle').click(); await sleep(60); const after = win.getComputedStyle(doc.querySelector('#box')).backgroundColor; return before !== after;`,
            hidden: true,
          },
        ],
      },
      {
        t: 'quiz',
        q: 'Why attach one click listener to the `<ul>` instead of one to each delete button?',
        options: [
          'It uses less memory only',
          'Buttons are recreated on every render, so per-button listeners would need re-attaching each time; a parent listener catches clicks from children that do not exist yet',
          'Buttons cannot have click listeners',
          'It makes the clicks faster',
        ],
        answer: 1,
        why: 'This is event delegation. Clicks bubble up to the parent, so a single listener there handles every current and future child — no re-attaching after a re-render.',
      },
      {
            "t": "tryweb",
            "prompt": "Exercise 2: Make the button show/hide the box. When clicked, toggle the `hidden` class on `#box`. Use `classList.toggle(\"hidden\")`. The CSS for `.hidden` is already written — you only write the JavaScript.",
            "files": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\n// Add your click listener here\n"
            },
            "solution": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\ntoggle.addEventListener(\"click\", () => {\n  box.classList.toggle(\"hidden\");\n});\n"
            },
            "hints": [
                  "toggle.addEventListener(\"click\", () => { ... });",
                  "Inside the arrow function: box.classList.toggle(\"hidden\");",
                  "No if statement needed — toggle does it."
            ],
            "checks": [
                  {
                        "name": "box starts visible",
                        "code": "return !doc.querySelector('#box').classList.contains('hidden');"
                  },
                  {
                        "name": "click hides it",
                        "code": "doc.querySelector('#toggle').click(); await sleep(30); return doc.querySelector('#box').classList.contains('hidden');"
                  }
            ]
      },

      { t:'text', md:`You can make the page interactive. Next: fetching data from servers — the bridge to the outside world.` },

      { t:'text', md:`You can make the page interactive. Next: fetching data from servers — the bridge to the outside world.` },

    ],
  },

  /* ==================================================== 7 */
  {
    id: 'web-l7',
    topic: 'html-fundamentals',
    difficulty: 'advanced',
    title: 'Forms, Validation and Accessibility',
    minutes: 14,
    summary: 'Building robust forms — client-side validation, accessible labels, fieldset grouping, and error messages.',
    objectives: ['Build an accessible form with proper labels', 'Use HTML5 validation attributes', 'Provide descriptive error messages'],
    blocks: [
      { t: 'text', md: 'Forms are how people interact with your site. A well-built form is accessible, validated and clear about errors.\n\nKey practices:\n- Every input has a `<label>` with a matching `for`/`id`\n- Use `<fieldset>` + `<legend>` to group related fields\n- HTML5 validation (`required`, `type="email"`, `minlength`) gives instant feedback with no JavaScript\n- Error messages should be descriptive: "Password must be at least 8 characters", not "Invalid input"' },
      {
        t: 'web',
        md: 'A registration form with validation, fieldset grouping and accessible error messages.',
        files: {
          html: `<form id="signup" novalidate>\n  <fieldset>\n    <legend>Account</legend>\n\n    <div class="field">\n      <label for="email">Email address</label>\n      <input id="email" type="email" name="email" required\n             placeholder="you@example.com"\n             aria-describedby="email-hint">\n      <span id="email-hint" class="hint">We will never share your email.</span>\n      <span class="error" id="email-error" hidden></span>\n    </div>\n\n    <div class="field">\n      <label for="password">Password</label>\n      <input id="password" type="password" name="password"\n             required minlength="8"\n             aria-describedby="pw-hint">\n      <span id="pw-hint" class="hint">At least 8 characters, with a number.</span>\n      <span class="error" id="pw-error" hidden></span>\n    </div>\n  </fieldset>\n\n  <button type="submit">Create account</button>\n  <p id="summary" class="success" hidden></p>\n</form>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 28rem; }\nfieldset { border: 1px solid #d1d5db; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }\nlegend { font-weight: 700; padding: 0 0.5rem; }\n.field { margin-bottom: 1rem; }\nlabel { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }\ninput { width: 100%; padding: 0.55rem 0.7rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; }\ninput:focus { outline: 2px solid #3b82f6; outline-offset: 1px; }\n.hint { font-size: 0.78rem; color: #6b7280; }\n.error { font-size: 0.78rem; color: #dc2626; font-weight: 600; }\n.success { color: #16a34a; font-weight: 600; } button { padding: 0.6rem 1.4rem; background: #111; color: #fff; border: none; border-radius: 6px; font: inherit; cursor: pointer; }`,
          js: `const form = document.querySelector("#signup");\n\nconst showError = (id, msg) => {\n  const el = document.querySelector("#" + id);\n  el.textContent = msg;\n  el.hidden = !msg;\n};\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  let valid = true;\n  const email = form.email.value.trim();\n  const pw = form.password.value;\n\n  if (!email || !email.includes("@")) {\n    showError("email-error", "Please enter a valid email address.");\n    valid = false;\n  } else { showError("email-error", ""); }\n\n  if (pw.length < 8) {\n    showError("pw-error", "Password must be at least 8 characters.");\n    valid = false;\n  } else if (!/\\d/.test(pw)) {\n    showError("pw-error", "Password must include at least one number.");\n    valid = false;\n  } else { showError("pw-error", ""); }\n\n  if (valid) {\n    document.querySelector("#summary").hidden = false;\n    document.querySelector("#summary").textContent = "Account created!";\n  }\n});`,
        },
      },
      {
        t: 'case',
        title: 'Case study — a checkout form with address validation',
        md: 'A multi-field checkout form using fieldset grouping, real-time validation on blur, and a summary that only appears when all fields are valid. The pattern of building an errors object and checking it on every event is how production forms work.',
        files: {
          html: `<form id="checkout">\n  <fieldset>\n    <legend>Shipping address</legend>\n    <div class="field">\n      <label for="name">Full name</label>\n      <input id="name" name="name" required>\n      <span class="error" id="name-error"></span>\n    </div>\n    <div class="field">\n      <label for="postcode">Postcode</label>\n      <input id="postcode" name="postcode" required>\n      <span class="error" id="postcode-error"></span>\n    </div>\n  </fieldset>\n  <button type="submit">Place order</button>\n  <p id="order-summary" class="success"></p>\n</form>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 28rem; }\nfieldset { border: 1px solid #d1d5db; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }\nlegend { font-weight: 700; }\n.field { margin-bottom: 0.75rem; }\nlabel { display: block; font-size: 0.85rem; font-weight: 600; }\ninput { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; }\ninput:focus { outline: 2px solid #3b82f6; outline-offset: 1px; }\n.error { font-size: 0.78rem; color: #dc2626; display: block; min-height: 1.2em; }\n.success { color: #16a34a; font-weight: 600; }\nbutton { padding: 0.6rem 1.4rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; }`,
          js: `const nameInput = document.querySelector("#name");\nconst postcodeInput = document.querySelector("#postcode");\nconst nameErr = document.querySelector("#name-error");\nconst pcErr = document.querySelector("#postcode-error");\nconst summary = document.querySelector("#order-summary");\n\nconst errors = { name: "", postcode: "" };\n\nconst validateName = () => {\n  const v = nameInput.value.trim();\n  errors.name = v ? "" : "Name is required";\n  nameErr.textContent = errors.name;\n};\n\nconst validatePostcode = () => {\n  const v = postcodeInput.value.trim().toUpperCase();\n  errors.postcode = /^[A-Z0-9]{2,4}\\s?[A-Z0-9]{3}$/.test(v)\n    ? "" : "Enter a valid postcode (e.g. SW1A 1AA)";\n  pcErr.textContent = errors.postcode;\n};\n\nnameInput.addEventListener("blur", validateName);\npostcodeInput.addEventListener("blur", validatePostcode);\n\ndocument.querySelector("#checkout").addEventListener("submit", (e) => {\n  e.preventDefault();\n  validateName();\n  validatePostcode();\n  if (!errors.name && !errors.postcode) {\n    summary.textContent = "Order placed! Shipping to " + nameInput.value + ", " + postcodeInput.value.toUpperCase();\n  }\n});`,
        },
      },
      {
        t: 'tryweb',
        prompt: 'Add a `required` attribute and a `<label>` to the email input so the form does not submit empty.',
        files: { html: `<form id="f">\n  <input id="email" type="email">\n  <button type="submit">Go</button>\n</form>`, css: '', js: `document.querySelector("#f").addEventListener("submit", e => { e.preventDefault(); });` },
        solution: { html: `<form id="f">\n  <label for="email">Email</label>\n  <input id="email" type="email" required>\n  <button type="submit">Go</button>\n</form>`, css: '', js: `document.querySelector("#f").addEventListener("submit", e => { e.preventDefault(); });` },
        hints: ['Add <label for="email"> before the input.', 'Add the required attribute to the input.', 'The for must match the id.'],
        checks: [
          { name: 'has a label', code: `return !!doc.querySelector('label[for="email"]');` },
          { name: 'input is required', code: `return doc.querySelector('#email').hasAttribute('required');` },
        ],
      },
      { t: 'quiz', q: 'Why should error messages describe what is needed rather than just saying "invalid"?', options: ['They look nicer', '"Must be at least 8 characters" tells the user how to fix it. "Invalid" leaves them guessing', 'Screen readers require it', 'It saves bandwidth'], answer: 1, why: 'Actionable error messages reduce frustration. "Password needs a number" tells the user what to do; "invalid input" does not.' },
      {
        t: 'tryweb',
        prompt: 'Add a `minlength="6"` attribute and a `required` attribute to the username input so the browser validates before submitting.',
        files: { html: `<form id="f">\n  <label for="user">Username</label>\n  <input id="user" type="text">\n  <button type="submit">Go</button>\n</form>`, css: '', js: `document.querySelector("#f").addEventListener("submit", e => { e.preventDefault(); });` },
        solution: { html: `<form id="f">\n  <label for="user">Username</label>\n  <input id="user" type="text" required minlength="6">\n  <button type="submit">Go</button>\n</form>`, css: '', js: `document.querySelector("#f").addEventListener("submit", e => { e.preventDefault(); });` },
        hints: ['Add required to the input.', 'Add minlength="6" — the browser will block short entries.', 'Use the HTML attributes; no JavaScript needed.'],
        checks: [
          { name: 'input is required', code: `return doc.querySelector('#user').hasAttribute('required');` },
          { name: 'input has minlength', code: `return doc.querySelector('#user').getAttribute('minlength') === '6';` },
        ],
      },

    ],
  },

  /* ==================================================== 8 */
  {
    id: 'web-l8',
    topic: 'css-styling',
    difficulty: 'intermediate',
    title: 'Custom Properties and Theming',
    minutes: 12,
    summary: 'CSS custom properties (variables), building a theme system, and the cascade in practice.',
    objectives: ['Define and use custom properties', 'Create a light/dark theme toggle', 'Override properties in components'],
    blocks: [
      { t: 'text', md: '**CSS custom properties** (variables) let you define values once and reuse them. Unlike preprocessor variables, they are live — change one at runtime and every element that uses it updates instantly.\n\n```css\n:root {\n  --color-primary: #3b82f6;\n  --spacing: 1rem;\n}\n\n.card {\n  padding: var(--spacing);\n  border: 2px solid var(--color-primary);\n}\n```\n\nThis makes theming trivial: define colours at `:root`, override them under a `[data-theme="dark"]` selector.' },
      {
        t: 'web',
        md: 'Click the button to toggle between light and dark themes. The entire colour scheme changes by swapping a handful of custom properties on :root.',
        files: {
          html: `<h1>Theme demo</h1>\n<p>This card changes colour when you toggle the theme.</p>\n<div class="card">\n  <h2>Card title</h2>\n  <p>Card content goes here. Colours are driven by custom properties.</p>\n</div>\n<button id="toggle">Toggle theme</button>`,
          css: `:root {\n  --bg: #ffffff;\n  --text: #111827;\n  --card-bg: #f3f4f6;\n  --card-border: #d1d5db;\n  --accent: #3b82f6;\n}\n\n[data-theme="dark"] {\n  --bg: #111827;\n  --text: #f9fafb;\n  --card-bg: #1f2937;\n  --card-border: #374151;\n  --accent: #60a5fa;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  background: var(--bg);\n  color: var(--text);\n  padding: 2rem;\n  transition: background 200ms, color 200ms;\n}\n\n.card {\n  background: var(--card-bg);\n  border: 1px solid var(--card-border);\n  border-radius: 10px;\n  padding: 1.25rem;\n  margin: 1rem 0;\n}\n\n.card h2 { color: var(--accent); }\n\nbutton {\n  padding: 0.5rem 1rem;\n  border: 1px solid var(--card-border);\n  background: var(--card-bg);\n  color: var(--text);\n  border-radius: 6px;\n  cursor: pointer;\n  font: inherit;\n}`,
          js: `let dark = false;\ndocument.querySelector("#toggle").addEventListener("click", () => {\n  dark = !dark;\n  document.documentElement.setAttribute("data-theme", dark ? "dark" : "");\n  document.querySelector("#toggle").textContent = dark ? "Light theme" : "Dark theme";\n});`,
        },
      },
      {
        t: 'case',
        title: 'Case study — a design token system for a component library',
        md: 'A card component that accepts a `data-variant` attribute to change its appearance — info, success, warning, error. Each variant is defined by overriding a handful of custom properties. The component CSS never changes; only the tokens do.',
        files: {
          html: `<div class="card" data-variant="info">\n  <h3>Information</h3>\n  <p>This is an informational message.</p>\n</div>\n\n<div class="card" data-variant="success">\n  <h3>Success</h3>\n  <p>Operation completed successfully.</p>\n</div>\n\n<div class="card" data-variant="warning">\n  <h3>Warning</h3>\n  <p>Your storage is almost full.</p>\n</div>\n\n<div class="card" data-variant="error">\n  <h3>Error</h3>\n  <p>Something went wrong. Please try again.</p>\n</div>`,
          css: `.card {\n  --card-accent: #3b82f6;\n  --card-bg: #eff6ff;\n  --card-text: #1e3a5f;\n\n  border-left: 4px solid var(--card-accent);\n  background: var(--card-bg);\n  color: var(--card-text);\n  padding: 1rem 1.25rem;\n  border-radius: 8px;\n  margin-bottom: 0.75rem;\n  font-family: system-ui, sans-serif;\n}\n\n.card[data-variant="success"] { --card-accent: #16a34a; --card-bg: #f0fdf4; --card-text: #14532d; }\n.card[data-variant="warning"] { --card-accent: #eab308; --card-bg: #fefce8; --card-text: #713f12; }\n.card[data-variant="error"]   { --card-accent: #dc2626; --card-bg: #fef2f2; --card-text: #7f1d1d; }\n\n.card h3 { margin: 0 0 0.25rem; }\n.card p  { margin: 0; font-size: 0.95rem; }`,
          js: ``,
        },
      },
      { t: 'quiz', q: 'How do CSS custom properties differ from SASS/LESS variables?', options: ['They are identical', 'CSS custom properties are live in the browser — they respect the cascade, can be changed at runtime with JS, and update all dependents instantly. Preprocessor variables are static after compilation', 'SASS variables are live, CSS ones are static', 'CSS properties only work in dark mode'], answer: 1, why: 'CSS custom properties are part of the live DOM/CSSOM. Changing one via JS or a media query instantly updates every element using it. Preprocessor variables vanish after compilation.' },
      {
        t: 'tryweb',
        prompt: 'Define a custom property `--accent` on `:root` set to `#3b82f6`, then use it as the colour of `.card h2`.',
        files: { html: `<div class="card">\n  <h2>Card Title</h2>\n  <p>Content</p>\n</div>`, css: `:root {\n  /* define --accent here */\n}\n\n.card h2 {\n  /* use var(--accent) here */\n}`, js: `` },
        solution: { html: `<div class="card">\n  <h2>Card Title</h2>\n  <p>Content</p>\n</div>`, css: `:root {\n  --accent: #3b82f6;\n}\n\n.card h2 {\n  color: var(--accent);\n}`, js: `` },
        hints: ['Define --accent: #3b82f6; under :root.', 'Use var(--accent) as the value for color.', 'Custom properties always start with --.'],
        checks: [
          { name: 'accent is defined', code: `return win.getComputedStyle(doc.documentElement).getPropertyValue('--accent').trim() === '#3b82f6';` },
        ],
      },

    ],
  },

  /* ==================================================== 9 */
  {
    id: 'web-l9',
    topic: 'css-styling',
    difficulty: 'advanced',
    title: 'Animations and Transitions',
    minutes: 13,
    summary: 'CSS transitions for micro-interactions, keyframe animations for more complex motion, and prefers-reduced-motion.',
    objectives: ['Animate with transitions', 'Define keyframe animations', 'Respect the prefers-reduced-motion media query'],
    blocks: [
      { t: 'text', md: '**Transitions** smooth changes between states. **Keyframe animations** define multi-step sequences independent of state changes.\n\n```css\n/* Transition: smoothly animate any change to opacity */\n.fade { transition: opacity 200ms ease; }\n.fade.hidden { opacity: 0; }\n\n/* Keyframes: a looping pulse */\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%      { transform: scale(1.05); }\n}\n.loading { animation: pulse 1.5s infinite; }\n```\n\n**Always wrap animations in `@media (prefers-reduced-motion: no-preference)`** — some users experience vertigo or nausea from motion.' },
      {
        t: 'web',
        md: 'Hovering triggers a transition. The loading spinner uses a keyframe animation. The motion is disabled when the user prefers reduced motion.',
        files: {
          html: `<h2>Hover for transition</h2>\n<button class="grow-btn">Hover me</button>\n\n<h2 style="margin-top:2rem">Loading spinner</h2>\n<div class="spinner"></div>\n\n<h2 style="margin-top:2rem">Notification</h2>\n<div class="toast" id="toast">Item saved!</div>\n<button id="show-toast">Show toast</button>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; }\n\n.grow-btn {\n  padding: 0.6rem 1.4rem;\n  background: #3b82f6; color: #fff; border: none;\n  border-radius: 8px; font: inherit; cursor: pointer;\n  transition: transform 150ms ease, box-shadow 150ms ease;\n}\n.grow-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }\n\n@media (prefers-reduced-motion: no-preference) {\n  @keyframes spin { to { transform: rotate(360deg); } }\n\n  .spinner {\n    width: 2.5rem; height: 2.5rem;\n    border: 3px solid #e5e7eb;\n    border-top-color: #3b82f6;\n    border-radius: 50%;\n    animation: spin 0.6s linear infinite;\n  }\n\n  @keyframes slide-in {\n    from { transform: translateX(100%); opacity: 0; }\n    to   { transform: translateX(0);    opacity: 1; }\n  }\n\n  .toast {\n    position: fixed; top: 1rem; right: 1rem;\n    background: #111; color: #fff;\n    padding: 0.75rem 1.25rem; border-radius: 8px;\n    animation: slide-in 300ms ease;\n    display: none;\n  }\n}\n\n.toast.visible { display: block; }\n\n@media (prefers-reduced-motion: reduce) {\n  .spinner { display: none; }\n  .toast { display: none; }\n}`,
          js: `document.querySelector("#show-toast").addEventListener("click", () => {\n  const toast = document.querySelector("#toast");\n  toast.classList.add("visible");\n  setTimeout(() => toast.classList.remove("visible"), 2000);\n});`,
        },
      },
      {
        t: 'case',
        title: 'Case study — a modal dialog with enter/exit animations',
        md: 'A modal that fades in its backdrop and slides up its panel on open, and reverses on close. The `prefers-reduced-motion` query disables animations entirely — the modal still appears, just instantly.',
        files: {
          html: `<button id="open-modal">Open modal</button>\n\n<div class="backdrop" id="backdrop" hidden>\n  <div class="modal" role="dialog" aria-labelledby="modal-title">\n    <h2 id="modal-title">Confirm</h2>\n    <p>Are you sure you want to delete this item?</p>\n    <div class="modal-actions">\n      <button class="btn-cancel" id="close-modal">Cancel</button>\n      <button class="btn-danger" id="confirm-delete">Delete</button>\n    </div>\n  </div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; }\n\nbutton { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; font: inherit; }\n\n.backdrop {\n  position: fixed; inset: 0;\n  background: rgba(0,0,0,0.4);\n  display: grid; place-items: center;\n  opacity: 0; transition: opacity 200ms ease;\n}\n.backdrop.open { opacity: 1; }\n\n.modal {\n  background: #fff; border-radius: 12px; padding: 1.5rem;\n  max-width: 24rem; width: 90%;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.2);\n  transform: translateY(20px);\n  transition: transform 200ms ease;\n}\n.backdrop.open .modal { transform: translateY(0); }\n\n.modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; }\n.btn-cancel { background: #f3f4f6; }\n.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }\n\n@media (prefers-reduced-motion: reduce) {\n  .backdrop, .modal { transition: none; }\n}`,
          js: `const backdrop = document.querySelector("#backdrop");\n\ndocument.querySelector("#open-modal").addEventListener("click", () => {\n  backdrop.hidden = false;\n  requestAnimationFrame(() => backdrop.classList.add("open"));\n});\n\ndocument.querySelector("#close-modal").addEventListener("click", () => {\n  backdrop.classList.remove("open");\n  backdrop.addEventListener("transitionend", () => { backdrop.hidden = true; }, { once: true });\n});\n\ndocument.querySelector("#confirm-delete").addEventListener("click", () => {\n  alert("Deleted!");\n  backdrop.classList.remove("open");\n  backdrop.addEventListener("transitionend", () => { backdrop.hidden = true; }, { once: true });\n});`,
        },
      },
      { t: 'quiz', q: 'Why check `prefers-reduced-motion` before adding animations?', options: ['It is faster', 'Some users have vestibular disorders where motion causes dizziness or nausea. Respecting this preference is an accessibility requirement', 'Browsers block animations otherwise', 'It saves CPU'], answer: 1, why: 'WCAG 2.3.3 requires respecting the user\'s motion preference. Animations should be non-essential — the content must still be accessible without them.' },
      {
        t: 'tryweb',
        prompt: 'Add a `transition` to `.btn` so the background colour changes smoothly over 200ms on hover. The hover colour is already set — you only add the transition.',
        files: { html: `<button class="btn">Hover me</button>`, css: `.btn {\n  padding: 0.75rem 1.5rem;\n  border: none;\n  background: #3b82f6;\n  color: #fff;\n  border-radius: 8px;\n  cursor: pointer;\n  font: inherit;\n  /* add transition here */\n}\n\n.btn:hover {\n  background: #1d4ed8;\n}`, js: `` },
        solution: { html: `<button class="btn">Hover me</button>`, css: `.btn {\n  padding: 0.75rem 1.5rem;\n  border: none;\n  background: #3b82f6;\n  color: #fff;\n  border-radius: 8px;\n  cursor: pointer;\n  font: inherit;\n  transition: background 200ms ease;\n}\n\n.btn:hover {\n  background: #1d4ed8;\n}`, js: `` },
        hints: ['transition: background 200ms ease;', 'The property to animate is background.', '200ms is a sensible micro-interaction duration.'],
        checks: [
          { name: 'has transition', code: `return win.getComputedStyle(doc.querySelector('.btn')).transitionProperty !== 'all';` },
        ],
      },

    ],
  },

  /* ==================================================== 10 */
  {
    id: 'web-l10',
    topic: 'css-layout',
    difficulty: 'beginner',
    title: 'Grid Layout',
    minutes: 13,
    summary: 'CSS Grid — the two-dimensional layout system for rows and columns. The modern way to build page layouts.',
    objectives: ['Define a grid container', 'Place items with grid-template-columns', 'Use fr units and gap'],
    blocks: [
      { t: 'text', md: '**CSS Grid** is for two-dimensional layouts — rows AND columns at the same time. While Flexbox is for one-dimensional arrangements (a row OR a column), Grid handles both axes.\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: 1rem;\n}\n```\n\nThe `fr` unit means "fraction of available space". `1fr 2fr 1fr` creates three columns with the middle one twice as wide.' },
      {
        t: 'web',
        md: 'A classic page layout — header, sidebar, main content, footer — in few lines of CSS. Resize the preview to see the responsive behaviour.',
        files: {
          html: `<div class="layout">\n  <header class="header">Header</header>\n  <nav class="sidebar">\n    <p>Sidebar</p>\n    <ul><li>Home</li><li>About</li><li>Contact</li></ul>\n  </nav>\n  <main class="content">\n    <h2>Main content</h2>\n    <p>This area expands to fill available space.</p>\n  </main>\n  <footer class="footer">Footer</footer>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; margin: 0; padding: 1rem; }\n\n.layout {\n  display: grid;\n  grid-template-areas:\n    "head  head"\n    "side  main"\n    "foot  foot";\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 0.75rem;\n  min-height: 60vh;\n}\n\n.header  { grid-area: head; background: #1e293b; color: #fff; padding: 1rem; border-radius: 8px; }\n.sidebar { grid-area: side; background: #f1f5f9; padding: 1rem; border-radius: 8px; }\n.content { grid-area: main; background: #f8fafc; padding: 1rem; border-radius: 8px; }\n.footer  { grid-area: foot; background: #e2e8f0; padding: 1rem; border-radius: 8px; text-align: center; }\n\nul { list-style: none; padding: 0; }\nli { padding: 0.35rem 0; }\n\n@media (max-width: 600px) {\n  .layout {\n    grid-template-areas: "head" "main" "side" "foot";\n    grid-template-columns: 1fr;\n  }\n}`,
          js: ``,
        },
      },
      {
        t: 'case',
        title: 'Case study — a responsive image gallery',
        md: 'A gallery that auto-fits as many columns as will fit, with a minimum column width. `auto-fill` and `minmax` do the heavy lifting — no media queries needed. The masonry-like layout adapts to any screen size.',
        files: {
          html: `<h1>Image Gallery</h1>\n<div class="gallery">\n  <div class="card">1</div>\n  <div class="card">2</div>\n  <div class="card">3</div>\n  <div class="card">4</div>\n  <div class="card">5</div>\n  <div class="card">6</div>\n  <div class="card">7</div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\nh1 { margin-bottom: 1rem; }\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  gap: 1rem;\n}\n\n.card {\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  padding: 3rem 1rem;\n  text-align: center;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #64748b;\n  transition: box-shadow 150ms ease;\n}\n\n.card:hover {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}`,
          js: ``,
        },
      },
      {
        t: 'tryweb',
        prompt: 'Make `.cards` a grid with 3 equal columns and a gap of 1rem.',
        files: { html: `<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>`, css: `.card { background: #e0f2fe; padding: 2rem; text-align: center; border-radius: 8px; }\n\n.cards { /* your grid here */ }`, js: `` },
        solution: { html: `<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>`, css: `.card { background: #e0f2fe; padding: 2rem; text-align: center; border-radius: 8px; }\n\n.cards {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n}`, js: `` },
        hints: ['Add display: grid; to .cards.', 'Use grid-template-columns: 1fr 1fr 1fr; for 3 equal columns.', 'Set gap: 1rem; for spacing.'],
        checks: [
          { name: 'is a grid', code: `return win.getComputedStyle(doc.querySelector('.cards')).display === 'grid';` },
          { name: 'has 3 columns', code: `return win.getComputedStyle(doc.querySelector('.cards')).gridTemplateColumns.split(' ').length === 3;` },
        ],
      },
      { t: 'quiz', q: 'What is the difference between `auto-fill` and `auto-fit` in grid?', options: ['They are identical', 'auto-fill creates as many tracks as fit, leaving empty ones. auto-fit collapses empty tracks so existing items stretch to fill the space', 'auto-fill is deprecated', 'auto-fit only works in Firefox'], answer: 1, why: 'auto-fill keeps empty column tracks, preserving the grid structure. auto-fit collapses them, letting items expand. Use auto-fill for galleries where you want consistent column widths.' },
      {
        t: 'tryweb',
        prompt: 'Make `.cards` a grid with 2 equal columns and a gap of 1rem.',
        files: { html: `<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n  <div class="card">D</div>\n</div>`, css: `.card { background: #e0f2fe; padding: 2rem; border-radius: 8px; }\n\n.cards {\n  /* your grid here */\n}`, js: `` },
        solution: { html: `<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n  <div class="card">D</div>\n</div>`, css: `.card { background: #e0f2fe; padding: 2rem; border-radius: 8px; }\n\n.cards {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}`, js: `` },
        hints: ['display: grid; activates grid layout.', 'grid-template-columns: 1fr 1fr; creates two equal columns.', 'gap: 1rem; adds spacing between items.'],
        checks: [
          { name: 'is a grid', code: `return win.getComputedStyle(doc.querySelector('.cards')).display === 'grid';` },
        ],
      },

    ],
  },

  /* ==================================================== 11 */
  {
    id: 'web-l11',
    topic: 'css-layout',
    difficulty: 'intermediate',
    title: 'Responsive Design',
    minutes: 13,
    summary: 'Media queries, mobile-first design, responsive images, and the viewport meta tag.',
    objectives: ['Write mobile-first media queries', 'Use responsive image techniques', 'Design layouts that work on any screen'],
    blocks: [
      { t: 'text', md: '**Responsive design** means your site works on a phone, tablet and desktop — without separate versions. The tools: media queries, flexible grids, and relative units.\n\n```css\n/* Mobile-first: base styles are for small screens */\n.card { padding: 1rem; }\n\n/* Tablet and up */\n@media (min-width: 768px) {\n  .card { padding: 2rem; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .gallery { grid-template-columns: repeat(3, 1fr); }\n}\n```\n\nAlways use `min-width` (mobile-first), not `max-width` (desktop-first). The base styles should be the smallest-screen version.' },
      {
        t: 'web',
        md: 'Resize the preview to see the layout change at 600px and 900px breakpoints. The card grid goes from 1→2→3 columns.',
        files: {
          html: `<h1>Responsive cards</h1>\n<div class="grid">\n  <div class="card"><h3>Card 1</h3><p>Resize to see the layout adapt.</p></div>\n  <div class="card"><h3>Card 2</h3><p>Mobile-first means base styles are for phones.</p></div>\n  <div class="card"><h3>Card 3</h3><p>Media queries add columns for larger screens.</p></div>\n  <div class="card"><h3>Card 4</h3><p>No JavaScript needed for layout.</p></div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n\n@media (min-width: 600px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 900px) {\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}\n\n.card {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 1.25rem;\n}\n\n.card h3 { margin: 0 0 0.5rem; }\n.card p { margin: 0; font-size: 0.9rem; color: #475569; }`,
          js: ``,
        },
      },
      {
        t: 'case',
        title: 'Case study — a responsive dashboard',
        md: 'A dashboard with stats cards, a chart area, and a recent activity list. On mobile the layout stacks vertically; on desktop it uses a complex grid. The key: the HTML is identical across breakpoints — only the CSS grid template changes.',
        files: {
          html: `<div class="dashboard">\n  <div class="stat">Revenue<br><strong>$12,430</strong></div>\n  <div class="stat">Users<br><strong>1,842</strong></div>\n  <div class="stat">Orders<br><strong>347</strong></div>\n  <div class="chart">Chart area</div>\n  <div class="activity">\n    <h3>Recent activity</h3>\n    <ul><li>Ada placed order #1082</li><li>Grace signed up</li><li>Alan upgraded plan</li></ul>\n  </div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1rem; background: #f1f5f9; }\n\n.dashboard {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-areas: "stats" "chart" "activity";\n  gap: 1rem;\n}\n\n.stats-row { display: grid; grid-template-columns: 1fr; gap: 0.75rem; grid-area: stats; }\n\n.stat {\n  background: #fff;\n  padding: 1rem;\n  border-radius: 10px;\n  text-align: center;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.08);\n  font-size: 0.85rem; color: #64748b;\n}\n.stat strong { display: block; font-size: 1.5rem; color: #111; }\n\n.chart {\n  background: #fff;\n  padding: 2rem;\n  border-radius: 10px;\n  text-align: center;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.08);\n  grid-area: chart;\n  min-height: 120px; display: grid; place-items: center; color: #94a3b8;\n}\n\n.activity {\n  background: #fff;\n  padding: 1.25rem;\n  border-radius: 10px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.08);\n  grid-area: activity;\n}\n.activity h3 { margin: 0 0 0.75rem; font-size: 0.95rem; }\n.activity ul { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #475569; }\n.activity li { padding: 0.25rem 0; }\n\n@media (min-width: 600px) {\n  .dashboard {\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-areas:\n      "stats   stats   stats"\n      "chart   chart   activity";\n  }\n  .stats-row { grid-template-columns: repeat(3, 1fr); }\n}`,
          js: `// Wrap stat cards for layout\nconst stats = document.querySelectorAll('.stat');\nconst row = document.createElement('div');\nrow.className = 'stats-row';\nstats.forEach(s => row.appendChild(s));\ndocument.querySelector('.dashboard').prepend(row);`,
        },
      },
      { t: 'quiz', q: 'Why use `min-width` (mobile-first) media queries instead of `max-width` (desktop-first)?', options: ['It is shorter', 'Mobile-first means the base styles are the simplest version — small screen. You add complexity with min-width breakpoints for larger screens. Desktop-first means you write complex styles and then override them for mobile, which is backwards', 'min-width is faster', 'max-width is deprecated'], answer: 1, why: 'Mobile-first aligns with progressive enhancement: start simple, add as the screen grows. Desktop-first leads to fighting against your own styles on small screens.' },
      {
        t: 'tryweb',
        prompt: 'Add a media query that changes `.banner` to have a `font-size` of `2rem` when the viewport is at least 600px wide. Base size is 1.25rem.',
        files: { html: `<div class="banner">Welcome</div>`, css: `.banner {\n  font-size: 1.25rem;\n  text-align: center;\n  padding: 1rem;\n  background: #f1f5f9;\n  border-radius: 8px;\n}\n\n/* Add a min-width media query here */\n`, js: `` },
        solution: { html: `<div class="banner">Welcome</div>`, css: `.banner {\n  font-size: 1.25rem;\n  text-align: center;\n  padding: 1rem;\n  background: #f1f5f9;\n  border-radius: 8px;\n}\n\n@media (min-width: 600px) {\n  .banner { font-size: 2rem; }\n}`, js: `` },
        hints: ['Use @media (min-width: 600px).', 'Inside the media query, target .banner again.', 'Set font-size: 2rem; inside the query.'],
        checks: [
          { name: 'has media query', code: `return [...doc.styleSheets].some(s => [...s.cssRules || []].some(r => r instanceof CSSMediaRule));` },
        ],
      },

    ],
  },

  /* ==================================================== 12 */
  {
    id: 'web-l12',
    topic: 'javascript-basics',
    difficulty: 'intermediate',
    title: 'Arrays, Objects and Destructuring',
    minutes: 12,
    summary: 'Array methods beyond push/pop, the spread operator, and destructuring for cleaner code.',
    objectives: ['Use map, filter, reduce on arrays', 'Spread and rest with ...', 'Destructure objects and arrays'],
    blocks: [
      { t: 'text', md: 'Modern JavaScript has powerful tools for working with data. The three you will use daily:\n\n- **Destructuring**: unpack values from objects/arrays into variables\n- **Spread (...)** : copy/merge objects and arrays\n- **Array methods**: map (transform), filter (keep), reduce (aggregate), find (locate)' },
      { t: 'code', run: true, lang: 'javascript', code: `// Destructuring\nconst person = { name: "Ada", age: 36, job: "engineer" };\nconst { name, age } = person;\nconsole.log(name, age);\n\nconst colors = ["red", "green", "blue"];\nconst [first, , third] = colors;\nconsole.log(first, third);\n\n// Spread\nconst defaults = { theme: "light", fontSize: 14 };\nconst userPrefs = { fontSize: 16 };\nconst merged = { ...defaults, ...userPrefs };\nconsole.log(merged);\n\n// Array methods\nconst nums = [1, 2, 3, 4, 5];\nconsole.log(nums.map(n => n * 2));\nconsole.log(nums.filter(n => n % 2 === 0));\nconsole.log(nums.reduce((sum, n) => sum + n, 0));` },
      {
        t: 'case',
        title: 'Case study — transforming API data for display',
        md: 'An API returns raw data (snake_case, nested, with extra fields). Before rendering, transform it with map + destructuring into the shape your UI expects. The transformation is pure — no mutation of the original data.',
        run: true,
        lang: 'javascript',
        code: `// Raw API response\nconst apiResponse = {\n  users: [\n    { user_id: 1, full_name: "Ada Lovelace", email_addr: "ada@example.com", _internal: "x" },\n    { user_id: 2, full_name: "Grace Hopper", email_addr: "grace@example.com", _internal: "y" },\n  ],\n  total: 42,\n};\n\n// Transform to UI shape\nconst display = {\n  users: apiResponse.users.map(({ user_id, full_name, email_addr }) => ({\n    id: user_id,\n    name: full_name,\n    email: email_addr,\n    initials: full_name.split(" ").map(w => w[0]).join("."),\n  })),\n};\n\nconsole.log(display.users);\n\n// Group by first letter\nconst grouped = display.users.reduce((acc, user) => {\n  const letter = user.name[0];\n  acc[letter] = [...(acc[letter] || []), user.name];\n  return acc;\n}, {});\nconsole.log("Grouped:", grouped);`,
      },
      { t: 'try', prompt: 'Write `sumEvenSquares(numbers)` returning the sum of squares of even numbers. Use filter, map and reduce.', lang: 'javascript', starter: `function sumEvenSquares(numbers) {\n  \n}\n`, solution: `function sumEvenSquares(numbers) {\n  return numbers\n    .filter(n => n % 2 === 0)\n    .map(n => n * n)\n    .reduce((sum, n) => sum + n, 0);\n}\n`, hints: ['filter out odds first.', 'map each to its square.', 'reduce with (sum, n) => sum + n, starting at 0.'], cases: [{ name: 'sums', call: 'sumEvenSquares([1, 2, 3, 4])', expect: '20' }] },
      { t: 'quiz', q: 'What does `const { name, email } = user` do?', options: ['Creates a new object', 'Destructures the user object — creates local constants name and email with user.name and user.email', 'Deletes name and email', 'It is invalid syntax'], answer: 1, why: 'Object destructuring extracts properties by name into variables. It is the inverse of object construction.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `reverseWords(sentence)` that reverses the order of words in a sentence.\n\n`reverseWords(\"hello world\")` → `\"world hello\"`\n\nUse `.split(\" \")`, `.reverse()`, and `.join(\" \")`. Chain them.",
            "lang": "javascript",
            "starter": "function reverseWords(sentence) {\n  \n}\n",
            "solution": "function reverseWords(sentence) {\n  return sentence.split(\" \").reverse().join(\" \");\n}\n",
            "hints": [
                  ".split(\" \") turns the sentence into an array of words.",
                  ".reverse() reverses the array.",
                  ".join(\" \") glues them back with spaces."
            ],
            "cases": [
                  {
                        "name": "two words",
                        "call": "reverseWords(\"hello world\")",
                        "expect": "\"world hello\""
                  },
                  {
                        "name": "three words",
                        "call": "reverseWords(\"a b c\")",
                        "expect": "\"c b a\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 13 */
  {
    id: 'web-l13',
    topic: 'javascript-basics',
    difficulty: 'advanced',
    title: 'Modules and Tooling',
    minutes: 14,
    summary: 'ES modules — import/export, default vs named exports, and an overview of the modern JS toolchain.',
    objectives: ['Export and import functions between files', 'Distinguish default from named exports', 'Understand bundlers at a high level'],
    blocks: [
      { t: 'text', md: 'ES modules let you split code across files. Each file is a module; it exports what others may use and imports what it needs.\n\n```js\n// utils.js\nexport function formatPrice(p) { return "£" + p.toFixed(2); }\nexport const TAX_RATE = 0.2;\n\n// main.js\nimport { formatPrice, TAX_RATE } from "./utils.js";\n```\n\n**Default exports** are for "the main thing this module provides". **Named exports** are for utilities. A module can have one default export and many named exports.' },
      { t: 'code', run: true, lang: 'javascript', code: `// Simulating modules in a single file for the playground\n// In real code these would be separate files with import/export\n\n// --- math.js (named exports) ---\nconst add = (a, b) => a + b;\nconst multiply = (a, b) => a * b;\n\n// --- logger.js (default export) ---\nconst createLogger = (prefix) => (msg) => console.log(\`[\${prefix}] \${msg}\`);\n\n// --- app.js (imports both) ---\nconst log = createLogger("app");\nlog(\`add(2, 3) = \${add(2, 3)}\`);\nlog(\`multiply(4, 5) = \${multiply(4, 5)}\`);` },
      {
        t: 'case',
        title: 'Case study — a mini app split into modules',
        md: 'A to-do app with three modules: `store.js` (state management), `render.js` (DOM updates), and `app.js` (wires them together). Each module has a single responsibility. This is the pattern behind every framework — they just automate the wiring.',
        files: {
          html: `<form id="form">\n  <input id="input" placeholder="What needs doing?" autocomplete="off">\n  <button type="submit">Add</button>\n</form>\n<ul id="list"></ul>\n<p id="count">0 items</p>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 26rem; }\nform { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\ninput { flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; }\nbutton { padding: 0.5rem 0.9rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; }\nul { list-style: none; padding: 0; }\nli { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb; }\nli button { background: none; color: #dc2626; padding: 0.2rem 0.4rem; }`,
          js: `// --- store.js ---\nconst Store = {\n  todos: [],\n  listeners: [],\n\n  add(text) {\n    this.todos = [...this.todos, { text, done: false }];\n    this.notify();\n  },\n\n  remove(index) {\n    this.todos = this.todos.filter((_, i) => i !== index);\n    this.notify();\n  },\n\n  subscribe(fn) {\n    this.listeners.push(fn);\n  },\n\n  notify() {\n    this.listeners.forEach(fn => fn(this.todos));\n  },\n};\n\n// --- render.js ---\nconst Render = {\n  render(todos) {\n    const list = document.querySelector("#list");\n    const count = document.querySelector("#count");\n\n    list.innerHTML = todos\n      .map((t, i) => \`<li><span>\${t.text}</span><button data-index="\${i}">x</button></li>\`)\n      .join("");\n\n    count.textContent = \`\${todos.length} item\${todos.length !== 1 ? "s" : ""}\`;\n  },\n};\n\n// --- app.js ---\nconst form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\n\nStore.subscribe(Render.render);\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const text = input.value.trim();\n  if (!text) return;\n  Store.add(text);\n  input.value = "";\n});\n\nlist.addEventListener("click", (e) => {\n  const btn = e.target.closest("button");\n  if (!btn) return;\n  Store.remove(Number(btn.dataset.index));\n});\n\nRender.render(Store.todos);`,
        },
      },
      { t: 'quiz', q: 'What is the difference between default and named exports?', options: ['They are identical', 'Default: one per module, imported without braces (`import foo from "./mod"`). Named: many per module, imported with braces (`import { a, b } from "./mod"`)', 'Default exports are deprecated', 'Named exports only work in Node'], answer: 1, why: 'Default exports are for "the thing" a module provides. Named exports let a module expose multiple utilities. Both can coexist in one module.' },
      {
            "t": "try",
            "prompt": "Exercise 1: Write `reverseWords(sentence)` that reverses the order of words in a sentence.\n\n`reverseWords(\"hello world\")` → `\"world hello\"`\n\nUse `.split(\" \")`, `.reverse()`, and `.join(\" \")`. Chain them.",
            "lang": "javascript",
            "starter": "function reverseWords(sentence) {\n  \n}\n",
            "solution": "function reverseWords(sentence) {\n  return sentence.split(\" \").reverse().join(\" \");\n}\n",
            "hints": [
                  ".split(\" \") turns the sentence into an array of words.",
                  ".reverse() reverses the array.",
                  ".join(\" \") glues them back with spaces."
            ],
            "cases": [
                  {
                        "name": "two words",
                        "call": "reverseWords(\"hello world\")",
                        "expect": "\"world hello\""
                  },
                  {
                        "name": "three words",
                        "call": "reverseWords(\"a b c\")",
                        "expect": "\"c b a\""
                  }
            ]
      },

      {
            "t": "try",
            "prompt": "Exercise 2: Write `reverseWords(sentence)` that reverses the order of words in a sentence.\n\n`reverseWords(\"hello world\")` → `\"world hello\"`\n\nUse `.split(\" \")`, `.reverse()`, and `.join(\" \")`. Chain them.",
            "lang": "javascript",
            "starter": "function reverseWords(sentence) {\n  \n}\n",
            "solution": "function reverseWords(sentence) {\n  return sentence.split(\" \").reverse().join(\" \");\n}\n",
            "hints": [
                  ".split(\" \") turns the sentence into an array of words.",
                  ".reverse() reverses the array.",
                  ".join(\" \") glues them back with spaces."
            ],
            "cases": [
                  {
                        "name": "two words",
                        "call": "reverseWords(\"hello world\")",
                        "expect": "\"world hello\""
                  },
                  {
                        "name": "three words",
                        "call": "reverseWords(\"a b c\")",
                        "expect": "\"c b a\""
                  }
            ]
      },

    ],
  },

  /* ==================================================== 14 */
  {
    id: 'web-l14',
    topic: 'javascript-dom',
    difficulty: 'intermediate',
    title: 'State Management Without a Framework',
    minutes: 14,
    summary: 'The state-render pattern, event delegation, and building a reactive UI with vanilla JavaScript.',
    objectives: ['Implement a state → render loop', 'Use event delegation for dynamic elements', 'Manage form state cleanly'],
    blocks: [
      { t: 'text', md: 'The central idea of every front-end framework is: **keep your state in one place, and re-render the DOM from that state whenever it changes**. You do not need React to do this.\n\n```js\nlet state = { count: 0 };\n\nfunction render() {\n  document.querySelector("#value").textContent = state.count;\n}\n\nfunction increment() {\n  state = { ...state, count: state.count + 1 };\n  render();\n}\n```\n\nNever update the DOM directly from event handlers. Change the state, then call render(). This single rule eliminates the most common class of UI bugs.' },
      {
        t: 'case',
        title: 'Case study — a filterable, sortable data table',
        md: 'A table of data that can be filtered by search text and sorted by clicking column headers. The state holds the raw data, current sort key/direction, and filter text. `render()` derives the displayed rows from state — the source data is never mutated.',
        files: {
          html: `<input id="search" placeholder="Filter..." autocomplete="off">\n<table>\n  <thead>\n    <tr><th data-sort="name">Name</th><th data-sort="score">Score</th><th data-sort="level">Level</th></tr>\n  </thead>\n  <tbody id="tbody"></tbody>\n</table>\n<p id="info"></p>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 30rem; }\ninput { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; margin-bottom: 1rem; }\ntable { width: 100%; border-collapse: collapse; }\nth { text-align: left; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; cursor: pointer; user-select: none; }\nth:hover { background: #f1f5f9; }\ntd { padding: 0.45rem 0.5rem; border-bottom: 1px solid #f1f5f9; }\n#info { font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; }`,
          js: `const DATA = [\n  { name: "Ada",   score: 250, level: 4 },\n  { name: "Grace", score: 310, level: 5 },\n  { name: "Alan",  score: 180, level: 3 },\n  { name: "Zoe",   score: 250, level: 2 },\n  { name: "Bob",   score: 310, level: 6 },\n];\n\nlet state = { sortKey: "name", sortDir: 1, filter: "" };\n\nfunction render() {\n  const { sortKey, sortDir, filter } = state;\n  let rows = DATA.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()));\n  rows.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);\n\n  const tbody = document.querySelector("#tbody");\n  tbody.innerHTML = rows.map(r => \`<tr><td>\${r.name}</td><td>\${r.score}</td><td>\${r.level}</td></tr>\`).join("");\n  document.querySelector("#info").textContent = \`\${rows.length} of \${DATA.length} rows\`;\n\n  document.querySelectorAll("th").forEach(th => {\n    th.textContent = th.dataset.sort + (th.dataset.sort === sortKey ? (sortDir === 1 ? " ^" : " v") : "");\n  });\n}\n\ndocument.querySelector("#search").addEventListener("input", e => {\n  state = { ...state, filter: e.target.value };\n  render();\n});\n\ndocument.querySelector("thead").addEventListener("click", e => {\n  const th = e.target.closest("[data-sort]");\n  if (!th) return;\n  const key = th.dataset.sort;\n  state = { ...state, sortKey: key, sortDir: state.sortKey === key ? -state.sortDir : 1 };\n  render();\n});\n\nrender();`,
        },
      },
      { t: 'quiz', q: 'Why separate state from the DOM and re-render?', options: ['It is faster', 'When the DOM is a pure function of state, you never have parts of the screen that disagree with each other. Change the data, redraw. Debugging becomes: is the state wrong, or is the render wrong?', 'The DOM requires it', 'It works without HTML'], answer: 1, why: 'The state→render pattern gives you a single source of truth. You can inspect state at any moment and know exactly what the screen should look like. Framework or not, this is the architecture.' },
      {
            "t": "tryweb",
            "prompt": "Exercise 1: Make the button show/hide the box. When clicked, toggle the `hidden` class on `#box`. Use `classList.toggle(\"hidden\")`. The CSS for `.hidden` is already written — you only write the JavaScript.",
            "files": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\n// Add your click listener here\n"
            },
            "solution": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\ntoggle.addEventListener(\"click\", () => {\n  box.classList.toggle(\"hidden\");\n});\n"
            },
            "hints": [
                  "toggle.addEventListener(\"click\", () => { ... });",
                  "Inside the arrow function: box.classList.toggle(\"hidden\");",
                  "No if statement needed — toggle does it."
            ],
            "checks": [
                  {
                        "name": "box starts visible",
                        "code": "return !doc.querySelector('#box').classList.contains('hidden');"
                  },
                  {
                        "name": "click hides it",
                        "code": "doc.querySelector('#toggle').click(); await sleep(30); return doc.querySelector('#box').classList.contains('hidden');"
                  }
            ]
      },

      {
            "t": "tryweb",
            "prompt": "Exercise 2: Make the button show/hide the box. When clicked, toggle the `hidden` class on `#box`. Use `classList.toggle(\"hidden\")`. The CSS for `.hidden` is already written — you only write the JavaScript.",
            "files": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\n// Add your click listener here\n"
            },
            "solution": {
                  "html": "<button id=\"toggle\">Show/Hide</button>\n<div id=\"box\">Content</div>",
                  "css": ".hidden { display: none; }",
                  "js": "const toggle = document.querySelector(\"#toggle\");\nconst box = document.querySelector(\"#box\");\n\ntoggle.addEventListener(\"click\", () => {\n  box.classList.toggle(\"hidden\");\n});\n"
            },
            "hints": [
                  "toggle.addEventListener(\"click\", () => { ... });",
                  "Inside the arrow function: box.classList.toggle(\"hidden\");",
                  "No if statement needed — toggle does it."
            ],
            "checks": [
                  {
                        "name": "box starts visible",
                        "code": "return !doc.querySelector('#box').classList.contains('hidden');"
                  },
                  {
                        "name": "click hides it",
                        "code": "doc.querySelector('#toggle').click(); await sleep(30); return doc.querySelector('#box').classList.contains('hidden');"
                  }
            ]
      },

      {
            "t": "refactor",
            "prompt": "The `renderList` function below updates the DOM by building an HTML string and setting `innerHTML`. Refactor it to use `document.createElement` and `textContent` instead — this is safer (prevents XSS) and avoids re-parsing the entire list on every update.",
            "lang": "javascript",
            "starter": "function renderList(items, listElement) {\n  // Works but uses innerHTML — refactor to use createElement\n  listElement.innerHTML = items.map((t, i) =>\n    '<li>' + t + '<button data-index=\"' + i + '\">x</button></li>'\n  ).join('');\n}\n",
            "solution": "function renderList(items, listElement) {\n  listElement.innerHTML = '';\n  items.forEach((text, i) => {\n    const li = document.createElement('li');\n    const span = document.createElement('span');\n    span.textContent = text;\n    const btn = document.createElement('button');\n    btn.textContent = 'x';\n    btn.dataset.index = i;\n    li.append(span, btn);\n    listElement.appendChild(li);\n  });\n}\n",
            "hints": [
                  "Clear the list: listElement.innerHTML = \"\";.",
                  "For each item, create li, span, and button with createElement.",
                  "Use textContent (not innerHTML) to set text — it prevents XSS.",
                  "Use dataset.index = i to store the index on the button."
            ],
            "cases": [
                  {
                        "name": "renders items",
                        "call": "__renderTest([\"a\",\"b\"])",
                        "expect": "2"
                  }
            ],
            "preamble": "function __renderTest(items) {\n    const ul = { innerHTML: '' };\n    const mock = {\n      innerHTML: '',\n      appendChild: function(el) { this._children = this._children || []; this._children.push(el); },\n      querySelectorAll: function() { return []; },\n    };\n    try { renderList(items, mock); return items.length; } catch(e) { return -1; }\n}\n"
      },

    ],
  },

  /* ==================================================== 15 */
  {
    id: 'web-l15',
    topic: 'javascript-dom',
    difficulty: 'advanced',
    title: 'Custom Elements and Shadow DOM',
    minutes: 15,
    summary: 'Web Components — custom elements, the shadow DOM, and building reusable encapsulated widgets.',
    objectives: ['Define a custom element', 'Use the shadow DOM for style encapsulation', 'Handle attributes and lifecycle'],
    blocks: [
      { t: 'text', md: '**Web Components** let you define your own HTML elements with encapsulated behaviour and styling. Three technologies:\n1. **Custom Elements** — register new HTML tags\n2. **Shadow DOM** — scoped DOM tree with its own styles\n3. **Templates & slots** — reusable markup with placeholders' },
      {
        t: 'web',
        md: 'A custom `<counter-display>` element. It is a self-contained widget — its styles do not leak out, and external styles do not leak in. Use it like any HTML element.',
        files: {
          html: `<h2>Counter widget (Web Component)</h2>\n<counter-display label="Likes"></counter-display>\n\n<h2 style="margin-top:2rem">Another instance</h2>\n<counter-display label="Shares" start="5"></counter-display>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\nh2 { font-size: 1rem; color: #64748b; }`,
          js: `class CounterDisplay extends HTMLElement {\n  constructor() {\n    super();\n    this._count = parseInt(this.getAttribute("start")) || 0;\n    const label = this.getAttribute("label") || "Counter";\n\n    const shadow = this.attachShadow({ mode: "open" });\n    shadow.innerHTML = \`\n      <style>\n        .wrapper {\n          display: inline-flex; align-items: center; gap: 0.75rem;\n          font-family: system-ui, sans-serif;\n          background: #f1f5f9; border-radius: 10px; padding: 0.75rem 1.25rem;\n        }\n        .label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }\n        .value { font-size: 1.5rem; font-weight: 700; }\n        button {\n          width: 2rem; height: 2rem; border: 1px solid #cbd5e1;\n          background: #fff; border-radius: 6px; cursor: pointer; font-size: 1rem;\n        }\n      </style>\n      <div class="wrapper">\n        <button class="decr">-</button>\n        <div><span class="label">\${label}</span><br><span class="value">\${this._count}</span></div>\n        <button class="incr">+</button>\n      </div>\n    \`;\n\n    const update = () => shadow.querySelector(".value").textContent = this._count;\n    shadow.querySelector(".incr").addEventListener("click", () => { this._count++; update(); });\n    shadow.querySelector(".decr").addEventListener("click", () => { this._count--; update(); });\n  }\n}\n\ncustomElements.define("counter-display", CounterDisplay);`,
        },
      },
      {
        t: 'case',
        title: 'Case study — a rating stars custom element',
        md: 'A `<star-rating>` element that displays 5 stars and lets the user click to set a rating. Its internal state and styling are fully encapsulated in the shadow DOM. Multiple instances on the same page are independent.',
        files: {
          html: `<h3>Rate this course</h3>\n<star-rating></star-rating>\n<p id="rating-out"></p>\n\n<h3 style="margin-top:2rem">Rate this instructor</h3>\n<star-rating max="7" id="instructor-rating"></star-rating>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\nh3 { margin-bottom: 0.25rem; }`,
          js: `class StarRating extends HTMLElement {\n  constructor() {\n    super();\n    const max = parseInt(this.getAttribute("max")) || 5;\n    let selected = 0;\n\n    const shadow = this.attachShadow({ mode: "open" });\n\n    const render = () => {\n      shadow.innerHTML = \`\n        <style>\n          .stars { display: flex; gap: 0.25rem; }\n          .star { font-size: 1.5rem; cursor: pointer; color: #d1d5db; transition: color 100ms; border: none; background: none; padding: 0; }\n          .star.filled { color: #f59e0b; }\n        </style>\n        <div class="stars">\n          \${Array.from({ length: max }, (_, i) =>\n            \`<button class="star \${i < selected ? 'filled' : ''}" data-index="\${i}">&#9733;</button>\`\n          ).join("")}\n        </div>\n      \`;\n\n      shadow.querySelectorAll(".star").forEach(btn => {\n        btn.addEventListener("click", () => {\n          selected = parseInt(btn.dataset.index) + 1;\n          render();\n          this.dispatchEvent(new CustomEvent("change", { detail: selected }));\n        });\n      });\n    };\n    render();\n  }\n}\n\ncustomElements.define("star-rating", StarRating);\n\ndocument.querySelector("#instructor-rating").addEventListener("change", e => {\n  document.querySelector("#rating-out").textContent = "Rating: " + e.detail;\n});`,
        },
      },
      { t: 'quiz', q: 'What problem does the Shadow DOM solve?', options: ['It makes pages load faster', 'It encapsulates styles and DOM structure — CSS inside a shadow tree cannot leak out, and external CSS cannot leak in. This is the key to truly reusable components', 'It replaces the regular DOM', 'It is only for animations'], answer: 1, why: 'Shadow DOM gives each component its own isolated DOM and style scope. You can use simple class names without worrying about collisions with the rest of the page.' },
      {
        t: 'try',
        prompt: `Write a function \`defineGreeting()\` that registers a custom element \`<hello-world>\` which displays "Hello, World!" in its shadow DOM.

Use \`customElements.define()\` and \`attachShadow({mode: "open"})\`. Set the shadow's \`innerHTML\` to \`<p>Hello, World!</p>\`.`,
        lang: 'javascript',
        starter: `function defineGreeting() {\n  \n}\n`,
        solution: `function defineGreeting() {\n  class HelloWorld extends HTMLElement {\n    constructor() {\n      super();\n      const shadow = this.attachShadow({ mode: "open" });\n      shadow.innerHTML = "<p>Hello, World!</p>";\n    }\n  }\n  customElements.define("hello-world", HelloWorld);\n}\n`,
        hints: [
          'Create a class that extends HTMLElement.',
          'In the constructor, call super() and attach a shadow root.',
          'Set shadow.innerHTML, then register with customElements.define.',
        ],
        cases: [{ name: 'registers', call: '__test_define(defineGreeting)', expect: 'true' }],
        preamble: `function __test_define(fn) {\n    fn();\n    return customElements.get("hello-world") !== undefined;\n}\n`,
      },

    ],
  },

  /* ==================================================== 16 */
  {
    id: 'web-l16',
    topic: 'javascript-async',
    difficulty: 'beginner',
    title: 'Promises and fetch',
    minutes: 12,
    summary: 'Calling APIs with fetch, handling Promises with .then(), and dealing with loading and error states.',
    objectives: ['Fetch data from an API', 'Handle a Promise with .then/.catch', 'Display loading and error states'],
    blocks: [
      { t: 'text', md: '**`fetch()`** is the browser\'s built-in way to make HTTP requests. It returns a **Promise** — an object that represents a value that will be available later.\n\n```js\nfetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Failed:", error));\n```\n\nA Promise has three states: **pending** (still waiting), **fulfilled** (got the value), **rejected** (something went wrong).' },
      { t: 'code', run: true, lang: 'javascript', code: `// Simulate an API call with a Promise\nfunction fetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id <= 0) reject(new Error("Invalid ID"));\n      else resolve({ id, name: "User " + id });\n    }, 300);\n  });\n}\n\n// Using the Promise\nconsole.log("Fetching...");\nfetchUser(1)\n  .then(user => console.log("Got:", user))\n  .catch(err => console.error("Error:", err.message))\n  .finally(() => console.log("Done"));\n\n// Chaining\nfetchUser(2)\n  .then(user => fetchUser(user.id + 1))\n  .then(user => console.log("Chained:", user));` },
      {
        t: 'case',
        title: 'Case study — a GitHub user card',
        md: 'Enter a GitHub username and fetch their public profile via the GitHub API. The component handles three states: idle (no search yet), loading (spinner), loaded (display card), and error (message). Each state is a distinct UI.',
        files: {
          html: `<form id="search-form">\n  <input id="username" placeholder="GitHub username" autocomplete="off">\n  <button type="submit">Search</button>\n</form>\n<div id="result"></div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 22rem; }\nform { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\ninput { flex: 1; padding: 0.5rem 0.7rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; }\nbutton { padding: 0.5rem 0.9rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; }\n.card { display: flex; align-items: center; gap: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; }\n.card img { width: 56px; height: 56px; border-radius: 50%; }\n.error { color: #dc2626; font-size: 0.9rem; }`,
          js: `const form = document.querySelector("#search-form");\nconst result = document.querySelector("#result");\n\nform.addEventListener("submit", async (e) => {\n  e.preventDefault();\n  const username = document.querySelector("#username").value.trim();\n  if (!username) return;\n\n  result.innerHTML = "<p>Loading...</p>";\n\n  try {\n    const res = await fetch("https://api.github.com/users/" + encodeURIComponent(username));\n    if (!res.ok) throw new Error(res.status === 404 ? "User not found" : "Request failed");\n    const data = await res.json();\n\n    result.innerHTML = \`\n      <div class="card">\n        <img src="\${data.avatar_url}" alt="\${data.login}">\n        <div>\n          <strong>\${data.name || data.login}</strong><br>\n          <span style="font-size:0.85rem;color:#64748b">@\${data.login}</span><br>\n          <span style="font-size:0.82rem">\${data.public_repos} repos</span>\n        </div>\n      </div>\n    \`;\n  } catch (err) {\n    result.innerHTML = \`<p class="error">\${err.message}</p>\`;\n  }\n});`,
        },
      },
      { t: 'try', prompt: 'Write `fetchTodo(id)` that fetches from `https://jsonplaceholder.typicode.com/todos/{id}` and returns the parsed JSON. Use async/await.', lang: 'javascript', starter: `async function fetchTodo(id) {\n  \n}\n`, solution: `async function fetchTodo(id) {\n  const res = await fetch("https://jsonplaceholder.typicode.com/todos/" + id);\n  return res.json();\n}\n`, hints: ['Use await fetch(url).', 'Check res.ok before parsing.', 'Return res.json() — it returns a Promise.'], cases: [{ name: 'fetches', call: 'fetchTodo(1).then(t => t.id)', expect: '1' }] },
      { t: 'quiz', q: 'What does `fetch()` return?', options: ['The response data directly', 'A Promise that resolves to a Response object — you must call .json() or .text() to get the body', 'undefined', 'A callback function'], answer: 1, why: 'fetch returns a Promise<Response>. The Response object has status, headers, and methods like .json(), .text(), .blob() that also return Promises.' },
      {
            "t": "try",
            "prompt": "Exercise 2: Write `fetchPostTitle(id)` that fetches from `https://jsonplaceholder.typicode.com/posts/{id}` and returns the `title` field. Use async/await.\n\n`await fetchPostTitle(1)` → `\"sunt aut facere...\"` (or whatever the API returns)",
            "lang": "javascript",
            "starter": "async function fetchPostTitle(id) {\n  \n}\n",
            "solution": "async function fetchPostTitle(id) {\n  const res = await fetch(\"https://jsonplaceholder.typicode.com/posts/\" + id);\n  const data = await res.json();\n  return data.title;\n}\n",
            "hints": [
                  "await fetch(url) to get the response.",
                  "await res.json() to parse the body.",
                  "Return data.title."
            ],
            "cases": [
                  {
                        "name": "fetches title",
                        "call": "__run_async(fetchPostTitle(1))",
                        "expect": "\"sunt aut facere repellat provident occaecati excepturi optio reprehenderit\""
                  }
            ],
            "preamble": "async function __run_async(promise) {\n    return await promise;\n}\n"
      },

    ],
  },

  /* ==================================================== 17 */
  {
    id: 'web-l17',
    topic: 'javascript-async',
    difficulty: 'intermediate',
    title: 'Async/Await and Error Handling',
    minutes: 13,
    summary: 'Writing async code that reads like synchronous code, handling multiple requests, and timeout patterns.',
    objectives: ['Write async functions with await', 'Run requests in parallel with Promise.all', 'Implement a timeout'],
    blocks: [
      { t: 'text', md: '`async`/`await` is syntactic sugar over Promises. An `async` function always returns a Promise. `await` pauses execution until the Promise resolves — but does not block the main thread.\n\n```js\nasync function getUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n```\n\nFor multiple independent requests, use `Promise.all()` — they run concurrently. For a timeout, use `Promise.race()` with a timer.' },
      { t: 'code', run: true, lang: 'javascript', code: `// Parallel: fetch several things at once\nasync function fetchAll() {\n  const urls = [\n    "https://jsonplaceholder.typicode.com/posts/1",\n    "https://jsonplaceholder.typicode.com/posts/2",\n  ];\n\n  const responses = await Promise.all(urls.map(url => fetch(url)));\n  const data = await Promise.all(responses.map(r => r.json()));\n  console.log("Fetched", data.length, "posts");\n  return data;\n}\n\n// Timeout pattern\nasync function fetchWithTimeout(url, ms) {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), ms);\n  try {\n    const res = await fetch(url, { signal: controller.signal });\n    return res.json();\n  } finally {\n    clearTimeout(timer);\n  }\n}\n\nfetchAll();` },
      {
        t: 'case',
        title: 'Case study — a dashboard that loads multiple data sources',
        md: 'A dashboard needs user profile, recent orders, and notifications — three separate API calls. `Promise.all` fires them simultaneously. Each has its own loading/error state, and the dashboard renders when all are done (or shows partial results with errors).',
        files: {
          html: `<h1>Dashboard</h1>\n<div id="profile">Loading...</div>\n<div id="orders">Loading...</div>\n<div id="alerts">Loading...</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 32rem; }\nh1 { margin-bottom: 1rem; }\n.section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }\n.section h3 { margin: 0 0 0.5rem; font-size: 0.9rem; text-transform: uppercase; color: #64748b; }\n.error { color: #dc2626; }`,
          js: `async function loadDashboard() {\n  const profileEl = document.querySelector("#profile");\n  const ordersEl = document.querySelector("#orders");\n  const alertsEl = document.querySelector("#alerts");\n\n  const [profile, orders, alerts] = await Promise.allSettled([\n    fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json()),\n    fetch("https://jsonplaceholder.typicode.com/posts?userId=1").then(r => r.json()),\n    fetch("https://jsonplaceholder.typicode.com/todos?userId=1").then(r => r.json()),\n  ]);\n\n  profileEl.innerHTML = profile.status === "fulfilled"\n    ? \`<div class="section"><h3>Profile</h3>\${profile.value.name} — \${profile.value.email}</div>\`\n    : \`<div class="section error"><h3>Profile</h3>Failed to load</div>\`;\n\n  ordersEl.innerHTML = orders.status === "fulfilled"\n    ? \`<div class="section"><h3>Posts</h3>\${orders.value.length} posts</div>\`\n    : \`<div class="section error"><h3>Posts</h3>Failed to load</div>\`;\n\n  alertsEl.innerHTML = alerts.status === "fulfilled"\n    ? \`<div class="section"><h3>Todos</h3>\${alerts.value.filter(t => !t.completed).length} pending</div>\`\n    : \`<div class="section error"><h3>Todos</h3>Failed to load</div>\`;\n}\n\nloadDashboard();`,
        },
      },
      { t: 'quiz', q: 'Why use `Promise.allSettled` instead of `Promise.all` for loading dashboard sections?', options: ['It is faster', 'Promise.all fails fast — if one request fails, all results are lost. allSettled waits for every promise and reports each outcome individually, so one failure does not block the others', 'all() is deprecated', 'They are identical'], answer: 1, why: 'allSettled returns status + value/error for each promise. It never rejects — it always waits for everything. Perfect for dashboards where partial data is better than none.' },
      {
        t: 'try',
        prompt: `Write \`async function fetchPost(id)\` that fetches from \`https://jsonplaceholder.typicode.com/posts/{id}\` and returns the parsed JSON. Use async/await.

\`(await fetchPost(1)).title\` → the post title`,
        lang: 'javascript',
        starter: `async function fetchPost(id) {\n  \n}\n`,
        solution: `async function fetchPost(id) {\n  const res = await fetch("https://jsonplaceholder.typicode.com/posts/" + id);\n  return res.json();\n}\n`,
        hints: [
          'await fetch(url) to make the request.',
          'Return res.json() — it returns a Promise.',
          'The caller can await the result.',
        ],
        cases: [{ name: 'fetches', call: 'fetchPost(1).then(p => p.id)', expect: '1' }],
      },

    ],
  },

  /* ==================================================== 18 */
  {
    id: 'web-l18',
    topic: 'javascript-async',
    difficulty: 'advanced',
    title: 'Offline-First and Service Workers',
    minutes: 15,
    summary: 'The Cache API, service workers for offline support, and building a Progressive Web App that works without a network.',
    objectives: ['Explain the service worker lifecycle', 'Cache assets for offline use', 'Handle fetch events with cache-first strategy'],
    blocks: [
      { t: 'text', md: '**Service workers** are JavaScript files that run separately from your page, intercepting network requests. They enable offline support, background sync and push notifications.\n\nThe lifecycle: register → install (cache assets) → activate (clean old caches) → fetch (serve from cache or network).\n\n```js\n// In your page:\nnavigator.serviceWorker.register("/sw.js");\n\n// In sw.js:\nself.addEventListener("fetch", (event) => {\n  event.respondWith(\n    caches.match(event.request).then(cached => cached || fetch(event.request))\n  );\n});\n```' },
      {
        t: 'case',
        title: 'Case study — a notes app that works offline',
        md: 'Store notes in localStorage and register a service worker to serve the app shell from cache. When offline, the app still loads and shows previously saved notes. The "cache falling back to network" strategy ensures fast loads on repeat visits.',
        files: {
          html: `<h2>Offline Notes</h2>\n<form id="note-form">\n  <textarea id="note-input" rows="3" placeholder="Write a note..."></textarea>\n  <button type="submit">Save note</button>\n</form>\n<ul id="notes-list"></ul>\n<p id="status"></p>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 30rem; }\nform { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }\ntextarea { padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font: inherit; resize: vertical; }\nbutton { align-self: flex-start; padding: 0.5rem 1rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; }\nli { padding: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; }\nli .time { font-size: 0.75rem; color: #94a3b8; }\n#status { font-size: 0.85rem; color: #64748b; }`,
          js: `const STORAGE_KEY = "offline-notes";\n\nfunction getNotes() {\n  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");\n}\n\nfunction saveNotes(notes) {\n  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));\n}\n\nfunction render() {\n  const notes = getNotes();\n  const list = document.querySelector("#notes-list");\n  list.innerHTML = notes.map((n, i) => \`\n    <li>\n      <span>\${n.text}<br><span class="time">\${new Date(n.at).toLocaleString()}</span></span>\n      <button data-index="\${i}" class="del" style="background:none;color:#dc2626;border:none;cursor:pointer">x</button>\n    </li>\n  \`).join("");\n\n  const status = document.querySelector("#status");\n  status.textContent = navigator.onLine\n    ? "You are online"\n    : "You are offline — notes saved locally";\n}\n\ndocument.querySelector("#note-form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const text = document.querySelector("#note-input").value.trim();\n  if (!text) return;\n  const notes = getNotes();\n  notes.unshift({ text, at: Date.now() });\n  saveNotes(notes);\n  document.querySelector("#note-input").value = "";\n  render();\n});\n\ndocument.querySelector("#notes-list").addEventListener("click", (e) => {\n  const btn = e.target.closest(".del");\n  if (!btn) return;\n  const notes = getNotes();\n  notes.splice(Number(btn.dataset.index), 1);\n  saveNotes(notes);\n  render();\n});\n\nwindow.addEventListener("online", render);\nwindow.addEventListener("offline", render);\nrender();`,
        },
      },
      { t: 'quiz', q: 'What is the main purpose of a service worker?', options: ['To speed up CSS', 'To act as a programmable network proxy — intercepting requests, caching responses, and enabling offline functionality', 'To replace JavaScript', 'To manage cookies'], answer: 1, why: 'Service workers sit between the page and the network. They can serve cached content when offline, enable background sync, and handle push notifications — all without a server.' },

    ],
  },

  /* ==================================================== 19 */
  {
    id: 'web-l19',
    topic: 'accessibility',
    difficulty: 'beginner',
    title: 'Semantic HTML and ARIA Basics',
    minutes: 11,
    summary: 'Writing HTML that works for everyone — semantic elements, alt text, and when ARIA is actually needed.',
    objectives: ['Use semantic HTML elements correctly', 'Write meaningful alt text', 'Apply ARIA labels when HTML falls short'],
    blocks: [
      { t: 'text', md: '**Accessibility (a11y)** means your site works for people using screen readers, keyboards, voice control and other assistive technologies. The first rule of accessibility: **use the right HTML element**. A `<button>` is focusable and clickable by default. A `<div onclick="...">` is invisible to assistive tech.\n\nSemantic HTML covers 80% of accessibility. The remaining 20% is ARIA — attributes that supplement semantics when HTML falls short.' },
      { t: 'web', md: 'A properly labelled interactive component. The screen reader announces: "Volume slider, 50". The live region updates automatically when the text changes.', files: { html: `<main>\n  <h1>Player</h1>\n\n  <label for="volume">Volume</label>\n  <input id="volume" type="range" min="0" max="100" value="50"\n         aria-valuetext="50 percent">\n\n  <p>Now playing: <span id="track-name" aria-live="polite">Nothing</span></p>\n\n  <button id="play" aria-label="Play track">&#9654;</button>\n  <button id="pause" aria-label="Pause track">&#9646;&#9646;</button>\n\n  <nav aria-label="Main navigation">\n    <ul><li><a href="#home">Home</a></li><li><a href="#library">Library</a></li></ul>\n  </nav>\n</main>`, css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; max-width: 22rem; }\nlabel { display: block; font-size: 0.85rem; font-weight: 600; margin: 1rem 0 0.25rem; }\ninput[type=range] { width: 100%; }\nbutton { padding: 0.4rem 0.8rem; border: 1px solid #d1d5db; background: #fff; border-radius: 6px; cursor: pointer; font-size: 1rem; }\nnav ul { display: flex; gap: 1rem; list-style: none; padding: 0; margin-top: 1.5rem; }\nnav a { color: #3b82f6; }`, js: `document.querySelector("#volume").addEventListener("input", e => {\n  e.target.setAttribute("aria-valuetext", e.target.value + " percent");\n});\ndocument.querySelector("#play").addEventListener("click", () => {\n  document.querySelector("#track-name").textContent = "Symphony No. 5 — Beethoven";\n});` },
      },
      {
        t: 'case',
        title: 'Case study — an accessible toggle switch',
        md: 'A custom toggle switch built from a checkbox — the right HTML element. The visual design is all CSS; the semantics (focusable, checkable, form-submittable) come from the native checkbox. ARIA is only used to label it, because the native checkbox already handles the rest.',
        files: {
          html: `<label class="toggle">\n  <span class="toggle-label">Email notifications</span>\n  <input type="checkbox" class="toggle-input" aria-label="Email notifications">\n  <span class="toggle-switch"></span>\n</label>\n\n<label class="toggle">\n  <span class="toggle-label">Dark mode</span>\n  <input type="checkbox" class="toggle-input" checked>\n  <span class="toggle-switch"></span>\n</label>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; }\n\n.toggle {\n  display: flex; align-items: center; gap: 0.75rem;\n  cursor: pointer; margin-bottom: 1rem;\n}\n\n.toggle-input {\n  position: absolute; opacity: 0; width: 0; height: 0;\n}\n\n.toggle-switch {\n  width: 44px; height: 24px; background: #d1d5db;\n  border-radius: 12px; position: relative; transition: background 150ms;\n  flex-shrink: 0;\n}\n\n.toggle-switch::after {\n  content: ""; position: absolute;\n  width: 20px; height: 20px; background: #fff;\n  border-radius: 50%; top: 2px; left: 2px;\n  transition: transform 150ms;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n}\n\n.toggle-input:checked + .toggle-switch { background: #16a34a; }\n.toggle-input:checked + .toggle-switch::after { transform: translateX(20px); }\n\n.toggle-input:focus-visible + .toggle-switch {\n  outline: 2px solid #3b82f6; outline-offset: 2px;\n}`,
          js: ``,
        },
      },
      { t: 'quiz', q: 'When should you use an ARIA role instead of a native HTML element?', options: ['Always — ARIA is better', 'Only when no native HTML element conveys the right semantics. A `<button>` is always better than `<div role="button">` — use native elements first', 'ARIA replaces HTML', 'Never — ARIA is deprecated'], answer: 1, why: 'The first rule of ARIA: do not use it if native HTML works. Native elements have built-in keyboard handling, focus management and screen-reader announcements that you would have to rebuild from scratch with ARIA.' },
      {
        t: 'tryweb',
        prompt: 'Add an `aria-label="Search"` to the button so screen readers announce its purpose. The button has no visible text — only an icon character.',
        files: { html: `<form>\n  <input type="search" placeholder="Search...">\n  <button type="submit">\u{1F50D}</button>\n</form>`, css: '', js: `` },
        solution: { html: `<form>\n  <input type="search" placeholder="Search...">\n  <button type="submit" aria-label="Search">\u{1F50D}</button>\n</form>`, css: '', js: `` },
        hints: ['Add aria-label="Search" to the button element.', 'aria-label provides a text alternative for the icon.', 'Screen readers will announce "Search button" instead of the symbol.'],
        checks: [
          { name: 'button has aria-label', code: `return doc.querySelector('button').getAttribute('aria-label') === 'Search';` },
        ],
      },

    ],
  },

  /* ==================================================== 20 */
  {
    id: 'web-l20',
    topic: 'accessibility',
    difficulty: 'intermediate',
    title: 'Keyboard Navigation and Focus',
    minutes: 13,
    summary: 'Making every interactive element reachable by keyboard, managing focus order, and focus trapping in modals.',
    objectives: ['Ensure all controls are keyboard-accessible', 'Manage focus order with tabindex', 'Trap focus inside a modal dialog'],
    blocks: [
      { t: 'text', md: 'Every interactive element must be reachable and operable with a keyboard. Native interactive elements (`<button>`, `<input>`, `<a href="...">`, `<select>`) get this for free. Custom widgets need manual focus management.\n\n**Focus trapping** keeps keyboard focus inside a modal or dialog — pressing Tab at the last element wraps back to the first. Without it, focus escapes to the background page, which screen-reader users cannot see because the modal overlay hides it.' },
      {
        t: 'web',
        md: 'Open the dialog with Enter/Space on the button. Tab through its elements — focus wraps inside. Press Escape to close. Focus returns to the button that opened it.',
        files: {
          html: `<button id="open-dialog">Open dialog</button>\n\n<div id="dialog" role="dialog" aria-labelledby="dlg-title" hidden>\n  <div class="dialog-panel">\n    <h2 id="dlg-title">Confirm deletion</h2>\n    <p>Are you sure? This cannot be undone.</p>\n    <button id="cancel-btn">Cancel</button>\n    <button id="confirm-btn">Delete</button>\n  </div>\n</div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; }\n\n#dialog { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; }\n\n.dialog-panel {\n  background: #fff; border-radius: 12px; padding: 1.5rem;\n  max-width: 24rem; width: 90%;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.2);\n}\n\n.dialog-panel h2 { margin: 0 0 0.5rem; }\n.dialog-panel p { margin: 0 0 1rem; color: #475569; }\n.dialog-panel button { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; font: inherit; margin-right: 0.5rem; }\n#confirm-btn { background: #dc2626; color: #fff; border-color: #dc2626; }`,
          js: `const dialog = document.querySelector("#dialog");\nconst openBtn = document.querySelector("#open-dialog");\nconst cancelBtn = document.querySelector("#cancel-btn");\nconst confirmBtn = document.querySelector("#confirm-btn");\n\nfunction getFocusable() {\n  return [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]\n    .filter(el => !el.disabled && el.offsetParent !== null);\n}\n\nfunction trapFocus(e) {\n  const focusable = getFocusable();\n  if (!focusable.length) return;\n  const first = focusable[0];\n  const last = focusable[focusable.length - 1];\n\n  if (e.key === "Tab") {\n    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }\n    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }\n  }\n}\n\nopenBtn.addEventListener("click", () => {\n  dialog.hidden = false;\n  getFocusable()[0]?.focus();\n  dialog.addEventListener("keydown", trapFocus);\n});\n\nfunction close() {\n  dialog.hidden = true;\n  dialog.removeEventListener("keydown", trapFocus);\n  openBtn.focus();\n}\n\ncancelBtn.addEventListener("click", close);\nconfirmBtn.addEventListener("click", close);\n\ndialog.addEventListener("keydown", (e) => {\n  if (e.key === "Escape") close();\n});`,
        },
      },
      {
        t: 'case',
        title: 'Case study — a skip-to-content link',
        md: 'A visually hidden link at the top of the page that becomes visible on focus. Keyboard users press Tab on page load, see "Skip to main content", and press Enter to jump past the navigation. This is the simplest, highest-impact accessibility improvement you can make.',
        files: {
          html: `<a href="#main" class="skip-link">Skip to main content</a>\n\n<header>\n  <nav>\n    <ul class="nav-links">\n      <li><a href="#">Home</a></li>\n      <li><a href="#">About</a></li>\n      <li><a href="#">Services</a></li>\n      <li><a href="#">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n\n<main id="main">\n  <h1>Main content</h1>\n  <p>This is where the real content starts. A keyboard user can jump here with one Tab + Enter, bypassing the navigation above.</p>\n</main>`,
          css: `body { font-family: system-ui, sans-serif; margin: 0; }\n\n.skip-link {\n  position: absolute; top: -100px; left: 0;\n  background: #111; color: #fff;\n  padding: 0.75rem 1.25rem;\n  z-index: 1000;\n  font-weight: 600;\n  transition: top 150ms;\n}\n\n.skip-link:focus {\n  top: 0;\n}\n\nheader { background: #1e293b; padding: 1rem 1.5rem; }\n\n.nav-links { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }\n.nav-links a { color: #cbd5e1; text-decoration: none; }\n.nav-links a:hover { color: #fff; }\n\nmain { padding: 2rem; max-width: 36rem; }`,
          js: ``,
        },
      },
      { t: 'quiz', q: 'Why is focus trapping important in modals?', options: ['It looks better', 'Without it, a keyboard user can Tab past the end of the modal and interact with the (hidden) background page. Focus trapping keeps them inside the dialog until they dismiss it', 'It is required by law', 'Modals are always modal'], answer: 1, why: 'A modal overlay visually hides the background, but unless focus is trapped, keyboard and screen-reader users can still interact with background elements they cannot see.' },
      {
        t: 'tryweb',
        prompt: 'Add a `tabindex="0"` to the `<div class="card">` so it is reachable via keyboard navigation. Without it, a `<div>` is not focusable by default.',
        files: { html: `<div class="card" role="button">Clickable card</div>`, css: `.card { padding: 1rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; }`, js: `` },
        solution: { html: `<div class="card" role="button" tabindex="0">Clickable card</div>`, css: `.card { padding: 1rem; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; }`, js: `` },
        hints: ['Add tabindex="0" to the div.', 'tabindex="0" adds the element to the natural tab order.', 'Combined with role="button", it behaves like a button for keyboard users.'],
        checks: [
          { name: 'card has tabindex', code: `return doc.querySelector('.card').getAttribute('tabindex') === '0';` },
        ],
      },

    ],
  },

  /* ==================================================== 21 */
  {
    id: 'web-l21',
    topic: 'css-layout',
    difficulty: 'advanced',
    title: 'Container Queries and Modern Layout',
    minutes: 14,
    summary: 'Container queries — responsive design based on a parent\'s size, not the viewport. Plus subgrid and the :has() selector.',
    objectives: ['Use container queries for component-level responsiveness', 'Understand @container syntax', 'Apply :has() for parent-aware styling'],
    blocks: [
      { t: 'text', md: 'Media queries respond to the **viewport** size. **Container queries** respond to a **parent element\'s** size — enabling truly reusable components that adapt to whatever container they are placed in.\n\n```css\n.card-wrapper {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: auto 1fr;\n  }\n}\n```\n\nThis means a card can be in a sidebar (narrow → stacked layout) and then moved to the main content area (wide → side-by-side layout) without changing a single class.' },
      {
        t: 'web',
        md: 'Resize the preview — the cards change layout based on their container width, not the viewport. Each card row is a container; the card inside adapts.',
        files: {
          html: `<h2>Container queries demo</h2>\n\n<div class="row"><div class="card-wrap"><div class="card"><h3>Card A</h3><p>Wide container — horizontal layout.</p></div></div></div>\n\n<div class="cols"><div class="card-wrap narrow"><div class="card"><h3>Card B</h3><p>Narrow — stacked.</p></div></div>\n<div class="card-wrap narrow"><div class="card"><h3>Card C</h3><p>Narrow — stacked.</p></div></div></div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n.row { margin-bottom: 1rem; }\n.card-wrap { container-type: inline-size; }\n.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }\n\n.card {\n  background: #f8fafc;\n  border: 1px solid #d1d5db;\n  border-radius: 10px;\n  padding: 1rem;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: 80px 1fr;\n    gap: 1rem;\n    align-items: center;\n  }\n}`,
          js: ``,
        },
      },
      {
        t: 'case',
        title: 'Case study — a reusable media object component',
        md: 'A "media object" (image + text) that adapts its layout based on the available width. In a wide container it shows the image on the left; in a narrow container (like a sidebar) the image stacks on top. Same component, same HTML, responsive via container queries.',
        files: {
          html: `<h3>Wide context</h3>\n<div class="wide"><div class="media-wrap"><div class="media"><div class="media-img">IMG</div><div class="media-body"><strong>Article title</strong><p>A short description of the article content that expands to fill the space.</p></div></div></div></div>\n\n<h3>Narrow context (simulated sidebar)</h3>\n<div class="narrow"><div class="media-wrap"><div class="media"><div class="media-img">IMG</div><div class="media-body"><strong>Article title</strong><p>Same component, same markup — different container width.</p></div></div></div></div>`,
          css: `body { font-family: system-ui, sans-serif; padding: 1.5rem; }\n\n.wide { max-width: 500px; margin-bottom: 2rem; }\n.narrow { max-width: 220px; }\n\n.media-wrap { container-type: inline-size; }\n\n.media-img {\n  background: #dbeafe; border-radius: 8px;\n  display: grid; place-items: center;\n  font-weight: 700; color: #1e40af;\n}\n\n.media-body strong { display: block; }\n.media-body p { margin: 0.25rem 0 0; font-size: 0.9rem; color: #475569; }\n\n@container (min-width: 300px) {\n  .media {\n    display: grid;\n    grid-template-columns: 80px 1fr;\n    gap: 1rem;\n    align-items: start;\n  }\n  .media-img { min-height: 60px; }\n}\n\n@container (max-width: 299px) {\n  .media-img { height: 60px; margin-bottom: 0.5rem; }\n}`,
          js: ``,
        },
      },
      { t: 'quiz', q: 'How do container queries differ from media queries?', options: ['They are the same', 'Media queries respond to the viewport. Container queries respond to a parent element\'s size — enabling components that adapt to their context, not just the screen', 'Container queries replace media queries entirely', 'Media queries are for print only'], answer: 1, why: 'Container queries enable component-level responsiveness. A card can change its layout based on whether it is in a wide main column or a narrow sidebar — independent of the viewport.' },
      {
            "t": "tryweb",
            "prompt": "Exercise 1: Make `.row` a flex container with its three items spaced evenly across the row. Use `display: flex`, `justify-content: space-evenly`, and `gap: 1rem`.",
            "files": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  /* your flex styles here */\n}",
                  "js": ""
            },
            "solution": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  display: flex;\n  justify-content: space-evenly;\n  gap: 1rem;\n}",
                  "js": ""
            },
            "hints": [
                  "display: flex; turns on flexbox.",
                  "justify-content: space-evenly; distributes items evenly.",
                  "gap: 1rem; adds space between them."
            ],
            "checks": [
                  {
                        "name": "is flex",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).display === 'flex';"
                  },
                  {
                        "name": "items spaced",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).justifyContent === 'space-evenly';"
                  }
            ]
      },

      {
            "t": "tryweb",
            "prompt": "Exercise 2: Make `.row` a flex container with its three items spaced evenly across the row. Use `display: flex`, `justify-content: space-evenly`, and `gap: 1rem`.",
            "files": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  /* your flex styles here */\n}",
                  "js": ""
            },
            "solution": {
                  "html": "<div class=\"row\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>",
                  "css": ".row {\n  display: flex;\n  justify-content: space-evenly;\n  gap: 1rem;\n}",
                  "js": ""
            },
            "hints": [
                  "display: flex; turns on flexbox.",
                  "justify-content: space-evenly; distributes items evenly.",
                  "gap: 1rem; adds space between them."
            ],
            "checks": [
                  {
                        "name": "is flex",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).display === 'flex';"
                  },
                  {
                        "name": "items spaced",
                        "code": "return win.getComputedStyle(doc.querySelector('.row')).justifyContent === 'space-evenly';"
                  }
            ]
      },

    ],
  },

  /* ==================================================== 22 */
  {
    id: 'web-l22',
    topic: 'accessibility',
    difficulty: 'advanced',
    title: 'Screen Reader Testing and WCAG',
    minutes: 15,
    summary: 'Testing with screen readers, understanding WCAG conformance levels, and building an accessibility audit workflow.',
    objectives: ['Test a page with a screen reader', 'Explain WCAG levels A, AA, AAA', 'Build an accessibility checklist'],
    blocks: [
      { t: 'text', md: '**WCAG** (Web Content Accessibility Guidelines) defines three conformance levels:\n- **A** — minimum; bare essentials (keyboard access, alt text, labels)\n- **AA** — the legal standard most sites target (colour contrast 4.5:1, focus visible, error suggestions)\n- **AAA** — the highest standard (contrast 7:1, sign language for video, no time limits)\n\nTesting with a real screen reader (VoiceOver on Mac, NVDA on Windows) is the only way to know if your site actually works for assistive-tech users.' },
      {
        t: 'case',
        title: 'Case study — an accessibility audit of a component',
        md: 'A component with common issues and their fixes. Run through each issue — missing labels, low contrast, missing focus indicators, non-descriptive link text. The fixes are shown inline. This is the checklist you apply to every component you build.',
        files: {
          html: `<h2>Before audit</h2>\n\n<!-- Issue: no label -->\n<input type="text" placeholder="Search...">\n\n<!-- Issue: low contrast text -->\n<p style="color:#94a3b8">This text has low contrast on white.</p>\n\n<!-- Issue: link text is not descriptive -->\n<p>Click <a href="#">here</a> to read the report.</p>\n\n<!-- Issue: div used as button, not keyboard accessible -->\n<div class="fake-btn" onclick="alert('clicked')">Click me</div>\n\n<h2 style="margin-top:2rem">After audit</h2>\n\n<label for="search">Search</label>\n<input id="search" type="text">\n\n<p style="color:#334155">This text has sufficient contrast.</p>\n\n<p>Read the <a href="#">annual report</a>.</p>\n\n<button onclick="alert('clicked')">Click me</button>`,
          css: `body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 30rem; line-height: 1.7; }\nh2 { font-size: 1.1rem; color: #64748b; margin: 1.5rem 0 0.75rem; }\nlabel { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }\ninput { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; width: 100%; }\np { margin: 0.5rem 0; }\n.fake-btn { display: inline-block; padding: 0.5rem 1rem; background: #e2e8f0; border-radius: 6px; cursor: pointer; }\nbutton { padding: 0.5rem 1rem; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; font: inherit; }`,
          js: ``,
        },
      },
      { t: 'quiz', q: 'What is the target contrast ratio for normal text at WCAG AA level?', options: ['3:1', '4.5:1', '7:1', '10:1'], answer: 1, why: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18px+ bold or 24px+ regular). AAA requires 7:1 and 4.5:1 respectively.' },
      {
            "t": "tryweb",
            "prompt": "Exercise 1: Add an `alt` attribute to the image describing what it shows, and wrap the input in a `<label>` with a matching `for`/ `id` pair. The label text should be \"Email\".",
            "files": {
                  "html": "<img src=\"cat.jpg\">\n<input type=\"email\" id=\"email-input\">",
                  "css": "",
                  "js": ""
            },
            "solution": {
                  "html": "<img src=\"cat.jpg\" alt=\"A ginger cat sleeping on a keyboard\">\n<label for=\"email-input\">Email</label>\n<input type=\"email\" id=\"email-input\">",
                  "css": "",
                  "js": ""
            },
            "hints": [
                  "Add alt=\"description\" to the img tag.",
                  "Add <label for=\"email-input\">Email</label> before the input.",
                  "The for of the label must match the id of the input."
            ],
            "checks": [
                  {
                        "name": "img has alt",
                        "code": "return doc.querySelector('img').hasAttribute('alt') && doc.querySelector('img').getAttribute('alt').length > 0;"
                  },
                  {
                        "name": "has label for input",
                        "code": "return !!doc.querySelector('label[for=\"email-input\"]');"
                  }
            ]
      },

      {
            "t": "tryweb",
            "prompt": "Exercise 2: Add an `alt` attribute to the image describing what it shows, and wrap the input in a `<label>` with a matching `for`/ `id` pair. The label text should be \"Email\".",
            "files": {
                  "html": "<img src=\"cat.jpg\">\n<input type=\"email\" id=\"email-input\">",
                  "css": "",
                  "js": ""
            },
            "solution": {
                  "html": "<img src=\"cat.jpg\" alt=\"A ginger cat sleeping on a keyboard\">\n<label for=\"email-input\">Email</label>\n<input type=\"email\" id=\"email-input\">",
                  "css": "",
                  "js": ""
            },
            "hints": [
                  "Add alt=\"description\" to the img tag.",
                  "Add <label for=\"email-input\">Email</label> before the input.",
                  "The for of the label must match the id of the input."
            ],
            "checks": [
                  {
                        "name": "img has alt",
                        "code": "return doc.querySelector('img').hasAttribute('alt') && doc.querySelector('img').getAttribute('alt').length > 0;"
                  },
                  {
                        "name": "has label for input",
                        "code": "return !!doc.querySelector('label[for=\"email-input\"]');"
                  }
            ]
      },

    ],
  },

];
